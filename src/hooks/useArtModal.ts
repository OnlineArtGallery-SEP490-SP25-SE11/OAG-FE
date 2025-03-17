import { create } from 'zustand';
import { Artwork } from '@/types/marketplace';

interface ArtModalState {
	selected: Artwork | null;
	setSelected: (item: Artwork | null) => void;
}

export const useArtModal = create<ArtModalState>((set) => ({
	selected: null,
	setSelected: (item) => set({ selected: item })
}));
