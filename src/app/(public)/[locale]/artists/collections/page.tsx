/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useCallback } from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Edit, Grid, Move } from 'lucide-react';
import Image from 'next/image';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

type Artwork = {
	id: string;
	title: string;
	imageUrl: string;
};

type Collection = {
	id: string;
	name: string;
	description: string;
	coverImage: string;
	artworks: Artwork[];
};

export default function Collections() {
	const [collections, setCollections] = useState<Collection[]>([
		{
			id: '1',
			name: 'Summer Collection',
			description: 'Artworks inspired by summer',
			coverImage: 'https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg',
			artworks: [
				{
					id: 'a1',
					title: 'Beach Sunset',
					imageUrl: 'https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg'
				},
				{
					id: 'a2',
					title: 'Tropical Paradise',
					imageUrl: 'https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg'
				}
			]
		},
		{
			id: '2',
			name: 'Abstract Series',
			description: 'A collection of abstract artworks',
			coverImage: 'https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg',
			artworks: [
				{
					id: 'a3',

					title: 'Colorful Shapes',
					imageUrl: 'https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg'

				},
				{
					id: 'a4',
					title: 'Geometric Patterns',
					imageUrl: 'https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg'

				}
			]
		}
	]);

	const [newCollection, setNewCollection] = useState({
		name: '',
		description: ''
	});

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [editingCollection, setEditingCollection] = useState<string | null>(
		null
	);
	const [draggedItem, setDraggedItem] = useState<string | null>(null);

	const handleNewCollectionChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const { name, value } = e.target;
			setNewCollection((prev) => ({ ...prev, [name]: value }));
		},
		[]
	);

	const handleNewCollectionSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			const newId = (collections.length + 1).toString();
			setCollections((prev) => [
				...prev,
				{
					...newCollection,
					id: newId,
					coverImage: '/placeholder.svg?height=100&width=100',
					artworks: []
				}
			]);
			setNewCollection({ name: '', description: '' });
		},
		[collections.length, newCollection]
	);

	const handleDeleteCollection = useCallback((id: string) => {
		setCollections((prev) =>
			prev.filter((collection) => collection.id !== id)
		);
	}, []);

	const handleEditCollection = useCallback((id: string) => {
		setEditingCollection(id);
	}, []);

	const onDragStart = useCallback((start: any) => {
		setDraggedItem(start.draggableId);
	}, []);

	const onDragEnd = useCallback((result: any) => {
		setDraggedItem(null);
		if (!result.destination) return;

		const { source, destination } = result;

		if (source.droppableId === destination.droppableId) {
			// Moving within the same collection
			setCollections((prev) => {
				const collectionIndex = prev.findIndex(
					(c) => c.id === source.droppableId
				);
				const newArtworks = Array.from(prev[collectionIndex].artworks);
				const [reorderedItem] = newArtworks.splice(source.index, 1);
				newArtworks.splice(destination.index, 0, reorderedItem);

				const newCollections = [...prev];
				newCollections[collectionIndex] = {
					...prev[collectionIndex],
					artworks: newArtworks
				};

				return newCollections;
			});
		} else {
			// Moving between collections
			setCollections((prev) => {
				const sourceCollectionIndex = prev.findIndex(
					(c) => c.id === source.droppableId
				);
				const destCollectionIndex = prev.findIndex(
					(c) => c.id === destination.droppableId
				);

				const sourceArtworks = Array.from(
					prev[sourceCollectionIndex].artworks
				);
				const destArtworks = Array.from(
					prev[destCollectionIndex].artworks
				);

				const [movedItem] = sourceArtworks.splice(source.index, 1);
				destArtworks.splice(destination.index, 0, movedItem);

				const newCollections = [...prev];
				newCollections[sourceCollectionIndex] = {
					...prev[sourceCollectionIndex],
					artworks: sourceArtworks
				};
				newCollections[destCollectionIndex] = {
					...prev[destCollectionIndex],
					artworks: destArtworks
				};

				return newCollections;
			});
		}
	}, []);

	return (
		<div className='max-w-4xl mx-auto p-4'>
			<div className='flex items-center justify-between mb-6'>
				<h1 className='text-3xl font-bold'>Collections</h1>
				<Button variant='outline' size='sm'>
					<Grid className='w-4 h-4 mr-2' />
					View Grid
				</Button>
			</div>

			<DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
					{collections.map((collection) => (
						<Card
							key={collection.id}
							className='transition-shadow hover:shadow-lg'
						>
							<CardHeader>
								<div className='flex justify-between items-start'>
									<div>
										<CardTitle>{collection.name}</CardTitle>
										<CardDescription className='mt-1 text-sm'>
											{collection.artworks.length}{' '}
											artworks
										</CardDescription>
									</div>
									<div className='flex gap-2'>
										<Button
											variant='ghost'
											size='sm'
											onClick={() =>
												handleEditCollection(
													collection.id
												)
											}
										>
											<Edit className='w-4 h-4' />
										</Button>
										<Button
											variant='ghost'
											size='sm'
											onClick={() =>
												handleDeleteCollection(
													collection.id
												)
											}
										>
											<Trash2 className='w-4 h-4 text-destructive' />
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className='relative w-full h-40 mb-4'>
									<Image
										src={
											collection.coverImage ||
											'/placeholder.svg'
										}
										alt={collection.name}
										fill
										className='rounded-md object-cover'
									/>
								</div>
								<p className='text-sm text-muted-foreground mb-4'>
									{collection.description}
								</p>
								<Droppable droppableId={collection.id}>
									{(provided, snapshot) => (
										<div
											{...provided.droppableProps}
											ref={provided.innerRef}
											className={`space-y-2 min-h-[100px] p-2 rounded-md transition-colors ${
												snapshot.isDraggingOver
													? 'bg-accent'
													: 'bg-muted'
											}`}
										>
											{collection.artworks.map(
												(artwork, index) => (
													<Draggable
														key={artwork.id}
														draggableId={artwork.id}
														index={index}
													>
														{(
															provided,
															snapshot
														) => (
															<div
																ref={
																	provided.innerRef
																}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																className={`flex items-center p-2 rounded-md bg-background border ${
																	snapshot.isDragging
																		? 'shadow-lg'
																		: ''
																} ${
																	draggedItem ===
																	artwork.id
																		? 'border-primary'
																		: ''
																}`}
															>
																<Move className='w-4 h-4 mr-2 text-muted-foreground' />
																<div className='relative w-10 h-10 mr-2'>
																	<Image
																		src={
																			artwork.imageUrl ||
																			'/placeholder.svg'
																		}
																		alt={
																			artwork.title
																		}
																		fill
																		className='rounded-sm object-cover'
																	/>
																</div>
																<span className='text-sm'>
																	{
																		artwork.title
																	}
																</span>
															</div>
														)}
													</Draggable>
												)
											)}
											{provided.placeholder}
											{collection.artworks.length ===
												0 && (
												<Alert>
													<AlertDescription>
														Drag and drop artworks
														here
													</AlertDescription>
												</Alert>
											)}
										</div>
									)}
								</Droppable>
							</CardContent>
						</Card>
					))}
				</div>
			</DragDropContext>

			<Card className='bg-card'>
				<CardHeader>
					<CardTitle>Create New Collection</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleNewCollectionSubmit}
						className='space-y-4'
					>
						<div className='space-y-2'>
							<Label htmlFor='name'>Collection Name</Label>
							<Input
								id='name'
								name='name'
								value={newCollection.name}
								onChange={handleNewCollectionChange}
								required
								className='w-full'
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='description'>Description</Label>
							<Textarea
								id='description'
								name='description'
								value={newCollection.description}
								onChange={handleNewCollectionChange}
								required
								className='w-full'
							/>
						</div>
						<Button type='submit' className='w-full'>
							Create Collection
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
