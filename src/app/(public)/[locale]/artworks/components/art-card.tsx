'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { useArtModal } from '@/hooks/useArtModal';
import { Artwork } from '@/types/marketplace.d';
import { vietnamCurrency } from '@/utils/converters';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

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
		() =>
			Math.round(
				(width * data.dimensions.height) / data.dimensions.width
			),
		[width, data.dimensions.height, data.dimensions.width]
	);

	const handleImageError = useCallback(() => {
		setIsLoading(false);
		setHasError(true);
	}, []);

	const handleImageLoad = useCallback(() => {
		setIsLoading(false);
	}, []);

	return (
		<motion.div
			className='relative overflow-hidden'
			style={{
				width,
				height: scaledHeight // Set fixed height based on aspect ratio
			}}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.4,
				ease: [0.4, 0, 0.2, 1]
			}}
		>
			<motion.div layoutId={`card-${data._id}`} />
			<AnimatePresence mode='wait'>
				{(isLoading || hasError) && (
					<motion.div
						className='absolute inset-0'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						<Skeleton className='w-full h-full bg-gray-300/50 dark:bg-gray-600/50' />
					</motion.div>
				)}
			</AnimatePresence>
			<div className='flex flex-col w-full h-full'>
				<div
					className='relative w-full'
					style={{ height: `${scaledHeight - 60}px` }}
				>
					<Image
						src={data.url}
						alt={data.title}
						fill
						sizes={`(max-width: 768px) 100vw, ${width}px`}
						className={`object-cover ${hasError ? 'hidden' : ''}`}
						priority={index < 4}
						quality={85}
						onLoad={handleImageLoad}
						onError={handleImageError}
						onClick={() => {
							setSelected(data);
							// Sử dụng usePathname để lấy đường dẫn hiện tại
							router.push(`${pathname}?id=${data._id}`);
						}}
					/>
				</div>
				<div className='p-2 bg-white dark:bg-gray-800'>
					<div className='flex items-center justify-between'>
						<div className='flex flex-col'>
							<span className='text-md font-medium truncate'>
								{data.title}
							</span>
							<span className='text-sm text-gray-500 dark:text-gray-400'>
								{vietnamCurrency(data.price)}
							</span>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default React.memo(ArtCard);
