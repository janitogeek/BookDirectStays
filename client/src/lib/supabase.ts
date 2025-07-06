import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on your schema
export interface Submission {
  id: number
  name: string
  website: string
  listing_count: number
  countries: string[]
  description: string
  logo: string
  email: string
  facebook?: string
  instagram?: string
  linkedin?: string
  listing_type: 'free' | 'featured'
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface Listing {
  id: number
  name: string
  description: string
  website: string
  logo: string
  image: string
  featured: boolean
  countries: string[]
  why_book_with?: string
  socials?: {
    facebook?: string
    instagram?: string
    linkedin?: string
  }
} 