import { Texture } from 'three';

export type Vec3 = [number, number, number];

export type Keys = {
	forward: boolean;
	backward: boolean;
	left: boolean;
	right: boolean;
};

export type KeyMap = {
	[key: string]: keyof Keys;
};

export interface Position3D {
	x: number;
	y: number;
	z: number;
}

export interface Dimensions {
	width: number;
	height: number;
	length: number;
}

export interface MaterialProps {
	color?: string;
	texture?: Texture;
	roughness?: number;
	metalness?: number;
}

export interface WallDimensions {
	width: number;
	height: number;
	length?: number;
}

export interface WallMaterial {
	color: string;
	texture?: Texture;
	roughness?: number;
	metalness?: number;
}

export interface WallProps {
	position: Vec3;
	rotation?: Vec3;
	dimensions: WallDimensions;
	material: WallMaterial;
}

export interface DoorWallProps {
	roomDimensions: {
		width: number;
		height: number;
		length: number;
	};
	material: WallMaterial;
}
