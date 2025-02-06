import { createAxiosInstance } from '@/lib/axios';

export async function fetchUser() {
	const axios = await createAxiosInstance({ useToken: true });
	if (!axios) return null;
	// return await axios.get("/user").user;
	const res = await axios.get('/user');
	return res.data.user;
}
