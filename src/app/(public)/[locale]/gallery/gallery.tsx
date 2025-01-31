'use client';
import { fetchArtPiecesByRange } from '@/app/(public)/[locale]/gallery/api';
import ArtCard from '@/app/(public)/[locale]/gallery/components/art-card';
import ArtModal from '@/app/(public)/[locale]/gallery/components/art-modal';
import ArtFeed from '@/app/(public)/[locale]/gallery/components/art-feed';
import { ArtPiece } from '@/types/marketplace';
import { ListProps, Masonry, useInfiniteLoader, List } from 'masonic';
import { useState, CSSProperties } from 'react';
import FloatingSidebar from './components/art-sidebar';

export default function Gallery({ artworks }: { artworks: ArtPiece[] }) {
	const [artPieces, setArtPieces] = useState<ArtPiece[]>(artworks);
	const loadMore = useInfiniteLoader(
		async (startIndex, stopIndex, currentItems) => {
			const nextArtWorks = (await fetchArtPiecesByRange(
				startIndex,
				stopIndex
			)) as ArtPiece[];
			console.log(startIndex, stopIndex);
			console.log(currentItems);
			setArtPieces((current) => [...current, ...nextArtWorks]);
		},
		{
			isItemLoaded: (index, items) => !!items[index],
			minimumBatchSize: 10,
			threshold: 5
		}
	);

	console.log(artPieces);
	return (
		<>
			<FloatingSidebar />
			<div className='p-5 pl-10'>
				{/*<Masonry*/}
				{/*	onRender={loadMore}*/}
				{/*	items={artPieces}*/}
				{/*	columnGutter={20}*/}
				{/*	columnWidth={280}*/}
				{/*	overscanBy={1.5}*/}
				{/*	render={ArtCard}*/}
				{/*/>*/}

				<List
					onRender={loadMore}
					items={artPieces}
					render={ArtFeed}
					rowGutter={67}
					overscanBy={1.5}
					// style={{
					// 	height: '670px',
					// 	overflowY: 'scroll',
					// 	scrollSnapType: 'y mandatory',
					// } as CSSProperties}
				/>
			</div>

			<ArtModal />
		</>
	);
}
