'use client';

import { Suspense, useContext, useMemo } from 'react';
import { usePlane } from '@react-three/cannon';
import { GalleryTemplateContext } from './gallery-template-creator';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';

// Extract GLTF loading into a separate component to avoid conditional hook calls
function GLTFModel({ path, scale = 1, rotation = [0, 0, 0], position = [0, 0, 0] }: { path: string; scale?: number; rotation?: [number, number, number]; position?: [number, number, number] }) {
  // useGLTF is always called here, no conditional logic before it
  const { scene } = useGLTF(path);

  return (
    <primitive
      object={scene.clone()}
      scale={[scale, scale, scale]}
      rotation={rotation}
      position={position}
    />
  );
}

// Fallback component for when model loading fails
function ModelFallback({ scale = 1 }: { scale?: number }) {
  return (
    <mesh scale={[scale, scale, scale]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

// Main Model component that handles conditional rendering
function Model({ path, scale = 1, rotation = [0, 0, 0], position = [0, 0, 0] }: {
  path: string;
  scale?: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
}) {  // Check path validity without using hooks conditionally
  const isValidPath = useMemo(() => Boolean(path && path.trim()), [path]);

  // If path is invalid, return fallback
  if (!isValidPath) {
    console.error("No model path provided");
    return <ModelFallback scale={scale} />;
  }

  // Properly wrap the GLTFModel in error boundary and suspense
  return (
    <ErrorBoundary
      fallback={<ModelFallback scale={scale} />}
      onError={(error) => console.error(`Error loading model from ${path}:`, error)}
    >
      <Suspense fallback={
        <mesh scale={[scale, scale, scale]} position={position}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial wireframe color="gray" />
        </mesh>
      }>
        <GLTFModel path={path} scale={scale} rotation={rotation} position={position} />
      </Suspense>
    </ErrorBoundary>
  );
}

// Scene component - NO Canvas here, just the scene contents
export default function GalleryPreview({ showColliders }: { showColliders: boolean }) {
  const { templateData } = useContext(GalleryTemplateContext);
  const { 
    dimensions,
    wallThickness,
    wallHeight,
    modelPath,
    modelScale,
    modelRotation,
    modelPosition,
    customColliders 
  } = templateData;
  // Define basic scene elements
  const halfX = dimensions.xAxis / 2;
  const halfZ = dimensions.zAxis / 2;
  const wallY = wallHeight / 2;

  // Create floor plane - this hook is now properly used inside the parent's Canvas and Physics components
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ref] = usePlane<THREE.Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    material: { friction: 0.1 }
  }));

  return (
    <>

      {/* Floor */}
      {/* Floor - View Helper Grid */}
      <gridHelper
        args={[
          Math.max(dimensions.xAxis, dimensions.zAxis), // size of the grid
          Math.max(dimensions.xAxis, dimensions.zAxis) / 2, // divisions
          "#666666", // color of center line
          "#444444" // color of grid
        ]}
        rotation={[0, Math.PI / 2, 0]}
      />


      {/* Walls - if no model is loaded */}
      {/* {!modelPath && ( */}
      <>
        {/* Back wall */}
        <mesh position={[0, wallY, -halfZ]} castShadow receiveShadow>
          <boxGeometry args={[dimensions.xAxis, wallHeight, wallThickness]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />          </mesh>

        {/* Front wall */}
        <mesh position={[0, wallY, halfZ]} castShadow receiveShadow>
          <boxGeometry args={[dimensions.xAxis, wallHeight, wallThickness]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />          </mesh>

        {/* Left wall */}
        <mesh position={[-halfX, wallY, 0]} castShadow receiveShadow>
          <boxGeometry args={[wallThickness, wallHeight, dimensions.zAxis]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />          </mesh>

        {/* Right wall */}
        <mesh position={[halfX, wallY, 0]} castShadow receiveShadow>
          <boxGeometry args={[wallThickness, wallHeight, dimensions.zAxis]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />          </mesh>
      </>
      {/* )} */}

      {/* Custom colliders - visible if showColliders is true */}
      {showColliders && customColliders.map((collider, index) => {
        if (collider.shape === 'box') {
          return (
            <mesh
              key={`collider-${index}`}
              position={collider.position}
              rotation={collider.rotation}
            >
              <boxGeometry args={collider.args} />
              <meshStandardMaterial color="red" transparent opacity={0.5} />
            </mesh>
          );
        } else if (collider.shape === 'curved') {
          return (
            <mesh
              key={`collider-${index}`}
              position={collider.position}
              rotation={collider.rotation}
            >
              <cylinderGeometry
                args={[
                  collider.radius,
                  collider.radius,
                  collider.height,
                  collider.segments || 32,
                  1,
                  false,
                  0,
                  collider.arc || Math.PI * 2
                ]}
              />
              <meshStandardMaterial color="blue" transparent opacity={0.5} />
            </mesh>
          );
        }
        return null;
      })}

      {/* Load 3D model if available */}
      {modelPath && (
        <Model
          path={modelPath}
          scale={modelScale}
          rotation={modelRotation}
          position={modelPosition}
        />
      )}
    </>
  );
}