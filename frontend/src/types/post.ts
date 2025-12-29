/**
 * Post-related type definitions
 */

import { User } from './index'

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  parent: number | null
  created_at: string
}

export interface Tag {
  id: number
  name: string
  slug: string
  created_at: string
}

export interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  author: User
  featured_image: number | null
  categories: Category[]
  tags: Tag[]
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  published_at: string | null
  meta_description: string
  meta_keywords: string
  view_count: number
  allow_comments: boolean
  created_at: string
  updated_at: string
}

export interface CreatePostData {
  title: string
  slug?: string
  content: string
  excerpt?: string
  featured_image?: number
  category_ids?: number[]
  tag_ids?: number[]
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  published_at?: string
  meta_description?: string
  meta_keywords?: string
  allow_comments?: boolean
}

export interface UpdatePostData extends Partial<CreatePostData> {}
