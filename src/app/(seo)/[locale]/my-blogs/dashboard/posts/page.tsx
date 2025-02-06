<<<<<<< HEAD:src/app/(seo)/[locale]/blogs/dashboard/posts/page.tsx
import { Breadcrumb } from '@/components/Breadcrumb';
=======
import { Breadcrumb } from "@/components/ui.custom/Breadcrumb";
>>>>>>> 592f1c8501b901be16ad94fdfd08df99a433f9ac:src/app/(seo)/[locale]/my-blogs/dashboard/posts/page.tsx

export default function PostsPage() {
	return (
		<Breadcrumb
			items={[
				{ label: 'Dashboard', link: '/dashboard' },
				{ label: 'Articles and drafts', link: '/dashboard/posts' }
			]}
		/>
	);
}
