/**
 * Media-related type definitions
 */

export interface Media {
  id: number
  file: string
  file_url: string
  title: string
  alt_text: string
  caption: string
  file_type: 'image' | 'video' | 'audio' | 'document' | 'other'
  mime_type: string
  file_size: number
  file_size_human: string
  width: number | null
  height: number | null
  uploaded_by: {
    id: number
    email: string
    full_name: string
  }
  created_at: string
  updated_at: string
}

export interface UploadMediaData {
  file: File
  title?: string
  alt_text?: string
  caption?: string
}
