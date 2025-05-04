export type Artwork = {
    _id: string;
    title: string;
    description: string;
    category: string[];
    dimensions: { width: number; height: number; _id: string };
    url: string;
    status: 'available' | 'sold' | 'hidden' | 'selling';
    buyers: string[];
    views: number;
    price: number;
    createdAt: string;
    updatedAt: string;
    __v: number;

    moderationStatus: string;
};