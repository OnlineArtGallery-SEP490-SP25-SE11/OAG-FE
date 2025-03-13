'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { vietnamCurrency } from '@/utils/converters';
import { Eye, Heart } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts';

export default function TabChart() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const artworkMetrics = [
		{ month: 'Jan', views: 2500, likes: 450, shares: 120, comments: 280 },
		{ month: 'Feb', views: 3200, likes: 580, shares: 150, comments: 320 },
		{ month: 'Mar', views: 2800, likes: 520, shares: 135, comments: 290 },
		{ month: 'Apr', views: 3500, likes: 620, shares: 180, comments: 350 },
		{ month: 'May', views: 4200, likes: 780, shares: 220, comments: 420 }
	];

	const exhibitionMetrics = [
		{
			month: 'Jan',
			exhibition: 'Modern Showcase',
			visitors: 12500,
			avgDuration: 45,
			rating: 4.8
		},
		{
			month: 'Feb',
			exhibition: 'Digital Festival',
			visitors: 8900,
			avgDuration: 38,
			rating: 4.6
		},
		{
			month: 'Mar',
			exhibition: 'Contemporary Masters',
			visitors: 15600,
			avgDuration: 52,
			rating: 4.9
		}
	];

	const topArtworks = [
		{
			title: 'Sunset Dreams',
			views: 87,
			price: 8500000,
			likes: 450,
			thumbnail:
				'https://images.unsplash.com/photo-1547891654-e66ed7ebb968'
		},
		{
			title: 'Urban Rhythm',
			views: 65,
			price: 7200000,
			likes: 380,
			thumbnail:
				'https://images.unsplash.com/photo-1561214115-f2f134cc4912'
		},
		{
			title: "Nature's Whisper",
			views: 54,
			price: 6100000,
			likes: 320,
			thumbnail:
				'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5'
		},
		{
			title: 'Abstract Thoughts',
			views: 45,
			price: 5400000,
			likes: 280,
			thumbnail:
				'https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3'
		},
		{
			title: 'Digital Echoes',
			views: 32,
			price: 4200000,
			likes: 210,
			thumbnail:
				'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9'
		}
	];

	return (
		<Tabs defaultValue='artworks' className='space-y-4 md:space-y-6'>
			<TabsList className='rounded-lg bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800 shadow-sm'>
				<TabsTrigger
					value='artworks'
					className='text-sm md:text-base text-emerald-700 dark:text-emerald-200 data-[state=active]:bg-teal-500 data-[state=active]:text-white rounded-md'
				>
					Artwork Analytics
				</TabsTrigger>
				<TabsTrigger
					value='exhibitions'
					className='text-sm md:text-base text-emerald-700 dark:text-emerald-200 data-[state=active]:bg-teal-500 data-[state=active]:text-white rounded-md'
				>
					Exhibition Analytics
				</TabsTrigger>
			</TabsList>

			<TabsContent value='artworks'>
				<div className='grid gap-4 md:gap-6 md:grid-cols-2'>
					{/* Artwork Engagement Chart */}
					<Card className='border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden'>
						<CardHeader className='border-b border-gray-200 dark:border-gray-700 py-2 md:py-3 bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800'>
							<h2 className='text-base md:text-lg font-semibold text-emerald-700 dark:text-emerald-200'>
								Artwork Engagement Trends
							</h2>
						</CardHeader>
						<CardContent className='p-3 md:p-6'>
							<LineChart
								width={isMobile ? 300 : 500}
								height={isMobile ? 200 : 300}
								data={artworkMetrics}
							>
								<CartesianGrid
									strokeDasharray='3 3'
									stroke='rgba(0, 128, 128, 0.2)'
								/>
								<XAxis
									dataKey='month'
									tick={{ fill: '#6b7280' }}
								/>
								<YAxis tick={{ fill: '#6b7280' }} />
								<Tooltip
									contentStyle={{
										background: '#f1f5f9',
										borderRadius: '8px',
										border: 'none'
									}}
								/>
								<Legend wrapperStyle={{ color: '#6b7280' }} />
								<Line
									type='monotone'
									dataKey='views'
									stroke='#14b8a6'
									name='Views'
									strokeWidth={2}
								/>
								<Line
									type='monotone'
									dataKey='likes'
									stroke='#10b981'
									name='Likes'
									strokeWidth={2}
								/>
								<Line
									type='monotone'
									dataKey='shares'
									stroke='#f59e0b'
									name='Shares'
									strokeWidth={2}
								/>
								<Line
									type='monotone'
									dataKey='comments'
									stroke='#ef4444'
									name='Comments'
									strokeWidth={2}
								/>
							</LineChart>
						</CardContent>
					</Card>

					{/* Top Artworks Card */}
					<Card className='border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden'>
						<CardHeader className='border-b border-gray-200 dark:border-gray-700 py-2 md:py-3 bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800'>
							<h2 className='text-base md:text-lg font-semibold text-emerald-700 dark:text-emerald-200'>
								Top Performing Artworks
							</h2>
						</CardHeader>
						<CardContent className='p-3 md:p-6 space-y-3 md:space-y-4'>
							{topArtworks.map((artwork) => (
								<div
									key={artwork.title}
									className='flex items-center justify-between'
								>
									<div className='flex items-center space-x-3 md:space-x-4'>
										<div className='w-10 h-10 md:w-12 md:h-12 relative'>
											<Image
												src={artwork.thumbnail}
												alt={artwork.title}
												fill
												className='rounded-lg object-cover shadow-sm'
											/>
										</div>
										<div>
											<div className='text-sm md:text-base font-medium text-gray-700 dark:text-gray-200'>
												{artwork.title}
											</div>
											<div className='text-xs md:text-sm text-teal-600 dark:text-teal-400 flex gap-2 md:gap-3'>
												<span className='flex items-center gap-1'>
													<Eye className='w-3 h-3 md:w-4 md:h-4' />{' '}
													{artwork.views}
												</span>
												<span className='flex items-center gap-1'>
													<Heart className='w-3 h-3 md:w-4 md:h-4' />{' '}
													{artwork.likes}
												</span>
											</div>
										</div>
									</div>
									<div className='text-xs md:text-sm font-medium text-emerald-600 dark:text-emerald-400'>
										{vietnamCurrency(artwork.price || 0)}
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</TabsContent>

			<TabsContent value='exhibitions'>
				<div className='grid gap-4 md:gap-6 md:grid-cols-2'>
					{/* Exhibition Visitors Chart */}
					<Card className='border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden'>
						<CardHeader className='border-b border-gray-200 dark:border-gray-700 py-2 md:py-3 bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800'>
							<h2 className='text-base md:text-lg font-semibold text-emerald-700 dark:text-emerald-200'>
								Most Visited Exhibitions
							</h2>
						</CardHeader>
						<CardContent className='p-3 md:p-6'>
							<BarChart
								width={isMobile ? 300 : 500}
								height={isMobile ? 200 : 300}
								data={exhibitionMetrics}
							>
								<CartesianGrid
									strokeDasharray='3 3'
									stroke='rgba(0, 128, 128, 0.2)'
								/>
								<XAxis
									dataKey='exhibition'
									tick={{ fill: '#6b7280' }}
								/>
								<YAxis tick={{ fill: '#6b7280' }} />
								<Tooltip
									contentStyle={{
										background: '#f1f5f9',
										borderRadius: '8px',
										border: 'none'
									}}
								/>
								<Legend wrapperStyle={{ color: '#6b7280' }} />
								<Bar
									dataKey='visitors'
									fill='#14b8a6'
									name='Visitors'
								/>
							</BarChart>
						</CardContent>
					</Card>

					{/* Exhibition Statistics */}
					<Card className='border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden'>
						<CardHeader className='border-b border-gray-200 dark:border-gray-700 py-2 md:py-3 bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800'>
							<h2 className='text-base md:text-lg font-semibold text-emerald-700 dark:text-emerald-200'>
								Exhibition Details
							</h2>
						</CardHeader>
						<CardContent className='p-3 md:p-6 space-y-4 md:space-y-6'>
							{exhibitionMetrics.map((metric) => (
								<div key={metric.month} className='space-y-2'>
									<div className='text-sm md:text-base font-medium text-gray-700 dark:text-gray-200'>
										{metric.exhibition}
									</div>
									<div className='grid grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm'>
										<div>
											<div className='text-teal-600 dark:text-teal-400'>
												Visitors
											</div>
											<div className='font-medium text-gray-700 dark:text-gray-200'>
												{metric.visitors.toLocaleString()}
											</div>
										</div>
										<div>
											<div className='text-teal-600 dark:text-teal-400'>
												Avg. Duration
											</div>
											<div className='font-medium text-gray-700 dark:text-gray-200'>
												{metric.avgDuration} mins
											</div>
										</div>
										<div>
											<div className='text-teal-600 dark:text-teal-400'>
												Rating
											</div>
											<div className='font-medium text-amber-500 dark:text-amber-400'>
												★ {metric.rating}
											</div>
										</div>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</TabsContent>
		</Tabs>
	);
}
