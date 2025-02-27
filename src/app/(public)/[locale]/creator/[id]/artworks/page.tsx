'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Upload } from 'lucide-react';

export default function ArtworksPage() {
	const [isUploadSectionOpen, setIsUploadSectionOpen] = useState(false);

	// Example positions array - adjust the number based on your needs
	const positions = Array.from({ length: 68 }, (_, i) => i + 1);

	return (
		<div className='max-w-7xl mx-auto px-4 py-8 space-y-8'>
			<div className='bg-white rounded-lg border p-6'>
				<h2 className='text-2xl font-bold text-gray-800 mb-4'>
					Artworks
				</h2>
				<p className='text-gray-600 leading-relaxed'>
					Upload your artwork to their places. You can see your
					gallery&apos;s floor plan below and the places for art are
					numbered accordingly. You can check instructions and
					recommendations on our FAQ page.
				</p>
			</div>

			<div className='bg-white rounded-lg shadow-md p-6'>
				<h2 className='text-2xl font-bold text-gray-800 mb-4'>
					Floor Plan
				</h2>
				<p className='text-gray-600 leading-relaxed mb-6'>
					You can see your gallery&apos;s floor plan below and the
					places for art are numbered accordingly. You can check
					instructions and recommendations on our FAQ page.
				</p>

				<div className='w-full flex justify-center'>
					<div className='w-[600px] rounded-lg overflow-hidden border border-gray-200'>
						<Image
							src='https://res.cloudinary.com/djvlldzih/image/upload/v1739374668/gallery/modern_c1_plan.png'
							alt='Floor Plan'
							width={1000}
							height={1000}
							className='w-full h-auto object-contain'
						/>
					</div>
				</div>

				{/* Upload Art Section */}
				<div className='mt-8'>
					<button
						onClick={() =>
							setIsUploadSectionOpen(!isUploadSectionOpen)
						}
						className='w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
					>
						<div className='flex items-center gap-2'>
							<span className='font-semibold'>
								Upload Artworks
							</span>
							<span className='text-sm text-gray-500'>
								0/68 artworks
							</span>
						</div>
						{isUploadSectionOpen ? (
							<ChevronUp className='w-5 h-5 transition-transform duration-300' />
						) : (
							<ChevronDown className='w-5 h-5 transition-transform duration-300' />
						)}
					</button>

					<div
						className={`transition-all duration-300 ease-in-out ${
							isUploadSectionOpen
								? 'opacity-100 max-h-[5000px]'
								: 'opacity-0 max-h-0'
						} overflow-hidden`}
					>
						<div className='mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
							{positions.map((position) => (
								<div
									key={position}
									className='aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all duration-200 relative'
								>
									<Upload className='w-6 h-6 text-gray-400 hover:text-blue-500 transition-colors' />
									<span className='absolute bottom-2 left-2 text-sm font-semibold text-gray-700'>
										Wall {position}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
