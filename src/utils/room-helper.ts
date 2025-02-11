export function calculateArtworkPositions(
	roomWidth: number,
	artworkCount: number, // Số lượng tranh trong phòng
	wallZPosition: number
): [number, number, number][] {
	// Tính khoảng cách giữa các tranh
	const spacing = roomWidth / (artworkCount + 1);

	return Array.from({ length: artworkCount }, (_, i) => {
		// Tính toán tọa độ x để đặt tranh
		// (i + 1) * spacing: chia đều không gian
		// - roomWidth / 2: điều chỉnh để tranh nằm giữa phòng
		const x = spacing * (i + 1) - roomWidth / 2;
		return [x, 3, wallZPosition];
	});
}

export const getCloudinaryModelUrl = (modelPath: string): string => {
	// if (!CLOUDINARY_CLOUD_NAME) {
	//   throw new Error('CLOUDINARY_CLOUD_NAME is not defined');
	// }

	// Error: Could not load https://res.cloudinary.com/djvlldzih/image/upload/gallery/models/glass_window_2.glb: fetch for "https://res.cloudinary.com/djvlldzih/image/upload/gallery/models/glass_window_2.glb"
	// responded with 404:
	//https://res.cloudinary.com/djvlldzih/image/upload/v1738856859/gallery/models/glass_window_2.glb
	return modelPath;
};
