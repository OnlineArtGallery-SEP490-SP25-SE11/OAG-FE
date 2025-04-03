'use client';

import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardFooter, 
  CardHeader, 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Save, Tag, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Artwork } from "../interface";
import { artworkService } from "../queries";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { vietnamCurrency } from "@/utils/converters";
import { STATUS_OPTIONS } from "../constant";

// Define the schema for form validation
const artworkFormSchema = z.object({
  title: z.string().min(2, {
    message: "Tiêu đề phải có ít nhất 2 ký tự",
  }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, {
    message: "Giá phải là số không âm",
  }),
  status: z.enum(["Available", "Hidden", "Selling"]),
  category: z.array(z.string()).min(1, {
    message: "Vui lòng chọn ít nhất một danh mục",
  }),
});

type ArtworkFormValues = z.infer<typeof artworkFormSchema>;

interface EditArtworkFormProps {
  artwork: Artwork;
  onClose: () => void;
}

export default function EditArtworkForm({ artwork, onClose }: EditArtworkFormProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("info");
  const [newCategory, setNewCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with artwork data
  const form = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkFormSchema),
    defaultValues: {
      title: artwork.title || "",
      description: artwork.description || "",
      price: artwork.price || 0,
      status: artwork.status as any,
      category: artwork.category || [],
    },
  });
  
  const categories = form.watch("category");
  
  // Setup mutation for updating artwork
  const updateArtworkMutation = useMutation({
    mutationFn: (data: Partial<Artwork>) => artworkService.update(artwork._id, data),
    onSuccess: () => {
      // Invalidate and refetch queries after successful update
      queryClient.invalidateQueries({ 
        queryKey: ['artworks']
      });
      setIsSubmitting(false);
      onClose();
    },
    onError: (error) => {
      console.error("Error updating artwork:", error);
      setIsSubmitting(false);
    },
  });
  
  const onSubmit = (data: ArtworkFormValues) => {
    setIsSubmitting(true);
    updateArtworkMutation.mutate(data);
  };
  
  const handleAddCategory = () => {
    if (newCategory.trim() !== "" && !categories.includes(newCategory.trim())) {
      form.setValue("category", [...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };
  
  const handleRemoveCategory = (category: string) => {
    form.setValue(
      "category", 
      categories.filter((cat) => cat !== category)
    );
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCategory();
    }
  };
  
  const getStatusColor = (status: string) => {
    const option = STATUS_OPTIONS.find((opt) => opt.value === status);
    return option ? option.color : 'bg-gray-500';
  };
  
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-0 mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="preview">Xem trước</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="mt-0">
            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-4">
              <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800">
                <Image
                  src={artwork.url || "/placeholder.svg"}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm text-white">
                  {artwork.dimensions ? `${artwork.dimensions.width} × ${artwork.dimensions.height}` : 'Kích thước chưa rõ'}
                </div>
                <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(artwork.status)} text-white`}>
                  {STATUS_OPTIONS.find(s => s.value === artwork.status)?.label || artwork.status}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100">{artwork.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-3">
                  {artwork.description || "Không có mô tả"}
                </p>
                
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
                    {vietnamCurrency(artwork.price)}
                  </p>
                  {artwork.views !== undefined && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {artwork.views.toLocaleString()} lượt xem
                    </p>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((category, index) => (
                    <Badge key={index} variant="outline" className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="mt-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu đề tác phẩm" {...field} />
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
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Mô tả về tác phẩm"
                          className="min-h-[100px] resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá (VND)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
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
                        <FormLabel>Trạng thái</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {STATUS_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center">
                                  <span className={`inline-block w-2 h-2 rounded-full ${option.color} mr-2`}></span>
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="category"
                  render={() => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5" />
                        Danh mục
                      </FormLabel>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <AnimatePresence>
                          {categories.map((category, index) => (
                            <motion.div
                              key={`${category}-${index}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.15 }}
                            >
                              <Badge className="pl-2 pr-1 py-1 h-7 flex items-center gap-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800">
                                {category}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 rounded-full p-0 hover:bg-teal-100 dark:hover:bg-teal-800 text-teal-700 dark:text-teal-300"
                                  onClick={() => handleRemoveCategory(category)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="Thêm danh mục mới"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={handleAddCategory}
                          disabled={!newCategory.trim()}
                          className="border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Thêm
                        </Button>
                      </div>
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <CardFooter className="flex justify-end gap-3 px-0 pt-2 pb-0">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    className="border-gray-200 dark:border-gray-700"
                    disabled={isSubmitting}
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
}