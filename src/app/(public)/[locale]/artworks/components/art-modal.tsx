import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AnimatePresence, motion } from 'framer-motion';
import { DollarSignIcon, Flag, Info, RulerIcon, UserIcon, X } from 'lucide-react';
import Image from 'next/image';
import {
    Fragment,
    memo,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import { BiComment } from 'react-icons/bi';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchArtworkById } from '@/app/(public)/[locale]/artworks/api';
import { Artwork } from '@/types/marketplace';
import CreateReport from '@/components/ui.custom/report-button';
import { RefType } from '@/utils/enums';
import { Button } from '@/components/ui/button';

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
    const [activeTab, setActiveTab] = useState('details');

    const handleClose = useCallback(() => {
        setId(null);
        router.push(pathname, undefined);
    }, [setId, router, pathname]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['artworks', id],
        queryFn: () =>
            id ? fetchArtworkById(id) : Promise.reject('Invalid ID'),
        enabled: !!id
    });

    const artwork = data?.data as Artwork;

    useEffect(() => {
        if (!id) return;

        const scrollbarWidth =
            window.innerWidth - document.documentElement.clientWidth;
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

    if (isLoading) {
        return (
            <AnimatePresence>
                <motion.div
                    className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className='text-white text-lg'>Loading...</div>
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
                    <div className='text-white text-lg'>
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
                    className='fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-transparent'
                >
                    <motion.div
                        key='modal'
                        layoutId={`card-${id}`}
                        ref={modalRef}
                        tabIndex={-1}
                        onClick={(e) => e.stopPropagation()}
                        className='w-full max-w-[1500px] relative rounded-lg overflow-hidden flex flex-col lg:flex-row backdrop-blur-3xl border-2 bg-black/80 h-[95vh] sm:h-[90vh]'
                    >
                        <div className="absolute top-2 right-2 flex items-center gap-2 z-50">
                            <CreateReport
                                refId={artwork._id}
                                refType={RefType.ARTWORK}
                                url={window.location.href}
                                triggerElement={
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className='p-2 rounded-full hover:bg-black/20 transition-colors'
                                        aria-label='Report artwork'
                                    >
                                        <Flag className='w-5 h-5 text-white dark:text-gray-100' />
                                    </motion.button>
                                }
                            />
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className='p-2 rounded-full hover:bg-black/20 transition-colors'
                                onClick={handleClose}
                                aria-label='Close modal'
                            >
                                <X className='w-6 h-6 text-white dark:text-gray-100' />
                            </motion.button>
                        </div>

                        <motion.div
                            variants={contentVariants}
                            initial='initial'
                            animate='animate'
                            exit='exit'
                            className='flex-1 p-2 sm:p-4 flex items-center justify-center w-full lg:w-[65%] h-[50vh] lg:h-auto'
                        >
                            <Image
                                width={artwork.dimensions.width}
                                height={artwork.dimensions.height}
                                alt={artwork.title}
                                src={artwork.url}
                                className='max-w-full max-h-full object-contain rounded-md'
                                priority
                                placeholder='blur'
                                blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAErgHY/gfP4gAAAABJRU5ErkJggg=='
                            />
                        </motion.div>

                        <motion.div
                            className='flex-1 p-4 sm:p-6 lg:w-[35%] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col'
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className='flex-1 flex flex-col'>
                                {/* Custom Tabs */}
                                <div className='relative mb-3 sm:mb-4'>
                                    <div className='flex justify-start gap-2 sm:gap-3 border-b border-white/20'>
                                        <motion.button
                                            onClick={() =>
                                                setActiveTab('details')
                                            }
                                            className={`relative flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 text-base sm:text-lg font-medium text-white/90 rounded-t-md transition-colors ${
                                                activeTab === 'details'
                                                    ? 'bg-white/20 shadow-md text-white'
                                                    : 'text-white/60 hover:bg-white/5'
                                            }`}
                                            variants={tabVariants}
                                            initial='inactive'
                                            animate={
                                                activeTab === 'details'
                                                    ? 'active'
                                                    : 'inactive'
                                            }
                                            whileHover='hover'
                                        >
                                            <Info className='w-5 h-5 sm:w-6 h-6' />
                                            <span>Info</span>
                                            {activeTab === 'details' && (
                                                <motion.div
                                                    className='absolute bottom-0 left-0 h-0.5 bg-white w-full'
                                                    layoutId='underline'
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{
                                                        duration: 0.2
                                                    }}
                                                />
                                            )}
                                        </motion.button>
                                        <motion.button
                                            onClick={() =>
                                                setActiveTab('comments')
                                            }
                                            className={`relative flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 text-base sm:text-lg font-medium text-white/90 rounded-t-md transition-colors ${
                                                activeTab === 'comments'
                                                    ? 'bg-white/20 shadow-md text-white'
                                                    : 'text-white/60 hover:bg-white/5'
                                            }`}
                                            variants={tabVariants}
                                            initial='inactive'
                                            animate={
                                                activeTab === 'comments'
                                                    ? 'active'
                                                    : 'inactive'
                                            }
                                            whileHover='hover'
                                        >
                                            <BiComment className='w-5 h-5 sm:w-6 h-6' />
                                            <span>
                                                Comments (
                                                {(artwork as any)
                                                    .commentsCount || 0}
                                                )
                                            </span>
                                            {activeTab === 'comments' && (
                                                <motion.div
                                                    className='absolute bottom-0 left-0 h-0.5 bg-white w-full'
                                                    layoutId='underline'
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{
                                                        duration: 0.2
                                                    }}
                                                />
                                            )}
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Custom Tabs Content */}
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
                                            <ScrollArea className='h-full pr-4'>
                                                <div className='space-y-4'>
                                                    <h2 className='text-2xl sm:text-3xl font-bold text-white'>
                                                        {artwork.title}
                                                    </h2>
                                                    <div className='space-y-3 text-base sm:text-lg text-white'>
                                                        <div className='flex items-center gap-2'>
                                                            <UserIcon className='w-5 h-5 sm:w-6 h-6' />
                                                            <span>
                                                                {artwork.artist}
                                                            </span>
                                                        </div>
                                                        <div className='flex items-center gap-2'>
                                                            <DollarSignIcon className='w-5 h-5 sm:w-6 h-6' />
                                                            <span>
                                                                $
                                                                {artwork.price.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className='flex items-center gap-2'>
                                                            <RulerIcon className='w-5 h-5 sm:w-6 h-6' />
                                                            <span>
                                                                {
                                                                    artwork
                                                                        .dimensions
                                                                        .width
                                                                }
                                                                x
                                                                {
                                                                    artwork
                                                                        .dimensions
                                                                        .height
                                                                }
                                                                px
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Separator className='my-4 bg-white/20' />
                                                    <p className='text-base sm:text-lg text-white/90 leading-relaxed'>
                                                        {artwork.description}
                                                    </p>
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
                                            <ScrollArea className='h-full pr-4'>
                                                <div className='space-y-4'>
                                                    {Array.from({
                                                        length:
                                                            (artwork as any)
                                                                .commentsCount ||
                                                            3
                                                    }).map((_, idx) => (
                                                        <div
                                                            key={idx}
                                                            className='text-white/90 text-base sm:text-lg'
                                                        >
                                                            <p>
                                                                <strong>
                                                                    User{' '}
                                                                    {idx + 1}:
                                                                </strong>{' '}
                                                                Great artwork!
                                                            </p>
                                                            <Separator className='my-3 bg-white/10' />
                                                        </div>
                                                    ))}
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