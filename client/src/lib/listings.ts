import { supabase, Listing } from './supabase'

export const listingsService = {
  // Get all approved listings
  async getListings(): Promise<{ data: Listing[] | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('featured', { ascending: false })
        .order('name', { ascending: true })

      if (error) {
        console.error('Error fetching listings:', error)
        return { data: null, error: error.message }
      }

      return { data }
    } catch (error) {
      console.error('Error fetching listings:', error)
      return { data: null, error: 'Failed to fetch listings' }
    }
  },

  // Get listings by country
  async getListingsByCountry(country: string): Promise<{ data: Listing[] | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .contains('countries', [country])
        .order('featured', { ascending: false })
        .order('name', { ascending: true })

      if (error) {
        console.error('Error fetching listings by country:', error)
        return { data: null, error: error.message }
      }

      return { data }
    } catch (error) {
      console.error('Error fetching listings by country:', error)
      return { data: null, error: 'Failed to fetch listings by country' }
    }
  },

  // Get featured listings
  async getFeaturedListings(): Promise<{ data: Listing[] | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('featured', true)
        .order('name', { ascending: true })

      if (error) {
        console.error('Error fetching featured listings:', error)
        return { data: null, error: error.message }
      }

      return { data }
    } catch (error) {
      console.error('Error fetching featured listings:', error)
      return { data: null, error: 'Failed to fetch featured listings' }
    }
  },

  // Get a single listing by ID
  async getListingById(id: number): Promise<{ data: Listing | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching listing:', error)
        return { data: null, error: error.message }
      }

      return { data }
    } catch (error) {
      console.error('Error fetching listing:', error)
      return { data: null, error: 'Failed to fetch listing' }
    }
  }
} 