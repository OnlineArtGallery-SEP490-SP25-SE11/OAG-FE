'use client';

import { useLocale, useTranslations } from "next-intl";
import { Ticket } from "lucide-react";
import { formatMoneyByLocale } from "@/utils/converters";
import { LoaderButton } from "@/components/ui.custom/loader-button";

interface PurchaseTicketButtonProps {
  requiresPayment?: boolean;
  price: number;
  className?: string;
  onPurchaseClick: () => void;
  isLoading?: boolean;
}

export function PurchaseTicketButton({ 
  price = 0,
  className,
  onPurchaseClick,
  isLoading = false
}: PurchaseTicketButtonProps) {
  const t = useTranslations('exhibitions');
  const locale = useLocale();

  return (
    <LoaderButton
      onClick={onPurchaseClick}
      className={className}
      isLoading={isLoading}
    >
      <Ticket className="mr-2 h-4 w-4" />
      { `${t('purchase_ticket')} - ${formatMoneyByLocale(price, locale)}`}
    </LoaderButton>
  );
}