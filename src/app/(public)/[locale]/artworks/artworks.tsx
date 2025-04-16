'use client';

import { fetchArtPiecesByRange } from '@/app/(public)/[locale]/artworks/api';
import ArtModal from '@/app/(public)/[locale]/artworks/components/art-modal';
import { Artwork } from '@/types/marketplace';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ArtCategory from '@/app/(public)/[locale]/artworks/components/art-category';
import ArtFilter from '@/app/(public)/[locale]/artworks/components/art-filter';
import { useWindowSize } from '@react-hook/window-size';
import { CustomMasonry } from '@/app/(public)/[locale]/artworks/components/custom-masonry';
import { useTranslations } from 'next-intl';
import { useSetSelectedArt, useIsArtModalOpen, useIsArtModalClosing } from '@/hooks/useArtModal';

export default function Artworks({ 
    artworks, 
    initialTotal = 0 
}: { 
    artworks: Artwork[],
    initialTotal?: number
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const setSelectedArt = useSetSelectedArt();
	const isModalOpen = useIsArtModalOpen();
	const isModalClosing = useIsArtModalClosing();
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const scrollPositionRef = useRef<number>(0);
	const [windowWidth] = useWindowSize();
	const isMobile = windowWidth < 768;
	const [isLoading, setIsLoading] = useState(false);
	const [artPieces, setArtPieces] = useState<Artwork[]>(artworks);
	const [masonryLayout, setMasonryLayout] = useState<boolean>(true);
	const [totalArtworks, setTotalArtworks] = useState<number>(initialTotal);
	const [hasAllArtworks, setHasAllArtworks] = useState<boolean>(false);
	const t = useTranslations();
	
	// Update hasAllArtworks whenever artPieces or totalArtworks change
	useEffect(() => {
		// Initialize total with at least what we have
		if (totalArtworks === 0 && artworks.length > 0) {
			setTotalArtworks(Math.max(artworks.length, totalArtworks));
		}
		
		// Check if we've already loaded all available artworks
		if (totalArtworks > 0 && artPieces.length >= totalArtworks) {
			setHasAllArtworks(true);
		}
	}, [artworks.length, artPieces.length, totalArtworks]);
	
	// Function to fetch more artworks
	const loadMoreArtworks = useCallback(async () => {
		// Don't fetch if we're already loading or have all artworks
		if (isLoading || hasAllArtworks) return;
		
		// Skip fetching if we already have all the artworks
		if (totalArtworks > 0 && artPieces.length >= totalArtworks) {
			setHasAllArtworks(true);
			return;
		}
		
		setIsLoading(true);
		try {
			const startIndex = artPieces.length;
			const stopIndex = startIndex + 10;
			
			const response = await fetchArtPiecesByRange(startIndex, stopIndex);
			const nextArtworks = response.data.artworks;
			
			// Always update total count with the most recent value
			setTotalArtworks(response.data.total);
			
			// If no more artworks were returned, we've reached the end
			if (!nextArtworks || nextArtworks.length === 0) {
				setHasAllArtworks(true);
				return;
			}
			
			// Deduplicate artworks based on ID
			const newArtPieces = [...artPieces];
			const existingIds = new Set(artPieces.map(art => art._id));
			
			nextArtworks.forEach(artwork => {
				if (!existingIds.has(artwork._id)) {
					newArtPieces.push(artwork);
					existingIds.add(artwork._id);
				}
			});
			
			setArtPieces(newArtPieces);
			
			// Check if we've loaded all available artworks
			if (newArtPieces.length >= response.data.total) {
				setHasAllArtworks(true);
			}
		} catch (error) {
			console.error('Error loading more artworks:', error);
		} finally {
			setIsLoading(false);
		}
	}, [artPieces, isLoading, totalArtworks, hasAllArtworks]);
	
	// Layout toggle function is modified to always use masonry
	const toggleLayout = useCallback((isGrid: boolean) => {
		// Always set to true (masonry) for now
		if (!isGrid) {
			console.log(t('artworks.list_view_disabled'));
			// Optional: Show notification that list view is disabled
			return;
		}
		
		setMasonryLayout(true);
	}, [t]);
	
	// Handle URL changes and modal states - optimized
	useEffect(() => {
		const id = searchParams.get('id');
		
		if (id) {
			// Find the artwork in our collection to avoid fetching
			const artwork = artPieces.find(a => a._id === id) || null;
			
			// Only update state if we found the artwork or when closing
			if (artwork) {
				if (scrollContainerRef.current) {
					scrollPositionRef.current = scrollContainerRef.current.scrollTop;
				}
				document.body.style.overflow = 'hidden';
				setSelectedArt(artwork); // Direct state update without useState
			}
		} else if (isModalOpen) {
			// Only execute this code when modal was previously open
			document.body.style.overflow = '';
			setSelectedArt(null); // Direct state update without useState
			
			// Restore scroll position after closing
			setTimeout(() => {
				if (scrollContainerRef.current) {
					scrollContainerRef.current.scrollTop = scrollPositionRef.current;
				}
			}, 50);
		}
	}, [searchParams, artPieces, isModalOpen, setSelectedArt]);
	
	// Handle artwork click - optimized to set artwork directly
	const handleArtworkClick = useCallback((id: string) => {
		// Save current scroll position
		if (scrollContainerRef.current) {
			scrollPositionRef.current = scrollContainerRef.current.scrollTop;
		}
		
		// Find artwork in memory to avoid fetches
		const artwork = artPieces.find(a => a._id === id);
		if (artwork) {
			// Set artwork directly to avoid unnecessary renders
			setSelectedArt(artwork);
		}
		
		// Update URL with query param
		router.push(`?id=${id}`, { scroll: false });
	}, [router, artPieces, setSelectedArt]);
	
	return (
		<div className='flex flex-col min-h-screen m-0'>
			{/* Header Section */}
			<div className='flex-shrink-0'>
				<ArtCategory />
				
				<div style={{ height: '80px' }} className="bg-white dark:bg-gray-900">
					<ArtFilter
						onLayoutChange={toggleLayout}
						headerHeight={80}
					/>
				</div>
			</div>

			{/* Main Content - Only Masonry layout for now */}
			<div
				className="flex-grow masonry-container px-4 md:px-6 py-4"
				ref={scrollContainerRef}
			>
				<CustomMasonry
					items={artPieces}
					onItemClick={handleArtworkClick}
					loadMore={loadMoreArtworks}
					hasMore={!hasAllArtworks}
					isLoading={isLoading}
					totalCount={totalArtworks}
				/>
			</div>
			
			{/* Bottom Bar - only for mobile - optimized structure with no padding/margin */}
			{isMobile && (
				<div 
					className='fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg dark:shadow-gray-950/30 border-t border-gray-200 dark:border-gray-800'
					style={{ height: '80px' }}
				>
					<ArtFilter
						onLayoutChange={toggleLayout}
						headerHeight={80}
					/>
				</div>
			)}

			{/* Modal for artwork details - modified to keep showing while closing */}
			{(isModalOpen || isModalClosing) && <ArtModal />}

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
            `}</style>
		</div>
	);
}