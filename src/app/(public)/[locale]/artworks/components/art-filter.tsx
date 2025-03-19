'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
	Check,
	ChevronDown,
	ChevronUp,
	Filter,
	LayoutGrid,
	List,
	Search
} from 'lucide-react';
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

interface HeaderFilterProps {
	onLayoutChange: (isGrid: boolean) => void;
	headerHeight?: number; // Optional prop for header height (default 80px)
}

// Data Constants
const artists: { id: string; name: string }[] = [
	{ id: 'following', name: 'Artists you follow' },
	{ id: '1', name: 'Leonardo da Vinci' },
	{ id: '2', name: 'Vincent van Gogh' },
	{ id: '3', name: 'Pablo Picasso' },
	{ id: '4', name: 'Claude Monet' },
	{ id: '5', name: 'Andy Warhol' }
];

const categories: string[] = [
	'Paintings',
	'Sculptures',
	'Photography',
	'Digital Art',
	'Prints',
	'Drawing'
];

const materials: string[] = [
	'Acrylic',
	'Oil',
	'Watercolor',
	'Canvas',
	'Wood',
	'Metal',
	'Glass',
	'Paper'
];

const waysToBuy: { id: string; label: string }[] = [
	{ id: 'offer', label: 'Make an Offer' },
	{ id: 'bid', label: 'Bid' },
	{ id: 'contact', label: 'Contact Gallery' }
];

