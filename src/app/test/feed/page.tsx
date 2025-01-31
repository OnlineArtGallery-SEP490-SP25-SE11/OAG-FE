'use client';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Music2, Share2 } from 'lucide-react';
import { useState } from 'react';

const TikTokClone = () => {
	const [currentVideo, setCurrentVideo] = useState(0);

	// Sample video data
	const videos = [
		{
			id: 1,
			username: '@user1',
			description: 'This is a cool video #trending',
			likes: '1.2M',
			comments: '10.5K',
			shares: '5.2K',
			music: 'Original Sound - User1'
		},
		{
			id: 2,
			username: '@user2',
			description: 'Another awesome video #viral',
			likes: '800K',
			comments: '8.2K',
			shares: '3.1K',
			music: 'Popular Song - Artist'
		}
	];

	return (
		<div className='min-h-screen bg-black text-white snap-y snap-mandatory overflow-y-scroll'>
			{videos.map((video, index) => (
				<motion.div
					key={video.id}
					className='h-screen snap-start relative flex items-center justify-center'
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					transition={{ duration: 0.4 }}
				>
					{/* Video Container */}
					<div className='relative w-full h-full max-w-3xl mx-auto'>
						{/* Placeholder for video */}
						<div className='absolute inset-0 bg-gray-800 flex items-center justify-center'>
							<span className='text-2xl'>Video {index + 1}</span>
						</div>

						{/* Video Info Overlay */}
						<div className='absolute bottom-0 left-0 p-4 w-full md:w-2/3'>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								<h2 className='text-xl font-bold'>
									{video.username}
								</h2>
								<p className='mt-2'>{video.description}</p>
								<div className='flex items-center mt-2'>
									<Music2 className='w-4 h-4 mr-2' />
									<span className='text-sm'>
										{video.music}
									</span>
								</div>
							</motion.div>
						</div>

						{/* Action Buttons */}
						<div className='absolute right-4 bottom-20 flex flex-col space-y-6'>
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								className='flex flex-col items-center'
							>
								<div className='w-12 h-12 bg-gray-800/60 rounded-full flex items-center justify-center'>
									<Heart className='w-6 h-6' />
								</div>
								<span className='text-sm mt-1'>
									{video.likes}
								</span>
							</motion.button>

							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								className='flex flex-col items-center'
							>
								<div className='w-12 h-12 bg-gray-800/60 rounded-full flex items-center justify-center'>
									<MessageCircle className='w-6 h-6' />
								</div>
								<span className='text-sm mt-1'>
									{video.comments}
								</span>
							</motion.button>

							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								className='flex flex-col items-center'
							>
								<div className='w-12 h-12 bg-gray-800/60 rounded-full flex items-center justify-center'>
									<Share2 className='w-6 h-6' />
								</div>
								<span className='text-sm mt-1'>
									{video.shares}
								</span>
							</motion.button>
						</div>
					</div>
				</motion.div>
			))}
		</div>
	);
};

export default TikTokClone;
