// Test Airtable API access
import { config } from 'dotenv';

// Load environment variables
config();

const AIRTABLE_API_KEY = process.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.VITE_AIRTABLE_BASE_ID || 'app0tFfsjLbI1qXq0';
const AIRTABLE_TABLE_NAME = 'Directory Submissions';

console.log('🔍 Testing Airtable API access...');
console.log('API Key present:', !!AIRTABLE_API_KEY);
console.log('Base ID:', AIRTABLE_BASE_ID);

// Test 1: Check if we can read records
async function testRecordAccess() {
  try {
    const recordsUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?maxRecords=1`;
    const response = await fetch(recordsUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      }
    });
    
    if (response.ok) {
      console.log('✅ Records API: Authorized - Can read records');
      return true;
    } else {
      console.log('❌ Records API: Unauthorized - Cannot read records');
      console.log('Response:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.log('❌ Records API Error:', error.message);
    return false;
  }
}

// Test 2: Check if we can read schema  
async function testMetaAccess() {
  try {
    const metaUrl = `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`;
    const response = await fetch(metaUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Meta API: Authorized - Can read schema');
      const table = data.tables.find(t => t.name === AIRTABLE_TABLE_NAME);
      if (table) {
        console.log('📋 Found table with', table.fields.length, 'fields');
        console.log('Current fields:', table.fields.map(f => f.name).slice(0, 5), '...');
      }
      return true;
    } else {
      console.log('❌ Meta API: Unauthorized - Cannot read schema');
      console.log('Response:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.log('❌ Meta API Error:', error.message);
    return false;
  }
}

async function runTests() {
  const recordAccess = await testRecordAccess();
  const metaAccess = await testMetaAccess();
  
  if (!recordAccess && !metaAccess) {
    console.log('\n🚨 API Key Issues:');
    console.log('1. Check if your API key is correct (starts with pat_...)');
    console.log('2. Make sure the Base ID is correct:', AIRTABLE_BASE_ID);
    console.log('3. Ensure your API key has permissions to this base');
  } else if (recordAccess && !metaAccess) {
    console.log('\n⚠️  Limited Permissions:');
    console.log('Your API key can read records but not modify schema.');
    console.log('You might need to:');
    console.log('1. Create a Personal Access Token instead of API Key');
    console.log('2. Or manually add the fields to Airtable');
  } else if (metaAccess) {
    console.log('\n✅ Full Access - Ready to create fields!');
  }
}

runTests();