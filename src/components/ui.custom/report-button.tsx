import useAuthClient from '@/hooks/useAuth-client';
import reportService from '@/service/report-service';
import { useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { ReportForm, reportSchema } from '@/types/report';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReasonReport, RefType } from '@/utils/enums';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import FileUploader from './file-uploader';

interface CreateReportProps {
  refId?: string;
  refType?: RefType;
  triggerElement?: React.ReactNode;
  url?: string;
}

export default function CreateReport({
  refId,
  refType = RefType.USER,
  triggerElement,
  url = ''
}: CreateReportProps) {
  // Early return before any hooks are called
  if (!refId) return null;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
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

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      // Reset form with current values
      form.reset({
        refId: refId,
        refType: refType,
        reason: ReasonReport.SPAM,
        description: '',
        url: url || window.location.href,
        image: []
      });
    }
  }, [open, refId, refType, url, form]);

  // Add console.log to check form errors
  useEffect(() => {
    console.log("Form errors:", form.formState.errors);
  }, [form.formState.errors]);

  const mutation = useMutation({
    mutationFn: (data: ReportForm) => {
      console.log("Sending data to server:", data);
      return reportService.create(data);
    },
    onSuccess: () => {
      console.log("Mutation successful");
      toast({
        title: 'Success',
        description: 'Report created successfully!',
        className: 'bg-green-500 text-white border-green-600',
        duration: 2000
      });
      
      // Close dialog after successful submission
      setOpen(false);
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      console.log("Mutation error:", error);
      toast({
        title: 'Error',
        description: error?.message || 'Failed to create report',
        className: 'bg-red-500 text-white border-red-600',
        duration: 2000
      });
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: ReportForm) => {
    console.log("Form submission started with data:", data);
    setIsSubmitting(true);
    
    // Add a short delay to ensure the log is visible
    setTimeout(() => {
      console.log("About to mutate with data:", data);
      mutation.mutate(data);
    }, 500);
  };

  console.log("Current form values:", form.getValues());
  console.log("Dialog open state:", open);

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      console.log("Dialog changing to:", newOpen);
      setOpen(newOpen);
    }}>
      <DialogTrigger asChild>
        {triggerElement || (
          <Button 
            variant='outline' 
            size='sm' 
            onClick={() => console.log("Trigger button clicked")}
          >
            Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-white pb-2 z-10">
          <DialogTitle>Report Content</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              console.log("Form submit event triggered");
              form.handleSubmit((data) => {
                console.log("Form validated successfully", data);
                onSubmit(data);
              })(e);
            }}
            className='space-y-3'
          >
            <div className='grid grid-cols-1 gap-3'>
              {/* Reason field */}
              <FormField
                control={form.control}
                name='reason'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Reason</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        console.log("Reason changed to:", value);
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select a reason' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(
                          ReasonReport
                        ).map(([key, value]) => (
                          <SelectItem
                            key={key}
                            value={value}
                          >
                            {key.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* URL field (optional) */}
              <FormField
                control={form.control}
                disabled
                name='url'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Link to related content'
                        {...field}
                        className='w-full'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* type of report */}
              <FormField
                control={form.control}
                disabled
                name='refType'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input
                        value={
                          field.value === RefType.ARTWORK
                            ? 'ARTWORK'
                            : field.value === RefType.USER
                            ? 'USER'
                            : field.value === RefType.BLOG
                            ? 'BLOG'
                            : String(field.value)
                        }
                        className='w-full'
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description field */}
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Please provide details about this report'
                        className='min-h-[80px] w-full'
                        {...field}
                        onChange={(e) => {
                          console.log("Description changed:", e.target.value);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image upload field (optional) */}
              <FormField
                control={form.control}
                name='image'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Evidence Images</FormLabel>
                    <FormControl>
                      <div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
                        <FileUploader
                          multiple
                          onFileUpload={(files) => {
                            if (files.length > 0) {
                              const urls = files.map(
                                (file) => file.url
                              );
                              console.log("Files uploaded:", urls);
                              field.onChange(urls);
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className='mt-4 pt-2 border-t sticky bottom-0 bg-white z-10'>
              <DialogClose asChild>
                <Button
                  type='button'
                  variant='outline'
                  disabled={isSubmitting}
                  onClick={() => console.log("Cancel button clicked")}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type='submit'
                disabled={isSubmitting}
                onClick={() => console.log("Submit button clicked")}
                className='ml-2'
              >
                {isSubmitting ? 'Creating...' : 'Create Report'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}