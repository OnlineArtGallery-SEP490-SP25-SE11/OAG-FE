'use client';
import { BlogCard } from './blog-card';
import { useBlogs } from '@/hooks/use-blogs';
import { calculateReadingTime } from '@/app/utils';
import { createSlug } from '@/lib/utils';

export function BlogFeed() {
	const {
		blogs,
		isError,
		isReachingEnd,
		size,
		setSize,
		isLoadingMore,
		isLoading
	} = useBlogs();

	if (isError) return <div>Error loading blogs</div>;
	if (isLoading) return <div>Loading...</div>;

	return (
		<div className='space-y-6'>
			{blogs.map(
				(post) =>
					post && (
						<div key={post._id} className='relative group'>
							<BlogCard
								title={post.title}
								coverImage={post.image}
								content={post.content}
								heartCount={post.heartCount}
								isHearted={false}
								author={{
									name: post.author.name,
									image:
										post.author.image ||
										'/default-avatar.jpg'
								}}
								publishedAt={new Date(post.createdAt)}
								readTime={calculateReadingTime(post.content)}
								slug={`${createSlug(post.title)}.${post._id}`}
								isBookmarked={false}
								isSignedIn={true}
							/>
						</div>
					)
			)}

			{/* {!isReachingEnd && (
				<button
					onClick={() => setSize(size + 1)}
					className='w-full py-2 text-center text-muted-foreground hover:text-primary'
				>
					{isLoadingMore ? 'Loading...' : 'Load more'}
				</button>
			)} */}
		</div>
	);
}





// 'use client';
// import { Card } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import { Heart, MessageSquare, Share2 } from 'lucide-react';
// import { useState } from 'react';
// import { Input } from '@/components/ui/input';
// import {
// 	Drawer,
// 	DrawerClose,
// 	DrawerContent,
// 	DrawerDescription,
// 	DrawerFooter,
// 	DrawerHeader,
// 	DrawerTitle,
// 	DrawerTrigger
// } from '@/components/ui/drawer';
// import Image from 'next/image';

// const mockComments = [
// 	{
// 		id: '1',
// 		author: {
// 			name: 'John Doe',
// 			avatar: '/oag-logo.png'
// 		},
// 		content: 'Great insights! I really enjoyed reading this.',
// 		createdAt: '2024-03-20T10:00:00Z'
// 	},
// 	{
// 		id: '2',
// 		author: {
// 			name: 'Jane Smith',
// 			avatar: '/oag-logo.png'
// 		},
// 		content: 'Very informative and well-written.',
// 		createdAt: '2024-03-20T11:30:00Z'
// 	}
// ];

// const mockBlogPosts = [
// 	{
// 		id: '1',
// 		title: 'Understanding Abstract Art',
// 		author: {
// 			name: 'Sarah Chen',
// 			avatar: '/oag-logo.png'
// 		},
// 		publishedDate: 'March 10, 2024',
// 		likes: 120,
// 		comments: 30,
// 		excerpt: 'An in-depth look at the world of abstract art and its impact on modern culture.Exploring how modern art has evolved through the decades and what lies ahead. Exploring how modern art has evolved through the decades and what lies ahead.',
// 		image: 'https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg'
// 	},
// 	{
// 		id: '2',
// 		title: 'The Evolution of Modern Art',
// 		author: {
// 			name: 'Mark Lee',
// 			avatar: '/oag-logo.png'
// 		},
// 		publishedDate: 'March 15, 2024',
// 		likes: 95,
// 		comments: 22,
// 		excerpt: 'Exploring how modern art has evolved through the decades and what lies ahead. Exploring how modern art has evolved through the decades and what lies ahead. Exploring how modern art has evolved through the decades and what lies ahead.Exploring how modern art has evolved through the decades and what lies ahead.Exploring how modern art has evolved through the decades and what lies ahead.',
// 		image: 'https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg'
// 	}
// ];

// export function BlogFeed() {
// 	const [newComment, setNewComment] = useState('');

// 	const handleSubmitComment = () => {
// 		console.log('Submitting comment:', newComment);
// 		setNewComment('');
// 	};

// 	return (
// 		<div className='grid grid-cols-1 gap-8 place-items-center'>
// 			{mockBlogPosts.map((post) => (
// 				<Card key={post.id} className='overflow-hidden w-full max-w-[700px]'>
// 					<div className='p-4'>
// 						<div className='flex items-center space-x-4'>
// 							<Avatar>
// 								<AvatarImage src={post.author.avatar} />
// 								<AvatarFallback>{post.author.name[0]}</AvatarFallback>
// 							</Avatar>
// 							<div>
// 								<p className='font-medium'>{post.author.name}</p>
// 								<p className='text-sm text-muted-foreground'>{post.publishedDate}</p>
// 							</div>
// 						</div>
// 					</div>

// 					<div className='p-4'>
// 						<h3 className='text-xl font-semibold mb-2'>{post.title}</h3>
// 						<p className='text-muted-foreground'>{post.excerpt}</p>

// 						<div className='relative aspect-[16/9]'>
//             				<Image src={post.image} alt={post.title} fill className='object-cover' />
//           				</div>

// 						<div className='flex items-center space-x-4 mt-4'>
// 							<Button variant='ghost' size='sm'>
// 								<Heart className='w-4 h-4 mr-2' />
// 								{post.likes}
// 							</Button>

// 							<Drawer>
// 								<DrawerTrigger asChild>
// 									<Button variant='ghost' size='sm'>
// 										<MessageSquare className='w-4 h-4 mr-2' />
// 										{post.comments}
// 									</Button>
// 								</DrawerTrigger>
// 								<DrawerContent className='w-[400px] h-screen'>
// 									<DrawerHeader>
// 										<DrawerTitle>Comments</DrawerTitle>
// 										<DrawerDescription>Join the discussion below</DrawerDescription>
// 									</DrawerHeader>
// 									<div className='p-4 space-y-4 flex-1 overflow-y-auto'>
// 										{mockComments.map((comment) => (
// 											<div key={comment.id} className='flex space-x-3'>
// 												<Avatar className='h-8 w-8'>
// 													<AvatarImage src={comment.author.avatar} />
// 													<AvatarFallback>{comment.author.name[0]}</AvatarFallback>
// 												</Avatar>
// 												<div>
// 													<p className='text-sm font-medium'>{comment.author.name}</p>
// 													<p className='text-sm text-muted-foreground'>{comment.content}</p>
// 												</div>
// 											</div>
// 										))}
// 									</div>
// 									<DrawerFooter className='border-t mt-auto'>
// 										<Input placeholder='Add a comment...' value={newComment} onChange={(e) => setNewComment(e.target.value)} />
// 										<Button onClick={handleSubmitComment}>Post</Button>
// 									</DrawerFooter>
// 								</DrawerContent>
// 							</Drawer>

// 							<Button variant='ghost' size='sm' className='ml-auto'>
// 								<Share2 className='w-4 h-4' />
// 							</Button>
// 						</div>
// 					</div>
// 				</Card>
// 			))}
// 		</div>
// 	);
// }

