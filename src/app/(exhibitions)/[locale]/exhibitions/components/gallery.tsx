import React, { useMemo } from 'react';
import { BaseRoom } from './base-room';
import { ArtworkMesh } from './art-work-mesh';
import GalleryModelBase, { GalleryModelConfig } from './gallery-model-base';

export interface WallArtwork {
  id: string;
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  frame?: { 
    color: string; 
    thickness: number;
  };
}

export interface GalleryConfig {
  id: string;
  name: string;
  galleryModel: GalleryModelConfig;
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
  visible?: boolean;
  children?: React.ReactNode;
}

export default function Gallery({ config, visible = false, children }: ExhibitionProps) {
  const { xAxis, yAxis, zAxis } = config.galleryModel.dimension;
  
  // Chuẩn bị tất cả các tác phẩm nghệ thuật để hiển thị
  const allArtworks = useMemo(() => {
    const artworks: WallArtwork[] = [];
    
    // Thu thập tất cả các tác phẩm từ các bức tường
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(config.walls).forEach(([_wallId, wall]) => {
      if (wall?.artworks && wall.artworks.length > 0) {
        // Sử dụng vị trí và hướng xoay đã được cung cấp (đã xử lý từ scene.tsx)
        wall.artworks.forEach(artwork => {
          artworks.push(artwork);
        });
      }
    });
    
    return artworks;
  }, [config.walls]);
  
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
          {/* Hiển thị tất cả các tác phẩm nghệ thuật */}
          {allArtworks.map(artwork => (
            <ArtworkMesh
              key={`artwork-${artwork.id}`}
              artwork={artwork}
            />
          ))}
          
          {/* Mô hình phòng trưng bày */}
          <GalleryModelBase model={config.galleryModel} visible={visible} />
          
          {/* Các phần tử bổ sung */}
          {children}
        </BaseRoom>
      </group>
    </>
  );
}