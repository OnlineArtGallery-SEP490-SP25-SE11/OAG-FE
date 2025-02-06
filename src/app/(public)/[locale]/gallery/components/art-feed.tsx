import { ArtPiece } from '@/types/marketplace.d';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useWindowSize } from '@react-hook/window-size';
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomDoubleTap } from '@/hooks/useDoubleTab';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface ArtFeedProps {
	data: ArtPiece;
	index: number;
}

const ArtFeed: React.FC<ArtFeedProps> = ({ data }) => {
	const [windowWidth, windowHeight] = useWindowSize();
	const containerRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [heartPosition, setHeartPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const headerHeight = 67;
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

	const { bind, tapped } = useCustomDoubleTap((event) => {
		let clientX: number | undefined;
		let clientY: number | undefined;
		if ('touches' in event && event.touches.length > 0) {
			clientX = event.touches[0].clientX;
			clientY = event.touches[0].clientY;
		} else if ('clientX' in event) {
			console.log('clientX', event.clientX);
			clientX = event.clientX;
			clientY = event.clientY;
		}
		if (
			clientX !== undefined &&
			clientY !== undefined &&
			containerRef.current
		) {
			const rect = containerRef.current.getBoundingClientRect();
			const x = clientX - rect.left;
			const y = clientY - rect.top;
			setHeartPosition({ x, y });
			console.log('tim tranh nay', data.title);
		}
	});

	return (
		<div
			ref={containerRef}
			style={{
				width: '100%',
				height: '100%',
				overflow: 'hidden',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative'
			}}
			className='bg-white/5 backdrop-blur-sm rounded-md shadow-md select-none'
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
			<motion.div
				{...bind}
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
					onLoad={handleImageLoad}
					onError={handleImageError}
				/>
				<motion.div
					className='absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity'
					initial={{ opacity: 0 }}
					whileHover={{ opacity: 1 }}
				>
					<div className='space-y-2 text-white'>
						<div className='flex justify-between items-start'>
							<div>
								<h3 className='font-bold text-lg line-clamp-1'>
									{data.title}
								</h3>
								<p className='text-sm text-gray-200'>
									{data.artist}
								</p>
							</div>
							<Button
								size='sm'
								className='shadow-lg bg-primary/90 hover:bg-primary'
								// onClick={() => setSelected(data)}
							>
								<ShoppingCart className='w-4 h-4 mr-2' />$
								{data.price}
							</Button>
						</div>

						<motion.div
							className='text-sm text-gray-300 line-clamp-2'
							initial={{ y: 10, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.2 }}
						>
							{data.description}
						</motion.div>
					</div>
				</motion.div>
				{heartPosition && tapped && (
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1.2, opacity: 1.2 }}
						exit={{ scale: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
						style={{
							position: 'fixed',
							top: heartPosition.y - 20,
							left: heartPosition.x - 20,
							width: 80,
							height: 80,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<HeartIcon />
					</motion.div>
				)}
			</motion.div>
		</div>
	);
};

function HeartIcon() {
	return (
		<motion.svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className='w-24 h-24 text-red-500'
			initial={{ scale: 0.5, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ duration: 0.2, ease: 'easeOut' }}
		>
			<motion.path
				d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'
				initial={{ pathLength: 0, fill: 'rgba(239, 68, 68, 0)' }}
				animate={{ pathLength: 1, fill: 'rgba(239, 68, 68, 1)' }}
				transition={{ duration: 0.2, ease: 'easeInOut' }}
			/>
		</motion.svg>
	);
}

export default React.memo(ArtFeed);
