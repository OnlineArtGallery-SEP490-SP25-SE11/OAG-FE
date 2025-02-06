<<<<<<< HEAD:src/app/(seo)/[locale]/blogs/preview-button.tsx
'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import BlogPreviewOverlay from './blog-preview';
=======
"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import BlogPreviewOverlay from "./blog-preview";
import { useTranslations } from "next-intl";
>>>>>>> 592f1c8501b901be16ad94fdfd08df99a433f9ac:src/app/(seo)/[locale]/my-blogs/preview-button.tsx
interface PreviewButtonProps {
	blog: {
		id: string;
		title: string;
		content: string;
		createdAt: Date;
		imageUrl: string;
	};
}

const PreviewButton = ({ blog }: PreviewButtonProps) => {
<<<<<<< HEAD:src/app/(seo)/[locale]/blogs/preview-button.tsx
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);

	return (
		<div>
			<Button
				className='text-slate-500 bg-white border border-slate-300 rounded-full py-2 px-4 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 dark:border-slate-600'
				onClick={() => {
					setIsPreviewOpen(true);
				}}
			>
				Preview
			</Button>
			<BlogPreviewOverlay
				isOpen={isPreviewOpen}
				onClose={() => setIsPreviewOpen(false)}
				post={blog}
			/>
		</div>
	);
=======
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const tBlog = useTranslations("blog");
  
  return (
    <div>
      <Button
        className="text-slate-500 bg-white border border-slate-300 rounded-full py-2 px-4 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 dark:border-slate-600"
        onClick={() => {
          setIsPreviewOpen(true);
        }}
      >
        {tBlog("preview")}
      </Button>
      <BlogPreviewOverlay
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        post={blog}
      />
    </div>
  );
>>>>>>> 592f1c8501b901be16ad94fdfd08df99a433f9ac:src/app/(seo)/[locale]/my-blogs/preview-button.tsx
};

export default PreviewButton;
