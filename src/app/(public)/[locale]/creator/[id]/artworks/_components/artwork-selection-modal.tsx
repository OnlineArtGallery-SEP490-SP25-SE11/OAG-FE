'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Check, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation'; // Keep using this for navigation

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getArtistArtworks } from '@/service/artwork'; // Assuming path is correct
import { getCurrentUser } from '@/lib/session'; // Assuming path is correct

// Type for artwork (can be shared or redefined)
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

interface ArtworkSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  position: number | null;
  onConfirm: (artwork: Artwork, position: number) => void;
  isPlacingArtwork: boolean; // Pass loading state from parent
  // Translations
  t: {
    select_artwork_for_position: string;
    no_artworks_found: string;
    create_artwork: string;
    cancel: string;
    place_artwork: string;
    placing: string;
  };
}

export function ArtworkSelectionModal({
  isOpen,
  onOpenChange,
  position,
  onConfirm,
  isPlacingArtwork,
  t,
}: ArtworkSelectionModalProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const router = useRouter();

  // Fetch all artist artworks when the modal is open
  const { data: artworks = [], isLoading: isLoadingArtworks, error: queryError } = useQuery({
    queryKey: ['artistArtworks'],
    queryFn: async () => {
      // It's generally better to fetch the user *outside* the queryFn if possible,
      // but if needed within, handle potential null user.
      const user = await getCurrentUser();
      if (!user?.accessToken) {
        console.error("User or access token not found for fetching artworks.");
        return [];
        // Optionally: throw new Error("User not authenticated");
      }
      const response = await getArtistArtworks(user.accessToken);
      // Add better error handling for the API call itself
      if (!response.data?.artworks) {
          console.error("Failed to fetch artworks:", response.details);
          // Optionally: throw new Error(response.error || "Failed to fetch artworks");
          return [];
      }
      return response.data.artworks;
    },
    enabled: isOpen && position !== null, // Only fetch when modal is open and position is set
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes even if inactive
  });

  // Reset selection when modal closes or position changes
  useEffect(() => {
    if (!isOpen) {
      setSelectedArtwork(null);
    }
  }, [isOpen]);

  const handleArtworkSelect = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
  };

  const handleConfirmClick = () => {
    if (selectedArtwork && position !== null) {
      onConfirm(selectedArtwork, position);
    }
  };

  const handleCreateArtworkClick = () => {
    // Close the modal before navigating? Optional.
    // onOpenChange(false);
    router.push('/artists/create'); // Adjust path if needed
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {t.select_artwork_for_position} {position}
          </DialogTitle>
          {/* Optional: Add a description */}
          {/* <DialogDescription>
            Choose an artwork from your collection to place at this position.
          </DialogDescription> */}
        </DialogHeader>

        {/* Loading State */}
        {isLoadingArtworks && (
          <div className="flex justify-center items-center py-12 h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {!isLoadingArtworks && queryError && (
            <div className="py-8 text-center text-destructive h-[60vh]">
                <p>Error loading artworks: {queryError.message}</p>
                {/* Optional: Add a retry button */}
            </div>
        )}

        {/* Empty State */}
        {!isLoadingArtworks && !queryError && artworks.length === 0 && (
          <div className="py-8 text-center h-[60vh] flex flex-col justify-center items-center">
            <p className="text-muted-foreground mb-4">
              {t.no_artworks_found}
            </p>
            <Button onClick={handleCreateArtworkClick}>
              {t.create_artwork}
            </Button>
          </div>
        )}

        {/* Content State */}
        {!isLoadingArtworks && !queryError && artworks.length > 0 && (
          <ScrollArea className="h-[60vh] border rounded-md">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4"> {/* Added padding */}
              {artworks.map((artwork) => (
                <div
                  key={artwork._id}
                  onClick={() => handleArtworkSelect(artwork)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer group ${ // Added group for hover effects
                    selectedArtwork?._id === artwork._id
                      ? 'border-primary ring-2 ring-primary/20 scale-[0.98]'
                      : 'border-transparent hover:border-primary/50' // Use transparent border to prevent layout shift
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedArtwork?._id === artwork._id}
                  aria-label={`Select ${artwork.title}`}
                  onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? handleArtworkSelect(artwork) : null} // Accessibility
                >
                  <Image
                    src={artwork.url}
                    alt={artwork.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw" // Adjust sizes based on grid columns
                    className="object-cover"
                  />

                  {/* Info Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="text-white text-sm font-medium truncate">
                        {artwork.title}
                      </h3>
                      {artwork.dimensions && (
                          <p className="text-white/80 text-xs truncate">
                            {artwork.dimensions.width}x{artwork.dimensions.height}
                          </p>
                       )}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedArtwork?._id === artwork._id && (
                    <div className="absolute top-2 right-2 bg-primary rounded-full p-1 pointer-events-none">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPlacingArtwork} // Disable cancel while placing
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleConfirmClick}
            disabled={!selectedArtwork || isPlacingArtwork || isLoadingArtworks} // Disable if no selection, placing, or still loading
          >
            {isPlacingArtwork ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.placing}
              </>
            ) : (
              t.place_artwork
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}