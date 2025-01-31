import { create } from 'zustand';
import { ArtPiece } from '@/types/marketplace';

interface ArtModalState {
	selected: ArtPiece | null;
	setSelected: (item: ArtPiece | null) => void;
}

export const useArtModal = create<ArtModalState>((set) => ({
	selected: null,
	setSelected: (item) => set({ selected: item })
}));
