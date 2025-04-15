import { Exhibition } from "@/types/exhibition";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ExhibitionAccess {
  isOwner: boolean;
  hasTicket: boolean;
  canAccess: boolean;
  isLoading: boolean;
}

export function useExhibitionAccess(exhibition: Exhibition): ExhibitionAccess {
  const { data: session, status } = useSession();
  
  const [accessState, setAccessState] = useState<ExhibitionAccess>({
    isOwner: false,
    hasTicket: false,
    canAccess: false,
    isLoading: true
  });

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' || !session?.user) {
      setAccessState({
        isOwner: false,
        hasTicket: false,
        canAccess: false,
        isLoading: false
      });
      return;
    }

    const isOwner = exhibition.author._id === session.user.id;
    const hasTicket = exhibition.ticket?.registeredUsers?.includes(session.user.id) || false;
    const canAccess = isOwner || hasTicket;

    setAccessState({
      isOwner,
      hasTicket,
      canAccess,
      isLoading: false
    });
  }, [session, status, exhibition.author._id, exhibition.ticket?.registeredUsers]);

  return accessState;
}