'use client';

import React, { useState, useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useServerAction } from 'zsa-react';
import { useToast } from '@/hooks/use-toast';
import { FilePlus, LoaderCircle, Terminal, Upload } from 'lucide-react';
import { createBlogAction } from './action';
import { useRouter } from 'next/navigation';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import Image from 'next/image';
import { ToggleContext } from '@/components/ui.custom/interactive-overlay';
import { useTranslations } from 'next-intl';

const MAX_UPLOAD_IMAGE_SIZE = 5000000; // 5MB
const MAX_UPLOAD_IMAGE_SIZE_IN_MB = 5;

const createDraftSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	image: z
		.instanceof(File)
		.refine((file) => file.size < MAX_UPLOAD_IMAGE_SIZE, {
			message: `Image must be under ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`
		}),
	content: z.string()
});

export default function CreateDraftButton() {
	const router = useRouter();
	const { setIsOpen: setIsOverlayOpen } = useContext(ToggleContext);
	const { toast } = useToast();
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const tBlog = useTranslations('blog');
	const tCommon = useTranslations('common');

	const { execute, error, isPending } = useServerAction(createBlogAction, {
		onSuccess: (draft) => {
			toast({
				title: `${tCommon('success')}`,
				description: `${tBlog('draft_create_success')}`,
				variant: 'success'
			});
			setIsOpen(false);
			setIsOverlayOpen(false);
			router.push(`/blogs/${draft.data.id}`);
			router.refresh();
		},
		onError: () => {
			toast({
				title: `${tCommon('error')}`,
				description: `${tBlog('draft_create_error')}`,
				variant: 'destructive'
			});
		}
	});

	const form = useForm<z.infer<typeof createDraftSchema>>({
		resolver: zodResolver(createDraftSchema),
		defaultValues: {
			title: '',
			image: undefined,
			content: ''
		}
	});

	const onSubmit: SubmitHandler<z.infer<typeof createDraftSchema>> = (
		values
	) => {
		const formData = new FormData();
		formData.append('file', values.image);

		execute({
			title: values.title,
			content: `${tBlog('type_content')}`,
			image: formData
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant='outline'
					className='flex w-full font-medium text-primary items-center justify-center gap-2 p-3 hover:bg-secondary-200 hover:text-primary-foreground transition-colors duration-200 rounded-md'
				>
					<FilePlus size={18} />
					<span>{tBlog('new_draft')}</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{tBlog('create_new_draft')}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{tBlog('title')}</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={`${tBlog(
												'enter_draft_title'
											)}`}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='image'
							render={({
								// eslint-disable-next-line @typescript-eslint/no-unused-vars
								field: { value, onChange, ...field }
							}) => (
								<FormItem>
									<FormLabel>{tBlog('image')}</FormLabel>
									<FormControl>
										<div className='flex items-center space-x-2'>
											<Input
												{...field}
												type='file'
												accept='image/*'
												onChange={(e) => {
													const file =
														e.target.files?.[0];
													if (file) {
														onChange(file);
														setImagePreview(
															URL.createObjectURL(
																file
															)
														);
													}
												}}
												className='hidden'
												id='image-upload'
											/>
											<label
												htmlFor='image-upload'
												className='cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2'
											>
												<Upload className='mr-2 h-4 w-4' />{' '}
												{tBlog('upload_image')}
											</label>
											{imagePreview && (
												<Image
													src={imagePreview}
													alt='Preview'
													width={50}
													height={50}
													className='rounded-full object-cover'
												/>
											)}
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{error && (
							<Alert variant='destructive'>
								<Terminal className='h-4 w-4' />
								<AlertTitle>
									{tBlog('draft_create_fail')}
								</AlertTitle>
								<AlertDescription>
									{error.message}
								</AlertDescription>
							</Alert>
						)}
						<Button
							type='submit'
							className='w-full'
							disabled={isPending}
						>
							{isPending ? (
								<>
									<LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
									{tBlog('creating')}
								</>
							) : (
								`${tBlog('create_draft')}`
							)}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}