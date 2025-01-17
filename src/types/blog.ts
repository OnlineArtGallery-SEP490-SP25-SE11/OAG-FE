import { z } from 'zod';

export const blogSchema = z.object({
	_id: z.string(),
	title: z.string(),
	content: z.string(),
	image: z.string(),
	published: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date()
});

export type Blog = z.infer<typeof blogSchema>;
