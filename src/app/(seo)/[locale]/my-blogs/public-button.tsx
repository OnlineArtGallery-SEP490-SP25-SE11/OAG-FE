'use client';

<<<<<<< HEAD:src/app/(seo)/[locale]/blogs/public-button.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircleIcon } from 'lucide-react';
import { publishBlogAction, unpublishBlogAction } from './action';
=======
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircleIcon } from "lucide-react";
import { publishBlogAction, unpublishBlogAction } from "./action";
import { useTranslations } from "next-intl";
>>>>>>> f3bc7fd92dfc4be83c157135cf6de621c8ab4478:src/app/(seo)/[locale]/my-blogs/public-button.tsx

interface PublicButtonProps {
	blogId: string;
	initialPublishedState: boolean;
}

const PublicButton = ({ blogId, initialPublishedState }: PublicButtonProps) => {
<<<<<<< HEAD:src/app/(seo)/[locale]/blogs/public-button.tsx
	const [published, setPublished] = useState(initialPublishedState);
	const [isPending, setIsPending] = useState(false);
	const { toast } = useToast();
	const router = useRouter();
=======
  const [published, setPublished] = useState(initialPublishedState);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const tBlog = useTranslations("blog");
>>>>>>> f3bc7fd92dfc4be83c157135cf6de621c8ab4478:src/app/(seo)/[locale]/my-blogs/public-button.tsx

	const handlePublishToggle = async () => {
		setIsPending(true);
		try {
			const action = published ? unpublishBlogAction : publishBlogAction;
			await action({ _id: blogId });
			setPublished(!published);
			toast({
				title: 'Success',
				description: published
					? 'Blog has been private'
					: 'Blog has been published',
				variant: 'success'
			});
			router.refresh(); // Refresh the page to get updated data
		} catch {
			toast({
				title: 'Error',
				description: 'Failed to update blog status',
				variant: 'destructive'
			});
		} finally {
			setIsPending(false);
		}
	};

	return (
		<Button
			className={`text-white rounded-full py-2 px-4 
                ${
<<<<<<< HEAD:src/app/(seo)/[locale]/blogs/public-button.tsx
					published
						? 'bg-yellow-500 border border-yellow-500 hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-800 dark:border-yellow-700'
						: 'bg-secondary border border-secondary hover:bg-secondary/80 dark:bg-secondary dark:hover:bg-secondary/80 dark:border-secondary'
				}
                ${isPending ? 'cursor-not-allowed opacity-50' : ''}`}
			onClick={handlePublishToggle}
			style={{ width: '80px' }}
			disabled={isPending}
		>
			{isPending ? (
				<LoaderCircleIcon className='animate-spin' />
			) : published ? (
				'Private'
			) : (
				'Public'
			)}
		</Button>
	);
=======
                  published
                    ? "bg-yellow-500 border border-yellow-500 hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-800 dark:border-yellow-700"
                    : "bg-secondary border border-secondary hover:bg-secondary/80 dark:bg-secondary dark:hover:bg-secondary/80 dark:border-secondary"
                }
                ${isPending ? "cursor-not-allowed opacity-50" : ""}`}
      onClick={handlePublishToggle}
      style={{ width: "80px" }}
      disabled={isPending}
    >
      {isPending ? (
        <LoaderCircleIcon className="animate-spin" />
      ) : published ? (
        tBlog("private")
      ) : (
        tBlog("publish")
      )}
    </Button>
  );
>>>>>>> f3bc7fd92dfc4be83c157135cf6de621c8ab4478:src/app/(seo)/[locale]/my-blogs/public-button.tsx
};

export default PublicButton;
