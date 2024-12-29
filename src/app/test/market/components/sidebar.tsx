"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  onSearch: (query: string) => void;
  onFilterPrice: (min: number, max: number) => void;
  onFilterArtist: (artists: string[]) => void;
}

export function Sidebar({
  onSearch,
  onFilterPrice,
  onFilterArtist,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handlePriceFilter = () => {
    onFilterPrice(Number(minPrice), Number(maxPrice));
  };

  const handleArtistFilter = (artist: string) => {
    setSelectedArtists((prev) =>
      prev.includes(artist)
        ? prev.filter((a) => a !== artist)
        : [...prev, artist]
    );
    onFilterArtist(selectedArtists);
  };

  return (
    <aside className="w-64 p-8 overflow-auto ">
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      <div className="mb-4">
        <Label htmlFor="search">Search</Label>
        <div className="flex">
          <Input
            id="search"
            type="text"
            placeholder="Search artworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mr-2"
          />
          <Button onClick={handleSearch} size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Price Range</h3>
        <div className="flex gap-2 mb-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <Button onClick={handlePriceFilter} className="w-full">
          Apply
        </Button>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Artists</h3>
        {["Artist 1", "Artist 2", "Artist 3", "Artist 4"].map((artist) => (
          <div key={artist} className="flex items-center mb-2">
            <Checkbox
              id={artist}
              checked={selectedArtists.includes(artist)}
              onCheckedChange={() => handleArtistFilter(artist)}
            />
            <Label htmlFor={artist} className="ml-2">
              {artist}
            </Label>
          </div>
        ))}
      </div>
    </aside>
  );
}
