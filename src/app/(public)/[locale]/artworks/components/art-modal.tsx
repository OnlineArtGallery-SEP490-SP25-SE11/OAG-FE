import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AnimatePresence, motion } from 'framer-motion';
import { DollarSignIcon, Eye, Info, RulerIcon, TagIcon, UserIcon, X, CalendarIcon, BookmarkIcon } from 'lucide-react';
import Image from 'next/image';
import { Fragment, memo, useCallback, useEffect, useRef, useState } from 'react';
import { BiComment } from 'react-icons/bi';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchArtworkById } from '@/app/(public)/[locale]/artworks/api';
import { Artwork } from '@/types/marketplace';
import CreateReport from '@/components/ui.custom/report-button';
import { RefType } from '@/utils/enums';
import { Button } from '@/components/ui/button';
import AddArtworkCollection from '@/components/ui.custom/add-artwork-collection';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSwipeable } from 'react-swipeable';

const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }
};

const contentVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: { duration: 0.2, ease: 'easeIn' }
    }
};

const tabVariants = {
    inactive: { opacity: 0.7, scale: 0.98, y: 0 },
    active: { opacity: 1, scale: 1.02, y: -2, transition: { duration: 0.2 } },
    hover: { scale: 1.04, transition: { duration: 0.2 } }
};

