'use client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Users, Clock, Share2, Info, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import eventService from '@/service/event-service';
import { EventStatus } from '@/utils/enums';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface Event {
  _id: string;
  title: string;
  description: string;
  image: string;
  type: string;
  status: EventStatus;
  organizer: string;
  startDate: string;
  endDate: string;
  participants: {}[];
}

export function EventFeed() {
  const { toast } = useToast();
  const [hoveredDescription, setHoveredDescription] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const events = await eventService.get();
      return events.map((event: Event) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
      }));
    },
    placeholderData: [],
    staleTime: 5 * 60 * 1000, // 5 phút
  });

  const mutation = useMutation({
    mutationFn: (eventId: string) => eventService.participate(eventId),
    onSuccess: () => {
      toast({
        title: "Đăng ký thành công",
        description: "Bạn đã đăng ký thành công sự kiện",
      })
    },
    onError: (error) => {
      toast({
        title: "Đăng ký thất bại",
        description: "Bạn đã đăng ký thất bại sự kiện",
      })
    }
  })

  const onParticipate = (eventId: string) => {
    mutation.mutate(eventId)
  }



  // Format date and time functions
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Truncate description to show only first 100 characters
  const truncateDescription = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 place-items-center max-w-7xl mx-auto px-4">
      {data?.map((event: Event) => (
        <Card 
          key={event._id} 
          className="overflow-hidden w-full max-w-[700px] transition-all duration-300 hover:shadow-lg"
        >
          <div className="relative aspect-[16/9]">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 700px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="text-xl md:text-2xl font-bold mb-1">{event.title}</h2>
              <div className="flex items-center text-white/90 text-sm">
                <CalendarDays className="mr-1 h-4 w-4" />
                <span className="font-medium">{formatDate(new Date(event.startDate))}</span>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="mb-4 cursor-pointer group relative">
                    <p className="text-muted-foreground text-sm md:text-base inline-flex items-center">
                      {truncateDescription(event.description)}
                      <Info className="inline-block ml-1 h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  align="start" 
                  className="max-w-sm p-4 bg-sky-400 border border-sky-500 shadow-lg text-black rounded-lg transition-all duration-300"
                  sideOffset={5}
                >
                  <p className="text-sm leading-relaxed font-medium sky-gray-400">{event.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                <h3 className="text-sm font-medium mb-2">Thời gian sự kiện</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <div className="mb-1">
                          <span className="font-medium">Ngày bắt đầu:</span> {formatDate(new Date(event.startDate))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <div className="mb-1">
                          <span className="font-medium">Ngày kết thúc:</span> {formatDate(new Date(event.endDate))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-primary" />
                      <span className="font-medium">Bắt đầu:</span> {formatTime(new Date(event.startDate))}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-primary" />
                      <span className="font-medium">Kết thúc:</span> {formatTime(new Date(event.endDate))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                <h3 className="text-sm font-medium mb-2">Thông tin khác</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-primary" />
                    <div>
                      <span className="font-medium">Người tham dự:</span> {event.participants.length}
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-primary" />
                    <div>
                      <span className="font-medium">Người tổ chức:</span> {event.organizer}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-4 border-t gap-4">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                <p>
                  Bạn muốn quảng bá sản phẩm/ cá nhân, hãy liên hệ OGA{' '}
                  <Link 
                    href="/contact" 
                    className="text-primary font-medium hover:underline inline-flex items-center"
                  >
                    tại đây
                    <ExternalLink className="h-3 w-3 ml-0.5" />
                  </Link>
                </p>
              </div>
              <div className="flex space-x-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <Share2 className="h-4 w-4 mr-2" />
                  Chia sẻ
                </Button>
                <Button size="sm" className="flex-1 sm:flex-none" onClick={() => onParticipate(event._id)}>
                  Đăng ký ngay
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
