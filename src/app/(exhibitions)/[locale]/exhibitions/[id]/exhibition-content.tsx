'use client';
import { useState } from 'react';
import Exhibition from '../components/exhibition';
import { Button } from '@/components/ui/button';
import { ArrowRight, Share2 } from 'lucide-react';
import Image from 'next/image';
import { ExhibitionType } from '@/types/gallery';

export default function ExhibitionContent({ exhibitionData } : { exhibitionData: ExhibitionType }) {
  const [isStarted, setIsStarted] = useState(false);
  
  if (!isStarted) {
    return (
      <div className='relative h-screen w-full'>
        <div className='absolute inset-0'>
          <Image
            src={exhibitionData.backgroundImage}
            alt='Gallery Background'
            fill
            className='object-cover'
            priority
          />
        </div>

        <div className='relative h-full flex items-center justify-center'>
          <div className='max-w-sm w-full mx-4 bg-white p-8 rounded-3xl shadow'>
            <div className='space-y-8'>
              <div className='relative aspect-video w-full rounded-3xl overflow-hidden'>
                <Image
                  src={exhibitionData.thumbnail}
                  alt={exhibitionData.title}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='space-y-6'>
                <div className='flex justify-between gap-4 text-sm text-gray-600'>
                  <div className='flex items-center gap-1'>
                    <Share2 className='w-4 h-4' />
                  </div>
                  <div className='flex items-center gap-1'>
                    <span>{exhibitionData.date}</span>
                  </div>
                </div>

                <div className='h-px bg-gray-200' />

                <h1 className='text-2xl font-bold text-gray-900'>
                  {exhibitionData.title}
                </h1>

                <p className='text-sm text-gray-600'>
                  {exhibitionData.description}
                </p>

                <Button
                  onClick={() => setIsStarted(true)}
                  className='w-full bg-black rounded-3xl text-white hover:bg-gray-800 py-6'
                >
                  Enter Exhibition
                  <ArrowRight className='w-4 h-4 ml-2' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Exhibition exhibition={exhibitionData} />
    </div>
  );
}