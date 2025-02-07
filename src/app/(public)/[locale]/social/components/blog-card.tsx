"use client";
import { BookmarkPlusIcon, Heart, MessagesSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { createExcerpt, sanitizeBlogContent } from "@/app/utils";
import { ToggleBookmarkButton } from "@/components/ui.custom/toggle-bookmark-button";
import { ToggleHeartButton } from "@/components/ui.custom/toggle-heart-button";
import { useParams } from "next/navigation";
import { ReportButton } from "@/components/ui.custom/report-button";
interface BlogCardProps {
  title: string;
  coverImage: string;
  content: string;
  author: {
    name: string;
    image: string;
  };
  publishedAt: Date;
  readTime: number;
  slug: string;
  isBookmarked: boolean;
  isSignedIn: boolean;
  heartCount: number;
  isHearted: boolean;
}

export function BlogCard({ title, coverImage, content, author, publishedAt, readTime, slug, isBookmarked, isSignedIn, isHearted, heartCount }: BlogCardProps) {
  const params = useParams();
  const locale = params.locale;
  
  const sanitizedContent = sanitizeBlogContent(content);
  const excerpt = createExcerpt(sanitizedContent);

  return (
    <div className="w-full max-w-[700px] rounded-xl overflow-hidden border bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl flex flex-col">
      <div className="px-4 py-2">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-3">
            <AvatarImage src={author.image} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{author.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(publishedAt, { addSuffix: true })} · {readTime} min read
            </p>
          </div>
        </div>
      </div>
      <Link href={`/${locale}/blogs/${slug}`}>
        <div className="flex justify-between px-4">
          <div className="w-2/3  py-2">
            <h2 className="font-bold text-lg mb-1 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
              {title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{excerpt}</p>
          </div>
          <div className="w-1/4 relative h-28">
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Add sizes attribute
              className="transition-all duration-300 hover:opacity-80 rounded-r"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="cursor-not-allowed">
            <MessagesSquare className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" />
          </Button>
          {isSignedIn ? (
            <ToggleHeartButton blogId={slug} initialHearted={isHearted} initialHeartCount={heartCount} />
          ) : (
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                <Heart className="text-gray-600 dark:text-gray-300" />
                <span className="ml-1">{heartCount}</span>
              </Button>
            </Link>
          )}
        </div>
        {/* <Bookmark className="text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400" /> */}
        {
          isSignedIn ? (
            <ToggleBookmarkButton blogId={slug} initialBookmarked={isBookmarked} />
          ) : (
            <Link href="/sign-in" >
              <Button variant="ghost" size="sm" className="hover:text-gray-600 dark:hover:text-gray-300">
                <BookmarkPlusIcon className="text-gray-600 dark:text-gray-300" />
              </Button>
            </Link>
          )
        }
      </div>
      <ReportButton/>
    </div>
  );
}