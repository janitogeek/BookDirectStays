import type { VercelRequest, VercelResponse } from '@vercel/node';

const clientId = process.env.GOOGLE_CLIENT_ID;
const redirectUri = process.env.GOOGLE_REDIRECT_URI || '';
const scope = encodeURIComponent('profile email');
const responseType = 'code';
const prompt = 'select_account';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=${responseType}` +
    `&scope=${scope}` +
    `&prompt=${prompt}`;
  res.redirect(url);
} 