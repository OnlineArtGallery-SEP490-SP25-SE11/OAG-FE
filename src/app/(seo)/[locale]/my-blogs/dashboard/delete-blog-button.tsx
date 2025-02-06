'use client';

<<<<<<< HEAD:src/app/(seo)/[locale]/blogs/dashboard/delete-blog-button.tsx
import { LoaderButton } from '@/components/loader-button';
=======
import { LoaderButton } from "@/components/ui.custom/loader-button";
>>>>>>> 592f1c8501b901be16ad94fdfd08df99a433f9ac:src/app/(seo)/[locale]/my-blogs/dashboard/delete-blog-button.tsx
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog';
// import { Button } from "@/components/ui/button";
<<<<<<< HEAD:src/app/(seo)/[locale]/blogs/dashboard/delete-blog-button.tsx
import { useToast } from '@/components/ui/use-toast';
=======
import { useToast } from "@/hooks/use-toast";
>>>>>>> 592f1c8501b901be16ad94fdfd08df99a433f9ac:src/app/(seo)/[locale]/my-blogs/dashboard/delete-blog-button.tsx
// import { btnIconStyles, btnStyles } from "@/styles/icons";
// import { DoorOpen } from "lucide-react";
import { useState } from 'react';
import { useServerAction } from 'zsa-react';
import { deleteBlogAction } from './action';
// import { useBlogIdParam } from "../utils";
// import { cn } from "@/lib/utils";

export function DeleteBlogButton({
	blogId,
	children
}: {
<<<<<<< HEAD:src/app/(seo)/[locale]/blogs/dashboard/delete-blog-button.tsx
	blogId: number;
	children: React.ReactNode;
=======
  blogId: string;
  children: React.ReactNode;
>>>>>>> 592f1c8501b901be16ad94fdfd08df99a433f9ac:src/app/(seo)/[locale]/my-blogs/dashboard/delete-blog-button.tsx
}) {
	const { toast } = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const { execute, isPending } = useServerAction(deleteBlogAction, {
		onSuccess() {
			toast({
				title: 'Success',
				description: 'You left this group.',
				variant: 'success'
			});
			setIsOpen(false);
		},
		onError() {
			toast({
				title: 'Error',
				description: 'Something went wrong delete your group.',
				variant: 'error'
			});
		}
	});
	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Blog</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this blog? All data will
						be removed from our system.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<LoaderButton
						isLoading={isPending}
						onClick={() => {
							execute({ blogId });
						}}
					>
						Delete
					</LoaderButton>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
