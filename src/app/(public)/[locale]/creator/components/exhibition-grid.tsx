import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { getExhibitions } from '@/service/exhibition';
import { getCurrentUser } from '@/lib/session';
import { Exhibition } from '@/types/exhibition';
// Change the import
import { getTranslations } from 'next-intl/server'; // Or potentially just 'next-intl'

export default async function ExhibitionGrid( { locale }: { locale: string }) {
  // Use await getTranslations instead of the hook
  const t = await getTranslations({ locale, namespace: 'exhibitions' });

  const user = await getCurrentUser();
  if (!user) {
    // Consider redirecting or showing a more specific message
    // Using translations here is fine now
    return <div>{t('please_login')}</div>;
  }

  // Fetch data *after* getting translations and checking user
  // (Order doesn't strictly matter here unless getExhibitions depends on t, but it's good practice)
  let exhibitions: Exhibition[] = [];
  try {
    const exhibitionsResponse = await getExhibitions(user.accessToken);
    exhibitions = exhibitionsResponse.data?.exhibitions ?? [];
  } catch (error) {
    console.error("Failed to fetch exhibitions:", error);
    // Optionally return an error state UI
    return <div>{t('error_loading_exhibitions')}</div>; // Add this key to your translation file
  }


  const getLocalizedContent = (exhibition: Exhibition) => {
    // First try to find content in current locale
    const localContent = exhibition.contents.find(
      content => content.languageCode === locale
    );

    // If not found, fallback to default language
    if (!localContent) {
      const defaultLang = exhibition.languageOptions.find(lang => lang.isDefault);
      // Add optional chaining for safety in case defaultLang or its code is undefined
      return exhibition.contents.find(
        content => content.languageCode === defaultLang?.code
      );
    }

    return localContent;
  };

  // Handle case where there are no exhibitions
  if (exhibitions.length === 0) {
     return <div>{t('no_exhibitions_found')}</div>; // Add this key to your translation file
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exhibitions.map((exhibition) => {
        const content = getLocalizedContent(exhibition);

        // Determine the image source safely
        const imageSrc = exhibition.welcomeImage || exhibition.gallery?.previewImage; // Optional chaining for gallery
        const altText = content?.name || t('untitled_exhibition');

        return (
          <Link
            key={exhibition._id}
            href={`/${locale}/creator/${exhibition._id}/artworks`}
            className="block"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
              {imageSrc ? (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={imageSrc}
                      alt={altText}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority={exhibitions.indexOf(exhibition) < 3} // Prioritize loading images for the first few cards
                    />
                  </div>
                ) : (
                  <div className="relative aspect-video w-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">{t('no_image')}</span> {/* Add translation */}
                  </div>
                )
              }
              <div className="p-4 flex-grow"> {/* Use flex-grow to push content down if card height varies */}
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold">
                    {content?.name || t('untitled_exhibition')}
                  </h2>
                </div>
                <div className="text-sm text-muted-foreground space-y-1"> {/* Add spacing */}
                  <p>{t('artwork_count', { count: exhibition.artworkPositions?.length ?? 0 })}</p> {/* Optional chaining and fallback */}
                  {exhibition.startDate && ( // Check if startDate exists before rendering
                    <p>
                      {t('start_date')}:{' '}
                      {new Date(exhibition.startDate).toLocaleDateString(locale, { // Add options for better formatting
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}