'use client';
import { Physics } from '@react-three/cannon';
import { PerspectiveCamera, Preload } from '@react-three/drei';
import { GALLERY_CONFIG } from '@/utils/gallery-config';
// import { Floor } from "./floor";
// import { GalleryRoom } from "./gallery-room";
// import Light from "./light";
import Player from './player';
import { PointerLockControls } from '@react-three/drei';
import { Crosshair } from './crosshair';
import { useThree } from '@react-three/fiber';
// import { GalleryRoom2 } from "./gallery-room-2";
// import { ModernRoom } from "./modern-room";
// import { GalleryRoom } from './gallery-room';
import { ModernExhibitionRoom } from './rooms/m2-room/m2-room';

export default function Scene() {
	const { set } = useThree();
	const props = {
		maxPolarAngle: Math.PI * 0.7, // Giới hạn góc nhìn lên
		minPolarAngle: Math.PI * 0.3, // Giới hạn góc nhìn xuống
		pointerSpeed: 0.05,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onUpdate: (controls: any) => {
			set({ controls });
		}
	};
	return (
		<>
			{/* <color attach='background' args={['#f0f0f0']} /> */}
			<PerspectiveCamera
				makeDefault
				position={GALLERY_CONFIG.CAMERA.INITIAL_POSITION}
			/>
			{/* <Light /> */}

			<Physics
				gravity={GALLERY_CONFIG.PHYSICS.GRAVITY}
				defaultContactMaterial={GALLERY_CONFIG.PHYSICS.CONTACT_MATERIAL}
			>
				<Player />
				{/* <GalleryRoom /> */}
				<ModernExhibitionRoom />
				{/* <ModernRoom /> */}
			</Physics>

			<Preload all />
			<axesHelper position={[0, 0, 0]} args={[55]} />
			<PointerLockControls {...props} />
			<Crosshair />
		</>
	);
}
