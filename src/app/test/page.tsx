'use client';
import FileUploader from '@/components/ui.custom/file-uploader';
import { useState } from 'react';

export default function Test() {
	const [url, setUrl] = useState<{ url: string }[]>([]);
	console.log(`url`, url);
	return (
		<section className='container mx-auto p-4'>
			<h2 className='text-xl font-semibold mb-2'>Single File Upload</h2>
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
	);
}
