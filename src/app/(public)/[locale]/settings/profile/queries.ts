import axios from '@/lib/axios';

export const updateAvatar = async (image: string) => {
	const { data } = await axios.post('/api/user/avatar', { image });
	return data;
};

export const updateArtwork = async (artworkId: string, image: string) => {
	const { data } = await axios.put(`/api/artworks/${artworkId}/image`, {
		image
	});
	return data;
};

export const updateCollection = async (collectionId: string, image: string) => {
	const { data } = await axios.put(`/api/collections/${collectionId}/image`, {
		image
	});
	return data;
};
