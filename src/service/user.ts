import axios, {createApi } from '@/lib/axios';
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
