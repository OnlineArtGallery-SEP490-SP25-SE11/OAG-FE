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
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  FileText, 
  ImageIcon, 
  Loader2, 
  Plus, 
  Save, 
  Tag, 
  X,
  Info,
  CheckCircle
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Artwork } from "../interface";
import { artworkService } from "../queries";
import { useState, useEffect } from "react";
import Image from "next/image";
import { vietnamCurrency } from "@/utils/converters";
import { ARTWORK_STATUS } from "../constant";
import { useTranslations } from "next-intl";

// Define the schema for form validation
const artworkFormSchema = z.object({
  title: z.string().min(2, {
    message: "Tiêu đề phải có ít nhất 2 ký tự",
  }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, {
    message: "Giá phải là số không âm",
  }),
  status: z.enum(["available", "sold", "hidden", "selling"]),
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
  const t = useTranslations("artwork");
  const tCommon = useTranslations("common");
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("info");
  const [newCategory, setNewCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Initialize form with artwork data
  const form = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkFormSchema),
    defaultValues: {
      title: artwork.title || "",
      description: artwork.description || "",
      price: artwork.price || 0,
      status: artwork.status || "available",
      category: artwork.category || [],
    },
  });
  
  const categories = form.watch("category");
  const status = form.watch("status");
  
  // Setup mutation for updating artwork
  const updateArtworkMutation = useMutation({
    mutationFn: (data: Partial<Artwork>) => artworkService.update(artwork._id, data),
    onSuccess: () => {
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
    const option = ARTWORK_STATUS(t).find((opt) => opt.value === status);
    return option ? option.color : 'bg-gray-500';
  };
  
  const getStatusLabel = (status: string) => {
    const option = ARTWORK_STATUS(t).find((opt) => opt.value === status);
    return option ? option.label : status;
  };

  // Define tabs for vertical navigation
  const tabs = [
    { id: "info", label: t("tabs.info"), icon: <Info className="h-4 w-4" /> },
    { id: "preview", label: t("tabs.preview"), icon: <ImageIcon className="h-4 w-4" /> },
  ];
  
  return (
    <div className={`w-[60vw] h-[80vh] bg-white dark:bg-gray-900 rounded-lg overflow-hidden ${isMobile ? 'flex flex-col' : 'flex'} 
      shadow-xl border-2 border-gray-200 dark:border-gray-700 ring-1 ring-gray-950/5 dark:ring-white/10`}>
      {/* Sidebar with vertical tabs */}
      <div className={`${isMobile ? 'w-full border-b' : 'w-44 border-r'} border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 ${isMobile ? 'p-2' : 'p-3'} flex ${isMobile ? 'flex-row items-center justify-between' : 'flex-col'}`}>
        <div className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${isMobile ? 'mr-2' : 'mb-3 px-2'}`}>
          {!isMobile && t("edit_artwork")}
        </div>
        
        {/* Tab navigation */}
        <div className={`${isMobile ? 'flex space-x-1' : 'space-y-1 flex-1'}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${isMobile ? 'flex-1' : 'w-full'} flex items-center ${isMobile ? 'justify-center' : ''} gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={activeTab === tab.id ? "text-teal-600 dark:text-teal-400" : "text-gray-500 dark:text-gray-400"}>
                {tab.icon}
              </span>
              <span className={isMobile ? 'hidden sm:inline' : ''}>{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Bottom actions */}
        <div className={`${isMobile ? 'flex space-x-2' : 'pt-3 mt-auto border-t border-gray-200 dark:border-gray-700'}`}>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className={`${isMobile ? 'flex-1 justify-center h-8' : 'w-full justify-start text-sm h-9 px-3 border-gray-200 dark:border-gray-700 mb-2'}`}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2" />
            <span className={isMobile ? 'hidden sm:inline' : ''}>{tCommon("cancel")}</span>
          </Button>
          <Button 
            form="artwork-form"
            type="submit" 
            disabled={isSubmitting || !form.formState.isDirty}
            className={`${isMobile ? 'flex-1 justify-center h-8' : 'w-full bg-teal-600 hover:bg-teal-700 text-white text-sm h-9 justify-start'}`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span className={isMobile ? 'hidden sm:inline' : ''}>{t("button.saving")}</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <span className={isMobile ? 'hidden sm:inline' : ''}>{tCommon("save_changes")}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Info tab content */}
        {activeTab === "info" && (
          <div className="p-3 md:p-5">
            <Form {...form}>
              <form id="artwork-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Left column - Image */}
                  <div className="md:w-2/5">
                    <div className="aspect-square relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={artwork.url || "/placeholder.svg"}
                        alt={artwork.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    <div className="text-xs text-gray-600 dark:text-gray-400 text-center mt-2">
                      {artwork.dimensions ? `${artwork.dimensions.width} × ${artwork.dimensions.height} px` : t("no_dimensions")}
                    </div>
                  </div>
                  
                  {/* Right column - Info */}
                  <div className="md:w-3/5 space-y-4">
                    {/* Title field */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5 text-sm">
                            <FileText className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                            {t("field.title")}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t("placeholder.title")} {...field} className="text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Status selector */}
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1.5 text-sm">
                              <CheckCircle className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                              {t("field.status")}
                            </FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full text-sm">
                                  <SelectValue placeholder={t("placeholder.status")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ARTWORK_STATUS(t).filter(option => option.value !== 'all').map((option) => (
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
                      
                      {/* Price field */}
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1.5 text-sm">
                              <DollarSign className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                              {t("field.price")} (VND)
                            </FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} className="text-sm" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Categories */}
                    <FormField
                      control={form.control}
                      name="category"
                      render={() => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5 text-sm">
                            <Tag className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                            {t("field.categories")}
                          </FormLabel>
                          
                          <div className="space-y-2">
                            {/* Add new category */}
                            <div className="flex gap-2">
                              <Input
                                placeholder={t("placeholder.add_category")}
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 text-sm h-8"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={handleAddCategory}
                                disabled={!newCategory.trim()}
                                className="border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-900/30 whitespace-nowrap h-8"
                              >
                                <Plus className="h-3.5 w-3.5 mr-1" /> {t("button.add")}
                              </Button>
                            </div>
                            
                            {/* Selected categories */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-md p-2 h-[80px] overflow-y-auto bg-gray-50 dark:bg-gray-800">
                              {categories.length === 0 ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                  {t("no_categories")}
                                </p>
                              ) : (
                                <div className="flex flex-wrap gap-1.5">
                                  {categories.map((category, index) => (
                                    <div
                                      key={`${category}-${index}`}
                                      className="flex items-center gap-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 px-2 py-1 rounded-md"
                                    >
                                      <span className="text-xs">{category}</span>
                                      <button
                                        type="button"
                                        className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 focus:outline-none"
                                        onClick={() => handleRemoveCategory(category)}
                                      >
                                        <X className="h-3 w-3" />
                                        <span className="sr-only">{t("button.remove_category")}</span>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Description field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 text-sm">
                        <FileText className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                        {t("field.description")}
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t("placeholder.description")}
                          className="h-[120px] min-h-0 resize-none text-sm"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        )}
        
        {/* Preview tab content - Horizontal display */}
        {activeTab === "preview" && (
          <div className="p-3 md:p-5">
            <div className="max-w-3xl mx-auto">
              {/* Horizontal preview card */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md md:flex">
                {/* Image with status badge - Left side */}
                <div className="md:w-1/2 relative aspect-square md:aspect-auto md:min-h-[300px] bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={artwork.url || "/placeholder.svg"}
                    alt={form.getValues('title')}
                    fill
                    className="object-contain"
                  />
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium bg-black/50 backdrop-blur-sm text-white">
                    {artwork.dimensions ? `${artwork.dimensions.width} × ${artwork.dimensions.height}` : t("dimensions_unknown")}
                  </div>
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(status)} text-white`}>
                    {getStatusLabel(status)}
                  </div>
                </div>
                
                {/* Content - Right side */}
                <div className="md:w-1/2 p-4 md:p-6 flex flex-col h-full">
                  {/* Title and price */}
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {form.getValues('title')}
                    </h3>
                    <p className="text-base font-medium text-teal-600 dark:text-teal-400">
                      {vietnamCurrency(form.getValues('price'))}
                    </p>
                  </div>
                  
                  {/* Categories */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {categories.map((category, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Description */}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex-grow">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("artwork_description")}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                      {form.getValues('description') || t("no_description")}
                    </p>
                  </div>
                  
                  {/* Preview note */}
                  <div className="mt-auto pt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Info className="h-3.5 w-3.5 mr-1.5 text-teal-500 dark:text-teal-400" />
                    {t("preview_note")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}