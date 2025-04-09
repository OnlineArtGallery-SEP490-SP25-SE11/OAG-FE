'use client';

import { Exhibition, ExhibitionStatus } from "@/types/exhibition";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Rocket, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExhibitionInfoHeader } from "../../components/exhibition-info-header";
import ExhibitionPublishStatus from "./exhibition-publish-status";
import { LoaderButton } from "@/components/ui.custom/loader-button";
import { useExhibition } from "../../../context/exhibition-provider";
import ExhibitionDateManager, { DateFormValues } from "./exhibition-date-manager";
import LinkNameManager from "./exhibition-linkname-manager";
import DiscoveryManager from "./exhibition-discovery-manager";
import TicketManager, { TicketData } from "./ticket-manager";

// Define operation types for tracking specific loading states
type UpdateOperation = 'linkName' | 'publish' | 'unpublish' | 'discovery' | 'dates' | 'ticket';

// Link name form schema
const linkNameSchema = z.object({
  linkName: z.string()
    .min(3, { message: 'Link name must be at least 3 characters long' })
    .max(30, { message: 'Link name must be less than 30 characters' })
    .regex(/^[a-z0-9-]+$/, {
      message: 'Link name can only contain lowercase letters, numbers, and hyphens'
    })
});

// Date form schema
const dateFormSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

// Form values for link name
type LinkFormValues = z.infer<typeof linkNameSchema>;

