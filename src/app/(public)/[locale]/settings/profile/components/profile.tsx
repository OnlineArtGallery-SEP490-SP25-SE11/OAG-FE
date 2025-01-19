'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/app/(public)/[locale]/_header/queries';


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
		<div className='p-6 max-w-4xl mx-auto bg-white shadow rounded-lg mt-32 border-b-2 border-purple-500 '>
			{/* Header Section */}
			<div className='flex items-center justify-between border-b-2 border-purple-200 pb-4'>
				<div className='flex items-center space-x-4'>
					{/* Avatar */}
					<div className='relative w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center'>
						<span className='text-gray-400 text-4xl'>🙂</span>
					</div>
					{/* User Info */}
					<div>
						<h1 className='text-xl font-semibold'>{name}</h1>
						<p className='text-gray-600'>0375586411</p>
						<p className='text-gray-600'>{email}</p>
					</div>
				</div>
				{/* Points and Edit Icon */}
				<div className='flex items-center space-x-4'>
					<div className='flex items-center text-gray-700 space-x-2'>
						<span className='font-semibold'>1000</span>
						<span className='w-5 h-5 bg-yellow-300 rounded-full flex items-center justify-center'>
							⚙️
						</span>
					</div>
					<button className='p-2 text-gray-500 hover:text-gray-700'>
						✏️
					</button>
				</div>
			</div>

			{/* Favorite Section */}
			<div className='mt-6'>
				{/* Tabs */}
				<div className='flex space-x-4 border-b'>
					<button className='py-2 px-4 border-b-2 border-purple-600 text-purple-600 font-semibold'>
						Favorite Artist
					</button>
					<button className='py-2 px-4 text-gray-500 hover:text-gray-700'>
						Favorite Art
					</button>
				</div>

				{/* Content */}
				<div className='mt-4'>
					{/* Favorite Artist List */}
					{['Thuy Nguyen', 'Thuy Nguyen'].map((artist, index) => (
						<div
							key={index}
							className='flex items-center justify-between p-4 border rounded-lg mb-2'
							style={{ borderColor: 'rgba(130, 46, 131, 0.7)' }}
						>
							<div className='flex items-center space-x-4'>
								<div className='w-12 h-12 bg-gray-100 rounded-full'></div>
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
					))}
				</div>
			</div>
		</div>
	);
}
export default ProfilePage