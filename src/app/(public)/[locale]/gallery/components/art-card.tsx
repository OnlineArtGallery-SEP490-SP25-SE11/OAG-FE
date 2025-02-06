import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/components/ui/tooltip';
import { useArtModal } from '@/hooks/useArtModal';
import { ArtPiece } from '@/types/marketplace.d';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useCallback, useMemo, useState } from 'react';

interface ArtCardProps {
	data: ArtPiece;
	width: number;
	index: number;
}

const ArtCard: React.FC<ArtCardProps> = ({ data, width, index }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const { setSelected } = useArtModal();
	// Calculate scaled height based on original aspect ratio and new width
	const scaledHeight = useMemo(
		() => Math.round((width * data.height) / data.width),
		[width, data.height, data.width]
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
			className='relative rounded-md overflow-hidden shadow-md'
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
			<motion.div layoutId={`card-${data.id}`} />
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
			<Tooltip>
				<TooltipTrigger asChild>
					<Image
						src={data.imageUrl}
						alt={data.title}
						fill
						sizes={`(max-width: 768px) 100vw, ${width}px`}
						className={`object-cover ${hasError ? 'hidden' : ''}`}
						priority={index < 4} // Load first 4 images immediately
						quality={85}
						onLoad={handleImageLoad} // Hide skeleton when image loads
						onError={handleImageError} // Handle errors
						onClick={() => {
							setSelected(data);
						}}
					/>
				</TooltipTrigger>
				<TooltipContent
					align='center'
					className='max-w-xs p-4 space-y-2 acrylic rounded border backdrop-blur-lg text-black dark:text-white prose dark:prose-invert'
					sideOffset={5}
					style={
						{
							'--gradient-angle': '120deg',
							'--gradient-end': 'rgba(0, 0, 255, 0.2)'
						} as React.CSSProperties
					}
				>
					<h4 className='text-lg font-bold border-b border-gray-300 dark:border-gray-600 pb-2'>
						{data.title}
					</h4>
					<ScrollArea className='h-48 w-full rounded-md p-3 shadow-inner prose-sm'>
						<p>{data.description}</p>
					</ScrollArea>
					<div className='flex items-center justify-between text-sm'>
						<p className='flex items-center gap-2'>
							<span className='font-medium'>By:</span>
							{data.artist}
						</p>
						<p className='text-base font-semibold text-green-600'>
							${data.price}
						</p>
					</div>
				</TooltipContent>
			</Tooltip>
		</motion.div>
	);
};

export default React.memo(ArtCard);
