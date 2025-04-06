import { z } from 'zod';
import { useTranslations } from 'next-intl';

export const useEditProfileSchema = () => {
 const t = useTranslations('profile.edit.validation');

 const editProfileSchema = z.object({
  name: z.string()
   .min(2, { message: t('name_min_length') })
   .max(50, { message: t('name_max_length') }),
  address: z.string().optional(),
  bio: z.string()
   .max(1000, { message: t('bio_max_length') })
   .optional(),
  genres: z.array(z.string())
   .max(10, { message: t('max_genres') })
 });

 return { editProfileSchema };
}; 