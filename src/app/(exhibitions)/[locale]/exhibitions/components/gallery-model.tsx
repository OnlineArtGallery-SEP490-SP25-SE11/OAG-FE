"use client";
import { useGLTF } from "@react-three/drei";
import { usePlane } from "@react-three/cannon";
import * as THREE from "three";
import { useMemo } from "react";
import { ColliderConfig } from "@/types/gallery";
import { Collider } from "./collider";

interface Dimensions {
  xAxis: number;
  yAxis: number;
  zAxis: number;
}

interface BoxElement {
  shape: "box";
  args: [number, number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
}

interface CurvedElement {
  shape: "curved";
  radius: number;
  height: number;
  segments?: number;
  arc?: number;
  position: [number, number, number];
  rotation?: [number, number, number];
}

type CustomElement = BoxElement | CurvedElement;

interface GalleryConfig {
  dimension: Dimensions;
  wallThickness: number;
  modelPath: string;
  modelScale: number;
  customElement?: CustomElement;
}

interface GalleryModelProps {
  config: GalleryConfig;
  customColliders?: ColliderConfig[];
  visible?: boolean;
}

export default function GalleryModel({
  config,
  customColliders,
  visible = false,
}: GalleryModelProps) {
  const { scene } = useGLTF(config.modelPath);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  const { xAxis, yAxis, zAxis } = config.dimension;
  const { wallThickness, modelScale, customElement } = config;

  const halfX = xAxis / 2;
  const halfZ = zAxis / 2;
  const wallY = yAxis / 2;

  const [ref] = usePlane<THREE.Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    material: { friction: 0.1 },
  }));

  const walls = useMemo(() => {
    const baseWalls: ColliderConfig[] = [
      { shape: "box", position: [0, wallY, -halfZ], rotation: [0, 0, 0], args: [xAxis, yAxis, wallThickness] },
      { shape: "box", position: [0, wallY, halfZ], rotation: [0, 0, 0], args: [xAxis, yAxis, wallThickness] },
      { shape: "box", position: [-halfX, wallY, 0], rotation: [0, 0, 0], args: [wallThickness, yAxis, zAxis] },
      { shape: "box", position: [halfX, wallY, 0], rotation: [0, 0, 0], args: [wallThickness, yAxis, zAxis] },
    ];

    if (customElement) {
      const { position, rotation = [0, 0, 0] } = customElement;
      if (customElement.shape === "box") {
        baseWalls.push({
          shape: "box",
          position,
          rotation,
          args: customElement.args,
        });
      } else {
        const { radius, height, segments = 32, arc = Math.PI * 2 } = customElement;
        baseWalls.push({ shape: "curved", position, rotation, radius, height, segments, arc });
      }
    }

    return baseWalls;
  }, [wallY, halfZ, halfX, xAxis, yAxis, zAxis, wallThickness, customElement]);

  const allColliders = customColliders ? [...walls, ...customColliders] : walls;

  return (
    <>
      <mesh ref={ref} visible={visible} />
      <primitive object={clonedScene} scale={modelScale} position={[0, 0, 0]} />
      {allColliders.map((collider, index) => (
        <Collider key={`collider-${index}`} {...collider} visible={visible} />
      ))}
    </>
  );
}
