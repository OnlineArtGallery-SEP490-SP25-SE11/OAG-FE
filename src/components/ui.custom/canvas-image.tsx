import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface CanvasImageProps {
  src: string;
  width?: number;
  height?: number;
  className?: string;
  watermark?: WatermarkOptions | null;
}

interface WatermarkOptions {
  text: string;
  color?: string;
  font?: string;
  style?: "circular" | "diagonal";
  position?: "bottomRight" | "bottomLeft" | "topRight" | "topLeft";
  radius?: number; // percentage of smallest dimension
  textStyle?: "inside" | "along"; // text placement style
}

function CanvasImage({
  src,
  width = 500,
  height = 500,
  className = "",
  watermark = {
    text: "PROTECTED IMAGE",
    color: "#fff20cd9",
    font: "Arial",
    style: "circular",
    position: "bottomRight",
    radius: 0.1, // 10% of smallest dimension
    textStyle: "along",
  },
}: CanvasImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      canvas.width = width;
      canvas.height = height;

      if (watermark) {
        ctx.drawImage(image, 0, 0, width, height);
        ctx.save();

        // Calculate dimensions
        const circleRadius =
          Math.min(width, height) * (watermark.radius || 0.1);
        const padding = 20;

        // Calculate position based on watermark.position
        let centerX = width - circleRadius - padding;
        let centerY = height - circleRadius - padding;

        switch (watermark.position) {
          case "bottomLeft":
            centerX = circleRadius + padding;
            break;
          case "topRight":
            centerY = circleRadius + padding;
            break;
          case "topLeft":
            centerX = circleRadius + padding;
            centerY = circleRadius + padding;
            break;
        }

        // Draw circle outline
        ctx.beginPath();
        ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = watermark.color || "rgba(255, 0, 0, 0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Configure text style
        ctx.font = `${circleRadius * 0.2}px ${watermark.font || "Arial"}`;
        ctx.fillStyle = watermark.color || "rgba(255, 0, 0, 0.6)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (watermark.textStyle === "inside") {
          // Method 1: Text inside circle with background for better visibility
          ctx.save();
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent background
          const textWidth = ctx.measureText(watermark.text).width;
          ctx.fillRect(
            centerX - textWidth / 2 - 10,
            centerY - circleRadius * 0.1,
            textWidth + 20,
            circleRadius * 0.3
          );
          ctx.restore();

          ctx.fillStyle = watermark.color || "rgba(255, 255, 255, 0.9)"; // Brighter text color
          ctx.fillText(watermark.text, centerX, centerY);
        } else {
          // Method 2: Text along circle path with improved visibility
          watermark.text.split("").forEach((char, i) => {
            const angle =
              (i / watermark.text.length) * 2 * Math.PI - Math.PI / 2;
            ctx.save();
            ctx.translate(
              centerX + (circleRadius - 10) * Math.cos(angle),
              centerY + (circleRadius - 10) * Math.sin(angle)
            );
            ctx.rotate(angle + Math.PI / 2);

            // Add background for each character
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            const charWidth = ctx.measureText(char).width;
            ctx.fillRect(
              -charWidth / 2,
              -circleRadius * 0.1,
              charWidth,
              circleRadius * 0.3
            );

            // Draw character
            ctx.fillStyle = watermark.color || "rgba(255, 255, 255, 0.9)";
            ctx.fillText(char, 0, 0);
            ctx.restore();
          });
        }

        ctx.restore();
      }
    };
    image.src = src;
    const preventDownload = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    canvas.addEventListener("contextmenu", preventDownload);
    canvas.addEventListener("dragstart", preventDownload);

    return () => {
      canvas.removeEventListener("contextmenu", preventDownload);
      canvas.removeEventListener("dragstart", preventDownload);
    };
  }, [src, width, height]);
  return (
    <div className="p-3">
      <canvas
        className={cn(className)}
        ref={canvasRef}
        style={{
          maxWidth: "100%",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default CanvasImage;
