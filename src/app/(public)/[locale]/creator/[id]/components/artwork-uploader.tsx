import { Upload, Image as ImageIcon } from 'lucide-react';

export function ArtworkUploader() {
	return (
		<div className='border-2 border-dashed rounded-lg p-4 text-center'>
			<div className='flex flex-col items-center gap-2'>
				<div className='p-3 bg-blue-50 rounded-full'>
					<ImageIcon className='w-6 h-6 text-blue-500' />
				</div>
				<p className='text-gray-500'>Drag and drop artworks here</p>
				<button className='mt-2 px-4 py-2 bg-blue-500 text-white rounded inline-flex items-center gap-2 hover:bg-blue-600 transition-colors'>
					<Upload className='w-4 h-4' />
					Upload Artwork
				</button>
			</div>
		</div>
	);
}
