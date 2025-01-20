// app/blogs/[blogId]/draft/page.tsx
import { DraftBlogForm } from '../draft-blog-form';
import { notFound } from 'next/navigation';
import PreviewButton from '../preview-button';
import PublicButton from '../public-button';
import { getCurrentUser } from '@/lib/session';
import { getBlogById } from '@/service/blog';

export default async function DraftPage({
	params
}: {
	params: { blogId: string };
}) {
	const { blogId } = params;
	const user = await getCurrentUser();

<<<<<<< HEAD:src/app/(seo)/[locale]/blogs/[blogId]/page.tsx
	if (!user) {
		notFound();
	}
	const post = await getBlogById(blogId);

	if (!post || post.userId !== user.id) {
		notFound();
	}

	return (
		<>
			<div className='flex items-center justify-between mb-4'>
				<div className='flex space-x-4'>
					<PreviewButton blog={post} />
					{
						<PublicButton
							blogId={blogId}
							initialPublishedState={post.published}
						/>
					}
				</div>
			</div>

			<div className=''>
				<DraftBlogForm
					content={post.content}
					_id={blogId}
					blogTitle={post.title}
					isAdminOrAuthor={!!user}
				/>
			</div>
		</>
	);
=======
  if (!user) {
    notFound();
  }
  const blog = await getBlogById(blogId);

  if (!blog || blog.author !== user.id) {
    notFound();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4">
          <PreviewButton blog={blog} />
          {
            <PublicButton
              blogId={blogId}
              initialPublishedState={blog.published}
            />
          }
        </div>
      </div>

      <div className="">
        <DraftBlogForm
          content={blog.content}
          _id={blogId}
          blogTitle={blog.title}
          isAdminOrAuthor={!!user}
        />
      </div>
    </>
  );
>>>>>>> f3bc7fd92dfc4be83c157135cf6de621c8ab4478:src/app/(seo)/[locale]/my-blogs/[blogId]/page.tsx
}
