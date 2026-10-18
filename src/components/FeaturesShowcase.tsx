import React from 'react';
import { Zap, ShieldCheck, RefreshCw, Cpu, Server, Wifi, Play, Tv } from 'lucide-react';

interface FeaturesShowcaseProps {
  lang: 'bn' | 'en';
  onWatchNowClick: () => void;
  onDownloadClick: () => void;
}

export const FeaturesShowcase: React.FC<FeaturesShowcaseProps> = ({
  lang,
  onWatchNowClick,
  onDownloadClick,
}) => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>{lang === 'bn' ? 'অত্যাধুনিক প্রযুক্তি' : 'NEXT-GEN STREAMING ARCHITECTURE'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          {lang === 'bn' ? 'বাফারিং মুক্ত ৪K স্ট্রিমিং কেন আমরা সেরা?' : 'Why Nest TV HD Outperforms Traditional Cable & IPTV'}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300">
          {lang === 'bn'
            ? 'আমাদের রয়েছে ঢাকা লোকাল BDIX ও সিঙ্গাপুর ক্লাউড নোড, যার ফলে পিক টাইমেও ক্রিকেট বা ফুটবল কোনো লোডিং ছাড়াই মসৃণ চলে।'
            : 'Engineered with Anti-Freeze V8 HLS protocol, low-latency transcoding, and multi-device cloud synchronisation.'}
        </p>
      </div>

      {/* Asymmetric Bento-Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Bento Card 1: Multi-Device Sync Showcase with Generated Image (7 Cols) */}
        <div className="lg:col-span-7 glass-surface rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between group">
          <div className="p-6 sm:p-8">
            <div className="text-xs font-bold text-cyan-400 tracking-wider uppercase mb-2">
              {lang === 'bn' ? 'এক সাবস্ক্রিপশনে সব ডিভাইসে' : 'UNIVERSAL HARDWARE COMPATIBILITY'}
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lang === 'bn'
                ? 'স্মার্ট টিভি, মোবাইল ও পিসিতে একই সাথে উপভোগ করুন'
                : 'Watch Synchronously on TV, Mobile, Tablet & PC'}
            </h3>
            <p className="mt-3 text-sm text-slate-300 max-w-xl">
              {lang === 'bn'
                ? 'ড্রয়িং রুমে বড় ৮৫" ৪K টিভি থেকে শুরু করে শোবার ঘরে ফোন কিংবা অফিসে ল্যাপটপ—আপনার অ্যাকাউন্ট সব ডিভাইসেই প্রস্তুত।'
                : 'Native support for Android TV, Apple iOS, Amazon FireStick 4K, Samsung Tizen, LG webOS, and modern desktop browsers.'}
            </p>
          </div>

          {/* High Fidelity Generated Image */}
          <div className="relative w-full h-[280px] sm:h-[340px] overflow-hidden mt-2">
            <img
              src="/src/assets/images/iptv_multi_device_1792263390196.jpg"
              alt="Multi-device IPTV synchronized screens"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs">
              <span className="font-mono text-cyan-300 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800">
                4 Simultaneous Streams Supported
              </span>
              <button
                onClick={onDownloadClick}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold transition-colors cursor-pointer"
              >
                {lang === 'bn' ? 'অ্যাপ ডাউনলোড করুন' : 'Get Apps'}
              </button>
            </div>
          </div>
        </div>

        {/* Bento Card 2: Sports Stadium & 60 FPS Ultra Bitrate (5 Cols) */}
        <div className="lg:col-span-5 glass-surface rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between group">
          <div className="p-6 sm:p-8">
            <div className="text-xs font-bold text-cyan-400 tracking-wider uppercase mb-2">
              {lang === 'bn' ? 'সরাসরি স্টেডিয়াম থেকে' : 'ULTRA-HD 60FPS LIVE SPORTS'}
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              {lang === 'bn' ? 'ক্রিকেট ও ফুটবল ম্যাচ সরাসরি স্টেডিয়ামের আমেজে' : 'Feel the Stadium Pulse at 60 FPS'}
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              {lang === 'bn'
                ? 'টি স্পোর্টস, স্টার স্পোর্টস ১ এইচডি এবং স্কাই স্পোর্টসে প্রতিটি বল ও গোলের তীব্র উত্তেজনা কোনো ড্রপ ফ্রেম ছাড়াই।'
                : 'Dedicated 10Gbps unthrottled bandwidth ensures crisp ball tracking and razor-sharp turf textures during peak sports events.'}
            </p>
          </div>

          <div className="relative w-full h-[220px] sm:h-[260px] overflow-hidden">
            <img
              src="/src/assets/images/sports_cricket_football_1792263390923.jpg"
              alt="Live 4K sports stadium floodlit pitch"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20 pointer-events-none" />

            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
              <span className="text-[11px] font-mono text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-emerald-800/40">
                ● 60 FPS ZERO-DROP
              </span>
              <button
                onClick={onWatchNowClick}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur cursor-pointer"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Watch Sports</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Editorial Feature Pillars (Clean human numbering, no mechanical comments) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Feature 1 */}
        <div className="p-6 rounded-2xl glass-surface border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">
            {lang === 'bn' ? '১. অ্যান্টি-ফ্রিজ ভি৮ প্রযুক্তি' : '01. Anti-Freeze V8 Cache'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {lang === 'bn'
              ? 'আমাদের এআই অ্যালগরিদম প্রতিটি ফ্রেম ৩ সেকেন্ড পূর্বে বাফারিং ক্যাশে প্রিলোড করে রাখে, ফলে দুর্বল নেটওয়ার্কেও কোনো বাফার হয় না।'
              : 'Predictive frame buffering and adaptive bitrate switching eliminate loading rings even on unstable connections.'}
          </p>
        </div>

        {/* Feature 2 */}
        <div className="p-6 rounded-2xl glass-surface border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400 mb-4">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">
            {lang === 'bn' ? '২. ৭ দিনের ক্যাচ-আপ ও রিমাইন্ডার' : '02. 7-Day Catch-Up & Rewind'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {lang === 'bn'
              ? 'কাজের ব্যস্ততায় পছন্দের সিরিয়াল বা খেলার ম্যাচ মিস হয়ে গেছে? যেকোনো সময় গত ৭ দিনের যেকোনো অনুষ্ঠান রিওয়াইন্ড করে দেখুন।'
              : 'Never miss a match or primetime bulletin. Automatically record and rewind broadcasts up to 7 full days on cloud storage.'}
          </p>
        </div>

        {/* Feature 3 */}
        <div className="p-6 rounded-2xl glass-surface border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-4">
            <Server className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">
            {lang === 'bn' ? '৩. ঢাকা ও আন্তর্জাতিক সার্ভার' : '03. Dhaka BDIX & Global Nodes'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {lang === 'bn'
              ? 'ঢাকা, সিঙ্গাপুর, লন্ডন ও ফ্রাঙ্কফুর্টের ডেডিকেটেড ক্লাস্টার সার্ভার নিশ্চিত করে ৯৯.৯% নিরবচ্ছিন্ন লাইভ স্ট্রিম আপটাইম।'
              : 'Direct peering with major ISPs and low-hop routing ensure ping latency under 15ms inside Bangladesh and nearby regions.'}
          </p>
        </div>
      </div>
    </section>
  );
};
