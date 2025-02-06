// layout.tsx
// import Sidebar from "@/app/dashboard/sidebar-dashboard";
<<<<<<< HEAD:src/app/(seo)/[locale]/blogs/dashboard/layout.tsx
import { Breadcrumb } from '@/components/Breadcrumb';
import { getCurrentUser } from '@/lib/session';
=======
import { getCurrentUser } from "@/lib/session";
>>>>>>> 592f1c8501b901be16ad94fdfd08df99a433f9ac:src/app/(seo)/[locale]/my-blogs/dashboard/layout.tsx

export default async function DashboardLayout({
	children
}: {
	children: React.ReactNode;
}) {
	const user = await getCurrentUser();
	if (!user) {
		return <h1>You need to be signed in to view this page.</h1>;
	}
	return (
		<div className='flex h-screen'>
			{/* <Sidebar /> */}
			<div className='flex-grow p-4'>{children}</div>
		</div>
	);
}
