import { z } from 'zod';

/**
 * Post creation validation schema
 */
export const createPostSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  content: z.string()
    .min(100, 'Content must be at least 100 characters')
    .max(50000, 'Content must be less than 50,000 characters'),
  coverImage: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * Comment validation schema
 */
export const commentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment must be less than 500 characters'),
  postId: z.string().min(1, 'Post ID is required'),
});

/**
 * Post update validation schema
 */
export const updatePostSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  content: z.string().min(100).max(50000).optional(),
  coverImage: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['pending', 'published', 'rejected']).optional(),
  rejectionReason: z.string().max(500).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;