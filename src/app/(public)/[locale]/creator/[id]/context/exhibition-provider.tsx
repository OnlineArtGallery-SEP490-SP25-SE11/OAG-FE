'use client';

import { createContext, useContext, useState } from 'react';
import { Exhibition } from '@/types/exhibition';
import { useRouter } from 'next/navigation';
import { useServerAction } from 'zsa-react';
import { updateExhibitionAction } from '../../actions';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';

interface ExhibitionContextType {
  exhibition: Exhibition;
  isUpdating: boolean;
  updateExhibition: (data: Partial<Exhibition>) => Promise<void>;
  refreshExhibition: () => void;
}

const ExhibitionContext = createContext<ExhibitionContextType | null>(null);

export default function ExhibitionContextProvider({
  initialData,
  children
}: {
  initialData: Exhibition;
  children: React.ReactNode;
}) {
  const [exhibition, setExhibition] = useState<Exhibition>(initialData);
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('exhibitions');
  const tCommon = useTranslations('common');
  
  const { execute, isPending } = useServerAction(updateExhibitionAction, {
    onSuccess: (result) => {
      setExhibition(result.data.exhibition);
      toast({
        title: tCommon('success'),
        description: t('exhibition_updated_success'),
        variant: 'success'
      });
    },
    onError: (error) => {
      toast({
        title: tCommon('error'),
        description: t('exhibition_update_failed'),
        variant: 'destructive'
      });
      console.error('Error updating exhibition:', error);
    }
  });
  
  const updateExhibition = async (data: Partial<Exhibition>) => {
    console.log('Updating exhibition with data:', data);
    // await execute({ id: exhibition._id, data });
  };
  
  const refreshExhibition = () => {
    router.refresh();
  };
  
  return (
    <ExhibitionContext.Provider
      value={{
        exhibition,
        isUpdating: isPending,
        updateExhibition,
        refreshExhibition
      }}
    >
      {children}
    </ExhibitionContext.Provider>
  );
}

// Custom hook để sử dụng context
export function useExhibition() {
  const context = useContext(ExhibitionContext);
  if (!context) {
    throw new Error('useExhibition must be used within an ExhibitionContextProvider');
  }
  return context;
}