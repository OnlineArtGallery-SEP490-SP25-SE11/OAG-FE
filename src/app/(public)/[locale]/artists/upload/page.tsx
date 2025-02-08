'use client';

import { useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { useDropzone } from 'react-dropzone';

export default function UploadArtwork() {
	const [formData, setFormData] = useState({
		title: '',
		artist: '',
		price: '',
		description: '',
		width: '',
		height: '',
		status: 'Available'
	});
	const [file, setFile] = useState<File | null>(null);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name: string) => (value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const onDrop = useCallback((acceptedFiles: File[]) => {
		setFile(acceptedFiles[0]);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { 'image/*': [] }
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Form submitted:', { ...formData, file });
		// Here you would typically send the data to your backend
	};

	return (
		<div className='max-w-2xl mx-auto'>
			<h1 className='text-3xl font-bold mb-6'>Upload Artwork</h1>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<Label htmlFor='title'>Title</Label>
					<Input
						id='title'
						name='title'
						value={formData.title}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<Label htmlFor='artist'>Artist</Label>
					<Input
						id='artist'
						name='artist'
						value={formData.artist}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<Label htmlFor='price'>Price</Label>
					<Input
						id='price'
						name='price'
						type='number'
						value={formData.price}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<Label htmlFor='description'>Description</Label>
					<Textarea
						id='description'
						name='description'
						value={formData.description}
						onChange={handleChange}
						required
					/>
				</div>
				<div className='flex gap-4'>
					<div className='flex-1'>
						<Label htmlFor='width'>Width</Label>
						<Input
							id='width'
							name='width'
							type='number'
							value={formData.width}
							onChange={handleChange}
							required
						/>
					</div>
					<div className='flex-1'>
						<Label htmlFor='height'>Height</Label>
						<Input
							id='height'
							name='height'
							type='number'
							value={formData.height}
							onChange={handleChange}
							required
						/>
					</div>
				</div>
				<div>
					<Label htmlFor='status'>Status</Label>
					<Select
						name='status'
						value={formData.status}
						onValueChange={handleSelectChange('status')}
					>
						<SelectTrigger>
							<SelectValue placeholder='Select status' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='Available'>Available</SelectItem>
							<SelectItem value='Sold'>Sold</SelectItem>
							<SelectItem value='Hidden'>Hidden</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label>Image</Label>
					<div
						{...getRootProps()}
						className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer ${
							isDragActive ? 'border-primary' : 'border-gray-300'
						}`}
					>
						<input {...getInputProps()} />
						{file ? (
							<p>File selected: {file.name}</p>
						) : isDragActive ? (
							<p>Drop the file here ...</p>
						) : (
							<p>
								Drag 'n' drop an image here, or click to select
								a file
							</p>
						)}
					</div>
				</div>
				<Button type='submit'>Upload Artwork</Button>
			</form>
		</div>
	);
}
