"use client";
//new pull
import {
  BookmarkPlusIcon,
  Heart,
  MessagesSquare,
  MoreHorizontal,
} from "lucide-react";
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { createComment, deleteComment, updateComment } from "@/service/comment";
import { getCurrentUser } from "@/lib/session";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

interface BlogCardProps {
  id: string;
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

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    avatar: string;
  };
  replies?: string[];
}

export function BlogCard({
  id,
  title,
  coverImage,
  content,
  author,
  publishedAt,
  readTime,
  slug,
  isBookmarked,
  isSignedIn,
  isHearted,
  heartCount,
}: BlogCardProps) {
  const params = useParams();
  const locale = params.locale;

  const sanitizedContent = sanitizeBlogContent(content);
  const excerpt = createExcerpt(sanitizedContent);

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [replyTo, setReplyTo] = useState("");
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  //get commet byBlogID
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/blog/${id}`
      );
      console.log("CMT", response);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  //Add new comment
  const handleSubmitComment = async () => {
    const user = await getCurrentUser();
    if (!newComment.trim() || !user) return;
    try {
      const newCommentData = await createComment({
        accessToken: user.accessToken,
        blogId: id,
        content: newComment,
      });
      if (newCommentData) {
        setComments((prev) => [newCommentData, ...prev]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    try {
      const user = await getCurrentUser();
      if (!user?.accessToken || !editContent.trim()) return;

      const commentToUpdate = comments.find(
        (comment) => comment._id === commentId
      );
      if (!commentToUpdate) return;

      const updatedComment = await updateComment({
        accessToken: user.accessToken,
        commentId,
        content: editContent,
        replies: commentToUpdate.replies || [], // Giữ lại các replies cũ
      });

      if (updatedComment) {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId
              ? { ...comment, content: editContent } // Chỉ cập nhật content, giữ nguyên replies
              : comment
          )
        );
        setEditingCommentId(null);
        setEditContent("");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  //DELETE comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      const user = await getCurrentUser();
      if (!user?.accessToken) {
        console.error("User not authenticated.");
        return;
      }
      const isDeleted = await deleteComment({
        accessToken: user.accessToken,
        commentId,
      });
      if (!isDeleted) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId)
        );
        console.log("Comment deleted successfully!");
      } else {
        console.error("Failed to delete comment.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleSubmitReply = async (parentId: string, replyContent: string) => {
    try {
      console.log("Submitting reply...");
      setLoading(true);

      const user = await getCurrentUser();
      console.log("Current user:", user);

      if (!user) throw new Error("User not authenticated.");

      console.log("Sending request to create comment with parentId...");
      const newReply = await createComment({
        accessToken: user.accessToken,
        blogId: id,
        content: replyContent,
        parentId: parentId, // Gửi parentId để lưu vào comment con
      });

      console.log("New reply created:", newReply);

      if (newReply) {
        console.log("Updating state with newReply...");
        setComments((prevComments) => [...prevComments, newReply]);

        setReplyContent(""); // Clear input
        console.log("Reply content cleared.");
      }
    } catch (error) {
      console.error("Failed to add reply:", error);
    } finally {
      setLoading(false);
      console.log("Loading state set to false.");
    }
  };

  return (
    <div className="w-full max-w-[700px] rounded-xl overflow-hidden border bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl flex flex-col">
      <div className="px-4 py-2">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-3">
            <AvatarImage src={author.image} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {author.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(publishedAt, {
                addSuffix: true,
              })}{" "}
              · {readTime} min read
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
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
              {excerpt}
            </p>
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
          <Drawer onOpenChange={(open) => open && fetchComments()}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="sm">
                <MessagesSquare className="w-4 h-4 mr-2" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="w-[400px] h-screen">
              <div className="w-full h-full flex flex-col">
                <DrawerHeader>
                  <DrawerTitle>Comments</DrawerTitle>
                  <DrawerDescription>
                    View, add, and edit comments for this blog
                  </DrawerDescription>
                </DrawerHeader>

                <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                  {loading ? (
                    <p>Loading comments...</p>
                  ) : comments.length > 0 ? (
                    comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="flex space-x-3 items-start"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author?.avatar || ""} />
                          <AvatarFallback>
                            {comment.author?.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium">
                                {comment.author?.name}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {new Date(
                                  comment.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {comment.author?.name === currentUser?.name ||
                            author.name === currentUser?.name ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {comment.author?.name ===
                                    currentUser?.name && (
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setEditingCommentId(comment._id);
                                        setEditContent(comment.content);
                                      }}
                                    >
                                      Edit
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteComment(comment._id)
                                    }
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : null}
                          </div>
                          {editingCommentId === comment._id ? (
                            <div className="flex items-center space-x-2 mt-2">
                              <Input
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                              />
                              <Button
                                variant="ghost"
                                onClick={() => handleUpdateComment(comment._id)}
                              >
                                Save
                              </Button>
                            </div>
                          ) : replyTo === comment._id ? (
                            <div className="flex items-center space-x-2 mt-2">
                              <Input
                                placeholder="Write a reply..."
                                value={replyContent}
                                onChange={(e) =>
                                  setReplyContent(e.target.value)
                                }
                              />
                              <Button
                                variant="ghost"
                                onClick={() =>
                                  handleSubmitReply(comment._id, replyContent)
                                }
                              >
                                Reply
                              </Button>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">
                              {comment.content}
                            </p>
                          )}
                          <Button
                            variant="link"
                            size="sm"
                            className="text-blue-600 hover:underline mt-2"
                            onClick={() => setReplyTo(comment._id)}
                          >
                            Reply
                          </Button>
                          {comment.replies?.map((replyId) => {
                            const reply = comments.find(
                              (c) => c._id === replyId
                            ); // Tìm comment theo _id

                            if (!reply) return null;

                            return (
                              <div
                                key={reply._id}
                                className="ml-8 mt-2 flex space-x-3 items-start"
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={reply.author?.avatar || ""}
                                  />
                                  <AvatarFallback>
                                    {reply.author?.name?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="d-flex">
                                    <p className="text-sm font-medium">
                                      {reply.author?.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(
                                        reply.createdAt
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No comments yet.</p>
                  )}
                </div>

                <DrawerFooter className="border-t mt-auto">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button onClick={handleSubmitComment}>Post</Button>
                  </div>
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>

          {isSignedIn ? (
            <ToggleHeartButton
              blogId={slug}
              initialHearted={isHearted}
              initialHeartCount={heartCount}
            />
          ) : (
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                <Heart className="text-gray-600 dark:text-gray-300" />
                <span className="ml-1">{heartCount}</span>
              </Button>
            </Link>
          )}
        </div>
        {isSignedIn ? (
          <ToggleBookmarkButton
            blogId={slug}
            initialBookmarked={isBookmarked}
          />
        ) : (
          <Link href="/sign-in">
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-gray-600 dark:hover:text-gray-300"
            >
              <BookmarkPlusIcon className="text-gray-600 dark:text-gray-300" />
            </Button>
          </Link>
        )}
      </div>

      <ReportButton />
    </div>
  );
}
