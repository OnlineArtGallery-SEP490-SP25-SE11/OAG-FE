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

  const lastBlogId = await getLastEditedBlogId(user.accessToken);
  if (lastBlogId) redirect(`/my-blogs/${lastBlogId}`);

	return <div>No blogs </div>;
}
