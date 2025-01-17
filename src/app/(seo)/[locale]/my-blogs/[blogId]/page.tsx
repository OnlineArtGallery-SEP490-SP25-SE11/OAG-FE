// app/blogs/[blogId]/draft/page.tsx
import { DraftBlogForm } from "../draft-blog-form";
import { notFound } from "next/navigation";
import PreviewButton from "../preview-button";
import PublicButton from "../public-button";
import { getCurrentUser } from "@/lib/session";
import { getBlogById } from "@/service/blog";

export default async function DraftPage({
  params,
}: {
  params: { blogId: string };
}) {
  const { blogId } = params;
  const user = await getCurrentUser();

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
}
