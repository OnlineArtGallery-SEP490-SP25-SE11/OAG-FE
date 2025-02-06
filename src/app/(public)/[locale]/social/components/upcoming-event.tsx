import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Users, Clock } from 'lucide-react';
import Image from 'next/image';

const mockEvents = [
	{
		id: '1',
		title: 'Modern Art Exhibition',
		date: new Date('2024-04-15'),
		time: '14:00 - 18:00',
		location: 'Main Gallery Hall',
		attendees: 156,
		image: '/demo.jpg',
		price: 'Free Entry'
	},
	{
		id: '2',
		title: 'Digital Art Workshop',
		date: new Date('2024-04-20'),
		time: '10:00 - 12:00',
		location: 'Virtual Event',
		attendees: 89,
		image: '/demo.jpg',
		price: '$25'
	}
];

export function UpcomingEvents() {
	return (
		<div className='space-y-4 sticky top-4'>
			<Card className='border-none shadow-md'>
				<CardHeader className='pb-2'>
					<CardTitle className='text-xl font-semibold'>
						Upcoming Events
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-6'>
					{mockEvents.map((event) => (
						<div key={event.id} className='group'>
							<div className='relative w-full h-32 mb-3 rounded-lg overflow-hidden'>
								<Image
									src={event.image}
									alt={event.title}
									fill
									className='object-cover transition-transform group-hover:scale-105'
								/>
								<div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
								<div className='absolute bottom-2 left-2 right-2'>
									<p className='text-white font-medium'>
										{event.title}
									</p>
									<p className='text-white/80 text-sm'>
										{event.price}
									</p>
								</div>
							</div>

							<div className='space-y-2 px-1'>
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
								<div className='flex items-center text-sm text-muted-foreground'>
									<MapPin className='mr-2 h-4 w-4' />
									{event.location}
								</div>
								<div className='flex items-center text-sm text-muted-foreground'>
									<Users className='mr-2 h-4 w-4' />
									{event.attendees} attending
								</div>

								<Button
									variant='outline'
									className='w-full mt-3 bg-primary/5 hover:bg-primary/10'
									size='sm'
								>
									Register Now
								</Button>
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
