'use server';

import { authenticatedAction } from '@/lib/safe-action';
import { deleteBlogUseCase } from '@/use-cases/blogs';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export const deleteBlogAction = authenticatedAction
	.createServerAction()
	.input(
		z.object({
			blogId: z.number()
		})
	)
	.handler(async ({ input, ctx }) => {
		const blogId = input.blogId;
		await deleteBlogUseCase(blogId);
		redirect('/blogs/dashboard/posts');
	});
