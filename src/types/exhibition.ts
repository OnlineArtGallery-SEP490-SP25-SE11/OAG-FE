import { z } from "zod";
import { Gallery } from "./gallery";
import { Pagination } from "./response";



interface Artwork {
  _id: string;
  title: string;
  description: string;
  category: string[];
  dimensions: {
    width: number;
    height: number;
  };
  url: string;
  status: string;
  views: number;
  price: number;
  artistId: string;
}

export interface ArtworkPosition {
  artwork: Artwork;
  positionIndex: number;
}


export interface LanguageOption {
  name: string;
  code: string;
  isDefault: boolean;
}

// Result interface for exhibition analytics
export interface ExhibitionResult {
  visits: number;
  likes: { count: number; artworkId: string }[];
  totalTime: number;
}

// Public settings interface
export interface PublicSettings {
  linkName: string;
  discovery: boolean;
}


export interface Exhibition {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  gallery: Gallery;
  author: {
    _id: string;
    name: string;
    email: string;
    image: string;
  };
  languageOptions: LanguageOption[];
  isFeatured: boolean;
  status: ExhibitionStatus;
  result: ExhibitionResult;
  public: PublicSettings;
  artworkPositions: ArtworkPosition[];
}


export enum ExhibitionStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  PRIVATE = 'PRIVATE',
  REJECTED = 'REJECTED'
}

// Schema definitions for nested objects
const languageOptionSchema = z.object({
  name: z.string().min(2).max(2),
  code: z.string().min(2).max(2),
  isDefault: z.boolean()
});

const resultSchema = z.object({
  visits: z.number().optional().default(0),
  likes: z.array(
    z.object({
      count: z.number(),
      artworkId: z.string()
    })
  ).optional().default([]),
  totalTime: z.number().optional().default(0)
});

const publicSchema = z.object({
  linkName: z.string().optional().default(''),
  discovery: z.boolean().optional().default(false)
});

const artworkPositionSchema = z.object({
  artwork: z.string(),
  positionIndex: z.number()
});

export const createEmptyExhibitionSchema = z.object({
  gallery: z.string(),
  name: z.string().min(2).max(50).optional()
});

// Update schema - all fields optional
export const updateExhibitionSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().optional(),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
  gallery: z.string().optional(),
  languageOptions: z.array(languageOptionSchema).optional(),
  isFeatured: z.boolean().optional(),
  status: z.nativeEnum(ExhibitionStatus).optional(),
  result: resultSchema.optional(),
  public: publicSchema.optional(),
  artworkPositions: z.array(artworkPositionSchema).optional()
});



export type GetExhibitionsResponse = {
  exhibitions: Exhibition[];
  pagination: Pagination;
};


export type ExhibitionRequestResponse = {
  exhibition: Exhibition;
}

export type CreateEmptyExhibitionDto = z.infer<typeof createEmptyExhibitionSchema>;
export type UpdateExhibitionDto = z.infer<typeof updateExhibitionSchema>;