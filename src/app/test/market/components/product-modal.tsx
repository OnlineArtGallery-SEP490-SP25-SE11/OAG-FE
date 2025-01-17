'use client';

import ArtCanvas from '@/components/ui.custom/art-image';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArtPiece } from '@/types/marketplace.d';
import { useState } from 'react';
import { purchaseArt } from '../api';

interface ProductModalProps {
	art: ArtPiece | null;
	onClose: () => void;
}

export function ProductModal({ art, onClose }: ProductModalProps) {
	const [isPurchasing, setIsPurchasing] = useState(false);
	const [purchaseMessage, setPurchaseMessage] = useState('');

	const handlePurchase = async () => {
		if (!art) return;
		setIsPurchasing(true);
		try {
			const result = await purchaseArt(art.id);
			setPurchaseMessage(result.message);
		} catch {
			setPurchaseMessage(
				'An error occurred during purchase. Please try again.'
			);
		} finally {
			setIsPurchasing(false);
		}
	};

	if (!art) return null;
	return (
		<Dialog open={!!art} onOpenChange={onClose}>
			<DialogContent className='w-[80vw] h-[80vh] max-w-none p-6 overflow-hidden'>
				<div className='flex flex-col h-full relative'>
					<DialogHeader className='mb-4'>
						<DialogTitle className='text-3xl font-bold'>
							{art.title}
						</DialogTitle>
					</DialogHeader>
					<div className='flex flex-grow gap-6 overflow-hidden mb-4'>
						<div className='w-1/2 h-full overflow-hidden rounded-lg flex items-center justify-center border'>
							{/* <div
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <Image
                  src={art.imageUrl}
                  alt={art.title}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  className="rounded-lg"
                />
              </div> */}
							{/* <CanvasImage
                src={art.imageUrl}
                height={art.height}
                width={art.width}
              /> */}
							<ArtCanvas
								url={art.imageUrl as string}
								width={art.width}
								height={art.height}
							/>
						</div>
						<div className='w-1/2 flex flex-col relative'>
							<ScrollArea className='h-1/3 w-full rounded-md p-4 mb-4'>
								<p className='text-sm'>{art.description}</p>
							</ScrollArea>
							<div className='space-y-2'>
								<p>Artist: {art.artist}</p>
								<p>
									Dimensions: {art.width}x{art.height}
								</p>
								<p className='font-bold'>
									Price: ${art.price.toFixed(2)}
								</p>
							</div>
						</div>
					</div>

					<div className='absolute bottom-0 right-0'>
						<Button
							onClick={handlePurchase}
							disabled={isPurchasing}
							className='text-lg py-6 px-8 bg-green-600'
						>
							{isPurchasing ? 'Processing...' : 'Add to Cart'}
						</Button>
					</div>

					{purchaseMessage && (
						<div className='text-sm text-center mt-2'>
							{purchaseMessage}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
