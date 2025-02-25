"use client";

import Image from "next/image";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  slug: string;
}

const categories: Category[] = [
  {
    id: "1",
    name: "Contemporary Art",
    imageUrl: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=1470&h=800",
    slug: "contemporary-art"
  },
  {
    id: "2",
    name: "Painting",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1470&h=800",
    slug: "painting"
  },
  {
    id: "3",
    name: "Street Art",
    imageUrl: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=1470&h=800",
    slug: "street-art"
  },
  {
    id: "4",
    name: "Photography",
    imageUrl: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=1470&h=800",
    slug: "photography"
  },
  {
    id: "5",
    name: "Emerging Art",
    imageUrl: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=1470&h=800",
    slug: "emerging-art"
  },
  {
    id: "6",
    name: "20th-Century Art",
    imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1470&h=800",
    slug: "20th-century-art"
  }
];

const ArtCategory = () => {
  return (
    <div className="px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {categories.map((category) => (
          <Link 
            href={`/artworks/category/${category.slug}`} 
            key={category.id}
            className="group"
          >
            <div className="flex flex-col space-y-3">
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <span className="text-sm font-medium text-center block">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArtCategory;
