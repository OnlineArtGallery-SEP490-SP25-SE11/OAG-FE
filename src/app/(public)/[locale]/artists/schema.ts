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
		price: z.union([
			z.string().min(1),
			z.number().min(0)
		]).optional().transform(val => typeof val === 'string' && val ? Number(val) : val),
		status: z.enum(['Available', 'Sold', 'Hidden', 'Selling'], {
			required_error: t('validation.statusRequired')
		}),
		imageUrl: z.string().optional()
	});
};
export const artworkFormUpdateSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	status: z.enum(['available', 'sold', 'hidden', 'selling']).optional(),
	price: z.union([
		z.string().min(1),
		z.number().min(0)
	]).optional().transform(val => typeof val === 'string' && val ? Number(val) : val),
});
export type ArtworkFormData = z.infer<ReturnType<typeof artworkFormSchema>>;

