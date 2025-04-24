// src/hooks/usePointerLockManager.ts (Create this new file)
import { useEffect, useRef } from 'react';
import { useCameraStore } from '@/store/cameraStore';

const POINTER_LOCK_DELAY = 200; // Keep delay consistent

interface UsePointerLockManagerProps {
  isActive: boolean; // The desired active state from the component
  canvasContainerRef: React.RefObject<HTMLDivElement>;
  onDeactivate: () => void; // Callback to set component's active state to false
}

export function usePointerLockManager({
  isActive,
  canvasContainerRef,
  onDeactivate,
}: UsePointerLockManagerProps): void {
  const lockRequestTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Get setters from the store, needed for cleanup and state management
  const { setIsTransitioningBack } = useCameraStore();

  useEffect(() => {
    const containerElement = canvasContainerRef.current;
    if (!containerElement) return; // Need the container

    // --- Event Handlers ---
    const handlePointerLockChange = () => {
      const isPointerLocked = document.pointerLockElement === containerElement.querySelector('canvas'); // More specific check?
      const currentStoreState = useCameraStore.getState(); // Get latest state
      const storeIsLockedNow = currentStoreState.isLocked;
      const storeIsTransitioningBack = currentStoreState.isTransitioningBack;

      console.log(`[PointerLockManager] Event: pointerlockchange. Locked: ${isPointerLocked}, ActiveProp: ${isActive}, StoreLocked: ${storeIsLockedNow}, StoreTransitioning: ${storeIsTransitioningBack}`);

      if (isPointerLocked) {
        // Lock acquired
        if (storeIsTransitioningBack) {
          console.log('[PointerLockManager] Clearing isTransitioningBack flag on lock acquire.');
          setIsTransitioningBack(false);
        }
      } else {
        // Lock released or not held
        // Only trigger external deactivation if conditions are met
        if (isActive && !storeIsLockedNow && !storeIsTransitioningBack) {
          console.warn('[PointerLockManager] External lock release detected. Deactivating.');
          onDeactivate(); // Call the callback passed from the component
        } else {
           console.log('[PointerLockManager] Lock release condition not met for deactivation.');
        }
      }
    };

    const handlePointerLockError = (err: Event) => {
      console.error('[PointerLockManager] Pointer lock failed:', err);
      // Ensure clean state on error
      setIsTransitioningBack(false);
      if (lockRequestTimerRef.current) {
        clearTimeout(lockRequestTimerRef.current);
        lockRequestTimerRef.current = null;
      }
      onDeactivate(); // Deactivate component on error
    };

    // --- Add Listeners ---
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('pointerlockerror', handlePointerLockError);

    // --- Manage Pointer Lock based on isActive ---
    if (isActive) {
      const currentStoreState = useCameraStore.getState();
      // Only request lock if NOT viewing artwork AND NOT transitioning back
      if (!currentStoreState.isLocked && !currentStoreState.isTransitioningBack) {
        // Clear any pending timer before starting a new one
        if (lockRequestTimerRef.current) clearTimeout(lockRequestTimerRef.current);

        lockRequestTimerRef.current = setTimeout(() => {
          const canvasElement = containerElement.querySelector('canvas');
          const latestStoreState = useCameraStore.getState(); // Check again right before request
          if (canvasElement && document.pointerLockElement === null && !latestStoreState.isLocked && !latestStoreState.isTransitioningBack) {
            console.log('[PointerLockManager] Requesting pointer lock after delay.');
            canvasElement.requestPointerLock().catch((e) => {
                 // Error handled by pointerlockerror listener, but log here too
                 console.error('[PointerLockManager] requestPointerLock promise rejected:', e);
            });
          } else {
            console.log('[PointerLockManager] Skipping delayed pointer lock request (conditions not met).');
          }
          lockRequestTimerRef.current = null; // Clear ref after execution/skip
        }, POINTER_LOCK_DELAY);

      } else {
        // If active but conditions not met, ensure no timer is pending
         if (lockRequestTimerRef.current) {
             console.log('[PointerLockManager] Clearing pending lock request (already viewing artwork or transitioning).');
             clearTimeout(lockRequestTimerRef.current);
             lockRequestTimerRef.current = null;
         }
      }
    } else {
      // --- Component is NOT active ---
      // Clear any pending lock request
      if (lockRequestTimerRef.current) {
        console.log('[PointerLockManager] Clearing pending lock request (isActive is false).');
        clearTimeout(lockRequestTimerRef.current);
        lockRequestTimerRef.current = null;
      }

      // Exit pointer lock if it's held AND we are not viewing artwork AND not transitioning back
      const currentStoreState = useCameraStore.getState();
      if (document.pointerLockElement && !currentStoreState.isLocked && !currentStoreState.isTransitioningBack) {
        console.log('[PointerLockManager] Exiting pointer lock (isActive is false).');
        document.exitPointerLock();
      }
    }

    // --- Cleanup ---
    return () => {
      console.log('[PointerLockManager] Cleaning up listeners and timer.');
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('pointerlockerror', handlePointerLockError);
      if (lockRequestTimerRef.current) {
        clearTimeout(lockRequestTimerRef.current);
        lockRequestTimerRef.current = null;
      }
      // Attempt to exit pointer lock on unmount *only if* still potentially active
      // Note: If unmounting while viewing artwork, useCameraTransition should handle unlock?
      // Safer to exit if lock is held by our canvas, regardless of state? Depends on desired UX on abrupt unmount.
      if (document.pointerLockElement === containerElement.querySelector('canvas')) {
         console.log('[PointerLockManager] Exiting pointer lock on cleanup.');
         document.exitPointerLock();
      }
    };
    // Dependencies: Recalculate effect if isActive changes, or container ref changes.
    // Include callbacks/setters that are stable.
  }, [isActive, canvasContainerRef, onDeactivate, setIsTransitioningBack]);
}