'use client';

import { useState, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { useServerAction } from 'zsa-react';

import { updateExhibitionAction } from '../../actions';
import { useExhibition } from '../../context/exhibition-provider';

// Import the components
import { ExhibitionInfoHeader } from './_components/exhibition-info-header';
import { ExhibitionFloorPlan } from './_components/exhibition-floor-plan';
import { ArtworkPositionsGrid } from './_components/artwork-positions-grid';
import { ArtworkSelectionModal } from './_components/artwork-selection-modal';

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

export default function ArtworksPage() {
  const { id: exhibitionId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const t = useTranslations("exhibitions");
  const tCommon = useTranslations("common");

  // Use the exhibition context
  const { exhibition, refreshExhibition } = useExhibition();

  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const [existingArtworkPosition, setExistingArtworkPosition] = useState<ArtworkPosition | null>(null);

  // Server action hook
  const { execute: executePlacement, isPending: isPlacingArtwork } = useServerAction(updateExhibitionAction, {
    onSuccess: () => {
      toast({
        title: tCommon("success"),
        description: existingArtworkPosition
          ? (selectedArtwork === null 
              ? t("artwork_removed_success") 
              : t("artwork_replaced_success"))
          : t("artwork_placed_success"),
        variant: "success"
      });
      setIsArtworkModalOpen(false);
      setSelectedPosition(null);
      setExistingArtworkPosition(null);
      refreshExhibition();
    },
    onError: (error) => {
      toast({
        title: tCommon("error"),
        description: error.err.message || t("artwork_operation_failed"),
        variant: "destructive"
      });
      console.error('Error with artwork operation:', error);
    },
  });

  // Memoize calculation of positions
  const positions = useMemo(() => {
    const totalPositions = exhibition?.gallery?.artworkPlacements?.length || 68;
    return Array.from({ length: totalPositions }, (_, i) => i + 1);
  }, [exhibition?.gallery?.artworkPlacements]);

  // Track the selected artwork (for state reference)
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  // Handler to open the modal
  const handlePositionClick = useCallback((position: number) => {
    // Check if position already has artwork
    const existingPosition = exhibition?.artworkPositions?.find(
      p => p.positionIndex === position
    ) || null;
    
    setExistingArtworkPosition(existingPosition);
    setSelectedPosition(position);
    setIsArtworkModalOpen(true);
  }, [exhibition?.artworkPositions]);

  // Handler to execute the server action
  const handleConfirmArtworkSelection = useCallback((artwork: Artwork | null, position: number) => {
    if (!exhibitionId || !exhibition) return;
    setSelectedArtwork(artwork);

    // Filter out any existing entry for the same position
    const updatedPositions = (exhibition.artworkPositions || [])
      .filter(p => p.positionIndex !== position)
      .map(p => ({
        artwork: p.artwork._id,
        positionIndex: p.positionIndex
      }));

    // Only add the new position if we're not removing
    if (artwork) {
      updatedPositions.push({
        artwork: artwork._id,
        positionIndex: position
      });
    }

    executePlacement({
      id: exhibitionId,
      data: {
        artworkPositions: updatedPositions,
      }
    });
  }, [exhibitionId, exhibition, executePlacement]);

  // Handle case where exhibition data failed to load
  if (!exhibition) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-destructive">{t('error_loading_exhibition')}</p>
      </div>
    );
  }

  // Prepare translations for the modal
  const modalTranslations = {
    select_artwork_for_position: t("select_artwork_for_position"),
    replace_artwork_at_position: t("replace_artwork_at_position"),
    remove_artwork_confirmation: t("remove_artwork_confirmation"),
    no_artworks_found: t("no_artworks_found"),
    create_artwork: t("create_artwork"),
    cancel: t("cancel"),
    place_artwork: t("place_artwork"),
    replace_artwork: t("replace_artwork"),
    remove_artwork: t("remove_artwork"),
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

      {/* Container */}
      <div className='bg-white rounded-lg shadow-md'>
        {/* Floor Plan Component */}
        <ExhibitionFloorPlan
          imageUrl={exhibition.gallery?.planImage || 'https://res.cloudinary.com/djvlldzih/image/upload/v1739374668/gallery/modern_c1_plan.png'}
          altText={t("floor_plan_alt")}
          title={t("floor_plan")}
          description={t("floor_plan_description")}
        />

        {/* Artwork Positions Grid Component */}
        <div className='p-6'>
          <ArtworkPositionsGrid
            positions={positions}
            artworkPositions={exhibition.artworkPositions || []}
            onPositionClick={handlePositionClick}
            title={t("artwork_positions")}
            artworksLabel={t("artworks")}
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
        existingArtworkPosition={existingArtworkPosition}
        t={modalTranslations}
      />
    </div>
  );
}