const sizes: { id: string; label: string; description: string }[] = [
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
const FilterSection = memo(
	({ title, isExpanded, onToggle, children }: FilterSectionProps) => (
		<div className='space-y-3 border-b border-gray-200 dark:border-gray-700 pb-3'>
			<motion.div
				className='flex justify-between items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200'
				onClick={onToggle}
				whileTap={{ scale: 0.98 }}
				layout
			>
				<h3 className='font-medium text-gray-900 dark:text-gray-100'>
					{title}
				</h3>
				<AnimatePresence mode='wait' initial={false}>
					{isExpanded ? (
						<motion.div
							key='up'
							animate={{ rotate: 0 }}
							transition={{ duration: 0.15 }}
						>
							<ChevronUp className='h-4 w-4 text-gray-500' />
						</motion.div>
					) : (
						<motion.div
							key='down'
							animate={{ rotate: 0 }}
							transition={{ duration: 0.15 }}
						>
							<ChevronDown className='h-4 w-4 text-gray-500' />
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
);
FilterSection.displayName = 'FilterSection';

const CheckboxItem = memo(({ id, label, description }: CheckboxItemProps) => (
	<motion.div
		className='flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200'
		whileTap={{ scale: 0.98 }}
	>
		<Checkbox
			id={id}
			className={`${description ? 'mt-1' : ''} rounded-sm`}
		/>
		<div>
			<label
				htmlFor={id}
				className='text-sm font-medium cursor-pointer text-gray-900 dark:text-gray-50'
			>
				{label}
			</label>
			{description && (
				<p className='text-xs text-gray-600 dark:text-gray-400 mt-0.5'>
					{description}
				</p>
			)}
		</div>
	</motion.div>
));
CheckboxItem.displayName = 'CheckboxItem';

const CategorySelector = memo(
	({
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
	}) => {
		const t = useTranslations('artworkPage.filter');
		
		return (
			<div className='relative'>
				<motion.div whileTap={{ scale: 0.95 }}>
					<Button
						variant='outline'
						size='sm'
						className={cn(
							'rounded-full flex items-center gap-1 text-sm transition-colors duration-200',
							isScrolled
								? 'bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'
								: 'bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-800'
							)}
						onClick={() => setShowCategorySelect(!showCategorySelect)}
					>
						{t('categories')}
						{selectedCategories.length > 0 && (
							<Badge variant='secondary' className='ml-1 text-xs'>
								{selectedCategories.length}
							</Badge>
						)}
					</Button>
				</motion.div>
				<AnimatePresence>
					{showCategorySelect && (
						<motion.div
							className='absolute z-50 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden'
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.15, ease: 'easeOut' }}
						>
							<ScrollArea className='max-h-64'>
								{categories.map((category) => (
									<motion.div
										key={category}
										className='flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200'
										whileTap={{ scale: 0.98 }}
										onClick={() =>
											setSelectedCategories(
												selectedCategories.includes(
													category
												)
													? selectedCategories.filter(
														(c) => c !== category
													)
													: [
														...selectedCategories,
														category
													]
											)
										}
									>
										<div className='w-4 h-4 border rounded mr-2 flex items-center justify-center'>
											<AnimatePresence>
												{selectedCategories.includes(
													category
												) && (
													<motion.div
														initial={{ scale: 0 }}
														animate={{ scale: 1 }}
														exit={{ scale: 0 }}
														transition={{
															duration: 0.1
														}}
													>
														<Check className='w-3 h-3 text-gray-900 dark:text-white' />
													</motion.div>
												)}
											</AnimatePresence>
										</div>
										<span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
											{category}
										</span>
									</motion.div>
								))}
							</ScrollArea>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	}
);
CategorySelector.displayName = 'CategorySelector';

const PriceFilter = memo(
	({
		priceRange,
		setPriceRange,
		isScrolled
	}: {
		priceRange: number[];
		setPriceRange: (range: number[]) => void;
		isScrolled: boolean;
	}) => {
		const t = useTranslations('artworkPage.filter');
		
		return (
			<Popover>
				<PopoverTrigger asChild>
					<motion.div whileTap={{ scale: 0.95 }}>
						<Button
							variant='outline'
							size='sm'
							className={cn(
								'rounded-full text-sm transition-colors duration-200',
								isScrolled
									? 'bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'
									: 'bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-800'
							)}
						>
							{t('priceRange')}
						</Button>
					</motion.div>
				</PopoverTrigger>
				<PopoverContent className='w-80 p-4 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg'>
					<div className='space-y-4'>
						<Label className='text-base font-semibold text-gray-900 dark:text-gray-50'>
							{t('priceRange')}
						</Label>
						<Slider
							value={priceRange}
							onValueChange={setPriceRange}
							max={10000000}
							step={100000}
							className='my-4'
						/>
						<div className='flex justify-between text-sm text-gray-700 dark:text-gray-300'>
							<span>{vietnamCurrency(priceRange[0])}</span>
							<span>{vietnamCurrency(priceRange[1])}</span>
						</div>
						<div className='flex gap-3'>
							<div className='flex-1'>
								<Label className='text-xs text-gray-800 dark:text-gray-200'>
									Min
								</Label>
								<Input
									type='number'
									value={priceRange[0]}
									onChange={(e) =>
										setPriceRange([
											Number(e.target.value),
											priceRange[1]
										])
									}
									className='mt-1 text-sm'
								/>
							</div>
							<div className='flex-1'>
								<Label className='text-xs text-gray-800 dark:text-gray-200'>
									Max
								</Label>
								<Input
									type='number'
									value={priceRange[1]}
									onChange={(e) =>
										setPriceRange([
											priceRange[0],
											Number(e.target.value)
										])
									}
									className='mt-1 text-sm'
								/>
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		);
	}
);
PriceFilter.displayName = 'PriceFilter';

// Main Component
const HeaderFilter = ({
	onLayoutChange,
	headerHeight = 80
}: HeaderFilterProps) => {
	// Change the translation namespace to use artworkPage.filter
	const t = useTranslations('artworkPage.filter');
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [showCategorySelect, setShowCategorySelect] =
		useState<boolean>(false);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [expandedSections, setExpandedSections] = useState<
		Record<SectionName, boolean>
	>({
		artists: false,
		categories: false,
		materials: false,
		waysToBuy: false,
		sizes: false,
		price: false
	});
	const [priceRange, setPriceRange] = useState<number[]>([0, 10000000]);
	const [isSticky, setIsSticky] = useState<boolean>(false);
	const [isGridLayout, setIsGridLayout] = useState<boolean>(true);
	const [isMobile, setIsMobile] = useState<boolean>(false);
	const filterRef = useRef<HTMLDivElement>(null);
	const initialTopRef = useRef<number | null>(null);

	// Detect mobile
	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Set initial position and handle sticky behavior
	useEffect(() => {
		if (filterRef.current) {
			// Get the initial top position of the filter bar relative to the viewport
			const rect = filterRef.current.getBoundingClientRect();
			initialTopRef.current = rect.top + window.scrollY;
		}

		let timeout: ReturnType<typeof setTimeout>;
		const handleScroll = () => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				const scrollY = window.scrollY;
				if (initialTopRef.current !== null && filterRef.current) {
					if (!isMobile) {
						// Desktop: Sticky when scrolled past initial position
						if (scrollY > initialTopRef.current - headerHeight) {
							setIsSticky(true);
							filterRef.current.style.position = 'fixed';
							filterRef.current.style.top = `${headerHeight}px`;
							filterRef.current.style.left = '0';
							filterRef.current.style.right = '0';
						} else {
							setIsSticky(false);
							filterRef.current.style.position = 'static';
							filterRef.current.style.top = 'auto';
							filterRef.current.style.left = 'auto';
							filterRef.current.style.right = 'auto';
						}
					} else {
						// Mobile: Always sticky at top-20
						setIsSticky(true);
						filterRef.current.style.position = 'sticky';
						filterRef.current.style.top = '80px';
					}
				}
			}, 50);
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll(); // Initial call to set position
		return () => {
			clearTimeout(timeout);
			window.removeEventListener('scroll', handleScroll);
		};
	}, [isMobile, headerHeight]);

	// Close menus on route change
	useEffect(() => {
		setIsOpen(false);
		setShowCategorySelect(false);
	}, [pathname]);

	// Click outside handler
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				filterRef.current &&
				event.target instanceof Element &&
				!filterRef.current.contains(event.target) &&
				!event.target.closest('.category-dropdown-container')
			) {
				setShowCategorySelect(false);
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const toggleSection = (section: SectionName) =>
		setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

	const toggleLayout = () => {
		setIsGridLayout((prev) => {
			const newLayout = !prev;
			onLayoutChange(newLayout);
			return newLayout;
		});
	};

	return (
		<motion.div
			ref={filterRef}
			className={cn(
				'z-40 border-b transition-all duration-300',
				isSticky
					? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-gray-200/50 dark:border-gray-700/50'
					: 'bg-transparent border-transparent'
			)}
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: 'easeOut' }}
		>
			<div className='container mx-auto px-4 py-2 sm:px-6 lg:px-8'>
				<div className='flex items-center gap-2 sm:gap-3'>
					{/* Filter Trigger */}
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<motion.div whileTap={{ scale: 0.95 }}>
								<Button
									variant='outline'
									size='sm'
									className={cn(
										'flex items-center gap-1 rounded-full transition-colors duration-200',
										isSticky
											? 'bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'
											: 'bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-800'
									)}
								>
									<Filter className='h-4 w-4' />
									<span className='hidden sm:inline text-sm'>
										{t('filters')}
									</span>
								</Button>
							</motion.div>
						</SheetTrigger>
						<SheetContent
							side={isMobile ? 'bottom' : 'left'}
							className={cn(
								'bg-white dark:bg-gray-900 p-0',
								isMobile
									? 'h-[80vh] rounded-t-xl max-h-[80vh]'
									: 'w-full max-w-[90vw] sm:max-w-[400px]'
							)}
						>
							<SheetHeader className='px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
								<SheetTitle className='text-lg font-semibold text-gray-900 dark:text-gray-50'>
									{t('filters')}
								</SheetTitle>
							</SheetHeader>
							<div className='px-4 py-3'>
								<div className='relative'>
									<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
									<Input
										placeholder={t('filterSearchPlaceholder')}
										className='pl-10 text-sm h-9'
									/>
								</div>
							</div>
							<ScrollArea
								className={cn(
									'px-4',
									isMobile
										? 'h-[calc(80vh-8rem)]'
										: 'h-[calc(100vh-10rem)]'
								)}
							>
								<div className='space-y-4'>
									<FilterSection
										title={t('artists')}
										isExpanded={expandedSections.artists}
										onToggle={() =>
											toggleSection('artists')
										}
									>
										{artists.map((artist) => (
											<CheckboxItem
												key={artist.id}
												id={artist.id}
												label={artist.name}
											/>
										))}
									</FilterSection>
									<FilterSection
										title={t('categories')}
										isExpanded={expandedSections.categories}
										onToggle={() =>
											toggleSection('categories')
										}
									>
										{categories.map((category) => (
											<CheckboxItem
												key={category}
												id={category}
												label={category}
											/>
										))}
									</FilterSection>
									<FilterSection
										title={t('material')}
										isExpanded={expandedSections.materials}
										onToggle={() =>
											toggleSection('materials')
										}
									>
										{materials.map((material) => (
											<CheckboxItem
												key={material}
												id={material}
												label={material}
											/>
										))}
									</FilterSection>
									<FilterSection
										title={t('wayToBuy')}
										isExpanded={expandedSections.waysToBuy}
										onToggle={() =>
											toggleSection('waysToBuy')
										}
									>
										{waysToBuy.map((way) => (
											<CheckboxItem
												key={way.id}
												id={way.id}
												label={way.label}
											/>
										))}
									</FilterSection>
									<FilterSection
										title={t('size')}
										isExpanded={expandedSections.sizes}
										onToggle={() => toggleSection('sizes')}
									>
										{sizes.map((size) => (
											<CheckboxItem
												key={size.id}
												id={size.id}
												label={size.label}
												description={size.description}
											/>
										))}
									</FilterSection>
									<FilterSection
										title={t('price')}
										isExpanded={expandedSections.price}
										onToggle={() => toggleSection('price')}
									>
										<Slider
											value={priceRange}
											onValueChange={setPriceRange}
											max={10000000}
											step={100000}
											className='my-4'
										/>
										<div className='flex justify-between text-sm text-gray-700 dark:text-gray-300'>
											<span>
												{vietnamCurrency(priceRange[0])}
											</span>
											<span>
												{vietnamCurrency(priceRange[1])}
											</span>
										</div>
									</FilterSection>
								</div>
							</ScrollArea>
						</SheetContent>
					</Sheet>

					{/* Desktop Controls */}
					<div className='hidden sm:flex items-center gap-3 flex-1 overflow-x-auto no-scrollbar'>
						<CategorySelector
							showCategorySelect={showCategorySelect}
							setShowCategorySelect={setShowCategorySelect}
							selectedCategories={selectedCategories}
							setSelectedCategories={setSelectedCategories}
							isScrolled={isSticky}
						/>
						<PriceFilter
							priceRange={priceRange}
							setPriceRange={setPriceRange}
							isScrolled={isSticky}
						/>
					</div>

					{/* Search Bar */}
					<div className='flex-1 sm:flex-none'>
						<div
							className={cn(
								'relative rounded-full overflow-hidden transition-all duration-200',
								isSticky
									? 'bg-gray-100 dark:bg-gray-800'
									: 'bg-white/10 dark:bg-gray-800/20'
							)}
						>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
							<Input
								placeholder={t('filterSearchPlaceholder')}
								className={cn(
									'border-none bg-transparent pl-10 pr-4 h-9 w-full sm:w-48 lg:w-64 focus:ring-0 text-sm',
									isSticky
										? 'text-gray-900 dark:text-white placeholder:text-gray-500'
										: 'text-gray-900 dark:text-white placeholder:text-gray-400'
								)}
							/>
						</div>
					</div>

					{/* Layout Toggle Button */}
					<motion.div whileTap={{ scale: 0.95 }}>
						<Button
							variant="outline"
							size="sm"
							className={cn(
								"rounded-full p-2 transition-colors duration-200",
								isSticky
									? "bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
									: "bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-800"
							)}
							onClick={toggleLayout}
						>
							{isGridLayout ? (
								<List className="h-4 w-4" /> // Single Thread (linear layout)
							) : (
								<LayoutGrid className="h-4 w-4" /> // Masonry (grid layout)
							)}
						</Button>
					</motion.div>
				</div>
			</div>

			<style jsx global>{`
				.no-scrollbar::-webkit-scrollbar {
					display: none;
				}

				.no-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}

				/* Smooth drawer transition */
				.sheet-bottom-enter {
					transform: translateY(100%);
				}

				.sheet-bottom-enter-active {
					transform: translateY(0);
					transition: transform 300ms ease-out;
				}

				.sheet-bottom-exit {
					transform: translateY(0);
				}

				.sheet-bottom-exit-active {
					transform: translateY(100%);
					transition: transform 300ms ease-in;
				}
			`}</style>
		</motion.div>
	);
};

export default HeaderFilter;
