'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, Filter, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { vietnamCurrency } from '@/utils/converters';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';

// Types
type SectionName =
	| 'artists'
	| 'categories'
	| 'materials'
	| 'waysToBuy'
	| 'sizes'
	| 'price';

interface FilterSectionProps {
	title: string;
	isExpanded: boolean;
	onToggle: () => void;
	children: React.ReactNode;
}

interface CheckboxItemProps {
	id: string;
	label: string;
	description?: string;
}

// Data Constants
const artists = [
	{ id: 'following', name: 'Artists you follow' },
	{ id: '1', name: 'Leonardo da Vinci' },
	{ id: '2', name: 'Vincent van Gogh' },
	{ id: '3', name: 'Pablo Picasso' },
	{ id: '4', name: 'Claude Monet' },
	{ id: '5', name: 'Andy Warhol' }
];

const categories = [
	'Paintings',
	'Sculptures',
	'Photography',
	'Digital Art',
	'Prints',
	'Drawing'
];

const materials = [
	'Acrylic',
	'Oil',
	'Watercolor',
	'Canvas',
	'Wood',
	'Metal',
	'Glass',
	'Paper'
];

const waysToBuy = [
	{ id: 'offer', label: 'Make an Offer' },
	{ id: 'bid', label: 'Bid' },
	{ id: 'contact', label: 'Contact Gallery' }
];

const sizes = [
	{
		id: 'small',
		label: 'Small (under 40cm)',
		description: 'Perfect for intimate spaces'
	},
	{
		id: 'medium',
		label: 'Medium (40-100cm)',
		description: 'Ideal for most walls'
	},
	{
		id: 'large',
		label: 'Large (over 100cm)',
		description: 'Statement pieces'
	}
];

// Reusable Components
const FilterSection = ({
	title,
	isExpanded,
	onToggle,
	children
}: FilterSectionProps) => (
	<div className='space-y-4 border-b border-gray-200 dark:border-gray-700 pb-4'>
		<motion.div
			className='flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors'
			onClick={onToggle}
			whileTap={{ scale: 0.98 }}
		>
			<h3 className='font-medium text-gray-900 dark:text-gray-100'>
				{title}
			</h3>
			<AnimatePresence mode='wait' initial={false}>
				{isExpanded ? (
					<motion.div
						key='up'
						initial={{ rotate: 0 }}
						animate={{ rotate: 0 }}
						exit={{ rotate: 180 }}
						transition={{ duration: 0.2 }}
					>
						<ChevronUp className='h-4 w-4 text-gray-500' />
					</motion.div>
				) : (
					<motion.div
						key='down'
						initial={{ rotate: 180 }}
						animate={{ rotate: 0 }}
						exit={{ rotate: 180 }}
						transition={{ duration: 0.2 }}
					>
						<ChevronDown className='h-4 w-4 text-gray-500' />
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
		<AnimatePresence>
			{isExpanded && (
				<motion.div
					className='pl-2'
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: 'auto' }}
					exit={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.2 }}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	</div>
);

const CheckboxItem = ({ id, label, description }: CheckboxItemProps) => (
	<motion.div
		className='flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors'
		whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
		whileTap={{ scale: 0.98 }}
	>
		<Checkbox
			id={id}
			className={`${description ? 'mt-1' : ''} rounded-sm`}
		/>
		<div>
			<label
				htmlFor={id}
				className='text-sm font-semibold leading-none cursor-pointer text-gray-900 dark:text-gray-50'
			>
				{label}
			</label>
			{description && (
				<p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
					{description}
				</p>
			)}
		</div>
	</motion.div>
);

// Category Selector Component
const CategorySelector = ({
	showCategorySelect,
	setShowCategorySelect,
	selectedCategories,
	setSelectedCategories,
	isScrolled
}: {
	showCategorySelect: boolean;
	setShowCategorySelect: (show: boolean) => void;
	selectedCategories: string[];
	setSelectedCategories: (categories: string[]) => void;
	isScrolled: boolean;
}) => (
	<div className='relative'>
		<motion.div whileTap={{ scale: 0.97 }}>
			<Button
				variant='outline'
				className={cn(
					'rounded-full flex items-center gap-2 font-medium transition-colors duration-300',
					isScrolled
						? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
						: 'hover:bg-white/10 dark:hover:bg-gray-800/20 text-gray-900 dark:text-white'
				)}
				onClick={() => setShowCategorySelect(!showCategorySelect)}
			>
				Categories
				{selectedCategories.length > 0 && (
					<Badge variant='secondary' className='ml-1'>
						{selectedCategories.length}
					</Badge>
				)}
			</Button>
		</motion.div>
		<AnimatePresence>
			{showCategorySelect && (
				<motion.div
					className='absolute z-50 w-64 mt-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg'
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.15 }}
				>
					{categories.map((category) => (
						<motion.div
							key={category}
							className='flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors'
							whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
							whileTap={{ scale: 0.98 }}
							onClick={() => {
								if (selectedCategories.includes(category)) {
									setSelectedCategories(
										selectedCategories.filter(
											(c) => c !== category
										)
									);
								} else {
									setSelectedCategories([
										...selectedCategories,
										category
									]);
								}
							}}
						>
							<div className='w-4 h-4 border rounded mr-2 flex items-center justify-center'>
								<AnimatePresence>
									{selectedCategories.includes(category) && (
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											exit={{ scale: 0 }}
										>
											<Check className='w-3 h-3' />
										</motion.div>
									)}
								</AnimatePresence>
							</div>
							<span className='text-gray-900 dark:text-gray-100 text-sm font-medium'>
								{category}
							</span>
						</motion.div>
					))}
				</motion.div>
			)}
		</AnimatePresence>
	</div>
);

