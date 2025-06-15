import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { config } from 'dotenv';

// Load environment variables
config();

const app = express();

// Get the base URL from environment or default to localhost
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};

const baseUrl = getBaseUrl();

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// Middleware
app.use(express.json());
app.use(cors({
  origin: baseUrl,
  credentials: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: `${baseUrl}/api/auth/google/callback`,
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if the email matches the allowed admin email
      const adminEmail = 'jansahagun@gmail.com';
      const userEmail = profile.emails?.[0]?.value;

      if (userEmail === adminEmail) {
        return done(null, profile);
      }
      
      return done(null, false, { message: 'Not authorized' });
    } catch (error) {
      return done(error as Error);
    }
  }
));

// Auth routes
app.get('/api/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account',
    accessType: 'offline'
  })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/admin/login',
    session: false 
  }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign(
      { 
        email: (req.user as any).emails[0].value,
        role: 'admin'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Redirect to admin page with token
    res.redirect(`/admin?token=${token}`);
  }
);

// Verify token endpoint
app.get('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Base URL: ${baseUrl}`);
}); 