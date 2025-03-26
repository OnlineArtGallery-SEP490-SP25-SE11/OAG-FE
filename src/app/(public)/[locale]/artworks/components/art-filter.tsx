'use client';

import {memo, useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {usePathname} from 'next/navigation';
import {AnimatePresence, motion} from 'framer-motion';
import {Check, ChevronDown, ChevronUp, Filter, LayoutGrid, List, Search} from 'lucide-react';
import {cn} from '@/lib/utils';
import {vietnamCurrency} from '@/utils/converters';

// UI Components
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Slider} from '@/components/ui/slider';
import {Label} from '@/components/ui/label';
import {Badge} from '@/components/ui/badge';
import {Checkbox} from '@/components/ui/checkbox';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from '@/components/ui/sheet';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';

// Types and mock data
type SectionName = 'artists' | 'categories' | 'materials' | 'waysToBuy' | 'sizes' | 'price';

interface FilterSectionProps {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

interface HeaderFilterProps {
    onLayoutChange: (isGrid: boolean) => void;
    headerHeight?: number;
}

interface CheckboxItemProps {
    id: string;
    label: string;
    description?: string;
}

// Mock data - Replace with real data from API
const artists = [
    {id: 'artist1', name: 'Leonardo da Vinci'},
    {id: 'artist2', name: 'Vincent van Gogh'},
    {id: 'artist3', name: 'Pablo Picasso'},
];

const categories = ['Painting', 'Sculpture', 'Digital Art', 'Photography', 'Drawing'];

const materials = ['Canvas', 'Paper', 'Wood', 'Metal', 'Digital'];

const waysToBuy = [
    {id: 'buy-now', label: 'Buy Now'},
    {id: 'auction', label: 'Auction'},
    {id: 'make-offer', label: 'Make Offer'}
];

const sizes = [
    {id: 'small', label: 'Small', description: 'Up to 40cm'},
    {id: 'medium', label: 'Medium', description: '40-100cm'},
    {id: 'large', label: 'Large', description: '100-200cm'},
    {id: 'extra-large', label: 'Extra Large', description: 'Over 200cm'}
];

// Reusable Components
const CheckboxItem = ({id, label, description}: CheckboxItemProps) => {
    return (
        <div className="flex items-center space-x-2 py-1">
            <Checkbox id={id} className="data-[state=checked]:bg-primary"/>
            <div className="grid gap-0.5 leading-none">
                <Label htmlFor={id} className="text-sm cursor-pointer">
                    {label}
                </Label>
                {description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
                )}
            </div>
        </div>
    );
};

const FilterSection = memo(({title, isExpanded, onToggle, children}: FilterSectionProps) => (
    <div className='space-y-3 border-b border-gray-200 dark:border-gray-700 pb-3'>
        <motion.div
            className='flex justify-between items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200'
            onClick={onToggle}
            whileTap={{scale: 0.98}}
            layout
        >
            <h3 className='font-medium text-gray-900 dark:text-gray-100'>{title}</h3>
            <motion.div
                key={isExpanded ? 'up' : 'down'}
                animate={{rotate: 0}}
                transition={{duration: 0.15}}
            >
                {isExpanded ? (
                    <ChevronUp className='h-4 w-4 text-gray-500'/>
                ) : (
                    <ChevronDown className='h-4 w-4 text-gray-500'/>
                )}
            </motion.div>
        </motion.div>
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{opacity: 0, height: 0}}
                    animate={{opacity: 1, height: 'auto'}}
                    exit={{opacity: 0, height: 0}}
                    transition={{duration: 0.2, ease: 'easeOut'}}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
));
FilterSection.displayName = 'FilterSection';

