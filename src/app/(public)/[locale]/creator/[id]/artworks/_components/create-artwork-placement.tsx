'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { useServerAction } from 'zsa-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { Check, Loader2 } from 'lucide-react';
import { updateExhibitionAction } from '../../../actions';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useExhibition } from '../../../context/exhibition-provider';
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

interface CreateArtworkPlacementProps {
  position: number;
  isOccupied: boolean;
  onSuccess?: () => void;
}

export default function CreateArtworkPlacement({ 
  position, 
  isOccupied,
  onSuccess 
}: CreateArtworkPlacementProps) {
  const { id } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("exhibitions");
  const tCommon = useTranslations("common");
  const queryClient = useQueryClient();
  
  // Use the exhibition context
  const { exhibition, refreshExhibition } = useExhibition();

  // Fetch all artist artworks
  const { data: artworks = [], isLoading: isLoadingArtworks } = useQuery({
    queryKey: ['artistArtworks'],
    queryFn: async () => {
      const user = await getCurrentUser();
      const response = await getArtistArtworks(user!.accessToken);
      return response.data?.artworks || [];
    },
    enabled: isModalOpen,
  });

  // Server action to update the exhibition with the selected artwork
  const { execute, isPending } = useServerAction(updateExhibitionAction, {
    onSuccess: () => {
      toast({
        title: tCommon("success"),
        description: t("artwork_placed_success"),
        variant: "success"
      });
      setIsModalOpen(false);
      setSelectedArtwork(null);
      
      // Force refresh exhibition data
      refreshExhibition();
      
      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['exhibition', id] });
      
      // Navigate to trigger a refresh
      router.refresh();
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
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

  const handleArtworkSelect = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
  };

  const handleConfirmArtworkSelection = () => {
    if (!selectedArtwork) return;
    
    // Get existing artwork positions
    const existingPositions = exhibition?.artworkPositions || [];
    
    // Check if this position already has an artwork
    const positionIndex = existingPositions.findIndex(p => p.positionIndex === position);
    
    let newPositions;
    if (positionIndex >= 0) {
      // Update existing position
      newPositions = [...existingPositions];
      newPositions[positionIndex] = {
        artworkId: selectedArtwork._id,
        positionIndex: position
      };
    } else {
      // Add new position
      newPositions = [
        ...existingPositions,
        {
          artworkId: selectedArtwork._id,
          positionIndex: position
        }
      ];
    }
    
    execute({
      id: id as string,
      data: {
        artworkPositions: newPositions
      }
    });
  };

  return (
    <>
      <div
        onClick={() => !isOccupied && setIsModalOpen(true)}
        className="cursor-pointer"
      >
        {/* Your position slot UI */}
      </div>
      
      {/* Artwork Selection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {t("select_artwork_for_position")} {position}
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
              onClick={() => setIsModalOpen(false)}
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
    </>
  );
}