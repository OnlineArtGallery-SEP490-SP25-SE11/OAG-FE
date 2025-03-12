import { Suspense } from 'react';
import { fetchUser, getArtistProfile } from '@/app/(public)/[locale]/_header/queries';
import { getCurrentUser } from '@/lib/session';
import { ProfileSkeleton } from './components/profile-content';
import ProfileContent from './components/profile-content';
import { redirect } from 'next/navigation';
export default async function ProfilePage() {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect('/login');
	}
	const isArtist = currentUser.role?.includes('artist');

	// Fetch data on the server
	const userData = await (isArtist ? getArtistProfile(currentUser.accessToken) : fetchUser());

	return (
		<Suspense fallback={<ProfileSkeleton />}>
			<ProfileContent initialData={userData} />
		</Suspense>
	);
}
