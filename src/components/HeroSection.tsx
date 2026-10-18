import React, { useState, useEffect } from 'react';
import { 
  Play, Download, Tv, ShieldCheck, Zap, Volume2, 
  Wifi, Maximize2, Sparkles, Cast, Radio
} from 'lucide-react';

interface HeroSectionProps {
  lang: 'bn' | 'en';
  onWatchNowClick: () => void;
  onDownloadClick: () => void;
  onExplorePlansClick: () => void;
  onPlayChannel?: (channelId: string) => void;
}

interface CinemaChannelPreset {
  id: string;
  nameBn: string;
  nameEn: string;
  categoryBn: string;
  categoryEn: string;
  image: string;
  resolution: string;
  fps: string;
  audio: string;
  liveBadgeBn: string;
  liveBadgeEn: string;
  matchedChannelId?: string;
}

const CINEMA_CHANNELS: CinemaChannelPreset[] = [
  {
    id: 'tsports',
    nameBn: 'টি স্পোর্টস ৪K আল্ট্রা এইচডি',
    nameEn: 'T Sports 4K Ultra HD',
    categoryBn: 'লাইভ ক্রিকেট ও ফুটবল',
    categoryEn: 'Live Cricket & Football',
    image: '/src/assets/images/sports_cricket_football_1792263390923.jpg',
    resolution: '3840×2160 UHD',
    fps: '60 FPS',
    audio: 'Dolby Atmos 5.1',
    liveBadgeBn: 'সরাসরি স্টেডিয়াম সম্প্রচার',
    liveBadgeEn: 'Live Stadium Feed',
    matchedChannelId: 't-sports-hd',
  },
  {
    id: 'cinema',
    nameBn: 'সিনেমা প্রিমিয়ার ৪K ওলেড',
    nameEn: 'Cinema Premier 4K OLED',
    categoryBn: 'হলিউড ও বাংলা ব্লকবাস্টার',
    categoryEn: 'Hollywood & Bangla Movies',
    image: '/src/assets/images/hero_iptv_showcase_1792263390124.jpg',
    resolution: '4K Dolby Vision',
    fps: '24 FPS TrueCinema',
    audio: 'Dolby Atmos 7.1.2',
    liveBadgeBn: '৮৫" হোম থিয়েটার মোড',
    liveBadgeEn: '85" Home Theater Experience',
    matchedChannelId: 'hbo-hd',
  },
  {
    id: 'multidevice',
    nameBn: 'মাল্টি-রুম ক্লাউড সিঙ্ক',
    nameEn: 'Multi-Room Cloud Sync',
    categoryBn: 'টিভি, মোবাইল ও ট্যাবলেট',
    categoryEn: 'TV, Phone & Tablet',
    image: '/src/assets/images/iptv_multi_device_1792263390196.jpg',
    resolution: 'Adaptive 4K/FHD',
    fps: '60 FPS',
    audio: 'Lossless Stereo',
    liveBadgeBn: '৪টি ডিভাইসে একই সাথে',
    liveBadgeEn: '4 Simultaneous Streams',
    matchedChannelId: 'star-sports-1',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onWatchNowClick,
  onDownloadClick,
  onExplorePlansClick,
  onPlayChannel,
}) => {
  const [selectedChannelIndex, setSelectedChannelIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState('08:45 PM');
  const [isHovered, setIsHovered] = useState(false);

  // Live clock simulation for TV UI
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const activePreset = CINEMA_CHANNELS[selectedChannelIndex];

  const handleChannelSelect = (idx: number) => {
    setSelectedChannelIndex(idx);
  };

  const handlePlayActiveChannel = () => {
    if (onPlayChannel && activePreset.matchedChannelId) {
      onPlayChannel(activePreset.matchedChannelId);
    } else {
      onWatchNowClick();
    }
  };

  return (
    <section className="relative pt-6 pb-16 overflow-hidden">
      {/* Background ambient lighting gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[480px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-teal-500/15 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Unboxed Kicker Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-cyan-400 mb-4 tracking-wide">
          <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>NEST TV HD</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-200 font-bold">BY NAIM XBZ</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>DHAKA TIER-1 CDN BDIX</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>4K ULTRA HD 60FPS</span>
        </div>

        {/* 2-Column Responsive Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] text-balance">
              {lang === 'bn' ? (
                <>
                  ৩০০+ লাইভ টিভি চ্যানেল <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                    জিরো বাফারিংয়ে
                  </span> উপভোগ করুন
                </>
              ) : (
                <>
                  Stream 300+ Live TV <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                    Zero Buffering
                  </span> 4K Experience
                </>
              )}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed text-pretty max-w-xl">
              {lang === 'bn' 
                ? 'টি স্পোর্টস, স্টার স্পোর্টস, সনি টেন, এইচবিও, সময় টিভি সহ বিশ্বের ৩০০+ প্রিমিয়াম চ্যানেল এখন আপনার স্মার্ট টিভি, মোবাইল এবং ব্রাউজারে। যেকোনো সময় যেকোনো ডিভাইসে।'
                : 'Experience premier sports, cinema, news, and kids entertainment in pristine 4K UHD 60FPS. Instant web streaming or native TV app with local Bangladesh payment support.'}
            </p>

            {/* CTA Action Cluster */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {/* Primary CTA */}
              <button
                onClick={handlePlayActiveChannel}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{lang === 'bn' ? 'অনলাইনে লাইভ দেখুন' : 'Watch Live Online'}</span>
              </button>

              {/* Secondary CTA */}
              <button
                onClick={onDownloadClick}
                className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 shadow-lg transition-all cursor-pointer whitespace-nowrap"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'bn' ? 'ফ্রি অ্যাপ ডাউনলোড' : 'Download Free App'}</span>
              </button>
            </div>

            {/* Quick sub-action & Trial invite */}
            <div className="mt-5 flex items-center gap-3 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {lang === 'bn' 
                  ? 'কোনো কার্ড ছাড়া ২৪ ঘণ্টা সম্পূর্ণ ফ্রি ট্রায়াল পান।' 
                  : 'Free 24-hour instant test line available · No credit card required.'}
              </span>
              <button
                onClick={onExplorePlansClick}
                className="text-cyan-400 hover:underline font-semibold cursor-pointer"
              >
                {lang === 'bn' ? 'প্ল্যান দেখুন →' : 'View Plans →'}
              </button>
            </div>
          </div>

          {/* Right Column: স্মার্ট টিভি সিনেমা ভিউ (Smart TV Cinema View) */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            {/* Top Showcase Header bar */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <Tv className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-bold tracking-wide">
                  {lang === 'bn' ? 'স্মার্ট টিভি সিনেমা ভিউ' : 'Smart TV Cinema View'}
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {lang === 'bn' ? 'লাইভ ৪কে' : 'LIVE 4K'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                <span className="hidden sm:inline text-cyan-400 font-semibold">14MS BDIX CACHE</span>
                <span className="text-slate-600">·</span>
                <span>DOLBY ATMOS</span>
              </div>
            </div>

            {/* Smart TV Physical Bezel & Cinematic Display Frame */}
            <div 
              className="relative w-full rounded-2xl p-2 sm:p-2.5 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border border-slate-700/80 shadow-[0_20px_60px_-15px_rgba(6,182,212,0.25)] transition-all duration-500 group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Ambilight Backlight Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500/20 via-teal-500/15 to-blue-600/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none -z-10" />

              {/* OLED Screen Enclosure */}
              <div className="relative w-full h-[400px] sm:h-[480px] md:h-[520px] rounded-xl overflow-hidden bg-black border border-slate-900 flex flex-col justify-between">
                {/* TV Background Image Feed */}
                <img
                  src={activePreset.image}
                  alt={activePreset.nameEn}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-102"
                />

                {/* Cinematic Vignette & Ambient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/60 pointer-events-none" />

                {/* Top TV OS Status Bar */}
                <div className="relative z-10 px-4 py-2.5 flex items-center justify-between text-xs text-slate-200 backdrop-blur-md bg-black/40 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="font-['Outfit'] font-black text-cyan-400 tracking-tight text-sm flex items-center gap-1">
                      <span>NEST</span>
                      <span className="text-white">TV</span>
                      <sup className="text-[9px] text-cyan-400 font-mono">HD</sup>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      OS 5.2
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Wifi className="w-3 h-3" />
                      <span>Wi-Fi 6</span>
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40">
                      HDR10+
                    </span>
                    <span className="text-slate-300 font-semibold">{currentTime}</span>
                  </div>
                </div>

                {/* Center Action Overlay & Live Watermark */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
                  {/* Channel Watermark & Category */}
                  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-xs">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="font-bold text-white font-mono">
                      {lang === 'bn' ? activePreset.liveBadgeBn : activePreset.liveBadgeEn}
                    </span>
                    <span className="text-slate-500">|</span>
                    <span className="text-cyan-400 font-mono font-semibold">{activePreset.fps}</span>
                  </div>

                  {/* Big Play CTA Button with Glow */}
                  <button
                    onClick={handlePlayActiveChannel}
                    aria-label={lang === 'bn' ? 'লাইভ স্ট্রিম চালু করুন' : 'Launch Live Stream'}
                    className="relative group/btn cursor-pointer flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:shadow-[0_0_60px_rgba(6,182,212,0.9)] transition-all transform hover:scale-110 active:scale-95"
                  >
                    <div className="absolute -inset-1 rounded-full bg-cyan-400 blur-md opacity-70 group-hover/btn:opacity-100 transition-opacity" />
                    <Play className="relative w-7 h-7 sm:w-9 sm:h-9 fill-slate-950 ml-1" />
                  </button>

                  <div className="mt-4">
                    <p className="text-white font-extrabold text-lg sm:text-xl drop-shadow-md tracking-tight">
                      {lang === 'bn' ? activePreset.nameBn : activePreset.nameEn}
                    </p>
                    <p className="text-xs sm:text-sm text-cyan-300 font-medium mt-0.5">
                      {lang === 'bn' ? activePreset.categoryBn : activePreset.categoryEn} · {activePreset.resolution}
                    </p>
                  </div>
                </div>

                {/* Bottom TV Quick Channel Switcher Bar */}
                <div className="relative z-10 p-3 sm:p-4 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/90 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                      <Radio className="w-3.5 h-3.5 text-cyan-400" />
                      {lang === 'bn' ? 'সরাসরি চ্যানেল প্রিসেট সিলেক্ট করুন:' : 'Select Live TV Preset:'}
                    </span>
                    <button
                      onClick={handlePlayActiveChannel}
                      className="text-white hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>{lang === 'bn' ? 'প্লেয়ারে চালান' : 'Play in Player'}</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Channel selection chips */}
                  <div className="grid grid-cols-3 gap-2">
                    {CINEMA_CHANNELS.map((ch, idx) => {
                      const isSelected = selectedChannelIndex === idx;
                      return (
                        <button
                          key={ch.id}
                          onClick={() => handleChannelSelect(idx)}
                          className={`flex flex-col items-start p-2 rounded-lg text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/20 border border-cyan-400/60 shadow-md shadow-cyan-500/20'
                              : 'bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span className={`text-[11px] font-bold truncate w-full ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {lang === 'bn' ? ch.nameBn.split(' ')[0] + ' ' + (ch.nameBn.split(' ')[1] || '') : ch.nameEn.split(' ')[0] + ' ' + (ch.nameEn.split(' ')[1] || '')}
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400 truncate w-full">
                            {ch.fps} · {ch.resolution.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Integrated TV Soundbar Element Underneath Bezel */}
              <div className="mt-2 px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="font-bold text-slate-300 font-mono">DOLBY ATMOS 7.1.2</span>
                  <span className="text-slate-600 hidden sm:inline">|</span>
                  <span className="text-slate-400 hidden sm:inline">ACOUSTIC BEAM SURROUND</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono text-cyan-300 font-semibold">100% HI-RES</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Proof & KPI Strip Below Hero */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-slate-800/80">
          <div className="p-4 rounded-xl glass-surface border border-slate-800/90">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              300+
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              {lang === 'bn' ? 'লাইভ এইচডি ও ৪কে চ্যানেল' : 'Live HD & 4K Channels'}
            </div>
          </div>

          <div className="p-4 rounded-xl glass-surface border border-slate-800/90">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono tabular-nums">
              0%
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              {lang === 'bn' ? 'বাফারিং (ঢাকা ক্যাশ সার্ভার)' : 'Buffering (Dhaka CDN Node)'}
            </div>
          </div>

          <div className="p-4 rounded-xl glass-surface border border-slate-800/90">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              60 FPS
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              {lang === 'bn' ? 'স্মুথ স্পোর্টস ব্রডকাস্ট' : 'Fluid Sports Broadcast'}
            </div>
          </div>

          <div className="p-4 rounded-xl glass-surface border border-slate-800/90">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
              99.9%
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              {lang === 'bn' ? 'সার্ভার আপটাইম গ্যারান্টি' : 'Stream Uptime SLA'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
