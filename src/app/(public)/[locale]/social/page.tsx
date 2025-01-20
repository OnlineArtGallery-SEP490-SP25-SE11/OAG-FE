import { Suspense } from 'react';
import BlogList, { Loading } from './components/blog-list';
// import SearchBar from '@/components/SearchBar';
import { getBookmarkedPostIds } from '@/service/blog';
import { getCurrentUser } from '@/lib/session';
import { TooltipProvider } from '@/components/ui/tooltip';

export default async function Social() {
	const user = await getCurrentUser();
	let bookmarksId: string[] = [];
	if (user) {
		const bookmarkedPosts = await getBookmarkedPostIds(user.accessToken);
		bookmarksId = bookmarkedPosts || [];
	}
	return (
		<TooltipProvider>
			<main className='flex min-h-screen flex-col items-center justify-start p-4'>
				<div className='w-full max-w-5xl'>
					<Suspense fallback={<Loading />}>
						<BlogList
							bookmarkIds={bookmarksId}
							isSignedIn={!!user}
						/>
					</Suspense>
				</div>
			</main>
		</TooltipProvider>
	);
}
