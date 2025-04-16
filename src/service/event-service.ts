import { createAxiosInstance } from '@/lib/axios';
import { EventStatus } from "@/utils/enums";

export interface Event {
    title: string;
    description: string;
    image: string;
    type: string;
    status: EventStatus;
    organizer: string;
    startDate: string;
    endDate: string;
  }
  
const eventService = {
    async get(){
        try{
            const axios = await createAxiosInstance({useToken:false})
            if(!axios){
                throw new Error("Failed to create axios instance");
            }
            const res = await axios.get("/event")
            return res.data.data;

        }
        catch(error){
            console.error("Error getting events:", error);
            return null;
        }
    },

    async participate(eventId: string): Promise<any>{
        try{
            const axios = await createAxiosInstance({useToken:true})
            if(!axios){
                throw new Error("Failed to create axios instance");
            }
            const res = await axios.post(`/event/${eventId}/participate`)
            return res.data.data;
        }
        catch(error){
            console.error("Error participating in event:", error);
            return null;
        }
    },
    
    async getUpcomingEvents(){
        try{
            const axios = await createAxiosInstance({useToken:false})
            if(!axios){
                throw new Error("Failed to create axios instance");
            }
            const res = await axios.get("/event/upcoming")
            return res.data.data;
        }
        catch(error){
            console.error("Error getting upcoming events:", error);
            return null;
        }
    }
}

export default eventService;
