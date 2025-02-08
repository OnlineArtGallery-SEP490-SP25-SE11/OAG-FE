'use client';

import { LoaderButton } from "@/components/ui.custom/loader-button";
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
import { useToast } from "@/hooks/use-toast";
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
  blogId: string;
  children: React.ReactNode;
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
