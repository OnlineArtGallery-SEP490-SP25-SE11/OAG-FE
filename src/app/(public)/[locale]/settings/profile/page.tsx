'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/app/(public)/[locale]/_header/queries';

export default function ProfilePage() {
	const { isLoading, error, data } = useQuery({
		queryKey: ['currentUser'],
		queryFn: fetchUser
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error instanceof Error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div>
			<h1>Data:</h1>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}
