'use client';

export default async function Interview() {
	return (
		<div>
			<video
				style={{
					width: '1800px', // Set the desired width
					height: '600px', // Set the desired height
					objectFit: 'cover' // Ensures the video covers the set dimensions
				}}
				controls
				autoPlay
			>
				<source src='/image/interview.mp4' type='video/mp4' />
			</video>
		</div>
	);
}
