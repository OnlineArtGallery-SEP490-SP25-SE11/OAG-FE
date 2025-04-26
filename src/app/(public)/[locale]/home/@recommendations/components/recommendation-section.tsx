// --- Ensure this file is a Client Component ---
'use client'; // Required for hooks used by Carousel (useState, useRef, useEffect)

import React from 'react'; // Import React for useRef (implicitly used by Carousel)
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Artwork } from '@/types/marketplace'; // Assuming Artwork type definition exists

// --- Import ShadCN Carousel Components ---
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Link from 'next/link';
import { vietnamCurrency } from '@/utils/converters';

// Define a basic Artwork type if not already defined elsewhere
// interface Artwork {
//     _id: string;
//     title: string;
//     url: string;
//     artistId?: { name: string }; // Optional artist details
//     price: number;
//     dimensions?: { width: number; height: number }; // Optional dimensions
// }

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
    // No changes needed here, it correctly passes props down
    return (
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
                        <ArtworkGrid artworks={followingArtworks} emptyMessage="No new works from artists you follow yet." />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}

// --- ArtworkGrid Refactored with ShadCN Carousel ---
interface ArtworkGridProps {
    artworks: Artwork[];
    emptyMessage?: string; // Optional custom message for empty state
}

function ArtworkGrid({ artworks, emptyMessage = "No artworks to display." }: ArtworkGridProps) {
    // Handle Empty State - remains the same
    if (!artworks || artworks.length === 0) {
        return (
            <div className="flex items-center justify-center py-12 text-center">
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    // CalculateSize function remains the same
    const calculateSize = (originalWidth: number, originalHeight: number) => {
        const MAX_WIDTH = 320;
        const MIN_WIDTH = 200;
        const MAX_HEIGHT = 240;
        const MIN_HEIGHT = 160;

        const w = originalWidth > 0 ? originalWidth : MAX_WIDTH;
        const h = originalHeight > 0 ? originalHeight : MAX_HEIGHT * (MAX_WIDTH / w);

        const aspectRatio = w / h;

        let width = Math.min(w, MAX_WIDTH);
        if (width < MIN_WIDTH) width = MIN_WIDTH;

        let height = Math.round(width / aspectRatio);

        if (height > MAX_HEIGHT) {
            height = MAX_HEIGHT;
            width = Math.round(height * aspectRatio);
        } else if (height < MIN_HEIGHT) {
            height = MIN_HEIGHT;
            width = Math.round(height * aspectRatio);
        }

        width = Math.max(MIN_WIDTH, Math.min(width, MAX_WIDTH));
        height = Math.round(width / aspectRatio);
        height = Math.max(MIN_HEIGHT, Math.min(height, MAX_HEIGHT));

        return { width, height };
    };

    return (
        // Use ShadCN Carousel components
        // Adjust max-w-* as needed for your layout. Carousel needs a constrained width.
        <Carousel
            opts={{
                align: "start", // Align items to the start of the container
                loop: false,      // Don't loop back to the beginning
                // containScroll: "trimSnaps" // Optional: prevent scrolling past the first/last item fully
            }}
            className="w-full relative" // Added relative positioning context if needed, though buttons are siblings now
        >
            <CarouselContent className="-ml-6"> {/* Negative margin to offset padding on items */}
                {artworks.map((artwork, index) => {
                    const originalWidth = artwork.dimensions?.width || 280;
                    const originalHeight = artwork.dimensions?.height || 180;
                    const size = calculateSize(originalWidth, originalHeight);

                    return (
                        // Each artwork is now a CarouselItem
                        <CarouselItem
                            key={artwork._id}
                            className="pl-6 basis-auto"
                            style={{
                                flexGrow: 0,
                                flexShrink: 0,
                            }}
                        >
                            <Link
                                href={`/artworks/${artwork._id}`}
                                className="block group"
                            >
                                <div
                                    className="flex flex-col"
                                    style={{
                                        width: `${size.width}px`,
                                        height: 'fit-content'
                                    } as React.CSSProperties}
                                >
                                    <div
                                        className="relative rounded-lg overflow-hidden bg-gray-200"
                                        style={{ height: `${size.height}px` }}
                                    >
                                        {artwork.url ? (
                                            <Image
                                                src={artwork.url}
                                                alt={artwork.title || 'Artwork'}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                sizes={`${size.width}px`}
                                                priority={index < 3}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3 min-h-[4.5rem] flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {artwork.title || 'Untitled'}
                                            </h3>
                                            {artwork.artistId?.name && (
                                                <p className="text-sm text-gray-500 mt-0.5">{artwork.artistId.name}</p>
                                            )}
                                        </div>
                                        {typeof artwork.price === 'number' && (
                                            <p className="text-sm font-medium text-gray-900 mt-1">
                                                {vietnamCurrency(artwork.price)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </CarouselItem>
                    );
                })}
            </CarouselContent>
            {/* Use built-in Carousel navigation buttons */}
            {/* These are automatically positioned and only show when needed */}
            <CarouselPrevious className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
    );
}

// --- Remove the old NavigationButtons component ---
// function NavigationButtons() { ... } // This is no longer needed