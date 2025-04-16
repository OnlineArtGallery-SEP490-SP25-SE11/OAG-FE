'use client';
import { Canvas } from '@react-three/fiber';
// import { Loader } from './gallery-loader';
import dynamic from 'next/dynamic';
// import { Stats } from '@react-three/drei';
import { Exhibition as ExhibitionType } from '@/types/exhibition';
import { GalleryPreviewLoader } from '@/app/(public)/[locale]/about/components/gallery-preview-loader';
import { Session } from 'next-auth';


interface ExhibitionProps {
    exhibition: ExhibitionType;
    session: Session | null;
}

export default function Exhibition({ exhibition, session }: ExhibitionProps) {
    const Scene = dynamic(() => import('./scene').then((mod) => mod.default), {
        ssr: false,
        loading: () => <GalleryPreviewLoader />
    });
    return (
        <div className='w-full h-screen'>
            <Canvas
                 shadows
                //  dpr={[0.5, 1]} // Limit max DPR to 2
                 performance={{
                //    min: 0.5, // Render at minimum 50% resolution
                //    max: 1,   // Maximum 100% resolution
                //    debounce: 200 // Wait 200ms before adjusting quality
                 }}
                // gl={{
                //     antialias: false,
                //     powerPreference: 'high-performance',
                //     alpha: false,
                //     stencil: false,
                //     depth: true
                // }}
            >
                {/* <Stats /> */}
                <Scene exhibition={exhibition} session={session} />
            </Canvas>
        </div>
    );
}