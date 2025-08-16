#!/usr/bin/env node

/**
 * Test script for the Status Monitor API
 * Run with: node test-status-monitor.js
 */

const STATUS_MONITOR_SECRET = process.env.STATUS_MONITOR_SECRET || 'test-secret';
const API_URL = process.env.API_URL || 'http://localhost:3000';

async function testStatusMonitor() {
  console.log('🧪 Testing Status Monitor API...');
  console.log(`📍 API URL: ${API_URL}`);
  console.log(`🔑 Secret: ${STATUS_MONITOR_SECRET.substring(0, 8)}...`);
  
  try {
    const response = await fetch(`${API_URL}/api/status-monitor`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STATUS_MONITOR_SECRET}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`📡 Response Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Status Monitor Response:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.error('❌ Status Monitor Failed:');
      console.error(errorText);
    }
    
  } catch (error) {
    console.error('❌ Request Failed:', error.message);
  }
}

// Run the test
testStatusMonitor();
