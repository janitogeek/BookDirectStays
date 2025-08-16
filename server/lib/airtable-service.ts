import Airtable from 'airtable';

// Initialize Airtable
const airtableApiKey = process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
const airtableBaseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;

if (!airtableApiKey || !airtableBaseId) {
  throw new Error('Missing required Airtable environment variables');
}

const base = new Airtable({
  apiKey: airtableApiKey
}).base(airtableBaseId);

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
  },

  /**
   * Get only approved submissions (for website display)
   */
  async getApprovedSubmissions(): Promise<Submission[]> {
    try {
      const records = await base('Submissions').select({
        filterByFormula: `{Status} = 'Approved – Published'`
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
      console.error('❌ Error fetching approved submissions:', error);
      throw new Error(`Failed to fetch approved submissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Check if a specific submission has changed status
   */
  async checkSubmissionStatus(submissionId: string, expectedStatus: string): Promise<boolean> {
    try {
      const record = await base('Submissions').find(submissionId);
      const currentStatus = record.get('Status') as string;
      return currentStatus === expectedStatus;
    } catch (error) {
      console.error(`❌ Error checking status for submission ${submissionId}:`, error);
      return false;
    }
  }
};
