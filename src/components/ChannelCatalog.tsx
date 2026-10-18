import React, { useState } from 'react';
import { Search, Play, Tv, Sparkles, ExternalLink, Copy } from 'lucide-react';
import { Channel, ChannelCategory } from '../types/iptv';
import { CHANNELS_DATA } from '../data/channelsData';
import { M3U_SOURCE_URL } from '../utils/m3uParser';

interface ChannelCatalogProps {
  lang: 'bn' | 'en';
  onPlayChannel: (channelId: string) => void;
  onSubscribeClick: () => void;
}

export const ChannelCatalog: React.FC<ChannelCatalogProps> = ({
  lang,
  onPlayChannel,
  onSubscribeClick,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ChannelCategory>('all');
  const [search, setSearch] = useState('');
  const [resolutionFilter, setResolutionFilter] = useState<'all' | '4k' | 'fhd'>('all');
  const [copiedM3u, setCopiedM3u] = useState(false);

  const categories: { id: ChannelCategory; labelEn: string; labelBn: string }[] = [
    { id: 'all', labelEn: 'All Channels', labelBn: 'সকল চ্যানেল' },
    { id: 'bangla', labelEn: 'Bangladeshi', labelBn: 'বাংলাদেশি চ্যানেল' },
    { id: 'sports', labelEn: 'Live Sports 4K', labelBn: 'খেলাধুলা' },
    { id: 'indian-bangla', labelEn: 'Indian Bangla', labelBn: 'ইন্ডিয়ান বাংলা' },
    { id: 'movies', labelEn: 'Movies & Hindi', labelBn: 'সিনেমা ও বিনোদন' },
    { id: 'kids', labelEn: 'Kids & Cartoons', labelBn: 'কার্টুন' },
    { id: 'spiritual', labelEn: 'Islamic Makkah Live', labelBn: 'ইসলামিক' },
    { id: 'infotainment', labelEn: 'Documentary', labelBn: 'প্রামাণ্যচিত্র' },
    { id: 'music', labelEn: 'Music', labelBn: 'মিউজিক' },
  ];

  const filteredChannels = CHANNELS_DATA.filter((ch) => {
    const matchesCat = selectedCategory === 'all' || ch.category === selectedCategory;
    const matchesSearch =
      ch.name.toLowerCase().includes(search.toLowerCase()) ||
      ch.country.toLowerCase().includes(search.toLowerCase()) ||
      ch.categoryLabel.toLowerCase().includes(search.toLowerCase());
    const matchesRes =
      resolutionFilter === 'all' ||
      (resolutionFilter === '4k' && ch.resolution === '4K UHD') ||
      (resolutionFilter === 'fhd' && ch.resolution === 'FHD 1080p');
    return matchesCat && matchesSearch && matchesRes;
  });

  const handleCopyM3u = () => {
    navigator.clipboard.writeText(M3U_SOURCE_URL);
    setCopiedM3u(true);
    setTimeout(() => setCopiedM3u(false), 2000);
  };

  return (
    <section id="channels-directory" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-2">
            <Tv className="w-4 h-4" />
            <span>NEST TV HD</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300 font-bold">BY NAIM XBZ</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400 font-mono text-[11px]">{CHANNELS_DATA.length} Verified Channels</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'bn' ? 'আপনার প্রিয় সব চ্যানেল এক জায়গায়' : 'Every Verified Channel, Ready to Stream'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
            {lang === 'bn'
              ? 'টি স্পোর্টস, স্টার স্পোর্টস, সময় টিভি, যমুনা, কার্টুন নেটওয়ার্ক সহ সরাসরি GitHub M3U থেকে ফেচ করা চ্যানেল ও অফিশিয়াল লোগো। যেকোনো চ্যানেলে ক্লিক করলেই সাথে সাথে প্লেয়ারে নিয়ে প্লে হবে।'
              : 'All channels loaded directly from the XBZ Prime TV M3U playlist with authentic logos and live HLS stream feeds. Click any channel to play instantly.'}
          </p>
        </div>

        {/* Search, Filter & M3U Link Copy */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleCopyM3u}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            title="Copy M3U Source Link"
          >
            <Copy className="w-3.5 h-3.5 text-cyan-400" />
            <span>{copiedM3u ? (lang === 'bn' ? 'M3U লিংক কপি হয়েছে!' : 'M3U Copied!') : 'M3U Link'}</span>
          </button>

          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'চ্যানেলের নাম খুঁজুন...' : 'Search channel name...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setResolutionFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                resolutionFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setResolutionFilter('4k')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                resolutionFilter === '4k' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              4K/HD
            </button>
            <button
              onClick={() => setResolutionFilter('fhd')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                resolutionFilter === 'fhd' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              FHD
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count = cat.id === 'all' 
            ? CHANNELS_DATA.length 
            : CHANNELS_DATA.filter(c => c.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span>{lang === 'bn' ? cat.labelBn : cat.labelEn}</span>
              <span
                className={`text-[11px] font-mono px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-slate-950 text-cyan-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Channels Cards Grid - FULL CARD CLICKABLE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredChannels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => onPlayChannel(channel.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onPlayChannel(channel.id);
              }
            }}
            className="group glass-surface rounded-2xl border border-slate-800/90 hover:border-cyan-400/80 hover:ring-2 hover:ring-cyan-500/30 p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-950/40 cursor-pointer active:scale-98 select-none"
          >
            <div>
              {/* Card Top: Number, Resolution, Flag */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition-colors">
                  CH {channel.number}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs">{channel.countryFlag}</span>
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                      channel.resolution === '4K UHD'
                        ? 'bg-purple-950/70 text-purple-300 border border-purple-800/50'
                        : 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/50'
                    }`}
                  >
                    {channel.resolution}
                  </span>
                </div>
              </div>

              {/* Logo & Channel Title Row */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-700/60 p-1.5 flex items-center justify-center shrink-0 shadow overflow-hidden group-hover:border-cyan-400 group-hover:scale-105 transition-all">
                  {channel.logo ? (
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <Tv className="w-6 h-6 text-cyan-400" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {channel.name}
                  </h3>
                  <div className="text-xs text-slate-400 truncate">
                    {lang === 'bn' ? channel.categoryLabelBn : channel.categoryLabel}
                  </div>
                </div>
              </div>

              {/* Stream Metadata Info */}
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 group-hover:border-slate-700 transition-colors">
                <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-0.5 flex items-center justify-between">
                  <span>{lang === 'bn' ? 'লাইভ ফিড' : 'LIVE FEED'}</span>
                  <span className="text-[9px] text-emerald-400 font-mono">● 100% READY</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate font-mono">
                  {channel.streamUrl.replace(/https?:\/\//, '').split('/')[0]}
                </div>
              </div>
            </div>

            {/* Watch Now Button */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                👁️ {(channel.viewersCount / 1000).toFixed(1)}k
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayChannel(channel.id);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-md shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap group-hover:scale-105 active:scale-95"
              >
                <Play className="w-3 h-3 fill-slate-950" />
                <span>{lang === 'bn' ? 'প্লে করুন' : 'Watch Live'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Catalog Bottom CTA with GitHub Repository reference */}
      <div className="mt-12 p-6 rounded-2xl glass-surface-elevated border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>{lang === 'bn' ? 'সকল M3U চ্যানেল আপনার টিভিতে এক্টিভ করতে চান?' : 'Want to load this M3U Playlist directly on your TV?'}</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {lang === 'bn'
              ? 'Nest TV HD অ্যাপে অথবা সরাসরি M3U URL পেস্ট করে টিভিতে চালান। Downloader কোড: #84920'
              : 'Use code #84920 on FireStick or import the M3U link into TiviMate / IPTV Smarters / Nest TV App.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://github.com/naimxbzbd/XBZ-Prime-TV/blob/main/playlist.m3u"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>GitHub Repo</span>
          </a>

          <button
            onClick={onSubscribeClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'bn' ? 'প্ল্যান দেখুন' : 'Choose Plan'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
