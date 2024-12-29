"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import BlogPreviewOverlay from "./blog-preview";
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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div>
      <Button
        className="text-slate-500 bg-white border border-slate-300 rounded-full py-2 px-4 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 dark:border-slate-600"
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
};

export default PreviewButton;
