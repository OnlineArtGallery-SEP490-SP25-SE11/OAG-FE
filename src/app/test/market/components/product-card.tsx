import CanvasImage from "@/components/ui.custom/canvas-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArtPiece } from "@/types/marketplace.d";
import { useCallback, useState } from "react";

interface ProductCardProps {
  art: ArtPiece;
  onClick: (art: ArtPiece) => void;
}

export function ProductCard({ art, onClick }: ProductCardProps) {
  const [tooltipSide, setTooltipSide] = useState<
    "top" | "right" | "bottom" | "left"
  >("right");

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      if (rect.right + 300 > windowWidth) {
        setTooltipSide("left");
      } else if (rect.left < 300) {
        setTooltipSide("right");
      } else if (rect.bottom + 200 > windowHeight) {
        setTooltipSide("top");
      } else {
        setTooltipSide("bottom");
      }
    },
    []
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="break-inside-avoid mb-4 cursor-pointer transition-transform hover:scale-105"
          onClick={() => onClick(art)}
          onMouseEnter={handleMouseEnter}
        >
          <div className="rounded-lg shadow-md overflow-hidden">
            <div
              // style={{
              //   position: 'relative',
              //   paddingBottom: `${(art.height / art.width) * 100}%`,
              // }}
              className="w-full h-full flex items-center justify-center"
            >
              {/* <Image
                src={art.imageUrl}
                alt={art.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              /> */}
              <CanvasImage
                src={art.imageUrl}
                width={art.width}
                height={art.height}
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{art.title}</h3>
              <p className="text-sm">{art.artist}</p>
              <p className="text-lg font-bold mt-2">${art.price}</p>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side={tooltipSide}
        align="center"
        className="max-w-xs shadow-lg rounded-lg border p-4 space-y-2 "
      >
        <h4 className="text-lg font-bold  border-b  pb-2">{art.title}</h4>
        <ScrollArea className="h-52 w-full rounded-md p-4 mb-4">
          <p className="text-sm  italic">{art.description}</p>
        </ScrollArea>
        <p className="text-sm flex items-center gap-2">
          <span className="font-medium">By:</span>
          {art.artist}
        </p>
        <p className="text-base font-semibold text-green-600 mt-2 text-right">
          ${art.price}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
