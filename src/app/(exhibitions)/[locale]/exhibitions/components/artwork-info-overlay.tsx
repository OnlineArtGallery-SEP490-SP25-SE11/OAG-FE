import { useState, useCallback } from 'react';
import {
	Heart,
	MoreHorizontal,
	ArrowLeft,
	Volume2,
	Volume1
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { OverlayButton } from './overlay-button';

interface IArtworkInfoOverlayProps {
	title?: string;
	size?: string;
	description?: string;
	onClose: () => void;
}

export function ArtworkInfoOverlay({
	title,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	size,
	description,
	onClose
}: IArtworkInfoOverlayProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isLiked, setIsLiked] = useState(false);

	// Use our custom speech synthesis hook
	const { isPlaying, toggle } = useSpeechSynthesis();

	// Create a handler for the audio toggle that uses the description text
	const handleAudioToggle = useCallback(() => {
		toggle(description || "No description available");
	}, [toggle, description]);

	// Create a wrapped close handler that properly stops speech
	const handleClose = useCallback(() => {
		// Call the original onClose
		onClose();
	}, [onClose]);

	// Constants for fallback content
	const fallbackTitle = 'Artwork Title';
	// const fallbackSize = '800x800';
	const fallbackDescription = 'No description available for this artwork.';

	return (
		<AnimatePresence>
			<motion.div
				className='fixed bottom-2 w-[80%] ml-[10%] bg-white opacity-90 rounded-md shadow-lg'
				// className="fixed bottom-2 w-[80%] mx-auto left-0 right-0 bg-white/90 rounded-md shadow-lg"
				initial={{ y: '100%' }}
				animate={{ y: isExpanded ? '0%' : '80%' }}
				transition={{ type: 'spring', damping: 20 }}
			>
				<header className="flex items-center justify-between p-4 border-b border-gray-200">
					<OverlayButton
						onClick={handleClose}
						aria-label='Close'
					>
						<ArrowLeft className="w-6 h-6" />
					</OverlayButton>

					<div className="flex items-center gap-2">
						<OverlayButton
							onClick={handleAudioToggle}
							aria-label={isPlaying ? 'Stop audio' : 'Play audio'}
						>
							{isPlaying ? (
								<Volume2 className="w-6 h-6 text-blue-500" />
							) : (
								<Volume1 className="w-6 h-6 text-gray-600" />
							)}
						</OverlayButton>

						<OverlayButton
							onClick={() => setIsLiked(!isLiked)}
							aria-label={isLiked ? 'Unlike' : 'Like'}
						>
							<Heart
								className={`w-6 h-6 transition-colors duration-200 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
									}`}
							/>
						</OverlayButton>

						<OverlayButton
							onClick={() => setIsExpanded(!isExpanded)}
							aria-label={isExpanded ? 'Collapse' : 'Expand'}
						>
							<MoreHorizontal className="w-6 h-6 text-gray-600" />
						</OverlayButton>
					</div>
				</header>

				<section className="p-6 space-y-4">
					<h2 className="text-xl font-bold text-gray-900">
						{title || fallbackTitle}
					</h2>
					{/* <h3 className="text-gray-600">{size || fallbackSize}</h3> */}
					<p className="text-gray-600 leading-relaxed">
						{description || fallbackDescription}
					</p>
				</section>
			</motion.div>
		</AnimatePresence>
	);
}
