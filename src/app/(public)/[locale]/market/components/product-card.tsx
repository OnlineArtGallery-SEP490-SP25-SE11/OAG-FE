import CanvasImage from '@/components/ui.custom/canvas-image';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/components/ui/tooltip';
import { ArtPiece } from '@/types/marketplace.d';
import { memo, useCallback, useState } from 'react';
interface ProductCardProps {
	index: number;
	art: ArtPiece;
	onClick?: (art: ArtPiece) => void;
}
function ProductCard({ index, art, onClick }: ProductCardProps) {
	const [tooltipSide, setTooltipSide] = useState<
		'top' | 'right' | 'bottom' | 'left'
	>('right');

	const handleMouseEnter = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			const rect = event.currentTarget.getBoundingClientRect();
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;

			if (rect.right + 300 > windowWidth) {
				setTooltipSide('left');
			} else if (rect.left < 300) {
				setTooltipSide('right');
			} else if (rect.bottom + 200 > windowHeight) {
				setTooltipSide('top');
			} else {
				setTooltipSide('bottom');
			}
		},
		[]
	);

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div
					className='w-full h-full'
					onClick={() => onClick(art)}
					onMouseEnter={handleMouseEnter}
					key={index}
				>
					<CanvasImage
						src={art.imageUrl}
						width={art.width}
						height={art.height}
						className='rounded'
						onClick={() => onClick(art)}
						onMouseEnter={handleMouseEnter}
					/>
				</div>
			</TooltipTrigger>
			<TooltipContent
				side={tooltipSide}
				align='center'
				className='max-w-xs p-4 space-y-2 acrylic rounded border text-black dark:text-white prose dark:prose-invert'
				style={
					{
						'--gradient-angle': '120deg',
						// '--gradient-start': 'rgba(0, 255, 0, 0.2)',
						'--gradient-end': 'rgba(0, 0, 255, 0.2)',
						'--blur': '5px'
					} as React.CSSProperties
				}
			>
				<h4 className='text-lg font-bold border-b border-gray-300 dark:border-gray-600 pb-2'>
					{art.title}
				</h4>
				<ScrollArea className='h-48 w-full rounded-md p-3  shadow-inner prose-sm'>
					<p>{art.description}</p>
				</ScrollArea>
				<div className='flex items-center justify-between text-sm'>
					<p className='flex items-center gap-2'>
						<span className='font-medium'>By:</span>
						{art.artist}
					</p>
					<p className='text-base font-semibold text-green-600'>
						${art.price}
					</p>
				</div>
			</TooltipContent>
		</Tooltip>
	);
}

ProductCard.display = 'ProductCard';
export default memo(ProductCard);

// export default ProductCard;
