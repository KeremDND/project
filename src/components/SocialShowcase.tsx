import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, ExternalLink, X, Instagram, Play } from 'lucide-react';

interface Video {
  mp4: string;
  poster: string;
  title: string;
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

function formatFollowers(n: number) {
  if (!n) return "";
  return n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" : n >= 1_000 ? (n / 1_000).toFixed(1) + "K" : String(n);
}

function useAutoplayWhenVisible(enabled: boolean) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || !enabled) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(([e]) => {
      if (!v) return;
      if (e.isIntersecting && !reduce) { v.play().catch(() => {}); }
      else { v.pause(); }
    }, { rootMargin: "100px 0px" });
    io.observe(v);
    return () => io.disconnect();
  }, [enabled]);
  return ref;
}

function VideoCard({ item, autoplay = false, index }: { item: Video, autoplay?: boolean, index: number }) {
  const [playing, setPlaying] = useState<boolean>(false);
  const [showLightbox, setShowLightbox] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const vidRef = useAutoplayWhenVisible(autoplay);

  const handlePlay = () => setPlaying(true);
  const handlePause = () => setPlaying(false);
  const openLightbox = () => {
    setShowLightbox(true);
    setIsMuted(true);
  };
  const closeLightbox = () => setShowLightbox(false);
  const toggleMute = () => setIsMuted(!isMuted);
  const openPost = () => window.open(item.permalink, '_blank', 'noopener,noreferrer');

  return (
    <>
      <div className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                       <video
                 ref={vidRef}
                 className="w-full h-full object-cover"
                 muted
                 playsInline
                 loop
                 preload={autoplay ? "metadata" : "none"}
                 poster={item.poster}
                 onPlay={handlePlay}
                 onPause={handlePause}
                 onClick={openLightbox}
                 onError={(e) => {
                   console.log('Video failed to load, showing poster image');
                   const video = e.currentTarget;
                   video.style.display = 'none';
                   const poster = document.createElement('img');
                   poster.src = item.poster;
                   poster.className = 'w-full h-full object-cover';
                   poster.alt = item.title;
                   poster.onclick = () => openLightbox();
                   video.parentNode?.insertBefore(poster, video);
                 }}
                 {...(autoplay ? { src: item.mp4 } : {})}
                 aria-label={`${item.title} — Abadan Haly carpet showcase`}
               />
        
        {/* Play overlay for non-autoplay videos */}
        {!autoplay && !playing && (
          <button
            aria-label={`Play ${item.title}`}
            onClick={(e) => {
              e.stopPropagation();
              const v = (e.currentTarget.previousSibling as HTMLVideoElement);
              if (v && !v.src) v.src = item.mp4;
              v?.play().catch(() => {});
            }}
            className="absolute inset-0 grid place-items-center bg-black/20 hover:bg-black/10 transition-colors duration-200 group-hover:bg-black/30"
          >
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <Play className="w-5 h-5 text-gray-800 ml-0.5" />
            </div>
          </button>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Post link */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openPost();
            }}
            className="w-full px-3 py-2 rounded-lg text-xs font-medium bg-white/95 hover:bg-white text-gray-800 transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            View Post
          </button>
        </div>

        {/* Index badge */}
        <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-white/90 text-xs font-semibold flex items-center justify-center text-gray-800">
          {index + 1}
        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-sm w-full">
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="aspect-[9/16] rounded-xl overflow-hidden bg-black">
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
                <source src={item.mp4} type="video/mp4" />
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
                className="flex-1 bg-[#0F3B2F] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0F3B2F]/90 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PlatformSection({
  platform, data, icon, color
}: {
  platform: "instagram" | "tiktok";
  data: Platform;
  icon: React.ReactNode;
  color: string;
}) {
  const followerText = data.followers ? formatFollowers(data.followers) + " followers" : "";
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color }}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 capitalize">{platform}</h3>
            <p className="text-sm text-gray-500">{followerText}</p>
          </div>
        </div>
        <a 
          href={data.profileUrl} 
          target="_blank" 
          rel="noopener"
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors duration-200 hover:opacity-90"
          style={{ backgroundColor: color }}
        >
          Follow
        </a>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.videos.slice(0, 3).map((video, index) => (
          <VideoCard 
            key={video.mp4} 
            item={video} 
            autoplay={index === 0} 
            index={index}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          First video autoplays. Others play on click. Tap to view full screen.
        </p>
      </div>
    </div>
  );
}

export default function SocialShowcase() {
  const [socialData, setSocialData] = useState<SocialData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSocialData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data/social.json');
        const data = await response.json();
        setSocialData(data);
      } catch (error) {
        console.error('Error loading social data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSocialData();
  }, []);

  if (isLoading) {
    return (
      <section id="social" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#0F3B2F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading social content...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!socialData) {
    return (
      <section id="social" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">Unable to load social content</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="social" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Follow Our Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our latest carpet designs, room transformations, and behind-the-scenes content
          </p>
        </div>

        {/* Social Platforms */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <PlatformSection
            platform="instagram"
            data={socialData.instagram}
            icon={<Instagram className="w-5 h-5 text-white" />}
            color="#E1306C"
          />
          <PlatformSection
            platform="tiktok"
            data={socialData.tiktok}
            icon={
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            }
            color="#000000"
          />
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Stay updated with our latest designs and inspiration
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={socialData.instagram.profileUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-medium transition-colors duration-200 hover:opacity-90"
              style={{ backgroundColor: '#E1306C' }}
            >
              <Instagram className="w-4 h-4 mr-2" />
              Follow on Instagram
            </a>
            <a
              href={socialData.tiktok.profileUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-black text-white font-medium transition-colors duration-200 hover:opacity-90"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              Follow on TikTok
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
