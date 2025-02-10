'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/app/(public)/[locale]/_header/queries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Pencil,
	Settings,
	CircleUser,
	Heart,
	Image,
	Grid,
	Camera
} from 'lucide-react';
import EditProfileDialog from './EditProfileDialog';
import { motion } from 'framer-motion';
import { UploadButton } from '@/components/ui.custom/upload-button';
import { useToast } from '@/hooks/use-toast';
import { updateAvatar } from '../queries';

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup
} from '@/components/ui/resizable';

function ProfilePage() {
	const { isLoading, error, data } = useQuery({
		queryKey: ['currentUser'],
		queryFn: fetchUser
	});

	const { toast } = useToast();

	const handleAvatarUpload = async (base64Image: string) => {
		try {
			const result = await updateAvatar(base64Image);
			// Assuming queryClient is not imported or defined in this context
			// queryClient.invalidateQueries(['currentUser']); // This line is commented out due to the error
			toast({
				title: 'Success',
				description: 'Avatar updated successfully'
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update avatar',
				variant: 'destructive'
			});
		}
	};

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
					<div className='relative -mt-16 mb-4'>
						<div className='w-32 h-32 bg-white rounded-full p-2 shadow-lg mx-auto relative group'>
							{data.avatar ? (
								<img
									src={data.avatar}
									alt='Avatar'
									className='w-full h-full rounded-full object-cover'
								/>
							) : (
								<div className='w-full h-full bg-gradient-to-r from-purple-200 to-pink-200 rounded-full flex items-center justify-center'>
									<CircleUser className='w-16 h-16 text-purple-500' />
								</div>
							)}

							{/* Upload Button với icon */}
							<div className='absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4'>
								<UploadButton
									onUpload={handleAvatarUpload}
									className='w-8 h-8 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center p-0 shadow-lg border-2 border-white'
								>
									<Camera className='w-4 h-4 text-white' />
								</UploadButton>
							</div>
						</div>
					</div>

					{/* User Details */}
					{/* User Details */}
					<div className='text-center mb-8 relative'>
						<div className='absolute right-0 top-0'>
							<EditProfileDialog name={name} email={email} />
						</div>
						<h1 className='text-3xl font-bold text-gray-800 mb-2'>
							{name}
						</h1>
						<p className='text-gray-600'>{email}</p>
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
					{/* <TabsTrigger
                        value="artworks"
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all"
                    >
                        <Grid className="w-4 h-4" />
                        <span>Artworks</span>
                    </TabsTrigger> */}
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

				{/* <TabsContent value="artworks" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <motion.div
                                key={item}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-xl shadow-md overflow-hidden"
                            >
                                <img
                                    src={`https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg`}
                                    alt={`Artwork ${item}`}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg">Artwork Title {item}</h3>
                                    <p className="text-gray-600 text-sm mt-1">Created on March 2024</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent> */}

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
