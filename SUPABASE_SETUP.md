# Supabase CMS Setup for BookDirectStays

This guide will help you set up Supabase as your CMS for the BookDirectStays project.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Note down your project URL and anon key

## 2. Set Up Environment Variables

Create a `.env` file in the `client` directory with the following variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_API_key
```

Example:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. Set Up Storage

1. **Create Storage Bucket:**
   - Go to your Supabase dashboard
   - Click on "Storage" in the left sidebar
   - Click "Create a new bucket"
   - Name it `uploads`
   - Make it public (so images can be accessed)

2. **Set Storage Policies:**
   ```sql
   -- Allow public read access to uploaded files
   CREATE POLICY "Allow public read access to uploads" ON storage.objects
     FOR SELECT USING (bucket_id = 'uploads');

   -- Allow public uploads (for submissions)
   CREATE POLICY "Allow public uploads" ON storage.objects
     FOR INSERT WITH CHECK (bucket_id = 'uploads');

   -- Allow users to update their own uploads
   CREATE POLICY "Allow users to update own uploads" ON storage.objects
     FOR UPDATE USING (bucket_id = 'uploads');
   ```

## 4. Create Database Tables

Run the following SQL in your Supabase SQL editor:

```sql
-- Create submissions table (complete with all form fields)
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  
  -- Brand Info Section
  brand_name TEXT NOT NULL,
  direct_booking_website TEXT NOT NULL,
  number_of_listings INTEGER NOT NULL,
  countries TEXT[] NOT NULL,
  cities_regions JSONB NOT NULL, -- Array of objects with {name, geonameId}
  logo_url TEXT, -- Supabase Storage URL
  highlight_image_url TEXT, -- Supabase Storage URL
  submitted_by_email TEXT NOT NULL,
  
  -- Brand Story & Guest Value Section
  one_line_description TEXT NOT NULL,
  why_book_with_you TEXT NOT NULL,
  types_of_stays TEXT[], -- Array of strings
  ideal_for TEXT[], -- Array of strings
  is_pet_friendly BOOLEAN,
  perks_amenities TEXT[], -- Array of strings
  is_eco_conscious BOOLEAN,
  is_remote_work_friendly BOOLEAN,
  vibe_aesthetic TEXT[], -- Array of strings
  
  -- Social Media Section
  instagram TEXT,
  facebook TEXT,
  linkedin TEXT,
  tiktok TEXT,
  youtube_video_tour TEXT,
  
  -- Listing Type
  listing_type TEXT NOT NULL CHECK (listing_type IN ('Free', 'Featured ($49.99)')),
  
  -- System Fields
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TEXT NOT NULL
);

-- Create listings table
CREATE TABLE listings (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  website TEXT NOT NULL,
  logo TEXT NOT NULL,
  image TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  countries TEXT[] NOT NULL,
  why_book_with TEXT,
  socials JSONB DEFAULT '{}'
);

-- Create countries table
CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  code VARCHAR(2) NOT NULL,
  listing_count INTEGER NOT NULL DEFAULT 0
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

-- Create testimonials table
CREATE TABLE testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('host', 'guest')),
  content TEXT NOT NULL,
  avatar TEXT
);

-- Create FAQs table
CREATE TABLE faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('traveler', 'host')),
  "order" INTEGER NOT NULL
);
```

## 5. Set Up Row Level Security (RLS)

Enable RLS and create policies:

```sql
-- Enable RLS on all tables
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to listings
CREATE POLICY "Allow public read access to listings" ON listings
  FOR SELECT USING (true);

-- Allow public read access to countries
CREATE POLICY "Allow public read access to countries" ON countries
  FOR SELECT USING (true);

-- Allow public read access to testimonials
CREATE POLICY "Allow public read access to testimonials" ON testimonials
  FOR SELECT USING (true);

-- Allow public read access to FAQs
CREATE POLICY "Allow public read access to faqs" ON faqs
  FOR SELECT USING (true);

-- Allow public insert access to submissions
CREATE POLICY "Allow public insert access to submissions" ON submissions
  FOR INSERT WITH CHECK (true);

-- Allow public insert access to subscriptions
CREATE POLICY "Allow public insert access to subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read all submissions (for admin)
CREATE POLICY "Allow authenticated users to read submissions" ON submissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update submissions (for admin)
CREATE POLICY "Allow authenticated users to update submissions" ON submissions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert listings (for admin)
CREATE POLICY "Allow authenticated users to insert listings" ON listings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## 6. Test the Setup

1. Start your development server:
   ```bash
   cd client
   npm run dev
   ```

2. Go to the submit page and try submitting a new property
3. Check your Supabase dashboard to see if the submission was created
4. Go to the admin submissions page to approve/reject submissions

## 7. Flow Overview

1. **Submissions**: Users submit properties through the submit form → stored in `submissions` table
2. **Admin Review**: Admins review submissions in the admin panel
3. **Approval**: When approved, submissions are converted to listings in the `listings` table
4. **Frontend Display**: Approved listings appear on the home page and country pages

## 8. Next Steps

- Set up authentication for admin access
- Add image upload functionality to Supabase Storage
- Implement email notifications for submissions
- Add analytics and tracking
- Set up automated testing

## Troubleshooting

- Make sure your environment variables are correctly set
- Check the browser console for any errors
- Verify that your Supabase project has the correct tables and policies
- Ensure your RLS policies allow the necessary operations 