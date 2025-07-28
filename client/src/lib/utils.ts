import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values into a single string using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a country name to a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics/accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+/, '') // Remove leading hyphens
    .replace(/-+$/, ''); // Remove trailing hyphens
}

/**
 * Converts a country code to a flag emoji
 */
export function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Gets flag emoji for a country name
 */
export function getFlagByCountryName(countryName: string): string {
  const countryMap: { [key: string]: string } = {
    'United States': '🇺🇸',
    'Spain': '🇪🇸',
    'United Kingdom': '🇬🇧',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Australia': '🇦🇺',
    'Canada': '🇨🇦',
    'Italy': '🇮🇹',
    'Portugal': '🇵🇹',
    'Thailand': '🇹🇭',
    'Greece': '🇬🇷',
    'Mexico': '🇲🇽',
    'Brazil': '🇧🇷',
    'Japan': '🇯🇵',
    'South Korea': '🇰🇷',
    'Netherlands': '🇳🇱',
    'Switzerland': '🇨🇭',
    'Austria': '🇦🇹',
    'Belgium': '🇧🇪',
    'Croatia': '🇭🇷',
    'Czech Republic': '🇨🇿',
    'Denmark': '🇩🇰',
    'Finland': '🇫🇮',
    'Hungary': '🇭🇺',
    'Iceland': '🇮🇸',
    'Ireland': '🇮🇪',
    'Norway': '🇳🇴',
    'Poland': '🇵🇱',
    'Sweden': '🇸🇪',
    'Turkey': '🇹🇷',
    'Albania': '🇦🇱',
    'USA': '🇺🇸',
    'UK': '🇬🇧'
  };
  return countryMap[countryName] || '🌍';
}

/**
 * Format a date to a readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Format a number with commas for thousands
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate a URL-friendly slug from a brand name
 */
export function generateSlug(brandName: string): string {
  return brandName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start/end
}

/**
 * Check if a string is an Airtable record ID
 */
export function isAirtableId(str: string): boolean {
  return str.startsWith('rec') && str.length === 17;
}
