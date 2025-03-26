'use client'
import { useState, useEffect } from 'react';
import { useExhibition } from '../context/exhibition-provider';
import { useTranslations } from 'next-intl';
import { debounce } from 'lodash';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Exhibition } from '@/types/exhibition';

export default function ExhibitionHeader({ exhibition: initialExhibition }: { exhibition: Exhibition }) {

    const { exhibition, isUpdating, updateExhibition } = useExhibition();
    const [name, setName] = useState(initialExhibition.name);
    const t = useTranslations('exhibitions');
    const tCommon = useTranslations('common');

    useEffect(() => {
        setName(initialExhibition.name);
    }, [initialExhibition.name]);

    const debouncedUpdateName = debounce((async (newName: string) => {
        if (newName !== exhibition.name) {
            await updateExhibition({ name: newName });
        }
    }), 1000);

    useEffect(() => {
        return () => {
            debouncedUpdateName.cancel();
        };
    }, [debouncedUpdateName]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        debouncedUpdateName(newName);
    };

    return (
        <div className="border-b px-6 py-4 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <Input
                value={name}
                onChange={handleNameChange}
                className="text-2xl font-bold h-12 bg-transparent border-none focus-visible:ring-1 px-0"
                placeholder={t('exhibition_name')}
              />
            </div>
            
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
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => debouncedUpdateName.flush()}
                  disabled={isUpdating || name === exhibition.name}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {tCommon('saving')}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {tCommon('save')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      );

}