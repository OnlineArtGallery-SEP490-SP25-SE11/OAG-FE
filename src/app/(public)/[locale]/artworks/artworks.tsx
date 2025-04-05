'use client';

import { fetchArtPiecesByRange } from '@/app/(public)/[locale]/artworks/api';
import ArtCard from '@/app/(public)/[locale]/artworks/components/art-card';
import ArtModal from '@/app/(public)/[locale]/artworks/components/art-modal';
import ArtFeed from '@/app/(public)/[locale]/artworks/components/art-feed';
import { Artwork } from '@/types/marketplace';
import { LoadMoreItemsCallback, Masonry, useInfiniteLoader } from 'masonic';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import ArtCategory from '@/app/(public)/[locale]/artworks/components/art-category';
import ArtFilter from '@/app/(public)/[locale]/artworks/components/art-filter';
import { useWindowSize } from '@react-hook/window-size';
import ArtSidebar from '@/app/(public)/[locale]/artworks/components/art-sidebar';

const MasonryLayout = memo(
	({
		 items,
		 loadMore
	 }: {
		items: Artwork[];
		loadMore: LoadMoreItemsCallback<unknown>;
	}) => {
		const [windowWidth] = useWindowSize();
		const isMobile = windowWidth < 768;

		const animation = {
			variants: {
				hidden: { opacity: 0, y: 20 },
				visible: { opacity: 1, y: 0 },
				exit: { opacity: 0, y: -20 }
			},
			transition: {
				type: 'spring',
				stiffness: 300,
				damping: 30,
				duration: 0.2
			}
		};

		const getColumnWidth = () => {
			if (isMobile) {
				return (windowWidth - 30) / 2;
			}
			return 380;
		};

		const columnCount = isMobile ? 2 : undefined;

		return (
			<motion.div
				key='masonry'
				initial='hidden'
				animate='visible'
				exit='exit'
				variants={animation.variants}
				transition={animation.transition}
			>
				<Masonry
					onRender={loadMore}
					items={items}
					columnGutter={30}
					columnWidth={getColumnWidth()}
					overscanBy={1.5}
					render={ArtCard}
					columnCount={columnCount}
				/>
			</motion.div>
		);
	}
);

const ListLayout = memo(
	({
		 items,
		 setArtPieces
	 }: {
		items: Artwork[];
		setArtPieces: (items: Artwork[]) => void;
	}) => {
		const animation = {
			variants: {
				hidden: { opacity: 0, y: 20 },
				visible: { opacity: 1, y: 0 },
				exit: { opacity: 0, y: -20 }
			},
			transition: {
				type: 'spring',
				stiffness: 300,
				damping: 30,
				duration: 0.2
			}
		};

		const containerRef = useRef<HTMLDivElement>(null);
		const observerRef = useRef<IntersectionObserver | null>(null);
		const [startIndex, setStartIndex] = useState(items.length);
		const [loadingMore, setLoadingMore] = useState(false);
		const itemHeight = window.innerHeight - 80;
		const threshold = 100;

		const triggerLoadMore = useCallback(async () => {
			if (loadingMore) return;
			setLoadingMore(true);
			console.log('Loading more at startIndex:', startIndex);

			const stopIndex = startIndex + 10;
			const nextArtWorks = (await fetchArtPiecesByRange(
				startIndex,
				stopIndex
			)) as Artwork[];

			const newItems = Array.from(
				new Set([...items, ...nextArtWorks].map((item) => item?._id))
			)
				.map((id) =>
					[...items, ...nextArtWorks].find((item) => item?._id === id)
				)
				.filter((item): item is Artwork => item !== undefined);
			console.log('New items length:', newItems.length);

			if (JSON.stringify(items) !== JSON.stringify(newItems)) {
				setArtPieces(newItems);
			}

			setStartIndex(stopIndex);
			setLoadingMore(false);
		}, [loadingMore, startIndex, items, setArtPieces]);

		useEffect(() => {
			if (!containerRef.current) return;

			const handleScroll = () => {
				const totalHeight = items.length * itemHeight;
				const scrollTop = containerRef.current!.scrollTop;
				const containerHeight = containerRef.current!.clientHeight;
				if (
					scrollTop + containerHeight >= totalHeight - threshold &&
					!loadingMore
				) {
					triggerLoadMore();
				}
			};

			containerRef.current.addEventListener('scroll', handleScroll);
			return () =>
				containerRef.current?.removeEventListener(
					'scroll',
					handleScroll
				);
		}, [items, triggerLoadMore, loadingMore]);

		useEffect(() => {
			if (!containerRef.current) return;

			observerRef.current = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const index = Number(
								entry.target.getAttribute('data-index')
							);
							const scrollTop = index * (window.innerHeight - 80);
							containerRef.current!.scrollTo({
								top: scrollTop,
								behavior: 'smooth'
							});
						}
					});
				},
				{ threshold: 0.5 }
			);

			const snapItems =
				containerRef.current.querySelectorAll('.snap-item');
			snapItems.forEach((item) => observerRef.current!.observe(item));

			return () => {
				if (observerRef.current) {
					observerRef.current.disconnect();
				}
			};
		}, [items]);

		return (
			<motion.div
				key='list'
				initial='hidden'
				animate='visible'
				exit='exit'
				variants={animation.variants}
				transition={animation.transition}
				ref={containerRef}
				className='w-full h-[calc(100vh-80px)] overflow-y-auto snap-y snap-mandatory scrollbar-hide scroll-py-0'
			>
				{items.map((item, index) => (
					<div
						key={index}
						data-index={index}
						className='snap-item w-full h-full snap-center p-0 m-0'
					>
						<ArtFeed data={item} index={index} />
					</div>
				))}
			</motion.div>
		);
	}
);

