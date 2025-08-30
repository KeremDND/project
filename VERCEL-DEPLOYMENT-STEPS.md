# Vercel Deployment - Web Interface Guide

## 🚀 **Deploy to Vercel via Web Dashboard**

Since the CLI is having Git configuration issues, let's use Vercel's web interface for deployment.

### **Step 1: Prepare Your Project**

Your project is already built and ready:
- ✅ Production build in `dist/` folder
- ✅ All optimized images included
- ✅ SEO files generated
- ✅ Vercel configuration ready

### **Step 2: Deploy via Vercel Dashboard**

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in** with your GitHub account (keremjumalyyevv@gmail.com)
3. **Click "New Project"**
4. **Import your GitHub repository** (if you have one) OR use "Upload" option

### **Step 3: Upload Method (Recommended)**

1. **Click "Upload"** instead of importing from Git
2. **Drag and drop** the entire `dist/` folder from your project
3. **Project name**: `abadan-haly`
4. **Framework Preset**: Select "Other" or "Static Site"
5. **Build Command**: Leave empty (already built)
6. **Output Directory**: Leave empty (files are in root)
7. **Click "Deploy"**

### **Step 4: Configure Domain**

After deployment:
1. **Go to your project dashboard**
2. **Click "Settings" → "Domains"**
3. **Add domain**: `abadanhaly.com`
4. **Follow DNS instructions** provided by Vercel

### **Step 5: DNS Configuration**

Add these DNS records to your domain registrar:

```
Type    Name    Value
A       @       76.76.19.19
CNAME   www     cname.vercel-dns.com
```

### **Alternative: GitHub Integration**

If you want to use Git deployment:

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/abadan-haly.git
   git push -u origin main
   ```

2. **In Vercel dashboard**:
   - Import from GitHub
   - Select your repository
   - Vercel will auto-detect Vite settings
   - Deploy automatically

## 📁 **Files to Upload**

When using the upload method, make sure these files are in your `dist/` folder:

```
dist/
├── index.html              # Main website
├── assets/                 # CSS, JS, fonts
├── cdn/Halylar/           # Optimized carpet images
│   ├── cream/             # 15 cream carpets
│   ├── grey/              # 23 grey carpets
│   ├── dark gery/         # 4 dark grey carpets
│   ├── green/             # 2 green carpets
│   └── red/               # 1 red carpet
├── data/carpets.json      # Product manifest
├── sitemap-images.xml     # Google image sitemap
└── robots.txt             # SEO directives
```

## 🎯 **Post-Deployment Checklist**

After successful deployment:

- [ ] Website loads at your Vercel URL
- [ ] All images display correctly
- [ ] Color filtering works
- [ ] Mobile responsive design
- [ ] Custom domain configured (abadanhaly.com)
- [ ] HTTPS certificate active
- [ ] Google Search Console setup
- [ ] Submit sitemap: `https://abadanhaly.com/sitemap-images.xml`

## 🆘 **Troubleshooting**

### If images don't load:
- Check that `cdn/` folder was uploaded
- Verify file paths in browser console

### If domain doesn't work:
- Wait 24-48 hours for DNS propagation
- Check DNS records are correct

### If build fails:
- Ensure all files are in the `dist/` folder
- Check for any missing dependencies

## 📞 **Support**

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Documentation**: [vercel.com/docs](https://vercel.com/docs)

---

## 🎉 **Ready to Deploy!**

Your Abadan Haly website is production-ready with:
- ✅ 50 optimized carpet images
- ✅ SEO-optimized structure
- ✅ Mobile-responsive design
- ✅ Performance optimizations
- ✅ Google sitemap integration

**Next step**: Upload the `dist/` folder to Vercel dashboard!
