'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Check, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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

// Type for artwork position
interface ArtworkPosition {
  artwork: {
    _id: string;
    title: string;
    url: string;
  };
  positionIndex: number;
}

interface ArtworkSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  position: number | null;
  onConfirm: (artwork: Artwork | null, position: number) => void;
  isPlacingArtwork: boolean;
  existingArtworkPosition: ArtworkPosition | null;
  // Translations
  t: {
    select_artwork_for_position: string;
    replace_artwork_at_position: string;
    remove_artwork_confirmation: string;
    no_artworks_found: string;
    create_artwork: string;
    cancel: string;
    place_artwork: string;
    replace_artwork: string;
    remove_artwork: string;
    placing: string;
  };
}

export function ArtworkSelectionModal({
  isOpen,
  onOpenChange,
  position,
  onConfirm,
  isPlacingArtwork,
  existingArtworkPosition,
  t,
}: ArtworkSelectionModalProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  const router = useRouter();

  // Fetch all artist artworks when the modal is open
  const { data: artworks = [], isLoading: isLoadingArtworks, error: queryError } = useQuery({
    queryKey: ['artistArtworks'],
    queryFn: async () => {
      const user = await getCurrentUser();
      if (!user?.accessToken) {
        console.error("User or access token not found for fetching artworks.");
        return [];
      }
      const response = await getArtistArtworks(user.accessToken);
      if (!response.data?.artworks) {
        console.error("Failed to fetch artworks:", response.details);
        return [];
      }
      return response.data.artworks;
    },
    enabled: isOpen && position !== null && !isRemoveMode, // Only fetch when modal is open, position is set, and not in remove mode
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes even if inactive
  });

  // Reset selection when modal closes or position changes
  useEffect(() => {
    if (!isOpen) {
      setSelectedArtwork(null);
      setIsRemoveMode(false);
    }
  }, [isOpen]);

  const handleArtworkSelect = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
  };

  const handleConfirmClick = () => {
    if (position !== null) {
      if (isRemoveMode) {
        // Send null to indicate artwork removal
        onConfirm(null, position);
      } else if (selectedArtwork) {
        // Send selected artwork for placement/replacement
        onConfirm(selectedArtwork, position);
      }
    }
  };

  const handleCreateArtworkClick = () => {
    router.push('/artists/create');
  };

  const handleRemoveClick = () => {
    setIsRemoveMode(true);
  };

  const handleBackToSelection = () => {
    setIsRemoveMode(false);
  };

  // If in remove confirmation mode
  if (isRemoveMode && existingArtworkPosition) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              {t.remove_artwork_confirmation}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove &quot;{existingArtworkPosition.artwork.title}&quot; from position {position}?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center my-6">
            <div className="relative w-36 h-36 rounded-md overflow-hidden border border-muted">
              <Image
                src={existingArtworkPosition.artwork.url}
                alt={existingArtworkPosition.artwork.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleBackToSelection}
              disabled={isPlacingArtwork}
            >
              {t.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmClick}
              disabled={isPlacingArtwork}
            >
              {isPlacingArtwork ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.placing}
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t.remove_artwork}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {existingArtworkPosition 
              ? `${t.replace_artwork_at_position} ${position}`
              : `${t.select_artwork_for_position} ${position}`}
          </DialogTitle>
        </DialogHeader>

        {/* Existing artwork info */}
        {existingArtworkPosition && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-3">
            <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
              <Image 
                src={existingArtworkPosition.artwork.url}
                alt={existingArtworkPosition.artwork.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">Currently: {existingArtworkPosition.artwork.title}</p>
              <p className="text-sm text-muted-foreground">Select a new artwork below or remove this one</p>
            </div>
            <Button 
              variant="destructive"
              size="sm"
              onClick={handleRemoveClick}
              className="flex-shrink-0"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {t.remove_artwork}
            </Button>
          </div>
        )}

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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
              {artworks.map((artwork) => (
                <div
                  key={artwork._id}
                  onClick={() => handleArtworkSelect(artwork)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer group ${
                    selectedArtwork?._id === artwork._id
                      ? 'border-primary ring-2 ring-primary/20 scale-[0.98]'
                      : 'border-transparent hover:border-primary/50'
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedArtwork?._id === artwork._id}
                  aria-label={`Select ${artwork.title}`}
                  onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? handleArtworkSelect(artwork) : null}
                >
                  <Image
                    src={artwork.url}
                    alt={artwork.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
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
            disabled={isPlacingArtwork}
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleConfirmClick}
            disabled={!selectedArtwork || isPlacingArtwork || isLoadingArtworks}
          >
            {isPlacingArtwork ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.placing}
              </>
            ) : existingArtworkPosition ? (
              t.replace_artwork
            ) : (
              t.place_artwork
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}