import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID);

export interface Submission {
  id: string;
  brandName: string;
  status: string;
  statusBis?: string;
  createdAt: string;
  updatedAt: string;
}

export const airtableService = {
  /**
   * Get all submissions from Airtable (for status monitoring)
   */
  async getAllSubmissions(): Promise<Submission[]> {
    try {
      console.log('📡 Fetching all submissions from Airtable...');
      
      const records = await base('Submissions').select({
        fields: ['id', 'Brand Name', 'Status', 'Status Bis (PMC directory)', 'Created', 'Last Modified']
      }).all();
      
      const submissions: Submission[] = records.map(record => ({
        id: record.id,
        brandName: record.get('Brand Name') as string || 'Unknown',
        status: record.get('Status') as string || 'Unknown',
        statusBis: record.get('Status Bis (PMC directory)') as string,
        createdAt: record.get('Created') as string || '',
        updatedAt: record.get('Last Modified') as string || ''
      }));
      
      console.log(`✅ Fetched ${submissions.length} submissions from Airtable`);
      return submissions;
      
    } catch (error) {
      console.error('❌ Error fetching submissions from Airtable:', error);
      throw new Error(`Failed to fetch submissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Get submissions by status
   */
  async getSubmissionsByStatus(status: string): Promise<Submission[]> {
    try {
      const records = await base('Submissions').select({
        filterByFormula: `{Status} = '${status}'`
      }).all();
      
      return records.map(record => ({
        id: record.id,
        brandName: record.get('Brand Name') as string || 'Unknown',
        status: record.get('Status') as string || 'Unknown',
        statusBis: record.get('Status Bis (PMC directory)') as string,
        createdAt: record.get('Created') as string || '',
        updatedAt: record.get('Last Modified') as string || ''
      }));
      
    } catch (error) {
      console.error(`❌ Error fetching submissions with status ${status}:`, error);
      throw new Error(`Failed to fetch submissions by status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};
