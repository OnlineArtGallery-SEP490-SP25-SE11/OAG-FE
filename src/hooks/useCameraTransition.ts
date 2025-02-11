import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import gsap from 'gsap';
import { useCameraStore } from '@/store/cameraStore';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export function useCameraTransition() {
	const { camera } = useThree();
	const { controls } = useThree<{ controls: PointerLockControls }>();
	const { targetPosition, setIsLocked } = useCameraStore();

	useEffect(() => {
		if (!targetPosition) {
			// Reset camera when target is null
			if (controls) {
				controls.enabled = true;
				controls.lock();
			}
			setIsLocked(false);

			//reset FOV
			// camera.fov = 75;
			// camera.updateProjectionMatrix();
			return;
		}

		// Lock controls during transition
		if (controls) {
			controls.enabled = false;
			controls.unlock();
		}
		setIsLocked(true);

		// Calculate viewing position
		const viewPosition = targetPosition.clone();
		viewPosition.z += 2; // Stand back from artwork
		viewPosition.y += 0.2; // Slight elevation

		const tl = gsap.timeline({
			onComplete: () => {
				if (controls) {
					controls.enabled = false;
					controls.unlock();
				}
			}
		});

		// Camera movement and FOV animation
		tl.to(camera.position, {
			x: viewPosition.x,
			y: viewPosition.y,
			z: viewPosition.z,
			duration: 1.5,
			ease: 'power3.inOut',
			onUpdate: () => {
				const currentLookAt = camera.position
					.clone()
					.lerp(targetPosition, 0.1);
				camera.lookAt(currentLookAt);
			}
		});
		// .to(camera, {
		//   fov: 50, // Narrower FOV for closer view
		//   duration: 0.5,
		//   ease: "power2.inOut",
		//   onUpdate: () => {
		//     camera.updateProjectionMatrix();
		//   }
		// })

		return () => {
			if (tl) {
				tl.kill();
				tl.clear();
			}
		};
	}, [targetPosition, camera, controls, setIsLocked]);
}
