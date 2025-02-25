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
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

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
					imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946'
				},
				{
					id: 'a2', 
					title: 'Tropical Paradise',
					imageUrl: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb'
				},
				{
					id: 'a5',
					title: 'Ocean View',
					imageUrl: 'https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3'
				},
				{
					id: 'a6',
					title: 'Sandy Beach',
					imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9'
				},
				{
					id: 'a7',
					title: 'Palm Trees',
					imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5'
				},
				{
					id: 'a8',
					title: 'Summer Nights',
					imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35'
				},
				{
					id: 'a9',
					title: 'Coastal Dreams',
					imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
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
					imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946'
				},
				{
					id: 'a4',
					title: 'Geometric Patterns',
					imageUrl: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb'
				}
			]
		}
	]);

	const [newCollection, setNewCollection] = useState({
		name: '',
		description: ''
	});

	const [isOpen, setIsOpen] = useState(false);

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
			setIsOpen(false);
		},
		[collections.length, newCollection]
	);

	return (
		<div className='max-w-7xl mx-auto p-4'>
			<div className='flex items-center justify-between mb-8'>
				<h1 className='text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'>Collections</h1>
				<div className='flex gap-2'>
					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogTrigger asChild>
							<Button variant='default' size='sm' className='hover:shadow-md transition-shadow'>
								<Plus className='w-4 h-4 mr-2' />
								Add Collection
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Create New Collection</DialogTitle>
							</DialogHeader>
							<form onSubmit={handleNewCollectionSubmit} className='space-y-6'>
								<div className='space-y-2'>
									<Label htmlFor='name' className='text-sm font-medium'>Collection Name</Label>
									<Input
										id='name'
										name='name'
										value={newCollection.name}
										onChange={handleNewCollectionChange}
										required
										className='w-full transition-shadow focus:shadow-md'
										placeholder='Enter collection name...'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='description' className='text-sm font-medium'>Description</Label>
									<Textarea
										id='description'
										name='description'
										value={newCollection.description}
										onChange={handleNewCollectionChange}
										required
										className='w-full min-h-[100px] transition-shadow focus:shadow-md'
										placeholder='Describe your collection...'
									/>
								</div>
								<Button type='submit' className='w-full shadow hover:shadow-lg transition-shadow'>
									Create Collection
								</Button>
							</form>
						</DialogContent>
					</Dialog>
				
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
				{collections.map((collection) => (
					<Link href={`/artists/collections/${collection.id}`} key={collection.id} className="h-full">
						<Card className='transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-full flex flex-col'>
							<CardHeader>
								<div>
									<CardTitle className='text-xl font-semibold'>{collection.name}</CardTitle>
									<CardDescription className='mt-2 text-sm'>
										{collection.artworks.length} artworks
									</CardDescription>
								</div>
							</CardHeader>
							<CardContent className='flex-1 flex flex-col'>
								<p className='text-sm text-muted-foreground mb-4 line-clamp-2'>
									{collection.description}
								</p>
								<div className='grid grid-cols-3 gap-3 flex-1 p-3 rounded-lg bg-muted/50'>
									{collection.artworks.slice(0, 5).map((artwork) => (
										<div
											key={artwork.id}
											className='relative aspect-square rounded-lg overflow-hidden'
										>
											<Image
												src={artwork.imageUrl || '/placeholder.svg'}
												alt={artwork.title}
												fill
												className='object-cover transition-transform hover:scale-110'
											/>
										</div>
									))}
									{collection.artworks.length > 5 && (
										<div className='relative aspect-square bg-muted/80 rounded-lg flex items-center justify-center backdrop-blur-sm'>
											<span className='text-lg font-semibold'>
												+{collection.artworks.length - 5}
											</span>
										</div>
									)}
									{collection.artworks.length === 0 && (
										<div className='col-span-3 flex items-center justify-center h-full text-muted-foreground'>
											No artworks yet
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
