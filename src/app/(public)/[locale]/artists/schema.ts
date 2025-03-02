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
		price: z.string().min(1, { message: t('validation.priceRequired') }),
		status: z.enum(['Available', 'Sold', 'Hidden', 'Selling'], {
			required_error: t('validation.statusRequired')
		}),
		imageUrl: z.string().optional()
	});
};
export type ArtworkFormData = z.infer<ReturnType<typeof artworkFormSchema>>;

