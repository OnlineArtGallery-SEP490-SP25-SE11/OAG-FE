import React, { useMemo } from "react";
import { BaseRoom } from "../../../../(exhibitions)/[locale]/exhibitions/components/base-room";
import { Wall } from "../../../../(exhibitions)/[locale]/exhibitions/components/wall";
import { RoomFloor } from "../../../../(exhibitions)/[locale]/exhibitions/components/room-floor";
import { GALLERY_CONFIG } from "@/utils/gallery-config";
import { Vec3 } from "@/types/gallery";
import { ArtworkMesh } from "../../../../(exhibitions)/[locale]/exhibitions/components/art-work-mesh";
// import GlassWindow from "./model/glass-window";

import { RoomLights } from '../../../../(exhibitions)/[locale]/exhibitions/components/room-light';

import { LIGHT_PRESETS } from '@/utils/light-config';
import { ARTWORK_URL, TEXTURE_URL } from '@/utils/constants';
import { useCloudinaryAsset } from '@/hooks/useCloudinaryAsset';
// import OveralLight from "./overal-light";

export function ModernRoom() {
    const { X_AXIS, Y_AXIS, Z_AXIS } = GALLERY_CONFIG.ROOM;

    // Load textures
    const marbleFloorTexture = useCloudinaryAsset(
        TEXTURE_URL.PINE_WOOD_TEXTURE
    );
    const concreteWallTexture = useCloudinaryAsset(TEXTURE_URL.BRICK_WALL);

    // Room configuration
    const room = useMemo(() => ({
        position: [0, 0, 0] as Vec3,
        color: "#e8e8e8",
        floor: {
            component: (
                <RoomFloor
                    position={[0, 0, 0]}
                    colliderPosition={[0, 0, 0]}
                    args={[X_AXIS, Z_AXIS, 0.2]}
                    material={{
                        texture: marbleFloorTexture,
                        color: "#ffffff",
                        roughness: 0.3, // More reflective
                        // metalness: 0.1  // Slight metallic feel
                    }}
                />
            ),
        },
        ceiling: {
            component: (
                <mesh
                    castShadow
                    rotation={[Math.PI / 2, 0, 0]}
                    position={[0, Y_AXIS, 0]}
                    receiveShadow
                >
                    <boxGeometry args={[X_AXIS, Z_AXIS, 0.3]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.7} />
                </mesh>
            ),
        },
        walls: {
            // Back wall with a modern pattern
            back: (
                <group>
                    <Wall
                        position={[0, Y_AXIS / 2, -Z_AXIS / 2]}
                        dimensions={{ width: X_AXIS, height: Y_AXIS, depth: 0.3 }}
                        material={{
                            color: "#e8e8e8",
                            texture: concreteWallTexture,
                            roughness: 0.7,
                            metalness: 0.2,
                        }}
                    />
                    {/* Decorative panel */}
                    <Wall
                        position={[0, Y_AXIS / 2, -Z_AXIS / 2 + 0.2]}
                        dimensions={{ width: X_AXIS * 0.8, height: Y_AXIS * 0.6, depth: 0.1 }}
                        material={{
                            color: "#2a2a2a",
                            roughness: 0.3,
                            metalness: 0.5,
                        }}
                    />
                </group>
            ),
            // Left wall with windows
            left: (
                <group>
                    <Wall
                        position={[-X_AXIS / 2, Y_AXIS / 2, 0]}
                        rotation={[0, Math.PI / 2, 0]}
                        dimensions={{ width: Z_AXIS, height: Y_AXIS, depth: 0.3 }}
                        material={{
                            color: "#e8e8e8",
                            texture: concreteWallTexture,
                            roughness: 0.7,
                            metalness: 0.2,
                        }}
                    />
                    {/* Windows */}
                    {/* {[-Z_AXIS / 4, Z_AXIS / 4].map((zPos, index) => (
                        <GlassWindow
                            key={`window_${index}`}
                            position={[-X_AXIS / 2 + 0.3, Y_AXIS / 2, zPos]}
                            rotation={[0, Math.PI / 2, 0]}
                            scale={[1.5, 1.5, 1.5]}
                        />
                    ))} */}
                </group>
            ),
            // Right wall with artwork
            right: (
                <Wall
                    position={[X_AXIS / 2, Y_AXIS / 2, 0]}
                    rotation={[0, -Math.PI / 2, 0]}
                    dimensions={{ width: Z_AXIS, height: Y_AXIS, depth: 0.3 }}
                    material={{
                        color: "#e8e8e8",
                        texture: concreteWallTexture,
                        roughness: 0.7,
                        metalness: 0.2,
                    }}
                />
            ),
        },
        artworks: [
            {
                id: 1,
                url: ARTWORK_URL.ARTWORK_1,
                position: [-X_AXIS / 2 + 0.2, Y_AXIS / 2, -Z_AXIS / 4],
                rotation: [0, Math.PI / 2, 0]
            },
            { 
                id: 2, 
                url: ARTWORK_URL.ARTWORK_2, 
                position: [-X_AXIS / 2 + 0.2, Y_AXIS / 2, Z_AXIS / 4],
                rotation: [0, Math.PI / 2, 0]
            },

            {
                id: 3,
                url: ARTWORK_URL.ARTWORK_3,
                position: [X_AXIS / 2 - 0.2, Y_AXIS / 2, -Z_AXIS / 3],
                rotation: [0, -Math.PI / 2, 0]

            },
            {
                id: 4,
                url: ARTWORK_URL.ARTWORK_4,
                position: [X_AXIS / 2 - 0.2, Y_AXIS / 2, Z_AXIS / 3],
                rotation: [0, -Math.PI / 2, 0]

            }
        ]
    }),
        [X_AXIS, Y_AXIS, Z_AXIS, marbleFloorTexture, concreteWallTexture]
    );

    return (
        <>
            <RoomLights config={LIGHT_PRESETS.MODERN} />
            {/* <OveralLight /> */}
            <BaseRoom
                position={room.position}
                dimensions={{
                    width: X_AXIS,
                    height: Y_AXIS,
                    depth: Z_AXIS
                }}
                floor={room.floor.component}
                ceiling={room.ceiling.component}
                walls={room.walls}
            >
                {/* Artworks */}
                {room.artworks.map((artwork) => (
                    <ArtworkMesh
                        key={artwork.id}
                        artwork={{
                            ...artwork,
                            position: artwork.position as [
                                number,
                                number,
                                number
                            ] // Type assertion to Vec3
                            , rotation: artwork.rotation as [
                                number,
                                number,
                                number
                            ] // Type assertion to Vec3
                        }}
                    />
                ))}
            </BaseRoom>
        </>
    );
}
