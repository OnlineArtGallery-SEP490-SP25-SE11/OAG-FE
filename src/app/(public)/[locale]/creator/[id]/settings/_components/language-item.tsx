'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Check, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LanguageOption } from '@/types/exhibition';

interface LanguageItemProps {
  language: LanguageOption;
  onSetDefault: (code: string) => Promise<void>;
  onDelete: (code: string) => Promise<void>;
  disabled?: boolean;
}

export function LanguageItem({ language, onSetDefault, onDelete, disabled = false }: LanguageItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('exhibitions');
  
  const handleSetDefault = async () => {
    try {
      setIsLoading(true);
      await onSetDefault(language.code);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await onDelete(language.code);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className='flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors'>
      <div className='flex items-center gap-4'>
        <span className='text-lg font-medium min-w-[2.5rem]'>
          {language.code.toUpperCase()}
        </span>
        <span>{language.name}</span>
        {language.isDefault && (
          <span className='text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium'>
            {t('default')}
          </span>
        )}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='hover:bg-background/80'
            disabled={isLoading || disabled}
          >
            <MoreHorizontal className='w-4 h-4' />
            <span className='sr-only'>{t('language_options')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
          {!language.isDefault && (
            <DropdownMenuItem onClick={handleSetDefault} disabled={isLoading}>
              <Check className='w-4 h-4 mr-2' />
              {t('set_as_default')}
            </DropdownMenuItem>
          )}
          
          {!language.isDefault && (
            <DropdownMenuItem 
              className='text-destructive' 
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className='w-4 h-4 mr-2' />
              {t('delete')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}