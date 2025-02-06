'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/components/ui/carousel';

export default async function () {
	const cardsData = [
		{ image: '/image/anh7.jpg', content: 'Fall collection' },
		{ image: '/image/anh8.jpg', content: 'Winter collection' },
		{ image: '/image/anh9.jpg', content: 'Summer collection' },
		{ image: '/image/anh10.jpg', content: 'Spring collection' },
		{ image: '/image/anh11.jpg', content: 'Classic collection' }
	];

	return (
		<>
			<div className='bg-gray-100 p-4 rounded-lg shadow-lg'>
				<h1 className='text-2xl font-bold text-center mb-4'>
					Trending Art Exhibit
				</h1>
				<Carousel
					opts={{
						align: 'start'
					}}
					className='w-full max-w-6xl mx-auto'
				>
					<CarouselContent>
						{cardsData.map((card, index) => (
							<CarouselItem
								key={index}
								className='md:basis-1/2 lg:basis-1/3'
							>
								<div className='p-2'>
									<Card className='hover:shadow-xl transition-shadow duration-300'>
										<CardContent className='flex flex-col items-center justify-center p-6 bg-white rounded-lg'>
											<img
												src={card.image}
												alt={`Image ${index + 1}`}
												style={{
													width: '300px',
													height: '200px'
												}}
												className='object-cover rounded-lg'
											/>
											<span className='text-xl  text-gray-800'>
												{card.content}
											</span>
										</CardContent>
									</Card>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className='text-gray-600 hover:text-gray-900' />
					<CarouselNext className='text-gray-600 hover:text-gray-900' />
				</Carousel>
			</div>
		</>
	);
}
