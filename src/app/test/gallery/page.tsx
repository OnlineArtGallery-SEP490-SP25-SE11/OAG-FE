<<<<<<< HEAD
import dynamic from 'next/dynamic';
import { GalleryLoader } from './components/gallery-loader';
=======
'use client'
import dynamic from "next/dynamic";
import { GalleryLoader } from "./components/gallery-loader";
>>>>>>> 592f1c8501b901be16ad94fdfd08df99a433f9ac

export default function GalleryPage() {
	const ArtGallery = dynamic(
		() => import('./components/art-gallery').then((mod) => mod.ArtGallery),
		{
			ssr: false,
			loading: () => <GalleryLoader />
		}
	);

	return (
		<div className='w-full h-screen'>
			<ArtGallery />
		</div>
	);
}
