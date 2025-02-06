// components/MasonryGrid.js
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

const MasonryGrid = () => {
	const [mounted, setMounted] = useState(false);

	// Array of image sizes
	const images = [
		'/images/demo.jpg',
		'/images/demo.jpg',
		'/images/demo.jpg',
		'/images/demo.jpg',
		'/images/demo.jpg',
		'/images/demo.jpg'
	];

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null; // Return null on server-side
	}

	return (
		<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
			<Masonry gutter='30px'>
				{images.map((image, i) => (
					<Image
						key={i}
						src={image}
						width={500}
						height={[200, 300, 250, 400, 350][i % 5]} //
						style={{
							width: '100%',
							display: 'block',
							height: [200, 300, 250, 400, 350][i % 5] // Alternate heights
						}}
						alt={`Image ${i + 1}`}
					/>
				))}
			</Masonry>
		</ResponsiveMasonry>
	);
};

export default MasonryGrid;
