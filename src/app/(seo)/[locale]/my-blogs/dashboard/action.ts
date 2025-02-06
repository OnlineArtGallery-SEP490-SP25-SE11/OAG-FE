'use server';

<<<<<<< HEAD:src/app/(seo)/[locale]/blogs/dashboard/action.ts
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
=======
import { authenticatedAction } from "@/lib/safe-action";
// import { deleteBlogUseCase } from "@/use-cases/blogs";
import { redirect } from "next/navigation";
import { z } from "zod";

export const deleteBlogAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      blogId: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    // const blogId = input.blogId;
    // await deleteBlogUseCase(blogId);
    console.log("input delete blog", input);
    redirect("/blogs/dashboard/posts");
  });
>>>>>>> 592f1c8501b901be16ad94fdfd08df99a433f9ac:src/app/(seo)/[locale]/my-blogs/dashboard/action.ts
