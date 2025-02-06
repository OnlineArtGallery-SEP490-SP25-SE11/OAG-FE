'use client';

import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export const CustomCarousel = () => {
	const [carouselAPI, setCarouselAPI] = useState<CarouselApi | null>(null);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

	const onSelect = useCallback(() => {
		if (!carouselAPI) return;

		setSelectedIndex(carouselAPI.selectedScrollSnap());
	}, [carouselAPI]);

	const scrollTo = (index: number) => {
		if (!carouselAPI) return;

		carouselAPI.scrollTo(index);
	};

	useEffect(() => {
		if (!carouselAPI) return;

		onSelect();

		setScrollSnaps(carouselAPI.scrollSnapList());

		carouselAPI.on('select', onSelect);
	}, [carouselAPI, onSelect]);
};

export default function ViewPaintings() {
	const [carouselAPI, setCarouselAPI] = useState<CarouselApi | null>(null);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

	const onSelect = useCallback(() => {
		if (!carouselAPI) return;
		setSelectedIndex(carouselAPI.selectedScrollSnap());
	}, [carouselAPI]);

	const scrollTo = (index: number) => {
		if (!carouselAPI) return;
		carouselAPI.scrollTo(index);
	};

	useEffect(() => {
		if (!carouselAPI) return;
		onSelect();
		setScrollSnaps(carouselAPI.scrollSnapList());
		carouselAPI.on('select', onSelect);
	}, [carouselAPI, onSelect]);

	const images = [
		'/image/anh1.jpeg',
		'/image/anh2.jpg',
		'/image/anh3.jpg',
		'/image/anh4.jpg',
		'/image/anh5.jpg',
		'/image/anh6.jpeg'
	];

	return (
		<>
			<div className='mx-auto p-5 bg-orange-200'>
				<h1 className='text-3xl font-bold text-center mb-4'>
					View Paintings
				</h1>
				<div className=' mx-auto'>
					<Carousel
						plugins={[Autoplay({ delay: 2500 })]}
						opts={{ loop: true, align: 'center' }}
						setApi={setCarouselAPI}
					>
						<CarouselContent>
							{images.map((imageSrc, index) => (
								<CarouselItem
									key={index}
									className='md:basis-1/2'
								>
									<div className='border rounded-md h-[16rem] bg-muted/50 flex items-center justify-center md:h-[20rem] shadow-lg'>
										<img
											src={imageSrc}
											alt={`Painting ${index + 1}`}
											className='object-cover h-full w-full'
										/>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
					<div className='flex justify-center mt-4 space-x-2'>
						{scrollSnaps.map((_, index) => (
							<Button
								key={index}
								onClick={() => scrollTo(index)}
								size='icon'
								className={`w-2 h-2 rounded-full ${
									selectedIndex === index
										? 'bg-primary'
										: 'bg-gray-300'
								}`}
							/>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
