"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

import { Search, Heart, Eye, Sparkles, ChevronRight } from "lucide-react";


interface Gallery {
    id: string;
    title: string;
    author: string;
    thumbnail: string;
    category: string;
    description: string;
    likes: number;
    views: number;
    featured: boolean;
    tags: string[];
}

export default function DiscoverPage() {
    const [searchQuery, setSearchQuery] = useState("");

    // Mock data - replace with API call
    const galleries: Gallery[] = [
        {
            id: "1",
            title: "Modern Art Exhibition 2024",
            author: "Johny Dang",
            thumbnail: "https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg",
            category: "Modern Art",
            description: "Contemporary mixed media portrait artwork by Johny Dang",
            likes: 1234,
            views: 5678,
            featured: true,
            tags: ["Modern", "Abstract", "2024"]

        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="relative h-[400px] bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative max-w-7xl mx-auto px-4 py-20">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Discover Amazing Virtual Galleries
                    </h1>
                    <p className="text-xl mb-8 max-w-2xl">
                        Explore curated exhibitions from artists around the world.
                        Experience art in immersive virtual spaces.
                    </p>

                    {/* Search Bar */}
                    <div className="flex gap-4 max-w-2xl">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Search galleries, artists, or styles..."
                                className="w-full pl-10 h-12 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/60"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button className="h-12 px-6 bg-white text-purple-600 hover:bg-white/90">
                            Search
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Featured Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-yellow-500" />
                            Featured Exhibitions
                        </h2>
                        <Button variant="ghost">
                            View All <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {galleries.filter(g => g.featured).map((gallery) => (
                            <Link href={`/exhibitions/${gallery.id}`} key={gallery.id}>
                                <Card key={gallery.id} className="group overflow-hidden hover:shadow-lg hover:bg-gray-50 transition-transform duration-300">
                                    <div className="relative aspect-[4/3]">
                                        <Image

                                            src={gallery.thumbnail}
                                            alt={gallery.title}
                                            fill
                                            className="object-cover transition-transform"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <Badge className="absolute top-4 right-4 bg-gray-300">Featured</Badge>
                                    </div>
                                    <div className="p-4">

                                        <h3 className="text-xl font-semibold mb-2">{gallery.title}</h3>
                                        <p className="text-gray-500 mb-4">{gallery.description}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Heart className="w-4 h-4" /> {gallery.likes}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" /> {gallery.views}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>

                </div>

            </div>
        </div>
    );
}