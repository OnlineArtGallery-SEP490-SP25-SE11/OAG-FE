"use client";
import { useGLTF } from "@react-three/drei";
import { usePlane } from "@react-three/cannon";
import * as THREE from "three";
import { useMemo } from "react";
import { ColliderConfig, Vec3 } from "@/types/gallery";
import { Collider } from "./collider";

interface Dimensions {
  xAxis: number;
  yAxis: number;
  zAxis: number;
}

interface BoxElement {
  shape: "box";
  args: Vec3;
  position: Vec3;
  rotation?: Vec3;
}

interface CurvedElement {
  shape: "curved";
  radius: number;
  height: number;
  segments?: number;
  arc?: number;
  position: Vec3;
  rotation?: Vec3;
}

type customCollider = BoxElement | CurvedElement;

interface GalleryConfig {
  dimension: Dimensions;
  wallThickness: number;
  modelPath: string;
  modelScale: number;
  modelPosition: Vec3;
  modelRotation: Vec3;
  customCollider?: customCollider;
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
  const { wallThickness, modelScale, customCollider, modelPosition, modelRotation } = config;

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
      //back wall
      { shape: "box", position: [0, wallY, -halfZ], rotation: [0, 0, 0], args: [xAxis, yAxis, wallThickness] },
      //front wall
      { shape: "box", position: [0, wallY, halfZ], rotation: [0, 0, 0], args: [xAxis, yAxis, wallThickness] },
      //left wall
      { shape: "box", position: [-halfX, wallY, 0], rotation: [0, 0, 0], args: [wallThickness, yAxis, zAxis] },
      //right wall
      { shape: "box", position: [halfX, wallY, 0], rotation: [0, 0, 0], args: [wallThickness, yAxis, zAxis] },
    ];

    if (customCollider) {
      const { position, rotation = [0, 0, 0] } = customCollider;
      if (customCollider.shape === "box") {
        baseWalls.push({
          shape: "box",
          position,
          rotation,
          args: customCollider.args,
        });
      } else {
        const { radius, height, segments = 32, arc = Math.PI * 2 } = customCollider;
        baseWalls.push({ shape: "curved", position, rotation, radius, height, segments, arc });
      }
    }

    return baseWalls;
  }, [wallY, halfZ, halfX, xAxis, yAxis, zAxis, wallThickness, customCollider]);

  const allColliders = customColliders ? [...walls, ...customColliders] : walls;

  return (
    <>
      <mesh ref={ref} visible={visible} />
      <primitive object={clonedScene} scale={modelScale} position={modelPosition} rotation={modelRotation}/>
      {allColliders.map((collider, index) => (
        <Collider key={`collider-${index}`} {...collider} visible={visible} />
      ))}
    </>
  );
}
