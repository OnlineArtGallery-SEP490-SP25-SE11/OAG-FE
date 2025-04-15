import { Card } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import Link from 'next/link';
import { Exhibition } from '@/types/exhibition';
import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';

interface ExhibitionCardProps {
  exhibition: Exhibition;
  locale: string;
}

export default async function ExhibitionCard({ exhibition, locale }: ExhibitionCardProps) {
  const t = await getTranslations({ locale, namespace: 'exhibitions' });

  const getLocalizedContent = (exhibition: Exhibition) => {
    const localContent = exhibition.contents.find(
      content => content.languageCode === locale
    );

    if (!localContent) {
      const defaultLang = exhibition.languageOptions.find(lang => lang.isDefault);
      return exhibition.contents.find(
        content => content.languageCode === defaultLang?.code
      );
    }

    return localContent;
  };

  const content = getLocalizedContent(exhibition);
  const imageSrc = exhibition.welcomeImage || exhibition.gallery?.previewImage;
  const altText = content?.name || t('untitled_exhibition');

  return (
    <Link href={`/creator/${exhibition._id}/artworks`} className="block group">
      <Card className="overflow-hidden h-full flex flex-col relative">
        <div className="relative">
          {imageSrc ? (
            <div className="relative aspect-video w-full">
              <Image
                src={imageSrc}
                alt={altText}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={false}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-white/90 transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out" />
              </div>
            </div>
          ) : (
            <div className="relative aspect-video w-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">{t('no_image')}</span>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-white/90 transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out" />
              </div>
            </div>
          )}
        </div>
        <div className="p-4 flex-grow">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">
              {content?.name || t('untitled_exhibition')}
            </h2>
            <Badge variant="secondary">
              {t(`status.${exhibition.status}`)}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{t('artwork_count', { count: exhibition.artworkPositions?.length ?? 0 })}</p>
            {exhibition.startDate && (
              <p>
                {t('start_date')}:{' '}
                {new Date(exhibition.startDate).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}