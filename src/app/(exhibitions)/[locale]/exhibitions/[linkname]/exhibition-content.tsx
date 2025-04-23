'use client';
import { useState } from 'react';
import Exhibition from '../components/exhibition';
import { Button } from '@/components/ui/button';
import { ArrowRight, Share2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Exhibition as ExhibitionType } from '@/types/exhibition';
import { PurchaseTicketButton } from './components/purchase-ticket-button';
import { useLocale, useTranslations } from 'next-intl';
import { formatDateByLocale } from '@/utils/converters';
import { useExhibitionAccess } from '@/hooks/use-exhibition-access';
import { getLocalizedContent } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useServerAction } from "zsa-react";
import { purchaseTicketAction } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { AuthDialog } from "@/components/ui.custom/auth-dialog";


export default function ExhibitionContent({ exhibitionData }: { exhibitionData: ExhibitionType }) {
  const [isStarted, setIsStarted] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const locale = useLocale();
  const t = useTranslations('exhibitions');
  const tError = useTranslations('error');
  const tCommon = useTranslations('common');
  const { toast } = useToast();
  const { canAccess, isLoading: accessLoading } = useExhibitionAccess(exhibitionData);
  const localizedContent = getLocalizedContent(exhibitionData, locale);

  // --- Get session data ---
  const { data: session, status: sessionStatus } = useSession();
  const isLoading = accessLoading || sessionStatus === 'loading';
  
  // Purchase ticket action
  const { execute: purchaseTicket, isPending } = useServerAction(purchaseTicketAction, {
    onSuccess: () => {
      toast({
        title: tCommon('success'),
        description: t('ticket_purchased_success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: tError('error'),
        description: t(error.err.message) || t('ticket_purchase_failed'),
        variant: 'destructive',
      });
    },
  });

  const handlePurchase = () => {
    // If not logged in and not loading, show auth dialog
    if (!session?.user && sessionStatus !== 'loading') {
      setShowAuthDialog(true);
      return;
    }
    
    // If logged in, purchase ticket
    if (session?.user) {
      purchaseTicket({ exhibitionId: exhibitionData._id });
    }
  };

  const renderActionButton = () => {
    if (isLoading) {
      return (
        <Button
          disabled
          className="w-full bg-black rounded-3xl text-white hover:bg-gray-800 py-6"
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </Button>
      );
    }

    if (canAccess) {
      return (
        <Button
          onClick={() => setIsStarted(true)}
          className="w-full bg-black rounded-3xl text-white hover:bg-gray-800 py-6"
        >
          {t('enter_exhibition')}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      );
    }

    return (
      <PurchaseTicketButton
        requiresPayment={exhibitionData.ticket?.requiresPayment}
        price={exhibitionData.ticket?.price || 0}
        className="w-full bg-black rounded-3xl text-white hover:bg-gray-800 py-6"
        onPurchaseClick={handlePurchase}
        isLoading={isPending}
      />
    );
  };

  if (!isStarted) {
    return (
      <>
        <div className='relative h-screen w-full'>
          <div className='absolute inset-0'>
            {exhibitionData.backgroundMedia && (
              exhibitionData.backgroundMedia.endsWith('.mp4') ? (
                <video
                  src={exhibitionData.backgroundMedia}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="object-cover w-full h-full"
                />
              ) : (
                <Image
                  src={exhibitionData.backgroundMedia}
                  alt='Gallery Background'
                  fill
                  className='object-cover'
                  priority
                />
              )
            )}
          </div>

          <div className='relative h-full flex items-center justify-center'>
            <div className='max-w-sm w-full mx-4 bg-white p-8 rounded-3xl shadow'>
              <div className='space-y-8'>
                <div className='relative aspect-video w-full rounded-3xl overflow-hidden'>
                  {exhibitionData.welcomeImage && (
                    <Image
                      src={exhibitionData.welcomeImage}
                      alt={localizedContent?.name || t('untitled_exhibition')}
                      fill
                      className='object-cover'
                    />
                  )}
                </div>
                <div className='space-y-6'>
                  <div className='flex justify-between gap-4 text-sm text-gray-600'>
                    <div className='flex items-center gap-1'>
                      <Share2 className='w-4 h-4' />
                    </div>
                    <div className='flex items-center gap-1'>
                      <span>{formatDateByLocale(exhibitionData.startDate, locale)}</span>
                    </div>
                  </div>

                  <div className='h-px bg-gray-200' />

                  <h1 className='text-2xl font-bold text-gray-900'>
                    {localizedContent?.name || t('untitled_exhibition')}
                  </h1>

                  <p className='text-sm text-gray-600'>
                    {localizedContent?.description}
                  </p>

                  {renderActionButton()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <AuthDialog
          isOpen={showAuthDialog}
          setIsOpen={setShowAuthDialog}
        />
      </>
    );
  }

  return (
    <div>
      <Exhibition exhibition={exhibitionData} session={session} />
    </div>
  );
}