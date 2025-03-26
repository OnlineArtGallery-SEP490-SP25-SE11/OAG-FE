'use client';

import { useState, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { useServerAction } from 'zsa-react';

import { updateExhibitionAction } from '../../actions';
import { useExhibition } from '../../context/exhibition-provider';

// Import the new components
import { ExhibitionInfoHeader } from './_components/exhibition-info-header';
import { ExhibitionFloorPlan } from './_components/exhibition-floor-plan';
import { ArtworkPositionsGrid } from './_components/artwork-positions-grid';
import { ArtworkSelectionModal } from './_components/artwork-selection-modal';


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

// Type for Artwork within Exhibition context (might be slightly different)
interface ExhibitionArtwork {
    artwork: Artwork;
    positionIndex: number; 
}

export default function ArtworksPage() {
  const { id: exhibitionId } = useParams<{ id: string }>(); // Renamed for clarity
  const { toast } = useToast();
  const t = useTranslations("exhibitions");
  const tCommon = useTranslations("common");

  // Use the exhibition context
  const { exhibition, refreshExhibition } = useExhibition();

  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);

  // Server action hook remains in the parent orchestrator
  const { execute: executePlacement, isPending: isPlacingArtwork } = useServerAction(updateExhibitionAction, {
    onSuccess: () => {
      toast({
        title: tCommon("success"),
        description: t("artwork_placed_success"),
        variant: "success"
      });
      setIsArtworkModalOpen(false);
      setSelectedPosition(null); // Reset position as well
      refreshExhibition(); // Refresh data
    },
    onError: (error) => {
      toast({
        title: tCommon("error"),
        // Provide more specific error if possible from server action
        description: error.err.message || t("artwork_placement_failed"),
        variant: "destructive"
      });
      console.error('Error placing artwork:', error);
      // Keep modal open on error? Or close? User preference.
      // setIsArtworkModalOpen(false);
    },
  });

  // Memoize calculation of positions and occupied positions
  const { positions, occupiedPositions } = useMemo(() => {
    const totalPositions = exhibition?.gallery?.artworkPlacements?.length || 68; // Default or based on gallery
    const pos = Array.from({ length: totalPositions }, (_, i) => i + 1);
    const occupied = exhibition?.artworkPositions?.map(p => p.positionIndex) || [];
    return { positions: pos, occupiedPositions: occupied };
  }, [exhibition?.gallery?.artworkPlacements, exhibition?.artworkPositions]);

  // Memoize artwork lookup function to prevent unnecessary re-renders of the grid
  const getArtworkAtPosition = useCallback((position: number): Artwork | null => {
    if (!exhibition?.artworkPositions || !exhibition?.artworks) return null;

    const artworkPosition = exhibition.artworkPositions.find(
      pos => pos.positionIndex === position
    );
    if (!artworkPosition) return null;

    // Find the artwork in the exhibition's artworks array
    // Ensure the structure matches your context data (e.g., `exhibition.artworks` might be [{ artwork: {...} }, ...])
    const foundExhibitionArtwork = exhibition.artworks.find(
      (exhArt: ExhibitionArtwork) => exhArt.artwork._id === artworkPosition.artworkId
    );
    return foundExhibitionArtwork?.artwork || null;

  }, [exhibition?.artworkPositions, exhibition?.artworks]);


  // Handler to open the modal
  const handlePositionClick = useCallback((position: number) => {
    setSelectedPosition(position);
    setIsArtworkModalOpen(true);
  }, []); // Empty dependency array, relies on useState setters

  // Handler to execute the server action (passed to the modal)
  const handleConfirmArtworkSelection = useCallback((artwork: Artwork, position: number) => {
    if (!exhibitionId || !exhibition) return; // Guard clause

    // Filter out any existing entry for the same position before adding the new one
    const updatedPositions = (exhibition.artworkPositions || []).filter(
        p => p.positionIndex !== position
    );

    updatedPositions.push({
        artworkId: artwork._id,
        positionIndex: position
    });

    executePlacement({
      id: exhibitionId,
      data: {
        artworkPositions: updatedPositions,
      }
    });
  }, [exhibitionId, exhibition, executePlacement]); // Dependencies

  // Handle loading state for the entire exhibition data
  // if (isLoadingExhibition) {
  //    return (
  //       <div className="flex justify-center items-center min-h-screen">
  //           <Loader2 className="w-12 h-12 animate-spin text-primary" />
  //       </div>
  //    );
  // }

  // Handle case where exhibition data failed to load or doesn't exist
  if (!exhibition) {
      return (
          <div className="max-w-7xl mx-auto px-4 py-8 text-center">
             <p className="text-destructive">{t('error_loading_exhibition')}</p>
             {/* Optionally add a button to retry or go back */}
          </div>
      );
  }

  // Prepare translations for the modal
  const modalTranslations = {
    select_artwork_for_position: t("select_artwork_for_position"),
    no_artworks_found: t("no_artworks_found"),
    create_artwork: t("create_artwork"),
    cancel: t("cancel"),
    place_artwork: t("place_artwork"),
    placing: t("placing"),
  };


  return (
    <div className='max-w-7xl mx-auto px-4 py-8 space-y-8'>
      {/* Header Component */}
      <ExhibitionInfoHeader
        title={t("artworks")}
        description={t("artworks_description")}
        faqLinkText={t("read_faq")}
      />

      {/* Wrap FloorPlan and Grid in a container if needed */}
      <div className='bg-white rounded-lg shadow-md'>
         {/* Floor Plan Component */}
        <ExhibitionFloorPlan
          // Pass the correct image URL from gallery template or context
          imageUrl={exhibition.gallery?.planImage || 'https://res.cloudinary.com/djvlldzih/image/upload/v1739374668/gallery/modern_c1_plan.png'}
          altText={t("floor_plan_alt")} // Add translation for alt text
          title={t("floor_plan")}
          description={t("floor_plan_description")}
        />

        {/* Artwork Positions Grid Component */}
        <div className='p-6'> {/* Added padding around the grid component */}
            <ArtworkPositionsGrid
                positions={positions}
                occupiedPositions={occupiedPositions}
                getArtworkAtPosition={getArtworkAtPosition}
                onPositionClick={handlePositionClick}
                title={t("artwork_positions")}
                artworksLabel={t("artworks")} // Pass plural label
            />
        </div>
      </div>


      {/* Artwork Selection Modal Component */}
      <ArtworkSelectionModal
        isOpen={isArtworkModalOpen}
        onOpenChange={setIsArtworkModalOpen}
        position={selectedPosition}
        onConfirm={handleConfirmArtworkSelection}
        isPlacingArtwork={isPlacingArtwork}
        t={modalTranslations}
      />
    </div>
  );
}