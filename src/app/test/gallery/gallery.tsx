'use client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArtPiece } from '@/types/marketplace';
import { Masonry, useInfiniteLoader } from 'masonic';
import { useState } from 'react';
import { fetchArtPiecesByRange } from '../../(public)/[locale]/gallery/api';
import ArtCard from './components/art-card';

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
			threshold: 3
		}
	);
	return (
		<div>
			<TooltipProvider>
				<Masonry
					onRender={loadMore}
					items={artPieces}
					columnGutter={20}
					columnWidth={280}
					overscanBy={1.5}
					render={ArtCard}
				/>
			</TooltipProvider>
		</div>
	);
}

// Use motion.div for smooth transitions
// const FakeCard = memo(({ data }: { data: ArtPiece }) => {
// 	console.log(data);
// 	return (
// 		<motion.div
// 			key={data.id}
// 			initial={{ opacity: 0 }}
// 			animate={{ opacity: 1 }}
// 			exit={{ opacity: 0 }}
// 			transition={{ duration: 0.3 }} // Adjust duration for smoothness
// 		>
// 			<img alt='artwork' src={data.imageUrl} />
// 		</motion.div>
// 	);
// });
