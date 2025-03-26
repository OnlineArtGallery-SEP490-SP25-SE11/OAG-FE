import { createAxiosInstance } from '@/lib/axios';

const collectionService = {
    async get(){
        try{
            const axios = await createAxiosInstance({ useToken: true });
            if(!axios){
                throw new Error('Failed to create axios instance');
            }
            const res = await axios.get('/collection');
            return res.data.data;
        }
        catch(error){
            console.error('Error getting collections:', error);
            return null;
        }
    }
}

export default collectionService;
