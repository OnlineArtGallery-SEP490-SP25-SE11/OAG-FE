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
import { vietnamCurrency } from '@/utils/converters';
import { Check } from 'lucide-react';

export default function ArtistPremium() {
    const premiumFeatures = [
        'Unlimited artworks',
        '24/7 priority support',
        'Customizable gallery',
        'Advanced analytics tools'
    ];

    return (
        <div className='container mx-auto py-16'>
            <div className='text-center mb-16'>
                <h1 className='text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
                    Artist Service Plans
                </h1>
                <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
                    Elevate your artistic career with our exclusive service packages
                </p>
            </div>

            <div className='max-w-5xl mx-auto grid gap-8 md:grid-cols-2 items-center'>
                {/* Basic Plan */}
                <Card className='transform transition-all duration-300 hover:scale-105'>
                    <CardHeader>
                        <CardTitle className='text-2xl'>Basic Plan</CardTitle>
                        <CardDescription className='text-base'>
                            Start your artistic journey
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='text-4xl font-bold mb-8 text-center'>
                            $0 <span className='text-base font-normal'>/month</span>
                        </div>
                        <ul className='space-y-4'>
                            {['Up to 5 artworks', 'Basic support', 'Standard gallery'].map(
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
                            Current Plan
                        </Button>
                    </CardFooter>
                </Card>

                {/* Premium Plan */}
                <Card className='border-2 border-primary shadow-lg transform transition-all duration-300 hover:scale-105'>
                    <CardHeader>
                        <div className='text-center mb-2'>
                            <span className='bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium'>
                                Most Popular
                            </span>
                        </div>
                        <CardTitle className='text-2xl text-primary'>Premium Plan</CardTitle>
                        <CardDescription className='text-base'>
                            For professional artists
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='text-4xl font-bold mb-8 text-center text-primary'>
                            {vietnamCurrency(60000)} <span className='text-base font-normal'>/month</span>
                        </div>
                        <ul className='space-y-4'>
                            {premiumFeatures.map((feature) => (
                                <li key={feature} className='flex items-center space-x-3'>
                                    <Check className='h-5 w-5 text-primary' />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className='w-full py-6 text-lg bg-primary hover:bg-primary/90'>
                            Upgrade Now
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
