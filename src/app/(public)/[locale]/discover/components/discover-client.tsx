'use client';

import { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Sparkles, Clock, Flame } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ExhibitionGrid } from './exhibition-grid';
import { ExhibitionSkeleton } from './exhibition-skeleton';
import { getPublicExhibitions } from '@/service/exhibition';
import { GetPublicExhibitionsResponse } from '@/types/exhibition';

interface DiscoverClientProps {
  initialData: GetPublicExhibitionsResponse;
}

type TabValue = 'featured' | 'trending' | 'recent';

export function DiscoverClient({ initialData }: DiscoverClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabValue>('featured');
  const t = useTranslations('exhibitions');
  const { ref: loadMoreRef, inView } = useInView();

  // Get filter and sort config based on active tab
  const getQueryConfig = (tab: TabValue) => {
    switch (tab) {
      case 'featured':
        return {
          filter: { isFeatured: true }, 
          sort: { createdAt: -1 } // Sort by newest first as secondary criteria
        };
      case 'trending':
        return {
          filter: {}, // No filter
          sort: { 'result.visits': -1 } // Sort by visits
        };
      case 'recent':
        return {
          filter: {}, // No filter
          sort: { createdAt: -1 } // Sort by creation date
        };
      default:
        return {
          filter: { discovery: true },
          sort: { createdAt: -1 }
        };
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['exhibitions', activeTab, searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const { filter, sort } = getQueryConfig(activeTab);
      
      const response = await getPublicExhibitions({
        page: pageParam,
        limit: 12,
        filter,
        sort,
        search: searchQuery || undefined,
      });
      
      // Make sure we handle potential null data
      if (!response.data) {
        throw new Error('Failed to load exhibitions');
      }
      
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Add null check before accessing pagination
      if (!lastPage || !lastPage.pagination) {
        return undefined;
      }
      return lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined;
    },
    initialData: { pages: [initialData], pageParams: [1] }
  });

  // Trigger fetch when scrolling to the bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Combine all exhibitions from all pages
  const allExhibitions = data?.pages
    .filter(page => page !== null)
    .flatMap(page => page?.exhibitions || []) || [];

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will automatically trigger due to the dependency on searchQuery
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      {/* Hero Section */}
      <div className='relative h-[300px] bg-gradient-to-r from-purple-600 to-blue-600 text-white'>
        <div className='absolute inset-0 bg-black/20' />
        <div className='relative max-w-7xl mx-auto px-4 py-12 h-full flex flex-col justify-center'>
          <h1 className='text-3xl md:text-4xl font-bold mb-4'>
            {t('discover_title')}
          </h1>
          <p className='text-lg mb-6 max-w-2xl'>
            {t('discover_description')}
          </p>

          <form onSubmit={handleSearch} className='flex gap-3 max-w-xl'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <Input
                placeholder={t('search_placeholder')}
                className='w-full pl-9 h-10 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/60'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className='h-10 px-4 bg-white text-purple-600 hover:bg-white/90'>
              {t('search')}
            </Button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={(value) => setActiveTab(value as TabValue)}
          className='space-y-6'
        >
          <div className='flex items-center justify-between mb-4'>
            <TabsList className='bg-white/50 backdrop-blur-sm p-1 rounded-lg'>
              <TabsTrigger value='featured' className='flex items-center gap-2'>
                <Sparkles className='w-4 h-4' /> {t('tabs.featured')}
              </TabsTrigger>
              <TabsTrigger value='trending' className='flex items-center gap-2'>
                <Flame className='w-4 h-4' /> {t('tabs.trending')}
              </TabsTrigger>
              <TabsTrigger value='recent' className='flex items-center gap-2'>
                <Clock className='w-4 h-4' /> {t('tabs.recent')}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab content - we use the same content for all tabs since the filtering happens in the query */}
          {['featured', 'trending', 'recent'].map((tab) => (
            <TabsContent key={tab} value={tab}>
              {isLoading ? (
                <ExhibitionSkeleton />
              ) : isError ? (
                <div className="text-center py-10">
                  <p className="text-red-500">{t('error_loading')}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => fetchNextPage()}
                    className="mt-4"
                  >
                    {t('try_again')}
                  </Button>
                </div>
              ) : (
                <ExhibitionGrid exhibitions={allExhibitions} />
              )}
            </TabsContent>
          ))}

          {/* Infinite scroll trigger */}
          {hasNextPage && !isLoading && (
            <div ref={loadMoreRef} className='h-20 flex items-center justify-center'>
              {isFetchingNextPage && (
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600' />
              )}
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}