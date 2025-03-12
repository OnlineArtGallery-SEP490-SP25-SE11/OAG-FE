// app/[locale]/exhibitions/templates/[id]/edit/page.tsx - Server Component
import { Suspense } from 'react';
import { getGalleryTemplate } from '@/service/gallery';
import EditGalleryContent from './edit-gallery-content';
import { Loader } from '../../../components/gallery-loader';

export default async function EditGalleryTemplatePage({
  params
}: {
  params: { locale: string; id: string }
}) {
  // Fetch template data on the server
  const templateData = await getGalleryTemplate(params.id);
  
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader />
      </div>
    }>
      <EditGalleryContent 
        initialTemplate={templateData} 
        locale={params.locale} 
        templateId={params.id} 
      />
    </Suspense>
  );
}