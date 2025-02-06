import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Paintbrush, Image, ShoppingCart, Eye } from 'lucide-react';

export default function Docs() {
	return (
		<div
			className='w-full mx-auto p-5'
			style={{
				backgroundImage: 'url(/image/anh15.jpg)',
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat'
			}}
		>
			<h1 className='text-center text-3xl font-bold mb-8 text-white'>
				Online Art Gallery
			</h1>
			<img src='/image/anh15.jpg' alt='Background' className='hidden' />
			<div className='flex flex-wrap gap-5'>
				<Card className='flex-1 min-w-[calc(50%-20px)] shadow-lg hover:bg-slate-900 transition duration-300 bg-transparent text-white'>
					<CardHeader className='flex items-center'>
						<Paintbrush className='mr-2' />
						<CardTitle className='text-white'>
							View Paintings
						</CardTitle>
					</CardHeader>
					<CardContent className='text-white'>
						<p>
							Explore thousands of artworks from artists around
							the world, ranging from oil paintings and digital
							art to delicate watercolor masterpieces.
						</p>
					</CardContent>
				</Card>
				<Card className='flex-1 min-w-[calc(50%-20px)] shadow-lg hover:bg-slate-900 transition duration-300 bg-transparent text-white'>
					<CardHeader className='flex items-center'>
						<Image className='mr-2' />
						<CardTitle className='text-white'>
							Exhibit Your Art
						</CardTitle>
					</CardHeader>
					<CardContent className='text-white'>
						<p>
							If you're an artist, showcase your creations and
							connect with a vibrant art community.
						</p>
					</CardContent>
				</Card>
				<Card className='flex-1 min-w-[calc(50%-20px)] shadow-lg hover:bg-slate-900 transition duration-300 bg-transparent text-white'>
					<CardHeader className='flex items-center'>
						<ShoppingCart className='mr-2' />
						<CardTitle className='text-white'>
							Buy Paintings
						</CardTitle>
					</CardHeader>
					<CardContent className='text-white'>
						<p>
							Discover and own unique artworks in various styles,
							easily place orders online, and have them delivered
							to your doorstep.
						</p>
					</CardContent>
				</Card>
				<Card className='flex-1 min-w-[calc(50%-20px)] shadow-lg hover:bg-slate-900 transition duration-300 bg-transparent text-white'>
					<CardHeader className='flex items-center'>
						<Eye className='mr-2' />
						<CardTitle className='text-white'>
							Experience 3D Art Viewing
						</CardTitle>
					</CardHeader>
					<CardContent className='text-white'>
						<p>
							Enjoy art in a whole new way with our immersive 3D
							viewing feature, allowing you to admire every detail
							of a painting from different angles.
						</p>
					</CardContent>
				</Card>
			</div>
			<div className='mt-10 text-center text-lg text-white'>
				<p>
					Join Online Art Gallery today and explore the world of art
					in the most modern and convenient way!
				</p>
			</div>
		</div>
	);
}