export default function PublishContent({ exhibition }: { exhibition: Exhibition }) {
  const t = useTranslations('exhibitions');
  const tCommon = useTranslations('common');
  const { toast } = useToast();
  const { updateExhibition, isUpdating } = useExhibition();
  const [isPublished, setIsPublished] = useState(exhibition.status === ExhibitionStatus.PUBLISHED);
  // Track operation-specific loading states
  const [currentOperation, setCurrentOperation] = useState<UpdateOperation | null>(null);
  const [isDiscoverable, setIsDiscoverable] = useState(exhibition.discovery || false);
  
  const baseUrl = 'oag-vault.vercel.app/exhibition/';

  // Initialize the forms with exhibition data
  const linkNameForm = useForm<LinkFormValues>({
    resolver: zodResolver(linkNameSchema),
    defaultValues: {
      linkName: exhibition.linkName || '',
    }
  });

  // Initialize date form
  const dateForm = useForm<DateFormValues>({
    resolver: zodResolver(dateFormSchema),
    defaultValues: {
      startDate: exhibition.startDate ? new Date(exhibition.startDate) : undefined,
      endDate: exhibition.endDate ? new Date(exhibition.endDate) : undefined
    }
  });

  // Helper to check if a specific operation is in progress
  const isOperationLoading = (operation: UpdateOperation) => isUpdating && currentOperation === operation;
  
  // Handle link name update
  const handleLinkNameSave = async (linkName: string) => {
    setCurrentOperation('linkName');
    await updateExhibition(
      { linkName },
      {
        onSuccess: () => {
          toast({
            title: tCommon('success'),
            description: t('link_name_updated'),
            variant: 'success',
          });
          linkNameForm.reset({ linkName });
          setCurrentOperation(null);
        },
        onError: (error) => {
          console.log('Error updating link name:', error);
          toast({
            title: tCommon('error'),
            description: t(error.err?.message || 'link_name_update_failed'),
            variant: 'destructive',
          });
          setCurrentOperation(null);
        }
      }
    );
  };

  // Handle date updates
  const handleSaveDates = async (dates: DateFormValues) => {
    setCurrentOperation('dates');
    await updateExhibition(
      {
        startDate: dates.startDate,
        endDate: dates.endDate
      },
      {
        onSuccess: () => {
          toast({
            title: tCommon('success'),
            description: t('dates_updated'),
            variant: 'success',
          });
          setCurrentOperation(null);
        },
        onError: () => {
          toast({
            title: tCommon('error'),
            description: t('dates_update_failed'),
            variant: 'destructive',
          });
          setCurrentOperation(null);
        }
      }
    );
  };

  // Handle discovery toggle with immediate update
  const handleDiscoveryToggle = async (checked: boolean) => {
    if (!isPublished) return;
    
    setCurrentOperation('discovery');
    setIsDiscoverable(checked); // Update local state optimistically
    
    await updateExhibition(
      { discovery: checked },
      {
        onSuccess: () => {
          toast({
            title: tCommon('success'),
            description: t('discovery_updated'),
            variant: 'success',
          });
          setCurrentOperation(null);
        },
        onError: () => {
          // Revert the UI state on failure
          setIsDiscoverable(!checked);
          toast({
            title: tCommon('error'),
            description: t('discovery_update_failed'),
            variant: 'destructive',
          });
          setCurrentOperation(null);
        }
      }
    );
  };

  // Handle unpublish
  const handleUnpublish = async () => {
    if (isUpdating && currentOperation) return;

    if (exhibition.artworkPositions.length === 0) {
      toast({
        title: tCommon('error'),
        description: t('unpublish_no_artworks'),
        variant: 'destructive',
      });
      return;
    }

    //

    setCurrentOperation('unpublish');
    await updateExhibition(
      { status: ExhibitionStatus.DRAFT },
      {
        onSuccess: () => {
          setIsPublished(false);
          toast({
            title: tCommon('success'),
            description: t('exhibition_unpublished'),
            variant: 'success',
          });
          setCurrentOperation(null);
        },
        onError: (error) => {
          toast({
            title: tCommon('error'),
            description: t(error.err?.message || 'unpublish_failed'),
            variant: 'destructive',
          });
          setCurrentOperation(null);
        }
      }
    );
  };

  // Submit handler for publishing the exhibition
  const handlePublish = async () => {
    const linkName = linkNameForm.getValues('linkName');
    const startDate = dateForm.getValues('startDate');
    const endDate = dateForm.getValues('endDate');
    
    if (!linkName || linkNameForm.formState.errors.linkName) {
      toast({
        title: tCommon('error'),
        description: t('invalid_link_name'),
        variant: 'destructive',
      });
      return;
    }
    
    setCurrentOperation('publish');
    await updateExhibition(
      {
        linkName,
        status: ExhibitionStatus.PUBLISHED,
        startDate,
        endDate
      },
      {
        onSuccess: () => {
          setIsPublished(true);
          toast({
            title: tCommon('success'),
            description: t('exhibition_published'),
            variant: 'success',
          });
          setCurrentOperation(null);
        },
        onError: (error) => {
          toast({
            title: tCommon('error'),
            description: t(error.err?.message || 'publish_failed'),
            variant: 'destructive',
          });
          setCurrentOperation(null);
        }
      }
    );
  };

  const [ticket, setTicket] = useState<TicketData>({
    requiresPayment: exhibition.ticket?.requiresPayment || false,
    price: exhibition.ticket?.price || 0,
    registeredUsers: exhibition.ticket?.registeredUsers || []
  });

  const handleTicketUpdate = async (updatedTicket: TicketData) => {
    setCurrentOperation('ticket');
    await updateExhibition(
      { ticket: updatedTicket },
      {
        onSuccess: () => {
          setTicket(updatedTicket);
          toast({
            title: tCommon('success'),
            description: t('ticket_settings_updated'),
            variant: 'success',
          });
          setCurrentOperation(null);
        },
        onError: () => {
          toast({
            title: tCommon('error'),
            description: t('ticket_settings_update_failed'),
            variant: 'destructive',
          });
          setCurrentOperation(null);
        }
      }
    );
  };

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 space-y-8'>
      <ExhibitionInfoHeader
        description={t('exhibition_publish_description')}
        title={t('exhibition_publish_title')}
      />
      
      <div className="space-y-8">
        {/* Link Name Section */}
        <LinkNameManager
          form={linkNameForm}
          baseUrl={baseUrl}
          isPublished={isPublished}
          onSave={handleLinkNameSave}
          isLoading={isOperationLoading('linkName')}
          originalLinkName={exhibition.linkName || ''}
        />

        {/* Exhibition Dates Section */}
        <ExhibitionDateManager
          form={dateForm}
          exhibition={exhibition}
          onSaveDates={handleSaveDates}
          isLoading={isOperationLoading('dates')}
        />

        {/* Ticket Section */}
        <TicketManager
          ticket={ticket}
          onSave={handleTicketUpdate}
          isLoading={isOperationLoading('ticket')}
        />

        {/* Discoverability Section */}
        <DiscoveryManager
          isDiscoverable={isDiscoverable}
          isPublished={isPublished}
          onToggle={handleDiscoveryToggle}
          isLoading={isOperationLoading('discovery')}
        />

        {/* Publication Status */}
        <ExhibitionPublishStatus
          isPublished={isPublished}
          linkName={linkNameForm.watch('linkName')}
          baseUrl={baseUrl}
          ticket={ticket}
        />

        {/* Action Buttons */}
        <div className="flex justify-end pt-4">
          {/* Unpublish button - only show if already published */}
          {isPublished && (
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={handleUnpublish}
              disabled={isOperationLoading('unpublish')}
              className="gap-2 border-destructive text-destructive hover:bg-destructive/10"
            >
              <EyeOff className="w-5 h-5" />
              {isOperationLoading('unpublish') ? t('unpublishing') : t('unpublish')}
            </Button>
          )}

          {/* Only show publish button if not published */}
          {!isPublished && (
            <div>
              <LoaderButton
                isLoading={isOperationLoading('publish')}
                onClick={handlePublish}
                size="lg"
                disabled={
                  !linkNameForm.watch('linkName') ||
                  !!linkNameForm.formState.errors.linkName ||
                  isOperationLoading('publish')
                }
                className="gap-2"
              >
                <Rocket className="w-5 h-5" />
                {t('publish_exhibition')}
              </LoaderButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}