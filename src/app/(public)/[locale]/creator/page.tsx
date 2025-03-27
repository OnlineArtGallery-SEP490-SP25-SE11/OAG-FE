// app/creator/page.tsx
import { Suspense } from 'react';
import ExhibitionGrid from './components/exhibition-grid';
import CreateExhibitionButton from './components/create-exhibition-button';
import LoadingExhibitions from './components/exhibition-loading';

export default function CreatorPage({params }: {params: { locale: string }}) {

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Exhibitions</h1>
        <CreateExhibitionButton />
      </div>

      <Suspense fallback={<LoadingExhibitions />}>
        <ExhibitionGrid locale={params.locale}  />
      </Suspense>
    </div>
  );
}