export type Artwork = {
	_id: string;
	title: string;
	artist: string;
	description: string;
	category: string[];
	dimensions: {
		width: number;
		height: number;
		_id: string;
	};
	url: string;
	status: string;
	views: number;
	price: number;
	createdAt: string;
	updatedAt: string;
};