import { useToast } from '@/hooks/use-toast';
import collectionService from '@/service/collection-service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PlusCircle, FolderOpen, ImageOff, Trash2, Eye } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import CreateCollection from './create-collection';
import Image from 'next/image';

// Define interface for Artwork type
interface Artwork {
    _id: string;
    title: string;
    url: string;
}

// Define interface for Collection type
interface Collection {
    _id: string;
    userId: string;
    title: string;
    description: string;
    artworks?: Artwork[];
    createdAt: string;
    updatedAt: string;
}

export default function Collection() {
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
    const { toast } = useToast();

    // Fetch user's collections with proper typing
    const { data: response, isLoading, refetch } = useQuery({
        queryKey: ['collections'],
        queryFn: async () => {
            try {
                const res = await collectionService.getByUserId();
                console.log('API response:', res);
                return res; // Return the whole response object
            } catch (error) {
                console.error('Error fetching collections:', error);
                return { data: [] }; // Return in expected format
            }
        }
    });

    // Extract the collections array from the response
    const collections = response?.data || [];

    const handleCollectionCreated = () => {
        refetch();
    };
    
    const handleDeleteCollection = async (collectionId: string) => {
        try {
            await collectionService.delete(collectionId);
            toast({
                title: "Collection deleted",
                description: "Collection has been deleted successfully",
            });
            refetch();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete collection",
                variant: "destructive",
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className='flex justify-center items-center h-64'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
            </div>
        );
    }

    return (
        <div className='container py-8'>
            <div className='flex justify-between items-center mb-8'>
                <div>
                    <h2 className='text-3xl font-bold'>My Collections</h2>
                    <p className='text-muted-foreground mt-1'>
                        Organize and manage your favorite artworks
                    </p>
                </div>
                <CreateCollection onSuccess={handleCollectionCreated} />
            </div>

            {/* Empty state */}
            {collections && collections.length === 0 && (
                <div className='flex flex-col items-center justify-center bg-muted/30 rounded-lg border border-dashed border-muted p-12 text-center'>
                    <FolderOpen
                        size={48}
                        className='text-muted-foreground mb-4'
                    />
                    <h3 className='text-xl font-medium mb-2'>
                        No collections yet
                    </h3>
                    <p className='text-muted-foreground max-w-md mb-6'>
                        Create your first collection to start organizing your
                        favorite artworks
                    </p>
                    <CreateCollection
                        onSuccess={handleCollectionCreated}
                        triggerButton={
                            <Button>Create Collection</Button>
                        }
                    />
                </div>
            )}

            {/* Collections grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <AnimatePresence>
                    {collections.map((collection: Collection) => (
                        <motion.div
                            key={collection._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className='h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow'>
                                <CardHeader className='pb-2'>
                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <CardTitle className='text-xl'>
                                                {collection.title}
                                            </CardTitle>
                                            <CardDescription className='line-clamp-1 mt-1'>
                                                {collection.description ||
                                                    'No description'}
                                            </CardDescription>
                                        </div>
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            className='text-muted-foreground hover:text-primary'
                                            onClick={() => {
                                                setSelectedCollection(
                                                    collection
                                                );
                                                setIsViewDialogOpen(true);
                                            }}
                                        >
                                            <Eye size={16} />
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardContent className='flex-grow'>
                                    {collection.artworks &&
                                    collection.artworks.length > 0 ? (
                                        <div className='grid grid-cols-2 gap-2 h-32 overflow-hidden rounded-md'>
                                            {collection.artworks
                                                .slice(0, 4)
                                                .map((artwork) => (
                                                    <div
                                                        key={artwork._id}
                                                        className='bg-muted h-full rounded-md overflow-hidden relative'
                                                    >
                                                        <Image
                                                            src={artwork.url}
                                                            alt={artwork.title}
                                                            fill
                                                            className='object-cover'
                                                        />
                                                    </div>
                                                ))}
                                            {/* Add placeholders if less than 4 artworks */}
                                            {collection.artworks.length < 4 &&
                                                Array.from({ length: 4 - collection.artworks.length }).map((_, i) => (
                                                    <div
                                                        key={`placeholder-${i}`}
                                                        className='bg-muted h-full rounded-md overflow-hidden relative flex items-center justify-center'
                                                    >
                                                        <ImageOff size={20} className='text-muted-foreground' />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ) : (
                                        <div className='flex flex-col items-center justify-center h-32 bg-muted/30 rounded-md'>
                                            <ImageOff
                                                size={24}
                                                className='text-muted-foreground mb-2'
                                            />
                                            <p className='text-sm text-muted-foreground'>
                                                No artworks yet
                                            </p>
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className='pt-2 flex justify-between border-t'>
                                    <div className='text-sm text-muted-foreground'>
                                        {collection.artworks?.length || 0}{' '}
                                        {collection.artworks?.length === 1
                                            ? 'artwork'
                                            : 'artworks'}
                                    </div>
                                    <div className='flex gap-1'>
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            className='text-muted-foreground hover:text-destructive'
                                            onClick={() => handleDeleteCollection(collection._id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* View Collection Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className='sm:max-w-4xl max-h-[90vh] overflow-y-auto'>
                    <div className='space-y-1'>
                        <h2 className='text-2xl font-bold'>
                            {selectedCollection?.title}
                        </h2>
                        <p className='text-muted-foreground'>
                            {selectedCollection?.description ||
                                'No description provided'}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                            Created on {selectedCollection ? formatDate(selectedCollection.createdAt) : ''}
                        </p>
                    </div>

                    <div className='my-6'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-lg font-medium'>Artworks</h3>
                            <p className='text-sm text-muted-foreground'>
                                {selectedCollection?.artworks?.length || 0}{' '}
                                {selectedCollection?.artworks?.length === 1
                                    ? 'artwork'
                                    : 'artworks'}{' '}
                                in this collection
                            </p>
                        </div>

                        {selectedCollection?.artworks &&
                        selectedCollection.artworks.length > 0 ? (
                            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                                {selectedCollection.artworks.map(
                                    (artwork, index) => (
                                        <motion.div
                                            key={artwork._id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                delay: index * 0.05,
                                                duration: 0.2
                                            }}
                                            className='group aspect-square bg-muted rounded-lg overflow-hidden relative'
                                        >
                                            <Image
                                                src={artwork.url}
                                                alt={artwork.title}
                                                fill
                                                className='object-cover'
                                            />

                                            {/* Hover overlay with actions */}
                                            <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center'>
                                                <p className='text-white font-medium mb-2 px-2 text-center'>
                                                    {artwork.title}
                                                </p>
                                                <div className='flex'>
                                                    <Button
                                                        variant='secondary'
                                                        size='sm'
                                                        className='mr-2'
                                                        onClick={() => window.open(artwork.url, '_blank')}
                                                    >
                                                        <Eye
                                                            size={14}
                                                            className='mr-1'
                                                        />{' '}
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant='destructive'
                                                        size='sm'
                                                    >
                                                        <Trash2
                                                            size={14}
                                                            className='mr-1'
                                                        />{' '}
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                )}
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center py-12 bg-muted/30 rounded-lg border border-dashed'>
                                <ImageOff
                                    size={48}
                                    className='text-muted-foreground mb-4'
                                />
                                <p className='text-lg font-medium mb-2'>
                                    No artworks yet
                                </p>
                                <p className='text-muted-foreground text-center max-w-md mb-4'>
                                    This collection doesn't have any artworks
                                    yet. Add some to get started!
                                </p>
                                <Button>Add Artworks</Button>
                            </div>
                        )}
                    </div>

                    <div className='flex flex-col sm:flex-row gap-2 mt-4'>
                        <Button
                            variant='outline'
                            onClick={() => setIsViewDialogOpen(false)}
                            className='w-full sm:w-auto'
                        >
                            Close
                        </Button>
                        {selectedCollection?.artworks &&
                            selectedCollection.artworks.length > 0 && (
                                <Button className='w-full sm:w-auto flex items-center gap-1'>
                                    <PlusCircle size={16} /> Add More Artworks
                                </Button>
                            )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}