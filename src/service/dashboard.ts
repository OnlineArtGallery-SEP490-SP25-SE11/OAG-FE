import { createApi, createAxiosInstance } from "@/lib/axios";
import { ArtworksResponse } from "@/types/artwork";
import { Exhibition } from "@/types/exhibition";
import { ApiResponse } from "@/types/response";
import { handleApiError } from "@/utils/error-handler";

export const getArtistArtworks = async (accessToken: string): Promise<ApiResponse<ArtworksResponse>> => {
    try {
        const res = await createApi(accessToken).get('/artwork/artist');
        return res.data;
    } catch (error) {
        console.error('Error getting artist artworks:', error);
        return handleApiError<ArtworksResponse>(
            error,
            'Failed to fetch artist artworks'
        );
    }
};


export interface Transaction {
    _id: string;
    walletId: string;
    amount: number;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'SALE' | 'COMMISSION' | 'PREMIUM_SUBSCRIPTION' | 'TICKET_SALE';
    status: 'PENDING' | 'PAID' | 'FAILED';
    orderCode: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface TransactionsResponse {
    transactions: Transaction[];
    total: number;
  }
  
  export const getTransactions = async (accessToken: string): Promise<ApiResponse<TransactionsResponse>> => {
    try {
      const res = await createApi(accessToken).get('/wallet/transactions');
      return res.data;
    } catch (error) {
      console.error("Error getting transactions:", error);
      return handleApiError<TransactionsResponse>(
        error,
        "Failed to fetch transaction history"
      );
    }
  };

  export const getExhibitions = async (accessToken: string): Promise<ApiResponse<Exhibition[]>> => {
    try {
      const res = await createApi(accessToken).get('/exhibition/user-exhibitions');
      return res.data;
    } catch (error) {
      console.error("Error getting exhibitions:", error);
      return handleApiError<Exhibition[]>(
        error,
        "Failed to fetch exhibition history"
      );
    }
  };
  