'use client';
import { Canvas } from '@react-three/fiber';
// import { Loader } from './gallery-loader';
import dynamic from 'next/dynamic';
// import { Stats } from '@react-three/drei';
import { Exhibition as ExhibitionType } from '@/types/exhibition';
import { PointerLockControls } from '@react-three/drei';
import { useCallback } from 'react';
import { GalleryPreviewLoader } from '@/app/(public)/[locale]/about/components/gallery-preview-loader';

interface ExhibitionProps {
  exhibition: ExhibitionType;
  isPointerLocked?: boolean;  // New prop
  onPointerUnlock?: () => void;  // New prop
  onPointerLock?: () => void;  // Added prop for locking
}

const Exhibition = ({ exhibition, isPointerLocked = false, onPointerUnlock, onPointerLock }: ExhibitionProps) => {
    const Scene = dynamic(() => import('./scene').then((mod) => mod.default), {
        ssr: false,
        loading: () => <GalleryPreviewLoader />
    });

    // Add handleCanvasClick function
    const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!isPointerLocked && onPointerLock) {
            onPointerLock();
        }
    }, [isPointerLocked, onPointerLock]);

    return (
        <div className='w-full h-screen' onClick={handleCanvasClick}>
            <Canvas
                 shadows
                //  dpr={[0.5, 1]} // Limit max DPR to 2
                 performance={{
                //    min: 0.5, // Render at minimum 50% resolution
                //    max: 1,   // Maximum 100% resolution
                //    debounce: 200 // Wait 200ms before adjusting quality
                 }}
                // gl={{
                //     antialias: false,
                //     powerPreference: 'high-performance',
                //     alpha: false,
                //     stencil: false,
                //     depth: true
                // }}
            >
                {/* <Stats /> */}
                <Scene exhibition={exhibition} />
                {isPointerLocked && (
                    <PointerLockControls 
                      /* your controls props */
                      onUnlock={() => {
                        // Call the parent's callback when unlocked
                        if (onPointerUnlock) onPointerUnlock();
                      }}
                    />
                )}
            </Canvas>
        </div>
    );
};

export default Exhibition;