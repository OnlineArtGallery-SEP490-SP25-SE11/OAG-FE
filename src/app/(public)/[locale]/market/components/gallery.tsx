'use client';
import DynamicBreadcrumb from '@/components/ui.custom/dynamic-breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArtPiece } from '@/types/marketplace.d';
import { debounce } from 'lodash';
import { Masonry } from 'masonic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchArtPieces } from '../../gallery/api';
import ArtPieceSkeleton from './art-skeleton';
import ProductCard from './product-card';
import { ProductModal } from './product-modal';

const INITIAL_SKELETON_COUNT = 8;

interface CachedItem extends ArtPiece {
	height: number;
	cached?: boolean;
}

export default function Gallery() {
	const [artPieces, setArtPieces] = useState<CachedItem[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [hasMore, setHasMore] = useState(true);
	const [selectedArt, setSelectedArt] = useState<ArtPiece | null>(null);
	const [shouldUpdateLayout, setShouldUpdateLayout] = useState(false);

	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadingRef = useRef(false);
	const heightCacheRef = useRef<Map<string, number>>(new Map());
	const containerRef = useRef<HTMLDivElement>(null);

	// Memoize the height getter function
	const getItemHeight = useCallback((id: string, defaultHeight: number) => {
		const cachedHeight = heightCacheRef.current.get(id);
		if (cachedHeight) return cachedHeight;

		heightCacheRef.current.set(id, defaultHeight);
		return defaultHeight;
	}, []);

	const loadArtPieces = useCallback(async () => {
		if (loadingRef.current || !hasMore) return;
		loadingRef.current = true;

		try {
			const newArtPieces = await fetchArtPieces(page, 8);
			if (newArtPieces.length === 0 || newArtPieces.length < 8) {
				setHasMore(false);
			}

			// Add heights to new pieces without affecting existing ones
			const newPiecesWithHeight = newArtPieces.map((piece) => ({
				...piece,
				height: getItemHeight(
					piece.id,
					Math.floor(Math.random() * (400 - 200 + 1)) + 200
				),
				cached: false
			}));

			setArtPieces((prev) => {
				// Keep existing items with their cached heights
				const existingItems = prev.map((item) => ({
					...item,
					cached: true,
					height: heightCacheRef.current.get(item.id) || item.height
				}));

				return [...existingItems, ...newPiecesWithHeight];
			});

			setPage((prev) => prev + 1);
		} catch (error) {
			console.error('Error fetching art pieces:', error);
		} finally {
			loadingRef.current = false;
			setLoading(false);
		}
	}, [page, hasMore, getItemHeight]);

	// Intersection Observer setup
	const lastArtPieceRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (!node) return;

			if (observerRef.current) {
				observerRef.current.disconnect();
			}

			observerRef.current = new IntersectionObserver(
				(entries) => {
					const [entry] = entries;
					if (
						entry.isIntersecting &&
						hasMore &&
						!loadingRef.current
					) {
						debounce(loadArtPieces, 500)();
					}
				},
				{ rootMargin: '300px' }
			);

			observerRef.current.observe(node);
		},
		[hasMore, loadArtPieces]
	);

	// Memoize the render function to prevent unnecessary re-renders
	const renderItem = useCallback(
		({ data, index }: { data: any; index: number }) => {
			const isLast = index === artPieces.length - 1;

			if ('isSkeleton' in data && data.isSkeleton) {
				return (
					<div style={{ height: data.height }}>
						<ArtPieceSkeleton height={data.height} />
					</div>
				);
			}

			return (
				<div ref={isLast ? lastArtPieceRef : null}>
					<ProductCard
						art={data as ArtPiece}
						onClick={setSelectedArt}
					/>
				</div>
			);
		},
		[artPieces.length, lastArtPieceRef, setSelectedArt]
	);

	// Memoize items array
	const items = useMemo(() => {
		const currentItems = artPieces.map((item) => ({
			...item,
			height: heightCacheRef.current.get(item.id) || item.height
		}));

		if (loading) {
			const skeletonCount =
				currentItems.length === 0 ? INITIAL_SKELETON_COUNT : 4;
			const skeletons = Array(skeletonCount)
				.fill(null)
				.map((_, i) => ({
					id: `skeleton-${i}-${Date.now()}`,
					isSkeleton: true,
					height: 300
				}));
			return [...currentItems, ...skeletons];
		}

		return currentItems;
	}, [artPieces, loading]);

	// Initial load
	useEffect(() => {
		loadArtPieces();
		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, []);

	// Handle resize
	useEffect(() => {
		const handleResize = debounce(() => {
			setShouldUpdateLayout((prev) => !prev);
		}, 100);

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<div className='flex'>
			<div className='flex-1 p-4' ref={containerRef}>
				<DynamicBreadcrumb />
				<h1 className='text-4xl font-bold mb-8 text-center'>
					Digital Art Gallery
				</h1>
				<ScrollArea>
					<Masonry
						items={items}
						columnGutter={15}
						columnWidth={350}
						render={renderItem}
						key={
							shouldUpdateLayout
								? 'layout-update'
								: 'stable-layout'
						}
					/>

					{loading && hasMore && artPieces.length > 0 && (
						<div className='w-full text-center py-4'>
							<p>Loading more art pieces...</p>
						</div>
					)}

					{!hasMore && artPieces.length > 0 && (
						<div className='w-full text-center py-4'>
							<p>No more art pieces to load</p>
						</div>
					)}
				</ScrollArea>

				<ProductModal
					art={selectedArt}
					onClose={() => setSelectedArt(null)}
				/>
			</div>
		</div>
	);
}
