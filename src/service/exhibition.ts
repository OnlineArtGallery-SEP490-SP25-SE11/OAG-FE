// import { createApi } from "@/lib/axios";

import { createApi } from "@/lib/axios";
import { ExhibitionRequestResponse, GetExhibitionsResponse } from "@/types/exhibition";
import { ApiResponse } from "@/types/response";
import { handleApiError } from "@/utils/error-handler";

export async function getExhibitions(accessToken: string, params?: {
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
    search?: string;
}): Promise<ApiResponse<GetExhibitionsResponse>> {
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        if (params?.sort) queryParams.set('sort', JSON.stringify(params.sort));
        if (params?.search) queryParams.set('search', params.search);

        // const url = `/exhibition${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        // const res = await createApi(accessToken).get(url);
        // return res.data;

        return {
            status: 200,
            errorCode: '',
            details: null,
            message: 'Success',
            data: {
                exhibitions: [],
                pagination: {
                    total: 0,
                    page: 1,
                    limit: 10,
                    pages: 0,
                    hasNext: false,
                    hasPrev: false
                }
            }
        }
  
    } catch (error) {
        console.error('Error getting gallery templates:', error);
        return handleApiError<GetExhibitionsResponse>(
            error,
            'Failed to fetch gallery templates'
        );
    }
}


export async function createExhibition(accessToken: string, templateId: string): Promise<ApiResponse<ExhibitionRequestResponse>> {
    try {
        const res = await createApi(accessToken).post('/exhibition', { templateId });
        return res.data;
    } catch (error) {
        console.error('Error creating exhibition:', error);
        return handleApiError<ExhibitionRequestResponse>(
            error,
            'Failed to create exhibition'
        );
    }
}