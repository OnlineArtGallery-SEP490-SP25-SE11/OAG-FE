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

// Memo hóa MasonryLayout (giữ nguyên với masonic)
const MasonryLayout = memo(
	({
		items,
		loadMore
	}: {
		items: Artwork[];
		loadMore: LoadMoreItemsCallback<unknown>;
	}) => {
		const [windowWidth] = useWindowSize();
		const isMobile = windowWidth < 768; // Breakpoint cho mobile

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

		// Tính toán columnWidth dựa trên màn hình
		const getColumnWidth = () => {
			if (isMobile) {
				// Chia đôi chiều rộng màn hình, trừ gutter
				return (windowWidth - 30) / 2; // 30 là columnGutter
			}
			return 380; // Giá trị mặc định cho desktop
		};

		// Tính số cột (chỉ áp dụng nếu Masonry hỗ trợ columnCount trực tiếp)
		const columnCount = isMobile ? 2 : undefined; // Nếu không set columnCount thì dựa vào columnWidth

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
					columnCount={columnCount} // Chỉ thêm nếu Masonry hỗ trợ, nếu không thì xóa dòng này
				/>
			</motion.div>
		);
	}
);

// Tự viết ListLayout kiểu TikTok/Reels
const ListLayout = memo(
	({
		items,
		setArtPieces
	}: // loadMore
	{
		items: Artwork[];
		setArtPieces: (items: Artwork[]) => void;
		// loadMore: any;
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

		// Infinite Loader thủ công
		const triggerLoadMore = useCallback(async () => {
			if (loadingMore) return;
			setLoadingMore(true);
			console.log('Loading more at startIndex:', startIndex);

			const stopIndex = startIndex + 10;
			const nextArtWorks = (await fetchArtPiecesByRange(
				startIndex,
				stopIndex
			)) as Artwork[];

			// Use a Set to filter out duplicate items
			const newItems = Array.from(
				new Set([...items, ...nextArtWorks].map((item) => item?._id))
			)
				.map((id) =>
					[...items, ...nextArtWorks].find((item) => item?._id === id)
				)
				.filter((item): item is Artwork => item !== undefined);
			console.log('New items length:', newItems.length);

			// If the new array is different from the current array, update the state
			if (JSON.stringify(items) !== JSON.stringify(newItems)) {
				setArtPieces(newItems);
			}

			setStartIndex(stopIndex);
			setLoadingMore(false);
		}, [loadingMore, startIndex, items, setArtPieces]);

		// Scroll-based infinite loading
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

		// Intersection Observer để snap item
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
				className='w-full h-[calc(100vh-80px)] overflow-y-auto snap-y snap-mandatory scrollbar-hide'
			>
				{items.map((item, index) => (
					<div
						key={index}
						data-index={index}
						className='snap-item w-full h-[calc(100vh-80px)] snap-center flex items-center justify-center'
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

	// Memo hóa loadMore để tránh tạo lại hàm
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

	// Quản lý modal và vị trí cuộn
	useEffect(() => {
		const id = searchParams.get('id');
		if (id !== selectedId) {
			if (id && scrollContainerRef.current) {
				scrollPositionRef.current =
					scrollContainerRef.current.scrollTop;
				document.body.style.overflow = 'hidden'; // Khóa cuộn toàn trang
			} else if (!id && scrollContainerRef.current) {
				document.body.style.overflow = '';
				scrollContainerRef.current.scrollTop =
					scrollPositionRef.current;
			}
			setSelectedId(id);
		}
	}, [searchParams, selectedId]);

	// Memo hóa layout component
	const CurrentLayout = useMemo(() => {
		return masonryLayout ? (
			<MasonryLayout items={artPieces} loadMore={loadMore} />
		) : (
			<ListLayout
				items={artPieces}
				setArtPieces={setArtPieces}
				// loadMore={loadMore}
			/>
		);
	}, [masonryLayout, artPieces, loadMore]);

	return (
		<>
			{/* Chỉ hiển thị ArtCategory và ArtFilter khi ở chế độ MasonryLayout */}
			{masonryLayout && (
				<>
					<ArtCategory />
					<ArtFilter />
				</>
			)}
			<ArtSidebar
				changeLayout={() => {
					setMasonryLayout(!masonryLayout);
				}}
			/>
			<div className='p-0' ref={scrollContainerRef}>
				<AnimatePresence mode='wait'>
					<motion.div layout>{CurrentLayout}</motion.div>
				</AnimatePresence>
			</div>
			{selectedId && <ArtModal id={selectedId} setId={setSelectedId} />}
			{/* CSS toàn cục để ẩn scrollbar */}
			<style jsx global>{`
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}

				.scrollbar-hide {
					-ms-overflow-style: none; /* IE và Edge */
					scrollbar-width: none; /* Firefox */
				}
			`}</style>
		</>
	);
}
