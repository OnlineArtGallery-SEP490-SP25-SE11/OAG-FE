"use client";
import useNotification, {
  Notification as NotificationType,
} from "@/hooks/useNotification";
import { formatCreatedAt } from "@/utils/date";
import { Bell, BellIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import InfiniteScroll from "@/components/ui.custom/infinity-scoll";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import HeaderButton from "@/app/(public)/[locale]/_header/components/header-button";
import { useLocale, useTranslations } from "next-intl";
export default function Notification() {
  const t = useTranslations("common");
  const { loading, notification, checkNoti, next, state } = useNotification();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleClick = () => {
    setIsOpen(true);
    checkNoti.handleRemoveNoti(); // remove unread notification
  };
  // if (status === "disconnect") return null
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="w-10" asChild>
        <HeaderButton
          className="relative backdrop-blur-md bg-opacity-40"
          onClick={handleClick}
        >
          <BellIcon className="h-6 w-6 text-black dark:text-gray-200" />
          {checkNoti?.unread !== 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {checkNoti?.unread}
            </span>
          )}
        </HeaderButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel>{t("notification")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ScrollArea className="[&>div>div[style]]:!block w-full h-72">
            {loading && notification.length == 0 && (
              <div>
                {[...Array(4)].map((_, index) => (
                  <NotificationItemSkeleton key={index} />
                ))}
              </div>
            )}
            {Array.isArray(notification) &&
              notification.map((item) => (
                <NotificationItem key={item._id} notification={item} />
              ))}
            <div className="flex justify-center w-full">
              {state && (
                <>
                  <InfiniteScroll
                    hasMore={state.hasMore}
                    isLoading={state.loading}
                    next={next}
                    threshold={1}
                  >
                    {/*{state.hasMore && (*/}
                    {/*  <Loader2 className="my-4 h-8 w-8 animate-spin" />*/}
                    {/*)}*/}
                    <div></div>
                  </InfiniteScroll>
                  <div className="w-full">
                    {state.hasMore && (
                      <div>
                        {[...Array(3)].map((_, index) => (
                          <NotificationItemSkeleton key={index} />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function NotificationItem({
  notification,
}: {
  notification: NotificationType;
}) {
  const locale = useLocale();

  return (
    <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground cursor-default">
      <div className="flex items-start space-x-4 p-2 w-full">
        <div className="flex-shrink-0 mt-1">
          <Bell className="h-5 w-5 text-blue-500" />
        </div>
        <div className="flex-grow min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {notification.title || "No title"}
          </p>
          <p className="text-sm text-gray-500 line-clamp-3">
            {notification.content || "No content"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {formatCreatedAt(notification.createdAt, locale as "vi" | "en")}
          </p>
        </div>
      </div>
    </DropdownMenuItem>
  );
}

export function NotificationItemSkeleton() {
  return (
    <div className="focus:bg-accent focus:text-accent-foreground cursor-default">
      <div className="flex items-start space-x-4 p-2 w-full">
        <div className="flex-shrink-0 mt-1">
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <div className="flex-grow min-w-0">
          <Skeleton className="h-4 w-3/4 mb-1" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  );
}
