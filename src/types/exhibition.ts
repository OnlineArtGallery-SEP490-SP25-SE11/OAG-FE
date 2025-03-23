import { Vec3 } from "./gallery";
import { Pagination } from "./response";


export interface Exhibition {
  _id: string;
  name: string;
  title: string;
  author: {
    _id: string;
    name: string;
  };
  date: string;
  description: string;
  thumbnail: string;
  backgroundImage: string;
  status: 'published' | 'draft' | 'pending';
  createdAt: string;
  updatedAt: string;
  gallery: {
    _id: string;
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
    modelPosition: Vec3;
    modelRotation: Vec3;
    modelScale: number;
    customCollider?: {
      shape: 'box';
      args: Vec3;
      position: Vec3;
    };
  };
  artworks : [
    {
        index: number;
        artwork: {
            _id: string;
            title: string;
            url: string;
            description: string;
        }
    }
  ]
  
}

export type GetExhibitionsResponse = {
	exhibitions: Exhibition[];
	pagination: Pagination;
};
	

export type ExhibitionRequestResponse = {
	exhibition: Exhibition;
}