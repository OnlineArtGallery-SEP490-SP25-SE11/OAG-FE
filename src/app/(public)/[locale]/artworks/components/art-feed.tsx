'use client';

import { Artwork } from '@/types/marketplace.d';
import React, { memo, useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { useWindowSize } from '@react-hook/window-size';
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomDoubleTap } from '@/hooks/useDoubleTab';
import { Button } from '@/components/ui/button';
import { DollarSign, Calendar, Info, Ruler, ShoppingCart, X, Eye } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
interface ArtFeedProps {
	data: Artwork;
	index: number;
}
const tabVariants = {
	inactive: { opacity: 0.7, scale: 0.98, y: 0 },
	active: { opacity: 1, scale: 1.02, y: -2, transition: { duration: 0.2 } },
	hover: { scale: 1.04, transition: { duration: 0.2 } },
};
const ArtFeed: React.FC<ArtFeedProps> = ({ data }) => {
	const [windowWidth, windowHeight] = useWindowSize();
	const containerRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [isInfoOpen, setIsInfoOpen] = useState(false);
	const [heartPosition, setHeartPosition] = useState<{ x: number; y: number } | null>(null);
	const headerHeight = 162;
	const isMobile = windowWidth < 768;

	const calculateContainerSize = useCallback(() => {
		// Allow image to take more space when info panel is closed
		const availableWidth = windowWidth * (isInfoOpen && !isMobile ? 0.75 : 0.95);
		const availableHeight = (windowHeight - headerHeight) * 0.95;

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

	const [activeTab, setActiveTab] = useState('info');

	return (
		<div className="relative w-full h-[calc(100vh-160px)] flex bg-gray-100 dark:bg-gray-900 rounded-md shadow-md select-none overflow-hidden">
			{/* Image Section */}
			<motion.div
				{...bind}
				className="relative flex items-center justify-center w-full h-full"
				style={{ width: isInfoOpen && !isMobile ? '75%' : '100%' }}
				animate={{ width: isInfoOpen && !isMobile ? '75%' : '100%' }}
				transition={{ type: 'spring', stiffness: 400, damping: 30 }}
			>
				<div ref={containerRef} className="relative flex items-center justify-center w-full h-full">
					<Image
						src={data.url}
						alt={data.title}
						width={w}
						height={h}
						style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
						quality={90}
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
							transition={{ duration: 0.3 }}
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
					transition={{ duration: 0.2 }}
				>
					<Info className="w-6 h-6 text-black dark:text-white" />
				</motion.button>

				{heartPosition && tapped && (
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
						exit={{ scale: 0, opacity: 0 }}
						transition={{ duration: 0.6, times: [0, 0.3, 1] }}
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

			{/* Info Panel */}
			<AnimatePresence>
				{isInfoOpen && (
					<motion.div
						key="info-panel"
						initial={isMobile ? { y: '100%', opacity: 0 } : { x: '100%', opacity: 0 }}
						animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
						exit={isMobile ? { y: '100%', opacity: 0 } : { x: '100%', opacity: 0 }}
						transition={{ type: 'spring', stiffness: 400, damping: 30 }}
						className={`${
							isMobile
								? 'fixed inset-x-0 bottom-0 h-[80%] rounded-t-xl'
								: 'w-[25%] h-full absolute right-0 border-l border-gray-200 dark:border-gray-800'
						} bg-gray-100 dark:bg-gray-900 shadow-xl p-4 flex flex-col z-50`}
					>
						<div className="flex justify-between items-start mb-4">
							<h2 className="text-2xl font-bold text-black dark:text-white line-clamp-2">{data.title}</h2>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsInfoOpen(false)}
								className="text-black dark:text-white flex-shrink-0 ml-2"
							>
								<X className="w-5 h-5" />
							</Button>
						</div>

						{/* Status badge */}
						{data.status && (
							<div className="mb-4">
								<Badge variant="outline" className={`px-2 py-1 ${
									data.status === 'available'
										? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30'
										: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
								}`}>
									{data.status}
								</Badge>
								<Badge variant="outline" className="ml-2 bg-gray-500/10 border-gray-500/30">
									<Eye className="w-3 h-3 mr-1" />
									{data.views || 0} views
								</Badge>
							</div>
						)}

						{/* Tabs navigation */}
						<div className="relative mb-4">
							<div className="flex justify-start gap-2 border-b border-gray-200 dark:border-gray-800">
								<motion.button
									onClick={() => setActiveTab('info')}
									className={`relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-t-md transition-colors ${
										activeTab === 'info'
											? 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white'
											: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
									}`}
									variants={tabVariants}
									initial="inactive"
									animate={activeTab === 'info' ? 'active' : 'inactive'}
									whileHover="hover"
								>
									<Info className="w-4 h-4" />
									<span>Details</span>
									{activeTab === 'info' && (
										<motion.div
											className="absolute bottom-0 left-0 h-0.5 bg-black dark:bg-white w-full"
											layoutId="underline"
										/>
									)}
								</motion.button>
								<motion.button
									onClick={() => setActiveTab('comments')}
									className={`relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-t-md transition-colors ${
										activeTab === 'comments'
											? 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white'
											: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
									}`}
									variants={tabVariants}
									initial="inactive"
									animate={activeTab === 'comments' ? 'active' : 'inactive'}
									whileHover="hover"
								>
									<Info className="w-4 h-4" />
									<span>Comments</span>
									{activeTab === 'comments' && (
										<motion.div
											className="absolute bottom-0 left-0 h-0.5 bg-black dark:bg-white w-full"
											layoutId="underline"
										/>
									)}
								</motion.button>
							</div>
						</div>

						<AnimatePresence mode="wait">
							{activeTab === 'info' && (
								<motion.div
									key="info"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.2 }}
									className="flex-1 overflow-hidden"
								>
									<ScrollArea className="h-full pr-2">
										<div className="space-y-4">
											{/* Price - Prominently displayed */}
											{data.price > 0 && (
												<div className="bg-gray-200/60 dark:bg-gray-800/60 rounded-lg p-3 flex items-center gap-2">
													<DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
													<div>
														<p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
														<p className="font-semibold text-lg text-black dark:text-white">${data.price.toLocaleString()}</p>
													</div>
												</div>
											)}

											{/* Artist with proper Avatar */}
											{data.artistId && (
												<div className="bg-gray-200/60 dark:bg-gray-800/60 p-3 rounded-lg flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700/80 transition-colors cursor-pointer">
													<Avatar className="h-9 w-9 border border-gray-300 dark:border-gray-700">
														<AvatarImage
															src={data.artistId.image}
															alt={data.artistId.name || "Artist"}
														/>
														<AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm">
															{data.artistId.name?.charAt(0) || "A"}
														</AvatarFallback>
													</Avatar>
													<div className="flex-1 overflow-hidden">
														<p className="text-sm text-gray-500 dark:text-gray-400">Artist</p>
														<p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
															{data.artistId.name || 'Unknown Artist'}
														</p>
													</div>
													<Badge variant="secondary" className="ml-auto flex-shrink-0 text-xs">View Profile</Badge>
												</div>
											)}

											<Separator className="my-3 bg-gray-200 dark:bg-gray-800" />

											{/* Description - Given more space */}
											<div>
												<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</h3>
												<div className="bg-gray-200/40 dark:bg-gray-800/40 rounded-lg border border-gray-200 dark:border-gray-700 p-3 max-h-[250px] overflow-y-auto">
													<p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
														{data.description}
													</p>
												</div>
											</div>

											{/* Smaller metadata footer */}
											<div className="grid grid-cols-2 gap-2 mt-3 text-xs">
												<div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
													<Ruler className="w-3.5 h-3.5" />
													<span>{data.dimensions.width}×{data.dimensions.height}px</span>
												</div>
												<div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 justify-end">
													<Calendar className="w-3.5 h-3.5" />
													<span>{new Date(data.createdAt).toLocaleDateString()}</span>
												</div>
											</div>
										</div>
									</ScrollArea>
								</motion.div>
							)}
							{activeTab === 'comments' && (
								<motion.div
									key="comments"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.2 }}
									className="flex-1 overflow-hidden"
								>
									<ScrollArea className="h-full pr-2">
										<p className="text-sm text-gray-600 dark:text-gray-300">
											Comments section placeholder
										</p>
									</ScrollArea>
								</motion.div>
							)}
						</AnimatePresence>

						<Button
							className="mt-4 w-full bg-black dark:bg-white text-white dark:text-black"
							size="default"
						>
							<ShoppingCart className="w-4 h-4 mr-2" />
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
			transition={{ duration: 0.6, times: [0, 0.4, 1] }}
		>
			<motion.path
				d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
				initial={{ pathLength: 0, fill: 'rgba(239, 68, 68, 0)' }}
				animate={{ pathLength: 1, fill: 'rgba(239, 68, 68, 0.9)' }}
				transition={{ duration: 0.4 }}
			/>
		</motion.svg>
	);
}

export default memo(ArtFeed);