import { Physics } from '@react-three/cannon';
import { PerspectiveCamera, Preload } from '@react-three/drei';
import { GALLERY_CONFIG } from '@/utils/gallery-config';
import Player from './player';
import { PointerLockControls } from '@react-three/drei';
import { Crosshair } from './crosshair';
import { useThree } from '@react-three/fiber';
import Gallery, { GalleryConfig } from './gallery';
import { ExhibitionType } from '@/types/gallery';

export default function Scene({ exhibition }: { exhibition: ExhibitionType }) {
  const { set } = useThree();
  const props = {
    maxPolarAngle: Math.PI * 0.7, // Limit looking up
    minPolarAngle: Math.PI * 0.3, // Limit looking down
    pointerSpeed: 0.05,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate: (controls: any) => {
      set({ controls });
    }
  };

  const transformWall = (wall: typeof exhibition.walls.back) => {
    if (!wall) return undefined;

    return {
      artworkCount: wall.artworkCount,
      artworks: wall.artworks.map(artwork => ({
        ...artwork,
        position: artwork.position || [0, 0, 0],
        rotation: artwork.rotation || [0, 0, 0]
      }))
    };
  };

  const galleryConfig: GalleryConfig = {
    id: exhibition.id,
    name: exhibition.name,
    galleryModel: exhibition.galleryModel,
    walls: {
      back: transformWall(exhibition.walls.back),
      front: transformWall(exhibition.walls.front),
      left: transformWall(exhibition.walls.left),
      right: transformWall(exhibition.walls.right)
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
      {/* frame art color */}
      <ambientLight intensity={2} color={'ffffff'} /> 
      <Physics
        gravity={GALLERY_CONFIG.PHYSICS.GRAVITY}
        defaultContactMaterial={GALLERY_CONFIG.PHYSICS.CONTACT_MATERIAL}
      >
        <Player />
        {exhibition && (
          <Gallery
            config={galleryConfig}
            visible={false}
          />
        )}
      </Physics>

      <Preload all />
      {/* <axesHelper position={[0, 0, 0]} args={[55]} /> */}
      <PointerLockControls {...props} />
      <Crosshair />
    </>
  );
}