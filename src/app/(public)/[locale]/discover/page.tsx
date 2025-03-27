'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Sparkles, ChevronRight, Clock, Flame } from 'lucide-react';
import { GalleryCard } from './components/gallery-card';

interface Gallery {
	id: string;
	title: string;
	author: string;
	thumbnail: string;
	category: string;
	description: string;
	likes: number;
	views: number;
	featured: boolean;
	tags: string[];
}

export default function DiscoverPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [activeTab, setActiveTab] = useState('featured');

    // Mock data - replace with API call
    const galleries: Gallery[] = [
        {
            id: "6071b3e5c1b4d82edc4eda30",
            title: "Modern Art Exhibition 2025",
            author: "Johny Dang",
            thumbnail: "https://images.unsplash.com/photo-1561214115-f2f134cc4912",
            category: "Modern Art",
            description: "Contemporary mixed media portrait artwork by Johny Dang",
            likes: 1234,
            views: 5678,
            featured: true,
            tags: ["Modern", "Abstract", "2024"]
        },
        {
            id: "6071b3e5c1b4d82edc4eda31", 
            title: "Digital Dreams",
            author: "Sarah Chen",
            thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
            category: "Digital Art",
            description: "Exploring the intersection of technology and creativity",
            likes: 892,
            views: 3421,
            featured: true,
            tags: ["Digital", "Tech", "Future"]
        },
        {
            id: "3",
            title: "Nature's Canvas",
            author: "Michael Rivera",
            thumbnail: "https://images.unsplash.com/photo-1518998053901-5348d3961a04",
            category: "Photography",
            description: "Stunning landscape photography from around the world",
            likes: 567,
            views: 2198,
            featured: true,
            tags: ["Nature", "Photography", "Landscape"]
		},
		{
			id: '4',
			title: 'Urban Reflections',
			author: 'Emily White',
			thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
			category: 'Urban Art',
			description: 'Capturing the essence of city life',
			likes: 345,
			views: 1234,
			featured: true,
			tags: ['Urban', 'Art', 'City'],
		},
	];

	const filteredGalleries = galleries.filter((gallery) => {
		const searchLower = searchQuery.toLowerCase();
		return (
			gallery.title.toLowerCase().includes(searchLower) ||
			gallery.author.toLowerCase().includes(searchLower) ||
			gallery.tags.some((tag) => tag.toLowerCase().includes(searchLower))
		);
	});

	return (
		<div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
			{/* Hero Section */}
			<div className='relative h-[300px] bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
				<div className='absolute inset-0 bg-black/20' />
				<div className='relative max-w-5xl mx-auto px-4 py-12'>
					<h1 className='text-3xl md:text-4xl font-bold mb-4'>
						Discover Amazing Virtual Galleries
					</h1>
					<p className='text-lg mb-6 max-w-xl'>
						Explore curated exhibitions from artists around the
						world. Experience art in immersive virtual spaces.
					</p>

					{/* Search Bar */}
					<div className='flex gap-3 max-w-xl'>
						<div className='flex-1 relative'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
							<Input
								placeholder='Search galleries, artists, or styles...'
								className='w-full pl-9 h-10 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/60'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<Button className='h-10 px-4 bg-white text-purple-600 hover:bg-white/90'>
							Search
						</Button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className='max-w-7xl mx-auto px-4 py-8'>
				<Tabs defaultValue={activeTab} onValueChange={setActiveTab} className='space-y-6'>
					<div className='flex items-center justify-between mb-4'>
						<TabsList className='bg-white/50 backdrop-blur-sm p-1 rounded-lg'>
							<TabsTrigger value='featured' className='flex items-center gap-2'>
								<Sparkles className='w-4 h-4' /> Featured
							</TabsTrigger>
							<TabsTrigger value='trending' className='flex items-center gap-2'>
								<Flame className='w-4 h-4' /> Trending
							</TabsTrigger>
							<TabsTrigger value='recent' className='flex items-center gap-2'>
								<Clock className='w-4 h-4' /> Recent
							</TabsTrigger>
						</TabsList>
						<Button variant='ghost'>
							View All <ChevronRight className='w-4 h-4 ml-1' />
						</Button>
					</div>

					<TabsContent value='featured' className='space-y-4'>
						<div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
							{filteredGalleries
								.filter((g) => g.featured)
								.map((gallery) => (
									<Link href={`/exhibitions/${gallery.id}`} key={gallery.id}>
										<GalleryCard gallery={gallery} />
									</Link>
								))}
						</div>
					</TabsContent>

					{/* Add similar TabsContent for 'trending' and 'recent' */}
				</Tabs>
			</div>
		</div>
	);
}
