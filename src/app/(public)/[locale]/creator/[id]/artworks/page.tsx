'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Grid, Info, Check, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { useServerAction } from 'zsa-react';
import { useQuery } from '@tanstack/react-query';
import { updateExhibitionAction } from '../../actions';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useExhibition } from '../context/exhibition-provider';
import { getArtistArtworks } from '@/service/artwork';
import { getCurrentUser } from '@/lib/session';

// Type for artwork
interface Artwork {
  _id: string;
  title: string;
  description: string;
  url: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export default function ArtworksPage() {
  const { id } = useParams<{ id: string }>();
  const [isUploadSectionOpen, setIsUploadSectionOpen] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("exhibitions");
  const tCommon = useTranslations("common");
  
  // Use the exhibition context
  const { exhibition, refreshExhibition } = useExhibition();

  // Get all positions from the gallery template
  const positions = Array.from({ length: exhibition?.gallery?.artworkPlacements?.length || 68 }, (_, i) => i + 1);
  
  // Get the occupied positions from the exhibition
  const occupiedPositions = exhibition?.artworkPositions?.map(pos => pos.positionIndex) || [];

  // Fetch all artist artworks
  const { data: artworks = [], isLoading: isLoadingArtworks } = useQuery({
    queryKey: ['artistArtworks'],
    queryFn: async () => {
      const user = await getCurrentUser();
      const response = await getArtistArtworks(user!.accessToken);
      return response.data?.artworks || [];
    },
    enabled: isArtworkModalOpen,
  });

  // Server action to update the exhibition with the selected artwork
  const { execute, isPending } = useServerAction(updateExhibitionAction, {
    onSuccess: () => {
      toast({
        title: tCommon("success"),
        description: t("artwork_placed_success"),
        variant: "success"
      });
      setIsArtworkModalOpen(false);
      setSelectedArtwork(null);
      refreshExhibition();
    },
    onError: (error) => {
      toast({
        title: tCommon("error"),
        description: t("artwork_placement_failed"),
        variant: "destructive"
      });
      console.error('Error placing artwork:', error);
    },
  });

  const handlePositionClick = (position: number) => {
    setSelectedPosition(position);
    setIsArtworkModalOpen(true);
  };

  const handleArtworkSelect = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
  };

  const handleConfirmArtworkSelection = () => {
    if (!selectedArtwork || selectedPosition === null) return;
    
    execute({
      id: id as string,
      data: {
        artworkPositions: [
          ...exhibition?.artworkPositions || [],
          {
            artworkId: selectedArtwork._id,
            positionIndex: selectedPosition
          }
        ]
      }
    });
  };

  // Helper function to get artwork at position
  const getArtworkAtPosition = (position: number) => {
    if (!exhibition?.artworkPositions) return null;
    
    const artworkPosition = exhibition.artworkPositions.find(
      pos => pos.positionIndex === position
    );
    
    if (!artworkPosition) return null;
    
    // Find the artwork in the exhibition's artworks array
    return exhibition.artworks?.find(
      art => art.artwork._id === artworkPosition.artworkId
    )?.artwork || null;
  };

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 space-y-8'>
      <div className='bg-white rounded-lg border p-6'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>
          {t("artworks")}
        </h2>
        <p className='text-gray-600 leading-relaxed'>
          {t("artworks_description")}
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
          <Info className="h-4 w-4" />
          <a href="/faq" className="hover:underline">
            {t("read_faq")}
          </a>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>
          {t("floor_plan")}
        </h2>
        <p className='text-gray-600 leading-relaxed mb-6'>
          {t("floor_plan_description")}
        </p>

        <div className='w-full flex justify-center'>
          <div className='w-[600px] rounded-lg overflow-hidden border border-gray-200'>
            <Image
              src='https://res.cloudinary.com/djvlldzih/image/upload/v1739374668/gallery/modern_c1_plan.png'
              alt='Floor Plan'
              width={1000}
              height={1000}
              className='w-full h-auto object-contain'
            />
          </div>
        </div>

        {/* Artwork Positions Section */}
        <div className='mt-8'>
          <button
            onClick={() => setIsUploadSectionOpen(!isUploadSectionOpen)}
            className='w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
          >
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>
                {t("artwork_positions")}
              </span>
              <span className='text-sm text-gray-500'>
                {occupiedPositions.length}/{positions.length} {t("artworks")}
              </span>
            </div>
            {isUploadSectionOpen ? (
              <ChevronUp className='w-5 h-5 transition-transform duration-300' />
            ) : (
              <ChevronDown className='w-5 h-5 transition-transform duration-300' />
            )}
          </button>

          <div
            className={`transition-all duration-300 ease-in-out ${isUploadSectionOpen
                ? 'opacity-100 max-h-[5000px]'
                : 'opacity-0 max-h-0'
              } overflow-hidden`}
          >
            <div className='mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
              {positions.map((position) => {
                const isOccupied = occupiedPositions.includes(position);
                const artwork = getArtworkAtPosition(position);
                
                return (
                  <div
                    key={position}
                    onClick={() => !isOccupied && handlePositionClick(position)}
                    className={`aspect-square border-2 ${isOccupied 
                      ? 'border-solid border-green-500 bg-green-50' 
                      : 'border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                    } rounded-lg flex flex-col items-center justify-center relative overflow-hidden transition-all duration-200`}
                  >
                    {isOccupied && artwork ? (
                      <>
                        <div className="absolute inset-0">
                          <Image 
                            src={artwork.url}
                            alt={artwork.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <Grid className='w-6 h-6 text-gray-400' />
                    )}
                    <span className='absolute bottom-2 left-2 text-sm font-semibold text-gray-700 bg-white/80 px-1 rounded'>
                      {position}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Artwork Selection Modal */}
      <Dialog open={isArtworkModalOpen} onOpenChange={setIsArtworkModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {t("select_artwork_for_position")} {selectedPosition}
            </DialogTitle>
          </DialogHeader>
          
          {isLoadingArtworks ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : artworks.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                {t("no_artworks_found")}
              </p>
              <Button 
                className="mt-4"
                onClick={() => router.push('/artists/create')}
              >
                {t("create_artwork")}
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[60vh]">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-1">
                {artworks.map((artwork) => (
                  <div
                    key={artwork._id}
                    onClick={() => handleArtworkSelect(artwork)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                      selectedArtwork?._id === artwork._id
                        ? 'border-primary ring-2 ring-primary/20 scale-[0.98]'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <Image
                      src={artwork.url}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-2 left-2 right-2">
                        <h3 className="text-white text-sm font-medium truncate">
                          {artwork.title}
                        </h3>
                        <p className="text-white/80 text-xs truncate">
                          {artwork.dimensions?.width}x{artwork.dimensions?.height}
                        </p>
                      </div>
                    </div>
                    
                    {selectedArtwork?._id === artwork._id && (
                      <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsArtworkModalOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleConfirmArtworkSelection}
              disabled={!selectedArtwork || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("placing")}
                </>
              ) : (
                t("place_artwork")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}