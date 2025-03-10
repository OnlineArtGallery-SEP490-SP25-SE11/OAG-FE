'use server';

import { z } from 'zod';
import { adminOnlyAction } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';
import { saveGalleryTemplate } from '@/service/gallery';

// Define validation schema for gallery template data
const galleryTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  dimensions: z.object({
    xAxis: z.number().min(5),
    yAxis: z.number().min(5),
    zAxis: z.number().min(5)
  }),
  wallThickness: z.number().min(0.1),
  wallHeight: z.number().min(1),
  modelPath: z.string(),
  modelScale: z.number().min(0.1),
  modelRotation: z.tuple([z.number(), z.number(), z.number()]),
  modelPosition: z.tuple([z.number(), z.number(), z.number()]),
  previewImage: z.string(),
  customColliders: z.array(z.any()) // This could be more strictly typed
});

export const saveGalleryTemplateAction = adminOnlyAction
  .createServerAction()
  .input(galleryTemplateSchema)
  .handler(async ({ input, ctx }) => {
    const { user } = ctx;
    console.log('User:', user);
    try {
      // Process the input data
      console.log('Saving gallery template:', input);
      
      // Clone the input data to avoid mutation
      const templateData = { ...input };
      
      const savedData = {
        ...templateData,
        id: templateData.id || `template_${Date.now()}`
      };
      const finalTemplateData = await saveGalleryTemplate(savedData);

      // Revalidate related paths
      revalidatePath(`/exhibitions/templates`);
      if (finalTemplateData.id) {
        revalidatePath(`/exhibitions/templates/${finalTemplateData.id}`);
      }
      
      return savedData;
    } catch (error) {
      console.error('Error saving gallery template:', error);
      throw new Error('Failed to save gallery template');
    }
  });