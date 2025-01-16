// components/ui/tooltip.tsx

import { Heart, MessageCircle, Bookmark, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from "next/link";
import { ToggleHeartButton } from "@/components/ui.custom/toggle-heart-button";
import { HeartCountDisplay } from "@/components/ui.custom/heart-count-display";
import { ToggleBookmarkButton } from "@/components/ui.custom/toggle-bookmark-button";
import { TooltipCustom } from '@/components/ui.custom/tooltip-custom';


// BottomBar.tsx
export function BottomBar({ isBookmarked, userId, isHearted, heartCount, blogId }: { isBookmarked: boolean, userId?: string, isHearted: boolean, heartCount: number, blogId: string }) {
  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto px-4 w-max border bg-white dark:bg-gray-800 shadow-lg rounded-full flex justify-around items-center space-x-4 z-50">
        <div className="flex items-center">
          {
            userId ? (
              <ToggleHeartButton blogId={blogId} initialHearted={isHearted} />
            ) : (

              <Link href="/sign-in">
                {renderIconButton("Like the Article", <Heart className="w-5 h-5" />)}
              </Link>
            )

          }
          {
            heartCount > 0 && (
              <HeartCountDisplay blogId={blogId} initialHeartCount={heartCount} />
            )
          }
          <Separator />
          {renderIconButton("Write a Comment", <MessageCircle className="w-5 h-5" />)}
          <Separator />
          {userId ? (
            <ToggleBookmarkButton blogId={blogId} initialBookmarked={isBookmarked} />
          ) : (
            <Link href="/sign-in">
              {renderIconButton("Bookmark the Article", <Bookmark className="w-5 h-5" />)}
            </Link>
          )}
          <Separator />
          {renderIconButton("More Options", <MoreVertical className="w-5 h-5" />)}
        </div>
    </div>
  );
}

function renderIconButton(tooltipText: string, icon: React.ReactNode) {
  return (
    <TooltipCustom tooltipText={tooltipText}>
      <Button variant="ghost" className="text-gray-600 dark:text-gray-300 p-2 rounded-full">
        {icon}
      </Button>
    </TooltipCustom>
  );
}

function Separator() {
  return <div className="w-px h-6 mx-2 bg-gray-300 dark:bg-gray-700" />;
}

{/* <Popover>
    <PopoverTrigger asChild>
        <Button variant="ghost" className="text-gray-600 dark:text-gray-300 p-2">
            <MoreVertical className="w-5 h-5" />
        </Button>
    </PopoverTrigger>
    <PopoverContent side="top" className="text-sm w-32 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 shadow-lg">
        <div className="flex flex-col">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700">Follow</button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700">Report</button>
        </div>
    </PopoverContent>
</Popover> */}