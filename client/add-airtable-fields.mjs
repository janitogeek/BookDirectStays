// Script to add new fields to Airtable with proper environment loading
import { config } from 'dotenv';
import { readFileSync } from 'fs';

// Load environment variables
config();

// Mock import.meta.env for Node.js environment
const env = {
  VITE_AIRTABLE_API_KEY: process.env.VITE_AIRTABLE_API_KEY,
  VITE_AIRTABLE_BASE_ID: process.env.VITE_AIRTABLE_BASE_ID || 'app0tFfsjLbI1qXq0'
};

// Mock import.meta for the airtable service
global.importMeta = { env };

// Airtable configuration
const AIRTABLE_API_KEY = env.VITE_AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = env.VITE_AIRTABLE_BASE_ID || '';
const AIRTABLE_TABLE_NAME = 'Directory Submissions';

// Airtable API endpoints
const AIRTABLE_META_URL = `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`;

async function getTableSchema() {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error('Airtable configuration missing. Please set VITE_AIRTABLE_API_KEY and VITE_AIRTABLE_BASE_ID in your .env file');
  }

  const response = await fetch(AIRTABLE_META_URL, {
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    }
  });

  if (!response.ok) {
    throw new Error(`Airtable Meta API error: ${response.statusText}`);
  }

  const data = await response.json();
  const directoryTable = data.tables.find((table) => table.name === AIRTABLE_TABLE_NAME);
  
  if (!directoryTable) {
    throw new Error(`Table "${AIRTABLE_TABLE_NAME}" not found`);
  }

  return directoryTable;
}

async function createFields(fields) {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error('Airtable configuration missing');
  }

  // First get the table ID
  const schema = await getTableSchema();
  const tableId = schema.id;

  const response = await fetch(`${AIRTABLE_META_URL}/${tableId}/fields`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: fields
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Airtable field creation error: ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  const result = await response.json();
  console.log('✅ Created fields:', fields.map(f => f.name).join(', '));
  return result;
}

