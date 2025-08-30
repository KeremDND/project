#!/bin/bash

# Abadan Haly - Deployment Script
# This script builds and prepares the website for deployment

echo "🚀 Abadan Haly - Deployment Script"
echo "=================================="

# Build the production version
echo "📦 Building production version..."
npm run build

# Generate image sitemap with correct domain
echo "🗺️  Generating image sitemap..."
SITE_ORIGIN=https://abadanhaly.com npm run build:sitemap:images

# Copy optimized images and data to dist
echo "📁 Copying optimized assets..."
cp -r public/cdn dist/ 2>/dev/null || echo "CDN folder already exists"
cp -r public/data dist/ 2>/dev/null || echo "Data folder already exists"

# Check file sizes
echo "📊 Production build summary:"
echo "   - Main website: $(du -sh dist/index.html | cut -f1)"
echo "   - Assets: $(du -sh dist/assets | cut -f1)"
echo "   - Images: $(du -sh dist/cdn | cut -f1)"
echo "   - Total: $(du -sh dist | cut -f1)"

echo ""
echo "✅ Production build complete!"
echo ""
echo "🌐 Deployment options:"
echo "   1. Netlify:  netlify deploy --dir=dist --prod"
echo "   2. Vercel:   vercel --prod"
echo "   3. Manual:   Upload dist/ folder to your web server"
echo ""
echo "📁 Files ready in: dist/"
echo "🔗 Domain: abadanhaly.com"
echo ""
echo "📋 Next steps:"
echo "   1. Choose your hosting provider"
echo "   2. Upload dist/ folder contents"
echo "   3. Configure DNS for abadanhaly.com"
echo "   4. Set up SSL certificate"
echo "   5. Test the website"
echo ""
echo "📖 See DEPLOYMENT-GUIDE.md for detailed instructions"
