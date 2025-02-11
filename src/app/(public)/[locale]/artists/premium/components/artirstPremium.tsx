'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function ArtistPremium() {
    const tinhNangPremium = [
        'Không giới hạn tác phẩm',
        'Hỗ trợ ưu tiên 24/7',
        'Phòng trưng bày tùy chỉnh',
        'Công cụ phân tích chuyên sâu'
    ];

    return (
        <div className='container mx-auto py-16'>
            <div className='text-center mb-16'>
                <h1 className='text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
                    Gói Dịch Vụ Dành Cho Nghệ Sĩ
                </h1>
                <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
                    Nâng tầm sự nghiệp nghệ thuật của bạn với các gói dịch vụ đặc quyền
                </p>
            </div>

            <div className='max-w-5xl mx-auto grid gap-8 md:grid-cols-2 items-center'>
                {/* Gói Cơ Bản */}
                <Card className='transform transition-all duration-300 hover:scale-105'>
                    <CardHeader>
                        <CardTitle className='text-2xl'>Gói Cơ Bản</CardTitle>
                        <CardDescription className='text-base'>
                            Khởi đầu hành trình nghệ thuật của bạn
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='text-4xl font-bold mb-8 text-center'>
                            0đ <span className='text-base font-normal'>/tháng</span>
                        </div>
                        <ul className='space-y-4'>
                            {['Đăng tối đa 5 tác phẩm', 'Hỗ trợ cơ bản', 'Phòng trưng bày tiêu chuẩn'].map(
                                (feature) => (
                                    <li key={feature} className='flex items-center space-x-3'>
                                        <Check className='h-5 w-5 text-muted-foreground' />
                                        <span>{feature}</span>
                                    </li>
                                )
                            )}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className='w-full py-6 text-lg' variant='outline'>
                            Gói Hiện Tại
                        </Button>
                    </CardFooter>
                </Card>

                {/* Gói Premium */}
                <Card className='border-2 border-primary shadow-lg transform transition-all duration-300 hover:scale-105'>
                    <CardHeader>
                        <div className='text-center mb-2'>
                            <span className='bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium'>
                                Phổ biến nhất
                            </span>
                        </div>
                        <CardTitle className='text-2xl text-primary'>Gói Premium</CardTitle>
                        <CardDescription className='text-base'>
                            Dành cho nghệ sĩ chuyên nghiệp
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='text-4xl font-bold mb-8 text-center text-primary'>
                            699.000đ <span className='text-base font-normal'>/tháng</span>
                        </div>
                        <ul className='space-y-4'>
                            {tinhNangPremium.map((feature) => (
                                <li key={feature} className='flex items-center space-x-3'>
                                    <Check className='h-5 w-5 text-primary' />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className='w-full py-6 text-lg bg-primary hover:bg-primary/90'>
                            Nâng Cấp Ngay
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}


