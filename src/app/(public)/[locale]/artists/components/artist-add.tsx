'use client';
import { artworkService } from '@/app/(public)/[locale]/artists/queries';
import {
    ArtworkFormData,
    artworkFormSchema
} from '@/app/(public)/[locale]/artists/schema';
import FileUploader from '@/components/ui.custom/file-uploader';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

// const CATEGORIES = [
// 	'Nature',
// 	'Landscape',
// 	'Portrait',
// 	'Abstract',
// 	'Modern',
// 	'Classic',
// 	'Urban',
// 	'Wildlife'
// ];

export default function UploadArtwork() {
    const [file, setFile] = useState<File | null>(null);
    const t = useTranslations('artwork');

    const form = useForm<ArtworkFormData>({
        resolver: zodResolver(artworkFormSchema(t)),
        defaultValues: {
            title: '',
            description: '',
            categories: [],
            width: '',
            height: '',
            price: 0,
            status: 'available',
            imageUrl: ''
        }
    });

    const { data, error, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => artworkService.getCategories(),
        placeholderData: (previousData) => previousData,
    });
    const CATEGORIES = data?.data || []
    const mutation = useMutation({
        mutationFn: artworkService.upload,
        onSuccess: () => {
            toast({
                variant: 'success',
                title: t('toast.successTitle'),
                description: t('toast.successDescription')
            });
            form.reset();
            setFile(null);
        },
        onError: (error) => {
            toast({
                variant: 'destructive',
                title: t('toast.errorTitle'),
                description: t('toast.errorDescription')
            });
            console.error('Error uploading artwork:', error);
        }
    });

    const onSubmit = (data: ArtworkFormData) => {
        mutation.mutate(data);
    };

    const containerVariants = useMemo(
        () => ({
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    duration: 0.5,
                    ease: 'easeOut',
                    staggerChildren: 0.1
                }
            }
        }),
        []
    );

    const itemVariants = useMemo(
        () => ({
            hidden: { opacity: 0, y: 15 },
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                    duration: 0.4,
                    ease: 'easeOut'
                }
            }
        }),
        []
    );

    return (
        <motion.div
            initial='hidden'
            animate='visible'
            variants={containerVariants}
            className='p-3 md:p-6 space-y-2 md:space-y-3 max-w-3xl mx-auto'
        >
            <Toaster />
            <motion.div variants={itemVariants}>
                <Card className='border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden'>
                    <CardHeader className='border-b border-gray-200 dark:border-gray-700 py-2 md:py-3 bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800'>
                        <h1 className='text-lg md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent'>
                            {t('title')}
                        </h1>
                        <p className='text-xs md:text-sm text-teal-600 dark:text-cyan-400'>
                            {t('subtitle')}
                        </p>
                    </CardHeader>

                    <CardContent className='p-3 md:p-6 space-y-4 md:space-y-6'>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className='space-y-4 md:space-y-6'
                            >
                                <div className='flex flex-col md:flex-row md:gap-6'>
                                    <motion.div
                                        variants={itemVariants}
                                        className='flex-1 mb-4 md:mb-0'
                                    >
                                        <FormField
                                            control={form.control}
                                            name='title'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-sm md:text-base font-medium text-emerald-700 dark:text-emerald-200'>
                                                        {t('field.title')}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder={t(
                                                                'placeholder.title'
                                                            )}
                                                            {...field}
                                                            className='rounded-lg border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-teal-500 h-10 text-sm md:text-base bg-gray-50 dark:bg-gray-700/30'
                                                        />
                                                    </FormControl>
                                                    <FormMessage className='text-xs text-red-500 dark:text-red-400 mt-1' />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    <motion.div
                                        variants={itemVariants}
                                        className='flex-1'
                                    >
                                        <FormField
                                            control={form.control}
                                            name='price'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-sm md:text-base font-medium text-emerald-700 dark:text-emerald-200'>
                                                        {t('field.price')}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            placeholder={t(
                                                                'placeholder.price'
                                                            )}
                                                            {...field}
                                                            className='rounded-lg border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-teal-500 h-10 text-sm md:text-base bg-gray-50 dark:bg-gray-700/30'
                                                        />
                                                    </FormControl>
                                                    <FormMessage className='text-xs text-red-500 dark:text-red-400 mt-1' />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>
                                </div>

                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name='description'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-sm md:text-base font-medium text-emerald-700 dark:text-emerald-200'>
                                                    {t('field.description')}
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder={t(
                                                            'placeholder.description'
                                                        )}
                                                        className='min-h-[100px] rounded-lg border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-teal-500 text-sm md:text-base bg-gray-50 dark:bg-gray-700/30'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription className='text-xs text-teal-600 dark:text-teal-400 mt-1'>
                                                    {t('helper.description')}
                                                </FormDescription>
                                                <FormMessage className='text-xs text-red-500 dark:text-red-400 mt-1' />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="categories"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center justify-between mb-2">
                                                    <FormLabel className="text-sm md:text-base font-medium text-emerald-700 dark:text-emerald-200">
                                                        {t('field.categories')}
                                                    </FormLabel>
                                                    <FormDescription className="text-xs text-teal-600 dark:text-teal-400">
                                                        {t('helper.categories')}
                                                    </FormDescription>
                                                </div>
                                                <div className="relative">
                                                    <Input
                                                        placeholder={t('placeholder.categories')}
                                                        className="rounded-lg border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-teal-500 h-10 text-sm md:text-base bg-gray-50 dark:bg-gray-700/30"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === ',') {
                                                                e.preventDefault();
                                                                const value = e.currentTarget.value.trim();
                                                                if (value && !field.value.includes(value)) {
                                                                    field.onChange([...field.value, value]);
                                                                    e.currentTarget.value = '';
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <div className="absolute right-2 top-2">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-6 p-0"
                                                            onClick={() => {
                                                                const input = document.querySelector('input[name="categoryInput"]') as HTMLInputElement;
                                                                if (input && input.value.trim() && !field.value.includes(input.value.trim())) {
                                                                    field.onChange([...field.value, input.value.trim()]);
                                                                    input.value = '';
                                                                }
                                                            }}
                                                        >
                                                            <span className="sr-only">{t('button.add')}</span>
                                                            <span className="font-bold">+</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        {field.value.map((category, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center gap-1 bg-teal-100 dark:bg-teal-800/50 text-teal-700 dark:text-teal-300 px-2 py-1 rounded-md text-sm"
                                                            >
                                                                <span>{category}</span>
                                                                <button
                                                                    type="button"
                                                                    className="text-teal-500 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-200"
                                                                    onClick={() => {
                                                                        const newCategories = [...field.value];
                                                                        newCategories.splice(index, 1);
                                                                        field.onChange(newCategories);
                                                                    }}
                                                                >
                                                                    <span className="sr-only">{t('button.remove')}</span>
                                                                    <span className="font-bold">×</span>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <p className="text-xs text-teal-600 dark:text-teal-400">{t('helper.suggestedCategories')}</p>
                                                    <ScrollArea
                                                        className='max-h-24 overflow-auto'
                                                    >

                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {CATEGORIES.filter((cat: string) => !field.value.includes(cat)).map((category: string) => (
                                                                <button
                                                                    key={category}
                                                                    type="button"
                                                                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-xs hover:bg-teal-100 dark:hover:bg-teal-800/50 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                                                                    onClick={() => {
                                                                        field.onChange([...field.value, category]);
                                                                    }}
                                                                >
                                                                    {category}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </ScrollArea>
                                                </div>
                                                <FormMessage className="text-xs text-red-500 dark:text-red-400 mt-1" />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                                    <motion.div variants={itemVariants}>
                                        <FormField
                                            control={form.control}
                                            name='status'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-sm md:text-base font-medium text-emerald-700 dark:text-emerald-200'>
                                                        {t('field.status')}
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className='rounded-lg border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-teal-500 h-10 text-sm md:text-base bg-gray-50 dark:bg-gray-700/30'>
                                                                <SelectValue
                                                                    placeholder={t(
                                                                        'placeholder.status'
                                                                    )}
                                                                />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className='rounded-lg'>
                                                            <SelectItem
                                                                value='available'
                                                                className='text-sm'
                                                            >
                                                                {t(
                                                                    'status.available'
                                                                )}
                                                            </SelectItem>
                                                            <SelectItem
                                                                value='selling'
                                                                className='text-sm'
                                                            >
                                                                {t(
                                                                    'status.selling'
                                                                )}
                                                            </SelectItem>
                                                            <SelectItem
                                                                value='hidden'
                                                                className='text-sm'
                                                            >
                                                                {t(
                                                                    'status.hidden'
                                                                )}
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage className='text-xs text-red-500 dark:text-red-400 mt-1' />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    <motion.div
                                        variants={itemVariants}
                                        className='space-y-2 md:space-y-3'
                                    >
                                        <div className='grid grid-cols-2 gap-2 md:gap-3'>
                                            <FormField
                                                control={form.control}
                                                name='width'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className='text-sm md:text-base font-medium text-emerald-700 dark:text-emerald-200'>
                                                            {t('field.width')}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className='px-3 py-2 border rounded-lg bg-emerald-50 dark:bg-teal-900/30 text-emerald-700 dark:text-teal-200 text-sm md:text-base shadow-sm'>
                                                                {field.value
                                                                    ? `${field.value} px`
                                                                    : '-'}
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className='text-xs text-red-500 dark:text-red-400 mt-1' />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name='height'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className='text-sm md:text-base font-medium text-emerald-700 dark:text-emerald-200'>
                                                            {t('field.height')}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className='px-3 py-2 border rounded-lg bg-emerald-50 dark:bg-teal-900/30 text-emerald-700 dark:text-teal-200 text-sm md:text-base shadow-sm'>
                                                                {field.value
                                                                    ? `${field.value} px`
                                                                    : '-'}
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className='text-xs text-red-500 dark:text-red-400 mt-1' />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </motion.div>
                                </div>

                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name='imageUrl'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-sm md:text-base font-medium text-emerald-700 dark:text-emerald-200'>
                                                    {t('field.image')}
                                                </FormLabel>
                                                <FileUploader
                                                    accept={{ 'image/*': [] }}
                                                    maxFiles={1}
                                                    maxSize={5 * 1024 * 1024} // 5MB
                                                    onFileUpload={(files) => {
                                                        const file = files[0];
                                                        field.onChange(
                                                            file.url
                                                        );
                                                        if (
                                                            file.width !==
                                                            undefined
                                                        ) {
                                                            form.setValue(
                                                                'width',
                                                                file.width.toString()
                                                            );
                                                        }
                                                        if (
                                                            file.height !==
                                                            undefined
                                                        ) {
                                                            form.setValue(
                                                                'height',
                                                                file.height.toString()
                                                            );
                                                        }
                                                    }}
                                                />
                                                {!file && (
                                                    <FormDescription className='text-xs text-teal-600 dark:text-teal-400 mt-2'>
                                                        {t('helper.image')}
                                                    </FormDescription>
                                                )}
                                                <FormMessage className='text-xs text-red-500 dark:text-red-400 mt-1' />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>

                                <CardFooter className='p-0'>
                                    <motion.div
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{
                                            duration: 0.2,
                                            ease: 'easeInOut'
                                        }}
                                        className='w-full'
                                    >
                                        <Button
                                            type='submit'
                                            className='w-full rounded-lg h-10 text-sm md:text-base bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-md'
                                            disabled={mutation.isPending}
                                        >
                                            {mutation.isPending ? (
                                                <div className='flex items-center gap-2'>
                                                    <Loader2 className='h-4 w-4 animate-spin' />
                                                    <span>
                                                        {t('button.uploading')}
                                                    </span>
                                                </div>
                                            ) : (
                                                t('button.upload')
                                            )}
                                        </Button>
                                    </motion.div>
                                </CardFooter>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
