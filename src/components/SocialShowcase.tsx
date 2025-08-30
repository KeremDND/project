import React, { useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX, ExternalLink, X } from 'lucide-react';

const gradientText = "bg-clip-text text-transparent bg-[linear-gradient(90deg,#0F3B2F,#1F6F5B,#38A38A)]";

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
  return n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" : n >= 1_000 ? (n / 1_000).toFixed(1) + "k" : String(n);
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
    }, { rootMargin: "200px 0px" });
    io.observe(v);
    return () => io.disconnect();
  }, [enabled]);
  return ref;
}

function VideoCard({ item, autoplay = false }: { item: Video, autoplay?: boolean }) {
  const [playing, setPlaying] = useState<boolean>(false);
  const [showLightbox, setShowLightbox] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const vidRef = useAutoplayWhenVisible(autoplay);

  const handlePlay = () => {
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const openLightbox = () => {
    setShowLightbox(true);
    setIsMuted(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const openPost = () => {
    window.open(item.permalink, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-sm hover:shadow-md transition-shadow duration-180">
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
          {...(autoplay ? { src: item.mp4 } : {})}
          aria-label={`${item.title} — Abadan Haly carpet showcase`}
        />
        {!autoplay && !playing && (
          <button
            aria-label={`Play ${item.title}`}
            onClick={(e) => {
              e.stopPropagation();
              const v = (e.currentTarget.previousSibling as HTMLVideoElement);
              if (v && !v.src) v.src = item.mp4;
              v?.play().catch(() => {});
            }}
            className="absolute inset-0 grid place-items-center bg-black/20 hover:bg-black/10 transition-colors duration-180"
          >
            <span className="px-4 py-2 rounded-full bg-white text-sm font-medium shadow-sm">Play</span>
          </button>
        )}
        <div className="absolute bottom-2 left-2 flex gap-2">
          <a
            href={item.permalink}
            target="_blank" 
            rel="noopener"
            onClick={(e) => e.stopPropagation()}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/90 hover:bg-white transition-colors duration-180"
          >
            Open post
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
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

function PlatformRow({
  platform, icon, color, data
}: {
  platform: "instagram" | "tiktok";
  icon: React.ReactNode;
  color: string;
  data: Platform;
}) {
  const followerText = data.followers ? formatFollowers(data.followers) + " followers" : "";
  
  return (
    <section className="grid lg:grid-cols-12 gap-6 items-start">
      {/* Meta panel */}
      <aside className="lg:col-span-3 bg-white rounded-2xl border border-neutral-200 p-5 sticky top-4">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-sm uppercase tracking-wide text-neutral-500">{platform}</span>
        </div>
        <a 
          href={data.profileUrl} 
          target="_blank" 
          rel="noopener" 
          className="block text-lg font-semibold text-[#0F3B2F] hover:underline transition-colors duration-180"
        >
          {data.handle}
        </a>
        {followerText && <p className="text-sm text-neutral-500 mt-1">{followerText}</p>}
        <a 
          href={data.profileUrl} 
          target="_blank" 
          rel="noopener"
          className="inline-flex mt-4 px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors duration-180"
          style={{ backgroundColor: color }}
        >
          Follow
        </a>
        <p className="text-xs text-neutral-400 mt-3">Autoplays the first post only. Others play on click.</p>
      </aside>

      {/* Media rail */}
      <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.videos.slice(0, 3).map((v, idx) => (
          <VideoCard key={v.mp4} item={v} autoplay={idx === 0} />
        ))}
      </div>
    </section>
  );
}

export default function SocialShowcase() {
  const [socialData, setSocialData] = useState<SocialData | null>(null);

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

  if (!socialData) {
    return (
      <div id="social" className="container mx-auto px-4 py-14">
        <div className="text-center">Loading social content...</div>
      </div>
    );
  }

  return (
    <div id="social" className="container mx-auto px-4 py-14">
      <header className="mb-8">
        <h2 className={`text-4xl font-extrabold ${gradientText}`}>#Abadanhaly</h2>
        <p className="text-neutral-600 mt-2">Follow our latest carpets, room scenes, and care tips.</p>
      </header>

      <div className="space-y-12">
        <PlatformRow
          platform="instagram"
          color="#E1306C"
          data={socialData.instagram}
          icon={<span aria-hidden className="inline-block w-5 h-5 rounded-md bg-gradient-to-tr from-pink-500 to-yellow-500" />}
        />
        <PlatformRow
          platform="tiktok"
          color="#0F3B2F"
          data={socialData.tiktok}
          icon={<span aria-hidden className="inline-block w-5 h-5 rounded-md bg-black" />}
        />
      </div>
    </div>
  );
}
