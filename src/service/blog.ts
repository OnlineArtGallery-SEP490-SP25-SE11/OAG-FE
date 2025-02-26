"use server";
import axios, { createApi } from '@/lib/axios';
import { Blog, GetPublishedBlogsResponse } from '@/types/blog';
import { ApiResponse } from '@/types/response';
import { BlogStatus } from '@/utils/enums';
import axiosInstance from 'axios';

export async function getBlogById(blogId: string) {
	try {
		const res = await axios.get(`/blog/${blogId}`);
		return res.data;
	} catch (err) {
		if (axiosInstance.isAxiosError(err)) {
			console.error(
				`Error when get blog by id: ${err.response?.data.message}`
			);
		} else {
			console.error(`Unexpected error: ${err}`);
		}
	}
}

export async function getLastEditedBlogId(accessToken: string) {
	try {
		const res = await createApi(accessToken).get('/blog/last-edited', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		console.log(res.data, 'last edited blog id');
		return res.data._id;
	} catch (err) {
		if (axiosInstance.isAxiosError(err)) {
			console.error(
				`Error when get last edited blog id: ${err.response?.data.message}`
			);
		} else {
			console.error(`Unexpected error: ${err}`);
		}
	}
}

export async function createBlog({
	accessToken,
	blogData
}: {
	accessToken: string;
	blogData: {
		title: string;
		content: string;
		image: string;
	};
}) {
	try {
		const res: ApiResponse = await createApi(accessToken).post(
			'/blog',
			blogData
		);

		if (res.status === 201) {
			return res.data;
		} else {
			const errorCodes = res.errorCode;
			switch (errorCodes) {
				case 'invalid_blog_data':
					console.error(`Invalid blog data: ${res.message}`);
					break;
				default:
					console.error(`Unexpected error1:`, res);
					break;
			}
		}
	} catch (err) {
		console.error(`Error when create blog2: ${err}`);
	}
}

export async function updateBlog({
	accessToken,
	updateData
}: {
	accessToken: string;
	updateData: {
		_id: string;
		title?: string;
		content?: string;
		image?: string;
		status?: BlogStatus;
	};
}) {
	const payload: {
		title?: string;
		content?: string;
		image?: string;
		status?: BlogStatus;
	} = {};

	if (updateData.title) payload.title = updateData.title;
	if (updateData.content) payload.content = updateData.content;
	if (updateData.image) payload.image = updateData.image;
	if (updateData.status) payload.status = updateData.status;
	try {
		const res: ApiResponse = await createApi(accessToken).put(
			`/blog/${updateData._id}`,
			payload,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		);
		console.log(res.data, 'update blog res');
		return res.data;
	} catch (err) {
		if (axiosInstance.isAxiosError(err)) {
			console.error(err);
			console.error(
				`Error when update blog: ${err.response?.data.errorCode}`
			);
		} else {
			console.error(`Unexpected error: ${err}`);
		}
	}
}

export async function getBlogs(accessToken: string) {
	try {
		const res = await createApi(accessToken).get('/blog', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return res.data;
	} catch (err) {
		if (axiosInstance.isAxiosError(err)) {
			console.error(
				`Error when get blogs: ${err.response?.data.message}`
			);
		} else {
			console.error(`Unexpected error: ${err}`);
		}
	}
}

export async function getBlogsByPublished({
	published
}: {
	published: boolean;
}): Promise<Blog[]> {
	const res = await axios.get(`/blog/published/${published}`);
	return res.data;
}

export async function toggleHeartBlogService(
	accessToken: string,
	blogId: string
): Promise<boolean> {
	try {
		const res = await createApi(accessToken).put(
			`/blog/toggle-heart/${blogId}`
		);
		if (res.status === 200) {
			return res.data;
		} else {
			return false;
		}
	} catch (error) {
		if (axiosInstance.isAxiosError(error)) {
			console.error(
				`Error when toggle heart blog: ${error.response?.data}`
			);
		} else {
			console.error(`Unexpected error: ${error}`);
		}
		return false;
	}
}

export async function toggleBookmarkBlogService(
	accessToken: string,
	blogId: string
): Promise<boolean> {
	try {
		const res = await createApi(accessToken).put(
			`/blog/toggle-bookmark/${blogId}`
		);
		if (res.status === 200) {
			return res.data;
		} else {
			return false;
		}
	} catch (error) {
		if (axiosInstance.isAxiosError(error)) {
			console.error(
				`Error when toggle bookmark blog: ${error.response?.data}`
			);
		} else {
			console.error(`Unexpected error: ${error}`);
		}
		return false;
	}
}

export async function getBlogInteractions(blogId: string) {
	try {
		const res = await axios.get(`/blog/interactions/${blogId}`);
		return res.data;
	} catch (error) {
		if (axiosInstance.isAxiosError(error)) {
			console.error(
				`Error when get blog interactions: ${error.response?.data}`
			);
		} else {
			console.error(`Unexpected error: ${error}`);
		}
	}
}

export async function getUserInteractions(accessToken: string, blogId: string) {
	try {
		const res = await createApi(accessToken).get(
			`/interaction/user/blog/${blogId}`
		);
		console.log(res.data, 'getUserInteractions res');
		return {
			...res.data,
			bookmarked: false
		};
	} catch (error) {
		if (axiosInstance.isAxiosError(error)) {
			console.error(
				`Error when get user interactions: ${error.response?.data}`
			);
		} else {
			console.error(`Unexpected error: ${error}`);
		}
	}
}

export async function getPublishedBlogs({
	after,
	before,
	first,
	last,
	query
}: {
	after?: string;
	before?: string;
	first?: number;
	last?: number;
	query?: string;
}): Promise<GetPublishedBlogsResponse> {
	try {
		const params = new URLSearchParams();

		if (after) params.set('after', after);
		if (before) params.set('before', before);
		if (first) params.set('first', first.toString());
		if (last) params.set('last', last.toString());
		if (query) params.set('query', query);

		const queryString = params.toString();
		const url = `/blog/published${queryString ? `?${queryString}` : ''}`;
		const res = await axios.get<GetPublishedBlogsResponse>(url);
		return res.data;
	} catch (error) {
		if (axiosInstance.isAxiosError(error)) {
			console.error(
				`Error when get published blogs: ${error.response?.data}`
			);
		} else {
			console.error(`Unexpected error: ${error}`);
		}
		return {
			edges: [],
			pageInfo: {
				hasNextPage: false,
				endCursor: ''
			},
			total: 0
		};
	}
}

export async function getBookmarkedPostIds(accessToken: string) {
	try {
		console.log('getBookmarkedPostIds', accessToken);
		// const res = await createApi(accessToken).get('/blog/bookmarked');
		// return res.data.map((post: { id: string }) => post.id);
		return [];
	} catch (error) {
		console.error(`Error when get bookmarked post ids: ${error}`);
		return [];
	}
}


export async function createPublicRequest({
	accessToken,
	id
}: {
	accessToken: string;
	id: string;
}): Promise<Blog | null> {
	try {
		console.log('createPublicRequest', id);
		const res = await createApi(accessToken).put(`/blog/${id}/request-publish`);
		return res.data;
	} catch (error) {
		if (axiosInstance.isAxiosError(error)) {
			console.error(
				`Error when create public request: ${error.response?.data}`
			);
		} else {
			console.error(`Unexpected error: ${error}`);
		}
		return null;
	}
}