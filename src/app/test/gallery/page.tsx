import dynamic from "next/dynamic";
import { GalleryLoader } from "./components/gallery-loader";

export default function GalleryPage() {
  const ArtGallery = dynamic(
    () => import("./components/art-gallery").then((mod) => mod.ArtGallery),
    {
      ssr: false,
      loading: () => <GalleryLoader />,
    }
  );

  return (
    <div className="w-full h-screen">
      <ArtGallery />
    </div>
  );
}