function Modal({
                   id,
                   setId
               }: {
    id: string | null;
    setId: (id: string | null) => void;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const modalRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState('details');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    const handleClose = useCallback(() => {
        setId(null);
        router.push(pathname, undefined);
    }, [setId, router, pathname]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['artworks', id],
        queryFn: () => id ? fetchArtworkById(id) : Promise.reject('Invalid ID'),
        enabled: !!id
    });

    const artwork = data?.data as Artwork;

    // Swipe handlers for mobile
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => {
            if (activeTab === 'details') setActiveTab('comments');
        },
        onSwipedRight: () => {
            if (activeTab === 'comments') setActiveTab('details');
        },
        preventScrollOnSwipe: true,
        trackMouse: false
    });

    useEffect(() => {
        if (!id) return;

        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.classList.add('overflow-hidden');

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', handleKeyDown);

        if (modalRef.current) {
            modalRef.current.focus();
        }

        return () => {
            document.body.style.paddingRight = '0px';
            document.body.classList.remove('overflow-hidden');
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [id, handleClose]);

    // Status mapping to badge variants
    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'available':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'sold':
                return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'unavailable':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        }
    };

    // Handle image zoom toggle
    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    if (isLoading) {
        return (
            <AnimatePresence>
                <motion.div
                    className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className='text-white text-lg flex items-center gap-2'>
                        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        Loading...
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    if (error) {
        return (
            <AnimatePresence>
                <motion.div
                    className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className='text-white text-lg bg-red-500/20 p-4 rounded-lg'>
                        Error loading artwork.
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    if (!artwork || !artwork.dimensions) return null;

    return (
        <Fragment>
            <AnimatePresence mode='wait'>
                <motion.div
                    key='overlay'
                    variants={overlayVariants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    onClick={handleClose}
                    className='fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-2 md:p-4 bg-black/70 backdrop-blur-sm'
                >
                    <motion.div
                        key='modal'
                        layoutId={`card-${id}`}
                        ref={modalRef}
                        tabIndex={-1}
                        onClick={(e) => e.stopPropagation()}
                        className='w-full max-w-[1500px] relative rounded-lg sm:rounded-xl overflow-hidden flex flex-col lg:flex-row border border-white/20 bg-black/80 h-[100vh] sm:h-[95vh] md:h-[90vh]'
                    >
                        {/* Close Button - More prominent on mobile */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className='absolute top-2 right-2 z-50 p-2 rounded-full bg-black/40 hover:bg-white/10 transition-colors'
                            onClick={handleClose}
                            aria-label='Close modal'
                        >
                            <X className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
                        </motion.button>

                        {/* Image Section - Optimized for mobile */}
                        <motion.div
                            ref={imageRef}
                            variants={contentVariants}
                            initial='initial'
                            animate='animate'
                            exit='exit'
                            className={`
                flex-1 p-1 sm:p-3 md:p-4 flex items-center justify-center 
                w-full lg:w-[60%] h-[40vh] sm:h-[45vh] lg:h-auto 
                bg-black/60 relative
                ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}
              `}
                            onClick={toggleZoom}
                        >
                            <div className={`
                relative w-full h-full flex items-center justify-center
                overflow-hidden transition-transform duration-300 ease-out
              `}>
                                <Image
                                    width={artwork.dimensions.width}
                                    height={artwork.dimensions.height}
                                    alt={artwork.title}
                                    src={artwork.url}
                                    className={`
                    max-w-full max-h-full object-contain rounded-md
                    transition-transform duration-300
                    ${isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'}
                  `}
                                    priority
                                    placeholder='blur'
                                    blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAErgHY/gfP4gAAAABJRU5ErkJggg=='
                                    onLoadingComplete={() => setImageLoaded(true)}
                                />
                            </div>

                            {/* Zoom instructions - mobile only */}
                            <div className='absolute bottom-2 left-2 right-2 flex justify-center pointer-events-none'>
                <span className='text-xs text-white/70 bg-black/40 px-2 py-1 rounded-full backdrop-blur-md sm:hidden'>
                  Tap to {isZoomed ? 'zoom out' : 'zoom in'}
                </span>
                            </div>
                        </motion.div>

                        {/* Details Section - Mobile optimized */}
                        <motion.div
                            className='flex-1 p-3 sm:p-4 md:p-6 lg:w-[40%] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col bg-black/80'
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            {...swipeHandlers}
                        >
                            <div className='flex-1 flex flex-col'>
                                {/* Tabs - More touch-friendly */}
                                <div className='relative mb-2 sm:mb-3'>
                                    <div className='flex justify-start gap-1 sm:gap-3 border-b border-white/20'>
                                        <motion.button
                                            onClick={() => setActiveTab('details')}
                                            className={`relative flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base md:text-lg font-medium text-white/90 rounded-t-md transition-colors ${
                                                activeTab === 'details'
                                                    ? 'bg-white/10 shadow-md text-white'
                                                    : 'text-white/60 hover:bg-white/5'
                                            }`}
                                            variants={tabVariants}
                                            initial='inactive'
                                            animate={activeTab === 'details' ? 'active' : 'inactive'}
                                            whileHover='hover'
                                        >
                                            <Info className='w-4 h-4 sm:w-5 sm:h-5' />
                                            <span>Info</span>
                                            {activeTab === 'details' && (
                                                <motion.div
                                                    className='absolute bottom-0 left-0 h-0.5 bg-white w-full'
                                                    layoutId='underline'
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                />
                                            )}
                                        </motion.button>
                                        <motion.button
                                            onClick={() => setActiveTab('comments')}
                                            className={`relative flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base md:text-lg font-medium text-white/90 rounded-t-md transition-colors ${
                                                activeTab === 'comments'
                                                    ? 'bg-white/10 shadow-md text-white'
                                                    : 'text-white/60 hover:bg-white/5'
                                            }`}
                                            variants={tabVariants}
                                            initial='inactive'
                                            animate={activeTab === 'comments' ? 'active' : 'inactive'}
                                            whileHover='hover'
                                        >
                                            <BiComment className='w-4 h-4 sm:w-5 sm:h-5' />
                                            <span>
                        Comments {((artwork as any)?.commentsCount || 0) > 0 && `(${(artwork as any).commentsCount})`}
                      </span>
                                            {activeTab === 'comments' && (
                                                <motion.div
                                                    className='absolute bottom-0 left-0 h-0.5 bg-white w-full'
                                                    layoutId='underline'
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                />
                                            )}
                                        </motion.button>
                                    </div>

                                    {/* Swipe indicator - mobile only */}
                                    <div className='text-xs text-white/50 mt-1 text-center sm:hidden'>
                                        Swipe to change tabs
                                    </div>
                                </div>

                                {/* Tabs Content */}
                                <AnimatePresence mode='wait'>
                                    {activeTab === 'details' && (
                                        <motion.div
                                            key='details'
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className='flex-1'
                                        >
                                            <ScrollArea className='h-full pr-2 sm:pr-4'>
                                                <div className='space-y-3 sm:space-y-5 pb-4'>
                                                    {/* Title with Status Badge */}
                                                    <div>
                                                        <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 line-clamp-2'>
                                                            {artwork.title}
                                                        </h2>

                                                        <div className='flex items-center gap-2 flex-wrap'>
                                                            {artwork.status && (
                                                                <span
                                                                    className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${getStatusBadge(artwork.status)}`}>
                                  {artwork.status}
                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Price (only if > 0) */}
                                                    {artwork.price > 0 && (
                                                        <div className='bg-white/10 hover:bg-white/15 transition-colors rounded-lg p-2 sm:p-3'>
                                                            <div className='flex items-center gap-2 sm:gap-3'>
                                                                <DollarSignIcon className='w-5 h-5 sm:w-6 sm:h-6 text-white/70' />
                                                                <div>
                                                                    <p className='text-xs sm:text-sm text-white/70'>Price</p>
                                                                    <p className='font-semibold text-white text-lg sm:text-xl'>
                                                                        ${artwork.price.toLocaleString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Artist information with avatar */}
                                                    {artwork.artistId && (
                                                        <div className="flex items-center justify-between bg-white/10 hover:bg-white/15 transition-colors rounded-lg p-2 sm:p-3">
                                                            <div className="flex items-center gap-2 sm:gap-3">
                                                                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-white/20">
                                                                    <AvatarImage
                                                                        src={artwork.artistId.image}
                                                                        alt={artwork.artistId.name || "Artist"}
                                                                    />
                                                                    <AvatarFallback className="bg-white/10 text-white">
                                                                        {artwork.artistId.name?.charAt(0) || <UserIcon className="h-4 w-4"/>}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className='text-xs sm:text-sm text-white/70'>Artist</p>
                                                                    <p className='font-medium text-white text-sm sm:text-base'>
                                                                        {artwork.artistId.name || 'Unknown Artist'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline" className="bg-white/5 hover:bg-white/10 text-xs sm:text-sm whitespace-nowrap">
                                                                View Profile
                                                            </Badge>
                                                        </div>
                                                    )}

                                                    {/* Add the collection button here */}
                                                    <div className='mt-4'>
                                                        <AddArtworkCollection 
                                                            artworkId={artwork._id}
                                                            triggerButton={
                                                                <Button 
                                                                    className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white"
                                                                >
                                                                    <BookmarkIcon className="w-5 h-5" />
                                                                    Add to Collection
                                                                </Button>
                                                            }
                                                            onSuccess={() => {
                                                                // Optional: You can add additional success handling here
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Description - more prominent */}
                                                    <div className='bg-white/10 rounded-lg p-3 sm:p-4 border border-white/5'>
                                                        <h3 className='text-base sm:text-lg font-medium text-white mb-2 sm:mb-3'>
                                                            Description
                                                        </h3>
                                                        <div className="max-h-[150px] sm:max-h-[250px] overflow-auto pr-2">
                                                            <p className='text-sm sm:text-base text-white/90 leading-relaxed whitespace-pre-line'>
                                                                {artwork.description || 'No description available.'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Categories */}
                                                    {artwork.category && artwork.category.length > 0 && (
                                                        <div className='space-y-1.5 sm:space-y-2'>
                                                            <div className='flex items-center gap-1.5'>
                                                                <TagIcon className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70'/>
                                                                <span className='text-xs sm:text-sm text-white/70'>Categories</span>
                                                            </div>
                                                            <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                                                                {artwork.category.map((cat, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className='bg-white/10 hover:bg-white/15 transition-colors text-white px-2 py-0.5 sm:py-1 rounded-md text-xs'
                                                                    >
                                    {cat}
                                  </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Metadata - compact footer */}
                                                    <div className="bg-white/5 rounded-lg p-2 sm:p-3 text-xs text-white/60">
                                                        <div className="flex flex-wrap gap-2 sm:gap-3 justify-between">
                                                            <div className="flex items-center gap-1 sm:gap-1.5">
                                                                <RulerIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                                <span>{artwork.dimensions.width}×{artwork.dimensions.height} px</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 sm:gap-1.5">
                                                                <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                                <span>{artwork.views || 0} views</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 sm:gap-1.5">
                                                                <CalendarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                                <span>{new Date(artwork.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </ScrollArea>
                                        </motion.div>
                                    )}
                                    {activeTab === 'comments' && (
                                        <motion.div
                                            key='comments'
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className='flex-1'
                                        >
                                            <ScrollArea className='h-full pr-2 sm:pr-4'>
                                                <div className='space-y-3 sm:space-y-4 pb-4'>
                                                    {/* Comment Input */}
                                                    <div className='bg-white/5 p-2 sm:p-3 rounded-lg'>
                                                        <div className='flex gap-2'>
                                                            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                                                                <AvatarFallback className="bg-white/20">
                                                                    You
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <input
                                                                type="text"
                                                                placeholder="Add a comment..."
                                                                className="w-full bg-white/10 text-white text-sm rounded-full px-3 py-1.5 border border-transparent focus:border-white/30 focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Comments List */}
                                                    {((artwork as any).commentsCount || 0) > 0 ? (
                                                        Array.from({
                                                            length: (artwork as any).commentsCount || 3
                                                        }).map((_, idx) => (
                                                            <div
                                                                key={idx}
                                                                className='bg-white/10 p-2 sm:p-3 rounded-lg'
                                                            >
                                                                <div className='flex items-center gap-2 mb-1.5 sm:mb-2'>
                                                                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                                                                        <AvatarFallback className="bg-white/20 text-xs sm:text-sm">
                                                                            U{idx + 1}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <p className='font-medium text-white text-sm sm:text-base'>User {idx + 1}</p>
                                                                </div>
                                                                <p className='text-xs sm:text-sm text-white/90 pl-8 sm:pl-10'>
                                                                    Great artwork! I love the composition and colors.
                                                                </p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-6 text-white/50 text-sm">
                                                            No comments yet. Be the first to comment!
                                                        </div>
                                                    )}
                                                </div>
                                            </ScrollArea>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </Fragment>
    );
}

export default memo(Modal);