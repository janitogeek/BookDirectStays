# 🚀 Automatic Deployment Setup

Your BookDirectStays project is now configured for automatic deployment! Every time you push changes to the `client` branch, your site will automatically deploy to Vercel.

## 🔧 How It Works

1. **Push to `client` branch** → Triggers automatic deployment
2. **GitHub Actions builds** your project
3. **Deploys to Vercel** automatically
4. **Your site updates** in minutes

## 📋 Required Setup (One-time)

### Step 1: Get Vercel Credentials

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your BookDirectStays project
3. Go to **Settings** → **General**
4. Copy these values:
   - **Project ID**
   - **Team ID** (if using a team)

### Step 2: Get Vercel Token

1. In Vercel Dashboard, go to **Settings** → **Tokens**
2. Click **Create Token**
3. Give it a name like "GitHub Actions Deploy"
4. Copy the token

### Step 3: Add GitHub Secrets

1. Go to your GitHub repository: `https://github.com/janitogeek/BookDirectStays`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `VERCEL_TOKEN` | Your Vercel token from Step 2 |
| `VERCEL_ORG_ID` | Your Team ID (or leave empty if personal account) |
| `VERCEL_PROJECT_ID` | Your Project ID from Step 1 |

## 🎯 What Triggers Deployment

- ✅ **Push to `client` branch**
- ✅ **Changes in `client/` folder**
- ✅ **Changes to `vercel.json`**
- ✅ **Changes to workflow files**

## 🚫 What Doesn't Trigger Deployment

- ❌ Push to other branches
- ❌ Changes outside `client/` folder
- ❌ Documentation changes

## 🔍 Monitor Deployments

1. Go to **Actions** tab in your GitHub repository
2. See deployment status and logs
3. Get notified of success/failure

## 🚨 Troubleshooting

### Deployment Fails?
- Check **Actions** tab for error logs
- Verify Vercel secrets are correct
- Ensure `client/package.json` has correct build script

### Site Not Updating?
- Wait 2-3 minutes for deployment to complete
- Check Vercel dashboard for deployment status
- Verify you're on the `client` branch

## 🎉 You're All Set!

Now every time you run:
```bash
git add .
git commit -m "Your changes"
git push origin client
```

Your site will automatically deploy! 🚀
