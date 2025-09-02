import React, { useState, useEffect } from 'react';
import { Instagram, ExternalLink } from 'lucide-react';

interface Post {
  poster: string;
  title: string;
  permalink: string;
}

interface SocialData {
  instagram: {
    handle: string;
    profileUrl: string;
    followers: number;
    videos: Post[];
  };
  tiktok: {
    handle: string;
    profileUrl: string;
    followers: number;
    videos: Post[];
  };
}

export default function SocialShowcase() {
  const [socialData, setSocialData] = useState<SocialData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = async () => {
    try {
      const response = await fetch('/data/social.json');
      const data = await response.json();
      
      // Transform videos to posts (remove mp4 property)
      const transformedData = {
        instagram: {
          ...data.instagram,
          videos: data.instagram.videos.map((video: any) => ({
            poster: video.poster,
            title: video.title,
            permalink: video.permalink
          }))
        },
        tiktok: {
          ...data.tiktok,
          videos: data.tiktok.videos.map((video: any) => ({
            poster: video.poster,
            title: video.title,
            permalink: video.permalink
          }))
        }
      };
      
      setSocialData(transformedData);
    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading social content...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!socialData) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            #Abadanhaly
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our latest carpet designs, room transformations, and behind-the-scenes content
          </p>
        </div>

        {/* Social Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Instagram Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{socialData.instagram.handle}</h3>
                  <p className="text-sm text-gray-600">{formatFollowers(socialData.instagram.followers)} followers</p>
                </div>
              </div>
              <a
                href={socialData.instagram.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1 transition-colors"
              >
                Follow
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {socialData.instagram.videos.map((post, index) => (
                <a
                  key={index}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <img
                      src={post.poster}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2004- carpet.jpg';
                      }}
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* TikTok Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{socialData.tiktok.handle}</h3>
                  <p className="text-sm text-gray-600">{formatFollowers(socialData.tiktok.followers)} followers</p>
                </div>
              </div>
              <a
                href={socialData.tiktok.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1 transition-colors"
              >
                Follow
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {socialData.tiktok.videos.map((post, index) => (
                <a
                  key={index}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <img
                      src={post.poster}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2004- carpet.jpg';
                      }}
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
