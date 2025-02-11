import { Image as ImageIcon, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ArtworksList() {
  // Mock data - replace with real data
  const artworks = [
    { id: 1, name: "Artwork 1", thumbnail: "https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg" },
    { id: 2, name: "Artwork 2", thumbnail: "https://res.cloudinary.com/djvlldzih/image/upload/v1739204028/gallery/arts/occjr92oqgbd5gyzljvb.jpg" },
  ];

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <ImageIcon className="w-5 h-5" />
        Your Artworks
      </h3>
      <div className="space-y-2">
        {artworks.map((artwork) => (
          <div
            key={artwork.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg border"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
              <span className="font-medium">{artwork.name}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
} 