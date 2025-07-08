# Airtable Setup Guide for BookDirectStays

This guide will help you connect your Airtable to your website for form submissions.

## 🎯 Step 1: Get Your Airtable API Key

1. **Go to**: https://airtable.com/account
2. **Click "Generate API key"**
3. **Copy the API key** (starts with `pat_...`)
4. **Save it securely** - you'll need it for the next steps

## 🎯 Step 2: Get Your Base ID

1. **Go to your Airtable base** (the one with your Submissions table)
2. **Click "Help" → "API Documentation"**
3. **Copy the Base ID** (starts with `app...`)
4. **Note your table name** (e.g., "Submissions")

## 🎯 Step 3: Set Up Environment Variables

### For Local Development:
1. **Copy** `client/env.example` to `client/.env.local`
2. **Edit** `client/.env.local` and add your values:
   ```bash
   VITE_AIRTABLE_API_KEY=pat_your_api_key_here
   VITE_AIRTABLE_BASE_ID=app_your_base_id_here
   ```

### For Vercel Deployment:
1. **Go to** your Vercel dashboard
2. **Select** your BookDirectStays project
3. **Go to** Settings → Environment Variables
4. **Add these variables**:
   - `VITE_AIRTABLE_API_KEY` = `pat_your_api_key_here`
   - `VITE_AIRTABLE_BASE_ID` = `app_your_base_id_here`

## 🎯 Step 4: Create Your Airtable Table

Your table should have these fields (create them in Airtable):

### Required Fields:
- **Brand Name** (Single line text)
- **Direct Booking Website** (URL)
- **Number of Listings** (Number)
- **Email** (Email)
- **One-line Description** (Single line text)
- **Why Book With You** (Long text)

### Optional Fields:
- **Plan** (Single select: "Free", "Featured ($49.99)")
- **Countries** (Long text - will store JSON)
- **Cities / Regions** (Long text - will store JSON)
- **Types of Stays** (Long text - will store JSON)
- **Ideal For** (Long text - will store JSON)
- **Is Pet Friendly** (Checkbox)
- **Perks / Amenities** (Long text - will store JSON)
- **Is Eco Conscious** (Checkbox)
- **Is Remote Work Friendly** (Checkbox)
- **Vibe / Aesthetic** (Long text - will store JSON)
- **Instagram** (URL)
- **Facebook** (URL)
- **LinkedIn** (URL)
- **TikTok** (URL)
- **YouTube / Video Tour** (URL)
- **Logo** (Attachment)
- **Highlight Image** (Attachment)

## 🎯 Step 5: Test Your Setup

1. **Start your development server**: `npm run dev`
2. **Go to**: http://localhost:5173/submit
3. **Fill out the form** and submit
4. **Check your Airtable** - you should see the new record!

## 🎯 Step 6: Deploy to Production

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add Airtable integration"
   git push origin client
   ```

2. **Vercel will automatically deploy** with your environment variables

## 🔧 Troubleshooting

### "Airtable configuration missing" error:
- Check that your environment variables are set correctly
- Make sure the variable names start with `VITE_`
- Restart your development server after adding environment variables

### "API error" when submitting:
- Verify your API key is correct
- Check that your Base ID is correct
- Ensure your table name matches exactly (case-sensitive)

### Form submits but no data in Airtable:
- Check the browser console for errors
- Verify your table field names match exactly
- Make sure your API key has write permissions

## 🎉 Success!

Once everything is working, your form submissions will automatically appear in your Airtable base, and you can manage them through Airtable's beautiful interface!

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Airtable API documentation
3. Make sure all environment variables are set correctly 