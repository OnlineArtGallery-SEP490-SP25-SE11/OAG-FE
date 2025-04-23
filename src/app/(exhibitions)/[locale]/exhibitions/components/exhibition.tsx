'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react'; // Added useRef
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { Exhibition as ExhibitionType } from '@/types/exhibition';
import { GalleryPreviewLoader } from '@/app/(public)/[locale]/about/components/gallery-preview-loader';
import { Session } from 'next-auth';
import { InstructionOverlay } from './instructions-overlay';
import { useRouter } from 'next/navigation';
// Optional: If you want loading indicators for the scene itself
// import { Loader } from '@react-three/drei';

interface ExhibitionProps {
    exhibition: ExhibitionType;
    session: Session | null;
}

// Delay in milliseconds before requesting pointer lock
const POINTER_LOCK_DELAY = 200; // Adjust as needed (e.g., 100, 200, 300)

// --- Dynamically import the (now memoized) Scene ---
const Scene = dynamic(() => import('./scene').then((mod) => mod.default), {
    ssr: false,
    // Use the specific loader for the dynamic import itself
    loading: () => <GalleryPreviewLoader />,
});


export default function Exhibition({ exhibition, session }: ExhibitionProps) {
    const [active, setActive] = useState(true); // Start inactive
    const canvasContainerRef = useRef<HTMLDivElement>(null); // Ref for the container
    const router = useRouter();
    const lockRequestTimerRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the timeout ID

    // Effect for Keyboard Controls (Escape key)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Only listen for Escape if the canvas interaction is active
            if (event.key === 'Escape' && active) {
                console.log("Escape key pressed, setting active to false");
                setActive(false);
                // No need to explicitly exit pointer lock here,
                // the pointerlockchange listener will handle it.
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup keyboard listener on unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [active]); // Re-run if active changes to attach/detach listener correctly based on state

    // Effect for Pointer Lock Management
    useEffect(() => {
        const handlePointerLockChange = () => {
            const isLocked = document.pointerLockElement !== null;
            console.log("Pointer lock change detected. Locked:", isLocked);
            // Sync state ONLY if lock is released externally or by Escape key
            // If we are *requesting* lock, we don't want this listener to immediately set active=false
            if (!isLocked && active) {
                 console.log("Pointer lock released externally or via Escape, setting active to false");
                 setActive(false);
            } else if (isLocked && !active) {
                // This case should ideally not happen if logic is correct,
                // but as a safeguard, if lock gets acquired while state is inactive, deactivate.
                console.warn("Pointer lock acquired while component state is inactive. Exiting lock.");
                document.exitPointerLock();
            }
        };

        const handlePointerLockError = (err: Event) => {
            console.error('Pointer lock failed:', err);
            // Ensure state is inactive if lock fails
            setActive(false);
             // Clear any pending timeout request
             if (lockRequestTimerRef.current) {
                clearTimeout(lockRequestTimerRef.current);
                lockRequestTimerRef.current = null;
            }
        };

        // Add listeners when the component mounts
        document.addEventListener('pointerlockchange', handlePointerLockChange);
        document.addEventListener('pointerlockerror', handlePointerLockError);

        // --- Logic to request/exit pointer lock based on 'active' state ---
        if (active) {
            // Clear any previous timer if active becomes true again quickly
            if (lockRequestTimerRef.current) {
                clearTimeout(lockRequestTimerRef.current);
            }
            // Set a timeout to request pointer lock
            lockRequestTimerRef.current = setTimeout(() => {
                 const canvasElement = canvasContainerRef.current?.querySelector('canvas');
                 if (canvasElement && document.pointerLockElement === null) { // Check if lock isn't already acquired
                    console.log(`Requesting pointer lock after ${POINTER_LOCK_DELAY}ms delay on:`, canvasElement);
                    canvasElement.requestPointerLock()
                        .catch(err => {
                            console.error("Failed to request pointer lock after delay:", err);
                            // Error handler above should catch this, but belt-and-suspenders
                            setActive(false);
                        });
                } else if (!canvasElement) {
                    console.warn("Canvas element not found for delayed pointer lock request. Setting active=false.");
                    setActive(false);
                } else {
                    console.log("Pointer lock already acquired or requested, skipping delayed request.");
                }
                 lockRequestTimerRef.current = null; // Clear the ref after execution attempt
            }, POINTER_LOCK_DELAY);

            console.log(`Scheduled pointer lock request with timer ID: ${lockRequestTimerRef.current}`);

        } else {
             // If state becomes inactive, clear any pending lock request timeout
             if (lockRequestTimerRef.current) {
                console.log(`Clearing pending pointer lock request timeout (ID: ${lockRequestTimerRef.current}) because active is false.`);
                clearTimeout(lockRequestTimerRef.current);
                lockRequestTimerRef.current = null;
            }
            // And exit pointer lock if it's currently held
            if (document.pointerLockElement) {
                console.log("Exiting pointer lock because active is false");
                document.exitPointerLock();
            }
        }

        // Cleanup listeners and pointer lock/timeout on unmount
        return () => {
            console.log("Running cleanup for pointer lock effect (unmount)");
            document.removeEventListener('pointerlockchange', handlePointerLockChange);
            document.removeEventListener('pointerlockerror', handlePointerLockError);

            // Clear the timeout if it's still pending during unmount
            if (lockRequestTimerRef.current) {
                console.log(`Clearing pending pointer lock request timeout (ID: ${lockRequestTimerRef.current}) on unmount.`);
                clearTimeout(lockRequestTimerRef.current);
                lockRequestTimerRef.current = null;
            }

            // Exit pointer lock if the component unmounts while lock is active
            if (document.pointerLockElement) {
                 console.log("Exiting pointer lock on unmount cleanup");
                 document.exitPointerLock();
            }
        };
        // Only re-run this effect if 'active' changes.
        // We don't need canvasContainerRef in deps because it's stable.
    }, [active]);

    const handleResume = () => {
        console.log("Resume clicked, setting active to true");
        setActive(true); // Set active to true to trigger the effect
        // The pointer lock request with delay is handled by the useEffect
    };

    const handleExit = () => {
        console.log("Exit clicked, setting active to false and navigating back");
        setActive(false); // Deactivate first
        router.push('/discover'); // Then navigate
        // The useEffect will handle exiting pointer lock if necessary
    }

    return (
        <div ref={canvasContainerRef} className='relative w-full h-screen bg-gray-900'>
            <InstructionOverlay
                active={active}
                onResume={handleResume}
                onExit={handleExit}
            />
            <Canvas
                shadows
                performance={{ min: 0.5, max: 1, debounce: 200 }}
                className="w-full h-screen block"
                // Conditionally apply pointer cursor only when inactive for better UX
                style={{ cursor: active ? 'none' : 'default' }}
            >
                <Suspense fallback={null}>
                    {/* Only render Scene if active? Or let Scene handle internal state?
                        Letting Scene handle internal state based on props is usually better.
                        Ensure Scene uses React.memo if performance is critical and props don't change often.
                    */}
                    <Scene exhibition={exhibition} session={session} /* Pass active if Scene needs it: active={active} */ />
                </Suspense>
                {/* <Loader /> */}
                {/* <Stats /> */}
            </Canvas>
        </div>
    );
}