// Price Filter Component
const PriceFilter = ({
	priceRange,
	setPriceRange,
	isScrolled
}: {
	priceRange: number[];
	setPriceRange: (range: number[]) => void;
	isScrolled: boolean;
}) => (
	<Popover>
		<PopoverTrigger asChild>
			<motion.div whileTap={{ scale: 0.97 }}>
				<Button
					variant='outline'
					className={cn(
						'rounded-full font-medium transition-colors duration-300',
						isScrolled
							? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
							: 'hover:bg-white/10 dark:hover:bg-gray-800/20 text-gray-900 dark:text-white'
					)}
				>
					Price Range
				</Button>
			</motion.div>
		</PopoverTrigger>
		<PopoverContent className='w-80 p-4 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-gray-200 dark:border-gray-700'>
			<div className='space-y-4'>
				<div className='space-y-2'>
					<Label className='text-base font-semibold text-gray-900 dark:text-gray-50'>
						Price Range
					</Label>
					<Slider
						defaultValue={priceRange}
						max={10000000}
						step={100000}
						value={priceRange}
						onValueChange={setPriceRange}
						className='my-6'
					/>
					<div className='flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300'>
						<span>{vietnamCurrency(priceRange[0])}</span>
						<span>{vietnamCurrency(priceRange[1])}</span>
					</div>
					<div className='flex gap-4 mt-4'>
						<div className='flex-1'>
							<Label className='text-xs mb-1 text-gray-800 dark:text-gray-200'>
								Min Price
							</Label>
							<Input
								type='number'
								placeholder='Min $USD'
								value={priceRange[0]}
								onChange={(e) =>
									setPriceRange([
										Number(e.target.value),
										priceRange[1]
									])
								}
								className='mt-1'
							/>
						</div>
						<div className='flex-1'>
							<Label className='text-xs mb-1 text-gray-800 dark:text-gray-200'>
								Max Price
							</Label>
							<Input
								type='number'
								placeholder='Max $USD'
								value={priceRange[1]}
								onChange={(e) =>
									setPriceRange([
										priceRange[0],
										Number(e.target.value)
									])
								}
								className='mt-1'
							/>
						</div>
					</div>
				</div>
			</div>
		</PopoverContent>
	</Popover>
);

