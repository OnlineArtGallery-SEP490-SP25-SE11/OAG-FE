"use client";

import { useState } from "react";
import { Rocket, ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Badge } from "@/components/ui/badge";

export default function PublishPage() {
  const [linkName, setLinkName] = useState("");
  const [isDiscoverable, setIsDiscoverable] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  const baseUrl = "oag-vault.vercel.app/exhibition/";

  const handleLinkNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    setLinkName(value);
    
    // Basic validation
    if (value.length < 3) {
      setLinkError("Link name must be at least 3 characters long");
    } else if (value.length > 30) {
      setLinkError("Link name must be less than 30 characters");
    } else {
      setLinkError(null);
    }
  };

  const handlePublish = () => {
    if (!linkName || linkError) return;
    // Add your publish logic here
    setIsPublished(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Rocket className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Publish Exhibition</h1>
      </div>

      <div className="prose max-w-none mb-8">
        <p className="text-gray-600">
          Publish your exhibition, create a unique link name, and select if your exhibition 
          is visible on the Virtual Art Gallery Discover page.
        </p>
      </div>

      {/* Link Name Section */}
      <div className="space-y-4 bg-white rounded-lg border p-6">
        <Label htmlFor="linkName" className="text-lg font-semibold">
          Link Name
        </Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 whitespace-nowrap">{baseUrl}</span>
            <Input
              id="linkName"
              value={linkName}
              onChange={handleLinkNameChange}
              placeholder="your-exhibition-name"
              className={linkError ? "border-red-500" : ""}
            />
          </div>
          {linkError && (
            <p className="text-sm text-red-500">{linkError}</p>
          )}
          <p className="text-sm text-gray-500">
            Choose a unique name for your exhibition URL. Use only lowercase letters, 
            numbers, and hyphens.
          </p>
        </div>
      </div>

      {/* Discovery Section */}
      <div className="space-y-4 bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <Label className="text-lg font-semibold">Discovery</Label>
            <p className="text-sm text-gray-500">
              Make your exhibition visible on the Discover page
            </p>
          </div>
          <Switch
            checked={isDiscoverable}
            onCheckedChange={setIsDiscoverable}
          />
        </div>
      </div>

      {/* Exhibition Status */}
      <div className="space-y-4 bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold">Exhibition Status</h3>
        <Alert className="bg-yellow-100">
          <Eye className="h-4 w-4" />
          <AlertTitle>
            Exhibition is currently {isPublished ? 'published' : 'unpublished'}
          </AlertTitle>
          <AlertDescription >
            {isPublished ? (
              <div className="mt-2 space-y-2">
                <Badge className="bg-green-100 text-green-800">Published</Badge>
                <p>Your exhibition is live and can be visited at:</p>
                <a 
                  href={`https://${baseUrl}${linkName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  {baseUrl}{linkName}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <p className="mt-2">
                Your exhibition is not yet published. Click the publish button below when you&apos;re ready.
              </p>
            )}
          </AlertDescription>
        </Alert>
      </div>

      {/* Publish Button */}
      <div className="flex justify-end pt-4">
        <Button 
          size="lg"
          onClick={handlePublish}
          disabled={!linkName || !!linkError}
          className="gap-2"
        >
          <Rocket className="w-5 h-5" />
          {isPublished ? 'Update Exhibition' : 'Publish Exhibition'}
        </Button>
      </div>
    </div>
  );
}