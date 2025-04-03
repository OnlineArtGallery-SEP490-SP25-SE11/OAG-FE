'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { getArtworkWarehouse, downloadWarehouseArtwork } from '@/service/artwork-warehouse';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Download, Image as ImageIcon, ExternalLink, Calendar, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const ITEMS_PER_PAGE = 9;

export default function WarehouseClient() {
    const { data: session } = useSession();
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState('all');
    
    // Lấy danh sách tranh trong kho
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['artworkWarehouse', page, activeTab],
        queryFn: () => getArtworkWarehouse(
            session?.user.accessToken as string, 
            { 
                page, 
                limit: ITEMS_PER_PAGE,
                filter: activeTab !== 'all' ? activeTab : undefined
            }
        ),
        enabled: !!session?.user.accessToken
    });
    
    const warehouseItems = data?.data?.items || [];
    const totalItems = data?.data?.total || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    const handleDownload = async (warehouseItemId: string, title: string) => {
        try {
            const toastId = toast.loading(`Đang tải ${title}...`);
            
            const blob = await downloadWarehouseArtwork(
                session?.user.accessToken as string,
                warehouseItemId
            );
            
            // Tạo URL từ blob và tải file
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${title || 'artwork'}.jpg`;
            document.body.appendChild(link);
            link.click();
            
            // Dọn dẹp
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
                toast.dismiss(toastId);
                toast.success(`Đã tải ${title} thành công`);
                refetch(); // Cập nhật lại dữ liệu để cập nhật downloadCount
            }, 100);
        } catch (error) {
            toast.error('Không thể tải ảnh. Vui lòng thử lại sau.');
        }
    };
    
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };
    
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    };
    
    // Render danh sách tranh
    const renderWarehouseItems = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index} className="overflow-hidden bg-white/5 border border-white/10">
                            <Skeleton className="w-full h-52" />
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2 mt-2" />
                            </CardHeader>
                            <CardFooter>
                                <Skeleton className="h-9 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            );
        }
        
        if (error || !warehouseItems.length) {
            return (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
                    <div className="bg-white/5 p-4 rounded-full">
                        <ImageIcon className="h-12 w-12 text-white/50" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Chưa có tranh nào trong kho</h3>
                    <p className="text-white/70 max-w-md">
                        Bạn chưa mua tranh nào. Hãy khám phá và mua các tác phẩm nghệ thuật để thêm vào kho tranh của mình.
                    </p>
                    <div className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/artworks')}
                        >
                            Khám phá tranh
                        </Button>
                    </div>
                </div>
            );
        }
        
        return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {warehouseItems.map((item) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="overflow-hidden h-full flex flex-col bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                                <div className="relative w-full h-52 overflow-hidden">
                                    <Image
                                        src={item.artworkId.url}
                                        alt={item.artworkId.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Badge className="bg-blue-500/80 text-white">
                                            {item.downloadCount > 0 ? `Đã tải ${item.downloadCount} lần` : 'Chưa tải'}
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-white truncate">{item.artworkId.title}</CardTitle>
                                    <CardDescription>
                                        Nghệ sĩ: {item.artworkId.artistId?.name || 'Không xác định'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow pt-0">
                                    <div className="space-y-2 text-xs text-white/60">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            <span>Mua ngày: {formatDate(item.purchasedAt)}</span>
                                        </div>
                                        {item.downloadedAt && (
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-3 w-3" />
                                                <span>Tải lần cuối: {formatDate(item.downloadedAt)}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-2 gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleDownload(item._id, item.artworkId.title)}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Tải ảnh
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={() => router.push(`/artworks/${item.artworkId._id}`)}
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
                
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </>
        );
    };
    
    return (
        <div className="container py-8">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Kho tranh của tôi</h1>
                    <p className="text-white/70">
                        Truy cập và tải xuống các tác phẩm nghệ thuật bạn đã mua.
                    </p>
                </div>
                
                <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="all">Tất cả</TabsTrigger>
                        <TabsTrigger value="recent">Mới mua</TabsTrigger>
                        <TabsTrigger value="downloaded">Đã tải</TabsTrigger>
                        <TabsTrigger value="not_downloaded">Chưa tải</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="space-y-6">
                        {renderWarehouseItems()}
                    </TabsContent>
                    
                    <TabsContent value="recent" className="space-y-6">
                        {renderWarehouseItems()}
                    </TabsContent>
                    
                    <TabsContent value="downloaded" className="space-y-6">
                        {renderWarehouseItems()}
                    </TabsContent>
                    
                    <TabsContent value="not_downloaded" className="space-y-6">
                        {renderWarehouseItems()}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // Tạo mảng các trang để hiển thị
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        
        if (totalPages <= maxPagesToShow) {
            // Hiển thị tất cả trang nếu tổng số trang ít hơn maxPagesToShow
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Hiển thị một phần với "..." khi có nhiều trang
            if (currentPage <= 3) {
                // Khi ở gần trang đầu
                for (let i = 1; i <= 3; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Khi ở gần trang cuối
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 2; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                // Ở giữa
                pageNumbers.push(1);
                pageNumbers.push('...');
                pageNumbers.push(currentPage - 1);
                pageNumbers.push(currentPage);
                pageNumbers.push(currentPage + 1);
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }
        
        return pageNumbers;
    };
    
    return (
        <div className="flex items-center gap-1">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {getPageNumbers().map((pageNumber, index) => (
                pageNumber === '...' ? (
                    <div key={`ellipsis-${index}`} className="px-3 py-1 text-sm text-white/50">...</div>
                ) : (
                    <Button
                        key={`page-${pageNumber}`}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(Number(pageNumber))}
                        className="h-8 w-8"
                    >
                        {pageNumber}
                    </Button>
                )
            ))}
            
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}