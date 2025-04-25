import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { getLocalizedContent } from '@/lib/utils';
import { PublicExhibition } from '@/types/exhibition';
import { NavigationButtons } from './navigation-button';

interface ExhibitionSectionProps {
    title: string;
    exhibitions: PublicExhibition[];
}

export function ExhibitionSection({ title, exhibitions }: ExhibitionSectionProps) {
    if (!exhibitions?.length) return null;
    const scrollContainerId = `exhibition-scroll-${title.replace(/\s+/g, '-')}`;

    return (
        <section className="mb-24">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-8">{title}</h2>
            </div>
            <div className="relative group">
                <div className="overflow-hidden no-scrollbar">
                    <div className="flex gap-6 px-4 md:px-8 min-w-full">
                        {exhibitions.map((exhibition) => (
                            <ExhibitionCard key={exhibition._id} exhibition={exhibition} />
                        ))}
                    </div>
                </div>
                <NavigationButtons scrollContainerId={scrollContainerId} />
            </div>
        </section>
    );
}

interface ExhibitionCardProps {
    exhibition: PublicExhibition;
}

function ExhibitionCard({ exhibition }: ExhibitionCardProps) {
    const locale = useLocale();
    const localizedContent = getLocalizedContent(exhibition, locale);

    // Get default language content if current language is not available
    const defaultContent = exhibition.contents.find(
        content => exhibition.languageOptions.find(
            lang => lang.code === content.languageCode && lang.isDefault
        )
    );

    // Use localized content or fall back to default
    const content = localizedContent || defaultContent || exhibition.contents[0];

    if (!content) return null;

    return (
        <Link
            href={`/exhibitions/${exhibition.linkName}`}
            className="min-w-[250px] md:min-w-[300px]"
        >
            <div className="flex flex-col bg-white rounded-3xl overflow-hidden 
                    shadow hover:shadow-md transition-shadow duration-300">
                <div className="relative aspect-[3/2]">
                    <Image
                        src={exhibition.welcomeImage || '/images/placeholder-exhibition.jpg'}
                        alt={content.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <div className="p-3 flex flex-col gap-1.5">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {content.name}
                    </h3>
                    <p className="text-xs text-gray-600">
                        {exhibition.author?.name ? `By ${exhibition.author.name}` : ''}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                        {content.description}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-400">
                            {new Date(exhibition.startDate).toLocaleDateString(locale)} -
                            {new Date(exhibition.endDate).toLocaleDateString(locale)}
                        </p>
                        {exhibition.ticket?.requiresPayment && (
                            <p className="text-xs font-medium text-primary">
                                {new Intl.NumberFormat(locale, {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(exhibition.ticket.price)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
