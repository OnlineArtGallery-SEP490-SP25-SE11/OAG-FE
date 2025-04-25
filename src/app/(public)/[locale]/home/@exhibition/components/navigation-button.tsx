'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationButtonsProps {
  scrollContainerId: string;
}

export function NavigationButtons({ scrollContainerId }: NavigationButtonsProps) {
  const handlePrevious = () => {
    const container = document.getElementById(scrollContainerId);
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    const container = document.getElementById(scrollContainerId);
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <>
      <button
        onClick={handlePrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full 
                 bg-white/80 hover:bg-white flex items-center justify-center shadow-lg 
                 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Previous items"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full 
                 bg-white/80 hover:bg-white flex items-center justify-center shadow-lg 
                 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Next items"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </>
  );
}