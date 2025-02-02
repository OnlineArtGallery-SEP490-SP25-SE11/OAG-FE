import { ArtPiece } from '@/types/marketplace.d';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useWindowSize } from '@react-hook/window-size';
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface ArtFeedProps {
	data: ArtPiece;
	index: number;
}

const ArtFeed: React.FC<ArtFeedProps> = ({ data }) => {
	const [windowWidth, windowHeight] = useWindowSize();
	const containerRef = useRef<HTMLDivElement>(null);

	const headerHeight = 67;
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	const calculateContainerSize = useCallback(() => {
		if (!data.width || !data.height)
			return { w: windowWidth, h: windowHeight - headerHeight };

		const imgRatio = data.width / data.height;
		const screenRatio = windowWidth / (windowHeight - headerHeight);

		return imgRatio > screenRatio
			? { w: windowWidth, h: windowWidth / imgRatio }
			: {
					h: windowHeight - headerHeight,
					w: (windowHeight - headerHeight) * imgRatio
			  };
	}, [windowWidth, windowHeight, data.width, data.height]);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.style.overflow = 'hidden';
		}
	}, []);

	const { w, h } = calculateContainerSize();
	const handleImageError = useCallback(() => {
		setIsLoading(false);
		setHasError(true);
	}, []);

	const handleImageLoad = useCallback(() => {
		setIsLoading(false);
	}, []);

	return (
		<div
			ref={containerRef}
			style={{
				// width: '100vw',
				// height: '100vh',
				width: '100%',
				height: '100%',
				overflow: 'hidden', // Ẩn scroll
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				scrollSnapAlign: 'start'
			}}
			className='bg-white/5 backdrop-blur-sm rounded-md shadow-md'
		>
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
			<div
				style={{
					width: `${w}px`,
					height: `${h}px`,
					position: 'relative'
				}}
			>
				<Image
					src={data.imageUrl}
					alt={data.title}
					width={w}
					height={h}
					style={{ objectFit: 'contain' }}
					quality={80}
					priority
					onLoad={handleImageLoad} // Hide skeleton when image loads
					onError={handleImageError} // Handle errors
				/>
			</div>
		</div>
	);
};

export default React.memo(ArtFeed);
