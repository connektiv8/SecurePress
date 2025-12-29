/**
 * Page-related type definitions
 */

import { User } from './index'

export interface Page {
  id: number
  title: string
  slug: string
  content: string
  author: User
  parent: number | null
  featured_image: number | null
  status: 'draft' | 'published' | 'archived'
  template: 'default' | 'fullwidth' | 'landing' | 'contact'
  menu_order: number
  show_in_menu: boolean
  meta_description: string
  meta_keywords: string
  published_at: string | null
  created_at: string
  updated_at: string
  breadcrumb: Array<{
    id: number
    title: string
    slug: string
  }>
}

export interface CreatePageData {
  title: string
  slug?: string
  content: string
  parent?: number | null
  featured_image?: number
  status: 'draft' | 'published' | 'archived'
  template?: 'default' | 'fullwidth' | 'landing' | 'contact'
  menu_order?: number
  show_in_menu?: boolean
  meta_description?: string
  meta_keywords?: string
  published_at?: string
}

export interface UpdatePageData extends Partial<CreatePageData> {}
