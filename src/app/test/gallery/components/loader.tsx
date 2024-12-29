"use client";
import { Html, useProgress } from "@react-three/drei";

export function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="bg-black/50 text-white p-4 rounded-lg shadow-xl">
        <div className="text-lg font-bold mb-2">Loading Gallery</div>
        <div className="w-48 bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-sm mt-2">{Math.round(progress)}% Loaded</div>
      </div>
    </Html>
  );
}
