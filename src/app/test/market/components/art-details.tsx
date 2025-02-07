'use client';

import { useEffect, useState } from 'react';
import { ArtPiece } from '@/types/marketplace';
import { fetchArtPieceById } from '@/app/test/market/api';
import ArtCanvas from '@/components/ui.custom/art-image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export function ArtDetailsSkeleton() {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-start'>
			<div className='relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900 max-h-[80vh] w-full'>
				<Skeleton className='h-full w-full' />
			</div>
			<div className='space-y-6'>
				<div>
					<Skeleton className='h-8 w-3/4 mb-2' />
					<Skeleton className='h-6 w-1/2' />
				</div>
				<div className='h-72 w-full rounded-md p-4 border dark:border-gray-700'>
					<Skeleton className='h-full w-full' />
				</div>
				<div className='flex items-center justify-between'>
					<Skeleton className='h-8 w-1/4' />
					<Skeleton className='h-10 w-32 rounded-md' />
				</div>
				<div className='space-y-2'>
					<Skeleton className='h-5 w-1/4 mb-2' />
					<ul className='space-y-2'>
						{[...Array(3)].map((_, index) => (
							<li key={index}>
								<Skeleton className='h-4 w-3/4' />
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

function ArtDetails() {
	const [art, setArt] = useState<ArtPiece | null>(null);

	useEffect(() => {
		const fetchArt = async () => {
			const res = await fetchArtPieceById();
			setArt(res);
		};
		fetchArt();
		return () => {
			setArt(null);
		};
	}, []);

	if (!art)
		return (
			<div>
				<ArtDetailsSkeleton />
			</div>
		);

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-start'>
			<div className='relative w-full aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900 max-h-[80vh]'>
				<ArtCanvas
					url={art.imageUrl}
					width={art.width}
					height={art.height}
				/>
			</div>
			<div className='space-y-6'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2'>
						{art.title}
					</h1>
					<p className='text-lg text-gray-600 dark:text-gray-400'>
						By {art.artist}
					</p>
				</div>

				<ScrollArea className='h-72 w-full rounded-md p-4 mb-4 border dark:border-gray-700'>
					<p className='text-sm text-gray-700 dark:text-gray-300'>
						{art.description}
					</p>
				</ScrollArea>

				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<span className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
							${art.price.toFixed(2)} USD
						</span>
						<button
							type='button'
							className='rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white
                         hover:bg-indigo-500 focus:outline-none focus:ring-2
                         focus:ring-indigo-600 focus:ring-offset-2
                         dark:bg-indigo-500 dark:hover:bg-indigo-400'
						>
							Add to Cart
						</button>
					</div>

					<div className='mt-4'>
						<h3 className='text-sm font-medium text-gray-900 dark:text-gray-100 mb-2'>
							Artwork Details
						</h3>
						<ul className='space-y-2 text-sm text-gray-600 dark:text-gray-400'>
							<li>
								Dimensions: {art.width} x {art.height} px
							</li>
							<li>Medium: Digital Art</li>
							<li>Unique Piece</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ArtDetails;
