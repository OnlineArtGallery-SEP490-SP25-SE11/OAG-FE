import { z } from "zod";

export const collectionSchema = z.object({
    _id : z.string(),
    userId : z.string(),    
    title : z.string(),
    description : z.string(),
    artworks : z.array(z.string()).optional(),
});

export const createCollection = z.object({   
    title : z.string(),
    description : z.string(),
    artworks : z.array(z.string()).optional(),
});
export type CollectionForm = z.infer<typeof collectionSchema>;
export type CreateCollectionForm = z.infer<typeof createCollection>;

