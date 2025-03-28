import { useState, useCallback } from 'react';
import { Exhibition as ExhibitionType } from '@/types/exhibition';
import Exhibition from '@/app/(exhibitions)/[locale]/exhibitions/components/exhibition';

export function ExhibitionDisplay({ exhibition }: { exhibition: ExhibitionType }) {
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  const handlePointerLock = useCallback(() => {
    setIsPointerLocked(true);
  }, []);

  const handlePointerUnlock = useCallback(() => {
    setIsPointerLocked(false);
  }, []);

  return (
    <Exhibition 
      exhibition={exhibition} 
      isPointerLocked={isPointerLocked}
      onPointerLock={handlePointerLock}
      onPointerUnlock={handlePointerUnlock}
    />
  );
}