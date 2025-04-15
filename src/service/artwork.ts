import { createApi } from "@/lib/axios";
import { ArtworksResponse } from "@/types/artwork";
import { ApiResponse } from "@/types/response";
import { handleApiError } from "@/utils/error-handler";

export const getArtistArtworks = async (accessToken: string): Promise<ApiResponse<ArtworksResponse>> => {
    try {
        const res = await createApi(accessToken).get('/artwork/artist');
        return res.data;
    } catch (error) {
        console.error('Error getting artist artworks:', error);
        throw handleApiError<ArtworksResponse>(
            error,
            'Failed to fetch artist artworks'
        );
    }
};

// Định nghĩa interface cho thông tin khi mua tranh
export interface PurchaseArtworkResponse {
    success: boolean;
    message: string;
    downloadUrl?: string;
    balance?: number;
}

// Lấy thông tin số dư ví của người dùng
export const getUserBalance = async (accessToken: string): Promise<ApiResponse<{ balance: number }>> => {
    try {
        const res = await createApi(accessToken).get('/wallet');
        return res.data;
    } catch (error) {
        console.error('Lỗi khi lấy số dư ví:', error);
        throw handleApiError<{ balance: number }>(
            error,
            'Không thể lấy thông tin số dư ví'
        );
    }
};

// Xử lý thanh toán mua tranh
export const purchaseArtwork = async (
    accessToken: string,
    artworkId: string
): Promise<ApiResponse<PurchaseArtworkResponse>> => {
    try {
        const res = await createApi(accessToken).post(`/artwork/${artworkId}/purchase`);
        return res.data;
    } catch (error) {
        console.error('Lỗi khi mua tranh:', error);
        throw handleApiError<PurchaseArtworkResponse>(
            error,
            'Không thể hoàn tất giao dịch mua tranh'
        );
    }
};

// Tải ảnh sau khi mua tranh thành công
export const downloadArtwork = async (
    accessToken: string,
    artworkId: string,
    downloadToken: string
): Promise<Blob> => {
    try {
        const res = await createApi(accessToken).get(`/artwork/download/${artworkId}`, {
            params: { token: downloadToken },
            responseType: 'blob'
        });
        return res.data;
    } catch (error) {
        console.error('Lỗi khi tải ảnh:', error);
        throw new Error('Không thể tải ảnh');
    }
};

// Kiểm tra xem người dùng đã mua tranh chưa
export const checkUserPurchased = async (
    accessToken: string,
    artworkId: string
): Promise<ApiResponse<{ hasPurchased: boolean }>> => {
    try {
        const res = await createApi(accessToken).get(`/artwork/${artworkId}/check-purchased`);
        console.log('rescac', res.data);
        return res.data;
    } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái mua tranh:', error);
        throw handleApiError<{ hasPurchased: boolean }>(
            error,
            'Không thể kiểm tra trạng thái mua tranh'
        );
    }
};
