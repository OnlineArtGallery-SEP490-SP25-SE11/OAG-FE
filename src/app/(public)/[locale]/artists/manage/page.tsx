'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type Artwork = {
	id: string;
	title: string;
	artist: string;
	status: string;
	price: number;
	imageUrl: string;
};

const ITEMS_PER_PAGE = 9;

export default function ManageArtworks() {
	const [artworks, setArtworks] = useState<Artwork[]>([
		{
			id: '1',
			title: 'Sunset',
			artist: 'John Doe',
			status: 'Available',
			price: 500,
			imageUrl: '/demo.jpg'
		},
		{
			id: '2',

			title: 'Mountain View',
			artist: 'Jane Smith',
			status: 'Sold',
			price: 750,
			imageUrl: '/demo.jpg'
		},
		{
			id: '3',
			title: 'Abstract Thoughts',
			artist: 'Bob Johnson',
			status: 'Hidden',
			price: 1000,

			imageUrl: '/demo.jpg'
		}
		// Add more artwork entries here...
	]);

	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [statusFilter, setStatusFilter] = useState('All');

	const filteredArtworks = artworks.filter(
		(artwork) =>
			(artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				artwork.artist
					.toLowerCase()
					.includes(searchTerm.toLowerCase())) &&
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
		<div>
			<h1 className='text-3xl font-bold mb-6'>Manage Artworks</h1>
			<div className='flex mb-4 gap-4'>
				<Input
					type='text'
					placeholder='Search artworks...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className='max-w-sm'
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
					</SelectContent>
				</Select>
			</div>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId='artworks'>
					{(provided) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6'
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
										>
											<CardHeader>
												<CardTitle>
													{artwork.title}
												</CardTitle>
											</CardHeader>
											<CardContent>
												<Image
													src={
														artwork.imageUrl ||
														'/placeholder.svg'
													}
													alt={artwork.title}
													width={200}
													height={200}
													className='mb-4 rounded-md'
												/>
												<p>
													<strong>Artist:</strong>{' '}
													{artwork.artist}
												</p>
												<p>
													<strong>Status:</strong>{' '}
													{artwork.status}
												</p>
												<p>
													<strong>Price:</strong> $
													{artwork.price}
												</p>
												<div className='mt-4'>
													<Button className='mr-2'>
														Edit
													</Button>
													<Button variant='destructive'>
														Delete
													</Button>
												</div>
											</CardContent>
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
							onClick={() =>
								setCurrentPage((prev) => Math.max(prev - 1, 1))
							}
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
							onClick={() =>
								setCurrentPage((prev) =>
									Math.min(prev + 1, totalPages)
								)
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
