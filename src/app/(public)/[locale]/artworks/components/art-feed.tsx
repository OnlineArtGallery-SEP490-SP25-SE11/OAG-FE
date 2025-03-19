'use client';

import { Artwork } from '@/types/marketplace.d';
import React, { memo, useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { useWindowSize } from '@react-hook/window-size';
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomDoubleTap } from '@/hooks/useDoubleTab';
import { Button } from '@/components/ui/button';
import { DollarSign, Info, Ruler, ShoppingCart, User, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ArtFeedProps {
	data: Artwork;
	index: number;
}

const ArtFeed: React.FC<ArtFeedProps> = ({ data }) => {
	const [windowWidth, windowHeight] = useWindowSize();
	const containerRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [isInfoOpen, setIsInfoOpen] = useState(false);
	const [heartPosition, setHeartPosition] = useState<{ x: number; y: number } | null>(null);
	const headerHeight = 162;
	const isMobile = windowWidth < 768; // Breakpoint cho mobile

	const calculateContainerSize = useCallback(() => {
		const availableWidth = windowWidth * (isInfoOpen && !isMobile ? 0.7 : 1);
		const availableHeight = windowHeight - headerHeight;

		if (!data.dimensions.width || !data.dimensions.height) {
			return { w: availableWidth, h: availableHeight };
		}

		const imgRatio = data.dimensions.width / data.dimensions.height;
		const screenRatio = availableWidth / availableHeight;

		if (imgRatio > screenRatio) {
			return { w: availableWidth, h: availableWidth / imgRatio };
		} else {
			return { w: availableHeight * imgRatio, h: availableHeight };
		}
	}, [windowWidth, windowHeight, data.dimensions.width, data.dimensions.height, isInfoOpen, isMobile]);

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
		if (clientX !== undefined && clientY !== undefined && containerRef.current) {
			const rect = containerRef.current.getBoundingClientRect();
			const x = clientX - rect.left;
			const y = clientY - rect.top;
			setHeartPosition({ x, y });
			setTimeout(() => setHeartPosition(null), 600);
		}
	});

	const tabVariants = {
		inactive: { opacity: 0.7, scale: 0.98, y: 0 },
		active: { opacity: 1, scale: 1.02, y: -2, transition: { duration: 0.25, ease: 'easeOut' } },
		hover: { scale: 1.04, transition: { duration: 0.25, ease: 'easeOut' } },
	};

	const [activeTab, setActiveTab] = useState('info');

	return (
		<div
			className="relative w-full h-[calc(100vh-160px)] flex bg-gray-100 dark:bg-gray-900 rounded-md shadow-md select-none overflow-hidden">
			{/* Image Section */}
			<motion.div
				{...bind}
				className="relative flex items-center justify-center w-full h-full"
				style={{ width: isInfoOpen && !isMobile ? '70%' : '100%' }}
				animate={{ width: isInfoOpen && !isMobile ? '70%' : '100%' }}
				transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
			>
				<div ref={containerRef} className="relative flex items-center justify-center w-full h-full">
					<Image
						src={data.url}
						alt={data.title}
						width={w}
						height={h}
						style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
						quality={80}
						priority
						onLoad={handleImageLoad}
						onError={handleImageError}
					/>
				</div>

				<AnimatePresence mode="wait">
					{(isLoading || hasError) && (
						<motion.div
							className="absolute inset-0"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.4, ease: 'easeInOut' }}
						>
							<Skeleton className="w-full h-full bg-gray-300/50 dark:bg-gray-600/50" />
						</motion.div>
					)}
				</AnimatePresence>

				<motion.button
					className="absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-300/50 dark:hover:bg-gray-700/50"
					onClick={() => setIsInfoOpen(!isInfoOpen)}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					transition={{ duration: 0.2, ease: 'easeOut' }}
				>
					<Info className="w-6 h-6 text-black dark:text-white" />
				</motion.button>

				{heartPosition && tapped && (
					<motion.div
						initial={{ scale: 0, opacity: 0, rotate: -10 }}
						animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0], rotate: 0 }}
						exit={{ scale: 0, opacity: 0 }}
						transition={{ duration: 0.6, times: [0, 0.3, 1], ease: 'easeInOut' }}
						style={{
							position: 'fixed',
							top: heartPosition.y - 40,
							left: heartPosition.x - 40,
							width: 80,
							height: 80,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<HeartIcon />
					</motion.div>
				)}
			</motion.div>

			{/* Info Panel (Desktop) / Drawer (Mobile) */}
			<AnimatePresence>
				{isInfoOpen && (
					<motion.div
						key="info-panel"
						initial={isMobile ? { y: '100%', opacity: 0 } : { x: '100%', opacity: 0 }}
						animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
						exit={isMobile ? { y: '100%', opacity: 0 } : { x: '100%', opacity: 0 }}
						transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
						className={`${
							isMobile
								? 'fixed inset-x-0 bottom-0 h-[80%] rounded-t-xl'
								: 'w-[30%] h-full absolute right-0 border-l border-gray-200 dark:border-gray-800'
						} bg-gray-100 dark:bg-gray-900 shadow-xl p-6 flex flex-col z-50`}
					>
						<div className="flex justify-between items-start mb-6">
							<h2 className="text-3xl font-bold text-black dark:text-white">{data.title}</h2>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsInfoOpen(false)}
								className="text-black dark:text-white"
							>
								<X className="w-6 h-6" />
							</Button>
						</div>

						<div className="relative mb-4">
							<div className="flex justify-start gap-3 border-b border-gray-200 dark:border-gray-800">
								<motion.button
									onClick={() => setActiveTab('info')}
									className={`relative flex items-center gap-2 px-3 py-2 text-lg font-medium rounded-t-md transition-colors ${
										activeTab === 'info'
											? 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white shadow-md'
											: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
									}`}
									variants={tabVariants}
									initial="inactive"
									animate={activeTab === 'info' ? 'active' : 'inactive'}
									whileHover="hover"
								>
									<Info className="w-5 h-5" />
									<span>Info</span>
									{activeTab === 'info' && (
										<motion.div
											className="absolute bottom-0 left-0 h-0.5 bg-black dark:bg-white w-full"
											layoutId="underline"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.25, ease: 'easeOut' }}
										/>
									)}
								</motion.button>
								<motion.button
									onClick={() => setActiveTab('comments')}
									className={`relative flex items-center gap-2 px-3 py-2 text-lg font-medium rounded-t-md transition-colors ${
										activeTab === 'comments'
											? 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white shadow-md'
											: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
									}`}
									variants={tabVariants}
									initial="inactive"
									animate={activeTab === 'comments' ? 'active' : 'inactive'}
									whileHover="hover"
								>
									<Info className="w-5 h-5" />
									<span>Comments</span>
									{activeTab === 'comments' && (
										<motion.div
											className="absolute bottom-0 left-0 h-0.5 bg-black dark:bg-white w-full"
											layoutId="underline"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.25, ease: 'easeOut' }}
										/>
									)}
								</motion.button>
							</div>
						</div>

						<AnimatePresence mode="wait">
							{activeTab === 'info' && (
								<motion.div
									key="info"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 20 }}
									transition={{ duration: 0.3, ease: 'easeOut' }}
									className="flex-1 overflow-hidden"
								>
									<ScrollArea className="h-full pr-4">
										<div className="space-y-4">
											<div className="flex items-center gap-2 text-lg text-black dark:text-white">
												<User className="w-5 h-5" />
												<span>{data.artist}</span>
											</div>
											<div className="flex items-center gap-2 text-lg text-black dark:text-white">
												<DollarSign className="w-5 h-5" />
												<span>${data.price.toLocaleString()}</span>
											</div>
											<div className="flex items-center gap-2 text-lg text-black dark:text-white">
												<Ruler className="w-5 h-5" />
												<span>
                          {data.dimensions.width}x{data.dimensions.height}px
                        </span>
											</div>
											<Separator className="my-4 bg-gray-200 dark:bg-gray-800" />
											<p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
												{data.description}
											</p>
										</div>
									</ScrollArea>
								</motion.div>
							)}
							{activeTab === 'comments' && (
								<motion.div
									key="comments"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 20 }}
									transition={{ duration: 0.3, ease: 'easeOut' }}
									className="flex-1 overflow-hidden"
								>
									<ScrollArea className="h-full pr-4">
										<p className="text-lg text-gray-700 dark:text-gray-300">
											Comments section placeholder
										</p>
									</ScrollArea>
								</motion.div>
							)}
						</AnimatePresence>

						<Button
							className="mt-4 w-full bg-black dark:bg-white text-white dark:text-black"
							size="lg"
						>
							<ShoppingCart className="w-5 h-5 mr-2" />
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
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-24 h-24 text-red-500"
			initial={{ scale: 0, opacity: 0, rotate: -15 }}
			animate={{ scale: [0, 1.6, 1], opacity: [0, 1, 0], rotate: 0 }}
			transition={{ duration: 0.6, times: [0, 0.4, 1], ease: 'easeInOut' }}
		>
			<motion.path
				d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
				initial={{ pathLength: 0, fill: 'rgba(239, 68, 68, 0)' }}
				animate={{ pathLength: 1, fill: 'rgba(239, 68, 68, 0.9)' }}
				transition={{ duration: 0.4, ease: 'easeInOut' }}
			/>
		</motion.svg>
	);
}

export default memo(ArtFeed);