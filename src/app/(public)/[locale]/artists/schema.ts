import { z } from 'zod';

export const artworkFormSchema = (t: (key: string) => string) => {
	return z.object({
		title: z.string().min(1, { message: t('validation.titleRequired') }),
		description: z
			.string()
			.min(10, { message: t('validation.descriptionMinLength') }),
		categories: z
			.array(z.string())
			.min(1, { message: t('validation.categoryRequired') }),
		width: z.string().min(1, { message: t('validation.widthRequired') }),
		height: z.string().min(1, { message: t('validation.heightRequired') }),
		price: z.number().min(0, { message: t('validation.priceRequired') }),
		status: z.enum(['Available', 'Sold', 'Hidden', 'Selling'], {
			required_error: t('validation.statusRequired')
		}),
		imageUrl: z.string().optional()
	});
};
export const artworkFormUpdateSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	status: z.enum(['Available', 'Sold', 'Hidden', 'Selling']).optional(),
	price: z.number().min(0, 'Price must be a positive number').optional(),
});
export type ArtworkFormData = z.infer<ReturnType<typeof artworkFormSchema>>;

