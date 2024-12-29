"use client";
import { keys } from "./player";

// Add event listeners for movement
export const keyMap: { [key: string]: keyof typeof keys } = {
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "right",
  KeyD: "left",
};
