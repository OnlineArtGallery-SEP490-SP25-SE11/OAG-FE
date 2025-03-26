'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import {  Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

// List of available languages that could be added
const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'fr', name: 'French' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
] as const;

interface AddLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLanguage: (code: string, name: string) => Promise<void>;
  existingLanguageCodes: string[];
}

export function AddLanguageModal({ 
  isOpen, 
  onClose,
  onAddLanguage,
  existingLanguageCodes 
}: AddLanguageModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations('exhibitions');

  // Filter out languages that are already added
  const availableOptions = availableLanguages.filter(
    lang => !existingLanguageCodes.includes(lang.code)
  );
  
  const handleSubmit = async () => {
    if (!selectedLanguage) return;
    
    try {
      setIsSubmitting(true);
      const selectedOption = availableLanguages.find(lang => lang.code === selectedLanguage);
      if (selectedOption) {
        await onAddLanguage(selectedOption.code, selectedOption.name);
        setSelectedLanguage('');
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('add_language')}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="language">{t('select_language')}</Label>
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
              disabled={isSubmitting || availableOptions.length === 0}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder={t('select_language_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {availableOptions.length > 0 ? (
                  availableOptions.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name} ({lang.code.toUpperCase()})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    {t('no_languages_available')}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedLanguage || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('adding')}
              </>
            ) : (
              t('add')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}