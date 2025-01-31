import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { ListProps } from 'masonic';
import { ArtPiece } from '@/types/marketplace';

const List = forwardRef<HTMLDivElement, ListProps<ArtPiece>>(
	({ items, onRender, render: RenderComponent, rowGutter = 20 }, ref) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const [isLoading, setIsLoading] = useState(false);

		const handleScroll = useCallback(async () => {
			const container = containerRef.current;
			if (!container || isLoading) return;

			const { scrollTop, clientHeight, scrollHeight } = container;
			const threshold = 200; // Khoảng cách trigger load thêm

			console.log({ scrollTop, clientHeight, scrollHeight, threshold });

			if (scrollTop + clientHeight >= scrollHeight - threshold) {
				setIsLoading(true);
				await onRender(items.length, items.length + 9);
				setIsLoading(false);
			}
		}, [items.length, isLoading, onRender]);

		useEffect(() => {
			const container = containerRef.current;
			if (container) {
				container.addEventListener('scroll', handleScroll);
				return () =>
					container.removeEventListener('scroll', handleScroll);
			}
		}, [handleScroll]);

		// Kiểm tra lại scroll nếu isLoading = false
		useEffect(() => {
			if (!isLoading) handleScroll();
		}, [isLoading]);

		return (
			<div
				ref={ref || containerRef}
				style={{
					height: '100%',
					overflowY: 'auto',
					scrollSnapType: 'y mandatory'
				}}
			>
				{items.map((item, index) => (
					<div
						key={item.id}
						style={{
							height: `calc(100vh - ${rowGutter}px)`,
							scrollSnapAlign: 'start',
							marginBottom: rowGutter,
							position: 'relative'
						}}
					>
						<RenderComponent data={item} index={index} />
					</div>
				))}
				{isLoading && (
					<div className='loading-indicator'>Loading more...</div>
				)}
			</div>
		);
	}
);

List.displayName = 'ListFeed';
export default List;