MasonryLayout.displayName = 'MasonryLayout';
ListLayout.displayName = 'ListLayout';

export default function Artworks({ artworks }: { artworks: Artwork[] }) {
	const searchParams = useSearchParams();
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [artPieces, setArtPieces] = useState<Artwork[]>(artworks);
	const [masonryLayout, setMasonryLayout] = useState<boolean>(true);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const scrollPositionRef = useRef<number>(0);
	const [windowWidth] = useWindowSize();
	const isMobile = windowWidth < 768;
	const loadMore = useCallback(
		useInfiniteLoader(
			async (startIndex, stopIndex, currentItems) => {
				const nextArtWorks = (await fetchArtPiecesByRange(
					startIndex,
					stopIndex
				)) as Artwork[];
				setArtPieces((current) => {
					const newItems = [...current, ...nextArtWorks];
					if (JSON.stringify(current) === JSON.stringify(newItems))
						return current;
					return newItems;
				});
			},
			{
				isItemLoaded: (index, items) => !!items[index],
				minimumBatchSize: 10,
				threshold: 5
			}
		),
		[]
	);

	useEffect(() => {
		if (masonryLayout) {
			const id = searchParams.get('id');
			if (id !== selectedId) {
				if (id && scrollContainerRef.current) {
					scrollPositionRef.current = scrollContainerRef.current.scrollTop;
					document.body.style.overflow = 'hidden';
				} else if (!id && scrollContainerRef.current) {
					document.body.style.overflow = '';
					scrollContainerRef.current.scrollTop = scrollPositionRef.current;
				}
				setSelectedId(id);
			}
		} else {
			setSelectedId(null);
			document.body.style.overflow = '';
		}
	}, [searchParams, selectedId, masonryLayout]);

	const CurrentLayout = useMemo(() => {
		return masonryLayout ? (
			<MasonryLayout items={artPieces} loadMore={loadMore} />
		) : (
			<ListLayout items={artPieces} setArtPieces={setArtPieces} />
		);
	}, [masonryLayout, artPieces, loadMore]);

	return (
		<div className='flex flex-col min-h-screen  m-0'>
			{/* Header Section */}
			{masonryLayout && (
				<div className='flex-shrink-0'>
					<ArtCategory />
					{!isMobile && (
						<div style={{ height: '80px' }}>
							<ArtFilter
								onLayoutChange={(isGrid) => setMasonryLayout(!isGrid)}
								headerHeight={80}
							/>
						</div>
					)}
				</div>
			)}

			{/* Main Content */}
			<div
				className='flex-grow p-0 m-0'
				ref={scrollContainerRef}>
				{/* <ArtSidebar changeLayout={() => setMasonryLayout(!masonryLayout)} /> */}
				<AnimatePresence mode='wait'>
					<motion.div layout>{CurrentLayout}</motion.div>
				</AnimatePresence>
			</div>

			{/* Bottom Bar */}
			{(isMobile || !masonryLayout) && (
				<div className='fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200'>
					<div className='max-w-7xl mx-auto px-4' style={{ height: '80px' }}>
						<ArtFilter
							onLayoutChange={(isGrid) => setMasonryLayout(!isGrid)}
							headerHeight={80}
						/>
					</div>
				</div>
			)}

			{/* Modal - chỉ hiển thị ở masonry layout */}
			{masonryLayout && selectedId && <ArtModal id={selectedId} setId={setSelectedId} />}

			<style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @media (max-width: 767px) {
                    .flex-grow {
                        padding-bottom: 80px;
                    }
                }
                @media (min-width: 768px) {
                    .flex-grow {
                        padding-bottom: ${!masonryLayout ? '80px' : '0'};
                    }
                }
			`}</style>
		</div>
	);
}