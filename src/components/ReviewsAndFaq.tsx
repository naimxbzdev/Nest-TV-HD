import React, { useState } from 'react';
import { ChevronDown, Star, HelpCircle, MessageSquareQuote, Check } from 'lucide-react';
import { FAQS_DATA, TESTIMONIALS_DATA } from '../data/channelsData';

interface ReviewsAndFaqProps {
  lang: 'bn' | 'en';
  onGetTrialClick: () => void;
}

export const ReviewsAndFaq: React.FC<ReviewsAndFaqProps> = ({ lang, onGetTrialClick }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
      {/* Testimonials Block */}
      <div className="mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-3">
            <MessageSquareQuote className="w-4 h-4" />
            <span>{lang === 'bn' ? 'গ্রাহকদের বাস্তব অভিজ্ঞতা' : 'VERIFIED SUBSCRIBER REVIEWS'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'bn' ? 'হাজারো পরিবারের প্রথম পছন্দ Nest TV HD by Naim Xbz' : 'Trusted by Thousands of Sports Fans & Families - Nest TV HD'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.map((t, i) => (
            <div
              key={i}
              className="glass-surface p-6 rounded-2xl border border-slate-800 flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Comment Quote */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{t.name}</div>
                  <div className="text-[11px] text-slate-400">{t.role} · {t.location}</div>
                </div>

                <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  {t.verifiedPurchase}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion Block */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>{lang === 'bn' ? 'সাধারণ জিজ্ঞাসা' : 'FREQUENTLY ASKED QUESTIONS'}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            {lang === 'bn' ? 'আপনার মনে থাকা প্রশ্নগুলোর উত্তর' : 'Everything You Need to Know'}
          </h3>
        </div>

        <div className="space-y-3">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="glass-surface rounded-xl border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/40"
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {lang === 'bn' ? faq.qBn : faq.qEn}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                    {lang === 'bn' ? faq.aBn : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="text-sm font-bold text-white">
              {lang === 'bn' ? 'আরও কোনো প্রশ্ন বা টিভি সেটআপে সাহায্য চান?' : 'Need live setup help on WhatsApp?'}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {lang === 'bn' ? 'আমাদের টেকনিক্যাল সাপোর্ট টিম সার্বক্ষণিক প্রস্তুত।' : 'Our 24/7 technical team is available to assist your smart TV setup.'}
            </div>
          </div>

          <a
            href="https://wa.me/8801703223141?text=Hello%20Nest%20TV%20HD%20Support"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow whitespace-nowrap cursor-pointer"
          >
            {lang === 'bn' ? 'হোয়াটসঅ্যাপে মেসেজ দিন' : 'Chat on WhatsApp'}
          </a>
        </div>
      </div>
    </section>
  );
};
