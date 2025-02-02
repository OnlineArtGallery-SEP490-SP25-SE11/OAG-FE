import { fetchArtPiecesByRange } from '@/app/(public)/[locale]/gallery/api';
import { ArtPiece } from '@/types/marketplace';
import dynamic from 'next/dynamic';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
const Gallery = dynamic(() => import('./gallery'), {
	ssr: false, // Disable server-side rendering for this component
	loading(loadingProps) {
		if (loadingProps.error) {
			return (
				<div>
					Error loading component
					<button onClick={loadingProps.retry}>Retry</button>
				</div>
			);
		} else if (loadingProps.timedOut) {
			return (
				<div>
					Taking a long time...
					<button onClick={loadingProps.retry}>Retry</button>
				</div>
			);
		} else if (loadingProps.pastDelay) {
			return (
				<ScrollArea className='h-48 w-full rounded-md p-3 shadow-inner prose-sm'>
					<Skeleton className='h-32 w-full mb-4' />
					<Skeleton className='h-32 w-full mb-4' />
					<Skeleton className='h-32 w-full mb-4' />
				</ScrollArea>
			);
		} else {
			return null;
		}
	}
});

const GalleryPage = async () => {
	const initialData = (await fetchArtPiecesByRange(0, 20)) as ArtPiece[];
	return (
		<>
			<Gallery artworks={initialData} />
		</>
	);
};
export default GalleryPage;
