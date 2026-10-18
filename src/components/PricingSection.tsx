import React, { useState } from 'react';
import { Check, Sparkles, Shield, Zap, Tv } from 'lucide-react';
import { Currency, SubscriptionPlan } from '../types/iptv';
import { SUBSCRIPTION_PLANS } from '../data/channelsData';

interface PricingSectionProps {
  lang: 'bn' | 'en';
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ lang, onSelectPlan }) => {
  const [currency, setCurrency] = useState<Currency>('BDT');

  const getPrice = (plan: SubscriptionPlan) => {
    if (currency === 'BDT') return `৳${plan.priceBdt}`;
    if (currency === 'USD') return `$${plan.priceUsd}`;
    return `₹${plan.priceInr}`;
  };

  const getOriginalPrice = (plan: SubscriptionPlan) => {
    if (plan.priceBdt === 0) return '';
    if (currency === 'BDT') return `৳${plan.originalPriceBdt}`;
    if (currency === 'USD') return `$${(plan.originalPriceBdt / 100).toFixed(1)}`;
    return `₹${Math.round(plan.originalPriceBdt * 0.88)}`;
  };

  return (
    <section id="pricing-plans" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-3">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>{lang === 'bn' ? 'সুবিধাজনক সাবস্ক্রিপশন প্ল্যান' : 'AFFORDABLE SUBSCRIPTION PLANS'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          {lang === 'bn' ? 'আপনার পছন্দের প্ল্যানটি বেছে নিন' : 'Simple, Transparent Streaming Pricing'}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300">
          {lang === 'bn'
            ? 'বিকাশ, নগদ, রকেট ও কার্ডের মাধ্যমে তাৎক্ষণিক এক্টিভেশন। কোনো গোপন চার্জ নেই।'
            : 'Instant automated Xtream codes & M3U activation. Choose your ideal duration and devices.'}
        </p>

        {/* Currency Switcher (Functional segmented buttons) */}
        <div className="mt-6 inline-flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setCurrency('BDT')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              currency === 'BDT' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🇧🇩 BDT (টাকা)
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              currency === 'USD' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🇺🇸 USD ($)
          </button>
          <button
            onClick={() => setCurrency('INR')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              currency === 'INR' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🇮🇳 INR (₹)
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isFree = plan.priceBdt === 0;
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                plan.isPopular
                  ? 'glass-surface-elevated border-cyan-400/50 shadow-2xl shadow-cyan-950/40 ring-1 ring-cyan-400/40'
                  : 'glass-surface border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Highlight ribbon if popular */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 text-[11px] font-black rounded-full shadow-lg whitespace-nowrap">
                  {lang === 'bn' ? plan.badgeBn || plan.badge : plan.badge}
                </div>
              )}

              <div>
                {/* Plan Title */}
                <h3 className="text-xl font-bold text-white mb-1">
                  {lang === 'bn' ? plan.nameBn : plan.name}
                </h3>
                <div className="text-xs text-slate-400 mb-5">
                  {lang === 'bn' ? plan.durationLabelBn : plan.durationLabel}
                </div>

                {/* Price Display with Tabular Figures */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-extrabold text-white font-mono tabular-nums">
                    {getPrice(plan)}
                  </span>
                  {plan.originalPriceBdt > 0 && (
                    <span className="text-sm text-slate-500 line-through font-mono">
                      {getOriginalPrice(plan)}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-sans">
                    / {isFree ? (lang === 'bn' ? '১ দিন' : '1 Day') : lang === 'bn' ? 'মেয়াদ' : 'period'}
                  </span>
                </div>

                {/* Active Screens Highlight */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5 mb-6 text-xs text-cyan-300 font-semibold">
                  <Tv className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    {plan.screens}{' '}
                    {lang === 'bn'
                      ? `${plan.screens > 1 ? 'টি' : 'টি'} স্ক্রিন একসাথে চলবে`
                      : `Screen${plan.screens > 1 ? 's' : ''} Simultaneous`}
                  </span>
                </div>

                {/* Feature List */}
                <ul className="space-y-3 mb-8 text-xs sm:text-sm text-slate-300">
                  {(lang === 'bn' ? plan.featuresBn : plan.features).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-cyan-400" />
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectPlan(plan)}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  plan.isPopular
                    ? 'bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 shadow-lg shadow-cyan-500/25'
                    : isFree
                    ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                {isFree ? (
                  <span>{lang === 'bn' ? 'ফ্রি ট্রায়াল শুরু করুন' : 'Start Free Trial'}</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'এই প্ল্যানটি নিন' : 'Subscribe Now'}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Note */}
      <div className="mt-12 text-center flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'bn' ? '১০০% ইনস্ট্যান্ট স্বয়ংক্রিয় এক্টিভেশন' : '100% Instant Automated Activation'}</span>
        </div>
        <span aria-hidden="true" className="text-slate-700">·</span>
        <div>{lang === 'bn' ? 'বিকাশ / নগদ / রকেট / ভিসা কার্ড সাপোর্টেড' : 'bKash, Nagad, Rocket & Cards Supported'}</div>
        <span aria-hidden="true" className="text-slate-700">·</span>
        <div>{lang === 'bn' ? '২৪ ঘণ্টা মানি-ব্যাক ও হেল্পলাইন গ্যারান্টি' : '24h Technical Support Guarantee'}</div>
      </div>
    </section>
  );
};
