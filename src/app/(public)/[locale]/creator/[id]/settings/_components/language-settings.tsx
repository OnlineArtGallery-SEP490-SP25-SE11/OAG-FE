'use client';

import { useState } from 'react';
import { Globe, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsSection } from './settings-section';
import { LanguageItem } from './language-item';
import { AddLanguageModal } from './add-language-modal';
import { useTranslations } from 'next-intl';
import { useExhibition } from '../../../context/exhibition-provider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export function LanguageSettings() {
  const { exhibition, updateExhibition, isUpdating } = useExhibition();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const t = useTranslations('exhibitions');
  const tCommon = useTranslations('common');
  const { toast } = useToast();

  const handleSetDefault = async (code: string) => {
    try {
      // Create updated language options with the new default
      const updatedLanguageOptions = exhibition.languageOptions.map(lang => ({
        ...lang,
        isDefault: lang.code === code
      }));
      
      await updateExhibition({ languageOptions: updatedLanguageOptions });
      
      toast({
        title: tCommon('success'),
        description: t('default_language_updated'),
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: tCommon('error'),
        description: t('language_update_failed'),
        variant: 'destructive'
      });
      console.error('Error updating default language:', error);
    }
  };
  
  const handleDeleteLanguage = async (code: string) => {
    try {
      // Ensure we don't delete the default language
      const languageToDelete = exhibition.languageOptions.find(lang => lang.code === code);
      if (!languageToDelete || languageToDelete.isDefault) {
        toast({
          title: tCommon('error'),
          description: t('cannot_delete_default_language'),
          variant: 'destructive'
        });
        return;
      }
      
      // Filter out the language to delete
      const updatedLanguageOptions = exhibition.languageOptions.filter(
        lang => lang.code !== code
      );
      
      await updateExhibition({ languageOptions: updatedLanguageOptions });
      
      toast({
        title: tCommon('success'),
        description: t('language_deleted'),
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: tCommon('error'),
        description: t('language_delete_failed'),
        variant: 'destructive'
      });
      console.error('Error deleting language:', error);
    }
  };
  
  const handleAddLanguage = async (code: string, name: string) => {
    try {
      // Ensure the language isn't already added
      if (exhibition.languageOptions.some(lang => lang.code === code)) {
        toast({
          title: tCommon('error'),
          description: t('language_already_exists'),
          variant: 'destructive'
        });
        return;
      }
      
      // Add the new language
      const updatedLanguageOptions = [
        ...exhibition.languageOptions,
        {
          code,
          name,
          isDefault: false
        }
      ];
      
      await updateExhibition({ languageOptions: updatedLanguageOptions });
      
      toast({
        title: tCommon('success'),
        description: t('language_added'),
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: tCommon('error'),
        description: t('language_add_failed'),
        variant: 'destructive'
      });
      console.error('Error adding language:', error);
    }
  };
  
  const existingLanguageCodes = exhibition?.languageOptions?.map(lang => lang.code) || [];
  
  return (
    <>
      <SettingsSection icon={<Globe className='w-6 h-6' />} title={t('languages')}>
        <div className='space-y-4'>
          {exhibition?.languageOptions?.length > 0 ? (
            exhibition.languageOptions.map(language => (
              <LanguageItem 
                key={language.code}
                language={language}
                onSetDefault={handleSetDefault}
                onDelete={handleDeleteLanguage}
                disabled={isUpdating}
              />
            ))
          ) : (
            <Alert>
              <AlertDescription>
                {t('no_languages_configured')}
              </AlertDescription>
            </Alert>
          )}
          
          <Button
            className='w-full mt-4'
            variant='outline'
            size='lg'
            onClick={() => setIsAddModalOpen(true)}
            disabled={isUpdating}
          >
            <Languages className='w-4 h-4 mr-2' />
            {t('add_new_language')}
          </Button>
        </div>
      </SettingsSection>
      
      <AddLanguageModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddLanguage={handleAddLanguage}
        existingLanguageCodes={existingLanguageCodes}
      />
    </>
  );
}