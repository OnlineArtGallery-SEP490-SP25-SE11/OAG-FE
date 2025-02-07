'use client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Users, Clock, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

// Mock data - replace with real data fetching
const mockEvents = [
	{
		id: '1',
		title: 'Modern Art Exhibition',
		date: new Date('2024-04-15'),
		time: '14:00 - 18:00',
		location: 'Main Gallery Hall',
		attendees: 156,
		image: '/demo.jpg',
		price: 'Free Entry',
		description:
			'Join us for an extraordinary exhibition featuring contemporary artworks from emerging artists around the globe.',
		organizer: {
			name: 'Art Gallery NYC',
			avatar: '/oag-logo.png'
		}
	},
	{
		id: '2',
		title: 'Digital Art Workshop',
		date: new Date('2024-04-20'),
		time: '10:00 - 12:00',
		location: 'Virtual Event',
		attendees: 89,
		image: '/demo.jpg',
		price: '$25',
		description:
			'Learn the fundamentals of digital art creation with industry professionals.',
		organizer: {
			name: 'Digital Arts Academy',
			avatar: '/oag-logo.png'
		}
	}
];

export function EventFeed() {
	const { toast } = useToast();

	const handleRegister = () => {
		toast({
			title: 'Registration Successful',
			description: 'You have successfully registered for this event.',
			duration: 3000,
			className: 'bg-green-500 text-white border-green-600'
		});
	};

	return (
		<div className='grid grid-cols-1 gap-8 place-items-center'>
			{mockEvents.map((event) => (
				<Card
					key={event.id}
					className='overflow-hidden w-full max-w-[700px]'
				>
					<div className='relative aspect-[16/9]'>
						<Image
							src={event.image}
							alt={event.title}
							fill
							className='object-cover'
						/>
						<div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
						<div className='absolute bottom-4 left-4 right-4 text-white'>
							<h2 className='text-2xl font-bold mb-2'>
								{event.title}
							</h2>
							<p className='text-white/80'>{event.price}</p>
						</div>
					</div>

					<div className='p-6'>
						<p className='text-muted-foreground mb-6'>
							{event.description}
						</p>

						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-3'>
								<div className='flex items-center text-sm text-muted-foreground'>
									<CalendarDays className='mr-2 h-4 w-4' />
									<span className='font-medium'>
										{event.date.toLocaleDateString()}
									</span>
								</div>
								<div className='flex items-center text-sm text-muted-foreground'>
									<Clock className='mr-2 h-4 w-4' />
									<span>{event.time}</span>
								</div>
							</div>

							<div className='space-y-3'>
								<div className='flex items-center text-sm text-muted-foreground'>
									<MapPin className='mr-2 h-4 w-4' />
									{event.location}
								</div>
								<div className='flex items-center text-sm text-muted-foreground'>
									<Users className='mr-2 h-4 w-4' />
									{event.attendees} attending
								</div>
							</div>
						</div>

						<div className='flex items-center justify-between mt-6 pt-6 border-t'>
							<div className='flex items-center space-x-3'>
								<Image
									src={event.organizer.avatar}
									alt={event.organizer.name}
									width={32}
									height={32}
									className='rounded-full'
								/>
								<div>
									<p className='text-sm font-medium'>
										{event.organizer.name}
									</p>
									<p className='text-xs text-muted-foreground'>
										Organizer
									</p>
								</div>
							</div>

							<div className='flex space-x-2'>
								<Button variant='outline' size='sm'>
									<Share2 className='h-4 w-4 mr-2' />
									Share
								</Button>
								<Button size='sm' onClick={handleRegister}>
									Register Now
								</Button>
							</div>
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}
