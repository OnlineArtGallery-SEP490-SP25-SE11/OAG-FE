'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

// Create a global socket reference to ensure only one socket connection exists
// This will be shared between useNotification and useNotificationToaster
let globalSocketRef: Socket | null = null;
let socketInitializationInProgress = false;
let registeredUsers = new Set<string>();

export function getGlobalSocket(): Socket | null {
  return globalSocketRef;
}

export default function useNotification() {
  const { user } = useAuthClient();
  const userRef = useRef(user);
  const queryClient = useQueryClient();
  const isInitializedRef = useRef(false);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const [status, setStatus] = useState<'connect' | 'disconnect'>('disconnect');
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const notificationsQueryKey = useMemo(() => ['notifications'], []);
  const unreadCountQueryKey = useMemo(() => ['notifications', 'unread'], []);

  const isEnabled = Boolean(userRef.current?.id);
  // Track first mount to fetch unread count only once
  const hasInitializedUnreadCount = useRef(false);

  // Track whether the component is mounted
  const isMounted = useRef(false);
  const fetchedOnMount = useRef(false);

  // Force a one-time fetch of unread count on component mount
  useEffect(() => {
    if (isEnabled && !fetchedOnMount.current) {
      fetchedOnMount.current = true;
      // Directly fetch unread count and update cache
      notificationService.fetchUnreadCount().then(count => {
        queryClient.setQueryData(unreadCountQueryKey, count);
      }).catch(error => {
        console.error('Failed to fetch unread count:', error);
      });
    }
  }, [isEnabled, queryClient, unreadCountQueryKey]);

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

  // Modified query to use cached data from our manual fetch
  const { data: unreadCount = 0 } = useQuery({
    queryKey: unreadCountQueryKey,
    queryFn: notificationService.fetchUnreadCount,
    enabled: false, // Disable automatic fetching completely
    staleTime: Infinity,
    initialData: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
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

  // Initialize socket on login, not dependent on panel opening
  useEffect(() => {
    // Early return if no user
    if (!userRef.current?.id) {
      return;
    }

    // Don't reinitialize if already connected
    if (globalSocketRef?.connected && isInitializedRef.current && registeredUsers.has(userRef.current.id)) {
      setStatus('connect');
      return;
    }

    // Wait if another initialization is in progress
    if (socketInitializationInProgress) {
      const checkInterval = setInterval(() => {
        if (!socketInitializationInProgress && globalSocketRef?.connected) {
          clearInterval(checkInterval);
          if (!registeredUsers.has(userRef.current?.id || '')) {
            globalSocketRef.emit('register', userRef.current?.id);
            registeredUsers.add(userRef.current?.id || '');
          }
          setStatus('connect');
          isInitializedRef.current = true;
        }
      }, 100);
      
      return () => clearInterval(checkInterval);
    }

    // Initialize new socket
    try {
      socketInitializationInProgress = true;
      
      const socket = createSocket(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000, // Faster reconnection
        timeout: 10000,
        transports: ['websocket', 'polling'],
        autoConnect: true
      });

      globalSocketRef = socket;
      
      // Register user with socket
      socket.emit('register', userRef.current.id);
      registeredUsers.add(userRef.current.id);
      
      setStatus('connect');
      isInitializedRef.current = true;

      socket.on('connect', () => {
        setStatus('connect');
        // Re-register on reconnect
        if (userRef.current?.id) {
          socket.emit('register', userRef.current.id);
        }
      });
      
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
        console.log('New notification received in useNotification:', formattedNotification);

        // Update notification data
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

        // Update unread count immediately
        queryClient.setQueryData(unreadCountQueryKey, (old: number = 0) => old + 1);
      });

      socketInitializationInProgress = false;

      return () => {
        // Don't disconnect the socket, just clean up event listeners
        // This allows other components to continue using the socket
        if (globalSocketRef) {
          socket.off('connect');
          socket.off('disconnect');
          socket.off('connect_error');
          socket.off('notifications');
          
          // Only remove this user from registered users
          if (userRef.current?.id) {
            registeredUsers.delete(userRef.current.id);
          }
          
          // Only disconnect if no more users are registered
          if (registeredUsers.size === 0) {
            globalSocketRef.disconnect();
            globalSocketRef = null;
          }
          
          isInitializedRef.current = false;
        }
      };
    } catch (error) {
      console.error('Socket initialization error:', error);
      setStatus('disconnect');
      socketInitializationInProgress = false;
      return () => {};
    }
  }, [queryClient, notificationsQueryKey, unreadCountQueryKey, user?.id]);

  const setNotificationPanelOpen = useCallback((isOpen: boolean) => {
    setIsNotificationPanelOpen(isOpen);
    // Temporarily disabled auto mark-all-as-read
    // if (isOpen && unreadCount > 0) {
    //   setTimeout(() => handleMarkAllAsRead(), 2000);
    // }
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
    handleMarkAllAsRead,
    handleMarkAsRead,
    handleDeleteNotification,
    setNotificationPanelOpen,
  };
}