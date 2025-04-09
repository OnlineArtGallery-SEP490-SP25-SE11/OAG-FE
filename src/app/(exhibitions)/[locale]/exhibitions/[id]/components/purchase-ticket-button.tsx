'use client';

import { useLocale, useTranslations } from "next-intl";
import { useServerAction } from "zsa-react";
import { purchaseTicketAction } from "../actions";
import { useToast } from "@/hooks/use-toast";
import { Ticket } from "lucide-react";
import { useAuth } from "@/hooks/useAuth-client";
import { AuthDialog } from "@/components/ui.custom/auth-dialog";
import { useState } from "react";
import { formatMoneyByLocale } from "@/utils/converters";
import { LoaderButton } from "@/components/ui.custom/loader-button";

interface PurchaseTicketButtonProps {
  exhibitionId: string;
  price?: number;
  className?: string;
}

export function PurchaseTicketButton({ exhibitionId, price, className }: PurchaseTicketButtonProps) {
  const { user } = useAuth();
  const t = useTranslations('exhibitions');
  const { toast } = useToast();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const locale = useLocale();

  const { execute: purchaseTicket, isPending } = useServerAction(purchaseTicketAction, {
    onSuccess: () => {
      toast({
        title: t('success'),
        description: t('ticket_purchased_success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: t('error'),
        description: error.err.message || t('ticket_purchase_failed'),
        variant: 'destructive',
      });
    },
  });

  const handlePurchase = () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    purchaseTicket({ exhibitionId });
  };

  return (
    <>
      <LoaderButton
        onClick={handlePurchase}
        className={className}
        isLoading={isPending}
      >
        <Ticket className="mr-2 h-4 w-4" />
        {price ? `${t('purchase_ticket')} - ${formatMoneyByLocale(price, locale)}` : t('get_free_ticket')}
      </LoaderButton>

      <AuthDialog
        isOpen={showAuthDialog}
        setIsOpen={setShowAuthDialog}
      />
    </>
  );
}