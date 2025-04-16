'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useArtModal } from '@/hooks/useArtModal';
import { Artwork } from '@/types/marketplace.d';
import { vietnamCurrency } from '@/utils/converters';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

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

	// Determine artwork status
	const artworkStatus = useMemo(() => {
		if (data.status === 'sold') return { label: 'Sold', color: 'bg-red-500' };
		if (data.status === 'display') return { label: 'Display Only', color: 'bg-blue-500' };
		if (data.price === 0) return { label: 'Not For Sale', color: 'bg-yellow-500' };
		return null;
	}, [data.status, data.price]);

	return (
		<motion.div
			className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800"
			style={{
				width,
				height: scaledHeight
			}}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
			role="button"
			tabIndex={0}
			aria-label={`View ${data.title} artwork details`}
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
					className="relative w-full"
					style={{ height: `${scaledHeight - 60}px` }}
				>
					{isLoading && (
						<Skeleton className="absolute inset-0 w-full h-full bg-gray-200 dark:bg-gray-700" />
					)}

					<Image
						src={data.url}
						alt={data.title}
						fill
						sizes={`(max-width: 768px) 100vw, ${width}px`}
						className={`object-cover ${hasError ? 'hidden' : ''}`}
						priority={index < 4}
						quality={80}
						onLoad={handleImageLoad}
						onError={handleImageError}
					/>

					{/* Status indicator */}
					{artworkStatus && (
						<div className="absolute top-2 left-2 z-10">
							<Badge className={`${artworkStatus.color} text-white text-xs font-medium px-2 py-0.5`}>
								{artworkStatus.label}
							</Badge>
						</div>
					)}

					{/* Categories - show max 2 */}
					{data.category && data.category.length > 0 && (
						<div className="absolute bottom-2 left-2 flex flex-wrap gap-1 max-w-[90%]">
							{data.category.slice(0, 2).map((category, idx) => (
								<Badge key={idx} variant="outline" className="bg-black/30 backdrop-blur-sm text-white border-0 text-[10px]">
									{category}
								</Badge>
							))}
						</div>
					)}
				</div>

				<div className="p-2 flex flex-col">
					<div className="flex justify-between items-start">
						<div className="flex-1 min-w-0">
							<h3 className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
								{data.title}
							</h3>

							{data.artistId && (
								<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
									{data.artistId.name}
								</p>
							)}
						</div>

						{!artworkStatus || (data.status !== 'display' && data.price > 0) ? (
							<span className="text-xs font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap ml-2">
								{vietnamCurrency(data.price)}
							</span>
						) : null}
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default React.memo(ArtCard);