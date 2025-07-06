# Appwrite CMS Setup for BookDirectStays

This guide will help you set up Appwrite as your CMS for the BookDirectStays project.

## 1. Create Appwrite Project

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Sign up or log in to your account
3. Create a new project called "BookDirectStays"
4. Note down your **Project ID** (you'll need this for environment variables)

## 2. Create Database

1. In your Appwrite project, go to **Databases**
2. Create a new database with ID: `bookdirectstays`
3. Set permissions to allow read/write access

## 3. Create Collections

### Submissions Collection
- **Collection ID**: `submissions`
- **Permissions**: Read/Write for all users (for submissions)

**Attributes:**
- `name` (String, required)
- `website` (String, required, URL)
- `listingCount` (Integer, required)
- `countries` (String array, required)
- `citiesRegions` (String array, required)
- `logo` (String, required, URL)
- `highlightImage` (String, required, URL)
- `submittedByEmail` (String, required, email)
- `oneLineDescription` (String, required)
- `whyBookWithYou` (String, required)
- `typesOfStays` (String array, optional)
- `idealFor` (String array, optional)
- `isPetFriendly` (Boolean, optional)
- `perksAmenities` (String array, optional)
- `isEcoConscious` (Boolean, optional)
- `isRemoteWorkFriendly` (Boolean, optional)
- `vibeAesthetic` (String array, optional)
- `instagram` (String, optional, URL)
- `facebook` (String, optional, URL)
- `linkedin` (String, optional, URL)
- `tiktok` (String, optional, URL)
- `youtubeVideoTour` (String, optional, URL)
- `listingType` (String, required, enum: "Free", "Featured ($49.99)")
- `status` (String, required, enum: "pending", "approved", "rejected")
- `createdAt` (String, required)

### Listings Collection
- **Collection ID**: `listings`
- **Permissions**: Read for all users, Write for admin only

**Attributes:**
- `name` (String, required)
- `description` (String, required)
- `website` (String, required, URL)
- `logo` (String, required, URL)
- `image` (String, required, URL)
- `featured` (Boolean, required)
- `countries` (String array, required)
- `whyBookWith` (String, optional)
- `socials` (String, optional, JSON)
- `createdAt` (String, required)

### Countries Collection
- **Collection ID**: `countries`
- **Permissions**: Read for all users, Write for admin only

**Attributes:**
- `name` (String, required)
- `slug` (String, required, unique)
- `code` (String, required, 2 characters)
- `listingCount` (Integer, required)

### Subscriptions Collection
- **Collection ID**: `subscriptions`
- **Permissions**: Read/Write for all users

**Attributes:**
- `email` (String, required, email, unique)
- `createdAt` (String, required)

### FAQs Collection
- **Collection ID**: `faqs`
- **Permissions**: Read for all users, Write for admin only

**Attributes:**
- `question` (String, required)
- `answer` (String, required)
- `category` (String, required, enum: "traveler", "host")
- `order` (Integer, required)

### Testimonials Collection
- **Collection ID**: `testimonials`
- **Permissions**: Read for all users, Write for admin only

**Attributes:**
- `name` (String, required)
- `role` (String, required)
- `company` (String, required)
- `content` (String, required)
- `rating` (Integer, required, 1-5)
- `image` (String, optional, URL)

## 4. Create Storage Buckets

### Logos Bucket
- **Bucket ID**: `logos`
- **Permissions**: Read for all users, Write for all users
- **File size limit**: 5MB
- **Allowed file extensions**: jpg, jpeg, png, gif, svg

### Images Bucket
- **Bucket ID**: `images`
- **Permissions**: Read for all users, Write for all users
- **File size limit**: 10MB
- **Allowed file extensions**: jpg, jpeg, png, gif, webp

## 5. Environment Variables

Add these environment variables to your `.env` file and Vercel:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
```

## 6. Sample Data

### Countries Data
You can add these countries to your countries collection:

```json
[
  {
    "name": "United States",
    "slug": "usa",
    "code": "US",
    "listingCount": 0
  },
  {
    "name": "Spain",
    "slug": "spain",
    "code": "ES",
    "listingCount": 0
  },
  {
    "name": "United Kingdom",
    "slug": "uk",
    "code": "GB",
    "listingCount": 0
  },
  {
    "name": "Germany",
    "slug": "germany",
    "code": "DE",
    "listingCount": 0
  },
  {
    "name": "France",
    "slug": "france",
    "code": "FR",
    "listingCount": 0
  },
  {
    "name": "Australia",
    "slug": "australia",
    "code": "AU",
    "listingCount": 0
  },
  {
    "name": "Canada",
    "slug": "canada",
    "code": "CA",
    "listingCount": 0
  },
  {
    "name": "Italy",
    "slug": "italy",
    "code": "IT",
    "listingCount": 0
  },
  {
    "name": "Portugal",
    "slug": "portugal",
    "code": "PT",
    "listingCount": 0
  },
  {
    "name": "Thailand",
    "slug": "thailand",
    "code": "TH",
    "listingCount": 0
  },
  {
    "name": "Greece",
    "slug": "greece",
    "code": "GR",
    "listingCount": 0
  }
]
```

### Sample FAQs
```json
[
  {
    "question": "How do I submit my property?",
    "answer": "You can submit your property by filling out our submission form. We'll review your submission and get back to you within 48 hours.",
    "category": "host",
    "order": 1
  },
  {
    "question": "What makes BookDirectStays different?",
    "answer": "We focus exclusively on properties that offer direct booking, helping you avoid booking fees and connect directly with property owners.",
    "category": "traveler",
    "order": 1
  }
]
```

## 7. Update Submission Form

The submission form will now use Appwrite instead of the placeholder. Users can:
- Upload logo and highlight images to Appwrite Storage
- Submit property details to the submissions collection
- Receive confirmation when submission is successful

## 8. Admin Panel (Future)

When you're ready to add admin functionality:
1. Create an admin user in Appwrite
2. Set up proper permissions for admin operations
3. Create admin routes for reviewing submissions
4. Add approval/rejection functionality

## 9. Testing

1. Start your development server
2. Go to the submit page
3. Fill out the form and submit
4. Check your Appwrite dashboard to see the submission
5. Verify that images are uploaded to storage buckets

## 10. Deployment

Make sure to add the environment variables to your Vercel project:
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add `NEXT_PUBLIC_APPWRITE_ENDPOINT` and `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- Redeploy your project

## Troubleshooting

- **CORS errors**: Make sure your Appwrite project allows your domain
- **Permission errors**: Check collection and bucket permissions
- **File upload issues**: Verify bucket settings and file size limits
- **Environment variables**: Ensure they're properly set in both local and production 