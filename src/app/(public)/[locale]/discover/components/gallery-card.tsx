import { Card } from '@/components/ui/card';
import { Heart, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface Gallery {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  category: string;
  description: string;
  likes: number;
  views: number;
  featured: boolean;
  tags: string[];
}

interface GalleryCardProps {
  gallery: Gallery;
}

export function GalleryCard({ gallery }: GalleryCardProps) {
  return (
    <Card className='group overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm'>
      <div className='relative aspect-[4/3]'>
        <Image
          src={gallery.thumbnail}
          alt={gallery.title}
          fill
          className='object-cover transition-transform duration-500 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
        {gallery.featured && (
          <Badge className='absolute top-4 right-4 bg-white/90 text-primary hover:bg-white'>
            Featured
          </Badge>
        )}
        <div className='absolute bottom-4 left-4 right-4'>
          <p className='text-sm text-white/80'>{gallery.category}</p>
          <h3 className='text-xl font-semibold text-white mb-1'>{gallery.title}</h3>
          <p className='text-sm text-white/90'>by {gallery.author}</p>
        </div>
      </div>
      <div className='p-4 flex flex-col flex-grow'>
        <div className='flex-grow'>
          <p className='text-gray-600 line-clamp-2'>{gallery.description}</p>
        </div>
        <div className='flex items-center justify-between text-sm text-gray-600 mt-4'>
          <div className='flex items-center gap-4'>
            <span className='flex items-center gap-1'>
              <Heart className='w-4 h-4' /> {gallery.likes}
            </span>
            <span className='flex items-center gap-1'>
              <Eye className='w-4 h-4' /> {gallery.views}
            </span>
          </div>
          {/* <div className='flex gap-2 flex-wrap'>
            {gallery.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className='bg-gray-100'>
                {tag}
              </Badge>
            ))}
          </div> */}
        </div>
      </div>
    </Card>
  );
}