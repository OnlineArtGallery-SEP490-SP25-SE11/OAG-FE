import { createAxiosInstance } from "@/lib/axios";
import { PaymentData, Transaction } from "@/types/payment";
import BaseResponse from "@/types/response";
const ITEMS_PER_PAGE = 5
export const walletService = {
    getWallet: async () => {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) throw new Error('Failed to create Axios instance');
        const response = await axios.get('/wallet');
        return response.data;
    },
    getTransaction: async (skip?: number, take: number = ITEMS_PER_PAGE): Promise<BaseResponse<Transaction>> => {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) throw new Error('Failed to create Axios instance');

        const url = `/wallet/transactions`;

        const response = await axios.get(url);
        return response.data;
    },
    deposit: async (amount: number, description: string, method?: string): Promise<BaseResponse<PaymentData>> => {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) throw new Error('Failed to create Axios instance');
        const response = await axios.post('/wallet/deposit', { amount, method });
        return response.data;
    }
}