'use client'
import { ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FeaturedGalleryPreview } from './components/featured-gallery-preview';
import Footer from '@/components/footer';



export default function AboutPage() {
    return (
        <div className='min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]'>
            <main className='flex-1 w-full'>
                <div className="relative w-full min-h-[90vh] flex items-center">
                    {/* Video Background */}
                    <video

                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="https://res.cloudinary.com/djvlldzih/video/upload/v1738983008/gallery/hero_video.mp4" type="video/mp4" />
                    </video>

                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* Hero Content */}
                    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-white">
                        <h1 className="text-4xl md:text-8xl font-bold mb-4">
                            Online Art<br />
                            Exhibitions.<br />

                            <span className="text-3xl md:text-4xl font-light">Unlimited by reality. Accessible for everyone.​</span>
                        </h1>

                        <div className="grid md:grid-cols-2 gap-8 mt-8">
                            {/* Artists Section */}
                            <div className="space-y-3">
                                <h2 className="text-2xl font-semibold">Artists & Art Galleries</h2>
                                <p className="text-lg">
                                    Exhibit your art in beautiful 3D art galleries. Share freely, get instant visitors and sell your art.
                                </p>
                            </div>

                            {/* Art Lovers Section */}
                            <div className="space-y-3">
                                <h2 className="text-2xl font-semibold">Art Lovers & Art Collectors</h2>
                                <p className="text-lg">
                                    Visit 3D art exhibitions from the comfort of your browser. Acquire art directly from the artist.
                                </p>
                            </div>
                        </div>
                        <div className="mt-16 flex gap-x-40">
                            <Link
                                href="/artworks"
                                className="group relative bg-blue-600 text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 hover:bg-blue-700 hover:-translate-y-1"
                            >
                                <span className="relative z-10 font-medium flex items-center gap-2">
                                    Open your own art exhibition
                                    <ChevronsRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300" />
                            </Link>

                            <Link
                                href="/creator"
                                className="group relative bg-pink-600 text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 hover:bg-pink-700 hover:-translate-y-1"
                            >
                                <span className="relative z-10 font-medium flex items-center gap-2">
                                    Discover art exhibitions
                                    <ChevronsRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* New Discover Section */}
                <div className="relative w-full min-h-[50vh] flex items-center">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src="https://res.cloudinary.com/djvlldzih/image/upload/v1738986967/gallery/discover_image.jpg"
                            alt="Art gallery background"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-24">
                        <div className="max-w-xl space-y-12"> {/* Container for left-aligned content */}
                            <h2 className="text-3xl md:text-6xl font-bold text-gray-400 space-y-3">
                                <span className="block">Discover art</span>
                                <span className="block">exhibitions from</span>
                                <span className="block">around the world.</span>

                            </h2>
                            <Link
                                href="/creator"
                                className="group relative inline-block bg-pink-600 text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 hover:bg-pink-600 hover:text-white hover:-translate-y-1"
                            >
                                <span className="relative z-10 font-medium flex items-center gap-2">
                                    Discover art exhibitions

                                    <ChevronsRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Exhibition Sections */}
                <div className="w-full bg-white py-24">
                    {/* Featured Exhibition */}
                    <section className="mb-24">
                        <div className="max-w-6xl mx-auto px-4">
                            {/* Text Content */}
                            <div className="max-w-2xl mx-auto text-center mb-16">
                                <h2 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
                                    Featured<br />exhibition.
                                </h2>
                                <p className="text-xl text-gray-600 mb-8">
                                    Experience art in immersive 3D spaces. Walk through virtual galleries and discover amazing artworks.
                                </p>
                            </div>

                            {/* Monitor Frame with 3D Gallery */}
                            <FeaturedGalleryPreview />
                        </div>
                    </section>

                    {/* Featured Exhibitions */}
                    <section className="mb-5">
                        <div className="max-w-4xl mx-auto px-4">
                            <h2 className="text-3xl md:text-4xl font-bold mb-8">
                                Featured art exhibitions.
                            </h2>
                        </div>
                        <div className="relative group">
                            <div className="overflow-hidden no-scrollbar">
                                <div className="flex gap-6 px-4 md:px-8 min-w-full">
                                    {[
                                        {
                                            id: 1,
                                            title: "The Abstract Mind",
                                            artist: "Emma Chen",
                                            description: "A stunning exploration of abstract expressionism through bold colors and dynamic forms.",
                                            image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968",
                                            dateRange: "March 1 - April 15, 2024"
                                        },
                                        {
                                            id: 2,
                                            title: "Urban Landscapes",
                                            artist: "Michael Wong",
                                            description: "Contemporary interpretations of city life through mixed media and photography.",
                                            image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912",
                                            dateRange: "March 10 - April 30, 2024"
                                        },
                                        {
                                            id: 3,
                                            title: "Digital Dreams",
                                            artist: "Sarah Johnson",
                                            description: "An immersive exhibition blending traditional art with cutting-edge digital techniques.",
                                            image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
                                            dateRange: "March 15 - May 1, 2024"
                                        },
                                        {
                                            id: 4,
                                            title: "Nature's Harmony",
                                            artist: "David Park",
                                            description: "A serene collection inspired by natural landscapes and organic forms.",
                                            image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66",
                                            dateRange: "March 20 - May 15, 2024"
                                        },
                                        {
                                            id: 5,
                                            title: "Modern Expressions",
                                            artist: "Lisa Zhang",
                                            description: "Bold contemporary works exploring themes of identity and culture.",
                                            image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04",
                                            dateRange: "April 1 - May 30, 2024"
                                        }
                                    ].map((exhibition) => (
                                        <Link href={`/exhibitions/${exhibition.id}`} key={exhibition.id} className="min-w-[250px] md:min-w-[300px] flex">
                                            <div className="flex flex-col bg-white rounded-3xl overflow-hidden shadow hover:shadow-md transition-shadow duration-300 w-full">
                                                <div className="relative w-full h-48">
                                                    <Image
                                                        src={exhibition.image}
                                                        alt={exhibition.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="p-3 flex flex-col gap-1.5 flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900">{exhibition.title}</h3>
                                                    <p className="text-xs text-gray-600">By {exhibition.artist}</p>
                                                    <p className="text-xs text-gray-500 line-clamp-2">
                                                        {exhibition.description}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-auto">{exhibition.dateRange}</p>
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

                    {/* Trending Exhibitions */}
                    {/* <section className="mb-24">
						<div className="max-w-4xl mx-auto px-4">
							<h2 className="text-3xl md:text-4xl font-bold mb-8">
								Trending art exhibitions.
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
														src={`https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg`}
														alt={`Trending Exhibition ${i}`}
														fill
														className="object-cover"
													/>
												</div>
												<div className="p-3 flex flex-col gap-1.5">
													<h3 className="text-lg font-semibold text-gray-900">Exhibition Title {i}</h3>
													<p className="text-xs text-gray-600">By Artist Name</p>
													<p className="text-xs text-gray-500 line-clamp-2">
														Experience this trending exhibition featuring contemporary artworks that challenge conventional perspectives.
													</p>
													<p className="text-xs text-gray-400 mt-1">March 15 - April 30, 2024</p>
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
					</section> */}

                    {/* New Exhibitions */}
                    {/* <section>
						<div className="max-w-4xl mx-auto px-4">
							<h2 className="text-3xl md:text-4xl font-bold mb-8">
								New art exhibitions.
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
														src={`https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg`}
														alt={`New Exhibition ${i}`}
														fill
														className="object-cover"
													/>
												</div>
												<div className="p-3 flex flex-col gap-1.5">
													<h3 className="text-lg font-semibold text-gray-900">Exhibition Title {i}</h3>
													<p className="text-xs text-gray-600">By Artist Name</p>
													<p className="text-xs text-gray-500 line-clamp-2">
														Discover this newly launched exhibition showcasing emerging talent and innovative artistic expressions.
													</p>
													<p className="text-xs text-gray-400 mt-1">April 1 - May 15, 2024</p>
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
					</section> */}
                </div>
                {/* Vision & Mission Section */}
                <div className="relative w-full min-h-[90vh] flex items-center">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src="https://res.cloudinary.com/djvlldzih/image/upload/v1739205495/gallery/vision_thumbnail.png"
                            alt="Vision background"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-24">
                        <div className="grid md:grid-cols-2 gap-12 md:gap-24">
                            {/* Vision */}
                            <div>
                                <p className="text-1xl md:text-2xl lg:text-3xl text-white font-bold leading-tight">
                                    Our vision is a democratic, equal & sustainable global art market.
                                </p>
                            </div>
                            {/* Mission */}
                            <div>
                                <p className="text-1xl md:text-2xl lg:text-3xl text-white font-bold leading-tight">
                                    Our mission is to offer every artist an equal opportunity & give more art to experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
            <Footer/>
        </div>
    );
}
