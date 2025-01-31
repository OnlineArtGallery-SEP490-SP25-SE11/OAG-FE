import { fetchArtPiecesByRange } from '@/app/(public)/[locale]/gallery/api';
import { ArtPiece } from '@/types/marketplace';
import dynamic from 'next/dynamic';
const Gallery = dynamic(() => import('@/app/test/gallery/gallery'), {
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
			return <div>Loading...</div>;
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
