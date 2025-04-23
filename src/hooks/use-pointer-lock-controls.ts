import { useEffect } from 'react';

interface UsePointerLockControlsProps {
    active: boolean;
    setActive: (active: boolean) => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

export const usePointerLockControls = ({
    active,
    setActive,
    containerRef
}: UsePointerLockControlsProps) => {
    useEffect(() => {
        const handlePointerLockChange = () => {
            if (document.pointerLockElement === null) {
                console.log("Pointer lock released, setting active to false");
                setActive(false);
            } else {
                console.log("Pointer lock acquired");
            }
        };

        const handlePointerLockError = (err: Event) => {
            console.error('Pointer lock failed:', err);
            setActive(false);
        };

        document.addEventListener('pointerlockchange', handlePointerLockChange);
        document.addEventListener('pointerlockerror', handlePointerLockError);

        if (active) {
            const canvasElement = containerRef.current?.querySelector('canvas');
            if (canvasElement) {
                console.log("Requesting pointer lock on:", canvasElement);
                canvasElement.requestPointerLock()
                    .catch(err => {
                        console.error("Failed to request pointer lock on click:", err);
                        setActive(false);
                    });
            } else {
                console.warn("Canvas element not found for pointer lock request.");
                setActive(false);
            }
        } else {
            if (document.pointerLockElement) {
                console.log("Exiting pointer lock because active is false");
                document.exitPointerLock();
            }
        }

        return () => {
            document.removeEventListener('pointerlockchange', handlePointerLockChange);
            document.removeEventListener('pointerlockerror', handlePointerLockError);

            if (document.pointerLockElement && active) {
                console.log("Exiting pointer lock on cleanup");
            }
        };
    }, [active, setActive, containerRef]);
};