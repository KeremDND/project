import React, { useState, useEffect } from 'react';
import { Instagram, Music, Play, Volume2, VolumeX, ExternalLink, X } from 'lucide-react';
import { formatFollowers, useAutoPlay } from '../utils/social';

interface Video {
  mp4: string;
  poster: string;
  permalink: string;
}

interface Platform {
  handle: string;
  profileUrl: string;
  followers: number;
  videos: Video[];
}

interface SocialData {
  instagram: Platform;
  tiktok: Platform;
}

export default function SocialShowcase() {
  const [socialData, setSocialData] = useState<SocialData | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ video: Video; platform: string } | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const autoPlayRef = useAutoPlay();

  useEffect(() => {
    const loadSocialData = async () => {
      try {
        const response = await fetch('/data/social.json');
        const data = await response.json();
        setSocialData(data);
      } catch (error) {
        console.error('Error loading social data:', error);
      }
    };

    loadSocialData();
  }, []);

  const openLightbox = (video: Video, platform: string) => {
    setSelectedVideo({ video, platform });
    setIsMuted(true);
  };

  const closeLightbox = () => {
    setSelectedVideo(null);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const openPost = () => {
    if (selectedVideo) {
      window.open(selectedVideo.video.permalink, '_blank', 'noopener,noreferrer');
    }
  };

  if (!socialData) {
    return null;
  }

  return (
    <>
      <section id="social" className="bg-white py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <header className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#0F3B2F] via-[#1F6F5B] to-[#38A38A] mb-4">
              #Abadanhaly
            </h2>
            <p className="text-neutral-600 text-lg">
              Follow our latest carpets in real homes.
            </p>
          </header>

          {/* Instagram Row */}
          <div className="mb-16">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left Header Block */}
              <div className="lg:w-1/3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <a 
                      href={socialData.instagram.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-gray-900 hover:text-[#0F3B2F] transition-colors"
                    >
                      {socialData.instagram.handle}
                    </a>
                    {socialData.instagram.followers > 0 && (
                      <p className="text-sm text-gray-600">
                        {formatFollowers(socialData.instagram.followers)} followers
                      </p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => window.open(socialData.instagram.profileUrl, '_blank', 'noopener,noreferrer')}
                  className="bg-[#0F3B2F] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0F3B2F]/90 transition-colors"
                >
                  Follow
                </button>
              </div>

              {/* Right Media Rail */}
              <div className="lg:w-2/3">
                <div 
                  ref={autoPlayRef}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory"
                >
                  {socialData.instagram.videos.map((video, index) => (
                    <div 
                      key={index}
                      className="aspect-[9/16] rounded-2xl overflow-hidden shadow-[0_1px_8px_rgba(0,0,0,.06)] hover:shadow-lg transition-shadow cursor-pointer snap-start"
                      onClick={() => openLightbox(video, 'Instagram')}
                    >
                      <video
                        muted
                        playsInline
                        loop
                        preload="metadata"
                        poster={video.poster}
                        className="w-full h-full object-cover"
                        aria-label={`Instagram reel — Abadan Haly carpet showcase ${index + 1}`}
                      >
                        <source src={video.mp4} type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                        <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Platform Description */}
            <p className="text-center text-gray-600 mt-6">
              Abadan Haly — Turkmenistan • new designs, store previews, and care tips.
            </p>
          </div>

          {/* TikTok Row */}
          <div>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left Header Block */}
              <div className="lg:w-1/3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <a 
                      href={socialData.tiktok.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-gray-900 hover:text-[#0F3B2F] transition-colors"
                    >
                      {socialData.tiktok.handle}
                    </a>
                    {socialData.tiktok.followers > 0 && (
                      <p className="text-sm text-gray-600">
                        {formatFollowers(socialData.tiktok.followers)} followers
                      </p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => window.open(socialData.tiktok.profileUrl, '_blank', 'noopener,noreferrer')}
                  className="bg-[#0F3B2F] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0F3B2F]/90 transition-colors"
                >
                  Follow
                </button>
              </div>

              {/* Right Media Rail */}
              <div className="lg:w-2/3">
                <div 
                  ref={autoPlayRef}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory"
                >
                  {socialData.tiktok.videos.map((video, index) => (
                    <div 
                      key={index}
                      className="aspect-[9/16] rounded-2xl overflow-hidden shadow-[0_1px_8px_rgba(0,0,0,.06)] hover:shadow-lg transition-shadow cursor-pointer snap-start"
                      onClick={() => openLightbox(video, 'TikTok')}
                    >
                      <video
                        muted
                        playsInline
                        loop
                        preload="metadata"
                        poster={video.poster}
                        className="w-full h-full object-cover"
                        aria-label={`TikTok video — Abadan Haly carpet showcase ${index + 1}`}
                      >
                        <source src={video.mp4} type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                        <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Platform Description */}
            <p className="text-center text-gray-600 mt-6">
              Abadan Haly — Turkmenistan • new designs, store previews, and care tips.
            </p>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-md w-full">
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="aspect-[9/16] rounded-2xl overflow-hidden bg-black">
              <video
                ref={(el) => {
                  if (el) {
                    el.muted = isMuted;
                    el.play().catch(() => {});
                  }
                }}
                playsInline
                loop
                className="w-full h-full object-cover"
              >
                <source src={selectedVideo.video.mp4} type="video/mp4" />
              </video>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              <button
                onClick={toggleMute}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={openPost}
                className="bg-[#0F3B2F] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0F3B2F]/90 transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
