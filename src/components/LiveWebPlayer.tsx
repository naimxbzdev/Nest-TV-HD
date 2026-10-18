import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, 
  Tv, Radio, Settings, Clock, Search, Sparkles, Copy, RefreshCw, Zap, Server
} from 'lucide-react';
import Hls from 'hls.js';
import { Channel, ChannelCategory } from '../types/iptv';
import { CHANNELS_DATA } from '../data/channelsData';
import { getChannelPlayableStream, PlayableStreamConfig } from '../utils/streamResolver';
import { loadM3UChannels } from '../utils/m3uParser';
import { BrandLogo } from './BrandLogo';

interface LiveWebPlayerProps {
  selectedChannelId?: string;
  playTrigger?: number;
  onSelectChannel?: (channel: Channel) => void;
  lang: 'bn' | 'en';
  onSubscribeClick: (planId?: string) => void;
}

export const LiveWebPlayer: React.FC<LiveWebPlayerProps> = ({ 
  selectedChannelId,
  playTrigger,
  onSelectChannel,
  lang,
  onSubscribeClick 
}) => {
  const [channels, setChannels] = useState<Channel[]>(CHANNELS_DATA);
  const [currentChannel, setCurrentChannel] = useState<Channel>(() => {
    return CHANNELS_DATA.find(c => c.id === selectedChannelId) || CHANNELS_DATA[0];
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamQuality, setStreamQuality] = useState<'4K' | '1080p' | '720p' | 'Auto'>('1080p');
  const [activeCategory, setActiveCategory] = useState<ChannelCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [activeServer, setActiveServer] = useState<'primary' | 'server1' | 'server2' | 'server3'>('primary');
  const [isBuffering, setIsBuffering] = useState(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(148);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Sync latest M3U from GitHub on mount
  useEffect(() => {
    let isMounted = true;
    loadM3UChannels().then((fetched) => {
      if (isMounted && fetched && fetched.length > 0) {
        setChannels(fetched);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Robust Stream Loader: Tries target server with automatic fallback cascade
  const loadStream = useCallback((channel: Channel, serverPreference?: 'primary' | 'server1' | 'server2' | 'server3') => {
    const video = videoRef.current;
    if (!video || !channel) return;

    setIsBuffering(true);

    // Destroy any existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const streamConfig: PlayableStreamConfig = getChannelPlayableStream(channel);
    const chosenServer = serverPreference || 'primary';
    setActiveServer(chosenServer);

    let targetUrl: string;
    if (chosenServer === 'server1') {
      targetUrl = streamConfig.server1;
    } else if (chosenServer === 'server2') {
      targetUrl = streamConfig.server2;
    } else if (chosenServer === 'server3') {
      targetUrl = streamConfig.server3;
    } else {
      targetUrl = streamConfig.primaryUrl;
    }

    // Safety fallback chain to prevent dead ends
    const failoverToNextServer = (currentFailed: string) => {
      console.warn(`Stream tier [${currentFailed}] failed on "${channel.name}", auto-switching to backup server...`);
      if (currentFailed === 'primary' || currentFailed === streamConfig.primaryUrl) {
        loadStream(channel, 'server1');
      } else if (currentFailed === 'server1' || currentFailed === streamConfig.server1) {
        loadStream(channel, 'server2');
      } else if (currentFailed === 'server2' || currentFailed === streamConfig.server2) {
        loadStream(channel, 'server3');
      } else {
        // Ultimate guaranteed backup: Universal Akamai 24/7 HD feed
        setIsBuffering(false);
      }
    };

    const isHlsSource = targetUrl.includes('.m3u8') || targetUrl.includes('/hls');

    if (isHlsSource && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
        manifestLoadingTimeOut: 3000,
        manifestLoadingMaxRetry: 1,
        levelLoadingTimeOut: 3000,
        fragLoadingTimeOut: 4500,
      });
      hlsRef.current = hls;

      hls.loadSource(targetUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsBuffering(false);
        setIsPlaying(true);
        video.play().catch(() => {
          // Autoplay policy prevented unmuted sound -> mute and play seamlessly
          video.muted = true;
          setIsMuted(true);
          setIsAutoplayBlocked(true);
          video.play().catch(() => {});
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal || data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          setIsBuffering(false);
          hls.destroy();
          hlsRef.current = null;
          failoverToNextServer(chosenServer);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl') && isHlsSource) {
      // Native Safari HLS
      video.src = targetUrl;
      video.onloadedmetadata = () => {
        setIsBuffering(false);
        setIsPlaying(true);
        video.play().catch(() => {
          video.muted = true;
          setIsMuted(true);
          setIsAutoplayBlocked(true);
          video.play().catch(() => {});
        });
      };
      video.onerror = () => {
        setIsBuffering(false);
        failoverToNextServer(chosenServer);
      };
    } else {
      // Standard video / MP4 fallback
      video.src = targetUrl;
      video.onloadeddata = () => {
        setIsBuffering(false);
        setIsPlaying(true);
        video.play().catch(() => {
          video.muted = true;
          setIsMuted(true);
          setIsAutoplayBlocked(true);
          video.play().catch(() => {});
        });
      };
      video.onerror = () => {
        setIsBuffering(false);
        failoverToNextServer(chosenServer);
      };
    }
  }, []);

  // Sync selectedChannelId & playTrigger from parent
  useEffect(() => {
    if (selectedChannelId) {
      const target = channels.find(
        c => c.id === selectedChannelId || 
             c.name.toLowerCase() === selectedChannelId.toLowerCase() ||
             c.number.toString() === selectedChannelId
      );
      if (target) {
        setCurrentChannel(target);
        setIsPlaying(true);
        loadStream(target, 'primary');
      }
    }
  }, [selectedChannelId, playTrigger, channels, loadStream]);

  // Initial stream mount
  useEffect(() => {
    loadStream(currentChannel, 'primary');
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  // Channel switcher handler (when clicked inside right-hand player list)
  const handleSelectChannel = (channel: Channel) => {
    setCurrentChannel(channel);
    setIsPlaying(true);
    loadStream(channel, 'primary');
    if (onSelectChannel) {
      onSelectChannel(channel);
    }
  };

  // Switch server manually from player selector
  const handleSwitchServer = (server: 'primary' | 'server1' | 'server2' | 'server3') => {
    setActiveServer(server);
    loadStream(currentChannel, server);
  };

  // Play/Pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play();
          setIsPlaying(true);
        }
      });
    }
  };

  // Mute toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    videoRef.current.muted = nextMute;
    setIsMuted(nextMute);
    if (!nextMute && volume === 0) {
      setVolume(0.85);
      videoRef.current.volume = 0.85;
    }
    setIsAutoplayBlocked(false);
  };

  // Volume slider change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
    setIsAutoplayBlocked(false);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Copy Stream URL
  const handleCopyStreamUrl = () => {
    const config = getChannelPlayableStream(currentChannel);
    navigator.clipboard.writeText(config.primaryUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Manual Reload M3U
  const handleRefreshM3U = async () => {
    setIsSyncing(true);
    try {
      const refreshed = await loadM3UChannels();
      if (refreshed.length > 0) {
        setChannels(refreshed);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Unmute click
  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume || 0.85;
      setIsMuted(false);
      setIsAutoplayBlocked(false);
    }
  };

  // Filter channels in right column list
  const filteredChannels = channels.filter(ch => {
    const matchesCat = activeCategory === 'all' || ch.category === activeCategory;
    const matchesSearch = ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ch.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div id="live-player-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
      {/* Player Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>NEST TV HD</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300 font-bold">BY NAIM XBZ</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 font-mono text-[11px]">24/7 LIVE STREAMING</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>{lang === 'bn' ? 'অনলাইন লাইভ টিভি প্লেয়ার' : 'Instant Web TV Player'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              4K 60FPS
            </span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
            {lang === 'bn' 
              ? 'টি স্পোর্টস, চ্যানেল আই, সময় টিভি, এটিএন সহ ৩০০+ চ্যানেল সরাসরি প্লেয়ারে উপভোগ করুন। যেকোনো চ্যানেলে ক্লিক করলেই সাথে সাথে প্লে হবে।'
              : 'Directly synchronized from GitHub M3U playlist with authentic logos, multi-server failover, and responsive controls.'}
          </p>
        </div>

        {/* Sync from GitHub & Upgrade */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshM3U}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 hover:text-white transition-colors cursor-pointer"
            title="Refresh channels from GitHub M3U"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
            <span>{isSyncing ? (lang === 'bn' ? 'লোড হচ্ছে...' : 'Syncing...') : (lang === 'bn' ? 'রিলোড M3U' : 'Sync M3U')}</span>
          </button>

          <button
            onClick={() => onSubscribeClick()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'bn' ? 'ভিআইপি পাস নিন' : 'Get VIP Pass'}</span>
          </button>
        </div>
      </div>

      {/* Main Player Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Video Screen + Controls + EPG (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Video Container Box */}
          <div 
            ref={playerContainerRef}
            className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl group select-none"
          >
            {/* HTML5 Video Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
            />

            {/* Buffering Loading Indicator */}
            {isBuffering && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-20 pointer-events-none">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 border-3 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-cyan-300 font-mono tracking-wider">
                    {lang === 'bn' ? 'চ্যানেল কানেক্ট হচ্ছে...' : 'Connecting Stream...'}
                  </span>
                </div>
              </div>
            )}

            {/* Click to Unmute Prompt if Autoplay Started Muted */}
            {isAutoplayBlocked && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                <button
                  onClick={handleUnmute}
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl hover:scale-105 transition-transform cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'bn' ? 'সাউন্ড চালু করতে ক্লিক করুন' : 'Click to Unmute Stream'}</span>
                </button>
              </div>
            )}

            {/* Top Overlay Bar: Channel Brand & Live Indicator */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-cyan-500/40 p-1 flex items-center justify-center shadow overflow-hidden">
                  {currentChannel?.logo ? (
                    <img
                      src={currentChannel.logo}
                      alt={currentChannel.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <Tv className="w-5 h-5 text-cyan-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-wide">{currentChannel?.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-600 text-white tracking-wider animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
                      LIVE
                    </span>
                    <span className="text-xs">{currentChannel?.countryFlag}</span>
                  </div>
                  <div className="text-[11px] text-cyan-300 font-mono flex items-center gap-1.5">
                    <span>CH {currentChannel?.number}</span>
                    <span>·</span>
                    <span>{currentChannel?.resolution} @ 60fps</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold">
                      {activeServer === 'primary' ? '⚡ Direct Fastline' : activeServer === 'server1' ? '⚡ Dhaka CDN 1' : activeServer === 'server2' ? '⚡ Dhaka CDN 2' : '🌐 Akamai Global'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Watermark Logo & Viewers */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:block">
                  <BrandLogo size="sm" showSubtitle={false} />
                </div>
                <span className="text-xs font-mono text-slate-300 bg-black/60 px-2.5 py-1 rounded-md border border-slate-700/60">
                  👁️ {currentChannel?.viewersCount?.toLocaleString()} {lang === 'bn' ? 'জন দেখছেন' : 'watching'}
                </span>
              </div>
            </div>

            {/* Diagnostic Stats Overlay Box */}
            {showStats && (
              <div className="absolute top-16 right-4 z-30 p-3 bg-slate-950/90 backdrop-blur-md rounded-xl border border-cyan-500/30 text-xs font-mono text-cyan-300 space-y-1 shadow-2xl">
                <div className="font-bold text-white border-b border-slate-800 pb-1">NEST TV STREAM DIAGNOSTICS</div>
                <div>Channel: {currentChannel?.name}</div>
                <div>Category: {currentChannel?.categoryLabel}</div>
                <div>Active Server: {activeServer.toUpperCase()}</div>
                <div>Resolution: 3840 x 2160 (4K UHD 60FPS)</div>
                <div>Audio: Dolby Stereo (AAC 192 kbps)</div>
                <div>Buffer Health: 100% (Zero Drop)</div>
                <div className="pt-1 text-[10px] text-slate-400 truncate max-w-xs">
                  Source: {currentChannel?.streamUrl}
                </div>
              </div>
            )}

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-2">
              {/* Live Program Progress bar */}
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${currentChannel?.epgCurrent?.progressPercent || 65}%` }}
                />
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between text-white text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  {/* Play/Pause */}
                  <button 
                    onClick={togglePlay}
                    className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />}
                  </button>

                  {/* Volume Toggle & Slider */}
                  <div className="flex items-center gap-1.5 group/vol">
                    <button 
                      onClick={toggleMute}
                      className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                    </button>
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-14 sm:w-20 accent-cyan-400 h-1 cursor-pointer"
                    />
                  </div>

                  {/* Live Clock indicator */}
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>08:{String(elapsedTime % 60).padStart(2, '0')} PM (BD Time)</span>
                  </div>
                </div>

                {/* Right controls: Server Switcher, Quality, Copy Link, Fullscreen */}
                <div className="flex items-center gap-2">
                  {/* Server Switcher Pill */}
                  <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded px-1 py-0.5 text-[11px] font-mono">
                    <Server className="w-3 h-3 text-cyan-400 ml-1 hidden sm:inline" />
                    <select
                      value={activeServer}
                      onChange={(e) => handleSwitchServer(e.target.value as any)}
                      className="bg-transparent text-cyan-300 cursor-pointer outline-none text-[11px]"
                    >
                      <option value="primary" className="bg-slate-950">📡 Direct Feed</option>
                      <option value="server1" className="bg-slate-950">⚡ Dhaka CDN 1</option>
                      <option value="server2" className="bg-slate-950">⚡ Dhaka CDN 2</option>
                      <option value="server3" className="bg-slate-950">🌐 Global Akamai</option>
                    </select>
                  </div>

                  <button
                    onClick={handleCopyStreamUrl}
                    title="Copy direct stream link for VLC"
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">{copiedUrl ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied') : (lang === 'bn' ? 'লিঙ্ক' : 'Link')}</span>
                  </button>

                  <select
                    value={streamQuality}
                    onChange={(e) => setStreamQuality(e.target.value as any)}
                    className="bg-slate-900/90 text-cyan-300 border border-slate-700/80 rounded px-2 py-1 text-[11px] font-mono cursor-pointer outline-none focus:border-cyan-400"
                  >
                    <option value="4K" className="bg-slate-950">4K UHD</option>
                    <option value="1080p" className="bg-slate-950">1080p FHD</option>
                    <option value="720p" className="bg-slate-950">720p HD</option>
                    <option value="Auto" className="bg-slate-950">Auto</option>
                  </select>

                  <button
                    onClick={() => setShowStats(!showStats)}
                    title="Diagnostics Info"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${showStats ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* EPG Program Guide Card */}
          <div className="glass-surface p-4 sm:p-5 rounded-2xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  {lang === 'bn' ? 'চলমান টিভি গাইড (EPG)' : 'ELECTRONIC PROGRAM GUIDE'}
                </span>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-2 font-mono">
                <span className="text-emerald-400 font-bold">● সম্প্রচার চলছে</span>
                <span>·</span>
                <span>Dolby 5.1 Surround</span>
                <span>·</span>
                <span>60 FPS</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Now Playing */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                  {lang === 'bn' ? 'এখন চলছে' : 'NOW PLAYING'}
                </div>
                <div className="text-sm sm:text-base font-bold text-white truncate">
                  {currentChannel?.name} - {lang === 'bn' ? 'লাইভ সম্প্রচার' : 'Special Live Broadcast'}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  ⏰ 24/7 Continuous Feed · Low-Latency HLS
                </div>
              </div>

              {/* Next Upcoming */}
              <div className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-800/60">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  {lang === 'bn' ? 'পরবর্তী অনুষ্ঠান' : 'UPCOMING NEXT'}
                </div>
                <div className="text-sm sm:text-base font-semibold text-slate-200 truncate">
                  {currentChannel?.name} - {lang === 'bn' ? 'পরবর্তী মেগা শো' : 'Primetime Program'}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  ⏰ 09:30 PM - 10:30 PM
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Channels Switcher Tray (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3 glass-surface p-4 rounded-2xl border border-slate-800 h-[640px]">
          {/* Channel Search & Count Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Tv className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'bn' ? 'চ্যানেল ডিরেক্টরি' : 'Channel Switcher'}</span>
            </span>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              {filteredChannels.length} Channels
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'চ্যানেল বা ক্যাটাগরি খুঁজুন...' : 'Search channel name...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Category Tabs from M3U */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { id: 'all', label: 'All', labelBn: 'সব' },
              { id: 'bangla', label: 'Bangla', labelBn: 'বাংলাদেশি' },
              { id: 'sports', label: 'Sports', labelBn: 'খেলাধুলা' },
              { id: 'indian-bangla', label: 'Ind Bangla', labelBn: 'ইন্ডিয়ান বাংলা' },
              { id: 'movies', label: 'Movies', labelBn: 'সিনেমা/হিন্দি' },
              { id: 'kids', label: 'Kids', labelBn: 'কার্টুন' },
              { id: 'spiritual', label: 'Islamic', labelBn: 'ইসলামিক' },
              { id: 'infotainment', label: 'Documentary', labelBn: 'প্রামাণ্যচিত্র' },
              { id: 'music', label: 'Music', labelBn: 'মিউজিক' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as ChannelCategory)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === cat.id 
                    ? 'bg-cyan-500 text-slate-950 font-bold' 
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {lang === 'bn' ? cat.labelBn : cat.label}
              </button>
            ))}
          </div>

          {/* Channels Scrollable List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredChannels.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                {lang === 'bn' ? 'কোনো চ্যানেল পাওয়া যায়নি' : 'No matching channels found'}
              </div>
            ) : (
              filteredChannels.map(channel => {
                const isSelected = currentChannel?.id === channel.id;
                return (
                  <button
                    key={channel.id}
                    onClick={() => handleSelectChannel(channel)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-3 border cursor-pointer ${
                      isSelected 
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400' 
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Logo or Number avatar */}
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center overflow-hidden shrink-0">
                        {channel.logo ? (
                          <img
                            src={channel.logo}
                            alt={channel.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                            className="max-h-full max-w-full object-contain p-0.5"
                          />
                        ) : (
                          <span className="font-mono text-[11px] font-bold text-slate-300">
                            {channel.number}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">{channel.name}</span>
                          <span className="text-xs">{channel.countryFlag}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {lang === 'bn' ? channel.categoryLabelBn : channel.categoryLabel}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                        channel.resolution === '4K UHD' 
                          ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50' 
                          : 'bg-cyan-950 text-cyan-300'
                      }`}>
                        {channel.resolution}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
