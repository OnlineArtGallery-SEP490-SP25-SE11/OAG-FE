'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import Image from 'next/image';
import {
	DragDropContext,
	Draggable,
	Droppable,
	DropResult
} from 'react-beautiful-dnd';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
} from '@/components/ui/pagination';
import { vietnamCurrency } from '@/utils/converters';

type Artwork = {
	id: string;
	title: string;
	description: string;
	category: string[];
	dimensions: {
		width: number;
		height: number;
	};
	images: {
		url: string;
		type: string;
		order: number;
	}[];
	status: string;
	price: number;
	createdAt: Date;
	updatedAt: Date;
	viewCount: number;
};

const ITEMS_PER_PAGE = 12;

export default function ManageArtworks() {
	const [artworks, setArtworks] = useState<Artwork[]>([
		{
			id: '1',
			title: 'Sunset',
			description: 'A beautiful over the ocean',
			category: ['Landscape', 'Nature'],
			dimensions: { width: 100, height: 80 },
			images: [
				{
					url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
					type: 'main',
					order: 1
				}
			],
			status: 'Available',
			price: 5000000,
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01'),
			viewCount: 150
		},
		{
			id: '2',
			title: 'Mountain View',
			description: 'Majestic mountain peaks at sunrise',
			category: ['Landscape', 'Nature'],
			dimensions: { width: 120, height: 90 },
			images: [
				{
					url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9',
					type: 'main',
					order: 1
				}
			],
			status: 'Sold',
			price: 7500000,
			createdAt: new Date('2024-01-02'),
			updatedAt: new Date('2024-01-02'),
			viewCount: 200
		},
		{
			id: '3',
			title: 'Abstract Thoughts',
			description: 'An abstract of modern life',
			category: ['Abstract', 'Modern'],
			dimensions: { width: 80, height: 100 },
			images: [
				{
					url: 'https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3',
					type: 'main',
					order: 1
				}
			],
			status: 'Hidden',
			price: 1000000,
			createdAt: new Date('2024-01-03'),
			updatedAt: new Date('2024-01-03'),
			viewCount: 75
		},
		{
			id: '4',
			title: 'Urban Dreams',
			description: 'A cityscape at twilight',
			category: ['Urban', 'Architecture'],
			dimensions: { width: 150, height: 100 },
			images: [
				{
					url: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb',
					type: 'main',
					order: 1
				}
			],
			status: 'Available',
			price: 850000,
			createdAt: new Date('2024-01-04'),
			updatedAt: new Date('2024-01-04'),
			viewCount: 180
		},
		{
			id: '5',
			title: 'Floral Symphony',
			description: 'Vibrant garden flowers in bloom',
			category: ['Nature', 'Still Life'],
			dimensions: { width: 90, height: 90 },
			images: [
				{
					url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946',
					type: 'main',
					order: 1
				}
			],
			status: 'Available',
			price: 6000000,
			createdAt: new Date('2024-01-05'),
			updatedAt: new Date('2024-01-05'),
			viewCount: 120
		},
		{
			id: '6',
			title: 'Desert Whispers',
			description: 'Minimalist desert landscape at dawn',
			category: ['Landscape', 'Minimalist'],
			dimensions: { width: 120, height: 80 },
			images: [
				{
					url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35',
					type: 'main',
					order: 1
				}
			],
			status: 'Selling',
			price: 900000,
			createdAt: new Date('2024-01-06'),
			updatedAt: new Date('2024-01-06'),
			viewCount: 95
		}
	]);

	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [statusFilter, setStatusFilter] = useState('All');

	const filteredArtworks = artworks.filter(
		(artwork) =>
			(artwork.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
			(statusFilter === 'All' || artwork.status === statusFilter)
	);

	const totalPages = Math.ceil(filteredArtworks.length / ITEMS_PER_PAGE);
	const paginatedArtworks = filteredArtworks.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	const onDragEnd = (result: DropResult) => {
		if (!result.destination) {
			return;
		}

		const items = Array.from(artworks);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		setArtworks(items);
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-4xl font-bold mb-8'>Manage Artworks</h1>
			<div className='flex flex-col md:flex-row mb-6 gap-4'>
				<Input
					type='text'
					placeholder='Search artworks...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className='md:max-w-sm'
				/>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Filter by status' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='All'>All</SelectItem>
						<SelectItem value='Available'>Available</SelectItem>
						<SelectItem value='Sold'>Sold</SelectItem>
						<SelectItem value='Hidden'>Hidden</SelectItem>
						<SelectItem value='Selling'>Selling</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId='artworks'>
					{(provided) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8'
						>
							{paginatedArtworks.map((artwork, index) => (
								<Draggable
									key={artwork.id}
									draggableId={artwork.id}
									index={index}
								>
									{(provided) => (
										<Card
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											className='group relative aspect-square overflow-hidden rounded-lg transition-all duration-300 hover:shadow-xl'
										>
											<Image
												src={artwork.images[0]?.url || '/placeholder.svg'}
												alt={artwork.title}
												fill
												className='object-cover transition-transform duration-300 group-hover:scale-110'
											/>
											<div className='absolute inset-0 bg-black/60 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
												<h3 className='text-lg font-bold mb-2'>{artwork.title}</h3>
												<div className='space-y-1 text-sm'>
													<p>{artwork.status}</p>
													<p>{vietnamCurrency(artwork.price)}</p>
													<p className='line-clamp-2'>{artwork.description}</p>
												</div>
												<div className='absolute bottom-4 left-4 right-4 flex gap-2'>
													<Button size="sm" className='flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30'>
														Edit
													</Button>
													<Button size="sm" variant='destructive' className='flex-1 bg-red-500/20 backdrop-blur-sm hover:bg-red-500/30'>
														Delete
													</Button>
												</div>
											</div>
										</Card>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href='#'
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						/>
					</PaginationItem>
					{[...Array(totalPages)].map((_, i) => (
						<PaginationItem key={i}>
							<PaginationLink
								href='#'
								onClick={() => setCurrentPage(i + 1)}
								isActive={currentPage === i + 1}
							>
								{i + 1}
							</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem>
						<PaginationNext
							href='#'
							onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
