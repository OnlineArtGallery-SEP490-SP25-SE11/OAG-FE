import { fetchArtPiecesByRange } from '@/app/(public)/[locale]/gallery/api';
import { ArtPiece } from '@/types/marketplace';
import dynamic from 'next/dynamic';
import { LoadingComponent } from '@/components/ui.custom/loading';
const Gallery = dynamic(
	() => import('@/app/(public)/[locale]/gallery/gallery'),
	{
		ssr: false,
		loading(loadingProps) {
			return (
				<LoadingComponent
					error={loadingProps.error}
					timedOut={loadingProps.timedOut}
					pastDelay={loadingProps.pastDelay}
					retry={loadingProps.retry}
				/>
			);
		}
	}
);

const GalleryPage = async () => {
	const initialData = (await fetchArtPiecesByRange(0, 20)) as ArtPiece[];
	return (
		<>
			<Gallery artworks={initialData} />
		</>
	);
};
export default GalleryPage;
