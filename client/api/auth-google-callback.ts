import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI || '';
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
const adminEmail = 'jansahagun@gmail.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).send('Missing code');
  }

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return res.status(401).send('Failed to get access token');
  }

  // Get user info
  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const user = await userRes.json();
  if (user.email !== adminEmail) {
    return res.status(403).send('Not authorized');
  }

  // Generate JWT
  const token = jwt.sign({ email: user.email, role: 'admin' }, jwtSecret, { expiresIn: '24h' });

  // Redirect to admin page with token
  res.redirect(`/admin?token=${token}`);
} 