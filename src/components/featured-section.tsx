'use client'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import Autoplay from "embla-carousel-autoplay";
  import { type CarouselApi } from "@/components/ui/carousel";
  import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
  
  const slides = [
    {
      image: "https://res.cloudinary.com/djvlldzih/image/upload/v1739242086/gallery/arts/say38sarukeftfib0by9.jpg",
      title: "Modern Art Exhibition",
      subtitle: "Experience contemporary masterpieces",
      artist: "Sarah Chen",
      category: "Contemporary",
      date: "March 15 - April 30, 2024"
    },
    {
      image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912",
      title: "Abstract Perspectives",
      subtitle: "A journey through color and form",
      artist: "James Wilson",
      category: "Abstract",
      date: "April 1 - May 15, 2024"
    },
    {
      image: "https://images.unsplash.com/photo-1577720580479-7d839d829c73",
      title: "Digital Art Showcase",
      subtitle: "Where technology meets creativity",
      artist: "Maya Patel",
      category: "Digital Art",
      date: "April 10 - May 30, 2024"
    }
  ];
  
  function FeaturedSection() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
  
    useEffect(() => {
      if (!api) return;
  
      api.on("select", () => {
        setCurrent(api.selectedScrollSnap());
      });
    }, [api]);
  
    return (
      <section className="relative bg-black">
        <Carousel
          setApi={setApi}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full"
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[80vh]">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                  </div>
  
                  {/* Content */}
                  <div className="relative h-full flex items-center">
                    <div className="max-w-7xl mx-auto px-4 w-full">
                      <div className="max-w-2xl space-y-6">
                        <div className="space-y-2">
                          <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                            {slide.category}
                          </Badge>
                          <p className="text-sm font-medium text-white/70">
                            Featured Artist: {slide.artist}
                          </p>
                        </div>
  
                        <div className="space-y-4">
                          <h2 className="text-4xl md:text-6xl font-bold text-white">
                            {slide.title}
                          </h2>
                          <p className="text-xl text-white/90">
                            {slide.subtitle}
                          </p>
                          <p className="text-sm text-white/70">
                            {slide.date}
                          </p>
                        </div>
  
                        <div className="flex gap-4 pt-4">
                          <Button
                            size="lg"
                            className="bg-white text-black hover:bg-white/90"
                            asChild
                          >
                            <Link href={`/exhibitions/${index + 1}`}>
                              View Exhibition
                            </Link>
                          </Button>
                         
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
  
          {/* Navigation */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
              {/* Progress Indicators */}
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`w-16 h-1 rounded-full transition-all duration-300 ${
                      index === current ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
  
              {/* Carousel Controls */}
              {/* <div className="flex gap-4">
                <CarouselPrevious className="relative h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm" />
                <CarouselNext className="relative h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm" />
              </div> */}
            </div>
          </div>
        </Carousel>
      </section>
    );
  }

  export default FeaturedSection;