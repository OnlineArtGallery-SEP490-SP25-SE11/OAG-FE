'use client';
import {artworkService} from '@/app/(public)/[locale]/artists/queries';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {Skeleton} from '@/components/ui/skeleton';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Badge} from '@/components/ui/badge';
import {vietnamCurrency} from '@/utils/converters';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {AnimatePresence, motion} from 'framer-motion';
import {CheckCircle2, Clock, Edit2, Eye, FilterX, Loader2, Search, ShieldAlert, Trash2, X, BookmarkIcon} from 'lucide-react';
import Image from 'next/image';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import EditArtworkForm from '../components/artist-update';
import ConfirmationDialog from '../components/confirmation-dialog';
import AddArtworkCollection from '@/components/ui.custom/add-artwork-collection';
import { ITEMS_PER_PAGE, STATUS_OPTIONS } from '../constant';
import { Artwork } from '../interface';
// Define moderation status options with icons and colors
const MODERATION_STATUS_OPTIONS = [
    {
        value: 'all',
        label: 'Tất cả',
        icon: Eye,
        color: 'bg-slate-500',
        textColor: 'text-slate-500',
        bgColor: 'bg-slate-100'
    },
    {
        value: 'pending',
        label: 'Đang chờ',
        icon: Clock,
        color: 'bg-amber-500',
        textColor: 'text-amber-500',
        bgColor: 'bg-amber-100'
    },
    {
        value: 'rejected',
        label: 'Từ chối',
        icon: ShieldAlert,
        color: 'bg-red-500',
        textColor: 'text-red-500',
        bgColor: 'bg-red-100'
    },
    {
        value: 'approved',
        label: 'Đã duyệt',
        icon: CheckCircle2,
        color: 'bg-emerald-500',
        textColor: 'text-emerald-500',
        bgColor: 'bg-emerald-100'
    },
];
export default function ManageArtworks() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const [isMobile, setIsMobile] = useState(false);
    const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || '');
    const [currentPage, setCurrentPage] = useState(Number(searchParams?.get('page')) || 1);
    const [statusFilter, setStatusFilter] = useState(searchParams?.get('status') || 'all');
    const [moderationStatusFilter, setModerationStatusFilter] = useState(
        searchParams?.get('moderationStatus') || 'all'
    );
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteArtworkId, setDeleteArtworkId] = useState<string | null>(null);
    const searchTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(searchParams?.toString());
        if (searchTerm) params.set('search', searchTerm); else params.delete('search');
        if (currentPage > 1) params.set('page', currentPage.toString()); else params.delete('page');
        if (statusFilter !== 'all') params.set('status', statusFilter); else params.delete('status');
        if (moderationStatusFilter !== 'all') params.set('moderationStatus', moderationStatusFilter); else params.delete('moderationStatus');
        const queryString = params.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname, {scroll: false});
    }, [currentPage, searchTerm, statusFilter, moderationStatusFilter, pathname, router, searchParams]);

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setSearchTerm(value);
            if (currentPage !== 1) setCurrentPage(1);
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = window.setTimeout(() => setDebouncedSearch(value), 400);
        },
        [currentPage]
    );

    const queryOptions = useMemo(
        () => ({
            title: debouncedSearch,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            moderationStatus: moderationStatusFilter !== 'all' ? moderationStatusFilter : undefined,
        }),
        [debouncedSearch, statusFilter, moderationStatusFilter]
    );

    const {data, error, isLoading, isFetching, refetch} = useQuery({
        queryKey: ['artworks', currentPage, debouncedSearch, statusFilter, moderationStatusFilter],
        queryFn: () => artworkService.getArtist(queryOptions, currentPage),
        placeholderData: (previousData: any) => previousData,
    });

    const deleteArtworkMutation = useMutation({
        mutationFn: (id: string) => artworkService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['artworks', currentPage, debouncedSearch, statusFilter, moderationStatusFilter]
            });
            refetch();
            setDeleteConfirmOpen(false);
            setDeleteArtworkId(null);
        },
        onError: (error) => console.error('Deletion failed:', error),
    });

    const artworks: Artwork[] = data?.data.artworks || [];
    const totalCount = data?.data.total || 0;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // Calculate counts by moderation status for badges
    const moderationCounts = useMemo(() => {
        const counts = {
            all: totalCount,
            pending: 0,
            rejected: 0,
            approved: 0
        };

        if (data?.data?.artworks) {
            data.data.artworks.forEach((artwork: Artwork) => {
                if (artwork.moderationStatus) {
                    counts[artwork.moderationStatus as keyof typeof counts] =
                        (counts[artwork.moderationStatus as keyof typeof counts] || 0) + 1;
                }
            });
        }

        return counts;
    }, [data?.data?.artworks, totalCount]);

    const resetFilters = useCallback(() => {
        setSearchTerm('');
        setDebouncedSearch('');
        setStatusFilter('all');
        setModerationStatusFilter('all');
        setCurrentPage(1);
    }, []);

    const handleStatusChange = useCallback((value: string) => {
        setStatusFilter(value);
        setCurrentPage(1);
    }, []);

    const handleModerationStatusChange = useCallback((value: string) => {
        setModerationStatusFilter(value);
        setCurrentPage(1);
    }, []);

    const renderPaginationItems = useCallback(() => {
        if (totalPages <= 5) {
            return Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                        className="text-xs md:text-sm text-teal-700 dark:text-teal-200"
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            ));
        }

        const items = [];
        items.push(
            <PaginationItem key={1}>
                <PaginationLink
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(1);
                    }}
                    isActive={currentPage === 1}
                    className="text-xs md:text-sm text-teal-700 dark:text-teal-200"
                >
                    1
                </PaginationLink>
            </PaginationItem>
        );

        if (currentPage > 3) items.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis/></PaginationItem>);

        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);
        for (let i = startPage; i <= endPage; i++) {
            if (i <= 1 || i >= totalPages) continue;
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i);
                        }}
                        isActive={currentPage === i}
                        className="text-xs md:text-sm text-teal-700 dark:text-teal-200"
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (currentPage < totalPages - 2) items.push(<PaginationItem
            key="end-ellipsis"><PaginationEllipsis/></PaginationItem>);
        if (totalPages > 1) {
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(totalPages);
                        }}
                        isActive={currentPage === totalPages}
                        className="text-xs md:text-sm text-teal-700 dark:text-teal-200"
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    }, [currentPage, totalPages]);

    const getStatusColor = (status: string) => {
        const option = STATUS_OPTIONS.find((opt) => opt.value === status);
        return option ? option.color : 'bg-gray-500';
    };

    const getModerationStatusInfo = (status: string) => {
        const option = MODERATION_STATUS_OPTIONS.find(opt => opt.value === status) ||
            MODERATION_STATUS_OPTIONS[0]; // Default to 'all'
        return option;
    };

    const renderArtworkCard = useCallback(
        (artwork: Artwork, index: number) => {
            const imageUrl = artwork.url || '/placeholder.svg';
            const statusColor = getStatusColor(artwork.status);
            const moderationStatus = artwork.moderationStatus || 'pending';
            const moderationInfo = getModerationStatusInfo(moderationStatus);
            const ModIcon = moderationInfo.icon;

			return (
				<motion.div
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
					className="group relative hover:shadow-lg transition-all duration-300"
				>
					<Card className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
						<div className={`relative ${isMobile ? 'aspect-[4/5]' : 'aspect-[2/3]'}`}>
							<Image
								src={imageUrl}
								alt={artwork.title}
								fill
								className="object-cover transition-transform duration-300 group-hover:scale-105"
								placeholder="blur"
								blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+"
							/>
							<motion.div
								className="absolute inset-0 bg-gradient-to-t from-teal-900/80 via-teal-900/50 to-transparent p-2 md:p-3 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-200"
								initial={{ opacity: 0, y: 10 }}
								whileHover={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2, ease: 'easeInOut' }}
							>
								<div className="space-y-1 md:space-y-2 flex-1">
									<h3 className="text-sm md:text-base font-semibold text-white line-clamp-1">
										{artwork.title}
									</h3>
									<p className="text-xs md:text-sm text-teal-100 line-clamp-2">
										{artwork.description}
									</p>
									<p className="text-xs md:text-sm font-medium text-teal-50">
										{vietnamCurrency(artwork.price)}
									</p>
									{artwork.views > 0 && (
										<p className="text-xs text-teal-200">
											{artwork.views.toLocaleString()} lượt xem
										</p>
									)}
								</div>
								
								{/* Add Collection Button */}
								<div className="mt-2 mb-1">
									<AddArtworkCollection 
										artworkId={artwork._id}
										triggerButton={
											<Button 
												size="sm"
												className="w-full bg-teal-500/80 hover:bg-teal-600/90 text-white backdrop-blur-sm text-xs md:text-sm flex items-center justify-center gap-1"
											>
												<BookmarkIcon className="h-3 w-3" /> Lưu bộ sưu tập
											</Button>
										}
									/>
								</div>
								
								<div className="mt-2 flex gap-1">
									{/* Sửa đổi 3: Cập nhật màu và thêm icon cho nút Sửa */}
									<Button
										size="sm"
										className="flex-1 bg-teal-600 hover:bg-teal-700 text-white backdrop-blur-sm text-xs md:text-sm flex items-center justify-center gap-1"
										onClick={() => {
											setSelectedArtwork(artwork);
											setEditModalOpen(true);
										}}
									>
										<Edit2 className="h-3 w-3" /> Sửa
									</Button>
									{/* Sửa đổi 3: Cập nhật màu và thêm icon cho nút Xóa */}
									<Button
										size="sm"
										variant="destructive"
										className="flex-1 bg-red-600 hover:bg-red-700 text-white backdrop-blur-sm text-xs md:text-sm flex items-center justify-center gap-1"
										onClick={() => {
											setDeleteArtworkId(artwork._id);
											setDeleteConfirmOpen(true);
										}}
									>
										<Trash2 className="h-3 w-3" /> Xóa
									</Button>
								</div>
							</motion.div>
							<motion.div
								className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor} text-white shadow-sm`}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3, delay: 0.1 + index * 0.05, ease: 'easeOut' }}
							>
								{artwork.status}
							</motion.div>
						</div>
					</Card>
				</motion.div>
			);
		},
		[isMobile]
	);

    const renderSkeletons = useCallback(() =>
        Array.from({length: ITEMS_PER_PAGE}).map((_, index) => (
            <motion.div
                key={`skeleton-${index}`}
                initial={{opacity: 0, y: 15}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4, delay: index * 0.05, ease: 'easeOut'}}
                className="group relative"
            >
                <Card
                    className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                    <div className={`relative ${isMobile ? 'aspect-[4/5]' : 'aspect-[2/3]'}`}>
                        <Skeleton className="w-full h-full rounded-lg absolute inset-0"/>
                        <div className="absolute bottom-0 left-0 right-0 p-2 space-y-1">
                            <Skeleton className="h-4 w-3/4"/>
                            <Skeleton className="h-3 w-5/6"/>
                            <Skeleton className="h-3 w-1/2"/>
                        </div>
                        <Skeleton className="absolute top-2 left-2 h-5 w-20 rounded-full"/>
                        <Skeleton className="absolute top-2 right-2 h-4 w-16 rounded-full"/>
                    </div>
                </Card>
            </motion.div>
        )), [isMobile]);

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.6, ease: 'easeOut'}}
            className="p-3 md:p-6 space-y-3 md:space-y-4 max-w-6xl mx-auto"
        >
            {/* Header */}
            <motion.div
                initial={{opacity: 0, y: -15}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.1, ease: 'easeOut'}}
            >
                <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
                    Quản lý tác phẩm
                </h1>
                <p className="text-xs md:text-sm text-teal-600 dark:text-cyan-400 mt-1">
                    Tổng cộng {totalCount} tác phẩm
                </p>
            </motion.div>

            {/* Moderation Status Tabs */}
            <motion.div
                initial={{opacity: 0, y: -10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.15, ease: 'easeOut'}}
            >
                <Tabs
                    defaultValue={moderationStatusFilter}
                    onValueChange={handleModerationStatusChange}
                    className="w-full"
                >
                    <TabsList className="w-full grid grid-cols-4 bg-teal-50 dark:bg-gray-800 p-1 rounded-lg mb-3">
                        {MODERATION_STATUS_OPTIONS.map(option => (
                            <TabsTrigger
                                key={option.value}
                                value={option.value}
                                className="flex items-center justify-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                            >
                                <option.icon className="h-3.5 w-3.5"/>
                                <span className="hidden md:inline">{option.label}</span>
                                <Badge className={`${option.bgColor} ${option.textColor} border-0 px-1.5 py-0`}>
                                    {option.value === 'all'
                                        ? totalCount
                                        : moderationCounts[option.value as keyof typeof moderationCounts] || 0}
                                </Badge>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Filters */}
                    <motion.div
                        initial={{opacity: 0, y: -10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.2, ease: 'easeOut'}}
                        className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3 mb-3"
                    >
                        <div className="relative flex-1 max-w-md">
                            <Search
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-teal-500 dark:text-teal-400 h-4 w-4"/>
                            <Input
                                type="text"
                                placeholder="Tìm theo tiêu đề..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="pl-8 rounded-lg border-gray-200 dark:border-gray-700 shadow-sm text-sm focus:ring-2 focus:ring-teal-500 h-9 bg-gray-50 dark:bg-gray-700/30 text-gray-700 dark:text-gray-200"
                            />
                            {searchTerm && (
                                <motion.button
                                    initial={{opacity: 0, scale: 0.8}}
                                    animate={{opacity: 1, scale: 1}}
                                    onClick={() => {
                                        setSearchTerm('');
                                        setDebouncedSearch('');
                                        if (currentPage !== 1) setCurrentPage(1);
                                    }}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-teal-500 hover:text-teal-600 dark:hover:text-teal-300"
                                    transition={{duration: 0.2}}
                                >
                                    <FilterX className="h-4 w-4"/>
                                </motion.button>
                            )}
                        </div>
                        <Select value={statusFilter} onValueChange={handleStatusChange}>
                            <SelectTrigger
                                className="w-full max-w-[140px] rounded-lg border-gray-200 dark:border-gray-700 shadow-sm text-sm h-9 bg-gray-50 dark:bg-gray-700/30 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-teal-500">
                                <SelectValue placeholder="Trạng thái"/>
                            </SelectTrigger>
                            <SelectContent className="rounded-lg">
                                {STATUS_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}
                                                className="text-sm text-gray-700 dark:text-gray-200">
                                        <span
                                            className={`inline-block w-2 h-2 rounded-full ${option.color} mr-2`}></span>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {(debouncedSearch || statusFilter !== 'all') && (
                            <motion.div
                                initial={{opacity: 0, scale: 0.8}}
                                animate={{opacity: 1, scale: 1}}
                                exit={{opacity: 0, scale: 0.8}}
                                transition={{duration: 0.2}}
                            >
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={resetFilters}
                                    className="h-9 w-9 rounded-lg border-teal-200 dark:border-teal-600 text-teal-500 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-700/50"
                                >
                                    <FilterX className="h-4 w-4"/>
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Content for each tab */}
                    {MODERATION_STATUS_OPTIONS.map(option => (
                        <TabsContent key={option.value} value={option.value} className="mt-0">
                            {/* Pagination (Mobile: Top only) */}
                            {totalPages > 0 && isMobile && (
                                <motion.div
                                    initial={{opacity: 0, y: -10}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.5, delay: 0.3, ease: 'easeOut'}}
                                    className="mb-3"
                                >
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                                                    }}
                                                    className={currentPage === 1 ? 'pointer-events-none opacity-50 text-teal-500 dark:text-teal-400' : 'text-teal-500 dark:text-teal-400'}
                                                />
                                            </PaginationItem>
                                            {renderPaginationItems()}
                                            <PaginationItem>
                                                <PaginationNext
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                                                    }}
                                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50 text-teal-500 dark:text-teal-400' : 'text-teal-500 dark:text-teal-400'}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </motion.div>
                            )}

                            {/* Main Content */}
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        exit={{opacity: 0}}
                                        transition={{duration: 0.5}}
                                        className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3"
                                    >
                                        {renderSkeletons()}
                                    </motion.div>
                                ) : error ? (
                                    <motion.div
                                        key="error"
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        exit={{opacity: 0}}
                                        transition={{duration: 0.5}}
                                        className="text-center py-6 space-y-2 border rounded-lg bg-emerald-50 dark:bg-teal-900/30"
                                    >
                                        <p className="text-sm text-red-500 dark:text-red-400 font-medium">
                                            Lỗi khi tải tác phẩm
                                        </p>
                                        <Button variant="outline" onClick={() => refetch()}
                                                className="text-sm text-teal-700 dark:text-teal-200 border-teal-200 dark:border-teal-600 hover:bg-teal-100 dark:hover:bg-teal-700/50">
                                            Thử lại
                                        </Button>
                                    </motion.div>
                                ) : artworks.length === 0 ? (
                                    <motion.div
                                        key="empty"
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        exit={{opacity: 0}}
                                        transition={{duration: 0.5}}
                                        className="text-center py-6 border rounded-lg bg-emerald-50 dark:bg-teal-900/30 space-y-2"
                                    >
                                        <div className="flex justify-center">
                                            <option.icon className={`h-8 w-8 ${option.textColor}`}/>
                                        </div>
                                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-200">
                                            Không tìm thấy tác
                                            phẩm {option.value !== 'all' ? `trạng thái "${option.label}"` : ''}
                                        </p>
                                        <p className="text-xs text-teal-600 dark:text-teal-400">
                                            {debouncedSearch || statusFilter !== 'all' ? 'Thay đổi bộ lọc để thử lại' : 'Thêm tác phẩm đầu tiên của bạn'}
                                        </p>
                                        {(debouncedSearch || statusFilter !== 'all') && (
                                            <Button variant="outline" onClick={resetFilters}
                                                    className="text-sm text-teal-700 dark:text-teal-200 border-teal-200 dark:border-teal-600 hover:bg-teal-100 dark:hover:bg-teal-700/50">
                                                Xóa bộ lọc
                                            </Button>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="content"
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        exit={{opacity: 0}}
                                        transition={{duration: 0.5}}
                                    >
                                        <div className="relative">
                                            <AnimatePresence>
                                                {isFetching && !isLoading && (
                                                    <motion.div
                                                        initial={{opacity: 0}}
                                                        animate={{opacity: 1}}
                                                        exit={{opacity: 0}}
                                                        className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 flex items-center justify-center z-10 rounded-lg backdrop-blur-sm"
                                                        transition={{duration: 0.3}}
                                                    >
                                                        <Loader2 className="h-6 w-6 text-teal-500 animate-spin"/>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                                                {artworks.map((artwork, index) => renderArtworkCard(artwork, index))}
                                            </div>
                                        </div>

                                        {/* Pagination (Desktop: Bottom only) */}
                                        {totalPages > 0 && !isMobile && (
                                            <motion.div
                                                initial={{opacity: 0, y: 15}}
                                                animate={{opacity: 1, y: 0}}
                                                transition={{duration: 0.5, delay: 0.3, ease: 'easeOut'}}
                                                className="mt-4"
                                            >
                                                <Pagination>
                                                    <PaginationContent>
                                                        <PaginationItem>
                                                            <PaginationPrevious
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                                                                }}
                                                                className={currentPage === 1 ? 'pointer-events-none opacity-50 text-teal-500 dark:text-teal-400' : 'text-teal-500 dark:text-teal-400'}
                                                            />
                                                        </PaginationItem>
                                                        {renderPaginationItems()}
                                                        <PaginationItem>
                                                            <PaginationNext
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                                                                }}
                                                                className={currentPage === totalPages ? 'pointer-events-none opacity-50 text-teal-500 dark:text-teal-400' : 'text-teal-500 dark:text-teal-400'}
                                                            />
                                                        </PaginationItem>
                                                    </PaginationContent>
                                                </Pagination>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </TabsContent>
                    ))}
                </Tabs>
            </motion.div>

            {/* Edit Modal */}
            {isEditModalOpen && selectedArtwork && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
                >
                    <motion.div
                        initial={{scale: 0.7, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        exit={{scale: 0.7, opacity: 0}}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Chỉnh sửa tác
                                phẩm</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="h-5 w-5"/>
                            </Button>
                        </div>
                        <EditArtworkForm artwork={selectedArtwork} onClose={() => setEditModalOpen(false)}/>
                    </motion.div>
                </motion.div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={isDeleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                onConfirm={() => {
                    if (deleteArtworkId) deleteArtworkMutation.mutate(deleteArtworkId);
                }}
                message="Bạn có chắc chắn muốn xóa tác phẩm này không?"
                // confirmText="Xóa"
                // cancelText="Hủy"
            />
        </motion.div>
    );
}