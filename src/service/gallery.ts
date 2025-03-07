import { ARTWORK_URL } from '@/utils/constants';

export async function getExhibitions(id: string) {
    console.log('Fetching exhibitions:', id);
    //delay 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
        const data = {
            id: "6071b3e5c1b4d82edc4eda30",
            name: "Modern Abstract Exhibition 2023",
            galleryModelId: "modern-a2",
            title: "Modern Abstract Exhibition",
            author: "Jane Smith",
            date: "31.1.2025",
            description: "Experience a stunning collection of contemporary abstract artworks in this immersive virtual gallery.",
            thumbnail: "https://res.cloudinary.com/example/image/upload/exhibition_thumbnail.jpg",
            backgroundImage: "https://res.cloudinary.com/example/image/upload/exhibition_bg.jpg",
            walls: {
                back: {
                    artworkCount: 3,
                    artworks: [
                        { id: "1", url: ARTWORK_URL.ARTWORK_1 },
                        { id: "2", url: ARTWORK_URL.ARTWORK_2 },
                        { id: "3", url: ARTWORK_URL.ARTWORK_3 }
                    ]
                },
                left: {
                    artworkCount: 2,
                    artworks: [
                        { id: "4", url: ARTWORK_URL.ARTWORK_4 },
                        { id: "5", url: ARTWORK_URL.ARTWORK_2 }
                    ]
                },
                right: {
                    artworkCount: 2,
                    artworks: [
                        { id: "6", url: ARTWORK_URL.ARTWORK_1 },
                        { id: "7", url: ARTWORK_URL.ARTWORK_3 }
                    ]
                }
            }
        }

        return data;
    } catch (error) {
        console.error('Error fetching exhibitions:', error);
        throw error;
    }
}


export async function getGalleryModel(id: string) {
    console.log('Fetching gallery model:', id);
    //delay 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
        const data = {
            id: 'modern-a2',
            name: 'Modern A2 Gallery',
            description: 'A spacious modern gallery with open layout',
            dimension: {
                xAxis: 40,
                yAxis: 40,
                zAxis: 40
            },
            wallThickness: 0.2,
            wallHeight: 3,  
            modelPath: '/modern-a2-gallery.glb',
            modelScale: 4,
            customElement: {
                shape: 'box' as const,
                args: [4, 4, 4] as [number, number, number],
                position: [0, 1.5, 0] as [number, number, number],
            },
        };

        return data;
    } catch (error) {
        console.error('Error fetching gallery model:', error);
        throw error;
    }
}