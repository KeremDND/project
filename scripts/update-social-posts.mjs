#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to social.json
const socialJsonPath = path.join(__dirname, '../data/social.json');

// Function to fetch latest Instagram posts
async function fetchInstagramPosts() {
  // Note: Instagram API requires authentication and has rate limits
  // For now, we'll use a mock implementation
  // In production, you would use Instagram Basic Display API or Graph API
  
  console.log('Fetching latest Instagram posts...');
  
  // Mock data - replace with actual API call
  const mockInstagramPosts = [
    {
      mp4: "/social/ig/reel-1.mp4",
      poster: "/social/ig/reel-1.jpg",
      title: "Latest Instagram Reel 1",
      permalink: "https://www.instagram.com/reel/DJ8Qdpvi7Aq/?igsh=cWNjNXE0MDN3bGVr"
    },
    {
      mp4: "/social/ig/reel-2.mp4",
      poster: "/social/ig/reel-2.jpg",
      title: "Latest Instagram Reel 2",
      permalink: "https://www.instagram.com/reel/DN0LFhL2IUc/?igsh=cjZqcHBpaGwyNmF0"
    },
    {
      mp4: "/social/ig/reel-3.mp4",
      poster: "/social/ig/reel-3.jpg",
      title: "Latest Instagram Reel 3",
      permalink: "https://www.instagram.com/reel/DN9vyIiCCHE/?igsh=Zmt5NDd2NnMzZG5z"
    }
  ];
  
  return mockInstagramPosts;
}

// Function to fetch latest TikTok posts
async function fetchTikTokPosts() {
  // Note: TikTok API requires authentication and has rate limits
  // For now, we'll use a mock implementation
  // In production, you would use TikTok for Developers API
  
  console.log('Fetching latest TikTok posts...');
  
  // Mock data - replace with actual API call
  const mockTikTokPosts = [
    {
      mp4: "/social/tt/tiktok-1.mp4",
      poster: "/social/tt/tiktok-1.jpg",
      title: "Latest TikTok Video 1",
      permalink: "https://www.tiktok.com/@abadan_haly/video/7412158886985141522?is_from_webapp=1&sender_device=pc&web_id=7544405352386168342"
    },
    {
      mp4: "/social/tt/tiktok-2.mp4",
      poster: "/social/tt/tiktok-2.jpg",
      title: "Latest TikTok Video 2",
      permalink: "https://www.tiktok.com/@abadan_haly/video/7362584957337832722?is_from_webapp=1&sender_device=pc&web_id=7544405352386168342"
    },
    {
      mp4: "/social/tt/tiktok-3.mp4",
      poster: "/social/tt/tiktok-3.jpg",
      title: "Latest TikTok Video 3",
      permalink: "https://www.tiktok.com/@abadan_haly/video/7345535164015037704?is_from_webapp=1&sender_device=pc&web_id=7544405352386168342"
    }
  ];
  
  return mockTikTokPosts;
}

// Function to update social.json
async function updateSocialPosts() {
  try {
    console.log('Starting social posts update...');
    
    // Read current social.json
    const currentSocialData = JSON.parse(fs.readFileSync(socialJsonPath, 'utf8'));
    
    // Fetch latest posts
    const [instagramPosts, tiktokPosts] = await Promise.all([
      fetchInstagramPosts(),
      fetchTikTokPosts()
    ]);
    
    // Update the data structure
    const updatedSocialData = {
      instagram: {
        ...currentSocialData.instagram,
        videos: instagramPosts
      },
      tiktok: {
        ...currentSocialData.tiktok,
        videos: tiktokPosts
      }
    };
    
    // Write updated data back to file
    fs.writeFileSync(socialJsonPath, JSON.stringify(updatedSocialData, null, 2));
    
    console.log('✅ Social posts updated successfully!');
    console.log(`📸 Instagram: ${instagramPosts.length} posts updated`);
    console.log(`🎵 TikTok: ${tiktokPosts.length} posts updated`);
    
  } catch (error) {
    console.error('❌ Error updating social posts:', error);
    process.exit(1);
  }
}

// Function to set up automatic updates
function setupAutomaticUpdates() {
  console.log('Setting up automatic social posts updates...');
  
  // Add a cron job or scheduled task
  // For development, you can use node-cron or similar
  console.log('📅 To set up automatic updates, add this to your crontab:');
  console.log('0 */6 * * * cd /path/to/project && node scripts/update-social-posts.mjs');
  console.log('This will update posts every 6 hours');
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--setup')) {
    setupAutomaticUpdates();
  } else {
    await updateSocialPosts();
  }
}

// Run the script
main().catch(console.error);
