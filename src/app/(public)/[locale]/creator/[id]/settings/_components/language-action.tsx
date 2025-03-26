'use client';

import { MoreHorizontal, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageActionProps {
  isDefault: boolean;
  onSetDefault: () => void;
  onDelete: () => void;
}

export function LanguageAction({ isDefault, onSetDefault, onDelete }: LanguageActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='hover:bg-background/80'
        >
          <MoreHorizontal className='w-4 h-4' />
          <span className='sr-only'>Language options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        {!isDefault && (
          <DropdownMenuItem onClick={onSetDefault}>
            <Check className='w-4 h-4 mr-2' />
            Set as default
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className='text-destructive' onClick={onDelete}>
          <Trash2 className='w-4 h-4 mr-2' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}