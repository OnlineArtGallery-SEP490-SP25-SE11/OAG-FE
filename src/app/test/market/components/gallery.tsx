'use client';
import DynamicBreadcrumb from '@/components/ui.custom/dynamic-breadcrumb';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArtPiece } from '@/types/marketplace.d';
import { useCallback, useEffect, useRef, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { fetchArtPieces } from '../api';
import { ProductCard } from '../components/product-card';
import { ProductModal } from '../components/product-modal';
import { Sidebar } from '../components/sidebar';
import ArtPieceSkeleton from './art-skeleton';

const breakpointColumns = {
	1300: 4,
	1100: 3,
	900: 2,
	500: 1
};

const getRandomHeight = () => {
	const minHeight = 200;
	const maxHeight = 400;
	return Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
};
const generateRandomKey = () => {
	return (
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15)
	);
};

export default function Gallery() {
	const [mounted, setMounted] = useState(false);
	const [artPieces, setArtPieces] = useState<ArtPiece[]>([]);
	const [filteredArtPieces, setFilteredArtPieces] = useState<ArtPiece[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [selectedArt, setSelectedArt] = useState<ArtPiece | null>(null);
	const observer = useRef<IntersectionObserver | null>(null);

	const lastArtPieceRef = useCallback(
		(node: HTMLDivElement) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					setPage((prevPage) => prevPage + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading]
	);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const loadArtPieces = async (): Promise<void> => {
			setLoading(true);
			try {
				const newArtPieces = await fetchArtPieces(page, 20);
				setArtPieces((prev) => [...prev, ...newArtPieces]);
				setFilteredArtPieces((prev) => [...prev, ...newArtPieces]);
				if (initialLoading) setInitialLoading(false);
			} catch (error) {
				console.error('Error fetching art pieces:', error);
			} finally {
				setLoading(false);
			}
		};

		if (mounted) {
			loadArtPieces();
		}
	}, [page, mounted, initialLoading]);

	const handleSearch = (query: string) => {
		const filtered = artPieces.filter(
			(art) =>
				art.title.toLowerCase().includes(query.toLowerCase()) ||
				art.artist.toLowerCase().includes(query.toLowerCase())
		);
		setFilteredArtPieces(filtered);
	};

	const handleFilterPrice = (min: number, max: number) => {
		const filtered = artPieces.filter(
			(art) => art.price >= min && art.price <= max
		);
		setFilteredArtPieces(filtered);
	};

	const handleFilterArtist = (artists: string[]) => {
		if (artists.length === 0) {
			setFilteredArtPieces(artPieces);
		} else {
			const filtered = artPieces.filter((art) =>
				artists.includes(art.artist)
			);
			setFilteredArtPieces(filtered);
		}
	};

	if (!mounted) {
		return null;
	}

	return (
		<TooltipProvider>
			<div className='flex'>
				<div className='hidden lg:block md:block sticky top-0 self-start h-screen'>
					<Sidebar
						onSearch={handleSearch}
						onFilterPrice={handleFilterPrice}
						onFilterArtist={handleFilterArtist}
					/>
				</div>
				<div className='flex-1 p-4'>
					<DynamicBreadcrumb currentPath='/test/market' />
					<h1 className='text-4xl font-bold mb-8 text-center'>
						Digital Art Gallery
					</h1>
					{initialLoading ? (
						<ResponsiveMasonry
							columnsCountBreakPoints={breakpointColumns}
						>
							<Masonry gutter='30px'>
								{Array.from({ length: 8 }).map((_, index) => (
									<div
										className='w-full'
										key={`${generateRandomKey()}`}
									>
										<ArtPieceSkeleton
											height={getRandomHeight()}
										/>
									</div>
								))}
							</Masonry>
						</ResponsiveMasonry>
					) : (
						<ResponsiveMasonry
							columnsCountBreakPoints={breakpointColumns}
						>
							<Masonry gutter='30px'>
								{filteredArtPieces.map((art, index) => (
									<div
										key={`${generateRandomKey()}`}
										ref={
											index ===
											filteredArtPieces.length - 1
												? lastArtPieceRef
												: null
										}
									>
										<ProductCard
											art={art}
											onClick={setSelectedArt}
										/>
									</div>
								))}
							</Masonry>
						</ResponsiveMasonry>
					)}

					{loading && filteredArtPieces.length > 0 && (
						<ResponsiveMasonry
							columnsCountBreakPoints={breakpointColumns}
						>
							<Masonry gutter='30px'>
								{Array.from({ length: 4 }).map((_, index) => (
									<div key={`${generateRandomKey()}`}>
										<ArtPieceSkeleton
											height={getRandomHeight()}
										/>
									</div>
								))}
							</Masonry>
						</ResponsiveMasonry>
					)}

					{loading && (
						<p className='text-center mt-4'>
							Loading more art pieces...
						</p>
					)}

					<ProductModal
						art={selectedArt}
						onClose={() => setSelectedArt(null)}
					/>
				</div>
			</div>
		</TooltipProvider>
	);
}
