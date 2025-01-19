"use client";
import { useServerAction } from "zsa-react";
import { updateBlogAction } from "./action";
import { useRef, useCallback, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { EditorProvider } from "@tiptap/react";
import { MenuBar, extensions } from "@/lib/tiptap";
import debounce from "lodash/debounce";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export const DraftBlogForm = ({
  _id,
  content,
  blogTitle,
  isAdminOrAuthor,
}: {
  _id: string;
  content: string;
  blogTitle: string;
  isAdminOrAuthor: boolean;
}) => {
  const { execute } = useServerAction(updateBlogAction);
  const htmlRef = useRef<string>(content);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [title, setTitle] = useState<string>(blogTitle);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const titleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveContent = useCallback(
    (updatedTitle: string) => {
      setSaveStatus("saving");
      execute({ id: _id, content: htmlRef.current, title: updatedTitle }).then(
        ([, err]) => {
          if (err) {
            setSaveStatus("error");
          } else {
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus("idle"), 1000); // Reset status after 2 seconds
          }
        }
      );
    },
    [execute, _id]
  );

  const debouncedSave = useCallback(
    debounce((updatedTitle: string) => saveContent(updatedTitle), 500),
    [saveContent]
  );

  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setIsUpdatingTitle(true);

    // Clear any existing timeout
    if (titleTimeoutRef.current) {
      clearTimeout(titleTimeoutRef.current);
    }

    // Set a new timeout
    titleTimeoutRef.current = setTimeout(() => {
      setIsUpdatingTitle(false);
      if (isAdminOrAuthor) {
        debouncedSave(newTitle);
      }
    }, 500); // Adjust this delay as needed
  };

  // Clean up the timeout on component unmount
  useEffect(() => {
    return () => {
      if (titleTimeoutRef.current) {
        clearTimeout(titleTimeoutRef.current);
      }
    };
  }, []);

  // Render save status
  const renderSaveStatus = () => {
    // if (isUpdatingTitle) {
    //     return (
    //         <div className="flex items-center text-slate-500">
    //             <Loader2 className="animate-spin mr-2 h-4 w-4" />
    //             <span>Updating title...</span>
    //         </div>
    //     );
    // }

    switch (saveStatus) {
      case "saving":
        return (
          <div className="flex items-center text-slate-500">
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            <span>Saving...</span>
          </div>
        );
      case "saved":
        return (
          <div className="flex items-center text-green-500">
            <CheckCircle className="mr-2 h-4 w-4" />
            <span>Saved</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center text-red-500">
            <AlertCircle className="mr-2 h-4 w-4" />
            <span>Error saving</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center invisible">
            <AlertCircle className="mr-2 h-4 w-4" />
            <span>Placeholder...</span>
          </div>
        );
    }
  };

  return (
    <div className={cn("p-4 pt-0 rounded space-y-4")}>
      {renderSaveStatus()}
      <div className="mb-2">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="p-2 rounded w-full text-2xl font-bold bg-transparent focus:outline-none focus:ring-0 border-none"
        />
      </div>
      <EditorProvider
        onUpdate={({ editor }) => {
          htmlRef.current = editor.getHTML();
          if (isAdminOrAuthor) {
            debouncedSave(title);
          }
        }}
        slotBefore={isAdminOrAuthor ? <MenuBar /> : null}
        extensions={extensions}
        content={content}
        editable={isAdminOrAuthor}
        immediatelyRender={false}
      ></EditorProvider>
    </div>
  );
};
