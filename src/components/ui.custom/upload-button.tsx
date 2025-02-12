import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface UploadButtonProps {
	onUpload: (url: string) => void;
	children?: React.ReactNode;
	className?: string;
}

export function UploadButton({
	onUpload,
	children,
	className
}: UploadButtonProps) {
	const [loading, setLoading] = useState(false);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setLoading(true);
		try {
			const base64 = await convertToBase64(file);
			onUpload(base64 as string);
		} catch (error) {
			console.error('Upload failed:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Button variant='outline' className={className} disabled={loading}>
			<input
				type='file'
				className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
				onChange={handleFileChange}
				accept='image/*'
			/>
			{loading ? <span className='animate-spin'>⏳</span> : children}
		</Button>
	);
}

const convertToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});
};
