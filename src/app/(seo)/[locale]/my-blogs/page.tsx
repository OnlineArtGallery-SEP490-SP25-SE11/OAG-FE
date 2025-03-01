import { getCurrentUser } from '@/lib/session';
import { getLastEditedBlogId } from '@/service/blog';
import { Newspaper } from 'lucide-react';
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

	return (
		<div className="flex flex-col items-center justify-center h-[70vh] p-6 text-center">
			<div className="bg-secondary/30 rounded-full p-6 mb-6">
				<Newspaper className="h-12 w-12 text-primary" />
			</div>
			<h2 className="text-2xl font-bold mb-2">No Blogs Yet</h2>
			<p className="text-muted-foreground mb-6 max-w-md">
				You haven&apos;t created any blogs. Start writing and share your ideas with the world.
			</p>
		</div>
	);
}
