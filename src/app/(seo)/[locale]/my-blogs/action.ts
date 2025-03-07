'use server';
import { authenticatedAction } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
// import sanitizeHtml from "sanitize-html";
import { InvalidFileError } from '@/lib/errors';
import { validateImage } from '@/lib/utils';
import { createBlog, createPublicRequest, updateBlog } from '@/service/blog';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { BlogStatus } from '@/utils/enums';

export const createBlogAction = authenticatedAction
	.createServerAction()
	.input(
		z.object({
			title: z.string(),
			content: z.string(),
			image: z.instanceof(FormData)
		})
	)
	.handler(async ({ input, ctx }) => {
		const image = input.image.get('file') as File;
		if (!image || !(image instanceof File)) {
			throw new InvalidFileError();
		}
		validateImage(image);
		const { secure_url } = await uploadToCloudinary(image, {
			folder: 'blog'
		});
		const newDraft = await createBlog({
			accessToken: ctx.user.accessToken,
			blogData: {
				title: input.title,
				content: input.content,
				image: secure_url
			}
		});
		revalidatePath(`/blogs/${newDraft._id}`);
		return { id: newDraft._id };
	});

export const updateBlogAction = authenticatedAction
	.createServerAction()
	.input(
		z.object({
			id: z.string(),
			title: z.string().optional(),
			content: z.string().optional(),
			image: z.instanceof(FormData).optional(),
			published: z.boolean().optional(),
			status: z.nativeEnum(BlogStatus).optional() // Changed to enum
		})
	)
	.handler(async ({ input, ctx }) => {
		const updateData: {
			_id: string;
			title?: string;
			content?: string;
			image?: string;
			published?: boolean;
			status?: BlogStatus;
		} = {
			_id: input.id
		};
		if (input.title) updateData.title = input.title;

		if (input.content) {
			updateData.content = input.content;
		}
		if (input.image) {
			const image = input.image.get('file') as File;
			if (!image || !(image instanceof File)) {
				throw new Error('Invalid file');
			}
			validateImage(image);
			const { secure_url } = await uploadToCloudinary(image, {
				folder: 'blog'
			});
			updateData.image = secure_url;
		}
		if (input.published !== undefined)
			updateData.published = input.published;
		if (input.status)
			updateData.status = input.status;
		const updatedBlog = await updateBlog({
			accessToken: ctx.user.accessToken,
			updateData
		});
		revalidatePath(`/blogs/${updatedBlog.id}`);
		return { id: updatedBlog.id };
	});

export const createPublicRequestAction = authenticatedAction
	.createServerAction()
	.input(
		z.object({
			id: z.string()
		})
	)
	.handler(async ({ input, ctx }) => {
		const updatedBlog = await createPublicRequest({
			accessToken: ctx.user.accessToken,
			id: input.id
		});
		revalidatePath(`/blogs/${updatedBlog?._id}`);
		return updateBlog;
	}
);

export const cancelPublicRequestAction = authenticatedAction
	.createServerAction()
	.input(
		z.object({
			id: z.string()
		})
	)
	.handler(async ({ input, ctx }) => {
		const updatedBlog = await updateBlog({
			accessToken: ctx.user.accessToken,
			updateData: { _id: input.id, status: BlogStatus.DRAFT }
		});
		revalidatePath(`/blogs/${updatedBlog.id}`);
		return { id: updatedBlog.id };
});
// export const publishBlogAction = authenticatedAction
// 	.createServerAction()
// 	.input(
// 		z.object({
// 			_id: z.string()
// 		})
// 	)
// 	.handler(async ({ input, ctx }) => {
// 		const updatedBlog = await updateBlog({
// 			accessToken: ctx.user.accessToken,
// 			updateData: { _id: input._id, published: true }
// 		});
// 		revalidatePath(`/blogs/${updatedBlog._id}`);
// 		return { id: updatedBlog.id };
// 	});

// export const unpublishBlogAction = authenticatedAction
// 	.createServerAction()
// 	.input(
// 		z.object({
// 			_id: z.string()
// 		})
// 	)
// 	.handler(async ({ input, ctx }) => {
// 		const updatedBlog = await updateBlog({
// 			accessToken: ctx.user.accessToken,
// 			updateData: { _id: input._id, published: false }
// 		});
// 		revalidatePath(`/blogs/${updatedBlog._id}`);
// 		return { id: updatedBlog.id };
// 	});
