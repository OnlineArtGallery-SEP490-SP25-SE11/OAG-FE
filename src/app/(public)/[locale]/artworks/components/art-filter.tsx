'use client';

import {memo, useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {usePathname} from 'next/navigation';
import {Check, ChevronDown, ChevronUp, Filter, Search} from 'lucide-react';
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

// Types based on artwork data structure
type SectionName = 'artists' | 'categories' | 'status' | 'price';

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

interface HeaderFilterProps {
  onLayoutChange: (isGrid: boolean) => void;
  headerHeight?: number;
  onFilterChange?: (filters: FilterState) => void;
}

interface CheckboxItemProps {
  id: string;
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: () => void;
}

// Artist structure as per your data
interface Artist {
  _id: string;
  name: string;
  image: string;
}

// Filter state interface - removed dimensions
interface FilterState {
  categories: string[];
  priceRange: number[];
  artists: string[];
  status: {
    available: boolean;
    selling: boolean;
  };
  search: string;
}

// Mock data - aligned with your data structure
const artists: Artist[] = [
  {_id: 'artist1', name: 'Leonardo da Vinci', image: '/artists/davinci.jpg'},
  {_id: 'artist2', name: 'Vincent van Gogh', image: '/artists/vangogh.jpg'},
  {_id: 'artist3', name: 'Pablo Picasso', image: '/artists/picasso.jpg'},
];

const categories = ['Painting', 'Sculpture', 'Digital Art', 'Photography', 'Drawing'];

const initialFilterState: FilterState = {
  categories: [],
  priceRange: [0, 10000000],
  artists: [],
  status: {
    available: false,
    selling: false
  },
  search: ''
};

// Simplified checkbox item
const CheckboxItem = ({id, label, description, checked = false, onChange}: CheckboxItemProps) => (
  <div className="flex items-center space-x-2 py-1">
    <Checkbox 
      id={id} 
      checked={checked}
      onCheckedChange={onChange}
      className="data-[state=checked]:bg-primary dark:border-gray-600"
    />
    <div className="grid gap-0.5 leading-none">
      <Label htmlFor={id} className="text-sm cursor-pointer text-gray-900 dark:text-gray-100">{label}</Label>
      {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
  </div>
);

// Simplified filter section
const FilterSection = memo(({title, isExpanded, onToggle, children}: FilterSectionProps) => (
  <div className='border-b border-gray-200 dark:border-gray-700 pb-3'>
    <div
      className='flex justify-between items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors'
      onClick={onToggle}
    >
      <h3 className='font-medium text-gray-900 dark:text-gray-100'>{title}</h3>
      {isExpanded ? 
        <ChevronUp className='h-4 w-4 text-gray-500 dark:text-gray-400'/> : 
        <ChevronDown className='h-4 w-4 text-gray-500 dark:text-gray-400'/>
      }
    </div>
    
    {isExpanded && <div className='mt-2'>{children}</div>}
  </div>
));
FilterSection.displayName = 'FilterSection';

// Main Component - optimized for the provided data structure
const HeaderFilter = ({onLayoutChange, headerHeight = 80, onFilterChange}: HeaderFilterProps) => {
  const t = useTranslations('filter');
  const pathname = usePathname();
  const filterRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const initialTopRef = useRef<number | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showCategorySelect, setShowCategorySelect] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<SectionName, boolean>>({
    artists: false,
    categories: true,
    status: false,
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

  // Notify parent component of filter changes
  useEffect(() => {
    onFilterChange?.(filters);
  }, [filters, onFilterChange]);

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

  // Better outside click handling to prevent unwanted closing
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only handle outside clicks when relevant components are open
      if (!showCategorySelect) return;
      
      const target = event.target as Element;
      
      // Check if the click is outside the filter AND outside any sheets/popovers
      const isOutsideFilter = filterRef.current && !filterRef.current.contains(target);
      const isOutsideSheets = (!sheetRef.current || !sheetRef.current.contains(target)) && 
                             (!popoverRef.current || !popoverRef.current.contains(target));
      
      // Make sure we're not clicking on dropdown-related elements
      const isDropdownRelated = target.closest('.category-dropdown-container') || 
                               target.closest('[data-state="open"]') ||
                               target.closest('[role="dialog"]');
      
      if (isOutsideFilter && isOutsideSheets && !isDropdownRelated) {
        setShowCategorySelect(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCategorySelect]);

  // Update filter functions
  const updateCategories = (category: string) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      
      return {...prev, categories: newCategories};
    });
  };

  const updateArtists = (artistId: string) => {
    setFilters(prev => {
      const newArtists = prev.artists.includes(artistId)
        ? prev.artists.filter(id => id !== artistId)
        : [...prev.artists, artistId];
      
      return {...prev, artists: newArtists};
    });
  };

  const updatePriceRange = (values: number[]) => {
    setFilters(prev => ({...prev, priceRange: values}));
  };

  const updateStatus = (status: keyof FilterState['status']) => {
    setFilters(prev => ({
      ...prev, 
      status: {...prev.status, [status]: !prev.status[status]}
    }));
  };

  const updateSearch = (search: string) => {
    setFilters(prev => ({...prev, search}));
  };

  // Helper functions
  const toggleSection = (section: SectionName) => 
    setExpandedSections(prev => ({...prev, [section]: !prev[section]}));

  // Simplified button style
  const getButtonStyle = (isScrolled: boolean) => cn(
    'rounded-full transition-colors',
    isScrolled
      ? 'text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'
      : 'text-gray-500 dark:text-gray-300 bg-white/10 dark:bg-gray-900/10 hover:bg-white/20 dark:hover:bg-gray-800/20 border-transparent dark:border-gray-800/30'
  );

  // Optimized category selector
  const CategorySelector = () => (
    <div className='relative category-dropdown-container'>
      <Button
        variant='outline'
        size='sm'
        className={cn(
          getButtonStyle(isScrolled),
          'flex items-center gap-1 text-sm font-semibold'
        )}
        onClick={(e) => {
          e.stopPropagation();
          setShowCategorySelect(!showCategorySelect);
        }}
      >
        {t('categories')}
        {filters.categories.length > 0 && (
          <Badge variant='secondary' className='ml-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'>
            {filters.categories.length}
          </Badge>
        )}
      </Button>

      {showCategorySelect && (
        <div
          ref={popoverRef}
          className='absolute z-50 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/60 overflow-hidden'
        >
          <ScrollArea className='max-h-64'>
            {categories.map((category) => (
              <div
                key={category}
                className='flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer transition-colors'
                onClick={(e) => {
                  e.stopPropagation();
                  updateCategories(category);
                }}
              >
                <div className='w-4 h-4 border border-gray-300 dark:border-gray-600 rounded mr-2 flex items-center justify-center'>
                  {filters.categories.includes(category) && (
                    <Check className='w-3 h-3 text-gray-900 dark:text-gray-50'/>
                  )}
                </div>
                <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>{category}</span>
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );

  // Optimized filter panel
  const FilterPanelContent = () => (
    <>
      <div className='px-4 py-3'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500'/>
          <Input 
            placeholder={t('searchPlaceholder')} 
            value={filters.search}
            onChange={(e) => updateSearch(e.target.value)}
            className='pl-10 text-sm h-9 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
          />
        </div>
      </div>

      <ScrollArea ref={sheetRef} className='px-4 h-[calc(100vh-10rem)] md:h-[calc(100vh-10rem)]'>
        <div className='space-y-4 pb-6'>
          <FilterSection
            title={t('categories')}
            isExpanded={expandedSections.categories}
            onToggle={() => toggleSection('categories')}
          >
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-1'>
              {categories.map(category => (
                <CheckboxItem 
                  key={category} 
                  id={category} 
                  label={category}
                  checked={filters.categories.includes(category)}
                  onChange={() => updateCategories(category)}
                />
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
                value={filters.priceRange}
                onValueChange={updatePriceRange}
                max={10000000}
                step={100000}
                className='my-4'
              />
              <div className='flex justify-between text-sm text-gray-700 dark:text-gray-300'>
                <span>{vietnamCurrency(filters.priceRange[0])}</span>
                <span>{vietnamCurrency(filters.priceRange[1])}</span>
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
                <CheckboxItem 
                  key={artist._id} 
                  id={artist._id} 
                  label={artist.name}
                  checked={filters.artists.includes(artist._id)}
                  onChange={() => updateArtists(artist._id)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title={t('status')}
            isExpanded={expandedSections.status}
            onToggle={() => toggleSection('status')}
          >
            <div className='space-y-2'>
              <CheckboxItem
                id="available"
                label={t('artwork.status.available')}
                checked={filters.status.available}
                onChange={() => updateStatus('available')}
              />
              <CheckboxItem
                id="selling"
                label={t('artwork.status.selling')}
                checked={filters.status.selling}
                onChange={() => updateStatus('selling')}
              />
            </div>
          </FilterSection>
        </div>
      </ScrollArea>
    </>
  );

  return (
    <div
      ref={filterRef}
      className={cn(
        'z-40 transition-colors',
        isScrolled
          ? 'bg-white/25 dark:bg-gray-900/30 backdrop-blur-sm shadow-sm dark:shadow-gray-950/30'
          : 'bg-transparent'
      )}
    >
      <div className={cn('container mx-auto py-2', isMobile ? 'px-2' : 'px-4')}>
        <div className='flex items-center gap-2'>
          {/* Filter button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className={cn(
                  getButtonStyle(isScrolled),
                  'flex items-center gap-1 min-w-9 justify-center'
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <Filter className='h-4 w-4'/>
                <span className='hidden sm:inline text-sm font-semibold'>{t('filters')}</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side={isMobile ? 'bottom' : 'left'}
              className={cn(
                'bg-white dark:bg-gray-900 p-0 backdrop-blur-md border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-950/50',
                isMobile ? 'h-[85vh] rounded-t-xl' : 'w-full max-w-[380px]'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <SheetHeader className='px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
                <SheetTitle className='text-lg font-semibold text-gray-900 dark:text-gray-50'>
                  {t('filters')}
                </SheetTitle>
              </SheetHeader>
              <FilterPanelContent/>
            </SheetContent>
          </Sheet>

          {/* Desktop filters */}
          <div className='hidden sm:flex items-center gap-2 overflow-x-auto no-scrollbar'>
            <CategorySelector/>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className={cn(getButtonStyle(isScrolled), 'text-sm font-semibold whitespace-nowrap')}
                >
                  {t('priceRange')}
                </Button>
              </PopoverTrigger>

              <PopoverContent 
                className='w-80 p-4 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-950/50'
                onClick={(e) => e.stopPropagation()}
              >
                <div className='space-y-4'>
                  <Label className='text-base font-semibold text-gray-900 dark:text-gray-50'>
                    {t('priceRange')}
                  </Label>

                  <Slider
                    value={filters.priceRange}
                    onValueChange={updatePriceRange}
                    max={10000000}
                    step={100000}
                    className='my-4'
                  />

                  <div className='flex justify-between text-sm text-gray-700 dark:text-gray-300'>
                    <span>{vietnamCurrency(filters.priceRange[0])}</span>
                    <span>{vietnamCurrency(filters.priceRange[1])}</span>
                  </div>

                  <div className='flex gap-3'>
                    <div className='flex-1'>
                      <Label className='text-xs text-gray-800 dark:text-gray-200'>Min</Label>
                      <Input
                        type='number'
                        value={filters.priceRange[0]}
                        onChange={(e) => updatePriceRange([Number(e.target.value), filters.priceRange[1]])}
                        className='mt-1 text-sm bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                      />
                    </div>
                    <div className='flex-1'>
                      <Label className='text-xs text-gray-800 dark:text-gray-200'>Max</Label>
                      <Input
                        type='number'
                        value={filters.priceRange[1]}
                        onChange={(e) => updatePriceRange([filters.priceRange[0], Number(e.target.value)])}
                        className='mt-1 text-sm bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Bar */}
          <div className='flex-1 min-w-0'>
            <div
              className={cn(
                'relative rounded-full overflow-hidden transition-colors',
                isScrolled
                  ? 'bg-gray-100 dark:bg-gray-800/70 ring-1 ring-gray-200 dark:ring-gray-700'
                  : 'bg-white/10 dark:bg-gray-800/20'
              )}
            >
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500'/>
              <Input
                placeholder={t('quickSearch')}
                value={filters.search}
                onChange={(e) => updateSearch(e.target.value)}
                className={cn(
                  'border-none bg-transparent pl-10 pr-3 h-9 w-full focus:ring-0 text-sm',
                  isScrolled
                    ? 'text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400'
                    : 'text-gray-800 dark:text-gray-200 placeholder:text-gray-600 dark:placeholder:text-gray-400'
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {isScrolled && (
        <div className='h-px w-full bg-gradient-to-r from-transparent via-gray-200/40 dark:via-gray-700/60 to-transparent'/>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .dark .ui-slider-track { background-color: rgba(55, 65, 81, 0.5); }
        .dark .ui-slider-range { background-color: rgba(209, 213, 219, 0.8); }
        .dark .ui-slider-thumb { 
          border-color: rgba(209, 213, 219, 0.8);
          background-color: rgba(31, 41, 55, 1);
        }
      `}</style>
    </div>
  );
};

export default HeaderFilter;