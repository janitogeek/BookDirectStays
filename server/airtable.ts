import Airtable from 'airtable';
import { log } from './vite';
import { InsertSubmission, InsertSubscription } from '@shared/schema';

let airtableBase: any = null;

/**
 * Initialize Airtable with API key and base ID
 */
export function initAirtable(apiKey: string, baseId: string) {
  try {
    Airtable.configure({ apiKey });
    airtableBase = Airtable.base(baseId);
    log('Airtable initialized successfully', 'airtable');
    return true;
  } catch (error) {
    log(`Failed to initialize Airtable: ${error}`, 'airtable');
    return false;
  }
}

/**
 * Check if Airtable is initialized
 */
export function isAirtableInitialized(): boolean {
  return !!airtableBase;
}

/**
 * Submit a new property listing to Airtable
 */
export async function submitPropertyToAirtable(submission: InsertSubmission & { status: string, createdAt: string }) {
  if (!airtableBase) {
    throw new Error('Airtable is not initialized');
  }

  try {
    const result = await airtableBase('Property Submissions').create({
      Name: submission.name,
      Website: submission.website,
      'Number of Listings': submission.listingCount,
      Countries: submission.countries,
      Description: submission.description,
      Logo: submission.logo,
      Email: submission.email,
      Facebook: submission.facebook || '',
      Instagram: submission.instagram || '',
      LinkedIn: submission.linkedin || '',
      'Listing Type': submission.listingType,
      Status: submission.status,
      'Created At': submission.createdAt
    });
    
    log(`Created new property submission in Airtable with ID: ${result.id}`, 'airtable');
    return result;
  } catch (error) {
    log(`Failed to submit property to Airtable: ${error}`, 'airtable');
    throw error;
  }
}

/**
 * Submit a new email subscription to Airtable
 */
export async function submitSubscriptionToAirtable(subscription: InsertSubscription & { createdAt: string }) {
  if (!airtableBase) {
    throw new Error('Airtable is not initialized');
  }

  try {
    const result = await airtableBase('Email Subscriptions').create({
      Email: subscription.email,
      'Created At': subscription.createdAt
    });
    
    log(`Created new email subscription in Airtable with ID: ${result.id}`, 'airtable');
    return result;
  } catch (error) {
    log(`Failed to submit subscription to Airtable: ${error}`, 'airtable');
    throw error;
  }
}

/**
 * Fetch all property listings from Airtable
 */
export async function fetchListingsFromAirtable() {
  if (!airtableBase) throw new Error('Airtable is not initialized');
  const tableName = process.env.AIRTABLE_TABLE_NAME || 'Property Submissions';
  const records = await airtableBase(tableName).select().all();
  return records.map(record => ({
    id: record.id,
    ...record.fields,
  }));
}