// Main Component - optimized layout
const HeaderFilter = ({onLayoutChange, headerHeight = 80}: HeaderFilterProps) => {
    const t = useTranslations('filter');
    const pathname = usePathname();
    const filterRef = useRef<HTMLDivElement>(null);
    const initialTopRef = useRef<number | null>(null);

    // State management
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [showCategorySelect, setShowCategorySelect] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 10000000]);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [isGridLayout, setIsGridLayout] = useState<boolean>(true);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [expandedSections, setExpandedSections] = useState<Record<SectionName, boolean>>({
        artists: false,
        categories: true,
        materials: false,
        waysToBuy: false,
        sizes: false,
        price: true
    });

    // Mobile optimization - check viewport width
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Check scroll position
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Sticky behavior
    useEffect(() => {
        if (filterRef.current) {
            initialTopRef.current = filterRef.current.getBoundingClientRect().top + window.scrollY;
        }

        let timeout: ReturnType<typeof setTimeout>;
        const handleScroll = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const scrollY = window.scrollY;
                if (initialTopRef.current !== null && filterRef.current) {
                    if (!isMobile) {
                        if (scrollY > initialTopRef.current - headerHeight) {
                            filterRef.current.style.position = 'fixed';
                            filterRef.current.style.top = `${headerHeight}px`;
                            filterRef.current.style.left = '0';
                            filterRef.current.style.right = '0';
                            filterRef.current.style.zIndex = '40';
                        } else {
                            filterRef.current.style.position = 'static';
                            filterRef.current.style.top = 'auto';
                            filterRef.current.style.left = 'auto';
                            filterRef.current.style.right = 'auto';
                        }
                    } else {
                        filterRef.current.style.position = 'sticky';
                        filterRef.current.style.top = `${headerHeight}px`;
                        filterRef.current.style.zIndex = '40';
                    }
                }
            }, 50);
        };
        window.addEventListener('scroll', handleScroll, {passive: true});
        handleScroll();
        return () => {
            clearTimeout(timeout);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isMobile, headerHeight]);

    // Reset state on route change
    useEffect(() => {
        setIsOpen(false);
        setShowCategorySelect(false);
    }, [pathname]);

    // Close on outside click
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
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Helper functions
    const toggleSection = (section: SectionName) =>
        setExpandedSections(prev => ({...prev, [section]: !prev[section]}));

    const toggleLayout = () => {
        setIsGridLayout(prev => {
            const newLayout = !prev;
            onLayoutChange(newLayout);
            return newLayout;
        });
    };

    // Button styling function for consistency
    const getButtonStyle = (isScrolled: boolean) => cn(
        'rounded-full transition-all duration-300',
        isScrolled
            ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'
            : 'text-gray-500 bg-white/10 dark:bg-gray-900/10 hover:bg-white/20 dark:hover:bg-gray-800/20'
    );

    // Category selector dropdown
    const CategorySelector = () => (
        <div className='relative category-dropdown-container'>
            <motion.div whileTap={{scale: 0.95}}>
                <Button
                    variant='outline'
                    size='sm'
                    className={cn(
                        getButtonStyle(isScrolled),
                        'flex items-center gap-1 text-sm font-semibold'
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
                        initial={{opacity: 0, y: -10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        transition={{duration: 0.2}}
                    >
                        <ScrollArea className='max-h-64'>
                            {categories.map((category) => (
                                <motion.div
                                    key={category}
                                    className='flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors'
                                    whileTap={{scale: 0.98}}
                                    onClick={() => setSelectedCategories(
                                        selectedCategories.includes(category)
                                            ? selectedCategories.filter(c => c !== category)
                                            : [...selectedCategories, category]
                                    )}
                                >
                                    <div className='w-4 h-4 border rounded mr-2 flex items-center justify-center'>
                                        {selectedCategories.includes(category) && (
                                            <Check className='w-3 h-3 text-gray-900 dark:text-white'/>
                                        )}
                                    </div>
                                    <span
                                        className='text-sm font-medium text-gray-900 dark:text-gray-100'>{category}</span>
                                </motion.div>
                            ))}
                        </ScrollArea>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    // Filter Panel Content
    const FilterPanelContent = () => (
        <>
            <div className='px-4 py-3'>
                <div className='relative'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400'/>
                    <Input placeholder={t('searchPlaceholder')} className='pl-10 text-sm h-9'/>
                </div>
            </div>

            <ScrollArea className='px-4 h-[calc(100vh-10rem)] md:h-[calc(100vh-10rem)]'>
                <div className='space-y-4 pb-6'>
                    <FilterSection
                        title={t('categories')}
                        isExpanded={expandedSections.categories}
                        onToggle={() => toggleSection('categories')}
                    >
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-1'>
                            {categories.map(category => (
                                <CheckboxItem key={category} id={category} label={category}/>
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection
                        title={t('price')}
                        isExpanded={expandedSections.price}
                        onToggle={() => toggleSection('price')}
                    >
                        <div className='space-y-4'>
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
                        </div>
                    </FilterSection>

                    <FilterSection
                        title={t('artists')}
                        isExpanded={expandedSections.artists}
                        onToggle={() => toggleSection('artists')}
                    >
                        <div className='space-y-1'>
                            {artists.map(artist => (
                                <CheckboxItem key={artist.id} id={artist.id} label={artist.name}/>
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection
                        title={t('materials')}
                        isExpanded={expandedSections.materials}
                        onToggle={() => toggleSection('materials')}
                    >
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-1'>
                            {materials.map(material => (
                                <CheckboxItem key={material} id={material} label={material}/>
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection
                        title={t('waysToBuy')}
                        isExpanded={expandedSections.waysToBuy}
                        onToggle={() => toggleSection('waysToBuy')}
                    >
                        {waysToBuy.map(way => (
                            <CheckboxItem key={way.id} id={way.id} label={way.label}/>
                        ))}
                    </FilterSection>

                    <FilterSection
                        title={t('size')}
                        isExpanded={expandedSections.sizes}
                        onToggle={() => toggleSection('sizes')}
                    >
                        {sizes.map(size => (
                            <CheckboxItem
                                key={size.id}
                                id={size.id}
                                label={size.label}
                                description={size.description}
                            />
                        ))}
                    </FilterSection>
                </div>
            </ScrollArea>
        </>
    );

    return (
        <motion.div
            ref={filterRef}
            className={cn(
                'z-40 transition-all duration-300 ease-in-out',
                isScrolled
                    ? 'bg-white/25 dark:bg-gray-900/30 backdrop-blur-sm shadow-sm dark:shadow-gray-800/20'
                    : 'bg-transparent backdrop-blur-[1px]'
            )}
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3, ease: 'easeOut'}}
        >
            <div className='container mx-auto px-4 py-2 sm:px-6 lg:px-8'>
                <div className='flex items-center gap-2 sm:gap-3'>
                    {/* Mobile optimized filter button */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <motion.div whileTap={{scale: 0.95}}>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className={cn(
                                        getButtonStyle(isScrolled),
                                        'flex items-center gap-1 min-w-9 justify-center'
                                    )}
                                >
                                    <Filter className='h-4 w-4'/>
                                    <span className='hidden sm:inline text-sm font-semibold'>{t('filters')}</span>
                                </Button>
                            </motion.div>
                        </SheetTrigger>

                        <SheetContent
                            side={isMobile ? 'bottom' : 'left'}
                            className={cn(
                                'bg-white dark:bg-gray-900 p-0 backdrop-blur-md',
                                isMobile
                                    ? 'h-[85vh] rounded-t-xl'
                                    : 'w-full max-w-[90vw] sm:max-w-[380px]'
                            )}
                        >
                            <SheetHeader className='px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
                                <SheetTitle className='text-lg font-semibold text-gray-900 dark:text-gray-50'>
                                    {t('filters')}
                                </SheetTitle>
                            </SheetHeader>
                            <FilterPanelContent/>
                        </SheetContent>
                    </Sheet>

                    {/* Desktop Category and Price Filters - Hidden on mobile */}
                    <div className='hidden sm:flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar'>
                        <CategorySelector/>

                        <Popover>
                            <PopoverTrigger asChild>
                                <motion.div whileTap={{scale: 0.95}}>
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        className={cn(getButtonStyle(isScrolled), 'text-sm font-semibold whitespace-nowrap')}
                                    >
                                        {t('priceRange')}
                                    </Button>
                                </motion.div>
                            </PopoverTrigger>

                            <PopoverContent
                                className='w-80 p-4 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg'>
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
                                            <Label className='text-xs text-gray-800 dark:text-gray-200'>Min</Label>
                                            <Input
                                                type='number'
                                                value={priceRange[0]}
                                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                                className='mt-1 text-sm'
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <Label className='text-xs text-gray-800 dark:text-gray-200'>Max</Label>
                                            <Input
                                                type='number'
                                                value={priceRange[1]}
                                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                                className='mt-1 text-sm'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Search Bar - Responsive design */}
                    <div className='flex-1 min-w-0'>
                        <div
                            className={cn(
                                'relative rounded-full overflow-hidden transition-all duration-300',
                                isScrolled
                                    ? 'bg-gray-100 dark:bg-gray-800'
                                    : 'bg-white/10 dark:bg-gray-800/20'
                            )}
                        >
                            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400'/>
                            <Input
                                placeholder={t('quickSearch')}
                                className={cn(
                                    'border-none bg-transparent pl-10 pr-3 h-9 w-full focus:ring-0 text-sm',
                                    isScrolled
                                        ? 'text-gray-900 dark:text-white placeholder:text-gray-500'
                                        : 'text-white placeholder:text-gray-200'
                                )}
                            />
                        </div>
                    </div>

                    {/* Layout Toggle Button - Mobile optimized */}
                    <motion.div whileTap={{scale: 0.95}}>
                        <Button
                            variant='outline'
                            size='sm'
                            className={cn(getButtonStyle(isScrolled), 'p-2 min-w-9 flex justify-center items-center')}
                            onClick={toggleLayout}
                            aria-label={isGridLayout ? 'Switch to list view' : 'Switch to grid view'}
                        >
                            {isGridLayout ? <List className='h-4 w-4'/> : <LayoutGrid className='h-4 w-4'/>}
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Subtle Separator */}
            {isScrolled && (
                <div
                    className='h-px w-full bg-gradient-to-r from-transparent via-gray-200/40 dark:via-gray-700/40 to-transparent'/>
            )}

            {/* Custom Styles */}
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }

                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                @supports (backdrop-filter: blur(10px)) {
                    header.bg-transparent, .bg-transparent {
                        background-color: rgba(255, 255, 255, 0);
                        backdrop-filter: blur(1px);
                    }

                    .dark header.bg-transparent, .dark .bg-transparent {
                        background-color: rgba(17, 24, 39, 0);
                        backdrop-filter: blur(1px);
                    }

                    header.bg-white\\/25, .bg-white\\/25 {
                        background-color: rgba(255, 255, 255, 0.25);
                    }

                    .dark header.bg-gray-900\\/30, .dark .bg-gray-900\\/30 {
                        background-color: rgba(17, 24, 39, 0.3);
                    }
                }

                @supports not (backdrop-filter: blur(10px)) {
                    header.bg-transparent, .bg-transparent {
                        background-color: rgba(255, 255, 255, 0.05);
                    }

                    .dark header.bg-transparent, .dark .bg-transparent {
                        background-color: rgba(17, 24, 39, 0.05);
                    }
                }
            `}</style>
        </motion.div>
    );
};

export default HeaderFilter;