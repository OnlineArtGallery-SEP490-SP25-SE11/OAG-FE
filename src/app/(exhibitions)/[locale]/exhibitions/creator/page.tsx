'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import GalleryTemplateCreator from './gallery-template-creator';
import { Loader } from '../components/gallery-loader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { type GalleryTemplateData } from './gallery-template-creator';
import { saveGalleryTemplateAction } from './actions';
import { useServerAction } from 'zsa-react';

export default function GalleryCreatorPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'edit' | 'preview'>('edit');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [savedTemplate, setSavedTemplate] = useState<GalleryTemplateData | null>(null);

  const { execute, isPending } = useServerAction(saveGalleryTemplateAction, {
    onError: (err) => {
      toast({
        title: 'Error',
        description: err.err.message,
        variant: 'error'
      })
    },
    onSuccess: (result) => {
      const templateData = result.data;
      setSavedTemplate(templateData);
      console.log('Saved template:', templateData);
      // Navigate to the template management page or display success
      // if (!templateData.id) { // If this was a new template
      //   // router.push(`/${params.locale}/exhibitions/templates/${templateData.id}`);
      // }
      toast({
        title: 'Gallery template saved',
        description: 'Your gallery template has been saved successfully.',
        variant: 'success'
      })
    }
  })
  // Handler for saving the template
  const handleSaveTemplate = async (templateData: GalleryTemplateData) => {
      const finalTemplateData = { ...templateData };
      console.log('Saving gallery template:', finalTemplateData);
      await execute(finalTemplateData);

  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header bar with navigation and actions */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="container flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Create Gallery Template</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/${params.locale}/exhibitions/templates`)}
            >
              Cancel
            </Button>
            
            <Button 
              onClick={() => {
                // This is a placeholder - the actual save happens in GalleryTemplateCreator
                // We'll need to expose an onSave callback to connect these components
                toast({
                  title: "Gallery template saved",
                  description: "Your gallery template has been saved successfully.",
                });
              }} 
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Template
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content with Tabs */}
      <div className="flex-grow">
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'edit' | 'preview')}>
          <div className="container mt-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="edit">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>

          <Suspense fallback={<div className="h-[calc(100vh-8rem)] flex items-center justify-center"><Loader /></div>}>
            <TabsContent value="edit" className="mt-0">
              <div className=" py-6">
                <GalleryTemplateCreator onSave={handleSaveTemplate} />
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0">
              <div className="h-[calc(100vh-8rem)] bg-gray-900">
                {/* Full preview mode with player controls */}
                {/* This would be similar to your exhibition view but in a template preview mode */}
                <div className="flex items-center justify-center h-full text-white">
                  <div className="text-center">
                    <p className="text-lg">Preview mode will be available soon</p>
                    <p className="text-sm text-gray-400 mt-2">Use the editor to see your gallery template in 3D</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Suspense>
        </Tabs>
      </div>
    </div>
  );
}