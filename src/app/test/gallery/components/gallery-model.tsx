'use client';
import { useGLTF } from '@react-three/drei';
import { usePlane } from '@react-three/cannon';

import * as THREE from 'three';

useGLTF.preload('/models/art_gallery/art_gallery.gltf');
export function GalleryModel() {
	const { scene } = useGLTF('/models/art_gallery/art_gallery.gltf');
	const paintingTexture = new THREE.TextureLoader().load('/images/demo.jpg');

	scene.traverse((child) => {
		if (child instanceof THREE.Mesh) {
			if (child.name.includes('Painting')) {
				console.log(child);
				child.material.map = paintingTexture;
			}
		}
	});

	//log number of children have painting in name
	console.log(
		scene.children.filter((child) => child.name.includes('Painting')).length
	);

	// Add invisible floor
	const [ref] = usePlane<THREE.Mesh>(() => ({
		//mặt phẳng
		rotation: [-Math.PI / 2, 0, 0], //xoay mặt phẳng 90 độ
		position: [0, 0, 0], //vị trí mặt phẳng
		material: {
			friction: 0.1
		}
	}));

	return (
		<>
			<mesh ref={ref} visible={false} />
			<primitive object={scene} scale={0.5} position={[0, 0, 0]} />
		</>
	);
}
