import { useState } from 'react';
import {
	Heart,
	MoreHorizontal,
	ArrowLeft,
	Volume2,
	Volume1
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IArtworkInfoOverlayProps {
	title?: string;
	size?: string;
	description?: string;
	onClose: () => void;
}

export function ArtworkInfoOverlay({
	title,
	size,
	description,
	onClose
}: IArtworkInfoOverlayProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);

	const handleAudioToggle = () => {
		setIsPlaying(!isPlaying);
		// TODO: Implement audio playback logic
	};

	return (
		<AnimatePresence>
			<motion.div
				className='fixed bottom-2 w-[80%] ml-[10%] bg-white opacity-90 rounded-md shadow-lg'
				// style={{
				//   width: "min(95%, 1200px)",
				//   maxWidth: "1200px",
				//   margin: "0 200px",
				// }}
				initial={{ y: '100%' }}
				animate={{ y: isExpanded ? '0%' : '80%' }}
				transition={{ type: 'spring', damping: 20 }}
			>
				<div className='flex items-center justify-between p-4 border-b border-gray-200'>
					<button
						onClick={onClose}
						className='p-2 rounded-full hover:bg-gray-100 transition-colors duration-200'
						aria-label='Close'
					>
						<ArrowLeft className='w-6 h-6' />
					</button>

					<div className='flex items-center gap-2'>
						<button
							onClick={handleAudioToggle}
							className='p-2 rounded-full hover:bg-gray-100 transition-colors duration-200'
							aria-label={isPlaying ? 'Stop audio' : 'Play audio'}
						>
							{isPlaying ? (
								<Volume2 className='w-6 h-6 text-blue-500' />
							) : (
								<Volume1 className='w-6 h-6 text-gray-600' />
							)}
						</button>

						<button
							onClick={() => setIsLiked(!isLiked)}
							className='p-2 rounded-full hover:bg-gray-100 transition-colors duration-200'
							aria-label={isLiked ? 'Unlike' : 'Like'}
						>
							<Heart
								className={`w-6 h-6 transition-colors duration-200 ${
									isLiked
										? 'fill-red-500 text-red-500'
										: 'text-gray-600'
								}`}
							/>
						</button>

						<button
							onClick={() => setIsExpanded(!isExpanded)}
							className='p-2 rounded-full hover:bg-gray-100 transition-colors duration-200'
							aria-label={isExpanded ? 'Collapse' : 'Expand'}
						>
							<MoreHorizontal className='w-6 h-6 text-gray-600' />
						</button>
					</div>
				</div>

				<div className='p-6 space-y-4'>
					<h2 className='text-xl font-bold text-gray-900'>
						{title || 'Lorem ipsum dolor sit amet'}
					</h2>
					<h2 className='text-gray-600'>{size || '800x800'}</h2>
					<p className='text-gray-600 leading-relaxed'>
						{description ||
							'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tristique commodo mi vitae luctus. Etiam iaculis bibendum finibus. Praesent eu augue eget eros vehicula imperdiet. Mauris dictum eros ipsum. Sed dapibus tellus vitae aliquet mollis. Sed ultrices nibh id lacus pretium maximus. Nulla at ultrices nisl. Phasellus tempor eros vitae aliquet faucibus. Ut ante mi, molestie dictum molestie quis, finibus in massa. In eleifend ultricies vulputate. Suspendisse euismod sollicitudin ex ut faucibus. Donec congue ipsum in ex tincidunt pharetra.'}
					</p>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}
