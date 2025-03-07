import React, { useMemo } from 'react';
import { BaseRoom } from './base-room';
import { ArtworkMesh } from './art-work-mesh';
import { calculateWallArtworkPositions } from '@/utils/room-helper';
import { Vec3 } from '@/types/gallery';
import GalleryModelBase, { GalleryModelConfig } from './gallery-model-base';



export interface WallArtwork {
  id: string;
  url: string;
  position: Vec3;
  rotation: Vec3;
}

export interface GalleryConfig {
  id: string;
  name: string;
  galleryModelId: string;
  walls: {
    back?: {
      artworkCount?: number;
      artworks: WallArtwork[];
    };
    front?: {
      artworkCount?: number;
      artworks: WallArtwork[];
    };
    left?: {
      artworkCount?: number;
      artworks: WallArtwork[];
    };
    right?: {
      artworkCount?: number;
      artworks: WallArtwork[];
    };
  };
}

interface ExhibitionProps {
  config: GalleryConfig;
  galleryModel: GalleryModelConfig;
  visible?: boolean;
  children?: React.ReactNode;
}

export default function Gallery({ config, galleryModel, visible = false, children }: ExhibitionProps) {
  const { xAxis, yAxis, zAxis } = galleryModel.dimension;
  
  // Calculate wall artwork positions if needed
  const wallResults = useMemo(() => {
    const roomDimensions = {  xAxis, yAxis, zAxis };
    const results: Record<string, { positions: Vec3[], rotations: Vec3[] }> = {};
    
    // Process each wall
    Object.entries(config.walls).forEach(([wallId, wall]) => {
      if (wall?.artworkCount && wall.artworks.length > 0) {
        const wallDimension = wallId === 'left' || wallId === 'right' ? zAxis : xAxis;
        
        results[wallId] = calculateWallArtworkPositions({
          wallType: wallId as 'back' | 'front' | 'left' | 'right',
          wallDimension,
          artworkCount: wall.artworkCount || wall.artworks.length,
          roomDimensions
        });
      }
    });
    
    return results;
  }, [ xAxis, yAxis, zAxis, config.walls]);
  
  // Prepare artworks for rendering
  const renderedArtworks = useMemo(() => {
    const allArtworks: WallArtwork[] = [];
    
    // Combine artworks from all walls with their calculated positions
    Object.entries(config.walls).forEach(([wallId, wall]) => {
      if (wall?.artworks && wall.artworks.length > 0) {
        const wallPositions = wallResults[wallId];
        
        wall.artworks.forEach((artwork, index) => {
          // Use provided position/rotation or calculated ones
          const position = wallPositions.positions[index];
          const rotation = wallPositions.rotations[index];
          
          if (position) {
            allArtworks.push({
              ...artwork,
              position,
              rotation: rotation || [0, 0, 0] as Vec3,
            });
          }
        });
      }
    });
    
    return allArtworks;
  }, [config.walls, wallResults]);
  
  return (
    <>
      <group>
        <BaseRoom
          key={`exhibition-${config.id}`}
          position={[0, 0, 0]}
          dimensions={{
            width: xAxis,
            height: yAxis,
            depth: zAxis
          }}
        >
          {/* All artworks */}
          {renderedArtworks.map(artwork => (
            <ArtworkMesh
              key={`artwork-${artwork.id}`}
              artwork={artwork}
            />
          ))}
          
          {/* Gallery Model */}
          <GalleryModelBase model={galleryModel} visible={visible} />
          
          {/* Additional elements */}
          {children}
        </BaseRoom>
      </group>
    </>
  );
}