import { getExhibitionById } from "@/service/exhibition";
import { ArtworksContent } from './_components/artworks-content';

export default async function ArtworksPage({
  params
}: {
  params: { id: string; locale: string }
}) {
  // Fetch exhibition data directly on server
  const res = await getExhibitionById(params.id);
  
  const exhibition = res.data?.exhibition;
  
  if (!exhibition) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-destructive">Error loading exhibition settings</p>
      </div>
    );
  }
  // Calculate positions on server
  const totalPositions = exhibition?.gallery?.artworkPlacements?.length || 68;
  const positions = Array.from({ length: totalPositions }, (_, i) => i + 1);

  if (!exhibition) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-destructive">Error loading exhibition</p>
      </div>
    );
  }

  return (
    <ArtworksContent
      exhibition={exhibition}
      positions={positions}
    />
  );
}