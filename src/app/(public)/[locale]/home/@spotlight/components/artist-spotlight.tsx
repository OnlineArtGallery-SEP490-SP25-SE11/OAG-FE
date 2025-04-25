import { createExcerpt } from '@/app/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export interface Artist {
    _id: string;
    name: string;
    image: string;
    // specialty: string;
    // experience: number;
    artworksCount: number;
    exhibitionsCount: number;
    bio: string;
    featuredWorks: {
        _id: string;
        title: string;
        createdAt: string;
        url: string;
    }[];

}


interface ArtistSpotlightProps {
    artist: Artist;
}

export function ArtistSpotlight({ artist }: ArtistSpotlightProps) {
    return (
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12">Artist Spotlight</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Artist Profile */}
                <div className="space-y-6">
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                        <Image
                            src={artist.image}
                            alt={artist.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold">{artist.name}</h3>
                        {/* <p className="text-gray-600">{artist.specialty}</p> */}
                        <div className="flex items-center gap-4 mt-2">
                            {/* <span className="text-sm text-gray-500">{artist.experience} Years Experience</span> */}
                            <span className="text-sm text-gray-500">{artist.artworksCount}+ Artworks</span>
                            <span className="text-sm text-gray-500">{artist.exhibitionsCount} Exhibitions</span>
                        </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{createExcerpt(artist.bio)}</p>
                    <Button asChild className="mt-4">
                        <Link href={`/artists/${artist._id}`}>View Full Profile</Link>
                    </Button>
                </div>

                {/* Featured Works */}
                <div className="grid grid-cols-2 gap-4">
                    {artist.featuredWorks.map(work => (
                        <div key={work._id} className="group cursor-pointer">
                            <div className="relative aspect-square rounded-lg overflow-hidden">
                                <Image
                                    src={work.url}
                                    alt={work.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <h4 className="font-medium">{work.title}</h4>
                                        <p className="text-sm text-gray-300">{new Date(work.createdAt).getFullYear()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}