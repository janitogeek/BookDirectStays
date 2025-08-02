// Test creating a simple field to debug the API issue
import { config } from 'dotenv';

config();

const AIRTABLE_API_KEY = process.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.VITE_AIRTABLE_BASE_ID || 'app0tFfsjLbI1qXq0';
const AIRTABLE_TABLE_NAME = 'Directory Submissions';
const AIRTABLE_META_URL = `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`;

async function getTableSchema() {
  const response = await fetch(AIRTABLE_META_URL, {
    headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }
  });
  const data = await response.json();
  return data.tables.find(table => table.name === AIRTABLE_TABLE_NAME);
}

async function testSimpleField() {
  try {
    const schema = await getTableSchema();
    console.log('🧪 Testing simple field creation...');
    
    // Test with the absolute simplest field possible
    const testField = {
      name: 'Test Field',
      type: 'singleLineText'
    };

    console.log('Creating test field with payload:', JSON.stringify({ fields: [testField] }, null, 2));

    const response = await fetch(`${AIRTABLE_META_URL}/${schema.id}/fields`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: [testField] })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success! Created test field');
      console.log('Result:', JSON.stringify(result, null, 2));
    } else {
      const errorData = await response.json();
      console.log('❌ Error response:', JSON.stringify(errorData, null, 2));
    }

  } catch (error) {
    console.error('❌ Exception:', error.message);
  }
}

testSimpleField();