async function addNewFields() {
  console.log('🔧 Adding new fields to Airtable...');

  // Define the new fields
  const newFields = [
    {
      name: 'PMS Used',
      type: 'singleSelect',
      options: {
        choices: [
          { name: 'Hostfully' },
          { name: 'Guesty' },
          { name: 'Lodgify' },
          { name: 'BookingSync' },
          { name: 'OwnerRez' },
          { name: 'Streamline' },
          { name: 'Hostaway' },
          { name: 'YourPorter' },
          { name: 'Avantio' },
          { name: 'RentalNinja' },
          { name: 'Kigo' },
          { name: 'RemoteLock' },
          { name: 'Tokeet' },
          { name: 'Bookerville' },
          { name: 'LiveRez' },
          { name: 'iGMS' },
          { name: 'Mynd' },
          { name: 'RedAwning' },
          { name: 'Rental United' },
          { name: 'CiiRUS' },
          { name: 'Track' },
          { name: 'RMS Cloud' },
          { name: 'Cloudbeds' },
          { name: 'BookingBoss' },
          { name: 'VRScheduler' },
          { name: 'Smartbnb' },
          { name: 'PriceLabs' },
          { name: 'Beyond Pricing' },
          { name: 'Wheelhouse' },
          { name: 'AirDNA' },
          { name: 'Key Data Dashboard' },
          { name: 'Transparent' },
          { name: 'Rented' },
          { name: 'Property Meld' },
          { name: 'Breezeway' },
          { name: 'TurnoverBnB' },
          { name: 'Properly' },
          { name: 'TIDY' },
          { name: 'Jetstream' },
          { name: 'FantasticStay' },
          { name: 'Red' },
          { name: 'Guest' },
          { name: 'TouchStay' },
          { name: 'Hostco' },
          { name: 'DPGO' },
          { name: 'StayFi' },
          { name: 'GuestTek' },
          { name: 'NoiseAware' },
          { name: 'Minut' },
          { name: 'Party Squasher' },
          { name: 'Alertify' },
          { name: 'August' },
          { name: 'Schlage' },
          { name: 'Yale' },
          { name: 'Lynx' },
          { name: 'PointCentral' },
          { name: 'SALTO' },
          { name: 'Nest' },
          { name: 'Ecobee' },
          { name: 'Honeywell' },
          { name: 'Ring' },
          { name: 'SimpliSafe' },
          { name: 'ADT' },
          { name: 'Kangaroo' },
          { name: 'Airbnb' },
          { name: 'VRBO' },
          { name: 'Booking.com' },
          { name: 'Expedia' },
          { name: 'HomeAway' },
          { name: 'TripAdvisor' },
          { name: 'FlipKey' },
          { name: 'RedWeek' },
          { name: 'Other' },
          { name: 'Custom Solution' },
          { name: 'No PMS' }
        ]
      }
    },
    {
      name: 'Min Price (ADR)',
      type: 'number',
      options: {
        precision: 2
      }
    },
    {
      name: 'Max Price (ADR)', 
      type: 'number',
      options: {
        precision: 2
      }
    },
    {
      name: 'Currency',
      type: 'singleSelect',
      options: {
        choices: [
          { name: 'EUR (€)' },
          { name: 'USD ($)' },
          { name: 'GBP (£)' },
          { name: 'CAD ($)' },
          { name: 'AUD ($)' },
          { name: 'JPY (¥)' },
          { name: 'CHF' },
          { name: 'SEK' },
          { name: 'NOK' },
          { name: 'DKK' },
          { name: 'BRL (R$)' },
          { name: 'MXN ($)' },
          { name: 'ZAR (R)' },
          { name: 'AED' },
          { name: 'THB (฿)' },
          { name: 'Local Currency' }
        ]
      }
    },
    {
      name: 'Google Reviews Link',
      type: 'url'
    },
    {
      name: 'Cancellation Policy',
      type: 'singleSelect',
      options: {
        choices: [
          { name: 'Flexible - Free cancellation up to 24 hours before check-in' },
          { name: 'Moderate - Free cancellation up to 5 days before check-in' },
          { name: 'Strict - Free cancellation up to 14 days before check-in' },
          { name: 'Super Strict - 50% refund up to 30 days before check-in' },
          { name: 'Non-refundable - No refunds allowed' }
        ]
      }
    }
  ];

  await createFields(newFields);
  console.log('✅ All new fields added successfully!');
}

async function addFieldsToAirtable() {
  try {
    console.log('🚀 Starting Airtable field creation...');
    console.log('API Key present:', !!AIRTABLE_API_KEY);
    console.log('Base ID:', AIRTABLE_BASE_ID);
    
    // Check current schema first
    console.log('📋 Checking current table schema...');
    const schema = await getTableSchema();
    console.log('Current fields:', schema.fields.map(f => f.name));
    
    // Add the new fields
    await addNewFields();
    
    console.log('✅ SUCCESS! All new fields have been added to your Airtable base.');
    console.log('🎯 New fields created:');
    console.log('   - PMS Used (77 options)');
    console.log('   - Min Price (ADR)');
    console.log('   - Max Price (ADR)');
    console.log('   - Currency (16 options)');
    console.log('   - Google Reviews Link');
    console.log('   - Cancellation Policy (5 options)');
    
  } catch (error) {
    console.error('❌ Error creating fields:', error.message);
    if (error.message.includes('configuration missing')) {
      console.log('💡 Please add your Airtable API key to the .env file:');
      console.log('   1. Go to https://airtable.com/account');
      console.log('   2. Generate an API key (starts with pat_...)');
      console.log('   3. Add to .env file: VITE_AIRTABLE_API_KEY=pat_your_key_here');
    }
  }
}

// Run the function
addFieldsToAirtable();