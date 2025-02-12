import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { vietnamCurrency } from '@/utils/converters';
import { Eye, Heart } from 'lucide-react';
import Image from 'next/image';

export default function TabChart() {
    const artworkMetrics = [
        { month: 'Jan', views: 2500, likes: 450, shares: 120, comments: 280 },
        { month: 'Feb', views: 3200, likes: 580, shares: 150, comments: 320 },
        { month: 'Mar', views: 2800, likes: 520, shares: 135, comments: 290 },
        { month: 'Apr', views: 3500, likes: 620, shares: 180, comments: 350 },
        { month: 'May', views: 4200, likes: 780, shares: 220, comments: 420 },
    ];

    const exhibitionMetrics = [
        { 
            month: 'Jan', 
            exhibition: 'Modern Showcase',
            visitors: 12500,
            avgDuration: 45, // minutes
            rating: 4.8
        },
        { 
            month: 'Feb', 
            exhibition: 'Digital Festival',
            visitors: 8900,
            avgDuration: 38,
            rating: 4.6
        },
        { 
            month: 'Mar', 
            exhibition: 'Contemporary Masters',
            visitors: 15600,
            avgDuration: 52,
            rating: 4.9
        },
    ];

    const topArtworks = [
        { title: 'Sunset Dreams', views: 87, price: 8500000, likes: 450, thumbnail: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968' },
        { title: 'Urban Rhythm', views: 65, price: 7200000, likes: 380, thumbnail: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912' },
        { title: 'Nature\'s Whisper', views: 54, price: 6100000, likes: 320, thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5' },
        { title: 'Abstract Thoughts', views: 45, price: 5400000, likes: 280, thumbnail: 'https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3' },
        { title: 'Digital Echoes', views: 32, price: 4200000, likes: 210, thumbnail: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9' },
    ];

    return (
        <Tabs defaultValue="artworks" className="mb-8">
            <TabsList>
                <TabsTrigger value="artworks">Artwork Analytics</TabsTrigger>
                <TabsTrigger value="exhibitions">Exhibition Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="artworks">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Artwork Engagement Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Artwork Engagement Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LineChart width={500} height={300} data={artworkMetrics}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="views" stroke="#8884d8" name="Views" />
                                <Line type="monotone" dataKey="likes" stroke="#82ca9d" name="Likes" />
                                <Line type="monotone" dataKey="shares" stroke="#ffc658" name="Shares" />
                                <Line type="monotone" dataKey="comments" stroke="#ff7300" name="Comments" />
                            </LineChart>
                        </CardContent>
                    </Card>

                    {/* Top Artworks Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Performing Artworks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topArtworks.map((artwork) => (
                                    <div key={artwork.title} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 relative">
                                                <Image
                                                    src={artwork.thumbnail} 
                                                    alt={artwork.title}
                                                    fill
                                                    className="rounded-lg object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium">{artwork.title}</div>
                                                <div className="text-sm text-gray-500 flex gap-3">
                                                    <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {artwork.views}</span>
                                                    <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {artwork.likes}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-green-500 font-medium">
                                            {vietnamCurrency(artwork.price || 0)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="exhibitions">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Exhibition Visitors Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Most Visited Exhibitions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BarChart width={500} height={300} data={exhibitionMetrics}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="exhibition" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="visitors" fill="#8884d8" name="Visitors" />
                            </BarChart>
                        </CardContent>
                    </Card>

                    {/* Exhibition Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Exhibition Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {exhibitionMetrics.map((metric) => (
                                    <div key={metric.month} className="space-y-2">
                                        <div className="font-medium text-lg">{metric.exhibition}</div>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <div className="text-gray-500">Visitors</div>
                                                <div className="font-medium">{metric.visitors.toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">Avg. Duration</div>
                                                <div className="font-medium">{metric.avgDuration} mins</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">Rating</div>
                                                <div className="font-medium text-yellow-500">★ {metric.rating}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="engagement">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* User Engagement Metrics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>User Engagement</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span>Artwork Interactions</span>
                                    <span className="font-medium">2,453 today</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Comments Posted</span>
                                    <span className="font-medium">342 today</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>New Collections Created</span>
                                    <span className="font-medium">89 today</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                  
                </div>
            </TabsContent>
        </Tabs>
    );
}
