'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/app/(public)/[locale]/_header/queries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Settings, CircleUser } from 'lucide-react';
import EditProfileDialog from './EditProfileDialog';

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

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error instanceof Error) {
		return <div>Error: {error.message}</div>;
	}

	const { name, email } = data;

	return (
		<div className='p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-32 border-b-2 border-purple-500'>
			{/* Header Section */}
			<div className='flex items-center justify-between border-b-2 border-purple-200 pb-4'>
				<div className='flex items-center space-x-4'>
					{/* Avatar */}
					<div className='relative w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center'>
						<span className='text-gray-500 text-4xl'>
							<CircleUser />
						</span>
					</div>
					{/* User Info */}
					<div>
						<h1 className='text-2xl font-bold'>{name}</h1>

						<p className='text-gray-500'>{email}</p>
					</div>
				</div>
				{/* Points and Edit Icon */}
				<div className='flex items-center space-x-4'>
					<div className='flex items-center text-gray-700 space-x-2'>
						<span className='font-semibold'>1000</span>
						<span className='w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center'>
							<Settings />
						</span>
					</div>
					<EditProfileDialog name={name} email={email} />
				</div>
			</div>

			{/* Favorite Section */}
			<div className='mt-6'>
				<Tabs defaultValue='account' className='w-full'>
					<TabsList className='space-x-4 border-b-2 border-purple-200'>
						<TabsTrigger
							value='Favorite Artist'
							className='px-4 py-2 text-gray-700 hover:text-purple-700 transition-colors duration-200'
						>
							Favorite Artist
						</TabsTrigger>
						<TabsTrigger
							value='Collections'
							className='px-4 py-2 text-gray-700 hover:text-purple-700 transition-colors duration-200'
						>
							Collections
						</TabsTrigger>
					</TabsList>
					<TabsContent value='Favorite Artist'>
						<div className='mt-4'>
							{/* Favorite Artist List */}
							{['Thuy Nguyen', 'Thuy Nguyen'].map(
								(artist, index) => (
									<div
										key={index}
										className='flex items-center justify-between p-4 border rounded-lg mb-2'
										style={{
											borderColor:
												'rgba(130, 46, 131, 0.7)'
										}}
									>
										<div className='flex items-center space-x-4'>
											<div className='w-12 h-12 bg-gray-200 rounded-full'></div>
											<div>
												<h3 className='text-lg font-semibold'>
													{artist}
												</h3>
												<p className='text-sm text-gray-500'>
													Artist ✅
												</p>
											</div>
										</div>
										<button className='text-blue-500 hover:underline'>
											View
										</button>
									</div>
								)
							)}
						</div>
					</TabsContent>
					<TabsContent value='Collections'>
						<ResizablePanelGroup direction='horizontal'>
							<ResizablePanel>
								<div
									style={{
										display: 'flex',
										flexWrap: 'wrap',
										gap: '10px'
									}}
								>
									<img
										src='/image/anh-nt-thumb-2.jpeg'
										alt='Collection Image 1'
										style={{
											width: '100px',
											height: '100px',
											objectFit: 'cover',
											borderRadius: '8px'
										}}
									/>
									<img
										src='/image/fine-art-photography-la-gi-9.jpg'
										alt='Collection Image 2'
										style={{
											width: '100px',
											height: '100px',
											objectFit: 'cover',
											borderRadius: '8px'
										}}
									/>
								</div>
							</ResizablePanel>
							<ResizableHandle />
						</ResizablePanelGroup>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
export default ProfilePage;
