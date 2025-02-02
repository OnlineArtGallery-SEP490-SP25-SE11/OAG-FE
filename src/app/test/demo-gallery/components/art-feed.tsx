import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useWindowSize } from '@react-hook/window-size';
import { ArtPiece } from '@/types/marketplace';
interface ArtFeedProps {
	data: ArtPiece;
	index: number;
}

const ArtFeed: React.FC<ArtFeedProps> = ({ data }) => {
	const [windowWidth, windowHeight] = useWindowSize();
	const [isImageLoaded, setIsImageLoaded] = useState(false);
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
				width: '100%',
				height: '100%',
				overflow: 'hidden',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				scrollSnapAlign: 'start'
			}}
		>
			{!isImageLoaded && (
				<Skeleton
					className='w-full h-full animate-pulse'
					style={{
						width: `${w}px`,
						height: `${h}px`
					}}
				/>
			)}
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
					onLoadingComplete={() => setIsImageLoaded(true)}
				/>
			</div>
		</div>
	);
};

export default React.memo(ArtFeed);
