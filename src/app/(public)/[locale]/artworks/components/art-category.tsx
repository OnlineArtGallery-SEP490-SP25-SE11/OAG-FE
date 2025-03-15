'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface Category {
	id: string;
	name: string;
	imageUrl: string;
	slug: string;
}

const categories: Category[] = [
	{
		id: '1',
		name: 'Contemporary Art',
		imageUrl:
			'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=1470&h=800',
		slug: 'contemporary-art'
	},
	{
		id: '2',
		name: 'Painting',
		imageUrl:
			'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1470&h=800',
		slug: 'painting'
	},
	{
		id: '3',
		name: 'Street Art',
		imageUrl:
			'https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=1470&h=800',
		slug: 'street-art'
	},
	{
		id: '4',
		name: 'Photography',
		imageUrl:
			'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=1470&h=800',
		slug: 'photography'
	},
	{
		id: '5',
		name: 'Emerging Art',
		imageUrl:
			'https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=1470&h=800',
		slug: 'emerging-art'
	},
	{
		id: '6',
		name: '20th-Century Art',
		imageUrl:
			'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1470&h=800',
		slug: '20th-century-art'
	}
];

const ArtCategory = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const touchStartX = useRef<number | null>(null);
	const touchEndX = useRef<number | null>(null);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const nextSlide = () => {
		setCurrentIndex((prev) =>
			prev === categories.length - 1 ? 0 : prev + 1
		);
	};

	const prevSlide = () => {
		setCurrentIndex((prev) =>
			prev === 0 ? categories.length - 1 : prev - 1
		);
	};

	// Swipe handlers
	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX;
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		touchEndX.current = e.touches[0].clientX;
	};

	const handleTouchEnd = () => {
		if (touchStartX.current && touchEndX.current) {
			const difference = touchStartX.current - touchEndX.current;
			if (Math.abs(difference) > 50) {
				if (difference > 0) nextSlide();
				else prevSlide();
			}
		}
		touchStartX.current = null;
		touchEndX.current = null;
	};

	const visibleItems = isMobile ? 1 : 3;

	return (
		<section className='px-4 py-8 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto relative'>
				<div className='overflow-hidden'>
					<motion.div
						className='flex'
						animate={{
							x: `-${currentIndex * (100 / visibleItems)}%`
						}}
						transition={{ duration: 0.5, ease: 'easeInOut' }}
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
					>
						{categories.map((category) => (
							<Link
								href={`/artworks/category/${category.slug}`}
								key={category.id}
								className={`group flex-shrink-0 ${
									isMobile ? 'w-full' : 'w-1/3'
								} px-2`}
							>
								<div className='flex flex-col space-y-3 touch-manipulation'>
									<div className='relative aspect-[16/9] overflow-hidden rounded-lg shadow-md'>
										<Image
											src={category.imageUrl}
											alt={category.name}
											fill
											className='object-cover transition-transform duration-500 group-hover:scale-110'
											sizes={isMobile ? '100vw' : '33vw'}
											loading='lazy'
										/>
										<motion.div
											className='absolute inset-0 bg-black/0'
											whileHover={{
												backgroundColor:
													'rgba(0,0,0,0.2)'
											}}
											transition={{ duration: 0.3 }}
										/>
									</div>
									<span className='text-sm md:text-base font-medium text-center block transition-colors duration-300 group-hover:text-gray-900'>
										{category.name}
									</span>
								</div>
							</Link>
						))}
					</motion.div>
				</div>

				{/* Navigation Buttons */}
				<motion.button
					onClick={prevSlide}
					className='absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-3 rounded-full shadow-lg opacity-50'
					whileHover={{ scale: 1.1, x: -5, opacity: 1 }}
					whileTap={{ scale: 0.95 }}
					transition={{ duration: 0.2 }}
				>
					<svg
						className='w-6 h-6'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M15 19l-7-7 7-7'
						/>
					</svg>
				</motion.button>
				<motion.button
					onClick={nextSlide}
					className='absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-3 rounded-full shadow-lg opacity-50'
					whileHover={{ scale: 1.1, x: 5, opacity: 1 }}
					whileTap={{ scale: 0.95 }}
					transition={{ duration: 0.2 }}
				>
					<svg
						className='w-6 h-6'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M9 5l7 7-7 7'
						/>
					</svg>
				</motion.button>

				{/* Dots */}
				<div className='flex justify-center gap-2 mt-4'>
					{Array.from({
						length: Math.ceil(categories.length / visibleItems)
					}).map((_, index) => (
						<motion.div
							key={index}
							className={`h-2 rounded-full transition-all duration-300 ${
								index ===
								Math.floor(currentIndex / visibleItems)
									? 'bg-gray-800 w-6'
									: 'bg-gray-300 w-2'
							}`}
							whileHover={{ scale: 1.2 }}
							transition={{ duration: 0.2 }}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default ArtCategory;
