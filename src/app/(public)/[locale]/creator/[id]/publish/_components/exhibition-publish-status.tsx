import { Eye, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";

interface ExhibitionStatusProps {
  isPublished: boolean;
  linkName: string;
  baseUrl: string;
}

export default function ExhibitionPublishStatus({ 
  isPublished, 
  linkName, 
  baseUrl 
}: ExhibitionStatusProps) {
  const t = useTranslations('exhibitions');
  
  return (
    <Card className="p-6 ">
      <h3 className="text-lg font-semibold mb-4">{t('exhibition_status_title')}</h3>
      <Alert className="bg-yellow-100">
        <Eye className="h-4 w-4" />
        <AlertTitle>
          {t('exhibition_status_title', { status: isPublished ? 'published' : 'unpublished' })}
        </AlertTitle>
        <AlertDescription>
          {isPublished ? (
            <div className="mt-2 space-y-2">
              <p>
                {t('exhibition_live')}
              </p>
              <a
                href={`https://${baseUrl}${linkName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                {baseUrl}{linkName}
                <ExternalLink className="w-4 h-4" />
              </a>
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