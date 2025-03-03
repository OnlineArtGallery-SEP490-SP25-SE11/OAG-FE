import { Vec3 } from "@/types/gallery";

/**
 * Calculates artwork positions for any wall in a room, including interior divider walls
 * @param options Configuration options for wall artwork positioning
 * @returns Array of positions and rotations for artworks
 */
export function calculateWallArtworkPositions(
  options: {
    // Standard wall types OR custom for arbitrary walls
    wallType: 'front' | 'back' | 'left' | 'right' | 'custom';
    // Wall dimension (width/length of the wall)
    wallDimension: number;
    // Number of artworks to place on the wall
    artworkCount: number;
    // Room dimensions
    roomDimensions: { X_AXIS: number; Y_AXIS: number; Z_AXIS: number };
    // Wall offset (distance from wall surface)
    wallOffset?: number;
    // Height position for artworks
    heightPosition?: number;
    // For custom walls only: wall position
    wallPosition?: Vec3;
    // For custom walls only: wall rotation in radians
    wallRotation?: Vec3;
    // For custom walls only: direction vector for artwork offset
    offsetDirection?: Vec3;
  }
): { positions: Vec3[], rotations: Vec3[] } {
  const {
    wallType,
    wallDimension,
    artworkCount,
    roomDimensions,
    wallOffset = 0.15,
    heightPosition = 4,
    wallPosition = [0, 0, 0],
    wallRotation = [0, 0, 0],
    offsetDirection = [0, 0, 1]  // Default offset direction is along positive Z
  } = options;
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { X_AXIS, Y_AXIS, Z_AXIS } = roomDimensions;
  const spacing = wallDimension / (artworkCount + 1);

  // Calculate base positions along wall
  const basePositions = Array.from({ length: artworkCount }, (_, i) => {
    const position = spacing * (i + 1) - wallDimension / 2;
    return position;
  });

  let positions: Vec3[] = [];
  let rotations: Vec3[] = [];

  // Handle standard wall types
  if (wallType !== 'custom') {
    switch (wallType) {
      case 'back':
        positions = basePositions.map(pos => [pos, heightPosition, -Z_AXIS / 2 + wallOffset] as Vec3);
        rotations = Array(artworkCount).fill([0, 0, 0] as Vec3);
        break;
      case 'front':
        positions = basePositions.map(pos => [pos, heightPosition, Z_AXIS / 2 - wallOffset] as Vec3);
        rotations = Array(artworkCount).fill([0, Math.PI, 0] as Vec3);
        break;
      case 'left':
        positions = basePositions.map(pos => [-X_AXIS / 2 + wallOffset, heightPosition, pos] as Vec3);
        rotations = Array(artworkCount).fill([0, Math.PI / 2, 0] as Vec3);
        break;
      case 'right':
        positions = basePositions.map(pos => [X_AXIS / 2 - wallOffset, heightPosition, pos] as Vec3);
        rotations = Array(artworkCount).fill([0, -Math.PI / 2, 0] as Vec3);
        break;
    }
    return { positions, rotations };
  }

  // Handle custom wall (e.g., interior divider walls)
  // Determine the primary axis based on wall rotation
  let primaryAxis: 'x' | 'z';
  let rotationY: number;

  // Determine wall orientation based on Y rotation
  // This assumes the wall is vertical and only rotated around Y axis
  const yRotation = wallRotation[1] % (2 * Math.PI);
  
  // Check if wall is more aligned with X or Z axis
  if (Math.abs(Math.sin(yRotation)) > Math.abs(Math.cos(yRotation))) {
    // Wall normal is more aligned with X axis (wall runs along Z)
    primaryAxis = 'z';
    rotationY = yRotation;
  } else {
    // Wall normal is more aligned with Z axis (wall runs along X)
    primaryAxis = 'x';
    rotationY = yRotation;
  }

  // Calculate positions for artwork along the wall
  positions = basePositions.map(pos => {
    // Position along primary wall axis
    const x = primaryAxis === 'x' ? pos : wallPosition[0];
    const z = primaryAxis === 'z' ? pos : wallPosition[2];
    
    // Apply offset in direction of wall normal
    const offsetX = offsetDirection[0] * wallOffset;
    const offsetZ = offsetDirection[2] * wallOffset;
    
    return [
      x + offsetX,  // X position with offset
      heightPosition, // Y position (height)
      z + offsetZ   // Z position with offset
    ] as Vec3;
  });

  // All artworks on this wall share the same rotation
  rotations = Array(artworkCount).fill([
    wallRotation[0],
    rotationY,
    wallRotation[2]
  ] as Vec3);

  return { positions, rotations };
}
export const getCloudinaryModelUrl = (modelPath: string): string => {
	// if (!CLOUDINARY_CLOUD_NAME) {
	//   throw new Error('CLOUDINARY_CLOUD_NAME is not defined');
	// }

	// Error: Could not load https://res.cloudinary.com/djvlldzih/image/upload/gallery/models/glass_window_2.glb: fetch for "https://res.cloudinary.com/djvlldzih/image/upload/gallery/models/glass_window_2.glb"
	// responded with 404:
	//https://res.cloudinary.com/djvlldzih/image/upload/v1738856859/gallery/models/glass_window_2.glb
	return modelPath;
};
