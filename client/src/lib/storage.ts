import { supabase } from './supabase'

export const storageService = {
  // Upload a file to Supabase Storage
  async uploadFile(file: File, bucket: string = 'uploads'): Promise<{ url: string | null; error?: string }> {
    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${Date.now()}_${fileName}`

      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (error) {
        console.error('Error uploading file:', error)
        return { url: null, error: error.message }
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return { url: urlData.publicUrl }
    } catch (error) {
      console.error('Error uploading file:', error)
      return { url: null, error: 'Failed to upload file' }
    }
  },

  // Delete a file from Supabase Storage
  async deleteFile(filePath: string, bucket: string = 'uploads'): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) {
        console.error('Error deleting file:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting file:', error)
      return { success: false, error: 'Failed to delete file' }
    }
  }
} 