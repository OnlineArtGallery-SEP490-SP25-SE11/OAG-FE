import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/components/ui/tooltip';
import { ArtPiece } from '@/types/marketplace';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { memo, useState } from 'react';
interface ArtCardProps {
	index?: number;
	data: ArtPiece;
	width?: number;
}

const ArtCard = memo(({ data, width = 300, index = 0 }: ArtCardProps) => {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	// Calculate scaled height based on original aspect ratio and new width
	const scaledHeight = Math.round((width * data.height) / data.width);

	const handleImageError = () => {
		setIsLoading(false);
		setHasError(true);
	};

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
			<AnimatePresence mode='wait'>
				{isLoading && !hasError && (
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
						src={hasError ? '/fallback-image.jpg' : data.imageUrl}
						alt={data.title}
						fill
						sizes={`(max-width: 768px) 100vw, ${width}px`}
						className='object-cover'
						priority={index < 4} // Load first 4 images immediately
						quality={85}
						// onLoadingComplete={() => setIsLoading(false)}
						onLoad={() => setIsLoading(false)}
						onError={handleImageError}
						style={{
							aspectRatio: `${data.width} / ${data.height}`
						}}
					/>
				</TooltipTrigger>
				<TooltipContent
					align='center'
					className='max-w-xs p-4 space-y-2 acrylic rounded border text-black dark:text-white prose dark:prose-invert'
					sideOffset={5}
					style={
						{
							'--gradient-angle': '120deg',
							'--gradient-end': 'rgba(0, 0, 255, 0.2)',
							'--blur': '5px'
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
});

ArtCard.displayName = 'ArtCard';
export default ArtCard;
