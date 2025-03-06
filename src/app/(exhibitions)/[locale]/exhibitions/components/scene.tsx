'use client';
import { Physics } from '@react-three/cannon';
import { PerspectiveCamera, Preload } from '@react-three/drei';
import { GALLERY_CONFIG } from '@/utils/gallery-config';
import Player from './player';
import { PointerLockControls } from '@react-three/drei';
import { Crosshair } from './crosshair';
import { useThree } from '@react-three/fiber';
import { RoomSelector } from './room-selector';
// import  LightControl from './light-control';
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
			<PerspectiveCamera
				makeDefault
				position={GALLERY_CONFIG.CAMERA.INITIAL_POSITION}
			/>
			{/* <Light /> */}
			{/* <LightControl /> */}
			
			<Physics
				gravity={GALLERY_CONFIG.PHYSICS.GRAVITY}
				defaultContactMaterial={GALLERY_CONFIG.PHYSICS.CONTACT_MATERIAL}
			>
				<Player />
				<RoomSelector roomId={'modern-a1'} />
			</Physics>

			<Preload all />
			{/* <axesHelper position={[0, 0, 0]} args={[55]} /> */}
			<PointerLockControls {...props} />
			<Crosshair />
		</>
	);
}
