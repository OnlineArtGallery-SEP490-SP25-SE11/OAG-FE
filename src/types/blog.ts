import { z } from 'zod';

export const blogSchema = z.object({
<<<<<<< HEAD
	_id: z.string(),
	title: z.string(),
	content: z.string(),
	image: z.string(),
	published: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date()
=======
  _id: z.string(),
  title: z.string(),
  content: z.string(),
  image: z.string(),
  published: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  heartCount: z.number(),
>>>>>>> 592f1c8501b901be16ad94fdfd08df99a433f9ac
});
export type Blog = z.infer<typeof blogSchema>;
export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
};
export type BlogEdge = {
  node: Blog & {
    author: {
      _id: string;
      name: string;
      image: string;
    };
  };
  cursor: string;
};

export type GetPublishedBlogsResponse = {
  edges: BlogEdge[];
  total: number;
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
};