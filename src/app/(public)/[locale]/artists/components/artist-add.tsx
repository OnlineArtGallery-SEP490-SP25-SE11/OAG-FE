'use client';
import { artworkService } from '@/app/(public)/[locale]/artists/queries';
import {
    ArtworkFormData,
    artworkFormSchema
} from '@/app/(public)/[locale]/artists/schema';
import FileUploader from '@/components/ui.custom/file-uploader';
import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowUp, Check, Eye, ImageIcon, Loader2, Plus, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function UploadArtwork() {
    const [file, setFile] = useState<File | null>(null);
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const categoryInputRef = useRef<HTMLInputElement>(null);
    const t = useTranslations('artwork');
    const locale = useLocale();

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

    const { data } = useQuery({
        queryKey: ['categories'],
        queryFn: () => artworkService.getCategories(),
        placeholderData: (previousData) => previousData,
    });
    const categories = data?.data || [];
    
    const { toast } = useToast();
    
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
            setIsImageUploaded(false);
            setPreviewUrl(null);
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

    // Handle adding categories with keyboard
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = e.currentTarget.value.trim();
            if (value && !form.getValues('categories').includes(value)) {
                const currentCategories = form.getValues('categories');
                form.setValue('categories', [...currentCategories, value], { 
                    shouldValidate: true,
                    shouldDirty: true
                });
                e.currentTarget.value = '';
            }
        }
    }, [form]);

    // Handle adding a category with button
    const handleAddCategory = useCallback(() => {
        if (!categoryInputRef.current) return;
        
        const value = categoryInputRef.current.value.trim();
        if (value && !form.getValues('categories').includes(value)) {
            const currentCategories = form.getValues('categories');
            form.setValue('categories', [...currentCategories, value], {
                shouldValidate: true,
                shouldDirty: true
            });
            categoryInputRef.current.value = '';
        }
    }, [form]);

    // Remove a category
    const handleRemoveCategory = useCallback((index: number) => {
        const newCategories = [...form.getValues('categories')];
        newCategories.splice(index, 1);
        form.setValue('categories', newCategories, {
            shouldValidate: true,
            shouldDirty: true
        });
    }, [form]);

    // Add a suggested category
    const handleAddSuggestedCategory = useCallback((category: string) => {
        if (!form.getValues('categories').includes(category)) {
            const currentCategories = form.getValues('categories');
            form.setValue('categories', [...currentCategories, category], {
                shouldValidate: true,
                shouldDirty: true
            });
        }
    }, [form]);

    // Toggle image preview
    const togglePreview = useCallback(() => {
        setShowPreview(!showPreview);
    }, [showPreview]);

    return (
        <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6">
            <Toaster />
            
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                    {t('title')}
                </h1>
                
                {previewUrl && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={togglePreview}
                        className="flex items-center gap-2"
                    >
                        <Eye className="h-4 w-4" />
                        {showPreview ? t('upload.hidePreview') : t('upload.showPreview')}
                    </Button>
                )}
            </div>
            
            {showPreview && previewUrl && (
                <div className="relative mb-8 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg overflow-hidden">
                    <div className="aspect-auto max-h-[400px] overflow-hidden rounded-md">
                        <Image
                            src={previewUrl}
                            alt={form.getValues('title') || t('upload.preview')}
                            width={1000}
                            height={1000}
                            className="w-full h-auto object-contain"
                        />
                    </div>
                    <div className="absolute top-4 right-4">
                        <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            className="rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-8 w-8"
                            onClick={togglePreview}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    {form.getValues('title') && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                            <h3 className="text-lg font-medium">{form.getValues('title')}</h3>
                            {form.getValues('categories').length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {form.getValues('categories').map((category, index) => (
                                        <span 
                                            key={index} 
                                            className="px-2 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full"
                                        >
                                            {category}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Top section: Title, Price, Status */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        {/* Title */}
                        <div className="md:col-span-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium">
                                            {t('field.title')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder={t('placeholder.title')} 
                                                {...field} 
                                                className="h-10"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        {/* Price */}
                        <div className="md:col-span-3">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium">
                                            {t('field.price')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder={t('placeholder.price')} 
                                                {...field} 
                                                className="h-10"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        {/* Status */}
                        <div className="md:col-span-3">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium">
                                            {t('field.status')}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-10">
                                                    <SelectValue placeholder={t('placeholder.status')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="available">{t('status.available')}</SelectItem>
                                                <SelectItem value="selling">{t('status.selling')}</SelectItem>
                                                <SelectItem value="hidden">{t('status.hidden')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    
                    {/* Middle section: Categories & Dimensions */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        {/* Categories */}
                        <div className="md:col-span-8 lg:col-span-9 space-y-3">
                            <FormField
                                control={form.control}
                                name="categories"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium">
                                            {t('field.categories')}
                                        </FormLabel>
                                        
                                        {/* Category input with add button */}
                                        <div className="relative">
                                            <Input
                                                ref={categoryInputRef}
                                                placeholder={t('placeholder.categories')}
                                                className="pr-10"
                                                onKeyDown={handleKeyDown}
                                                name="categoryInput"
                                            />
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                                onClick={handleAddCategory}
                                            >
                                                <Plus className="h-4 w-4" />
                                                <span className="sr-only">{t('button.add')}</span>
                                            </Button>
                                        </div>
                                        
                                        <FormDescription className="mt-1 text-xs">
                                            {t('helper.categories')}
                                        </FormDescription>
                                        
                                        {/* Selected categories */}
                                        {field.value.length > 0 && (
                                            <div className="mt-2">
                                                <div className="flex flex-wrap gap-2">
                                                    {field.value.map((category, index) => (
                                                        <div
                                                            key={`${category}-${index}`}
                                                            className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                                                        >
                                                            <span>{category}</span>
                                                            <button
                                                                type="button"
                                                                className="text-primary hover:text-primary/80 focus:outline-none"
                                                                onClick={() => handleRemoveCategory(index)}
                                                            >
                                                                <X className="h-3 w-3" />
                                                                <span className="sr-only">{t('button.remove')}</span>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Suggested categories */}
                                        {categories.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                                                    {t('helper.suggestedCategories')}
                                                </p>
                                                <div className="flex flex-wrap gap-2 py-1">
                                                    {categories
                                                        .filter((cat: string) => !field.value.includes(cat))
                                                        .map((category: string) => (
                                                            <button
                                                                key={category}
                                                                type="button"
                                                                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-xs hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary transition-colors"
                                                                onClick={() => handleAddSuggestedCategory(category)}
                                                            >
                                                                {category}
                                                            </button>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        {/* Dimensions */}
                        <div className="md:col-span-4 lg:col-span-3">
                            <FormLabel className="text-base font-medium block mb-2">
                                {t('field.width')}/{t('field.height')}
                            </FormLabel>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="width"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center h-10 px-3 rounded-md bg-gray-50 dark:bg-gray-800/40 text-sm border border-gray-200 dark:border-gray-700">
                                                {field.value ? `${field.value} px` : '-'}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="height"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center h-10 px-3 rounded-md bg-gray-50 dark:bg-gray-800/40 text-sm border border-gray-200 dark:border-gray-700">
                                                {field.value ? `${field.value} px` : '-'}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Bottom section: Description and Image Upload */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        {/* Description - 2/3 of width */}
                        <div className="md:col-span-2 order-2 md:order-1">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium">
                                            {t('field.description')}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('placeholder.description')}
                                                className="min-h-[410px] resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-sm mt-2">
                                            {t('helper.description')}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        {/* Image Upload - 1/3 of width */}
                        <div className="md:col-span-1 order-1 md:order-2">
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium">
                                            {t('field.image')}
                                        </FormLabel>
                                        
                                        <div className={`border rounded-lg ${isImageUploaded ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700'} overflow-hidden transition-colors duration-300`}>
                                            <FileUploader
                                                accept={{ 'image/*': [] }}
                                                maxFiles={1}
                                                maxSize={5 * 1024 * 1024}
                                                icon={<ImageIcon className="h-10 w-10 opacity-70" />}
                                                onFileUpload={(files) => {
                                                    const file = files[0];
                                                    field.onChange(file.url);
                                                    setIsImageUploaded(true);
                                                    setPreviewUrl(file.url);
                                                    
                                                    if (file.width !== undefined) {
                                                        form.setValue('width', file.width.toString());
                                                    }
                                                    if (file.height !== undefined) {
                                                        form.setValue('height', file.height.toString());
                                                    }
                                                }}
                                            />
                                        </div>
                                        
                                        <FormDescription>
                                            {t('helper.image')}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    
                    {/* Submit Button and language info */}
                    <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 mt-8">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {locale === 'en' ? (
                                <span>This form is also available in <span className="text-primary font-medium">Vietnamese</span></span>
                            ) : (
                                <span>Biểu mẫu này cũng có sẵn bằng <span className="text-primary font-medium">Tiếng Anh</span></span>
                            )}
                        </div>
                        
                        <Button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-2 h-11 bg-primary hover:bg-primary/90 text-white relative"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>{t('button.uploading')}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <ArrowUp className="h-4 w-4" />
                                    <span>{t('button.upload')}</span>
                                </div>
                            )}

                            {/* Success indicator */}
                            {mutation.isSuccess && (
                                <motion.div 
                                    className="absolute inset-0 flex items-center justify-center bg-green-500 text-white"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4" />
                                        <span>{t('toast.successTitle')}</span>
                                    </div>
                                </motion.div>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
