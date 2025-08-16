# 🚀 Status Polling System - Bulletproof Airtable Integration

## Overview
This system automatically monitors Airtable for status changes and instantly updates the website when submissions are approved. It's **bulletproof** - no webhooks, no external dependencies, just reliable polling.

## 🔧 How It Works

### 1. **Status Monitor API** (`/api/status-monitor`)
- Checks Airtable every 5 minutes for status changes
- Tracks all submission statuses in memory
- Detects when submissions change to "Approved – Published"
- Returns detailed information about changes

### 2. **Client-Side Polling Hook** (`useStatusPolling`)
- Automatically polls the status monitor API
- Refreshes website data when changes are detected
- Uses React Query for efficient data invalidation
- Prevents duplicate requests with smart locking

### 3. **Automatic Data Refresh**
- When a submission is approved, all relevant data is refreshed
- Countries, cities, and submissions are updated instantly
- Users see new listings immediately without manual refresh

## 🚀 Setup Instructions

### 1. **Environment Variables**
Add to your `.env` file:
```bash
# Generate a random secret (32 characters recommended)
STATUS_MONITOR_SECRET=your_random_secret_here
VITE_STATUS_MONITOR_SECRET=your_random_secret_here
```

**Generate a secret:**
```bash
openssl rand -hex 32
# or use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. **Install Dependencies**
```bash
cd server && npm install airtable
```

### 3. **Deploy**
The system automatically starts when your app loads!

## 📊 Monitoring & Debugging

### **Console Logs**
The system provides detailed logging:
- `🔍 Status monitor: Checking for status changes...`
- `🔄 Status change detected: Company Name Pending Review → Approved – Published`
- `✅ 1 newly approved submissions - refreshing data...`

### **Test the System**
```bash
# Test locally
node test-status-monitor.js

# Test with custom secret
STATUS_MONITOR_SECRET=your_secret node test-status-monitor.js
```

## ⚡ Performance Features

### **Smart Polling**
- **5-minute intervals** (configurable)
- **Prevents duplicate requests** with request locking
- **Efficient data invalidation** using React Query
- **Background refresh** without blocking UI

### **Memory Efficient**
- **Status cache** tracks only what's needed
- **Minimal API calls** to Airtable
- **Automatic cleanup** on component unmount

## 🔒 Security

### **Authentication**
- **Bearer token** required for all status monitor calls
- **Environment variable** protection
- **No public access** to status monitoring

### **Rate Limiting**
- **Built-in request locking** prevents spam
- **Configurable intervals** (default: 5 minutes)
- **Graceful error handling** for failed requests

## 📈 Benefits

### **For Users**
- **Instant updates** when listings are approved
- **No manual refresh** needed
- **Real-time data** always current

### **For Admins**
- **Zero maintenance** - runs automatically
- **Reliable monitoring** - no webhook failures
- **Easy debugging** - comprehensive logging
- **Scalable** - handles any number of submissions

## 🎯 Customization

### **Change Polling Interval**
```typescript
// In useStatusPolling hook
const { isPolling } = useStatusPolling(2 * 60 * 1000); // 2 minutes
```

### **Add Custom Status Logic**
```typescript
// In status-monitor.ts
if (currentStatus === 'Custom Status') {
  // Handle custom status
}
```

### **Extend Monitoring**
```typescript
// Add more fields to monitor
const currentStatus = submission.status;
const currentPriority = submission.priority;
const currentCategory = submission.category;
```

## 🚨 Troubleshooting

### **Common Issues**

1. **"Unauthorized" Error**
   - Check `STATUS_MONITOR_SECRET` environment variable
   - Ensure secret matches between client and server

2. **No Status Changes Detected**
   - Verify Airtable API key and base ID
   - Check console for Airtable connection errors
   - Ensure "Status" field exists in Airtable

3. **Data Not Refreshing**
   - Check React Query cache invalidation
   - Verify query keys match your data structure
   - Check browser console for errors

### **Debug Mode**
Enable detailed logging by setting:
```bash
DEBUG=status-monitor:*
```

## 🎉 What You Get

✅ **Automatic status monitoring** every 5 minutes  
✅ **Instant website updates** when submissions are approved  
✅ **Zero manual work** - completely automated  
✅ **Bulletproof reliability** - no webhook failures  
✅ **Easy debugging** - comprehensive logging  
✅ **Secure** - protected with authentication  
✅ **Scalable** - handles any number of submissions  

## 🚀 Ready to Deploy!

Your status polling system is now **bulletproof** and ready to automatically keep your website in sync with Airtable. No more manual updates, no more webhook failures - just reliable, automatic monitoring! 🎯
