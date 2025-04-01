import React from 'react';
import { BaseRoom } from './base-room';
import { ArtworkMesh } from './art-work-mesh';
import GalleryModelBase from './gallery-model-base';
import { Gallery as GalleryType } from '@/types/new-gallery';
import { ExhibitionArtwork } from '@/types/exhibition';

export interface GalleryArtwork {
 artwork: ExhibitionArtwork;
 placement: {
   position: number[];
   rotation: number[];
 };
}

export interface GalleryConfig {
  id: string;
  name: string;
  galleryModel: GalleryType;
  artworks: GalleryArtwork[];
}

interface ExhibitionProps {
  config: GalleryConfig;
  visible?: boolean;
  children?: React.ReactNode;
}

export default function Gallery({ config, visible = false, children }: ExhibitionProps) {
  const { xAxis, yAxis, zAxis } = config.galleryModel.dimensions;
  
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
          {/* Display all artworks by passing GalleryArtwork objects directly */}
          {config.artworks.map(artworkItem => (
            <ArtworkMesh
              key={`artwork-${artworkItem.artwork._id}`}
              galleryArtwork={artworkItem}
            />
          ))}
          
          {/* Gallery model */}
          <GalleryModelBase model={config.galleryModel} visible={visible} />
          
          {/* Additional elements */}
          {children}
        </BaseRoom>
      </group>
    </>
  );
}