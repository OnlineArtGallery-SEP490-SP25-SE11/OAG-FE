'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { saveGalleryTemplate } from '@/service/gallery';
import { authenticatedAction } from '@/lib/safe-action';

// Define validation schema for gallery template data
const galleryTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  dimensions: z.object({
    xAxis: z.number().min(5, "Width must be at least 5 units"),
    yAxis: z.number().min(5, "Height must be at least 5 units"),
    zAxis: z.number().min(5, "Depth must be at least 5 units")
  }),
  wallThickness: z.number().min(0.1, "Wall thickness must be at least 0.1 units"),
  wallHeight: z.number().min(1, "Wall height must be at least 1 unit"),
  modelPath: z.string().min(1, "Model path is required"),
  modelScale: z.number().min(0.1, "Model scale must be greater than 0"),
  modelRotation: z.tuple([z.number(), z.number(), z.number()]),
  modelPosition: z.tuple([z.number(), z.number(), z.number()]),
  previewImage: z.string().min(1, "Preview image is required"),
  customColliders: z.array(z.any()).optional()
});

export const saveGalleryTemplateAction = authenticatedAction
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
        id: templateData.id || `template_${Date.now()}`,
        customColliders: templateData.customColliders || []
      };

      // Save the template
      const finalTemplateData = await saveGalleryTemplate(savedData);

      // Revalidate related paths
      revalidatePath(`/gallery`);
      if (finalTemplateData.id) {
        revalidatePath(`/gallery/edit/${finalTemplateData.id}`);
      }

      return finalTemplateData;
    } catch (error) {
      console.error('Error saving gallery template:', error);
      throw new Error('Failed to save gallery template');
    }
});