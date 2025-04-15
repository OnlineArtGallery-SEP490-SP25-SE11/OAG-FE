// components/BlogCommentDrawer.tsx
"use client";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MessagesSquare, Flag, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReportButton from "@/components/ui.custom/report-button";
import { RefType } from "@/utils/enums";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";

import { useState, useEffect } from "react";
import { createComment, deleteComment, updateComment } from "@/service/comment";
import { getCurrentUser } from "@/lib/session";

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
  };
  replies?: string[];
}

interface BlogCommentDrawerProps {
  blogId: string;
  authorId: string;
  isSignedIn: boolean;
}

export default function BlogCommentDrawer({
  blogId,
  authorId,
  isSignedIn,
}: BlogCommentDrawerProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/blog/${blogId}`
      );
      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();

      if (user) {
        setToken(user.accessToken);
        setUserId(user.id);
        setCurrentUser(user);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentUser) return;
    try {
      const comment = await createComment({
        accessToken: currentUser.accessToken,
        blogId,
        content: newComment,
      });
      setComments((prev) => [comment, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Error creating comment:", err);
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    const comment = comments.find((c) => c._id === commentId);
    if (!comment) return;

    const updated = await updateComment({
      accessToken: currentUser.accessToken,
      commentId,
      content: editContent,
      replies: comment.replies || [],
    });

    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId ? { ...c, content: editContent } : c
      )
    );
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment({
      accessToken: currentUser.accessToken,
      commentId,
    });
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  const handleSubmitReply = async (parentId: string, replyContent: string) => {
    if (!replyContent.trim()) return;
    try {
      console.log("Submitting reply...");
      setLoading(true);

      const user = await getCurrentUser();
      console.log("Current user:", user);

      if (!user) throw new Error("User not authenticated.");

      console.log("Sending request to create comment with parentId...");
      const newReply = await createComment({
        accessToken: user.accessToken,
        blogId: blogId,
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
              Write your thoughts about this blog.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {loading ? (
              <p>Loading comments...</p>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="flex space-x-3 items-start">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author?.avatar || ""} />
                    <AvatarFallback>{comment.author?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">
                          {comment.author?.name}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-end space-x-2 ml-auto">
                        {(comment.author?._id === currentUser?.id ||
                          authorId === currentUser?.id) && (
                          <div className="relative z-10">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {comment.author?._id === currentUser?.id && (
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
                                  onClick={async () => {
                                    const user = await getCurrentUser();
                                    if (user?.accessToken) {
                                      handleDeleteComment(comment._id);
                                    } else {
                                      console.error("User not authenticated.");
                                    }
                                  }}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}

                        {isSignedIn &&
                          comment.author?._id !== currentUser?._id && (
                            <div className="z-0">
                              <ReportButton
                                refId={comment._id}
                                refType={RefType.COMMENT}
                                url={
                                  typeof window !== "undefined"
                                    ? window.location.href
                                    : ""
                                }
                                triggerElement={
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <Flag className="w-3.5 h-3.5" />
                                  </Button>
                                }
                              />
                            </div>
                          )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {comment.content}
                    </p>

                    {editingCommentId === comment._id && (
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
                    )}

                    {replyTo === comment._id && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Input
                          placeholder="Write a reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                        />
                        <Button
                          variant="ghost"
                          onClick={() => {
                            handleSubmitReply(comment._id, replyContent);
                            setReplyContent("");
                            setReplyTo(null);
                          }}
                        >
                          Reply
                        </Button>
                      </div>
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
                      const reply = comments.find((c) => c._id === replyId);

                      if (!reply) return null;

                      return (
                        <div
                          key={reply._id}
                          className="ml-8 mt-2 flex space-x-3 items-start"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={reply.author?.avatar || ""} />
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
                                {new Date(reply.createdAt).toLocaleDateString()}
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
  );
}
