"use client";
import { cn } from "@/lib/utils";
import { BookText, Earth, Eye, ImageIcon, SlidersHorizontal, TrendingUp } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";


export default function CreatorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();
  const pathname = usePathname();
  const currentTab = pathname.split('/').pop() || 'artworks';

  const tabs = [
    { value: 'artworks', label: 'Artworks', icon: <ImageIcon /> },
    { value: 'content', label: 'Content', icon: <BookText /> },
    { value: 'settings', label: 'Settings', icon: <SlidersHorizontal /> },
    { value: 'result', label: 'Result', icon: <Eye /> },
    { value: 'preview', label: 'Preview', icon: <Earth /> },
    { value: 'publish', label: 'Publish', icon: <TrendingUp /> },


  ];

  return (
    <div className="flex">
      {/* Left Sidebar with Vertical Tabs */}
      <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Exhibition Creator</h1>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => router.push(`/creator/${id}/${tab.value}`)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors hover:bg-muted",
                  currentTab === tab.value
                    ? "border-l-2 border-primary text-primary"
                    : "text-muted-foreground"
                )}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}