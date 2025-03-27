// import { createApi } from "@/lib/axios";

import { createApi } from "@/lib/axios";
import { ExhibitionRequestResponse, GetExhibitionsResponse, UpdateExhibitionDto } from "@/types/exhibition";
import { ApiResponse } from "@/types/response";
import { handleApiError } from "@/utils/error-handler";

export const getExhibitions = async (accessToken: string, params?: {
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
    search?: string;
}): Promise<ApiResponse<GetExhibitionsResponse>> =>{
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        if (params?.sort) queryParams.set('sort', JSON.stringify(params.sort));
        if (params?.search) queryParams.set('search', params.search);

        const url = `/exhibition${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const res = await createApi(accessToken).get(url);
        return res.data;

        // return {
        //     status: 200,
        //     errorCode: '',
        //     details: null,
        //     message: 'Success',
        //     data: {
        //         exhibitions: [],
        //         pagination: {
        //             total: 0,
        //             page: 1,
        //             limit: 10,
        //             pages: 0,
        //             hasNext: false,
        //             hasPrev: false
        //         }
        //     }
        // }
  
    } catch (error) {
        console.error('Error getting gallery templates:', error);
        return handleApiError<GetExhibitionsResponse>(
            error,
            'Failed to fetch gallery templates'
        );
    }
}


export const createExhibition = async (accessToken: string, templateId: string): Promise<ApiResponse<ExhibitionRequestResponse>> => {
    try {
        const res = await createApi(accessToken).post('/exhibition', { 
            gallery: templateId
         });
        return res.data;
    } catch (error) {
        console.error('Error creating exhibition:', error);
        return handleApiError<ExhibitionRequestResponse>(
            error,
            'Failed to create exhibition'
        );
    }
}

export const updateExhibition = async (accessToken: string, id: string, data: UpdateExhibitionDto): Promise<ApiResponse<ExhibitionRequestResponse>> => {
    try {
        const res = await createApi(accessToken).patch(`/exhibition/${id}`, data);
        return res.data;
    } catch (error) {
        console.error('Error updating exhibition:', error);
        return handleApiError<ExhibitionRequestResponse>(
            error,
            'Failed to update exhibition'
        );
    }
}

export const getExhibitionById = async (id: string): Promise<ApiResponse<ExhibitionRequestResponse>> => {
    try {
        const res = await createApi().get(`/exhibition/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error getting exhibition by ID:', error);
        return handleApiError<ExhibitionRequestResponse>(
            error,
            'Failed to get exhibition by ID'
        );
    }
}


