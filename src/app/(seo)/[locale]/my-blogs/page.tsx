import { getCurrentUser } from '@/lib/session';
import { getLastEditedBlogId } from '@/service/blog';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function BlogsPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<BlogContent />
		</Suspense>
	);
}

async function BlogContent() {
	const user = await getCurrentUser();
	if (!user) redirect('/');

<<<<<<< HEAD:src/app/(seo)/[locale]/blogs/page.tsx
	const lastBlogId = await getLastEditedBlogId(user.accessToken);
	if (lastBlogId) redirect(`/blogs/${lastBlogId}`);
=======
  const lastBlogId = await getLastEditedBlogId(user.accessToken);
  if (lastBlogId) redirect(`/my-blogs/${lastBlogId}`);
>>>>>>> 592f1c8501b901be16ad94fdfd08df99a433f9ac:src/app/(seo)/[locale]/my-blogs/page.tsx

	return <div>No blogs </div>;
}
