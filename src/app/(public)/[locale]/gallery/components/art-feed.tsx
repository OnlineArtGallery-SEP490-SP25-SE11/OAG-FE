import { ArtPiece } from '@/types/marketplace.d';
import React, { useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useWindowSize } from '@react-hook/window-size';

interface ArtFeedProps {
	data: ArtPiece;
	index: number;
}

const ArtFeed: React.FC<ArtFeedProps> = ({ data }) => {
	const [windowWidth, windowHeight] = useWindowSize();
	const containerRef = useRef<HTMLDivElement>(null);

	const headerHeight = 67; // Thay thế bằng chiều cao thực tế của header

	const calculateContainerSize = useCallback(() => {
		if (!data.width || !data.height)
			return { w: windowWidth, h: windowHeight - headerHeight };

		const imgRatio = data.width / data.height;
		const screenRatio = windowWidth / (windowHeight - headerHeight);

		return imgRatio > screenRatio
			? { w: windowWidth, h: windowWidth / imgRatio }
			: {
					h: windowHeight - headerHeight,
					w: (windowHeight - headerHeight) * imgRatio
			  };
	}, [windowWidth, windowHeight, data.width, data.height]);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.style.overflow = 'hidden';
		}
	}, []);

	const { w, h } = calculateContainerSize();

	return (
		<div
			ref={containerRef}
			style={{
				// width: '100vw',
				// height: '100vh',
				width: '100%',
				height: '100%',
				overflow: 'hidden', // Ẩn scroll
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				scrollSnapAlign: 'start'
			}}
		>
			<div
				style={{
					width: `${w}px`,
					height: `${h}px`,
					position: 'relative'
				}}
			>
				<Image
					src={data.imageUrl}
					alt={data.title}
					width={w}
					height={h}
					style={{ objectFit: 'contain' }}
					quality={100}
					priority
				/>
			</div>
		</div>
	);
};

export default React.memo(ArtFeed);
