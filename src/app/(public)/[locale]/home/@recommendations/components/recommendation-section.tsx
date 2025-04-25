import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Artwork } from '@/types/marketplace';
interface RecommendationSectionProps {
    recommendedArtworks: Artwork[];
    followingArtworks: Artwork[];
    isAuthenticated: boolean;
}

export function RecommendationSection({
    recommendedArtworks,
    followingArtworks,
    isAuthenticated
}: RecommendationSectionProps) {
    return (
        <section className="py-24 bg-gray-50">
            <div className="w-full mx-auto px-4">
                <Tabs defaultValue="forYou" className="space-y-8">
                    <div className="flex items-center justify-between">
                        <TabsList className="bg-transparent border">
                            <TabsTrigger value="forYou" className="data-[state=active]:bg-white">
                                New Works for You
                            </TabsTrigger>
                            {isAuthenticated && (
                                <TabsTrigger value="following" className="data-[state=active]:bg-white">
                                    New Works by Artists You Follow
                                </TabsTrigger>
                            )}
                        </TabsList>
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                            View All
                        </Button>
                    </div>

                    <TabsContent value="forYou" className="mt-0">
                        <ArtworkGrid artworks={recommendedArtworks} />
                    </TabsContent>

                    {isAuthenticated && (
                        <TabsContent value="following" className="mt-0">
                            <ArtworkGrid artworks={followingArtworks} />
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </section>
    );
}
function ArtworkGrid({ artworks }: { artworks: Artwork[] }) {
    const calculateSize = (originalWidth: number, originalHeight: number) => {
        const MAX_WIDTH = 320;
        const MIN_WIDTH = 200;
        const MAX_HEIGHT = 240;
        const MIN_HEIGHT = 160;

        // Calculate aspect ratio
        const aspectRatio = originalWidth / originalHeight;

        // Start with original width, constrained to MAX_WIDTH
        let width = Math.min(originalWidth, MAX_WIDTH);

        // If width is too small, set to MIN_WIDTH
        if (width < MIN_WIDTH) {
            width = MIN_WIDTH;
        }

        // Calculate height maintaining aspect ratio
        let height = Math.round(width / aspectRatio);

        // Adjust if height is outside bounds
        if (height > MAX_HEIGHT) {
            height = MAX_HEIGHT;
            width = Math.round(height * aspectRatio);
        } else if (height < MIN_HEIGHT) {
            height = MIN_HEIGHT;
            width = Math.round(height * aspectRatio);
        }

        // Final check for width constraints
        width = Math.max(MIN_WIDTH, Math.min(width, MAX_WIDTH));

        return { width, height };
    };

    return (
        <div className="relative group">
            <div className="overflow-x-auto no-scrollbar">
                <div className="flex gap-6 min-w-max pb-4">
                    {artworks.map((artwork) => {
                        const originalWidth = artwork.dimensions?.width || 280;
                        const originalHeight = artwork.dimensions?.height || 180;
                        const size = calculateSize(originalWidth, originalHeight);

                        return (
                            <div
                                key={artwork._id}
                                className="group w-[var(--artwork-width)] flex flex-col"
                                style={{
                                    '--artwork-width': `${size.width}px`,
                                    height: 'fit-content'
                                } as React.CSSProperties}
                            >
                                <div
                                    className="relative rounded-lg overflow-hidden"
                                    style={{ height: `${size.height}px` }}
                                >
                                    <Image
                                        src={artwork.url}
                                        alt={artwork.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        sizes={`${size.width}px`}
                                    />
                                </div>
                                <div className="mt-3 min-h-[4.5rem] flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {artwork.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-0.5">{artwork.artistId?.name}</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        ${artwork.price.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <NavigationButtons />
        </div>
    );
}

function NavigationButtons() {
    return (
        <>
            <button className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full 
                      bg-white/80 hover:bg-white flex items-center justify-center shadow-lg 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full 
                      bg-white/80 hover:bg-white flex items-center justify-center shadow-lg 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ChevronRight className="w-6 h-6" />
            </button>
        </>
    );
}