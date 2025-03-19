import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { STATUS_OPTIONS } from "../constant";
import { Artwork } from "../interface";
import { artworkService } from "../queries";
import { artworkFormUpdateSchema } from "../schema";

function EditArtworkForm({ artwork, onClose }: { artwork: Artwork; onClose: () => void }) {
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof artworkFormUpdateSchema>>({
        resolver: zodResolver(artworkFormUpdateSchema),
        defaultValues: {
            title: artwork.title,
            description: artwork.description || '',
            status: artwork.status,
            price: artwork.price,
        },
    });

    const updateArtworkMutation = useMutation({
        mutationFn: (updatedData: Partial<Artwork>) => artworkService.update(artwork._id, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['artworks'] });
            onClose();
        },
        onError: (error) => console.error('Update failed:', error),
    });

    const onSubmit = (data: z.infer<typeof artworkFormUpdateSchema>) => {
        updateArtworkMutation.mutate({
            title: data.title,
            description: data.description,
            status: data.status as 'Available' | 'Sold' | 'Hidden' | 'Selling',
            price: data.price,
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter artwork title"
                                    {...field}
                                    className="rounded-lg border-gray-200 dark:border-gray-700 shadow-sm"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl
                                className="h-32"
                            >
                                <Textarea
                                    placeholder="Enter description"
                                    {...field}
                                    className="rounded-lg border-gray-200 dark:border-gray-700 shadow-sm"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="rounded-lg border-gray-200 dark:border-gray-700 shadow-sm">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {STATUS_OPTIONS.filter(opt => opt.value !== 'all').map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            <span className={`inline-block w-2 h-2 rounded-full ${option.color} mr-2`}></span>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter price"
                                    {...field}
                                    value={field.value ?? ''}
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                    className="rounded-lg border-gray-200 dark:border-gray-700 shadow-sm"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-2">
                    <Button
                        type="submit"
                        disabled={updateArtworkMutation.isPending}
                        className="flex-1"
                    >
                        {updateArtworkMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                    <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                </div>
            </form>
        </Form>
    );
}

export default EditArtworkForm