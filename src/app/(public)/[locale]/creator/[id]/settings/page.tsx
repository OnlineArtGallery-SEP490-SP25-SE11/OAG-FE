'use client';

import { Settings2 } from 'lucide-react';
import { LanguageSettings } from './_components/language-settings';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const t = useTranslations('exhibitions');
  
  return (
    <div className='max-w-5xl mx-auto'>
      {/* Header Section */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-4 flex items-center gap-2'>
          <Settings2 className='w-8 h-8' />
          {t('settings')}
        </h1>
        <p className='text-muted-foreground'>
          {t('settings_description')}
        </p>
      </div>

      <div className='grid gap-8'>
        {/* Language Settings Component */}
        <LanguageSettings />
        
        {/* <AppearanceSettings /> */}
        {/* <VisibilitySettings /> */}
        {/* <AdvancedSettings /> */}
      </div>
    </div>
  );
}