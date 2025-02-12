"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Filter, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { vietnamCurrency } from "@/utils/converters";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Types
type SectionName = 'artists' | 'categories' | 'materials' | 'waysToBuy' | 'sizes' | 'price';

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
  { id: "following", name: "Artists you follow" },
  { id: "1", name: "Leonardo da Vinci" },
  { id: "2", name: "Vincent van Gogh" },
  { id: "3", name: "Pablo Picasso" },
  { id: "4", name: "Claude Monet" },
  { id: "5", name: "Andy Warhol" },
];

const categories = [
  "Paintings",
  "Sculptures", 
  "Photography",
  "Digital Art",
  "Prints",
  "Drawing",
];

const materials = [
  "Acrylic",
  "Oil",
  "Watercolor", 
  "Canvas",
  "Wood",
  "Metal",
  "Glass",
  "Paper",
];

const waysToBuy = [
  { id: "offer", label: "Make an Offer" },
  { id: "bid", label: "Bid" },
  { id: "contact", label: "Contact Gallery" },
];

const sizes = [
  { id: "small", label: "Small (under 40cm)", description: "Perfect for intimate spaces" },
  { id: "medium", label: "Medium (40-100cm)", description: "Ideal for most walls" },
  { id: "large", label: "Large (over 100cm)", description: "Statement pieces" },
];

// Reusable Components
const FilterSection = ({ title, isExpanded, onToggle, children }: FilterSectionProps) => (
  <div className="space-y-4 border-b border-gray-200 dark:border-gray-700 pb-4">
    <div 
      className="flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
      onClick={onToggle}
    >
      <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
      {isExpanded ? (
        <ChevronUp className="h-4 w-4 text-gray-500" />
      ) : (
        <ChevronDown className="h-4 w-4 text-gray-500" />
      )}
    </div>
    {isExpanded && <div className="pl-2">{children}</div>}
  </div>
);

const CheckboxItem = ({ id, label, description }: CheckboxItemProps) => (
  <div className="flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
    <Checkbox id={id} className={`${description ? "mt-1" : ""} rounded-sm`} />
    <div>
      <label htmlFor={id} className="text-sm font-medium leading-none cursor-pointer">
        {label}
      </label>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      )}
    </div>
  </div>
);

// Category Selector Component
const CategorySelector = ({ 
  showCategorySelect, 
  setShowCategorySelect,
  selectedCategories,
  setSelectedCategories 
}: {
  showCategorySelect: boolean;
  setShowCategorySelect: (show: boolean) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) => (
  <div className="relative">
    <Button
      variant="outline"
      className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
      onClick={() => setShowCategorySelect(!showCategorySelect)}
    >
      Categories
      {selectedCategories.length > 0 && (
        <Badge variant="secondary" className="ml-1">
          {selectedCategories.length}
        </Badge>
      )}
    </Button>
    {showCategorySelect && (
      <div className="absolute z-10 w-64 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        {categories.map((category) => (
          <div
            key={category}
            className="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            onClick={() => {
              if (selectedCategories.includes(category)) {
                setSelectedCategories(selectedCategories.filter((c) => c !== category));
              } else {
                setSelectedCategories([...selectedCategories, category]);
              }
            }}
          >
            <div className="w-4 h-4 border rounded mr-2 flex items-center justify-center">
              {selectedCategories.includes(category) && <Check className="w-3 h-3" />}
            </div>
            {category}
          </div>
        ))}
      </div>
    )}
  </div>
);

// Price Filter Component
const PriceFilter = ({
  priceRange,
  setPriceRange
}: {
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
        Price Range
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-80 p-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-base font-medium">Price Range</Label>
          <Slider
            defaultValue={priceRange}
            max={10000000}
            step={100000}
            value={priceRange}
            onValueChange={setPriceRange}
            className="my-6"
          />
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{vietnamCurrency(priceRange[0])}</span>
            <span>{vietnamCurrency(priceRange[1])}</span>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <Label className="text-xs mb-1">Min Price</Label>
              <Input 
                type="number"
                placeholder="Min $USD"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label className="text-xs mb-1">Max Price</Label>
              <Input 
                type="number"
                placeholder="Max $USD" 
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

// Main Component
const ArtFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    artists: true,
    categories: true,
    materials: true,
    waysToBuy: true,
    sizes: true,
    price: true,
  });
  const [priceRange, setPriceRange] = useState([0, 10000000]);

  const toggleSection = (section: SectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="flex gap-4 p-4 items-center border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[400px]">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold">Filters</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search artworks..." className="pl-10" />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)] px-4">
            <div className="space-y-6">
              <FilterSection 
                title="Artists" 
                isExpanded={expandedSections.artists}
                onToggle={() => toggleSection('artists')}
              >
                <div className="space-y-2">
                  {artists.map((artist) => (
                    <CheckboxItem key={artist.id} id={artist.id} label={artist.name} />
                  ))}
                </div>
              </FilterSection>

              <FilterSection 
                title="Categories" 
                isExpanded={expandedSections.categories}
                onToggle={() => toggleSection('categories')}
              >
                <div className="space-y-2">
                  {categories.map((category) => (
                    <CheckboxItem key={category} id={category} label={category} />
                  ))}
                </div>
              </FilterSection>

              <FilterSection 
                title="Material" 
                isExpanded={expandedSections.materials}
                onToggle={() => toggleSection('materials')}
              >
                <div className="space-y-2">
                  {materials.map((material) => (
                    <CheckboxItem key={material} id={material} label={material} />
                  ))}
                </div>
              </FilterSection>

              <FilterSection 
                title="Ways to Buy" 
                isExpanded={expandedSections.waysToBuy}
                onToggle={() => toggleSection('waysToBuy')}
              >
                <div className="space-y-2">
                  {waysToBuy.map((way) => (
                    <CheckboxItem key={way.id} id={way.id} label={way.label} />
                  ))}
                </div>
              </FilterSection>

              <FilterSection 
                title="Size" 
                isExpanded={expandedSections.sizes}
                onToggle={() => toggleSection('sizes')}
              >
                <div className="space-y-3">
                  {sizes.map((size) => (
                    <CheckboxItem 
                      key={size.id} 
                      id={size.id} 
                      label={size.label}
                      description={size.description}
                    />
                  ))}
                </div>
              </FilterSection>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <div className="h-9 w-px bg-gray-200 dark:bg-gray-700" />

      <div className="flex gap-3">
        <CategorySelector
          showCategorySelect={showCategorySelect}
          setShowCategorySelect={setShowCategorySelect}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />

        <PriceFilter
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
      </div>
    </div>
  );
};

export default ArtFilter;
