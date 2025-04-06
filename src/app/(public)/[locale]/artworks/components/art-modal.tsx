import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';
import { DollarSignIcon, Eye, Info, RulerIcon, TagIcon, UserIcon, X, CalendarIcon, BookmarkIcon, Flag, ShoppingCart, Download } from 'lucide-react';
import Image from 'next/image';
import { Fragment, memo, useCallback, useEffect, useRef, useState } from 'react';
import { BiComment } from 'react-icons/bi';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchArtworkById } from '@/app/(public)/[locale]/artworks/api';
import { Artwork } from '@/types/marketplace';
import CreateReport from '@/components/ui.custom/report-button';
import { RefType } from '@/utils/enums';
import { Button } from '@/components/ui/button';
import AddArtworkCollection from '@/components/ui.custom/add-artwork-collection';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSwipeable } from 'react-swipeable';
import { useToast } from '@/hooks/use-toast';
import { getUserBalance, purchaseArtwork, downloadArtwork } from '@/service/artwork';
import { getArtworkWarehouse, downloadWarehouseArtwork } from '@/service/artwork-warehouse';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AlertCircle, Check } from 'lucide-react';
import { checkUserPurchased } from '@/service/artwork';
import { useTranslations } from 'next-intl';

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
    const t = useTranslations();
    const tCommon = useTranslations('common');
    const { toast } = useToast();

    const router = useRouter();
    const pathname = usePathname();
    const modalRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState('details');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const [showBuyConfirm, setShowBuyConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadToken, setDownloadToken] = useState<string | null>(null);

    const { data: balanceData } = useQuery({
        queryKey: ['userBalance'],
        queryFn: () => getUserBalance(session?.user.accessToken as string),
        enabled: !!session?.user.accessToken && !!id
    });

    const userBalance = balanceData?.data?.balance || 0;

    const { data: purchaseData } = useQuery({
        queryKey: ['userPurchased', id],
        queryFn: () => checkUserPurchased(session?.user.accessToken as string, id as string),
        enabled: !!session?.user.accessToken && !!id
    });

    const userHasPurchased = purchaseData?.data?.hasPurchased || false;

    const purchaseMutation = useMutation({
        mutationFn: () => purchaseArtwork(session?.user.accessToken as string, id as string),
        onMutate: () => {
            setIsProcessing(true);
        },
        onSuccess: (response) => {
            setIsProcessing(false);

            if (response.data?.success) {
                setDownloadToken(response.data?.downloadUrl || null);
                setShowBuyConfirm(false);
                setShowSuccess(true);
                toast({
                    title: t('artwork.purchase_success'),
                    description: t('artwork.purchase_success'),
                });

                queryClient.invalidateQueries({ queryKey: ['userBalance'] });
                queryClient.invalidateQueries({ queryKey: ['userPurchased', id] });
                queryClient.invalidateQueries({ queryKey: ['artworks', id] });
            } else {
                if (response.message?.includes('không đủ')) {
                    toast({
                        title: t('wallet.insufficient_balance'),
                        description: t('wallet.insufficient_balance'),
                    });
                    router.push('/wallet/deposit');
                } else if (response.message?.includes('đã mua')) {
                    toast({
                        title: t('artwork.already_purchased'),
                        description: t('artwork.already_purchased'),
                    });
                } else {
                    toast({ title: response.message || t('common.error'), description: response.message || t('common.error') });
                }
            }
        },
        onError: () => {
            setIsProcessing(false);
            toast({ title: t('common.error'), description: t('common.error') });
        }
    });

    const handleBuy = () => {
        if (!session) {
            toast({ title: t('error.authenticationError'), description: t('error.authenticationError') });
            router.push('/auth/login');
            return;
        }

        if (userHasPurchased) {
            toast({ title: t('artwork.already_purchased'), description: t('artwork.already_purchased') });
            return;
        }

        setShowBuyConfirm(true);
    };

    const confirmBuy = () => {
        if (artwork.price > userBalance) {
            toast({
                title: t('wallet.insufficient_balance'),
                description: t('wallet.insufficient_balance'),
            });
            setShowBuyConfirm(false);
            router.push('/wallet/deposit');
            return;
        }

        purchaseMutation.mutate();
    };

    const handleDownload = async () => {
        if (!id) return;

        try {
            toast({
                title: t('artwork.downloading'),
                description: t('artwork.downloading'),
            });

            let blobData: Blob;

            if (downloadToken) {
                blobData = await downloadArtwork(
                    session?.user.accessToken as string,
                    id,
                    downloadToken
                );
            } else {
                const warehouseResponse = await getArtworkWarehouse(
                    session?.user.accessToken as string,
                );

                if (!warehouseResponse.data?.items?.length) {
                    toast({
                        title: t('artwork.download_error'),
                        description: t('artwork.download_error'),
                    });
                    return;
                }

                const warehouseItemId = warehouseResponse.data.items[0]._id;
                blobData = await downloadWarehouseArtwork(
                    session?.user.accessToken as string,
                    warehouseItemId
                );
            }

            const url = window.URL.createObjectURL(blobData);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${artwork.title || 'artwork'}.jpg`;
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
                toast({
                    title: t('artwork.download_success'),
                    description: t('artwork.download_success'),
                });

                queryClient.invalidateQueries({ queryKey: ['artworkWarehouse'] });
            }, 100);
        } catch (error) {
            console.error('Lỗi khi tải ảnh:', error);
            toast({
                title: t('artwork.download_error'),
                description: t('artwork.download_error'),
            });
        }
    };

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
    const isArtworkCreator = session &&
        artwork &&
        artwork.artistId &&
        session.user.id === artwork.artistId._id;

    console.log('isArtworkCreator', isArtworkCreator);

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
                        {t('common.loading')}
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
                        {t('common.error')}
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    if (!artwork || !artwork.dimensions) {
        return (
            <AnimatePresence>
                <motion.div
                    className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className='text-white text-lg bg-yellow-500/20 p-4 rounded-lg'>
                        {t('artwork.no_artwork_info')}
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

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
              `}><div className="absolute top-2 right-2 flex items-center gap-2 z-50">
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

                            <div className='absolute bottom-2 left-2 right-2 flex justify-center pointer-events-none'>
                                <span className='text-xs text-white/70 bg-black/40 px-2 py-1 rounded-full backdrop-blur-md sm:hidden'>
                                    {isZoomed ? t('artwork.zoom_out') : t('artwork.zoom_in')}
                                </span>
                            </div>
                        </motion.div>

                        <motion.div
                            className='flex-1 p-3 sm:p-4 md:p-6 lg:w-[40%] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col bg-black/80'
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            {...swipeHandlers}
                        >
                            <div className='flex-1 flex flex-col'>
                                <div className='relative mb-2 sm:mb-3'>
                                    <div className='flex justify-start gap-1 sm:gap-3 border-b border-white/20'>
                                        <motion.button
                                            onClick={() => setActiveTab('details')}
                                            className={`relative flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base md:text-lg font-medium text-white/90 rounded-t-md transition-colors ${activeTab === 'details'
                                                ? 'bg-white/10 shadow-md text-white'
                                                : 'text-white/60 hover:bg-white/5'
                                                }`}
                                            variants={tabVariants}
                                            initial='inactive'
                                            animate={activeTab === 'details' ? 'active' : 'inactive'}
                                            whileHover='hover'
                                        >
                                            <Info className='w-4 h-4 sm:w-5 sm:h-5' />
                                            <span>{t('artwork.info')}</span>
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
                                            className={`relative flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base md:text-lg font-medium text-white/90 rounded-t-md transition-colors ${activeTab === 'comments'
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
                                                {t('artwork.comments')} {((artwork as any)?.commentsCount || 0) > 0 && `(${(artwork as any).commentsCount})`}
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

                                    <div className='text-xs text-white/50 mt-1 text-center sm:hidden'>
                                        {t('artwork.swipe_to_change_tabs')}
                                    </div>
                                </div>

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

                                                    {artwork.price > 0 && (
                                                        <div className='bg-white/10 hover:bg-white/15 transition-colors rounded-lg p-2 sm:p-3'>
                                                            <div className='flex items-center justify-between gap-2 sm:gap-3'>
                                                                <div className='flex items-center gap-2 sm:gap-3'>
                                                                    <DollarSignIcon className='w-5 h-5 sm:w-6 sm:h-6 text-white/70' />
                                                                    <div>
                                                                        <p className='text-xs sm:text-sm text-white/70'>{t('artwork.price')}</p>
                                                                        <p className='font-semibold text-white text-lg sm:text-xl'>
                                                                            ${artwork.price.toLocaleString()}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {(artwork.status?.toLowerCase() === 'selling') && !userHasPurchased && !isArtworkCreator && (
                                                                    <Button
                                                                        onClick={handleBuy}
                                                                        className="bg-green-500 hover:bg-green-600 text-white"
                                                                        size="sm"
                                                                    >
                                                                        <ShoppingCart className="mr-1 h-4 w-4" />
                                                                        {t('artwork.buy_now')}
                                                                    </Button>
                                                                )}

                                                                {isArtworkCreator && (
                                                                    <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-2 py-1">
                                                                        {t('artwork.your_work')}
                                                                    </Badge>
                                                                )}

                                                                {!isArtworkCreator && userHasPurchased && (
                                                                    <Button
                                                                        onClick={handleDownload}
                                                                        className="bg-blue-500 hover:bg-blue-600 text-white"
                                                                        size="sm"
                                                                        disabled={!downloadToken && isProcessing}
                                                                    >
                                                                        <Download className="mr-1 h-4 w-4" />
                                                                        {t('artwork.download_image')}
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {artwork.artistId && (
                                                        <div className="flex items-center justify-between bg-white/10 hover:bg-white/15 transition-colors rounded-lg p-2 sm:p-3">
                                                            <div className="flex items-center gap-2 sm:gap-3">
                                                                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-white/20">
                                                                    <AvatarImage
                                                                        src={artwork.artistId.image}
                                                                        alt={artwork.artistId.name || "Artist"}
                                                                    />
                                                                    <AvatarFallback className="bg-white/10 text-white">
                                                                        {artwork.artistId.name?.charAt(0) || <UserIcon className="h-4 w-4" />}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className='text-xs sm:text-sm text-white/70'>{t('artwork.artist')}</p>
                                                                    <p className='font-medium text-white text-sm sm:text-base'>
                                                                        {artwork.artistId.name || 'Unknown Artist'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline" className="bg-white/5 hover:bg-white/10 text-xs sm:text-sm whitespace-nowrap">
                                                                {t('artwork.view_profile')}
                                                            </Badge>
                                                        </div>
                                                    )}

                                                    <div className='mt-4'>
                                                        <AddArtworkCollection
                                                            artworkId={artwork._id}
                                                            triggerButton={
                                                                <Button
                                                                    className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white"
                                                                >
                                                                    <BookmarkIcon className="w-5 h-5" />
                                                                    {t('artwork.add_to_collection')}
                                                                </Button>
                                                            }
                                                            onSuccess={() => {
                                                                // Optional: You can add additional success handling here
                                                            }}
                                                        />
                                                    </div>

                                                    <div className='bg-white/10 rounded-lg p-3 sm:p-4 border border-white/5'>
                                                        <h3 className='text-base sm:text-lg font-medium text-white mb-2 sm:mb-3'>
                                                            {t('artwork.description')}
                                                        </h3>
                                                        <div className="max-h-[150px] sm:max-h-[250px] overflow-auto pr-2">
                                                            <p className='text-sm sm:text-base text-white/90 leading-relaxed whitespace-pre-line'>
                                                                {artwork.description || 'No description available.'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {artwork.category && artwork.category.length > 0 && (
                                                        <div className='space-y-1.5 sm:space-y-2'>
                                                            <div className='flex items-center gap-1.5'>
                                                                <TagIcon className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70' />
                                                                <span className='text-xs sm:text-sm text-white/70'>{t('artwork.categories')}</span>
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
                                                    <div className='bg-white/5 p-2 sm:p-3 rounded-lg'>
                                                        <div className='flex gap-2'>
                                                            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                                                                <AvatarFallback className="bg-white/20">
                                                                    {t('common.you')}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <input
                                                                type="text"
                                                                placeholder={t('artwork.add_comment')}
                                                                className="w-full bg-white/10 text-white text-sm rounded-full px-3 py-1.5 border border-transparent focus:border-white/30 focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>

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
                                                            {t('artwork.no_comments')}
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

            <AlertDialog open={showBuyConfirm} onOpenChange={setShowBuyConfirm}>
                <AlertDialogContent className="bg-black border border-white/20 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('artwork.purchase_confirmation')}</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/80">
                            <div className="space-y-4 my-4">
                                <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                                    <h3 className="font-medium mb-1">{artwork.title}</h3>
                                    <p className="text-sm text-white/70">{t('artwork.artist')}: {artwork.artistId?.name || t('artwork.unknown_artist')}</p>
                                    <p className="text-xl font-bold mt-2">${artwork.price?.toLocaleString()}</p>
                                </div>

                                <div className="bg-white/5 p-3 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span>{t('wallet.current_balance')}:</span>
                                        <span className="font-medium">${userBalance?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span>{t('wallet.after_purchase')}:</span>
                                        <span className={`font-medium ${userBalance < artwork.price ? 'text-red-400' : ''}`}>
                                            ${(userBalance - artwork.price)?.toLocaleString()}
                                        </span>
                                    </div>

                                    {userBalance < artwork.price && (
                                        <div className="mt-2 flex items-start gap-2 text-red-400 bg-red-400/10 p-2 rounded">
                                            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm">{t('wallet.insufficient_balance')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-2">
                        <AlertDialogCancel className="bg-white/10 hover:bg-white/20 text-white border-0">{tCommon('cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmBuy}
                            className="bg-green-500 hover:bg-green-600 text-white"
                            disabled={userBalance < artwork.price || isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    {t('common.processing')}
                                </>
                            ) : (
                                t('artwork.confirm_purchase')
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
                <AlertDialogContent className="bg-black border border-white/20 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('artwork.purchase_success')}</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/80">
                            <div className="text-center my-4 space-y-4">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                    <Check className="h-8 w-8 text-green-500" />
                                </div>
                                <p>{t('artwork.thank_you_purchase', { title: artwork.title })}</p>
                                <p className="text-sm">{t('artwork.download_now')}</p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-2">
                        <AlertDialogCancel className="bg-white/10 hover:bg-white/20 text-white border-0">
                            {tCommon('close')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDownload}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            {t('artwork.download_image')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Fragment>
    );
}

export default memo(Modal);