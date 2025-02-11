import FeaturedSection from '@/components/featured-section';
import { getSession } from '@/lib/session';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ClockIcon, CalendarIcon } from 'lucide-react';

// Exhibition Section Component
const ExhibitionSection = ({ title, description, dateRange }: {
	title: string;
	description: string;
	dateRange: string;
}) => {
	return (
		<section className="mb-24">
			<div className="max-w-4xl mx-auto px-4">
				<h2 className="text-3xl md:text-4xl font-bold mb-8">
					{title}
				</h2>
			</div>
			<div className="relative group">
				<div className="overflow-hidden no-scrollbar">
					<div className="flex gap-6 px-4 md:px-8 min-w-full">
						{[1, 2, 3, 4, 5].map((i) => (
							<Link href={`/exhibitions/${i}`} key={i} className="min-w-[250px] md:min-w-[300px]">
								<div className="flex flex-col bg-white rounded-3xl overflow-hidden shadow hover:shadow-md transition-shadow duration-300">
									<div className="relative aspect-[3/2]">
										<Image
											src={`/demo.jpg`}
											alt={`${title} ${i}`}
											fill
											className="object-cover"
										/>
									</div>
									<div className="p-3 flex flex-col gap-1.5">
										<h3 className="text-lg font-semibold text-gray-900">{title} {i}</h3>
										<p className="text-xs text-gray-600">By Artist Name</p>
										<p className="text-xs text-gray-500 line-clamp-2">
											{description}
										</p>
										<p className="text-xs text-gray-400 mt-1">{dateRange}</p>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
				<button className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					<ChevronLeft className="w-6 h-6" />
				</button>
				<button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					<ChevronRight className="w-6 h-6" />
				</button>
			</div>
		</section>
	);
};

// Artist Spotlight Section
const ArtistSpotlight = () => {
	return (
		<section className="py-24 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4">
				<h2 className="text-3xl font-bold mb-12">Artist Spotlight</h2>
				
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Artist Profile */}
					<div className="space-y-6">
						<div className="relative aspect-[4/3] rounded-xl overflow-hidden">
							<Image
								src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5"
								alt="Artist Profile"
								fill
								className="object-cover"
							/>
						</div>
						<div>
							<h3 className="text-2xl font-semibold">Sarah Chen</h3>
							<p className="text-gray-600">Contemporary Abstract Artist</p>
							<div className="flex items-center gap-4 mt-2">
								<span className="text-sm text-gray-500">15 Years Experience</span>
								<span className="text-sm text-gray-500">120+ Artworks</span>
								<span className="text-sm text-gray-500">25 Exhibitions</span>
							</div>
						</div>
						<p className="text-gray-600 leading-relaxed">
							&quot;Art is my way of expressing the unseen emotions and experiences that words cannot capture. 
							Through abstract forms and vibrant colors, I invite viewers to explore their own interpretations 
							and connect with the deeper meanings hidden within each piece.&quot;
						</p>
						<Button className="mt-4">View Full Profile</Button>
					</div>

					{/* Featured Works */}
					<div className="grid grid-cols-2 gap-4">
						{[
							{
								id: 1,
								title: "Ethereal Dreams",
								image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968",
								year: "2023"
							},
							{
								id: 2,
								title: "Urban Rhythm",
								image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912",
								year: "2023"
							},
							{
								id: 3,
								title: "Nature's Whisper",
								image: "https://images.unsplash.com/photo-1579783483458-83d02161294e",
								year: "2022"
							},
							{
								id: 4,
								title: "Digital Cosmos",
								image: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208",
								year: "2022"
							}
						].map(work => (
							<div key={work.id} className="group cursor-pointer">
								<div className="relative aspect-square rounded-lg overflow-hidden">
									<Image
										src={work.image}
										alt={work.title}
										fill
										className="object-cover transition-transform duration-300 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
										<div className="absolute bottom-0 left-0 right-0 p-4 text-white">
											<h4 className="font-medium">{work.title}</h4>
											<p className="text-sm text-gray-300">{work.year}</p>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

// Footer Component
const Footer = () => {
	return (
		<footer className='w-full bg-slate-800 py-16'>
			<div className='max-w-6xl mx-auto px-4'>
				{/* Main footer content */}
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-12'>
					{/* Navigation Links Column 1 */}
					<div className='space-y-4'>
						<Link href="/" className='block text-gray-600 hover:text-gray-900'>Home</Link>
						<Link href="/for-artists" className='block text-gray-600 hover:text-gray-900'>For Artists</Link>
						<Link href="/for-art-lovers" className='block text-gray-600 hover:text-gray-900'>For Art Lovers</Link>
						<Link href="/pricing" className='block text-gray-600 hover:text-gray-900'>Pricing</Link>
					</div>

					{/* Navigation Links Column 2 */}
					<div className='space-y-4'>
						<Link href="/faq" className='block text-gray-600 hover:text-gray-900'>FAQ</Link>
						<Link href="/learn-more" className='block text-gray-600 hover:text-gray-900'>Learn More</Link>
						<Link href="/login" className='block text-gray-600 hover:text-gray-900'>Login to the app</Link>
					</div>

					{/* Contact Information */}
					<div className='space-y-4'>
						<address className='not-italic text-gray-600'>
							FPT University
						</address>
						<div className='space-y-2'>
							<Link href="/contact" className='block text-gray-600 hover:text-gray-900'>Email</Link>
							<Link href="https://linkedin.com/company/yourcompany" className='block text-gray-600 hover:text-gray-900'>
								People at LinkedIn
							</Link>
						</div>
					</div>

					{/* CTA and Social Links */}
					<div className='space-y-6'>
						<Link
							href="/artworks"
							className="inline-block bg-blue-600 text-white px-4 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
						>
							Open your own art exhibition
						</Link>

						{/* Social Icons */}
						<div className='flex justify-center gap-4'>
							<Link
								href="https://instagram.com/yourcompany"
								className='text-gray-600 hover:text-gray-900'
								target="_blank"
								rel="noopener noreferrer"
							>
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
								</svg>
							</Link>
							<Link
								href="https://linkedin.com/company/yourcompany"
								className='text-gray-600 hover:text-gray-900'
								target="_blank"
								rel="noopener noreferrer"
							>
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
								</svg>
							</Link>
							<Link
								href="https://facebook.com/yourcompany"
								className='text-gray-600 hover:text-gray-900'
								target="_blank"
								rel="noopener noreferrer"
							>
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
								</svg>
							</Link>
						</div>
					</div>
				</div>

				{/* Bottom Links */}
				<div className='pt-8 border-t border-gray-200'>
					<div className='flex flex-wrap gap-4 text-sm text-gray-500'>
						<Link href="/privacy" className='hover:text-gray-900'>Privacy Policy</Link>
						<span>•</span>
						<Link href="/terms" className='hover:text-gray-900'>Terms & Conditions</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

// Recommendation Section Component
const RecommendationSection = () => {
	return (
		<section className="py-24 bg-gray-50">
			<div className="w-full mx-auto px-4">
				<Tabs defaultValue="forYou" className="space-y-8">
					<div className="flex items-center justify-between">
						<TabsList className="bg-transparent border">
							<TabsTrigger
								value="forYou"
								className="data-[state=active]:bg-white"
							>
								New Works for You
							</TabsTrigger>
							<TabsTrigger
								value="following"
								className="data-[state=active]:bg-white"
							>
								New Works by Artists You Follow
							</TabsTrigger>
						</TabsList>
						<Button variant="ghost" className="text-blue-600 hover:text-blue-700">
							View All
						</Button>
					</div>

					<TabsContent value="forYou" className="mt-0">
						<div className="relative group">
							<div className="overflow-x-auto no-scrollbar">
								<div className="flex gap-6 items-end min-w-max pb-4">
									{[
										{
											id: 1,
											title: "Abstract Harmony",
											artist: "Emma Chen",
											image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968",
											price: "$2,400",
											width: 280,
											height: 180
										},
										{
											id: 2,
											title: "Urban Dreams",
											artist: "Marcus Rivera",
											image: "https://images.unsplash.com/photo-1579783483458-83d02161294e",
											price: "$1,800",
											width: 200,
											height: 240
										},
										{
											id: 3,
											title: "Digital Wilderness",
											artist: "Sophie Kim",
											image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912",
											price: "$3,200",
											width: 320,
											height: 160
										},
										{
											id: 4,
											title: "Neon Nights",
											artist: "Alex Wong",
											image: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208",
											price: "$2,800",
											width: 240,
											height: 200
										},
										{
											id: 5,
											title: "Nature's Pulse",
											artist: "Maria Garcia",
											image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
											price: "$1,900",
											width: 260,
											height: 220
										}
									].map((artwork) => (
										<div
											key={artwork.id}
											className="group flex flex-col"
											style={{ width: `${artwork.width}px` }}
										>
											<div className="flex-grow">
												<div
													className="relative overflow-hidden rounded-lg"
													style={{ height: `${artwork.height}px` }}
												>
													<Image
														src={artwork.image}
														alt={artwork.title}
														fill
														className="object-cover transition-transform duration-300 group-hover:scale-105"
													/>
												</div>
											</div>
											<div className="mt-3">
												<h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
													{artwork.title}
												</h3>
												<p className="text-sm text-gray-500">{artwork.artist}</p>
												<p className="text-sm font-medium text-gray-900 mt-1">{artwork.price}</p>
											</div>
										</div>
									))}
								</div>
							</div>
							<button className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<ChevronLeft className="w-6 h-6" />
							</button>
							<button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<ChevronRight className="w-6 h-6" />
							</button>
						</div>
					</TabsContent>

					<TabsContent value="following" className="mt-0">
						<div className="relative group">
							<div className="overflow-x-auto no-scrollbar">
								<div className="flex gap-6 items-end min-w-max pb-4">
									{[
										{
											id: 1,
											title: "Morning Light",
											artist: "David Park",
											image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9",
											price: "$3,500",
											width: 300,
											height: 200
										},
										{
											id: 2,
											title: "City Rhythms",
											artist: "Lisa Chen",
											image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262",
											price: "$2,800",
											width: 220,
											height: 240
										},
										{
											id: 3,
											title: "Ocean Dreams",
											artist: "Michael Brown",
											image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1",
											price: "$4,200",
											width: 280,
											height: 180
										},
										{
											id: 4,
											title: "Desert Winds",
											artist: "Sarah Johnson",
											image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66",
											price: "$3,100",
											width: 260,
											height: 220
										},
										{
											id: 5,
											title: "Forest Tales",
											artist: "James Wilson",
											image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
											price: "$2,900",
											width: 240,
											height: 160
										}
									].map((artwork) => (
										<div
											key={artwork.id}
											className="group flex flex-col"
											style={{ width: `${artwork.width}px` }}
										>
											<div className="flex-grow">
												<div
													className="relative overflow-hidden rounded-lg"
													style={{ height: `${artwork.height}px` }}
												>
													<Image
														src={artwork.image}
														alt={artwork.title}
														fill
														className="object-cover transition-transform duration-300 group-hover:scale-105"
													/>
												</div>
											</div>
											<div className="mt-3">
												<h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
													{artwork.title}
												</h3>
												<p className="text-sm text-gray-500">{artwork.artist}</p>
												<p className="text-sm font-medium text-gray-900 mt-1">{artwork.price}</p>
											</div>
										</div>
									))}
								</div>
							</div>
							<button className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<ChevronLeft className="w-6 h-6" />
							</button>
							<button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<ChevronRight className="w-6 h-6" />
							</button>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</section>
	);
};

// Trending Artists Section Component
const TrendingArtistsSection = () => {
	return (
		<section className="py-24 bg-white">
			<div className="w-full mx-auto px-4">
				<div className="flex items-center justify-between mb-8">
					<h2 className="text-3xl md:text-4xl font-bold">
						Trending Artists
					</h2>
					<Button variant="ghost" className="text-blue-600 hover:text-blue-700">
						View All
					</Button>
				</div>

				<div className="relative group">
					<div className="overflow-x-auto no-scrollbar">
						<div className="flex gap-6 items-end min-w-max pb-4">
							{[
								{
									id: 1,
									name: "Sarah Johnson",
									specialty: "Contemporary Art",
									image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
									followers: "12.5K"
								},
								{
									id: 2,
									name: "Michael Chen",
									specialty: "Digital Art",
									image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1",
									followers: "8.2K"
								},
								{
									id: 3,
									name: "Emma Davis",
									specialty: "Abstract Art",
									image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
									followers: "15.7K"
								},
								{
									id: 4,
									name: "David Kim",
									specialty: "Photography",
									image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
									followers: "10.1K"
								},
								{
									id: 5,
									name: "Lisa Wang",
									specialty: "Sculpture",
									image: " https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
									followers: "9.3K"
								}
							].map((artist) => (
								<div
									key={artist.id}
									className="group/item flex flex-col w-[280px]"
								>
									<div className="flex-grow">
										<div className="relative overflow-hidden rounded-2xl aspect-[3/4]">
											<Image
												src={artist.image}
												alt={artist.name}
												fill
												className="object-cover transition-transform duration-300 group-hover/item:scale-105"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
											<div className="absolute bottom-0 left-0 right-0 p-4 text-white">
												<h3 className="text-xl font-semibold group-hover/item:text-blue-400 transition-colors">
													{artist.name}
												</h3>
												<p className="text-sm text-gray-200">{artist.specialty}</p>
												<p className="text-sm text-gray-300 mt-1">{artist.followers} followers</p>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					<button className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
						<ChevronLeft className="w-6 h-6" />
					</button>
					<button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
						<ChevronRight className="w-6 h-6" />
					</button>
				</div>
			</div>
		</section>
	);
};

// Article Section
const ArticleSection = () => {
	return (
		<section className="py-24 bg-white">
			<div className=" mx-auto px-4">
				<div className="flex items-center justify-between mb-12">
					<h2 className="text-3xl font-bold">Latest Articles</h2>
					<Button variant="ghost" className="text-blue-600 hover:text-blue-700">
						View All Articles
					</Button>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Featured Article - Cột 1 */}
					<div className="group">
						<Link href="/articles/1">
							<div className="relative aspect-square rounded-xl overflow-hidden mb-6">
								<Image
									src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968"
									alt="Featured Article"
									fill
									className="object-cover transition-transform duration-300 group-hover:scale-105"
								/>
							</div>
							<span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full mb-4 inline-block">
								Featured
							</span>
							<h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 mb-4">
								The Evolution of Digital Art in the Modern Era
							</h3>
							<p className="text-gray-600 mb-4 line-clamp-3">
								Exploring how digital technologies have transformed the art world and opened new possibilities for creative expression. 
								From NFTs to AI-generated artwork, discover how artists are pushing the boundaries of creativity in the digital age.
							</p>
							<div className="flex items-center gap-4 text-gray-500 text-sm">
								<div className="flex items-center gap-2">
									<ClockIcon className="w-4 h-4" />
									<span>5 min read</span>
								</div>
								<div className="flex items-center gap-2">
									<CalendarIcon className="w-4 h-4" />
									<span>Mar 15, 2024</span>
								</div>
							</div>
						</Link>
					</div>

					{/* Regular Articles - Cột 2 */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
						{[
							{
								id: 1,
								title: "Understanding Color Theory in Contemporary Art",
								excerpt: "A deep dive into how modern artists use color to convey emotion and meaning.",
								image: "https://images.unsplash.com/photo-1579783483458-83d02161294e",
								readTime: "4 min",
								date: "Mar 14, 2024",
								category: "Theory"
							},
							{
								id: 2,
								title: "Emerging Artists to Watch in 2024",
								excerpt: "Discover the rising stars shaping the future of contemporary art.",
								image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912",
								readTime: "3 min",
								date: "Mar 13, 2024",
								category: "Artists"
							},
							{
								id: 3,
								title: "The Impact of AI on Modern Art Creation",
								excerpt: "How artificial intelligence is revolutionizing artistic expression.",
								image: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208",
								readTime: "6 min",
								date: "Mar 12, 2024",
								category: "Technology"
							},
							{
								id: 4,
								title: "Sustainable Art: Creating with Purpose",
								excerpt: "Exploring eco-friendly approaches in contemporary art practices.",
								image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1",
								readTime: "4 min",
								date: "Mar 11, 2024",
								category: "Sustainability"
							},
							{
								id: 5,
								title: "Art Collection: A Beginner's Guide",
								excerpt: "Essential tips for starting your own art collection journey.",
								image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66",
								readTime: "5 min",
								date: "Mar 10, 2024",
								category: "Collecting"
							},
							{
								id: 6,
								title: "Virtual Galleries: The Future of Art Exhibition",
								excerpt: "How digital spaces are transforming art presentation and access.",
								image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912",
								readTime: "4 min",
								date: "Mar 9, 2024",
								category: "Digital"
							}
						].map(article => (
							<Link 
								href={`/articles/${article.id}`} 
								key={article.id}
								className="group"
							>
								<div className="relative aspect-[3/2] rounded-lg overflow-hidden mb-3">
									<Image
										src={article.image}
										alt={article.title}
										fill
										className="object-cover transition-transform duration-300 group-hover:scale-105"
									/>
								</div>
								<span className="text-xs font-medium text-blue-600 mb-2 block">
									{article.category}
								</span>
								<h3 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-2">
									{article.title}
								</h3>
								<p className="text-sm text-gray-500 line-clamp-2 mb-2">
									{article.excerpt}
								</p>
								<div className="flex items-center gap-4 text-xs text-gray-400">
									<span>{article.readTime} read</span>
									<span>{article.date}</span>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

// Main Page Component
export default async function Home() {
	const session = await getSession();
	console.log(session, 'session');

	return (
		<div className='min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]'>
			<main className='flex-1 w-full'>
				<FeaturedSection />

				<div className="w-full bg-white py-24">
					<ExhibitionSection
						title="Trending art exhibitions."
						description="Experience this trending exhibition featuring contemporary artworks that challenge conventional perspectives."
						dateRange="March 15 - April 30, 2024"
					/>

					<ExhibitionSection
						title="New art exhibitions."
						description="Discover this newly launched exhibition showcasing emerging talent and innovative artistic expressions."
						dateRange="April 1 - May 15, 2024"
					/>
				</div>
				<RecommendationSection />
				<ArtistSpotlight />
				<TrendingArtistsSection />
				<ArticleSection />
			</main>
			<Footer />
		</div>
	);
}
