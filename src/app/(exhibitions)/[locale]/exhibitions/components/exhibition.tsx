// src/app/(exhibitions)/[locale]/exhibitions/[linkname]/components/Exhibition.tsx
'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { Exhibition as ExhibitionType } from '@/types/exhibition';
import { GalleryPreviewLoader } from '@/app/(public)/[locale]/about/components/gallery-preview-loader';
import { Session } from 'next-auth';
import { InstructionOverlay } from './instructions-overlay';
import { useRouter } from 'next/navigation';
import { useCameraStore } from '@/store/cameraStore'; // <--- Import the store

// Delay in milliseconds before requesting pointer lock
const POINTER_LOCK_DELAY = 200;

// --- Dynamically import the Scene ---
const Scene = dynamic(() => import('./scene').then((mod) => mod.default), {
    ssr: false,
    loading: () => <GalleryPreviewLoader />,
});

export default function Exhibition({ exhibition, session }: ExhibitionProps) {
    // Start inactive to force user interaction first? Or active? Let's assume active default for now.
    const [active, setActive] = useState(true);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const lockRequestTimerRef = useRef<NodeJS.Timeout | null>(null);
    const storeIsLocked = useCameraStore(state => state.isLocked);

    // Get state setters/getters from the store - we only need the setter for resets here
    const { setTargetPosition, setIsTransitioningBack} = useCameraStore();

    // --- Effect for Keyboard Controls (Escape key) ---
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check store state BEFORE deciding to deactivate

            if (event.key === 'Escape') {
                if (storeIsLocked) {
                    // If viewing artwork, Escape should close the artwork view first
                    console.log("Escape pressed while viewing artwork - closing artwork view.");
                    setTargetPosition(null); // This triggers useCameraTransition to reset
                    // Don't set active=false here, let the transition finish naturally
                } else if (active) {
                    // If not viewing artwork, and controls are active, then deactivate controls
                    console.log("Escape key pressed while gallery active, setting active=false");
                    setActive(false);
                    // Pointer lock release will be handled by the state change effect
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
        // Dependencies: active state and the store setter (stable)
    }, [active, setTargetPosition]);

    // --- Effect for Pointer Lock Management ---
    useEffect(() => {
        const handlePointerLockChange = () => {
            const isPointerLocked = document.pointerLockElement !== null;
            // Get potentially needed states directly inside handler for latest values
            const currentStoreState = useCameraStore.getState();
            const storeIsLockedNow = currentStoreState.isLocked;
            const storeIsTransitioningBack = currentStoreState.isTransitioningBack;

            console.log(`POINTER LOCK CHANGE: PointerLocked: ${isPointerLocked}, ComponentActive: ${active}, StoreIsLocked(ArtworkView): ${storeIsLockedNow}, StoreIsTransitioningBack: ${storeIsTransitioningBack}`);

            if (isPointerLocked) {
                // --- LOCK ACQUIRED ---
                console.log("Pointer lock acquired.");
                // If we were transitioning back, that transition is now complete (lock succeeded)
                if (storeIsTransitioningBack) {
                    console.log("Clearing isTransitioningBack flag.");
                    setIsTransitioningBack(false);
                }
                // Ensure component is active? Might not be necessary if handleResume is robust.
                // if (!active) setActive(true); // Use with caution

            } else {
                // --- LOCK RELEASED / NOT HELD ---
                console.log("Pointer lock released or not held.");
                // Only deactivate if:
                // 1. Component thinks it should be active (`active`)
                // 2. We are NOT viewing artwork (`!storeIsLockedNow`)
                // 3. We are NOT in the specific transition back phase (`!storeIsTransitioningBack`)
                if (active && !storeIsLockedNow && !storeIsTransitioningBack) {
                    console.warn("Pointer lock released externally (or failed initial lock?), setting active=false");
                    setActive(false); // Show overlay
                } else if (active && storeIsTransitioningBack) {
                     console.log("Pointer lock released/checked during transition back phase. Ignoring deactivation.");
                     // Do nothing, waiting for lock to succeed
                } else {
                    console.log("Pointer lock released condition not met for deactivation.");
                }
            }
        };

        const handlePointerLockError = (err: Event) => {
            console.error('Pointer lock failed:', err);
            // Ensure clean state on error
            setIsTransitioningBack(false); // Clear transition flag on error too
            setActive(false);
            if (lockRequestTimerRef.current) {
                clearTimeout(lockRequestTimerRef.current);
                lockRequestTimerRef.current = null;
            }
        };

        document.addEventListener('pointerlockchange', handlePointerLockChange);
        document.addEventListener('pointerlockerror', handlePointerLockError);

        // ... rest of the effect (requesting/exiting lock logic - check storeIsTransitioningBack here too if needed) ...
         if (active) {
            const currentStoreState = useCameraStore.getState();
             // Only request lock if NOT viewing artwork AND NOT transitioning back
            if (!currentStoreState.isLocked && !currentStoreState.isTransitioningBack) {
                // ... (rest of the pointer lock request logic with delay) ...
                 // Ensure the timeout callback ALSO checks isTransitioningBack
                 lockRequestTimerRef.current = setTimeout(() => {
                     const canvasElement = canvasContainerRef.current?.querySelector('canvas');
                     const latestStoreState = useCameraStore.getState(); // Check again right before request
                     if (canvasElement && document.pointerLockElement === null && !latestStoreState.isLocked && !latestStoreState.isTransitioningBack) {
                         console.log("Requesting pointer lock after delay.");
                         canvasElement.requestPointerLock().catch(/* ... */);
                     } else {
                          console.log("Skipping delayed pointer lock request (conditions not met).");
                     }
                     lockRequestTimerRef.current = null;
                 }, POINTER_LOCK_DELAY);
            } else {
                console.log("Skipping pointer lock request (viewing artwork or transitioning back).");
                 if (lockRequestTimerRef.current) {
                     clearTimeout(lockRequestTimerRef.current);
                     lockRequestTimerRef.current = null;
                 }
            }
        } else {
             // ... (logic to clear timer and exit lock - potentially check isTransitioningBack before exiting?) ...
             if (lockRequestTimerRef.current) { /* ... clear timer ... */ }
             const currentStoreState = useCameraStore.getState();
              // Only exit lock if it's held AND we are not viewing artwork AND not transitioning back
             if (document.pointerLockElement && !currentStoreState.isLocked && !currentStoreState.isTransitioningBack) {
                 console.log("Exiting pointer lock because active is false and not viewing/transitioning.");
                 document.exitPointerLock();
             }
        }


        // Cleanup listeners and pointer lock/timeout on unmount
        return () => {
            // ... (existing cleanup) ...
             // Reset transition flag on unmount just in case
            // useCameraStore.setState({ isTransitioningBack: false }); // Optional: Good practice?
        };
    }, [active, setIsTransitioningBack]); 

    const handleResume = () => {
        console.log("Resume clicked");
        // If we were somehow stuck viewing an artwork when overlay appeared, reset it.
        if (useCameraStore.getState().isLocked) {
            console.warn("Resuming while storeIsLocked=true. Resetting artwork view.");
            setTargetPosition(null); // This triggers the transition back
        }
        setActive(true); // Trigger the useEffect to request pointer lock (if appropriate)
    };

    const handleExit = () => {
        console.log("Exit clicked");
        setActive(false); // Deactivate first
        // Ensure artwork view is fully reset before navigating
        setTargetPosition(null);
        router.push('/discover');
    }
    const cursorStyle = (active && !storeIsLocked) ? 'none' : 'default';

    return (
        <div ref={canvasContainerRef}  style={{ cursor: cursorStyle }} className='relative w-full h-screen bg-gray-900'>
            <InstructionOverlay
                active={active}
                onResume={handleResume}
                onExit={handleExit}
                // Optionally pass storeIsLocked if overlay needs different text/behaviour
                // isViewingArtwork={useCameraStore(state => state.isLocked)} // Example usage
            />
            <Canvas
                shadows
                performance={{ min: 0.5, max: 1, debounce: 200 }}
                className="w-full h-screen block"
                // Prevent canvas click from interfering when overlay is shown? Maybe not needed.
                // onClick={(e) => { if (!active) e.stopPropagation(); }}
            >
                <Suspense fallback={null}>
                    {/* Pass session down */}
                    <Scene exhibition={exhibition} session={session} />
                </Suspense>
            </Canvas>
        </div>
    );
}

// Add Props interface if not already defined elsewhere
interface ExhibitionProps {
    exhibition: ExhibitionType;
    session: Session | null;
}