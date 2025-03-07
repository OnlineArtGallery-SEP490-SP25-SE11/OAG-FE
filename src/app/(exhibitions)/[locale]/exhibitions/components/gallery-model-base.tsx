import React from 'react';
import GalleryModel from './gallery-model';

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
  modelScale: number;
  customElement?: {
    shape: 'box' | 'curved';
    args?: [number, number, number];
    radius?: number;
    height?: number;
    segments?: number;
    arc?: number;
    position: [number, number, number];
    rotation?: [number, number, number];
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
    modelScale: model.modelScale,
    ...(model.customElement && { 
      customElement: model.customElement.shape === 'box' 
        ? {
            shape: 'box' as const,
            args: model.customElement.args || [0, 0, 0],
            position: model.customElement.position,
            rotation: model.customElement.rotation
          }
        : {
            shape: 'curved' as const,
            radius: model.customElement.radius || 0,
            height: model.customElement.height || 0,
            segments: model.customElement.segments,
            arc: model.customElement.arc,
            position: model.customElement.position,
            rotation: model.customElement.rotation
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