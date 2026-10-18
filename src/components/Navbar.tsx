import React, { useState } from 'react';
import { 
  Play, Globe, Menu, X, Download, LogIn, LogOut, 
  ShieldCheck, User as UserIcon, CreditCard 
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { User as UserType } from '../types/auth';

interface NavbarProps {
  lang: 'bn' | 'en';
  onToggleLang: () => void;
  onWatchNowClick: () => void;
  onDownloadClick: () => void;
  currentUser: UserType | null;
  onOpenAuth: (tab?: 'login' | 'signup') => void;
  onOpenAdminPanel: () => void;
  onOpenUserSubscriptions: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  onWatchNowClick,
  onDownloadClick,
  currentUser,
  onOpenAuth,
  onOpenAdminPanel,
  onOpenUserSubscriptions,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050711]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 h-18">
        {/* Zone 1: Single brand lockup */}
        <a href="#" className="flex items-center gap-2 whitespace-nowrap shrink-0 group">
          <BrandLogo size="md" />
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#live-player-section" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            {lang === 'bn' ? 'লাইভ টিভি' : 'Live Player'}
          </a>
          <a href="#channels-directory" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            {lang === 'bn' ? '৩০০+ চ্যানেল' : '300+ Channels'}
          </a>
          <a href="#pricing-plans" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            {lang === 'bn' ? 'সাবস্ক্রিপশন প্ল্যান' : 'Pricing Plans'}
          </a>
          <a href="#download-section" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            {lang === 'bn' ? 'অ্যাপ ডাউনলোড' : 'Download App'}
          </a>
          <a href="#faq-section" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            {lang === 'bn' ? 'প্রশ্নোত্তর' : 'FAQ'}
          </a>
        </nav>

        {/* Zone 3: Auth & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Toggle Button */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 rounded-lg border border-slate-700/80 transition-colors cursor-pointer"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'bn' ? 'EN' : 'বাংলা'}</span>
          </button>

          {/* User Auth State / Profile / Admin Buttons */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              {currentUser.role === 'admin' ? (
                <button
                  onClick={onOpenAdminPanel}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-md shadow-amber-500/10"
                  title="Admin Dashboard"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">{lang === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
                  <span className="sm:hidden font-mono">Admin</span>
                </button>
              ) : (
                <button
                  onClick={onOpenUserSubscriptions}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer shadow-md shadow-cyan-500/10"
                  title="My Subscriptions & Payment History"
                >
                  <UserIcon className="w-4 h-4 text-cyan-400" />
                  <span className="max-w-[110px] truncate">{currentUser.name.split(' ')[0]}</span>
                  <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    {lang === 'bn' ? 'হিস্ট্রি' : 'History'}
                  </span>
                </button>
              )}

              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
                title={lang === 'bn' ? 'লগআউট' : 'Logout'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-cyan-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 rounded-xl transition-all cursor-pointer shadow-sm shadow-cyan-500/10 whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'bn' ? 'লগইন / সাইন আপ' : 'Login / Sign Up'}</span>
            </button>
          )}

          {/* Primary CTA Button */}
          <button
            onClick={onWatchNowClick}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>{lang === 'bn' ? 'লাইভ দেখুন' : 'Watch Now'}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#080c1d] px-4 pt-3 pb-5 space-y-3">
          {/* Mobile User Profile Section */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 mb-2">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{currentUser.emailOrPhone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {currentUser.role === 'admin' ? (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAdminPanel();
                      }}
                      className="px-2.5 py-1 text-xs font-bold text-amber-300 bg-amber-500/20 rounded-lg border border-amber-500/40"
                    >
                      Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenUserSubscriptions();
                      }}
                      className="px-2.5 py-1 text-xs font-bold text-cyan-300 bg-cyan-500/20 rounded-lg border border-cyan-500/40"
                    >
                      হিস্ট্রি
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="p-1 text-slate-400 hover:text-rose-400"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-slate-400">
                  {lang === 'bn' ? 'একাউন্টে লগইন বা সাইন আপ করুন' : 'Sign in or create account'}
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400"
                >
                  {lang === 'bn' ? 'লগইন / সাইন আপ' : 'Sign In'}
                </button>
              </div>
            )}
          </div>

          <nav className="flex flex-col gap-1 text-sm font-medium text-slate-200">
            {currentUser && currentUser.role === 'admin' && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminPanel();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-amber-300 hover:bg-slate-800 text-left font-bold"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{lang === 'bn' ? 'অ্যাডমিন কন্ট্রোল ও সাবস্ক্রিপশন প্যানেল' : 'Admin Control Panel'}</span>
              </button>
            )}

            {currentUser && currentUser.role === 'user' && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenUserSubscriptions();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-cyan-300 hover:bg-slate-800 text-left font-bold"
              >
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'bn' ? 'আমার সাবস্ক্রিপশন ও পেমেন্ট হিস্ট্রি' : 'My Subscriptions & History'}</span>
              </button>
            )}

            <a 
              href="#live-player-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              {lang === 'bn' ? 'লাইভ টিভি প্লেয়ার' : 'Live Player'}
            </a>
            <a 
              href="#channels-directory" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              {lang === 'bn' ? '৩০০+ চ্যানেল ডিরেক্টরি' : '300+ Channels'}
            </a>
            <a 
              href="#pricing-plans" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              {lang === 'bn' ? 'সাবস্ক্রিপশন প্ল্যান' : 'Pricing Plans'}
            </a>
            <a 
              href="#download-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              {lang === 'bn' ? 'অ্যাপ ডাউনলোড' : 'Download App'}
            </a>
            <a 
              href="#faq-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              {lang === 'bn' ? 'প্রশ্নোত্তর' : 'FAQ'}
            </a>
          </nav>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onWatchNowClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{lang === 'bn' ? 'এখনই লাইভ দেখুন' : 'Watch Live Now'}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onDownloadClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white bg-slate-800 border border-slate-700"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ফ্রি অ্যাপ ডাউনলোড করুন' : 'Download Free App'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
