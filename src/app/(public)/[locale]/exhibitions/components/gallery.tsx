'use client';
import { Canvas } from '@react-three/fiber';
import { Loader } from './gallery-loader';
import dynamic from 'next/dynamic';
import { Stats } from '@react-three/drei';

export default function Gallery() {
	const Scene = dynamic(() => import('./scene').then((mod) => mod.default), {
		ssr: false,
		loading: () => <Loader />
	});

	return (
		<div className='w-full h-screen'>
			<Canvas
				//  shadows
				 dpr={[1, 1]} // Limit max DPR to 2
				 performance={{
				   min: 0.5, // Render at minimum 50% resolution
				   max: 1,   // Maximum 100% resolution
				   debounce: 200 // Wait 200ms before adjusting quality
				 }}
				gl={{
					antialias: false, // Disable antialiasing for performance
					powerPreference: 'high-performance',
					alpha: false,
					stencil: false,
					depth: true
				}}
			>
				<Stats/>
				<Scene />
			</Canvas>
		</div>
	);
}
