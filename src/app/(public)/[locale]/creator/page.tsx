'use client';

import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { useState } from 'react';

interface Exhibition {
	id: string;
	title: string;
	thumbnail: string;
	artworksCount: number;
	status: 'draft' | 'published';
	lastEdited: string;
}

interface GalleryTemplate {
	id: string;
	name: string;
	image: string;
	description: string;
	previewUrl: string;
}

export default function CreatorPage() {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
		null
	);

	// Mock data - replace with real API call
	const exhibitions: Exhibition[] = [
		{
			id: '1',
			title: 'Modern Art Collection',
			thumbnail: 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=2574&auto=format&fit=crop',
			artworksCount: 24,
			status: 'published',
			lastEdited: '2024-03-20'
		},
		{
			id: '2',
			title: 'Abstract Expressions',
			thumbnail: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=2574&auto=format&fit=crop',
			artworksCount: 12,
			status: 'draft',
			lastEdited: '2024-03-19'
		}
		// Add more galleries as needed
	];

	// Mock gallery templates - replace with real data
	const galleryTemplates: GalleryTemplate[] = [
		{
			id: 'template1',
			name: 'Modern Gallery',
			image: '/gallery-preview.jpg',
			description:
				'A sleek, contemporary space with clean lines and optimal lighting for modern artworks.',
			previewUrl: '/preview/modern-gallery'
		},
		{
			id: 'template2',
			name: 'Classical Museum',
			image: '/gallery-preview.jpg',
			description:
				'Traditional museum layout with elegant architecture and spacious halls.',
			previewUrl: '/preview/classical-museum'
		},
		{
			id: 'template3',
			name: 'Minimalist Space',
			image: '/gallery-preview.jpg',
			description:
				'Simple and focused design that puts your artwork at the center of attention.',
			previewUrl: '/preview/minimalist-space'
		},
		{
			id: 'template4',
			name: 'Industrial Loft',
			image: '/gallery-preview.jpg',
			description:
				'Raw and urban atmosphere perfect for contemporary and experimental art.',
			previewUrl: '/preview/industrial-loft'
		},
		{
			id: 'template5',
			name: 'Virtual Reality Gallery',
			image: '/gallery-preview.jpg',
			description:
				'Immersive digital space that breaks the boundaries of traditional exhibitions.',
			previewUrl: '/preview/vr-gallery'
		},
		{
			id: 'template6',
			name: 'Garden Exhibition',
			image: '/gallery-preview.jpg',
			description:
				'Open-air gallery space integrating nature with art installations.',
			previewUrl: '/preview/garden-gallery'
		}
	];

	return (
		<div className='max-w-7xl mx-auto px-4 py-8'>
			<div className='flex justify-between items-center mb-8'>
				<h1 className='text-3xl font-bold'>My Exhibitions</h1>
				<button
					onClick={() => setIsModalOpen(true)}
					className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors'
				>
					Create New Exhibition
				</button>
			</div>

			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className='max-w-2xl'>
					<div className='flex justify-between items-center mb-6'>
						<h2 className='text-2xl font-bold'>
							Choose a Gallery Template
						</h2>
					</div>
					<div className='space-y-4 max-h-[60vh] overflow-y-auto pr-4 -mr-4'>
						{galleryTemplates.map((template) => (
							<div
								key={template.id}
								className={`flex items-center space-x-4 p-4 rounded-lg transition-all cursor-pointer group
                  ${
						selectedTemplate === template.id
							? 'bg-primary/5 ring-2 ring-primary shadow-md scale-[1.02]'
							: 'hover:bg-gray-50 hover:shadow-sm'
					}`}
								onClick={() => {
									setSelectedTemplate(template.id);
								}}
							>
								<div className='relative w-24 h-24 flex-shrink-0'>
									<Image
										src={template.image}
										alt={template.name}
										fill
										className={`object-cover rounded-full transition-transform duration-200
                      ${
							selectedTemplate === template.id
								? 'scale-105'
								: 'group-hover:scale-105'
						}`}
									/>
								</div>
								<div className='flex-grow'>
									<h3
										className={`text-lg font-semibold transition-colors
                    ${
						selectedTemplate === template.id
							? 'text-primary'
							: 'group-hover:text-primary'
					}`}
									>
										{template.name}
									</h3>
									<p className='text-sm text-muted-foreground'>
										{template.description}
									</p>
								</div>
								<div className='flex items-center'>
									<button
										onClick={(e) => {
											e.stopPropagation();
											router.push(template.previewUrl);
										}}
										className={`p-2 rounded-full transition-all duration-200
                      ${
							selectedTemplate === template.id
								? 'text-primary hover:text-primary/80 hover:bg-primary/10 hover:scale-110'
								: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 hover:scale-110'
						}`}
										title='Preview Gallery'
									>
										<Eye className='w-5 h-5 transition-transform duration-200' />
									</button>
								</div>
							</div>
						))}
					</div>
					<div className='mt-6 flex justify-end space-x-3'>
						<button
							onClick={() => setIsModalOpen(false)}
							className='px-6 py-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors'
						>
							Cancel
						</button>
						<button
							onClick={() => {
								if (selectedTemplate) {
									setIsModalOpen(false);
									router.push(`/creator/1/artworks`);
								}
							}}
							disabled={!selectedTemplate}
							className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
						>
							Create
						</button>
					</div>
				</DialogContent>
			</Dialog>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{exhibitions.map((exhibition) => (
					<Card
						key={exhibition.id}
						className='overflow-hidden cursor-pointer hover:shadow-lg transition-shadow'
						onClick={() =>
							router.push(`/creator/${exhibition.id}/artworks`)
						}
					>
						<div className='relative aspect-video'>
							<Image
								src={exhibition.thumbnail}
								alt={exhibition.title}
								fill
								className='object-cover'
							/>
						</div>
						<div className='p-4'>
							<div className='flex items-center justify-between mb-2'>
								<h2 className='text-xl font-semibold'>
									{exhibition.title}
								</h2>
								<span
									className={`px-2 py-1 rounded-full text-xs ${
										exhibition.status === 'published'
											? 'bg-green-100 text-green-800'
											: 'bg-yellow-100 text-yellow-800'
									}`}
								>
									{exhibition.status}
								</span>
							</div>
							<div className='text-sm text-muted-foreground'>
								<p>{exhibition.artworksCount} artworks</p>
								<p>
									Last edited:{' '}
									{new Date(
										exhibition.lastEdited
									).toLocaleDateString()}
								</p>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
