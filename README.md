# BookDirectStays PocketBase Backend

This repository contains the PocketBase backend for the BookDirectStays website.

## What's Included

- **PocketBase binary** - The main database and API server
- **Database** - Pre-configured with the Submissions collection
- **Migrations** - Database schema and structure
- **Deployment configs** - Ready for Render.com deployment

## Deployment Status

🚀 **Live**: https://pocketbase-bookdirectstays.onrender.com/

## API Endpoints

- **Admin Panel**: https://pocketbase-bookdirectstays.onrender.com/_/
- **API Base**: https://pocketbase-bookdirectstays.onrender.com/api/
- **Collections**: https://pocketbase-bookdirectstays.onrender.com/api/collections/

## Collections

- **Submissions** - Form submissions from the website
  - Brand_name
  - Direct_Booking_Website
  - E_mail
  - Number_of_Listings
  - Phone_Number
  - and more...

## Local Development

To run locally:
```bash
./pocketbase serve --http=0.0.0.0:8080
```

Then access the admin panel at: `http://localhost:8080/_/`

## Environment Variables

The deployment is configured to use Render's automatic `PORT` environment variable.

## Next Steps

1. ✅ Deploy this to Render.com
2. ✅ Get your deployment URL: https://pocketbase-bookdirectstays.onrender.com
3. 🔄 Update your main website's PocketBase configuration to use this URL 