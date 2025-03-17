'use client';
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
} from '@/components/ui/dialog';

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
				{ id: 'a1', title: 'Beach Sunset', imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946' },
				{ id: 'a2', title: 'Tropical Paradise', imageUrl: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb' },
				{ id: 'a5', title: 'Ocean View', imageUrl: 'https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3' },
				{ id: 'a6', title: 'Sandy Beach', imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9' },
				{ id: 'a7', title: 'Palm Trees', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5' },
				{ id: 'a8', title: 'Summer Nights', imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35' },
				{ id: 'a9', title: 'Coastal Dreams', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e' },
			],
		},
		{
			id: '2',
			name: 'Abstract Series',
			description: 'A collection of abstract artworks',
			coverImage: 'https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg',
			artworks: [
				{ id: 'a3', title: 'Colorful Shapes', imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946' },
				{ id: 'a4', title: 'Geometric Patterns', imageUrl: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb' },
			],
		},
	]);

	const [newCollection, setNewCollection] = useState({
		name: '',
		description: '',
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
					artworks: [],
				},
			]);
			setNewCollection({ name: '', description: '' });
			setIsOpen(false);
		},
		[collections.length, newCollection]
	);

	return (
		<div className="p-3 md:p-6 space-y-2 md:space-y-3 max-w-6xl mx-auto">
			<div className="flex items-center justify-between mb-4 md:mb-6">
				<div>
					<h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
						Collections
					</h1>
					<p className="text-xs md:text-sm text-teal-600 dark:text-cyan-400 mt-1">
						Organize and showcase your artworks
					</p>
				</div>
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger asChild>
						<Button
							className="rounded-lg h-10 text-sm md:text-base bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-md"
						>
							<Plus className="w-4 h-4 mr-2" />
							Add Collection
						</Button>
					</DialogTrigger>
					<DialogContent className="rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
						<DialogHeader>
							<DialogTitle className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
								Create New Collection
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleNewCollectionSubmit} className="space-y-4 md:space-y-6">
							<div className="space-y-2">
								<Label htmlFor="name" className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-200">
									Collection Name
								</Label>
								<Input
									id="name"
									name="name"
									value={newCollection.name}
									onChange={handleNewCollectionChange}
									required
									className="rounded-lg border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-teal-500 h-10 text-sm md:text-base"
									placeholder="Enter collection name..."
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="description" className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-200">
									Description
								</Label>
								<Textarea
									id="description"
									name="description"
									value={newCollection.description}
									onChange={handleNewCollectionChange}
									required
									className="min-h-[100px] rounded-lg border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-teal-500 text-sm md:text-base"
									placeholder="Describe your collection..."
								/>
							</div>
							<Button
								type="submit"
								className="w-full rounded-lg h-10 text-sm md:text-base bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-md"
							>
								Create Collection
							</Button>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
				{collections.map((collection) => (
					<Link href={`/artists/collections/${collection.id}`} key={collection.id} className="h-full">
						<Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
							<CardHeader className="border-b border-gray-200 dark:border-gray-700 py-2 md:py-3 bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800">
								<h2 className="text-base md:text-lg font-semibold text-emerald-700 dark:text-emerald-200 line-clamp-1">
									{collection.name}
								</h2>
								<p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-300">
									{collection.artworks.length} artworks
								</p>
							</CardHeader>
							<CardContent className="p-3 md:p-4 flex-1 flex flex-col">
								<p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-2 md:mb-4 line-clamp-2">
									{collection.description}
								</p>
								<div className="grid grid-cols-3 gap-2 md:gap-3 flex-1 p-2 md:p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
									{collection.artworks.slice(0, 5).map((artwork) => (
										<div key={artwork.id} className="relative aspect-square rounded-lg overflow-hidden">
											<Image
												src={artwork.imageUrl || '/placeholder.svg'}
												alt={artwork.title}
												fill
												className="object-cover transition-transform hover:scale-105 duration-300"
											/>
										</div>
									))}
									{collection.artworks.length > 5 && (
										<div className="relative aspect-square bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
                      <span className="text-sm md:text-base font-semibold text-emerald-700 dark:text-emerald-200">
                        +{collection.artworks.length - 5}
                      </span>
										</div>
									)}
									{collection.artworks.length === 0 && (
										<div className="col-span-3 flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-xs md:text-sm">
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