import React from 'react';
import { Play, Shield, Globe, Heart } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  lang: 'bn' | 'en';
  onWatchNowClick: () => void;
  onDownloadClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onWatchNowClick, onDownloadClick }) => {
  return (
    <footer className="border-t border-slate-800 bg-[#04060d] text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <a href="#" className="inline-block group">
              <BrandLogo size="md" />
            </a>
            <p className="text-slate-400 text-xs leading-relaxed">
              {lang === 'bn'
                ? 'Nest TV HD by Naim Xbz - বাংলাদেশের নির্ভরযোগ্য প্রিমিয়াম আইপিটিভি স্ট্রিমিং ও লাইভ টিভি চ্যানেল প্ল্যাটফর্ম।'
                : 'Nest TV HD by Naim Xbz - Premier IPTV streaming service delivering 300+ live HD/4K television channels with zero-buffer Dhaka CDN acceleration.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">
              {lang === 'bn' ? 'নেভিগেশন' : 'Navigation'}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#live-player-section" className="hover:text-cyan-400 transition-colors">
                  {lang === 'bn' ? 'অনলাইন লাইভ প্লেয়ার' : 'Live Web Player'}
                </a>
              </li>
              <li>
                <a href="#channels-directory" className="hover:text-cyan-400 transition-colors">
                  {lang === 'bn' ? '৩০০+ চ্যানেল তালিকা' : 'Channel Directory'}
                </a>
              </li>
              <li>
                <a href="#pricing-plans" className="hover:text-cyan-400 transition-colors">
                  {lang === 'bn' ? 'সাবস্ক্রিপশন প্ল্যান' : 'Pricing Plans'}
                </a>
              </li>
              <li>
                <a href="#download-section" className="hover:text-cyan-400 transition-colors">
                  {lang === 'bn' ? 'অ্যাপ ডাউনলোড' : 'Download App'}
                </a>
              </li>
              <li>
                <a href="#faq-section" className="hover:text-cyan-400 transition-colors">
                  {lang === 'bn' ? 'প্রশ্নোত্তর' : 'Frequently Asked Questions'}
                </a>
              </li>
            </ul>
          </div>

          {/* Supported Devices */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">
              {lang === 'bn' ? 'সাপোর্টেড ডিভাইস' : 'Supported Platforms'}
            </h4>
            <ul className="space-y-2">
              <li>Android TV & Google TV (Mi / Sony)</li>
              <li>Amazon FireStick 4K & Fire TV</li>
              <li>Apple iOS, iPad & Apple TV 4K</li>
              <li>Samsung Tizen & LG webOS Smart TV</li>
              <li>Windows PC & macOS Desktop</li>
              <li>Google Chrome / Safari / Edge Browser</li>
            </ul>
          </div>

          {/* Payment Partners & Security */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">
              {lang === 'bn' ? 'পেমেন্ট ও নিরাপত্তা' : 'Payment & Security'}
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              {lang === 'bn'
                ? 'বিকাশ, নগদ, রকেট এবং ভিসা ও মাস্টারকার্ডের মাধ্যমে নিরাপদ স্বয়ংক্রিয় লেনদেন।'
                : 'Instant automated line activation with local Bangladesh MFS and global card gateways.'}
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono text-slate-300">
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">bKash</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">Nagad</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">Rocket</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">Visa</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">Mastercard</span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">USDT</span>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Nest TV HD by Naim Xbz. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <span>·</span>
            <a href="#" className="hover:text-slate-400">DMCA Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
