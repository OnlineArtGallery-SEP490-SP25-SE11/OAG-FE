'use client';

import { LanguageSettings } from './_components/language-settings';
import { useTranslations } from 'next-intl';
import { ExhibitionInfoHeader } from '../artworks/_components/exhibition-info-header';

export default function SettingsPage() {
  const t = useTranslations('exhibitions');
  
  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      {/* Header Section */}
      <ExhibitionInfoHeader
        title={t('settings')}
        description={t('settings_description')}
        faqLinkText={t('read_faq')}
      />

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