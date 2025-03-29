'use client';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	CircleUser,
	Heart,
	Image,
	Pencil,
} from 'lucide-react';
// import EditProfileDialog from './EditProfileDialog';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { subscribeToUserUpdates } from '@/lib/user-updates';
import UpdateAvatar from './UpdateAvatar';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Collection from './collection'; // Import the Collection component

interface ProfileContentProps {
	initialData: {
		name: string;
		email: string;
		role?: string[];
		isPremium?: boolean;
		image?: string;
		googleImage?: string;
		address?: string;
		artistProfile?: {
			bio?: string;
			genre?: string[];
		};
		createdAt: string;
		artworksCount?: number;
		followersCount?: number;
		followingCount?: number;
	};
}

// Helper function to strip HTML tags
const stripHtml = (html: string) => {
	return html.replace(/<[^>]*>/g, '');
};

const ProfileContent = ({ initialData }: ProfileContentProps) => {
	const queryClient = useQueryClient();
	const router = useRouter();
	const t = useTranslations('profile');

	useEffect(() => {
		const subscription = subscribeToUserUpdates((updatedUser) => {
			if (updatedUser.isPremium !== initialData?.isPremium) {
				queryClient.invalidateQueries({ queryKey: ['profile'] });
			}
		});
		return () => {
			subscription.unsubscribe();
		};
	}, [queryClient, initialData?.isPremium]);

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
					{/* Edit Profile Button */}
					<div className="absolute top-4 right-8">
						<Button
							onClick={() => router.push('/settings/profile/edit')}
							className='flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors duration-200'
							variant='outline'
							size='sm'
						>
							<Pencil className='w-4 h-4' />
							<span>{t('view.edit_profile')}</span>
						</Button>
					</div>

					{/* Avatar Section */}
					<div className="flex flex-col items-center justify-center space-y-4">
						<UpdateAvatar
							user={{
								image: initialData.image,
								isPremium: initialData.isPremium || false
							}}
						/>

						{/* User Info Section */}
						<div className="text-center max-w-2xl">
							{/* Name and Badges */}
							<div className="flex items-center gap-2 justify-center flex-wrap">
								<h2 className="text-2xl font-bold">{initialData.name}</h2>
								<div className="flex gap-2 flex-wrap">
									{initialData.role?.includes('artist') && (
										<Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
											{t('common.artist_badge')}
										</Badge>
									)}
									{initialData.isPremium && (
										<Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-none">
											{t('common.premium_badge')}
										</Badge>
									)}
								</div>
							</div>

							{/* Email */}
							<p className="text-gray-600 mt-1">{initialData.email}</p>

							{/* Artist Profile Section */}
							{initialData.role?.includes('artist') && initialData.artistProfile && (
								<div className="mt-6 space-y-4">
									{/* Bio */}
									{initialData.artistProfile.bio && (
										<div className="bg-gray-50 p-4 rounded-lg">
											<p className="text-gray-700 whitespace-pre-wrap">
												{stripHtml(initialData.artistProfile.bio)}
											</p>
										</div>
									)}

									{/* Art Styles */}
									{initialData.artistProfile.genre && initialData.artistProfile.genre.length > 0 && (
										<div className="mt-4 space-y-2">
											<p className="text-sm font-medium text-gray-600">Art Styles</p>
											<div className="flex flex-wrap gap-2 justify-center">
												{initialData.artistProfile.genre.map((genre: string) => (
													<Badge
														key={genre}
														variant="secondary"
														className="bg-purple-100 text-purple-800 hover:bg-purple-200"
													>
														{genre}
													</Badge>
												))}
											</div>
										</div>
									)}

								</div>
							)}

							{/* Join Date */}
							<p className="text-xs text-gray-500 mt-4">
								{t('common.joined', {
									date: new Date(initialData.createdAt).toLocaleDateString('en-US', {
										month: 'long',
										year: 'numeric'
									})
								})}
							</p>
						</div>
					</div>

					{/* Stats */}
					<div className='grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8'>
						<div className='text-center p-4 bg-purple-50 rounded-lg transition-all hover:bg-purple-100'>
							<p className='text-2xl font-bold text-purple-600'>
								{initialData.artworksCount || 0}
							</p>
							<p className='text-gray-600 text-sm'>{t('common.artworks')}</p>
						</div>
						<div className='text-center p-4 bg-pink-50 rounded-lg transition-all hover:bg-pink-100'>
							<p className='text-2xl font-bold text-pink-600'>
								{initialData.followersCount || 0}
							</p>
							<p className='text-gray-600 text-sm'>{t('common.followers')}</p>
						</div>
						<div className='text-center p-4 bg-purple-50 rounded-lg transition-all hover:bg-purple-100'>
							<p className='text-2xl font-bold text-purple-600'>
								{initialData.followingCount || 0}
							</p>
							<p className='text-gray-600 text-sm'>{t('common.following')}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Tabs Section */}
			<Tabs defaultValue='collections' className='w-full'> {/* Changed default to collections */}
				<TabsList className='flex justify-center space-x-2 border-b border-gray-200 pb-2'>
					<TabsTrigger
						value='favorites'
						className='flex items-center space-x-2 px-4 py-2 rounded-lg transition-all'
					>
						<Heart className='w-4 h-4' />
						<span>{t('view.favorites')}</span>
					</TabsTrigger>
					<TabsTrigger
						value='collections'
						className='flex items-center space-x-2 px-4 py-2 rounded-lg transition-all'
					>
						<Image className='w-4 h-4' />
						<span>{t('view.collections')}</span>
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
											{t('view.professional_artist')}
										</p>
									</div>
									<button className='ml-auto text-purple-500 hover:text-purple-600'>
										{t('view.view_profile')}
									</button>
								</motion.div>
							)
						)}
					</div>
				</TabsContent>

				<TabsContent value='collections' className='mt-6'>
					{/* Replace static collection content with the Collection component */}
					<div className="bg-white rounded-xl p-6 shadow-sm">
						<Collection />
					</div>
				</TabsContent>
			</Tabs>
		</motion.div>
	);
}

export function ProfileSkeleton() {
	return (
		<div className='p-8 max-w-6xl mx-auto mt-24 space-y-8 animate-pulse'>
			<div className='bg-gray-200 rounded-xl h-[600px]'></div>
			<div className='space-y-4'>
				<div className='h-10 bg-gray-200 rounded w-1/3'></div>
				<div className='grid grid-cols-3 gap-4'>
					<div className='h-32 bg-gray-200 rounded'></div>
					<div className='h-32 bg-gray-200 rounded'></div>
					<div className='h-32 bg-gray-200 rounded'></div>
				</div>
			</div>
		</div>
	);
}

export default ProfileContent;
