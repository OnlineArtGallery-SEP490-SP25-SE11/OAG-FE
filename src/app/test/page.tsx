'use client';
import {
	BlurVignette,
	BlurVignetteArticle
} from '@/components/ui.custom/blur-vignette';
import FileUploader from '@/components/ui.custom/file-uploader';
import { useState } from 'react';
export default function Test() {
	const [url, setUrl] = useState<{ url: string }[]>([]);
	console.log(`url`, url);
	return (
		<div>
			<section className='container mx-auto p-4'>
				<h2 className='text-xl font-semibold mb-2'>
					Single File Upload
				</h2>
				<FileUploader
					previewLayout='vertical'
					multiple
					// accept={{
					// 	'image/jpeg': [],
					// 	'image/png': [],
					// 	'image/gif': []
					// }}
					onFileUpload={(url) => {
						setUrl(url as string[]);
					}}
				/>
			</section>
			<Card />
		</div>
	);
}

function Card() {
	return (
		<>
			<div className='relative w-80 h-96'>
				<BlurVignette
					radius='20px'
					inset='0'
					transitionLength='50px'
					blur='10px'
					classname='absolute inset-0 bg-gray-800/50'
				/>
				<div className='relative z-10 p-6'>
					<div className='rounded-lg shadow-lg bg-white p-4'>
						<h3 className='text-xl font-bold'>Beautiful Artwork</h3>
						<p className='text-sm text-gray-600 mt-2'>
							This is a description of the artwork. It includes
							details about the artist and the story behind it.
						</p>
						<p className='text-lg font-bold text-green-600 mt-4'>
							$120
						</p>
					</div>
				</div>
				<BlurVignetteArticle classname='absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/70 to-transparent p-4'>
					<div className='flex justify-between items-center text-white'>
						<p className='text-sm'>By: John Doe</p>
						<p className='text-lg font-bold'>$120</p>
					</div>
				</BlurVignetteArticle>
			</div>
		</>
	);
}
