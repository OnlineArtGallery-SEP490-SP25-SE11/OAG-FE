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
        return handleApiError<ArtworksResponse>(
            error,
            'Failed to fetch artist artworks'
        );
    }
};