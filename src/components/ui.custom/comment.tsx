import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDistance } from 'date-fns';
import { Heart, MessageCircle, MoreHorizontal, Reply } from 'lucide-react';
import { vi } from 'date-fns/locale';

interface CommentProps {
	author: {
		name: string;
		avatar: string;
	};
	content: string;
	createdAt: Date;
	likes: number;
	replies: number;
	isLiked?: boolean;
}

export function Comment({
	author,
	content,
	createdAt,
	likes,
	replies,
	isLiked = false
}: CommentProps) {
	return (
		<div className='space-y-4'>
			<div className='flex items-start gap-4'>
				<Avatar>
					<img
						alt={author.name}
						src={author.avatar}
						className='h-10 w-10 rounded-full object-cover'
					/>
				</Avatar>
				<div className='flex-1 space-y-2'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='font-semibold'>{author.name}</p>
							<p className='text-sm text-gray-500'>
								{formatDistance(createdAt, new Date(), {
									addSuffix: true,
									locale: vi
								})}
							</p>
						</div>
						<Button variant='ghost' size='icon'>
							<MoreHorizontal className='h-4 w-4' />
						</Button>
					</div>
					<p className='text-gray-600'>{content}</p>
					<div className='flex items-center gap-4'>
						<Button variant='ghost' size='sm' className='gap-2'>
							<Heart
								className={`h-4 w-4 ${
									isLiked ? 'fill-red-500 text-red-500' : ''
								}`}
							/>
							{likes}
						</Button>
						<Button variant='ghost' size='sm' className='gap-2'>
							<Reply className='h-4 w-4' />
							Trả lời
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

// Component để nhập comment mới
export function CommentInput() {
	return (
		<div className='space-y-4'>
			<Textarea
				placeholder='Viết bình luận của bạn...'
				className='min-h-[100px]'
			/>
			<div className='flex justify-end'>
				<Button>Gửi bình luận</Button>
			</div>
		</div>
	);
}
