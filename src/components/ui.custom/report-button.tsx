import { useState, useCallback, useRef, Fragment, useEffect } from 'react';
import useAuthClient from '@/hooks/useAuth-client';
import reportService from '@/service/report-service';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { ReportForm, reportSchema } from '@/types/report';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReasonReport, RefType } from '@/utils/enums';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import FileUploader from './file-uploader';
import { useTranslations } from 'next-intl';
import { X, AlertTriangle, ChevronDown, Shield, Info, Flag, AlertOctagon, BadgeAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateReportProps {
  refId?: string;
  refType?: RefType;
  triggerElement?: React.ReactNode;
  url?: string;
}

// Helper function to get icon for reason type
const getReasonIcon = (reason: ReasonReport) => {
  switch(reason) {
    case ReasonReport.INAPPROPRIATE:
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case ReasonReport.COPYRIGHT:
      return <Shield className="w-4 h-4 text-blue-500" />;
    case ReasonReport.HARASSMENT:
      return <AlertOctagon className="w-4 h-4 text-red-500" />;
    case ReasonReport.SPAM:
      return <BadgeAlert className="w-4 h-4 text-orange-500" />;
    case ReasonReport.Other:
      return <Info className="w-4 h-4 text-gray-500" />;
    default:
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  }
};

export default function CreateReport({
  refId,
  refType = RefType.USER,
  triggerElement,
  url = ''
}: CreateReportProps) {
  // Early return before any hooks are called
  if (!refId) return null;
  
  const t = useTranslations('report');
  const tCommon = useTranslations('common');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reasonsOpen, setReasonsOpen] = useState(false);
  const reasonsRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  // Prepare form with initial values
  const form = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      refId: refId,
      refType: refType,
      reason: ReasonReport.SPAM,
      description: '',
      url: url || window.location.href,
      image: []
    }
  });

  // Reset form when modal opens
  const handleOpenModal = useCallback((open: boolean) => {
    if (open) {
      // Reset form fields
      form.reset({
        refId: refId,
        refType: refType,
        reason: ReasonReport.SPAM,
        description: '',
        url: url || window.location.href,
        image: []
      });
      
      setReasonsOpen(false);
      
      // Focus on textarea after a small delay
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    }
    
    setIsModalOpen(open);
  }, [form, refId, refType, url]);

  // Handle escape key for dropdowns - using useCallback
  const handleEscapeKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && reasonsOpen) {
      e.stopPropagation(); // Prevent closing dialog
      setReasonsOpen(false);
    }
  }, [reasonsOpen]);

  // Toggle reasons dropdown - using useCallback
  const toggleReasons = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setReasonsOpen(!reasonsOpen);
  }, [reasonsOpen]);

  // Select reason - using useCallback
  const selectReason = useCallback((value: ReasonReport) => {
    console.log('Selected reason:', value);
    form.setValue("reason", value);
    setReasonsOpen(false);
  }, [form]);

  // Handle clicking outside dropdown - using useCallback
  const handleOutsideDropdownClick = useCallback((e: MouseEvent) => {
    if (reasonsOpen && reasonsRef.current && !reasonsRef.current.contains(e.target as Node)) {
      setReasonsOpen(false);
    }
  }, [reasonsOpen]);

  // Set up click listener for dropdown
  useEffect(() => {
    if (reasonsOpen) {
      document.addEventListener('mousedown', handleOutsideDropdownClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideDropdownClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideDropdownClick);
    };
  }, [reasonsOpen, handleOutsideDropdownClick]);

  // Form submission using useMutation
  const mutation = useMutation({
    mutationFn: (data: ReportForm) => reportService.create(data),
    onSuccess: () => {
      toast({
        title: tCommon('success'),
        description: t('toast.success'),
        variant: 'success',
        duration: 3000
      });
      handleOpenModal(false);
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      toast({
        title: tCommon('error'),
        description: error?.message || t('toast.error'),
        variant: 'destructive',
        duration: 3000
      });
      setIsSubmitting(false);
    }
  });

  // Handle form submission - using useCallback
  const onSubmit = useCallback((data: ReportForm) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  }, [mutation]);

  // Focus textarea - using useCallback
  const focusTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Get current reason text
  const getCurrentReasonText = useCallback(() => {
    const currentReason = form.watch("reason");
    console.log('Current reason:', currentReason);
    try {
      return t(`reasons.${currentReason.toLowerCase()}`);
    } catch (error) {
      console.error('Error getting reason text:', error); // Log any errors
      return t("reasons.spam");
    }
  }, [form, t]);

  return (
    <>
      {/* Trigger button */}
      <div className="inline-block" onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleOpenModal(true);
      }}>
        {triggerElement || (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/70 border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 transition-all focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30"
            aria-label={t('buttonAriaLabel')}
            type="button"
          >
            <Flag className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>{t('button')}</span>
          </Button>
        )}
      </div>
      
      {/* ShadCN UI Dialog Implementation */}
      <Dialog open={isModalOpen} onOpenChange={handleOpenModal}>
        <DialogContent 
          className="max-w-5xl p-0 gap-0 overflow-hidden" 
          onKeyDown={handleEscapeKey}
          onInteractOutside={(e) => {
            if (reasonsOpen) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader className="px-6 py-5 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50">
            <DialogTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              <Flag className="w-5 h-5 text-amber-500" />
              {t('title')}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('description')}
            </DialogDescription>
          </DialogHeader>

          {/* Form body with optimized layout */}
          <div className="p-6">                
            <Form {...form}>
              <form id="reportForm" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-6">
                  {/* Left column - Form fields */}
                  <Fragment>
                    <div className="space-y-4">
                      {/* Reason and Type in same row */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Reasons selection */}
                        <FormField
                          control={form.control}
                          name="reason"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {t('fields.reason')} <span className="text-red-500">*</span>
                              </FormLabel>
                              <div ref={reasonsRef} className="relative">
                                <button
                                  type="button"
                                  onClick={toggleReasons}
                                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-md
                                    text-left flex items-center justify-between gap-2 text-sm
                                    border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600
                                    focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30
                                    transition-colors"
                                  aria-haspopup="listbox"
                                  aria-expanded={reasonsOpen}
                                >
                                  <span className="flex items-center gap-2">
                                    {getReasonIcon(form.watch("reason") || ReasonReport.SPAM)}
                                    <span className="block truncate font-medium">
                                      {getCurrentReasonText()}
                                    </span>
                                  </span>
                                  <ChevronDown className="h-4 w-4 text-gray-500" />
                                </button>

                                {/* Dropdown */}
                                {reasonsOpen && (
                                  <div 
                                    className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 
                                    border border-gray-200 dark:border-gray-700 rounded-md shadow-lg 
                                    max-h-64 overflow-auto"
                                    tabIndex={-1}
                                    role="listbox"
                                  >
                                    {Object.entries(ReasonReport).map(([key, value]) => (
                                      <div
                                        key={key}
                                        className={`px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700
                                        ${form.getValues("reason") === value ? "bg-primary/5 text-primary font-medium" : ""}`}
                                        onClick={() => selectReason(value)}
                                      >
                                        <div className="flex items-center gap-2">
                                          {getReasonIcon(value)}
                                          <span>{t(`reasons.${value.toLowerCase()}`)}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          )}
                        />

                        {/* Content type */}
                        <FormField
                          control={form.control}
                          disabled
                          name="refType"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('fields.type')}
                              </FormLabel>
                              <FormControl>
                                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/50 
                                  border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-500">
                                  <Shield className="h-4 w-4 text-gray-400" />
                                  {t(`types.${field.value.toLowerCase()}`)}
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Description field */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="space-y-1.5">
                            <FormLabel className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {t('fields.description')} <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div 
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-md"
                                onClick={focusTextarea}
                              >
                                <Textarea
                                  value={field.value}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  ref={textareaRef}
                                  placeholder={t('placeholders.description')}
                                  className="h-[317px] w-full resize-none bg-white dark:bg-gray-800 
                                    border-0 focus:ring-0 focus:outline-none text-sm p-3"
                                  autoComplete="off"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Fragment>
                  
                  {/* Right column - Image upload */}
                  <Fragment>
                    {/* Evidence upload */}
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem className="h-full">
                          <div className="flex justify-between items-center mb-1.5">
                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {t('fields.evidence')} <span className="text-red-500">*</span>
                            </FormLabel>
                            <div className="text-xs text-gray-500">
                              {field.value?.length > 0 
                                ? `${field.value.length} ${field.value.length === 1 ? 'file' : 'files'} selected` 
                                : t('placeholders.noFiles')}
                            </div>
                          </div>
                          <FormControl>
                            <div className="border border-gray-300 dark:border-gray-700 rounded-md p-5 
                              bg-gray-50 dark:bg-gray-800/50 h-[457px] flex items-center justify-center">
                              <FileUploader
                                multiple
                                onFileUpload={(files) => {
                                  if (files.length > 0) {
                                    const urls = files.map((file) => file.url);
                                    field.onChange(urls);
                                  }
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </Fragment>
                </div>

                {/* Footer Actions */}
                <DialogFooter className="flex justify-end gap-4 pt-5 border-t dark:border-gray-800 mt-5 px-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenModal(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm bg-white hover:bg-gray-50 active:bg-gray-100
                      dark:bg-gray-800 dark:hover:bg-gray-750 dark:active:bg-gray-700 
                      border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600
                      text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-gray-200/50 dark:focus:ring-gray-700/50
                      disabled:opacity-60 disabled:pointer-events-none transition-all"
                  >
                    {tCommon('cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm text-white 
                      bg-primary hover:bg-primary-600 active:bg-primary-700
                      dark:bg-primary-600 dark:hover:bg-primary-500 dark:active:bg-primary-400
                      flex items-center gap-2 shadow-sm 
                      focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-primary/50
                      disabled:opacity-60 disabled:pointer-events-none transition-all"
                  >
                    {isSubmitting ? (
                      <Fragment>
                        <svg className="animate-spin h-4 w-4 text-white/90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{t('button.submitting')}</span>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <Flag className="w-4 h-4" />
                        <span>{t('button.submit')}</span>
                      </Fragment>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