// Main Component
const HeaderFilter = () => {
	const t = useTranslations('filter');
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const [showCategorySelect, setShowCategorySelect] = useState(false);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [expandedSections, setExpandedSections] = useState({
		artists: true,
		categories: true,
		materials: true,
		waysToBuy: true,
		sizes: true,
		price: true
	});
	const [priceRange, setPriceRange] = useState([0, 10000000]);
	const [isScrolled, setIsScrolled] = useState(false);

	// Add scroll effect (sync with header)
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	// Close mobile menu when changing routes (sync with header)
	useEffect(() => {
		setIsOpen(false);
		setShowCategorySelect(false);
	}, [pathname]);

	const toggleSection = (section: SectionName) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section]
		}));
	};

	// Close category dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (showCategorySelect) {
				const target = event.target as HTMLElement;
				if (!target.closest('.category-dropdown-container')) {
					setShowCategorySelect(false);
				}
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showCategorySelect]);

	return (
		<motion.div
			className={cn(
				'sticky top-20 left-0 right-0 z-40 transition-all duration-300 ease-in-out border-b',
				isScrolled
					? 'bg-white/25 dark:bg-gray-900/30 backdrop-blur-sm shadow-sm dark:shadow-gray-800/20 border-gray-200/40 dark:border-gray-700/40'
					: 'bg-transparent backdrop-blur-[1px] border-transparent'
			)}
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: 0.1 }}
		>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center h-16'>
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<motion.div whileTap={{ scale: 0.97 }}>
								<Button
									variant='outline'
									className={cn(
										'rounded-full flex items-center gap-2 font-medium transition-colors duration-300',
										isScrolled
											? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
											: 'hover:bg-white/10 dark:hover:bg-gray-800/20 text-gray-900 dark:text-white'
									)}
								>
									<Filter className='h-4 w-4' />
									{t('filters')}
								</Button>
							</motion.div>
						</SheetTrigger>
						<SheetContent
							side='left'
							className='w-[400px] backdrop-blur-md bg-white/95 dark:bg-gray-900/95'
						>
							<SheetHeader>
								<SheetTitle className='text-xl font-bold text-gray-900 dark:text-gray-50'>
									{t('filters')}
								</SheetTitle>
							</SheetHeader>
							<div className='py-4'>
								<div className='relative'>
									<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
									<Input
										placeholder={t('searchPlaceholder')}
										className='pl-10'
									/>
								</div>
							</div>
							<ScrollArea className='h-[calc(100vh-8rem)] px-4'>
								<div className='space-y-6'>
									<FilterSection
										title={t('artists')}
										isExpanded={expandedSections.artists}
										onToggle={() =>
											toggleSection('artists')
										}
									>
										<div className='space-y-2'>
											{artists.map((artist) => (
												<CheckboxItem
													key={artist.id}
													id={artist.id}
													label={artist.name}
												/>
											))}
										</div>
									</FilterSection>

									<FilterSection
										title={t('categories')}
										isExpanded={expandedSections.categories}
										onToggle={() =>
											toggleSection('categories')
										}
									>
										<div className='space-y-2'>
											{categories.map((category) => (
												<CheckboxItem
													key={category}
													id={category}
													label={category}
												/>
											))}
										</div>
									</FilterSection>

									<FilterSection
										title={t('materials')}
										isExpanded={expandedSections.materials}
										onToggle={() =>
											toggleSection('materials')
										}
									>
										<div className='space-y-2'>
											{materials.map((material) => (
												<CheckboxItem
													key={material}
													id={material}
													label={material}
												/>
											))}
										</div>
									</FilterSection>

									<FilterSection
										title={t('waysToBuy')}
										isExpanded={expandedSections.waysToBuy}
										onToggle={() =>
											toggleSection('waysToBuy')
										}
									>
										<div className='space-y-2'>
											{waysToBuy.map((way) => (
												<CheckboxItem
													key={way.id}
													id={way.id}
													label={way.label}
												/>
											))}
										</div>
									</FilterSection>

									<FilterSection
										title={t('size')}
										isExpanded={expandedSections.sizes}
										onToggle={() => toggleSection('sizes')}
									>
										<div className='space-y-3'>
											{sizes.map((size) => (
												<CheckboxItem
													key={size.id}
													id={size.id}
													label={size.label}
													description={
														size.description
													}
												/>
											))}
										</div>
									</FilterSection>

									<FilterSection
										title={t('price')}
										isExpanded={expandedSections.price}
										onToggle={() => toggleSection('price')}
									>
										<div className='space-y-4 px-2'>
											<Slider
												defaultValue={priceRange}
												max={10000000}
												step={100000}
												value={priceRange}
												onValueChange={setPriceRange}
												className='my-6'
											/>
											<div className='flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300'>
												<span>
													{vietnamCurrency(
														priceRange[0]
													)}
												</span>
												<span>
													{vietnamCurrency(
														priceRange[1]
													)}
												</span>
											</div>
										</div>
									</FilterSection>
								</div>
							</ScrollArea>
						</SheetContent>
					</Sheet>

					<div className='mx-4 h-6 w-px bg-gray-300/40 dark:bg-gray-700/40' />

					<div className='flex gap-3 overflow-x-auto no-scrollbar category-dropdown-container'>
						<CategorySelector
							showCategorySelect={showCategorySelect}
							setShowCategorySelect={setShowCategorySelect}
							selectedCategories={selectedCategories}
							setSelectedCategories={setSelectedCategories}
							isScrolled={isScrolled}
						/>

						<PriceFilter
							priceRange={priceRange}
							setPriceRange={setPriceRange}
							isScrolled={isScrolled}
						/>
					</div>

					<div className='flex-1' />

					{/* Search component for desktop */}
					<div className='hidden md:flex relative items-center'>
						<div
							className={cn(
								'relative rounded-full overflow-hidden transition-all duration-300',
								isScrolled
									? 'bg-gray-100/50 dark:bg-gray-800/50'
									: 'bg-white/10 dark:bg-gray-800/20'
							)}
						>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
							<Input
								placeholder={t('quickSearch')}
								className={cn(
									'border-none bg-transparent pl-10 pr-4 h-9 w-48 focus:w-64 transition-all duration-300',
									isScrolled
										? 'text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400'
										: 'text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300'
								)}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Global typography settings applied to text without ảnh hưởng đến background */}
			<style jsx global>{`
				.prose {
					font-family: 'Inter', sans-serif;
					line-height: 1.6;
					font-size: 1rem;
				}

				.prose h1,
				.prose h2,
				.prose h3,
				.prose h4,
				.prose p,
				.prose li,
				.prose span {
					margin: 0.5rem 0;
					color: inherit;
				}
			`}</style>

			{/* Custom styles for enhanced shadows and filters */}
			<style jsx global>{`
				.no-scrollbar::-webkit-scrollbar {
					display: none;
				}

				.no-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}

				/* Optimize for transparent behavior with backdrop-filter */
				@supports (backdrop-filter: blur(10px)) {
					.bg-transparent {
						background-color: rgba(255, 255, 255, 0);
						backdrop-filter: blur(1px);
					}

					.dark .bg-transparent {
						background-color: rgba(17, 24, 39, 0);
						backdrop-filter: blur(1px);
					}

					.bg-white\\/25 {
						background-color: rgba(255, 255, 255, 0.25);
					}

					.dark .bg-gray-900\\/30 {
						background-color: rgba(17, 24, 39, 0.3);
					}
				}

				/* Fallback for browsers without backdrop-filter support */
				@supports not (backdrop-filter: blur(10px)) {
					.bg-transparent {
						background-color: rgba(255, 255, 255, 0.05);
					}

					.dark .bg-transparent {
						background-color: rgba(17, 24, 39, 0.05);
					}
				}
			`}</style>
		</motion.div>
	);
};

export default HeaderFilter;
