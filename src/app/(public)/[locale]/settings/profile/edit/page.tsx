import { Suspense } from 'react';
import { fetchUser, getArtistProfile } from '@/app/(public)/[locale]/_header/queries';
import { getCurrentUser } from '@/lib/session';
import { ProfileSkeleton } from '../components/profile-content';
import EditProfile from '../components/edit-profile';
import { redirect } from 'next/navigation';

export default async function EditProfilePage() {
 const currentUser = await getCurrentUser();
 if (!currentUser) {
  redirect('/login');
 }
 const isArtist = currentUser.role?.includes('artist');

 // Fetch data on the server
 const userData = await (isArtist ? getArtistProfile(currentUser.accessToken) : fetchUser());

 return (
  <Suspense fallback={<ProfileSkeleton />}>
   <EditProfile initialData={userData} />
  </Suspense>
 );
} 