'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useArtModal } from '@/hooks/useArtModal';
import { Artwork } from '@/types/marketplace.d';
import { vietnamCurrency } from '@/utils/converters';
import Image from 'next/image';
import React, { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
// import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

interface ArtCardProps {
	data: Artwork;
	width: number;
	index: number;
}

const ArtCard: React.FC<ArtCardProps> = ({ data, width, index }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const { setSelected } = useArtModal();
	const t = useTranslations();

	// Calculate scaled height based on original aspect ratio and new width
	const scaledHeight = useMemo(
		() => Math.round((width * data.dimensions.height) / data.dimensions.width),
		[width, data.dimensions.height, data.dimensions.width]
	);

	const handleImageError = useCallback(() => {
		setIsLoading(false);
		setHasError(true);
	}, []);

	const handleImageLoad = useCallback(() => {
		setIsLoading(false);
	}, []);

	// Determine artwork status with translations
	const artworkStatus = useMemo(() => {
		if (data.status === 'sold') return { label: t('artcard.sold'), color: 'bg-red-500' };
		if (data.status === 'display') return { label: t('artcard.display_only'), color: 'bg-blue-500' };
		if (data.price === 0) return { label: t('artcard.not_for_sale'), color: 'bg-yellow-500' };
		return null;
	}, [data.status, data.price, t]);

	return (
		<div
			className="relative overflow-hidden rounded-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow transition-shadow duration-200 ease-in-out"
			style={{
				width,
				height: scaledHeight
			}}
			role="button"
			tabIndex={0}
			aria-label={t('artcard.view_artwork_details', { title: data.title })}
			onClick={() => {
				setSelected(data);
				router.push(`${pathname}?id=${data._id}`);
			}}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					setSelected(data);
					router.push(`${pathname}?id=${data._id}`);
				}
			}}
		>
			<div className="flex flex-col w-full h-full">
				<div
					className="relative w-full overflow-hidden"
					style={{ height: `${scaledHeight - 65}px` }}
				>
					{isLoading && (
						<Skeleton className="absolute inset-0 w-full h-full bg-gray-200 dark:bg-gray-700" />
					)}

					<Image
						src={data.url}
						alt={data.title}
						fill
						sizes={`(max-width: 768px) 100vw, ${width}px`}
						className={`object-cover transition-transform duration-300 hover:scale-102 ${hasError ? 'hidden' : ''}`}
						priority={index < 4}
						quality={85}
						onLoad={handleImageLoad}
						onError={handleImageError}
					/>

					{/* Status indicator */}
					{/* {artworkStatus && (
						<div className="absolute top-2 left-2 z-10">
							<Badge className={`${artworkStatus.color} text-white text-xs font-semibold px-2.5 py-0.5 rounded-sm shadow-sm`}>
								{artworkStatus.label}
							</Badge>
						</div>
					)} */}

					{/* Categories - show max 2 */}
					{/* {data.category && data.category.length > 0 && (
						<div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5 max-w-[95%]">
							{data.category.slice(0, 2).map((category, idx) => (
								<Badge 
									key={idx} 
									variant="outline" 
									className="bg-black/40 backdrop-blur-sm text-white border-0 text-[10px] font-medium px-2 py-0.5 rounded-sm"
								>
									{category}
								</Badge>
							))}
						</div>
					)} */}
				</div>

				<div className="p-2.5 flex flex-col">
					<div className="flex justify-between items-start">
						<div className="flex-1 min-w-0">
							<h3 className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">
								{data.title}
							</h3>

							{data.artistId && (
								<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
									{data.artistId.name}
								</p>
							)}
						</div>

						{!artworkStatus || (data.status !== 'display' && data.price > 0) ? (
							<span className="text-xs font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap ml-2">
                {vietnamCurrency(data.price)}
              </span>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
};

export default React.memo(ArtCard);