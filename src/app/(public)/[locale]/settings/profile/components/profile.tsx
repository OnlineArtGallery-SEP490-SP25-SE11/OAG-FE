'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUser } from '@/app/(public)/[locale]/_header/queries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui.custom/Avatar';
import {

	CircleUser,
	Heart,
	Image,

	Camera
} from 'lucide-react';
import EditProfileDialog from './EditProfileDialog';
import { motion } from 'framer-motion';
import { UploadButton } from '@/components/ui.custom/upload-button';
import { useToast } from '@/hooks/use-toast';
import { updateAvatar } from '../queries';
import { useEffect } from 'react';
import { subscribeToUserUpdates } from '@/lib/user-updates';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


function ProfilePage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { isLoading, error, data } = useQuery({
		queryKey: ['currentUser'],
		queryFn: fetchUser
	});

	const queryClient = useQueryClient();

	const { toast } = useToast();

	const handleAvatarUpload = async (file: File) => {
		if (status !== 'authenticated') {
			toast({
				title: 'Authentication Error',
				description: 'Please sign in to update your avatar',
				variant: 'destructive'
			});
			router.push('/auth/signin');
			return;
		}

		try {
			const response = await updateAvatar(file, session?.user?.accessToken);
			console.log('Avatar update response:', response);

			// Invalidate and refetch user data
			await queryClient.invalidateQueries({ queryKey: ['currentUser'] });

			// Force refetch the user data
			const updatedUser = await queryClient.fetchQuery({
				queryKey: ['currentUser'],
				queryFn: fetchUser
			});
			console.log('Updated user data:', updatedUser);

			toast({
				title: 'Success',
				description: 'Avatar updated successfully'
			});
		} catch (error) {
			console.error('Error updating avatar:', error);
			toast({
				title: 'Error',
				description: 'Failed to update avatar',
				variant: 'destructive'
			});
		}
	};


	// const handlePremiumStatusChange = async () => {
	// 	await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
	// 	toast({
	// 		title: 'Premium Status Updated',
	// 		description: data?.isPremium
	// 			? 'Welcome to Premium! Enjoy your new benefits.'
	// 			: 'Your premium status has been updated.',
	// 		variant: data?.isPremium ? 'success' : 'default'
	// 	});
	// };

	useEffect(() => {
		// Subscribe to premium status changes
		const subscription = subscribeToUserUpdates((updatedUser) => {
			if (updatedUser.isPremium !== data?.isPremium) {
				queryClient.invalidateQueries({ queryKey: ['currentUser'] });
			}
		});

		return () => {
			// Cleanup subscription
			subscription.unsubscribe();
		};
	}, [queryClient, data?.isPremium]);
	console.log(data);

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500'></div>
			</div>
		);
	}

	if (error instanceof Error) {
		return (
			<div className='flex items-center justify-center min-h-screen text-red-500'>
				<p>Error: {error.message}</p>
			</div>
		);
	}

	const { name, email } = data;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='p-8 max-w-6xl mx-auto mt-24 space-y-8'
		>
			{/* Profile Card */}
			<div className='bg-white rounded-xl shadow-lg overflow-hidden'>
				{/* Cover Image */}
				<div className='h-48 bg-gradient-to-r from-purple-500 to-pink-500'></div>

				{/* Profile Info */}
				<div className='relative px-8 pb-8'>
					{/* Avatar */}
					<div className="flex flex-col items-center justify-center space-y-4">
						{/* Avatar Section */}
						<div className="relative">
							<Avatar
								user={{
									image: data.image,
									googleImage: data.googleImage,
									isPremium: data.isPremium || false
								}}
								size="lg"
							/>

							{/* Upload Button */}
							<div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
								<UploadButton
									onUpload={handleAvatarUpload}
									className="w-8 h-8 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center p-0 shadow-lg border-2 border-white"
								>
									<Camera className="w-4 h-4 text-white" />
								</UploadButton>
							</div>
						</div>

						{/* User Info Section */}
						<div className="text-center">
							<div className="flex items-center gap-2 justify-center">
								<h2 className="text-2xl font-bold">{name}</h2>
								{data.isPremium && (
									<span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs px-2 py-1 rounded-full">
										Premium
									</span>
								)}
							</div>
							<p className="text-gray-600">{email}</p>

							{/* Add Edit Profile Button Here */}
							<div className="mt-4">
								<EditProfileDialog
									name={data.name}
									address={data.address || ''}
								/>
							</div>
						</div>
					</div>

					{/* Stats */}
					<div className='grid grid-cols-3 gap-4 max-w-2xl mx-auto'>
						<div className='text-center p-4 bg-purple-50 rounded-lg'>
							<p className='text-2xl font-bold text-purple-600'>
								245
							</p>
							<p className='text-gray-600'>Artworks</p>
						</div>
						<div className='text-center p-4 bg-pink-50 rounded-lg'>
							<p className='text-2xl font-bold text-pink-600'>
								12.5K
							</p>
							<p className='text-gray-600'>Followers</p>
						</div>
						<div className='text-center p-4 bg-purple-50 rounded-lg'>
							<p className='text-2xl font-bold text-purple-600'>
								348
							</p>
							<p className='text-gray-600'>Following</p>
						</div>
					</div>


				</div>
			</div>

			{/* Tabs Section */}
			<Tabs defaultValue='artworks' className='w-full'>
				<TabsList className='flex justify-center space-x-2 border-b border-gray-200 pb-2'>

					<TabsTrigger
						value='favorites'
						className='flex items-center space-x-2 px-4 py-2 rounded-lg transition-all'
					>
						<Heart className='w-4 h-4' />
						<span>Favorites</span>
					</TabsTrigger>
					<TabsTrigger
						value='collections'
						className='flex items-center space-x-2 px-4 py-2 rounded-lg transition-all'
					>
						<Image className='w-4 h-4' />
						<span>Collections</span>
					</TabsTrigger>
				</TabsList>



				<TabsContent value='favorites' className='mt-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{['Thuy Nguyen', 'Mai Lan', 'Van Cao'].map(
							(artist, index) => (
								<motion.div
									key={index}
									whileHover={{ scale: 1.02 }}
									className='flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md'
								>
									<div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center'>
										<CircleUser className='w-8 h-8 text-purple-500' />
									</div>
									<div>
										<h3 className='font-semibold'>
											{artist}
										</h3>
										<p className='text-sm text-gray-600'>
											Professional Artist
										</p>
									</div>
									<button className='ml-auto text-purple-500 hover:text-purple-600'>
										View Profile
									</button>
								</motion.div>
							)
						)}
					</div>
				</TabsContent>

				<TabsContent value='collections' className='mt-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{[1, 2, 3].map((collection) => (
							<motion.div
								key={collection}
								whileHover={{ scale: 1.02 }}
								className='bg-white rounded-xl shadow-md overflow-hidden'
							>
								<div className='p-4'>
									<h3 className='font-semibold mb-2'>
										Collection {collection}
									</h3>
									<div className='grid grid-cols-2 gap-2'>
										<img
											src='https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg'
											alt='Collection Preview'
											className='w-full h-24 object-cover rounded-lg'
										/>
										<img
											src='https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg'
											alt='Collection Preview'
											className='w-full h-24 object-cover rounded-lg'
										/>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</motion.div>
	);
}

export default ProfilePage;
