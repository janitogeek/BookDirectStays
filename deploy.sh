#!/bin/bash

# 🚀 BookDirectStays Deployment Script
# This script is now OPTIONAL - GitHub Actions handles automatic deployment!

echo "🚀 BookDirectStays Deployment"
echo "=============================="

# Check if we're on the client branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "client" ]; then
    echo "⚠️  Warning: You're on branch '$CURRENT_BRANCH', but automatic deployment works from 'client' branch"
    echo "💡 To trigger automatic deployment, switch to client branch:"
    echo "   git checkout client"
    echo ""
fi

echo "📋 Current Status:"
echo "   Branch: $CURRENT_BRANCH"
echo "   Remote: $(git remote get-url origin)"

echo ""
echo "🔄 Automatic Deployment is ENABLED!"
echo "   Every push to 'client' branch will automatically deploy to Vercel"
echo "   No need to run this script manually anymore!"

echo ""
echo "📝 To deploy automatically:"
echo "   1. git add ."
echo "   2. git commit -m 'Your changes'"
echo "   3. git push origin client"
echo "   🎉 That's it! GitHub Actions will handle the rest!"

echo ""
echo "🔍 Monitor deployments at:"
echo "   https://github.com/janitogeek/BookDirectStays/actions"

echo ""
echo "📚 Setup guide: AUTO_DEPLOY_SETUP.md" 