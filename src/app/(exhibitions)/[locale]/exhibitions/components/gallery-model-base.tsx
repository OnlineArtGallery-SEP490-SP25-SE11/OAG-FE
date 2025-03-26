import React from 'react';
import GalleryModel from './gallery-model';
import { Vec3 } from '@/types/gallery';

export interface GalleryModelConfig {
  id: string;
  name: string;
  description?: string;
  dimension: {
    xAxis: number;
    yAxis: number;
    zAxis: number;
  };
  wallThickness: number;
  modelPath: string;
  modelPosition: Vec3;
  modelRotation: Vec3;
  modelScale: number;
  customCollider?: {
    shape: 'box' | 'curved';
    args?: Vec3;
    radius?: number;
    height?: number;
    segments?: number;
    arc?: number;
    position: Vec3;
    rotation?: Vec3;
  };
}

interface GalleryModelBaseProps {
  model: GalleryModelConfig;
  visible?: boolean;
}

export default function GalleryModelBase({ model, visible = false }: GalleryModelBaseProps) {
  const config = {
    dimension: model.dimension,
    wallThickness: model.wallThickness,
    modelPath: model.modelPath,
    modelPosition: model.modelPosition,
    modelRotation: model.modelRotation,
    modelScale: model.modelScale,
    ...(model.customCollider && { 
      customCollider: model.customCollider.shape === 'box' 
        ? {
            shape: 'box' as const,
            args: model.customCollider.args || [0, 0, 0],
            position: model.customCollider.position,
            rotation: model.customCollider.rotation
          }
        : {
            shape: 'curved' as const,
            radius: model.customCollider.radius || 0,
            height: model.customCollider.height || 0,
            segments: model.customCollider.segments,
            arc: model.customCollider.arc,
            position: model.customCollider.position,
            rotation: model.customCollider.rotation
          }
    })
  };
  
  return (
    <GalleryModel
      key={`gallery-model-${model.id}`}
      config={config}
      visible={visible}
    />
  );
}