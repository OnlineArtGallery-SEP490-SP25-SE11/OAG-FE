import { ArtPiece } from '@/types/marketplace.d';
import React, { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { useWindowSize } from '@react-hook/window-size';
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomDoubleTap } from '@/hooks/useDoubleTab';
import { Button } from '@/components/ui/button';
import { DollarSign, Info, ShoppingCart, User, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ArtFeedProps {
	data: ArtPiece;
	index: number;
}

const ArtFeed: React.FC<ArtFeedProps> = ({ data }) => {
	const [windowWidth, windowHeight] = useWindowSize();
	const containerRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [isInfoOpen, setIsInfoOpen] = useState(false);
	const [heartPosition, setHeartPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const headerHeight = 67;

	const calculateContainerSize = useCallback(() => {
		if (!data.width || !data.height) {
			return {
				w: windowWidth * (isInfoOpen ? 0.7 : 1),
				h: windowHeight - headerHeight
			};
		}

		const imgRatio = data.width / data.height;
		const availableWidth = windowWidth * (isInfoOpen ? 0.7 : 1);
		const availableHeight = windowHeight - headerHeight;
		const screenRatio = availableWidth / availableHeight;

		if (imgRatio > screenRatio) {
			return {
				w: availableWidth,
				h: availableWidth / imgRatio
			};
		} else {
			return {
				w: availableHeight * imgRatio,
				h: availableHeight
			};
		}
	}, [windowWidth, windowHeight, data.width, data.height, isInfoOpen]);

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
		}
	});

	return (
		<div className='relative w-full h-full flex bg-white/5 backdrop-blur-sm rounded-md shadow-md select-none overflow-x-hidden '>
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
				className='relative flex items-center justify-center'
				style={{
					width: isInfoOpen ? '70%' : '100%',
					height: '100%'
				}}
				animate={{
					width: isInfoOpen ? '70%' : '100%'
				}}
				transition={{ type: 'spring', stiffness: 300, damping: 30 }}
			>
				<div
					ref={containerRef}
					className='relative flex items-center justify-center'
				>
					<Image
						src={data.imageUrl}
						alt={data.title}
						width={w}
						height={h}
						style={{
							maxWidth: '100%',
							maxHeight: '100%',
							objectFit: 'contain'
						}}
						quality={80}
						priority
						onLoad={handleImageLoad}
						onError={handleImageError}
					/>
				</div>

				<motion.button
					className='absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20'
					onClick={() => setIsInfoOpen(!isInfoOpen)}
					whileHover={{ scale: 1.05 }}
				>
					<Info className='w-5 h-5 text-black dark:text-white' />
				</motion.button>

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

			<AnimatePresence>
				{isInfoOpen && (
					<motion.div
						key='info-panel'
						initial={{ x: '100%' }}
						animate={{ x: 0 }}
						exit={{ x: '100%' }}
						transition={{
							type: 'spring',
							stiffness: 300,
							damping: 30
						}}
						className='w-[30%] h-full absolute right-0 bg-background/95 backdrop-blur-lg border-l shadow-xl p-6 flex flex-col'
					>
						<div className='flex justify-between items-start mb-6'>
							<h2 className='text-2xl font-bold'>{data.title}</h2>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => setIsInfoOpen(false)}
							>
								<X className='w-5 h-5' />
							</Button>
						</div>

						<Tabs
							defaultValue='info'
							className='flex-1 flex flex-col'
						>
							<TabsList className='grid grid-cols-2'>
								<TabsTrigger value='info'>Info</TabsTrigger>
								<TabsTrigger value='comments'>
									Comments
								</TabsTrigger>
							</TabsList>

							<TabsContent
								value='info'
								className='flex-1 overflow-auto'
							>
								<div className='space-y-4 mt-4'>
									<div className='flex items-center gap-2 text-sm'>
										<User className='w-4 h-4' />
										<span>{data.artist}</span>
									</div>

									<div className='flex items-center gap-2 text-sm'>
										<DollarSign className='w-4 h-4' />
										<span>
											${data.price.toLocaleString()}
										</span>
									</div>

									<Separator className='my-4' />
									<ScrollArea className='flex-1 pr-4 h-64'>
										<p className='text-sm text-muted-foreground'>
											{data.description}
										</p>
									</ScrollArea>
								</div>
							</TabsContent>

							<TabsContent
								value='comments'
								className='flex-1 overflow-auto'
							>
								<div className='h-full flex flex-col'>
									<ScrollArea className='flex-1 pr-4'>
										{/* Comment list component */}
									</ScrollArea>
								</div>
							</TabsContent>
						</Tabs>

						<Button className='mt-4 w-full' size='lg'>
							<ShoppingCart className='w-4 h-4 mr-2' />
							Add to Cart
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
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
