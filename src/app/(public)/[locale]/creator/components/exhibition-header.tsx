'use client'
import { useTranslations } from 'next-intl';
import { formatDate } from '@/lib/utils';
import { Exhibition } from '@/types/exhibition';
import { Calendar } from 'lucide-react';

export default function ExhibitionHeader({ exhibition }: { exhibition: Exhibition }) {

  const t = useTranslations('exhibitions');
    return (
        <div className="px-6 py-4 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-end">
            
            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-1" />
                <span>
                  {exhibition.startDate && formatDate(new Date(exhibition.startDate))}
                  {exhibition.endDate && ` - ${formatDate(new Date(exhibition.endDate))}`}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    exhibition.status === 'PUBLISHED' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {exhibition.status === 'PUBLISHED' ? t('published') : t('draft')}
                  </span>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      );

}