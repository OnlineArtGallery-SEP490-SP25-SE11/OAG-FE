// import { createApi } from "@/lib/axios";

import { createApi } from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";
import { ExhibitionRequestResponse, GetExhibitionsResponse, GetPublicExhibitionsResponse, UpdateExhibitionDto } from "@/types/exhibition";
import { ApiResponse } from "@/types/response";
import { handleApiError } from "@/utils/error-handler";

export const getExhibitions = async (accessToken: string, params?: {
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
    search?: string;
}): Promise<ApiResponse<GetExhibitionsResponse>> => {
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        if (params?.sort) queryParams.set('sort', JSON.stringify(params.sort));
        if (params?.search) queryParams.set('search', params.search);

        const url = `/exhibitions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
        throw handleApiError<GetExhibitionsResponse>(
            error,
            'Failed to fetch gallery templates'
        );
    }
}
export const getUserExhibitions = async (accessToken: string, params?: {
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
    search?: string;
}): Promise<ApiResponse<GetExhibitionsResponse>> => {
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        if (params?.sort) queryParams.set('sort', JSON.stringify(params.sort));
        if (params?.search) queryParams.set('search', params.search);

        const url = `/exhibition/user-exhibitions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const res = await createApi(accessToken).get(url);
        console.log('User exhibitions response:', res.data);
        return res.data;

    } catch (error) {
        console.error('Error getting gallery templates:', error);
        throw handleApiError<GetExhibitionsResponse>(
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
        throw handleApiError<ExhibitionRequestResponse>(
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
        throw handleApiError<ExhibitionRequestResponse>(
            error,
            'Failed to update exhibition'
        );
    }
}

export const getExhibitionById = async (id: string): Promise<ApiResponse<ExhibitionRequestResponse>> => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }
        const res = await createApi(user.accessToken).get(`/exhibition/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error getting exhibition by ID:', error);
        throw handleApiError<ExhibitionRequestResponse>(
            error,
            'Failed to get exhibition by ID'
        );
    }
}

export const getExhibitionByLinkName = async (linkName: string): Promise<ApiResponse<ExhibitionRequestResponse>> => {
    try {
        const res = await createApi().get(`/exhibition/public/link/${linkName}`);
        return res.data;
    } catch (error) {
        console.error('Error getting exhibition by link name:', error);
        throw handleApiError<ExhibitionRequestResponse>(
            error,
            'Failed to get exhibition by link name'
        );
    }
}


export const getPublicExhibitions = async ({
  page = 1,
  limit = 12,
  sort,
  filter,
  search,
}: {
  page?: number;
  limit?: number;
  sort?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  search?: string;
}): Promise<ApiResponse<GetPublicExhibitionsResponse>> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (sort) {
      queryParams.set('sort', JSON.stringify(sort));
    }
    
    if (filter) {
      queryParams.set('filter', JSON.stringify(filter));
    }
    
    if (search) {
      queryParams.set('search', search);
    }

    console.log('Query Params:', queryParams.toString());
    const response = await createApi().get(`/exhibition/public?${queryParams}`);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    throw handleApiError<GetExhibitionsResponse>(
      error, 
      'Failed to fetch exhibitions'
    );
  }
};

