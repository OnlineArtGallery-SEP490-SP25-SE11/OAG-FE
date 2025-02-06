'use client';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls, Environment } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Player } from './player';
import { GalleryModel } from './gallery-model';
import { Loader } from './loader';

export function ArtGallery() {
	return (
		<Canvas shadows camera={{ fov: 45 }}>
			<ambientLight intensity={0.5} />
			<directionalLight position={[10, 10, 5]} intensity={1} castShadow />
			<Suspense fallback={<Loader />}>
				<Physics
					gravity={[0, -30, 0]}
					defaultContactMaterial={{
						friction: 0.1,
						restitution: 0.1
					}}
				>
					<Player />
					<GalleryModel />
				</Physics>
				<Environment preset='sunset' background />
			</Suspense>
			<PointerLockControls />
		</Canvas>
	);
}
