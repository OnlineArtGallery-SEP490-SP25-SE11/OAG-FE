'use client';

import { Physics } from '@react-three/cannon';
import { PerspectiveCamera, Preload } from '@react-three/drei';
import { GALLERY_CONFIG } from '@/utils/gallery-config';
import Player from './player';
import { PointerLockControls } from '@react-three/drei';
import { Crosshair } from './crosshair';
import { useThree } from '@react-three/fiber';
import { getExhibitions, getGalleryModel } from '@/service/gallery';
import Gallery from './gallery';
import { useQuery } from '@tanstack/react-query';
import { Text } from '@react-three/drei';

export default function Scene({ exhibitionId }: { exhibitionId: string }) {
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

  // Fetch exhibition data
  const { 
    data: exhibition,
    isLoading: isLoadingExhibition,
    error: exhibitionError
  } = useQuery({
    queryKey: ['exhibition', exhibitionId],
    queryFn: () => getExhibitions(exhibitionId)
  });

  // Fetch gallery model, but only after exhibition data is available
  const {
    data: galleryModel,
    isLoading: isLoadingGalleryModel,
    error: galleryModelError
  } = useQuery({
    queryKey: ['galleryModel', exhibition?.galleryModelId],
    queryFn: () => {
      // Add a check to ensure exhibition is defined
      if (!exhibition) {
        throw new Error("Exhibition data not available");
      }
      return getGalleryModel(exhibition.galleryModelId);
    },
    // Only run this query when we have the exhibition data
    enabled: !!exhibition?.galleryModelId,
  });

  // Show loading state
  if (isLoadingExhibition || isLoadingGalleryModel) {
    return (
      <>
        <PerspectiveCamera
          makeDefault
          position={GALLERY_CONFIG.CAMERA.INITIAL_POSITION}
        />
        <ambientLight intensity={0.5} />
        <Text
          position={[0, 1.5, -3]}
          color="black"
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
        >
          Loading Exhibition...
        </Text>
      </>
    );
  }

  // Show error state
  if (exhibitionError || galleryModelError) {
    return (
      <>
        <PerspectiveCamera
          makeDefault
          position={GALLERY_CONFIG.CAMERA.INITIAL_POSITION}
        />
        <ambientLight intensity={0.5} />
        <Text
          position={[0, 1.5, -3]}
          color="red"
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
        >
          Error loading exhibition data
        </Text>
      </>
    );
  }

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
        {exhibition && galleryModel && (
          <Gallery
            config={exhibition}
            galleryModel={galleryModel}
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