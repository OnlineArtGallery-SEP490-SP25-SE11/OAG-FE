'use client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Heart, Clock, Crown } from 'lucide-react';
import { Exhibition } from '@/types/exhibition';
import { formatTime } from '@/lib/utils';

// This component receives exhibition data from the server
export default function ResultContent({
    exhibition,
    isPremium
}: {
    exhibition: Exhibition,
    isPremium: boolean
}) {
    // We use a client component to display the exhibition data
    return (
        <div className='max-w-7xl mx-auto p-6 space-y-8'>
            <div className='flex justify-between items-center'>
                <div>
                    <h1 className='text-3xl font-bold'>Analytics Dashboard</h1>
                    <p className='text-gray-500 mt-2'>
                        Track your exhibition performance and visitor engagement
                    </p>
                </div>
            </div>

            {isPremium ? (
                <AnalyticsContent exhibition={exhibition} />
            ) : (
                <PremiumUpsell />
            )}
        </div>
    );
}


function AnalyticsContent({ exhibition }: { exhibition: Exhibition }) {
    const analyticsData = {
        totalVisits: exhibition.result?.visits || 0,
        totalLikes: exhibition.result?.likes?.reduce((total, like) => total + like.count, 0) || 0,
        averageTime: formatTime(exhibition.result?.totalTime || 0),
    };

    return (
        <>
            {/* Key Metrics */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <Card className='p-4 flex flex-col'>
                    <div className='flex items-center gap-2 text-gray-500 mb-2'>
                        <Users className='w-4 h-4' />
                        <span>Total Visits</span>
                    </div>
                    <span className='text-2xl font-bold'>
                        {analyticsData.totalVisits}
                    </span>

                </Card>
                <Card className='p-4 flex flex-col'>
                    <div className='flex items-center gap-2 text-gray-500 mb-2'>
                        <Heart className='w-4 h-4' />
                        <span>Total Likes</span>
                    </div>
                    <span className='text-2xl font-bold'>
                        {analyticsData.totalLikes}
                    </span>

                </Card>
                <Card className='p-4 flex flex-col'>
                    <div className='flex items-center gap-2 text-gray-500 mb-2'>
                        <Clock className='w-4 h-4' />
                        <span>Avg. Time</span>
                    </div>
                    <span className='text-2xl font-bold'>
                        {analyticsData.averageTime}
                    </span>

                </Card>
            </div>

            {/* Exhibition-specific Analytics - Artwork Likes */}
            <div className='mt-8'>
                <h2 className='text-2xl font-bold mb-4'>
                    Artwork Engagement
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {exhibition.result?.likes?.length ? (
                        exhibition.result.likes.map((like, index) => {
                            // Find the artwork with this ID to show its title
                            const artwork = exhibition.artworkPositions.find(
                                pos => pos.artwork._id === like.artworkId
                            )?.artwork;

                            return (
                                <Card key={index} className='p-4'>
                                    <h3 className='font-medium'>{artwork?.title || 'Untitled Artwork'}</h3>
                                    <p className='text-xl font-bold'>{like.count} likes</p>
                                    <p className='text-sm text-gray-500'>Engagement metric for this artwork</p>
                                </Card>
                            );
                        })
                    ) : (
                        <p className='text-gray-500'>No likes recorded for artworks.</p>
                    )}
                </div>
            </div>
        </>
    );
}

function PremiumUpsell() {
    return (
        <Card className='p-6 text-center bg-gradient-to-r from-purple-50 to-blue-50'>
            <Crown className='w-16 h-16 mx-auto text-yellow-500 mb-4' />
            <h3 className='text-xl font-semibold mb-2'>
                Unlock Exhibition Analytics
            </h3>
            <p className='text-gray-600 mb-6 max-w-xl mx-auto'>
                Get detailed insights for your exhibition, including
                visitor flow, artwork engagement, and conversion
                metrics. Upgrade to our premium plan to access these
                powerful analytics tools.
            </p>
            <Button className='bg-gradient-to-r from-purple-500 to-blue-500 text-white'>
                Upgrade Now
            </Button>
        </Card>
    );
}