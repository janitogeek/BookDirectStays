// Script to add new fields to Airtable
// Run this once to create all the new fields

import { airtableService } from './src/lib/airtable.ts';

async function addFieldsToAirtable() {
  try {
    console.log('🚀 Starting Airtable field creation...');
    
    // Check current schema first
    console.log('📋 Checking current table schema...');
    const schema = await airtableService.getTableSchema();
    console.log('Current fields:', schema.fields.map(f => f.name));
    
    // Add the new fields
    await airtableService.addNewFields();
    
    console.log('✅ SUCCESS! All new fields have been added to your Airtable base.');
    console.log('🎯 New fields created:');
    console.log('   - PMS Used (77 options)');
    console.log('   - Min Price (ADR)');
    console.log('   - Max Price (ADR)');
    console.log('   - Currency (16 options)');
    console.log('   - Google Reviews Link');
    console.log('   - Cancellation Policy (5 options)');
    
  } catch (error) {
    console.error('❌ Error creating fields:', error);
    console.log('💡 Make sure your API key has schema modification permissions.');
  }
}

// Run the function
addFieldsToAirtable();