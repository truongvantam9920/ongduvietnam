import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import type { PageRoute } from '../../types/index.js';

interface HeroSectionProps {
  onNavigate: (route: PageRoute) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let isMounted = true;
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.volume = 1.0;

    const playVideo = () => {
      if (!isMounted) return;
      if (video.paused) {
        const p = video.play();
        if (p !== undefined) {
          p.catch((err: unknown) => {
            // Silently ignore normal React unmount AbortErrors
            if (err instanceof Error && err.name === 'AbortError') {
              return;
            }
          });
        }
      }
    };

    playVideo();

    // Secondary triggers for Mobile / iOS Low Power Mode:
    // When user touches, scrolls, or switches tabs back, immediately ensure video plays
    const handleUserInteraction = () => {
      playVideo();
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('touchend', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
    };

    window.addEventListener('touchstart', handleUserInteraction, { passive: true, once: true });
    window.addEventListener('touchend', handleUserInteraction, { passive: true, once: true });
    window.addEventListener('scroll', handleUserInteraction, { passive: true, once: true });
    window.addEventListener('click', handleUserInteraction, { passive: true, once: true });

    const handleVisibilityChange = () => {
      if (!document.hidden && isMounted) {
        playVideo();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('touchend', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (video) {
      const nextState = !isMuted;
      video.muted = nextState;
      video.volume = 1.0;
      setIsMuted(nextState);
      if (!nextState) {
        video.play().catch(() => {});
      }
    }
  };

  return (
    <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center pt-28 sm:pt-32 md:pt-36 pb-20 md:pb-28 overflow-hidden text-stone-100">
      {/* Full Background Video Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          id="hero-bg-video"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          poster="/images/hero-stingless-bee.jpg"
          className="w-full h-full object-cover pointer-events-none"
        >
          <source src="/video/ongdu.mp4" type="video/mp4" />
        </video>
        {/* Soft, light tint to keep video vivid & clear */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Top subtle fade for navbar */}
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
        {/* Bottom smooth blend into AboutSection (#091f17) */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#091f17] via-[#091f17]/70 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 my-auto">
        {/* Main Hero Header */}
        <div className="max-w-4xl mx-auto space-y-8 text-center bg-[#071a13]/60 sm:bg-[#071a13]/50 backdrop-blur-md p-6 sm:p-10 md:p-12 rounded-3xl border border-[#24674d]/50 shadow-2xl">
          {/* Top Brand Subtitle Tag */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 sm:py-1.5 rounded-2xl sm:rounded-full bg-[#0d2d20]/95 border border-[#24674d] text-[#d1fae5] text-xs font-semibold backdrop-blur-md shadow-lg text-center">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d49a2a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d49a2a]"></span>
            </span>
            <span className="leading-snug">
              Hệ sinh thái mật ong dú nguyên bản <span className="hidden sm:inline">•</span><br className="sm:hidden" /> <strong className="text-amber-300 font-bold">Ong Dú Việt Nam</strong>
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[22px] sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight sm:leading-[1.15] tracking-tight drop-shadow-lg font-serif">
            <span className="block">
              Mật Ong Dú <span className="text-gold-gradient whitespace-nowrap">Thượng Hạng</span>
            </span>
            <span className="block text-[18px] sm:text-4xl lg:text-5xl text-stone-100 font-sans font-bold mt-1 sm:mt-2">
              Từ Thiên Nhiên Rừng Bản Địa
            </span>
          </h1>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                onNavigate('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#d49a2a] via-[#c6891e] to-[#d49a2a] hover:from-[#dfaa3b] hover:to-[#b67a16] text-[#0c1a13] font-bold text-sm shadow-xl shadow-[#c6891e]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>Khám phá sản phẩm</span>
              <ArrowRight className="w-4 h-4 text-[#0c1a13]" />
            </button>

            <button
              onClick={() => {
                document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#0e2f22]/90 hover:bg-[#154633] text-stone-200 font-semibold text-sm border border-[#24674d]/90 hover:border-[#d49a2a]/50 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md shadow-lg"
            >
              <span>Tìm hiểu về Ong Dú →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sound Toggle Button */}
      <button
        onClick={toggleSound}
        title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        className="absolute bottom-6 right-6 z-20 p-3 rounded-full bg-[#0c2a1e]/80 hover:bg-[#133f2e] border border-[#246b4e]/80 hover:border-[#d49a2a]/60 text-stone-200 hover:text-white backdrop-blur-md transition-all shadow-xl cursor-pointer flex items-center gap-2 text-xs"
      >
        {isMuted ? <VolumeX className="w-4 h-4 text-emerald-300" /> : <Volume2 className="w-4 h-4 text-[#e2b34d]" />}
        <span className="hidden sm:inline text-[11px] font-medium">{isMuted ? 'Bật âm thanh' : 'Đang bật âm thanh'}</span>
      </button>
    </section>
  );
};
