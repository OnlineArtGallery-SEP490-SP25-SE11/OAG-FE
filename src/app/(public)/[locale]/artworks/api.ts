import { createAxiosInstance } from '@/lib/axios';
import { Artwork } from '@/types/marketplace';

function getRandomSize() {
	return {
		width: Math.floor(Math.random() * 400) + 400, // 400-800px
		height: Math.floor(Math.random() * 400) + 400 // 400-800px
	};
}

const ARTIST_NAMES = [
	'Leonardo da Vinci',
	'Vincent van Gogh',
	'Pablo Picasso',
	'Claude Monet',
	'Frida Kahlo',
	'Andy Warhol',
	'Georgia O"Keeffe',
	'Salvador Dalí'
];

const ART_TITLES = [
	'Sunset Dreams',
	'Urban Rhythm',
	"Nature's Whisper",
	'Abstract Thoughts',
	'Digital Echoes',
	'Cosmic Dance',
	'Ethereal Moments',
	'Modern Nostalgia'
];

function generateLoremIpsum(sentences: number): string {
	const loremArray = [
		'Cupidatat anim officia adipisicing magna laborum ut pariatur proident in amet dolore.',
		'Quis in proident excepteur nisi elit ipsum consectetur nisi et ullamco incididunt labore consequat nulla.',
		'Est et irure veniam cillum anim quis mollit laboris in.',
		'Fugiat proident velit cillum excepteur dolor nisi excepteur tempor velit elit deserunt eu id.',
		'Duis do cillum fugiat et culpa irure cillum cillum pariatur.',
		'Nulla elit eu pariatur magna laborum in.',
		'Ex ipsum nulla velit incididunt tempor ipsum enim laborum excepteur adipisicing eu in.',
		'Officia proident cillum velit do ut cupidatat laboris officia aliquip.',
		'Qui excepteur minim veniam ea ullamco.'
	];

	return Array.from(
		{ length: sentences },
		() => loremArray[Math.floor(Math.random() * loremArray.length)]
	).join(' ');
}

// Predefined list of valid Picsum image IDs to avoid 404 errors
// const VALID_IMAGE_IDS = [10, 20, 30, 50, 100, 150, 200, 250, 300, 350];

const mockArtPieces: Artwork[] = Array.from({ length: 1000 }, (_, i) => {
	const { width, height } = getRandomSize();
	return {
		_id: `art-${i + 1}`,
		title: `${ART_TITLES[i % ART_TITLES.length]} #${i + 1}`,
		artist: ARTIST_NAMES[i % ARTIST_NAMES.length],
		url: `https://picsum.photos/seed/${i + 1}/${width}/${height}`,
		price: Math.floor(Math.random() * 950000) + 500000, // 500000-10000000
		description: generateLoremIpsum(20),
		dimensions: { width, height, _id: `dim-${i + 1}` },
		category: [
			'Conceptual',
			'Fashion',
			'Landscape',
			'Industrial',
			'Cityscape'
		],
		status: 'available',
		views: 0,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	};
});

export async function fetchArtPieces(
	page: number,
	limit: number
): Promise<Artwork[]> {
	await new Promise((resolve) => setTimeout(resolve, 800)); // Slightly longer delay for realism
	return mockArtPieces.slice((page - 1) * limit, page * limit);
}

export async function fetchArtPieceById(id: string): Promise<Artwork> {
	await new Promise((resolve) => setTimeout(resolve, 500));
	const piece = mockArtPieces.find((art) => art._id === id);
	if (!piece) {
		throw new Error(`Art piece with ID ${id} not found`);
	}
	return piece;
}

export async function purchaseArt(
	artId: string
): Promise<{ success: boolean; message: string }> {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	// Simulate random success/failure
	const success = Math.random() > 0.1; // 90% success rate

	return {
		success,
		message: success
			? `Successfully purchased artwork with ID: ${artId}`
			: 'Transaction failed. Please try again.'
	};
}

// export async function fetchArtPiecesByRange(
// 	startIndex: number,
// 	stopIndex: number
// ): Promise<ArtPiece[]> {
// 	// Giả sử rằng startIndex và stopIndex là các chỉ số trong mảng mockArtPieces
// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 	const limit = stopIndex - startIndex + 1;
// 	await new Promise((resolve) => setTimeout(resolve, 800)); // Slightly longer delay for realism
// 	console.log(`demo ${mockArtPieces.slice(startIndex, stopIndex + 1)}`)
// 	return mockArtPieces.slice(startIndex, stopIndex + 1);
// }

export async function fetchArtPiecesByRange(
	startIndex: number,
	stopIndex: number
): Promise<Artwork[]> {
	const skip = startIndex;
	const take = stopIndex - startIndex + 1;
	// const url = `http://localhost:5000/api/`;
	try {
		const axios = await createAxiosInstance({ useToken: false });
		if (!axios) throw new Error('Failed to create Axios instance');
		const response = await axios.get(`/artwork?skip=${skip}&take=${take}&status=selling&status=available&status=sold`);
		// console.log(response.data.data.artworks);
		return response.data.data.artworks;
	} catch {
		throw new Error('Error fetching artworks');
	}
}

export async function fetchArtworkById(id: string): Promise<BaseResponse<Artwork>> {
	// const url = `http://localhost:5000/api/artwork/${id}`;
	try {
		const axios = await createAxiosInstance({ useToken: false });
		if (!axios) throw new Error('Failed to create Axios instance');
		const response = await axios.get(`/artwork/${id}`);
		return response.data;
	} catch {
		throw new Error('Error fetching artwork');
	}
}

type BaseResponse<T = null> = {
	data: T;
	message: string;
	statusCode: number;
	errorCode: string | null;
	details: unknown | null;
}