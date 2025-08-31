# Social Media Integration Guide

This guide explains how to set up and use the social media integration features for the Abadan Haly website.

## Features

### 1. SocialShowcase Component
- Displays the latest 3 posts from both Instagram and TikTok
- Autoplay for the first video in each platform
- Click-to-play for other videos
- Lightbox modal with sound toggle
- "Open post" links to original social media posts

### 2. Automatic Post Updates
- Script to automatically fetch and update the latest posts
- Configurable update frequency
- Fallback to mock data when APIs are unavailable

## Setup

### 1. Social Media Data Structure

The social media data is stored in `data/social.json`:

```json
{
  "instagram": {
    "handle": "@abadan_haly",
    "profileUrl": "https://www.instagram.com/abadan_haly/",
    "followers": 4020,
    "videos": [
      {
        "mp4": "/social/ig/reel-1.mp4",
        "poster": "/social/ig/reel-1.jpg",
        "title": "Reel 1",
        "permalink": "https://www.instagram.com/reel/DJ8Qdpvi7Aq/"
      }
    ]
  },
  "tiktok": {
    "handle": "@abadan_haly",
    "profileUrl": "https://www.tiktok.com/@abadan_haly",
    "followers": 14400,
    "videos": [
      {
        "mp4": "/social/tt/tiktok-1.mp4",
        "poster": "/social/tt/tiktok-1.jpg",
        "title": "TikTok 1",
        "permalink": "https://www.tiktok.com/@abadan_haly/video/7412158886985141522"
      }
    ]
  }
}
```

### 2. Video Files

Place your social media videos in the following structure:

```
public/social/
├── ig/
│   ├── reel-1.mp4
│   ├── reel-1.jpg
│   ├── reel-2.mp4
│   ├── reel-2.jpg
│   ├── reel-3.mp4
│   └── reel-3.jpg
└── tt/
    ├── tiktok-1.mp4
    ├── tiktok-1.jpg
    ├── tiktok-2.mp4
    ├── tiktok-2.jpg
    ├── tiktok-3.mp4
    └── tiktok-3.jpg
```

### 3. Manual Updates

To manually update the social posts:

```bash
npm run update:social
```

### 4. Automatic Updates

To set up automatic updates every 6 hours, add this to your crontab:

```bash
# Edit crontab
crontab -e

# Add this line (replace with your actual project path)
0 */6 * * * cd /path/to/project && npm run update:social
```

## API Integration

### Instagram API

To use real Instagram API instead of mock data:

1. Create a Facebook Developer account
2. Create an Instagram Basic Display app
3. Get your access token
4. Update the `fetchInstagramPosts()` function in `scripts/update-social-posts.mjs`

```javascript
async function fetchInstagramPosts() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const response = await fetch(
    `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${accessToken}`
  );
  const data = await response.json();
  
  return data.data
    .filter(post => post.media_type === 'VIDEO')
    .slice(0, 3)
    .map(post => ({
      mp4: post.media_url,
      poster: post.thumbnail_url,
      title: post.caption?.split('\n')[0] || 'Instagram Post',
      permalink: post.permalink
    }));
}
```

### TikTok API

To use real TikTok API:

1. Create a TikTok for Developers account
2. Create an app and get your access token
3. Update the `fetchTikTokPosts()` function

```javascript
async function fetchTikTokPosts() {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  const response = await fetch(
    `https://open.tiktokapis.com/v2/video/query/?fields=["id","title","cover_image_url","video_url","share_url"]`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  const data = await response.json();
  
  return data.data.videos
    .slice(0, 3)
    .map(video => ({
      mp4: video.video_url,
      poster: video.cover_image_url,
      title: video.title || 'TikTok Video',
      permalink: video.share_url
    }));
}
```

## Environment Variables

Create a `.env` file for API credentials:

```env
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
TIKTOK_ACCESS_TOKEN=your_tiktok_access_token
```

## Component Usage

The SocialShowcase component is automatically included in the Hero section:

```jsx
import SocialShowcase from './components/SocialShowcase';

// In your component
<SocialShowcase />
```

## Customization

### Styling

The component uses Tailwind CSS classes. You can customize the appearance by modifying the classes in `src/components/SocialShowcase.tsx`.

### Behavior

- **Autoplay**: Only the first video in each platform autoplays
- **Sound**: Videos are muted by default, users can toggle sound in the lightbox
- **Responsive**: Works on mobile and desktop
- **Accessibility**: Includes proper ARIA labels and keyboard navigation

### Data Source

The component reads from `data/social.json`. You can modify this file manually or use the update script.

## Troubleshooting

### Videos Not Loading

1. Check that video files exist in the correct paths
2. Verify the `mp4` and `poster` paths in `social.json`
3. Ensure video files are properly formatted (MP4, H.264 codec)

### API Errors

1. Verify your access tokens are valid
2. Check API rate limits
3. Ensure your app has the correct permissions

### Performance Issues

1. Optimize video file sizes (recommend < 10MB per video)
2. Use CDN for video hosting
3. Implement lazy loading for better performance

## Security Considerations

- Never commit API tokens to version control
- Use environment variables for sensitive data
- Implement proper rate limiting
- Validate all API responses

## Future Enhancements

- [ ] Add YouTube integration
- [ ] Implement video analytics
- [ ] Add social media feed widget
- [ ] Create admin panel for content management
- [ ] Add video compression and optimization
- [ ] Implement caching for better performance
