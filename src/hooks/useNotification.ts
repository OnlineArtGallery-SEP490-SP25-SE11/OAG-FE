"use client";
import { useEffect, useCallback, useState } from "react";
// import { makeApiRequest } from "@/lib/api-request";
import { useToast } from "./use-toast";
import { io } from "socket.io-client";
import { createAxiosInstance } from "@/lib/axios";
import useAuthClient from "@/hooks/useAuth-client";
export interface Notification {
  _id: string;
  title: string;
  content?: string;
  isRead: boolean;
  createdAt: Date;
}

export default function useNotification() {
  const { user } = useAuthClient();
  const [status, setStatus] = useState<"connect" | "disconnect">("disconnect");
  const [notification, setNotification] = useState<Notification[]>([]);
  const [unread, setUnread] = useState<number>(0);

  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const state = {
    hasMore,
    loading,
    page,
  };

  const checkNoti = {
    unread,
    handleRemoveNoti: () => {
      setUnread(0);
    },
  };

  const { toast } = useToast();
  const next = useCallback(async () => {
    setLoading(true);
    setTimeout(async () => {
      setUnread(0);
      const axiosInstance = await createAxiosInstance({
        useToken: true,
        onError: (error) => {
          console.error(error);
        },
      });
      if (!axiosInstance) return; // k có axios instance (token) thì return null
      const res = await axiosInstance.get(
        `/notification?take=4&skip=${4 * page}`
      );
      const data = res.data.notifications;
      if (Array.isArray(data)) {
        const filteredData = data.filter(
          (newNoti: Notification) =>
            !notification.find((oldNoti) => oldNoti._id === newNoti._id)
        );
        setNotification((prev) => [...prev, ...filteredData]);
        if (data.length < 4) {
          setHasMore(false);
        }
      } else {
        console.error("Expected an array but got:", data);
      }
      setPage((prev) => prev + 1);
      setLoading(false);
    }, 1000);
  }, [page, notification]);

  //init socket
  useEffect(() => {
    if (!user) return;
    const userId = user.id;
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);
    // socketRef.current = socket;
    socket.on("connect", () => {
      socket.emit("register", userId);
      setStatus("connect");
      socket.on("notifications", (data: Notification) => {
        console.log("Notification received:", data);
        setNotification((prev) => [data, ...prev]);
        setUnread((prev) => prev + 1);
        console.log("Notification:", notification);
        // toast(data.title);
        toast({
          title: data.title,
          description: data.content,
          variant: "default",
        });
      });
    });
    socket.on("disconnect", () => {
      setStatus("disconnect");
    });
    return () => {
      socket.disconnect();
      setStatus("disconnect");
    };
  }, [notification, toast, user]);
  return {
    status,
    notification,
    loading,
    checkNoti,
    next,
    state,
  };
}
