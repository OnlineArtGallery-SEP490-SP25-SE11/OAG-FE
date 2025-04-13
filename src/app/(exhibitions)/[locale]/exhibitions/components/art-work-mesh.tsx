'use client'
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Mesh, Vector3, BoxGeometry, PlaneGeometry, MeshStandardMaterial, MeshBasicMaterial} from "three";
import { Vec3 } from "@/types/gallery";
import { useRaycaster } from "@/hooks/useRaycaster";
import { ArtworkPortal } from "./artwork-portal";
import { ArtworkInfoOverlay } from './artwork-info-overlay';
import { useCameraTransition } from '@/hooks/useCameraTransition';
import { useCameraStore } from '@/store/cameraStore';
import { TEXTURE_URL } from '@/utils/constants';
import { useCloudinaryAsset } from '@/hooks/useCloudinaryAsset';
import { GalleryArtwork } from './gallery';

// Constants
const FRAME_THICKNESS = 0.1;
const BASE_HEIGHT = 2;
const METALNESS = 0.1;
const ROUGHNESS = 0.8;
const ENV_MAP_INTENSITY = 0.5;

// Props for frame mesh
interface FrameMeshProps {
    width: number;
    height: number;
}

// Define geometry creation functions for the frame
const FRAME_GEOMETRY = {
    createHorizontal: (width: number) =>
        new BoxGeometry(width + FRAME_THICKNESS * 2, FRAME_THICKNESS, 0.1),
    createVertical: (height: number) =>
        new BoxGeometry(FRAME_THICKNESS, height, 0.1)
};

// Frame component
const FrameMesh: React.FC<FrameMeshProps> = React.memo(({ width, height}) => {
    const frameTexture = useCloudinaryAsset(TEXTURE_URL.FLOOR);

    const frameMaterial = useMemo(
        () =>
            new MeshStandardMaterial({
                map: frameTexture,
                metalness: METALNESS,
                roughness: ROUGHNESS,
                envMapIntensity: ENV_MAP_INTENSITY
            }),
        [frameTexture]
    );

    const geometries = useMemo(
        () => ({
            horizontal: FRAME_GEOMETRY.createHorizontal(width),
            vertical: FRAME_GEOMETRY.createVertical(height)
        }),
        [width, height]
    );

    return (
        <group>
            <mesh
                position={[0, height / 2 + FRAME_THICKNESS / 2, 0]}
                geometry={geometries.horizontal}
                material={frameMaterial}
            />
            <mesh
                position={[0, -height / 2 - FRAME_THICKNESS / 2, 0]}
                geometry={geometries.horizontal}
                material={frameMaterial}
            />
            <mesh
                position={[-width / 2 - FRAME_THICKNESS / 2, 0, 0]}
                geometry={geometries.vertical}
                material={frameMaterial}
            />
            <mesh
                position={[width / 2 + FRAME_THICKNESS / 2, 0, 0]}
                geometry={geometries.vertical}
                material={frameMaterial}
            />
        </group>
    );
});

// Main artwork component
export const ArtworkMesh: React.FC<{ galleryArtwork: GalleryArtwork }> = React.memo(
    ({ galleryArtwork }) => {
        const [showDetails, setShowDetails] = useState(false);
        const [shouldShowModal, setShouldShowModal] = useState(false);
        const meshRef = useRef<Mesh>(null);
        const { setTargetPosition } = useCameraStore();
        useCameraTransition();

        const { artwork, placement } = galleryArtwork;
        
        const handleIntersect = useCallback(() => {
            if (!meshRef.current) return;

            const worldPosition = new Vector3();
            meshRef.current.getWorldPosition(worldPosition);

            setTargetPosition(worldPosition);
            setShowDetails(true);

            setTimeout(() => {
                setShouldShowModal(true);
            }, 1000);
        }, [meshRef, setTargetPosition]);

        const handleClose = useCallback(() => {
            setShouldShowModal(false);
            setShowDetails(false);
            setTargetPosition(null);
        }, [setTargetPosition]);

        const handleMiss = useCallback(() => {
            if (showDetails) {
                handleClose();
            }
        }, [showDetails, handleClose]);

        useRaycaster({
            meshRef,
            onIntersect: handleIntersect,
            onMiss: handleMiss
        });

        const texture = useCloudinaryAsset(artwork.url);
        // texture.magFilter = LinearFilter;
        // texture.minFilter = LinearMipMapLinearFilter;
        texture.colorSpace = 'srgb';

        const artworkMaterial = useMemo(
            () =>
                new MeshBasicMaterial({
                    map: texture,
                    toneMapped: false,
                }),
            [texture]
        );

        const { geometry, dimensions } = useMemo(() => {
            const { width, height } = texture.image;
            const aspectRatio = width / height;
            const dims = {
                width: BASE_HEIGHT * aspectRatio,
                height: BASE_HEIGHT
            };

            return {
                geometry: new PlaneGeometry(dims.width, dims.height),
                dimensions: dims
            };
        }, [texture]);

        return (
            <group 
                position={placement.position as Vec3} 
                rotation={placement.rotation as Vec3 || [0, 0, 0]}>
                <mesh
                    ref={meshRef}
                    geometry={geometry}
                    material={artworkMaterial}
                />

                <FrameMesh
                    width={dimensions.width}
                    height={dimensions.height}
                />

                {shouldShowModal && (
                    <ArtworkPortal isOpen={true} onClose={handleClose}>
                        <ArtworkInfoOverlay
                            title={artwork.title}
                            description={artwork.description}
                            onClose={() => {
                                setShouldShowModal(false);
                                setTargetPosition(null);
                                setShowDetails(false);
                            }}
                        />
                    </ArtworkPortal>
                )}
            </group>
        );
    }
);

FrameMesh.displayName = 'FrameMesh';
ArtworkMesh.displayName = 'ArtworkMesh';