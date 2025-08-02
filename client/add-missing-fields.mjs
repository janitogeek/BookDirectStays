// Script to add only missing fields to Airtable
import { config } from 'dotenv';

// Load environment variables
config();

const AIRTABLE_API_KEY = process.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.VITE_AIRTABLE_BASE_ID || 'app0tFfsjLbI1qXq0';
const AIRTABLE_TABLE_NAME = 'Directory Submissions';
const AIRTABLE_META_URL = `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`;

async function getTableSchema() {
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

async function createFields(fields, tableId) {
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

async function addMissingFields() {
  try {
    console.log('🚀 Starting smart field creation...');
    
    // Get current schema
    const schema = await getTableSchema();
    const existingFields = schema.fields.map(f => f.name);
    console.log('📋 Found', existingFields.length, 'existing fields');
    
    // Define all desired fields
    const desiredFields = [
      {
        name: 'PMS Used',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'Hostfully' }, { name: 'Guesty' }, { name: 'Lodgify' }, { name: 'BookingSync' },
            { name: 'OwnerRez' }, { name: 'Streamline' }, { name: 'Hostaway' }, { name: 'YourPorter' },
            { name: 'Avantio' }, { name: 'RentalNinja' }, { name: 'Kigo' }, { name: 'RemoteLock' },
            { name: 'Tokeet' }, { name: 'Bookerville' }, { name: 'LiveRez' }, { name: 'iGMS' },
            { name: 'Mynd' }, { name: 'RedAwning' }, { name: 'Rental United' }, { name: 'CiiRUS' },
            { name: 'Track' }, { name: 'RMS Cloud' }, { name: 'Cloudbeds' }, { name: 'BookingBoss' },
            { name: 'VRScheduler' }, { name: 'Smartbnb' }, { name: 'PriceLabs' }, { name: 'Beyond Pricing' },
            { name: 'Wheelhouse' }, { name: 'AirDNA' }, { name: 'Key Data Dashboard' }, { name: 'Transparent' },
            { name: 'Rented' }, { name: 'Property Meld' }, { name: 'Breezeway' }, { name: 'TurnoverBnB' },
            { name: 'Properly' }, { name: 'TIDY' }, { name: 'Jetstream' }, { name: 'FantasticStay' },
            { name: 'Red' }, { name: 'Guest' }, { name: 'TouchStay' }, { name: 'Hostco' },
            { name: 'DPGO' }, { name: 'StayFi' }, { name: 'GuestTek' }, { name: 'NoiseAware' },
            { name: 'Minut' }, { name: 'Party Squasher' }, { name: 'Alertify' }, { name: 'August' },
            { name: 'Schlage' }, { name: 'Yale' }, { name: 'Lynx' }, { name: 'PointCentral' },
            { name: 'SALTO' }, { name: 'Nest' }, { name: 'Ecobee' }, { name: 'Honeywell' },
            { name: 'Ring' }, { name: 'SimpliSafe' }, { name: 'ADT' }, { name: 'Kangaroo' },
            { name: 'Airbnb' }, { name: 'VRBO' }, { name: 'Booking.com' }, { name: 'Expedia' },
            { name: 'HomeAway' }, { name: 'TripAdvisor' }, { name: 'FlipKey' }, { name: 'RedWeek' },
            { name: 'Other' }, { name: 'Custom Solution' }, { name: 'No PMS' }
          ]
        }
      },
      {
        name: 'Min Price (ADR)',
        type: 'number',
        options: { precision: 2 }
      },
      {
        name: 'Max Price (ADR)', 
        type: 'number',
        options: { precision: 2 }
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

    // Filter out fields that already exist
    const missingFields = desiredFields.filter(field => {
      const exists = existingFields.includes(field.name);
      if (exists) {
        console.log(`⏭️  Skipping "${field.name}" - already exists`);
      }
      return !exists;
    });

    if (missingFields.length === 0) {
      console.log('✅ All fields already exist! No new fields to create.');
      return;
    }

    console.log(`🔧 Creating ${missingFields.length} missing fields...`);
    console.log('Fields to create:', missingFields.map(f => f.name));

    // Create missing fields one by one to better handle errors
    for (const field of missingFields) {
      try {
        console.log(`Creating: ${field.name}...`);
        await createFields([field], schema.id);
      } catch (error) {
        console.log(`❌ Failed to create "${field.name}":`, error.message);
      }
    }

    console.log('✅ Field creation process completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addMissingFields();