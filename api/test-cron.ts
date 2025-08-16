import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    success: true,
    message: 'Cron test endpoint is working!',
    timestamp: new Date().toISOString(),
    note: 'If you see this, Vercel is properly deploying serverless functions from the root api directory'
  });
}
