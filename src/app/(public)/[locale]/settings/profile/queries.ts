import axios, { createApi } from '@/lib/axios';

export const updateAvatar = async (imageFile: File, token: string) => {
	if (!token) {
		throw new Error('No authentication token available');
	}

	const formData = new FormData();
	formData.append('avatar', imageFile);

	console.log('Sending avatar update request');
	const response = await createApi(token).put('user/avatar', formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	});

	console.log('Avatar update response:', response);
	return response.data;
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

export const updateProfile = async (
	data: { name: string; address: string },
	token?: string
) => {
	if (!token) {
		throw new Error('No authentication token available');
	}

	const response = await createApi(token).put('user', data);
	return response.data;
};
