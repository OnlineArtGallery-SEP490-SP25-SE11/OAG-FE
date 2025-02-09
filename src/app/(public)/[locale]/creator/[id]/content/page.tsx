"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus, Music, Upload, X } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "next-intl";

// Mock data - replace with actual API call to get configured languages
const getConfiguredLanguages = () => [
  { code: "en", name: "English", isDefault: true },
  { code: "vi", name: "Vietnamese", isDefault: false }
];

interface ExhibitionContent {
  name: string;
  description: string;
}

export default function ContentPage() {
  const currentLocale = useLocale();
  const configuredLanguages = getConfiguredLanguages();
  
  // Store content for each language
  const [contentByLanguage, setContentByLanguage] = useState<Record<string, ExhibitionContent>>(() => {
    const initial: Record<string, ExhibitionContent> = {};
    configuredLanguages.forEach(lang => {
      initial[lang.code] = { name: "", description: "" };
    });
    return initial;
  });

  const [welcomeImage, setWelcomeImage] = useState<string | null>(null);
  const [backgroundMedia, setBackgroundMedia] = useState<string | null>(null);
  const [backgroundAudio, setBackgroundAudio] = useState<string | null>(null);

  const handleContentChange = (lang: string, field: keyof ExhibitionContent, value: string) => {
    setContentByLanguage(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }));
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = (setter: (value: null) => void) => {
    setter(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="prose max-w-none mb-8">
        <h2 className="text-2xl font-bold mb-4">Exhibition Content</h2>
        <p className="text-gray-600">
          Add a name, description and preview image for your exhibition. This content will show, for example, 
          on social media shares and is necessary for publishing on the Virtual Art Gallery Discover page.
        </p>
      </div>

      {/* Exhibition Details with Language Tabs */}
      <Card className="p-6">
        <Tabs defaultValue={currentLocale} className="w-full">
          <TabsList className="mb-4">
            {configuredLanguages.map(lang => (
              <TabsTrigger key={lang.code} value={lang.code} className="flex items-center gap-2">
                {lang.name}
                {lang.isDefault && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {configuredLanguages.map(lang => (
            <TabsContent key={lang.code} value={lang.code} className="space-y-4">
              <div>
                <Label htmlFor={`name-${lang.code}`}>Exhibition Name ({lang.name})</Label>
                <div className="mt-1">
                  <Input
                    id={`name-${lang.code}`}
                    value={contentByLanguage[lang.code].name}
                    onChange={(e) => handleContentChange(lang.code, 'name', e.target.value)}
                    maxLength={80}
                    placeholder={`Enter exhibition name in ${lang.name}`}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {contentByLanguage[lang.code].name.length} / 80
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor={`description-${lang.code}`}>Short Description ({lang.name})</Label>
                <div className="mt-1">
                  <Textarea
                    id={`description-${lang.code}`}
                    value={contentByLanguage[lang.code].description}
                    onChange={(e) => handleContentChange(lang.code, 'description', e.target.value)}
                    rows={4}
                    placeholder={`Enter a short description in ${lang.name}`}
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      <div className="space-y-6">
        {/* Welcome Image */}
        <Card className="p-6">
          <Label className="text-lg font-semibold mb-4 block">Welcome Image</Label>
          <div className="mt-2">
            {welcomeImage ? (
              <div className="relative">
                <Image
                  src={welcomeImage}
                  alt="Welcome"
                  width={400}
                  height={225}
                  className="rounded-lg object-cover"
                />
                <button
                  onClick={() => removeMedia(() => setWelcomeImage(null))}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImagePlus className="w-12 h-12 mb-3 text-gray-400" />
                  <p className="text-sm text-gray-500">Click to upload welcome image</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setWelcomeImage)}
                />
              </label>
            )}
          </div>
        </Card>

        {/* Background Media */}
        <Card className="p-6">
          <Label className="text-lg font-semibold mb-4 block">Background Image or Video</Label>
          <div className="mt-2">
            {backgroundMedia ? (
              <div className="relative">
                <Image
                  src={backgroundMedia}
                  alt="Background"
                  width={400}
                  height={225}
                  className="rounded-lg object-cover"
                />
                <button
                  onClick={() => removeMedia(() => setBackgroundMedia(null))}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 mb-3 text-gray-400" />
                  <p className="text-sm text-gray-500">Click to upload background media</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={(e) => handleImageUpload(e, setBackgroundMedia)}
                />
              </label>
            )}
          </div>
        </Card>

        {/* Background Audio */}
        <Card className="p-6">
          <Label className="text-lg font-semibold mb-4 block">Background Audio</Label>
          <div className="mt-2">
            {backgroundAudio ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Music className="w-6 h-6 mr-2 text-gray-500" />
                  <span>Audio file uploaded</span>
                </div>
                <button
                  onClick={() => removeMedia(() => setBackgroundAudio(null))}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Music className="w-12 h-12 mb-3 text-gray-400" />
                  <p className="text-sm text-gray-500">Click to upload background audio</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="audio/*"
                  onChange={(e) => handleImageUpload(e, setBackgroundAudio)}
                />
              </label>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}