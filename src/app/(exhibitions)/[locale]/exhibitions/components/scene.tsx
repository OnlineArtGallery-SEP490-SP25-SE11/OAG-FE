import { Physics } from '@react-three/cannon';
import { PerspectiveCamera, Preload } from '@react-three/drei';
import { GALLERY_CONFIG } from '@/utils/gallery-config';
import Player from './player';
import { PointerLockControls } from '@react-three/drei';
import { Crosshair } from './crosshair';
import { useThree } from '@react-three/fiber';
import Gallery, { GalleryConfig } from './gallery';
import { ExhibitionType } from '@/types/gallery';
import { calculateWallArtworkPositions } from '@/utils/room-helper';

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

  const transformWall = (wall: typeof exhibition.walls.back, wallType: 'back' | 'front' | 'left' | 'right') => {
    if (!wall) return undefined;

    // Tính toán vị trí tự động cho các artwork dựa trên cấu hình phòng
    const roomDimensions = {
      xAxis: exhibition.galleryModel.dimension.xAxis,
      yAxis: exhibition.galleryModel.dimension.yAxis,
      zAxis: exhibition.galleryModel.dimension.zAxis
    };
    
    const wallDimension = 
      (wallType === 'left' || wallType === 'right') 
        ? exhibition.galleryModel.dimension.zAxis
        : exhibition.galleryModel.dimension.xAxis;
    
    const positionData = calculateWallArtworkPositions({
      wallType,
      wallDimension,
      artworkCount: wall.artworkCount,
      roomDimensions
    });

    return {
      artworkCount: wall.artworkCount,
      artworks: wall.artworks.map(artwork => {
        // Nếu artwork đã có vị trí tùy chỉnh, giữ nguyên
        if (artwork.position && artwork.rotation) {
          return {
            ...artwork,
            position: artwork.position,
            rotation: artwork.rotation
          };
        }
        
        // Nếu artwork có positionIndex, sử dụng vị trí đã tính từ positionIndex
        if (artwork.positionIndex !== undefined && 
            artwork.positionIndex >= 0 && 
            artwork.positionIndex < positionData.positions.length) {
          return {
            ...artwork,
            position: positionData.positions[artwork.positionIndex],
            rotation: positionData.rotations[artwork.positionIndex]
          };
        }
        
        // Fallback: sử dụng vị trí mặc định
        return {
          ...artwork,
          position: [0, 0, 0] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number]
        };
      })
    };
  };

  const galleryConfig: GalleryConfig = {
    id: exhibition.id,
    name: exhibition.name,
    galleryModel: exhibition.galleryModel,
    walls: {
      back: transformWall(exhibition.walls.back, 'back'),
      front: transformWall(exhibition.walls.front, 'front'),
      left: transformWall(exhibition.walls.left, 'left'),
      right: transformWall(exhibition.walls.right, 'right')
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

