import { createAxiosInstance } from '@/lib/axios';
import { ca } from 'date-fns/locale';

export interface CollectionForm {
    title: string;
    description: string;
    artworks?: string[];
}

const collectionService = {
    async getById(){
        try{
            const axios = await createAxiosInstance({ useToken: true });
            if(!axios){
                throw new Error('Failed to create axios instance');
            }
            const res = await axios.get('/collection/:id');
            return res.data;
        }
        catch(error){
            console.error('Error getting collections:', error);
            return null;
        }
    },
    //get my collections
    async getByUserId(){
        try{
            const axios = await createAxiosInstance({ useToken: true });
            if(!axios){
                throw new Error('Failed to create axios instance');
            }
            const res = await axios.get(`/collection`);
            console.log('res', res.data);
            return res.data;
        }
        catch(error){
            console.error('Error getting collections by userId:', error);
            return null;
        }
    },
    //get collection of others
    async getByOtherUserId(userId: string){
        try{
            // This function uses the provided userId parameter (NOT the current user's ID from token)
            // to fetch collections belonging to another user
            const axios = await createAxiosInstance({ useToken: true });
            if(!axios){
                throw new Error('Failed to create axios instance');
            }
            const res = await axios.get(`/collection/other?userId=${userId}`);
            return res.data;
        }
        catch(error){
            console.error('Error getting collections by userId:', error);
            return null;
        }
    },
    //create collection
    async create(data: CollectionForm) {
        try{
            const axios = await createAxiosInstance({ useToken: true });
            if(!axios){
                throw new Error('Failed to create axios instance');
            }
            const imageArray = Array.isArray(data.artworks) ? data.artworks : [data.artworks].filter(Boolean);
            const res = await axios.post('/collection', {
                title: data.title,
                description: data.description,
                artworks: imageArray,
            });
            return res.data;
        }
        catch(error){
            console.error('Error creating collection:', error);
            throw new Error('Error creating collection');
        }
    },
// add artwork to collection
async update(id: string, artworkId: string | string[]): Promise<any> {
    try{
        const axios = await createAxiosInstance({ useToken: true });
        if(!axios){
            throw new Error('Failed to create axios instance');
        }
        const imageArray = Array.isArray(artworkId) ? artworkId : [artworkId].filter(Boolean);
        const res = await axios.put(`/collection/${id}`, {
            artId: imageArray
        });
        return res.data;
    }
    catch(error){
        console.error('Error updating collection:', error);
        throw new Error('Error updating collection');
    }
},
    //delete collection
    async delete(id: string) {
        try{
            const axios = await createAxiosInstance({ useToken: true });
            if(!axios){
                throw new Error('Failed to create axios instance');
            }
            const res = await axios.delete(`/collection/delete-collection/${id}`);
            return res.data;
        }
        catch(error){
            console.error('Error deleting collection:', error);
            throw new Error('Error deleting collection');
        }
    },
    //delete artwork from collection
    async deleteArt(id: string, artworkId: string) {
        try{
            const axios = await createAxiosInstance({ useToken: true });
            if(!axios){
                throw new Error('Failed to create axios instance');
            }
            const res = await axios.delete(`/collection/delete-art/${id}`,{
                data: { artId: artworkId }
            });
            return res.data;
        }
        catch(error){
            console.error('Error deleting artwork from collection:', error);
            throw new Error('Error deleting artwork from collection');
        }
    }
}

export default collectionService;
