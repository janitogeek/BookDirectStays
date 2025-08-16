#!/usr/bin/env node

/**
 * Test script for the Vercel Cron Job endpoint
 * Run with: node test-cron-job.js
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function testCronJob() {
  console.log('🧪 Testing Vercel Cron Job endpoint...');
  console.log(`📍 API URL: ${API_URL}/api/cron/check-status`);
  
  try {
    const response = await fetch(`${API_URL}/api/cron/check-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`📡 Response Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Cron Job Response:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.success) {
        console.log('🎉 Cron job is working perfectly!');
        console.log(`📊 Found ${data.totalSubmissions} submissions`);
        console.log(`🔄 Status changes: ${data.statusChanges}`);
        console.log(`✅ Newly approved: ${data.newlyApproved}`);
        console.log(`❌ Newly rejected: ${data.newlyRejected}`);
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Cron Job Failed:');
      console.error(errorText);
    }
    
  } catch (error) {
    console.error('❌ Request Failed:', error.message);
    console.log('\n💡 Make sure your server is running and the endpoint exists');
  }
}

// Run the test
testCronJob();
