import axios, { axiosWithAuth, createApi } from '@/lib/axios';
import { AxiosInstance } from 'axios';
interface User {
	provider: string; // google, facebook, phone, etc.
	providerId?: string; // ID của user từ provider
	password?: string; // Mật khẩu (chỉ cần nếu provider là "phone")
	name?: string;
	email: string;
	image?: string;
	role: string[];
	phone: string; // Số điện thoại
}

export async function getUser(token: string): Promise<User> {
	try {
		const res = await createApi(token).get('/user');

		return res.data;
	} catch (error) {
		console.error('Failed to get user', error);
		throw error;
	}
}

export async function registerUser(
	name: string,
	phone: string,
	password: string,
	otp: string
): Promise<{
	message: string;
	user: User | null;
}> {
	/*
  - Example res.data:
  {
    "message": "userRegisteredSuccessfully",
    "user": {
      "provider": "phone",
      "providerId": "1234567890",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "0909090909"
    }
  }

  */
	const res = await axios.post('/auth/phone/signup', {
		name,
		phone,
		password,
		otp
	});

	return res.data;
}


// 🔹 Follow user
export async function followUser(token: string, targetUserId: string): Promise<{ message: string }> {
	try {
		const res = await createApi(token).post(`/user/follow/${targetUserId}`);
		return res.data;
	} catch (error) {
		console.error('Failed to follow user', error);
		throw error;
	}
}

// 🔹 Unfollow user
export async function unfollowUser(token: string, targetUserId: string): Promise<{ message: string }> {
	try {
		const res = await createApi(token).post(`/user/unfollow/${targetUserId}`);
		return res.data;
	} catch (error) {
		console.error('Failed to unfollow user', error);
		throw error;
	}
}

// 🔹 Get list of following users
export async function getFollowingCount(axiosInstance: AxiosInstance): Promise<number> {
	try {
		const res = await axiosInstance.get('/user/following');
		return res.data.following?.length || 0;
	} catch (error) {
		console.error('Failed to fetch following count:', error);
		return 0;
	}
}

// 🔹 Get list of followers
export async function getFollowersCount(axiosInstance: AxiosInstance): Promise<number> {
	try {
		const res = await axiosInstance.get('/user/followers');
		return res.data.followers?.length || 0;
	} catch (error) {
		console.error('Failed to fetch followers count:', error);
		return 0;
	}
}

export async function getFollowingList(axiosInstance: AxiosInstance): Promise<User[]> {
    try {
        const res = await axiosInstance.get('/user/following');
        return res.data?.following?.map((user: any) => ({
            _id: user._id || '',
            name: user.name || 'Unknown',
            email: user.email || 'No email',
            image: user.image || '/default-avatar.png',
        })) || [];
    } catch (error) {
        console.error('Failed to fetch following list:', error);
        return [];
    }
}

export async function getFollowersList(axiosInstance: AxiosInstance): Promise<User[]> {
    try {
        const res = await axiosInstance.get('/user/followers');
        return res.data?.followers?.map((user: any) => ({
            _id: user._id || '',
            name: user.name || 'Unknown',
            email: user.email || 'No email',
            image: user.image || '/default-avatar.png',
        })) || [];
    } catch (error) {
        console.error('Failed to fetch followers list:', error);
        return [];
    }
}


// 🔹 Check if user is following another user
export async function isFollowing(token: string, targetUserId: string): Promise<{ isFollowing: boolean }> {
	try {
		const res = await createApi(token).get(`/user/is-following/${targetUserId}`);
		return res.data;
	} catch (error) {
		console.error('Failed to check following status', error);
		throw error;
	}
}