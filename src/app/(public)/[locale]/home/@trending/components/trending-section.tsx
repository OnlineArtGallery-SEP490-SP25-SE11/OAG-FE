import Image from 'next/image';
import Link from 'next/link';
import { TrendingArtist } from '../page';

export default async function TrendingSection({ artists} : { artists: TrendingArtist[] }) {

  return (
    <section className="py-24 bg-white">
      <div className="w-full mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Trending Artists
          </h2>
          <Link
            href="/artists"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {artists.map((artist: TrendingArtist) => (
            <Link 
              key={artist._id} 
              href={`/artists/${artist._id}`}
              className="group block"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {artist.name}
              </h3>
              <p className="text-sm text-gray-500">
                 {artist.followersCount} followers
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}