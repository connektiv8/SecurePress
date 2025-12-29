/**
 * Post API Service
 * 
 * Handles all post-related API calls using the centralized API service.
 */

import { api } from './apiService'
import { Post, CreatePostData, UpdatePostData, PaginatedResponse } from '@/types'

export interface PostListParams {
  page?: number
  status?: 'draft' | 'published' | 'scheduled' | 'archived'
  search?: string
  ordering?: string
}

/**
 * Get paginated list of posts
 */
export const getPosts = async (params: PostListParams = {}): Promise<PaginatedResponse<Post>> => {
  return api.get<PaginatedResponse<Post>>('/posts/', params)
}

/**
 * Get single post by slug
 */
export const getPost = async (slug: string): Promise<Post> => {
  return api.get<Post>(`/posts/${slug}/`)
}

/**
 * Create new post
 */
export const createPost = async (data: CreatePostData): Promise<Post> => {
  return api.post<Post>('/posts/', data)
}

/**
 * Update existing post
 */
export const updatePost = async (slug: string, data: UpdatePostData): Promise<Post> => {
  return api.patch<Post>(`/posts/${slug}/`, data)
}

/**
 * Delete post
 */
export const deletePost = async (slug: string): Promise<void> => {
  return api.delete(`/posts/${slug}/`)
}

/**
 * Increment post view count
 */
export const incrementPostViews = async (slug: string): Promise<{ view_count: number }> => {
  return api.post(`/posts/${slug}/increment_views/`)
}
