import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LiveWebPlayer } from './components/LiveWebPlayer';
import { ChannelCatalog } from './components/ChannelCatalog';
import { PricingSection } from './components/PricingSection';
import { FeaturesShowcase } from './components/FeaturesShowcase';
import { ReviewsAndFaq } from './components/ReviewsAndFaq';
import { Footer } from './components/Footer';
import { PaymentCheckoutModal } from './components/PaymentCheckoutModal';
import { AppDownloadModal } from './components/AppDownloadModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { UserSubscriptionsModal } from './components/UserSubscriptionsModal';
import { SubscriptionPlan } from './types/iptv';
import { User as UserType } from './types/auth';
import { authStore } from './utils/authStore';
import { SUBSCRIPTION_PLANS, CHANNELS_DATA } from './data/channelsData';
import { Tv, Download, Smartphone, Monitor, ShieldCheck } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionPlan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [activeChannelId, setActiveChannelId] = useState<string>(CHANNELS_DATA[0]?.id || '');
  const [playTrigger, setPlayTrigger] = useState<number>(Date.now());

  // User Auth & Modal States
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => authStore.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isUserSubscriptionsOpen, setIsUserSubscriptionsOpen] = useState(false);

  // Sync auth state across custom events
  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(authStore.getCurrentUser());
    };

    window.addEventListener('xbz-auth-change', handleAuthChange);
    return () => {
      window.removeEventListener('xbz-auth-change', handleAuthChange);
    };
  }, []);

  // Toggle Language
  const toggleLanguage = () => {
    setLang(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  // Scroll to player & immediately trigger playback of the selected channel
  const handlePlayChannel = (channelId: string) => {
    setActiveChannelId(channelId);
    setPlayTrigger(Date.now());
    const playerEl = document.getElementById('live-player-section');
    if (playerEl) {
      playerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll to Live Player
  const handleScrollToPlayer = () => {
    setPlayTrigger(Date.now());
    const playerEl = document.getElementById('live-player-section');
    if (playerEl) {
      playerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll to Pricing Plans
  const handleScrollToPricing = () => {
    const pricingEl = document.getElementById('pricing-plans');
    if (pricingEl) {
      pricingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open Checkout with specific plan or default popular
  const handleOpenCheckout = (plan?: SubscriptionPlan) => {
    setSelectedPlanForCheckout(plan || SUBSCRIPTION_PLANS[2]);
    setIsCheckoutOpen(true);
  };

  // Auth Handlers
  const handleOpenAuth = (tab: 'login' | 'signup' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: UserType) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setIsAdminModalOpen(true);
    } else {
      setIsUserSubscriptionsOpen(true);
    }
  };

  const handleLogout = () => {
    authStore.logout();
    setCurrentUser(null);
    setIsAdminModalOpen(false);
    setIsUserSubscriptionsOpen(false);
  };

  const handleOpenAdminPanel = () => {
    if (!currentUser || currentUser.role !== 'admin') {
      handleOpenAuth('login');
      return;
    }
    setIsAdminModalOpen(true);
  };

  const handleOpenUserSubscriptions = () => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }
    setIsUserSubscriptionsOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050711] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        onWatchNowClick={handleScrollToPlayer}
        onDownloadClick={() => setIsDownloadOpen(true)}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onOpenAdminPanel={handleOpenAdminPanel}
        onOpenUserSubscriptions={handleOpenUserSubscriptions}
        onLogout={handleLogout}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* 1. Hero Section with Smart TV Cinema View */}
        <HeroSection
          lang={lang}
          onWatchNowClick={handleScrollToPlayer}
          onPlayChannel={handlePlayChannel}
          onDownloadClick={() => setIsDownloadOpen(true)}
          onExplorePlansClick={handleScrollToPricing}
        />

        {/* 2. Interactive Live Web TV Player (Watch Now directly online) */}
        <LiveWebPlayer
          selectedChannelId={activeChannelId}
          playTrigger={playTrigger}
          onSelectChannel={(ch) => setActiveChannelId(ch.id)}
          lang={lang}
          onSubscribeClick={() => handleOpenCheckout()}
        />

        {/* 3. 300+ Channel Directory Catalog */}
        <ChannelCatalog
          lang={lang}
          onPlayChannel={handlePlayChannel}
          onSubscribeClick={() => handleOpenCheckout()}
        />

        {/* 4. Infrastructure & Anti-Freeze Features Showcase with Generated Assets */}
        <FeaturesShowcase
          lang={lang}
          onWatchNowClick={handleScrollToPlayer}
          onDownloadClick={() => setIsDownloadOpen(true)}
        />

        {/* 5. In-Page Free App Download Section */}
        <section id="download-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="p-8 sm:p-12 rounded-3xl glass-surface-elevated border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-3">
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>{lang === 'bn' ? 'ফ্রি অ্যাপস ও সেটআপ' : 'FREE COMPANION APPS'}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  {lang === 'bn' 
                    ? 'আপনার স্মার্ট টিভি অথবা ফোনে ফ্রি Nest TV অ্যাপ নামিয়ে নিন' 
                    : 'Download the Free Nest TV HD App on Any Device'}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl">
                  {lang === 'bn'
                    ? 'অ্যান্ড্রয়েড টিভি, ফায়ারস্টিক, অ্যাপল টিভি এবং মোবাইলে মাত্র ২ মিনিটে ইনস্টল করুন। কোনো বাড়তি সাবস্ক্রিপশন চার্জ ছাড়া ফ্রি ডাউনলোড।'
                    : 'Instant APK for Android TV, Downloader shortcode #84920 for FireStick, and native iOS / Windows setup.'}
                </p>

                {/* Quick Platform Chips */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => setIsDownloadOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-semibold text-white cursor-pointer transition-colors"
                  >
                    <Tv className="w-4 h-4 text-cyan-400" />
                    <span>Android TV & FireStick (#84920)</span>
                  </button>

                  <button
                    onClick={() => setIsDownloadOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-semibold text-white cursor-pointer transition-colors"
                  >
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span>Android Phone APK (v4.8)</span>
                  </button>

                  <button
                    onClick={() => setIsDownloadOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-semibold text-white cursor-pointer transition-colors"
                  >
                    <Monitor className="w-4 h-4 text-cyan-400" />
                    <span>Windows PC / Mac</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center sm:items-start lg:items-end justify-center">
                <button
                  onClick={() => setIsDownloadOpen(true)}
                  className="px-6 py-4 rounded-xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-xl shadow-cyan-500/25 transition-all cursor-pointer flex items-center gap-2.5"
                >
                  <Download className="w-5 h-5 text-slate-950" />
                  <span>{lang === 'bn' ? 'ডাউনলোড সেন্টার খুলুন' : 'Open Download Hub'}</span>
                </button>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Free · No Registration Required</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Convenient Subscription Plans & Pricing */}
        <PricingSection
          lang={lang}
          onSelectPlan={(plan) => handleOpenCheckout(plan)}
        />

        {/* 7. Customer Reviews & Interactive FAQ */}
        <ReviewsAndFaq
          lang={lang}
          onGetTrialClick={() => handleOpenCheckout(SUBSCRIPTION_PLANS[0])}
        />
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onWatchNowClick={handleScrollToPlayer}
        onDownloadClick={() => setIsDownloadOpen(true)}
      />

      {/* Payment Gateway & Instant Activation Modal */}
      <PaymentCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlan={selectedPlanForCheckout}
        lang={lang}
        onViewHistoryClick={handleOpenUserSubscriptions}
      />

      {/* Free App Download Modal */}
      <AppDownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        lang={lang}
      />

      {/* Unified Login & Sign Up Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        lang={lang}
        initialTab={authModalTab}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Admin Panel Modal (Exclusive for naimxbz@gmail.com) */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        lang={lang}
      />

      {/* User Isolated Subscriptions & Payment History Modal */}
      <UserSubscriptionsModal
        isOpen={isUserSubscriptionsOpen}
        onClose={() => setIsUserSubscriptionsOpen(false)}
        lang={lang}
        currentUser={currentUser}
        onOpenCheckout={() => handleOpenCheckout()}
        onWatchNowClick={handleScrollToPlayer}
      />
    </div>
  );
}
