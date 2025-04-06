'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from './use-toast';
import { io, Socket } from 'socket.io-client';
import useAuthClient from '@/hooks/useAuth-client';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import notificationService, { Notification } from '@/service/notification';

// Type-safe socket creation with better options typing
const createSocket = (url: string, options: {
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  timeout?: number;
  transports?: string[];
  autoConnect: boolean;
}) => io(url, options);

export default function useNotification() {
  const { user } = useAuthClient();
  const userRef = useRef(user);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const [status, setStatus] = useState<'connect' | 'disconnect'>('disconnect');
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const notificationsQueryKey = useMemo(() => ['notifications'], []);
  const unreadCountQueryKey = useMemo(() => ['notifications', 'unread'], []);

  const isEnabled = Boolean(userRef.current?.id);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: queryStatus,
    refetch,
  } = useInfiniteQuery({
    queryKey: notificationsQueryKey,
    queryFn: notificationService.fetchNotifications,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  const { data: unreadCount = 0, refetch: refetchUnreadCount } = useQuery({
    queryKey: unreadCountQueryKey,
    queryFn: notificationService.fetchUnreadCount,
    enabled: isEnabled,
    staleTime: isNotificationPanelOpen ? 0 : 1000 * 60, // Refresh immediately if panel is open, otherwise every minute
    initialData: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Memoize notifications to prevent unnecessary re-renders
  const notifications = useMemo(() => 
    data?.pages.flatMap(page => page?.notifications || []) || [], 
    [data]
  );

  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onMutate: async (id?: string) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await Promise.all([
        queryClient.cancelQueries({ queryKey: notificationsQueryKey }),
        queryClient.cancelQueries({ queryKey: unreadCountQueryKey }),
      ]);

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(notificationsQueryKey);
      
      if (id) {
        // Mark a single notification as read
        queryClient.setQueryData(notificationsQueryKey, (old: any) => {
          if (!old?.pages) return old;
          
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              notifications: page.notifications.map((notification: Notification) =>
                notification._id === id ? { ...notification, isRead: true } : notification
              ),
            })),
          };
        });
        
        // Decrement unread count by 1
        queryClient.setQueryData(unreadCountQueryKey, (old: number = 0) => Math.max(0, old - 1));
      } else {
        // Mark all notifications as read
        queryClient.setQueryData(notificationsQueryKey, (old: any) => {
          if (!old?.pages) return old;
          
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              notifications: page.notifications.map((notification: Notification) => 
                ({ ...notification, isRead: true })
              ),
            })),
          };
        });
        
        // Reset unread count to 0
        queryClient.setQueryData(unreadCountQueryKey, 0);
      }
      
      return { previousData };
    },
    onError: (_, __, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(notificationsQueryKey, context.previousData);
        // Refetch to ensure consistency
        queryClient.invalidateQueries({ queryKey: unreadCountQueryKey });
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data is correct
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
      queryClient.invalidateQueries({ queryKey: unreadCountQueryKey });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: notificationService.deleteNotification,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey });
      const previousData = queryClient.getQueryData(notificationsQueryKey);
      const notificationToDelete = notifications.find(n => n._id === id);
      const wasUnread = notificationToDelete && !notificationToDelete.isRead;

      queryClient.setQueryData(notificationsQueryKey, (old: any) => ({
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          notifications: page.notifications.filter((notification: Notification) => notification._id !== id),
        })),
      }));

      if (wasUnread) {
        queryClient.setQueryData(unreadCountQueryKey, (old: number = 0) => Math.max(0, old - 1));
      }
      return { previousData };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
      queryClient.invalidateQueries({ queryKey: unreadCountQueryKey });
    },
  });

  const handleMarkAllAsRead = useCallback(() => markAsReadMutation.mutate(undefined), [markAsReadMutation]);
  const handleMarkAsRead = useCallback((id: string) => markAsReadMutation.mutate(id), [markAsReadMutation]);
  const handleDeleteNotification = useCallback((id: string) => deleteNotificationMutation.mutate(id), [deleteNotificationMutation]);

  useEffect(() => {
    if (!userRef.current?.id) return;

    // Don't reinitialize socket if it's already connected
    if (socketRef.current?.connected && isInitializedRef.current) return;

    try {
      const socket = createSocket(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        timeout: 10000,
        transports: ['websocket', 'polling'],
        autoConnect: true
      });

      socketRef.current = socket;
      socket.emit('register', userRef.current.id);
      setStatus('connect');
      isInitializedRef.current = true;

      socket.on('connect', () => setStatus('connect'));
      socket.on('disconnect', () => setStatus('disconnect'));
      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setStatus('disconnect');
      });
      
      socket.on('notifications', (newNotification: Notification) => {
        const formattedNotification = {
          ...newNotification,
          createdAt: new Date(newNotification.createdAt),
          updatedAt: new Date(newNotification.updatedAt),
          isRead: false,
        };

        // Optimistically update cache
        queryClient.setQueryData(notificationsQueryKey, (old: any) => {
          if (!old?.pages || !old.pages.length) {
            return {
              pages: [{ notifications: [formattedNotification], total: 1, nextPage: undefined }],
              pageParams: [0],
            };
          }
          const updatedPages = [...old.pages];
          updatedPages[0] = {
            ...updatedPages[0],
            notifications: [formattedNotification, ...(updatedPages[0]?.notifications || [])],
            total: (updatedPages[0]?.total || 0) + 1,
          };
          return { ...old, pages: updatedPages };
        });

        // Update unread count
        queryClient.setQueryData(unreadCountQueryKey, (old: number = 0) => old + 1);

        // Show toast if panel is closed
        if (!isNotificationPanelOpen) {
          toast({
            title: formattedNotification.title || 'New notification',
            description: formattedNotification.content || '',
            variant: 'default',
            duration: 5000
          });
        }
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current.off('connect');
          socketRef.current.off('disconnect');
          socketRef.current.off('connect_error');
          socketRef.current.off('notifications');
          socketRef.current = null;
          isInitializedRef.current = false;
        }
      };
    } catch (error) {
      console.error('Socket initialization error:', error);
      setStatus('disconnect');
      return () => {};
    }
  }, [isNotificationPanelOpen, notificationsQueryKey, queryClient, toast, unreadCountQueryKey]);

  const setNotificationPanelOpen = useCallback((isOpen: boolean) => {
    setIsNotificationPanelOpen(isOpen);
    if (isOpen && unreadCount > 0) {
      setTimeout(() => handleMarkAllAsRead(), 2000);
    }
  }, [handleMarkAllAsRead, unreadCount]);

  return {
    status,
    notifications,
    unreadCount,
    isLoading: queryStatus === 'pending',
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    refreshUnreadCount: refetchUnreadCount,
    handleMarkAllAsRead,
    handleMarkAsRead,
    handleDeleteNotification,
    setNotificationPanelOpen,
  };
}