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


export interface BaseColliderConfig {
	position: [number, number, number];
	rotation: [number, number, number];
	type?: 'Static' | 'Dynamic' | 'Kinematic';
	visible?: boolean;
}

export interface BoxColliderConfig extends BaseColliderConfig {
	shape: 'box';
	args: [number, number, number];
}

export interface CurvedColliderConfig extends BaseColliderConfig {
	shape: 'curved';
	radius: number;
	height: number;
	segments?: number;
	arc?: number;
}

export interface ExhibitionType {
  id: string;
  name: string;
  title: string;
  author: string;
  date: string;
  description: string;
  thumbnail: string;
  backgroundImage: string;
  galleryModel: {
	id: string;
	name: string;
	description: string;
	dimension: {
	  xAxis: number;
	  yAxis: number;
	  zAxis: number;
	};
	wallThickness: number;
	wallHeight: number;
	modelPath: string;
	modelScale: number;
	customElement?: {
	  shape: 'box';
	  args: [number, number, number];
	  position: [number, number, number];
	};
  };
  walls: {
	back?: {
	  artworkCount?: number;
	  artworks: Array<{ 
		id: string; 
		url: string;
		position?: Vec3;
		rotation?: Vec3;
	  }>;
	};
	front?: {
	  artworkCount?: number;
	  artworks: Array<{ 
		id: string; 
		url: string;
		position?: Vec3;
		rotation?: Vec3;
	  }>;
	};
	left?: {
	  artworkCount?: number;
	  artworks: Array<{ 
		id: string; 
		url: string;
		position?: Vec3;
		rotation?: Vec3;
	  }>;
	};
	right?: {
	  artworkCount?: number;
	  artworks: Array<{ 
		id: string; 
		url: string;
		position?: Vec3;
		rotation?: Vec3;
	  }>;
	};
  };
}


export type ColliderConfig = BoxColliderConfig | CurvedColliderConfig;