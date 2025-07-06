import { supabase, Submission } from './supabase'

export interface CreateSubmissionData {
  brand_name: string
  direct_booking_website: string
  number_of_listings: number
  countries: string[]
  cities_regions: { name: string; geonameId: number }[]
  logo_url: string
  highlight_image_url: string
  submitted_by_email: string
  one_line_description: string
  why_book_with_you: string
  types_of_stays: string[]
  ideal_for: string[]
  is_pet_friendly: boolean
  perks_amenities: string[]
  is_eco_conscious: boolean
  is_remote_work_friendly: boolean
  vibe_aesthetic: string[]
  instagram?: string
  facebook?: string
  linkedin?: string
  tiktok?: string
  youtube_video_tour?: string
  listing_type: string
  approved: boolean
  created_at: string
}

export const submissionsService = {
  // Create a new submission
  async createSubmission(data: CreateSubmissionData): Promise<{ success: boolean; error?: string }> {
    try {
      // Set approved based on listing type (featured = auto-approved)
      const approved = data.listing_type === 'Featured ($49.99)';
      
      const { error } = await supabase
        .from('submissions')
        .insert({
          ...data,
          approved: approved,
          status: approved ? 'approved' : 'pending',
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error creating submission:', error)
        return { success: false, error: error.message }
      }

      // If approved, also create a listing
      if (approved) {
        const listingData = {
          name: data.brand_name,
          description: data.one_line_description,
          website: data.direct_booking_website,
          logo: data.logo_url,
          image: data.highlight_image_url,
          featured: true,
          countries: data.countries,
          why_book_with: data.why_book_with_you,
          socials: {
            facebook: data.facebook,
            instagram: data.instagram,
            linkedin: data.linkedin
          },
          created_at: new Date().toISOString()
        };
        
        await supabase.from('listings').insert(listingData);
      }

      return { success: true }
    } catch (error) {
      console.error('Error creating submission:', error)
      return { success: false, error: 'Failed to create submission' }
    }
  },

  // Get all submissions (for admin)
  async getSubmissions(): Promise<{ data: Submission[] | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching submissions:', error)
        return { data: null, error: error.message }
      }

      return { data }
    } catch (error) {
      console.error('Error fetching submissions:', error)
      return { data: null, error: 'Failed to fetch submissions' }
    }
  },

  // Update submission approval status
  async updateSubmissionApproval(id: number, approved: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ 
          approved: approved,
          status: approved ? 'approved' : 'rejected'
        })
        .eq('id', id)

      if (error) {
        console.error('Error updating submission approval:', error)
        return { success: false, error: error.message }
      }

      // If approved, create a listing
      if (approved) {
        const { data: submission } = await supabase
          .from('submissions')
          .select('*')
          .eq('id', id)
          .single();

        if (submission) {
          const listingData = {
            name: submission.brand_name,
            description: submission.one_line_description,
            website: submission.direct_booking_website,
            logo: submission.logo_url,
            image: submission.highlight_image_url,
            featured: submission.listing_type === 'Featured ($49.99)',
            countries: submission.countries,
            why_book_with: submission.why_book_with_you,
            socials: {
              facebook: submission.facebook,
              instagram: submission.instagram,
              linkedin: submission.linkedin
            },
            created_at: new Date().toISOString()
          };
          
          await supabase.from('listings').insert(listingData);
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Error updating submission approval:', error)
      return { success: false, error: 'Failed to update submission approval' }
    }
  },

  // Update submission status (approve/reject) - legacy function
  async updateSubmissionStatus(id: number, status: 'approved' | 'rejected'): Promise<{ success: boolean; error?: string }> {
    return this.updateSubmissionApproval(id, status === 'approved');
  },

  // Convert approved submission to listing
  async convertToListing(submission: Submission): Promise<{ success: boolean; error?: string }> {
    try {
      // First, create the listing
      const { error: listingError } = await supabase
        .from('listings')
        .insert({
          name: submission.name,
          description: submission.description,
          website: submission.website,
          logo: submission.logo,
          image: submission.logo, // Using logo as image for now
          featured: submission.listing_type === 'featured',
          countries: submission.countries,
          socials: {
            facebook: submission.facebook,
            instagram: submission.instagram,
            linkedin: submission.linkedin
          }
        })

      if (listingError) {
        console.error('Error creating listing:', listingError)
        return { success: false, error: listingError.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error converting submission to listing:', error)
      return { success: false, error: 'Failed to convert submission to listing' }
    }
  }
} 