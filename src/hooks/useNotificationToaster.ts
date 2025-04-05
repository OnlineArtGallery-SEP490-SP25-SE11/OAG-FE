'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Notification } from '@/service/notification';
import useAuthClient from '@/hooks/useAuth-client';
import { useRouter } from 'next/navigation';
import { Socket } from 'socket.io-client';
import { getGlobalSocket } from './useNotification';

// Extend Notification type for toast display
export type NotificationToast = Notification & {
  showDuration: number;
  action?: () => void;
  // Add these for better UI handling
  isNew?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'info';
};

// Type for queryData
interface NotificationQueryData {
  pages: Array<{
    notifications: Notification[];
    total: number;
    nextPage?: number;
  }>;
  pageParams: number[];
}

export default function useNotificationToaster() {
  const { user } = useAuthClient();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<NotificationToast[]>([]);
  const notificationsRef = useRef<NotificationToast[]>([]);
  const lastNotificationIdRef = useRef<string | null>(null);
  const [listenersInitialized, setListenersInitialized] = useState(false);
  
  // Direct socket connection for immediate notifications
  useEffect(() => {
    if (!user?.id) return;
    
    // Use the global socket instead of creating a new one
    const checkAndSetupSocket = () => {
      const socket = getGlobalSocket();
      
      if (!socket) {
        // Socket not yet initialized, check again in a moment
        const intervalId = setTimeout(checkAndSetupSocket, 100);
        return () => clearTimeout(intervalId);
      }
      
      if (listenersInitialized) {
        return; // Don't set up listeners twice
      }
      
      // Listen directly for notifications from the socket
      const handleNewNotification = (newNotification: Notification) => {
        // Skip if we've already seen this notification
        if (lastNotificationIdRef.current === newNotification._id) {
          return;
        }
        
        console.log('Toast received new notification directly:', newNotification);
        
        // Get variant based on notification type
        const variant = getVariantFromType(newNotification.refType);
        
        const formattedNotification: NotificationToast = {
          ...newNotification,
          createdAt: new Date(newNotification.createdAt),
          updatedAt: new Date(newNotification.updatedAt),
          isRead: false,
          showDuration: 10000, // Increased to 10 seconds for better readability
          action: () => handleNotificationClick(newNotification),
          isNew: true,
          variant,
        };
        
        // Add directly to toasts, bypassing the query data checking
        setNotifications(prev => [...prev, formattedNotification]);
        notificationsRef.current = [...notificationsRef.current, formattedNotification];
        lastNotificationIdRef.current = newNotification._id;
      };
      
      socket.on('notifications', handleNewNotification);
      setListenersInitialized(true);
      
      return () => {
        socket.off('notifications', handleNewNotification);
        setListenersInitialized(false);
      };
    };
    
    return checkAndSetupSocket();
  }, [user?.id, listenersInitialized]);

  // Helper function to determine notification variant
  const getVariantFromType = (refType: string): NotificationToast['variant'] => {
    switch (refType) {
      case 'artwork':
        return 'success';
      case 'event':
        return 'info';
      case 'maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Additional safety check for missed notifications (in case the socket misses something)
  useEffect(() => {
    if (!user?.id) return;

    // Check for new notifications that might have been missed by the socket
    const checkForMissedNotifications = () => {
      const queryData = queryClient.getQueryData<NotificationQueryData>(['notifications']);
      if (!queryData?.pages?.[0]?.notifications?.length) return;
      
      const latestNotification = queryData.pages[0].notifications[0];
      
      if (
        latestNotification && 
        latestNotification._id !== lastNotificationIdRef.current &&
        !latestNotification.isRead
      ) {
        // If socket missed this notification, add it to toasts
        console.log('Found missed notification:', latestNotification);
        lastNotificationIdRef.current = latestNotification._id;
        
        const variant = getVariantFromType(latestNotification.refType);
        
        const notificationToast: NotificationToast = {
          ...latestNotification,
          showDuration: 10000,
          action: () => handleNotificationClick(latestNotification),
          isNew: false, // Not new, but missed
          variant,
        };
        
        setNotifications(prev => [...prev, notificationToast]);
        notificationsRef.current = [...notificationsRef.current, notificationToast];
      }
    };
    
    // Fix: Correctly subscribe to query cache using a properly typed callback function
    const unsubscribe = queryClient.getQueryCache().subscribe((event: any) => {
      // Only process events for the notifications query
      if (
        event.type === 'queryUpdated' && 
        Array.isArray(event.query.queryKey) &&
        event.query.queryKey[0] === 'notifications'
      ) {
        checkForMissedNotifications();
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [queryClient, user?.id]);

  // Handle notification click based on type
  const handleNotificationClick = useCallback((notification: Notification) => {
    // Mark as read when clicked
    queryClient.setQueryData<NotificationQueryData>(['notifications'], (old) => {
      if (!old?.pages) return old;
      
      return {
        ...old,
        pages: old.pages.map(page => ({
          ...page,
          notifications: page.notifications.map(n =>
            n._id === notification._id ? { ...n, isRead: true } : n
          ),
        })),
      };
    });

    // Also update the unread count
    queryClient.setQueryData<number>(['notifications', 'unread'], (old = 0) => 
      Math.max(0, old - 1)
    );

    // Navigate based on notification type
    switch (notification.refType) {
      case 'artwork':
        if (notification.refId) {
          router.push(`/artwork/${notification.refId}`);
        }
        break;
      case 'event':
        router.push('/events');
        break;
      case 'maintenance':
        // Just display the notification, no navigation
        break;
      default:
        router.push('/notifications');
        break;
    }
  }, [queryClient, router]);

  // Remove a notification from the toasts
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification._id !== id));
    notificationsRef.current = notificationsRef.current.filter(
      notification => notification._id !== id
    );
  }, []);

  return {
    notifications,
    removeNotification,
    handleNotificationClick,
  };
}
