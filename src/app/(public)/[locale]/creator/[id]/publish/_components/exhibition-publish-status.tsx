import { ClipboardCopy, Eye, ExternalLink, Ticket } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { vietnamCurrency } from '@/utils/converters';

interface ExhibitionStatusProps {
  isPublished: boolean;
  linkName: string;
  baseUrl: string;
  ticket?: {
    requiresPayment: boolean;
    price: number;
    registeredUsers?: string[];
  };
}

export default function ExhibitionPublishStatus({ 
  isPublished, 
  linkName, 
  baseUrl,
  ticket
}: ExhibitionStatusProps) {
  const t = useTranslations('exhibitions');
  const { toast } = useToast();
  
  const hasTicket = ticket !== undefined;
  const isPaid = hasTicket && ticket.requiresPayment;
  const registeredCount = ticket?.registeredUsers?.length || 0;
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t('exhibition_status_title')}</h3>
      
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-3 h-3 rounded-full",
            isPublished ? "bg-green-500" : "bg-amber-500"
          )} />
          <span className="font-medium">
            {isPublished ? t('published') : t('draft')}
          </span>
        </div>
        
        {hasTicket && (
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-muted-foreground" />
            <Badge variant={isPaid ? "default" : "outline"}>
              {isPaid ? (
                <span className="flex items-center gap-1">
                   {vietnamCurrency(ticket.price)}
                </span>
              ) : (
                t('ticket_free')
              )}
            </Badge>
            
            {registeredCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {t('registered_count', { count: registeredCount })}
              </Badge>
            )}
          </div>
        )}
      </div>
      
      <Alert className="bg-yellow-100">
        <Eye className="h-4 w-4" />
        <AlertTitle>
          {isPublished ? t('exhibition_status_published') : t('exhibition_status_draft')}
        </AlertTitle>
        <AlertDescription>
          {isPublished ? (
            <div className="mt-2 space-y-2">
              <p>
                {t('exhibition_live')}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-mono break-all">
                  {baseUrl}{linkName}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`${baseUrl}${linkName}`);
                    toast({
                      description: t('link_copied'),
                    });
                  }}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
                <a
                  href={`https://${baseUrl}${linkName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : (
            <p className="mt-2">
              {t('exhibition_not_published')}
            </p>
          )}
        </AlertDescription>
      </Alert>
    </Card>
  );
}