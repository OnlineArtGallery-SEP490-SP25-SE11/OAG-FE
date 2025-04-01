import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import ExhibitionGrid from './components/exhibition-grid';
import CreateExhibitionButton from './components/create-exhibition-button';
import LoadingExhibitions from './components/exhibition-loading';

export default async function CreatorPage({ params }: { params: { locale: string }}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'exhibitions' });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('my_exhibitions')}</h1>
        <CreateExhibitionButton />
      </div>

      <Suspense fallback={<LoadingExhibitions />}>
        <ExhibitionGrid locale={params.locale} />
      </Suspense>
    </div>
  );
}