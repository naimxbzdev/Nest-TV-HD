import React, { useState, useEffect } from 'react';
import { 
  X, Tv, CheckCircle2, Clock, XCircle, Copy, Check, 
  Download, Sparkles, CreditCard, ExternalLink, RefreshCw, 
  User, ShieldCheck, Play 
} from 'lucide-react';
import { authStore } from '../utils/authStore';
import { SubscriptionOrder, User as UserType } from '../types/auth';

interface UserSubscriptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
  currentUser: UserType | null;
  onOpenCheckout: () => void;
  onWatchNowClick: () => void;
}

export const UserSubscriptionsModal: React.FC<UserSubscriptionsModalProps> = ({
  isOpen,
  onClose,
  lang,
  currentUser,
  onOpenCheckout,
  onWatchNowClick,
}) => {
  const [orders, setOrders] = useState<SubscriptionOrder[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadUserOrders = () => {
    if (!currentUser) {
      setOrders([]);
      return;
    }
    // Strict isolation: only returns records for this user
    const userOrders = authStore.getUserOrders(currentUser.id, currentUser.emailOrPhone);
    setOrders(userOrders);
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      loadUserOrders();
    }

    const handleUpdate = () => {
      loadUserOrders();
    };

    window.addEventListener('xbz-orders-change', handleUpdate);
    return () => {
      window.removeEventListener('xbz-orders-change', handleUpdate);
    };
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  const activeOrder = orders.find(o => o.status === 'approved');
  const pendingOrders = orders.filter(o => o.status === 'pending');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadM3U = (order: SubscriptionOrder) => {
    if (!order.credentials) return;
    const content = `#EXTM3U\n#PLAYLIST: Nest TV HD by Naim Xbz (User: ${order.userName})\n#EXTINF:-1 tvg-logo="https://raw.githubusercontent.com/naimxbzbd/XBZ-Prime-TV/main/logos/somoy.png" group-title="News",Somoy TV HD\nhttps://raw.githubusercontent.com/naimxbzbd/XBZ-Prime-TV/main/playlist.m3u\n`;
    const blob = new Blob([content], { type: 'audio/x-mpegurl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nest_tv_${order.credentials.username}.m3u`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#080d20] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/70 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <User className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  {lang === 'bn' ? 'আমার সাবস্ক্রিপশন ও পেমেন্ট হিস্ট্রি' : 'My Subscriptions & Payment History'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {lang === 'bn' ? 'ব্যক্তিগত একাউন্ট' : 'Personal Account'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {currentUser.name} · <span className="font-mono">{currentUser.emailOrPhone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadUserOrders}
              className="p-2 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* 1. ACTIVE SUBSCRIPTION BANNER (IF ANY) */}
          {activeOrder && activeOrder.credentials ? (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-[#071325] border border-cyan-500/40 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-800/40">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'bn' ? 'সক্রিয় সাবস্ক্রিপশন (Active Plan)' : 'Active Subscription'}</span>
                  </div>
                  <h4 className="text-xl font-black text-white">{activeOrder.planNameBn}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {lang === 'bn' ? 'মেয়াদ শেষ হবে:' : 'Valid until:'} <strong className="text-cyan-300">{activeOrder.expiresAt}</strong> ({activeOrder.credentials.activeScreens} টি স্ক্রিন অনুমোদিত)
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onWatchNowClick();
                  }}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-md shadow-cyan-500/25 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-auto"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{lang === 'bn' ? 'এখনই লাইভ দেখুন' : 'Watch Live Now'}</span>
                </button>
              </div>

              {/* Streaming credentials */}
              <div className="mt-4 pt-1">
                <div className="text-xs font-bold text-cyan-300 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'আপনার ব্যক্তিগত IPTV কানেকশন ডিটেইলস:' : 'Your Private IPTV Connection Details:'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-sans">সার্ভার:</span>
                    <span className="text-cyan-300">{activeOrder.credentials.serverUrl}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-sans">ইউজারনেম:</span>
                    <span className="text-cyan-300 font-bold">{activeOrder.credentials.username}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-sans">পাসওয়ার্ড:</span>
                    <span className="text-amber-300 font-bold">{activeOrder.credentials.password}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-sans">স্ক্রিন:</span>
                    <span className="text-white font-bold">{activeOrder.credentials.activeScreens} Devices</span>
                  </div>
                </div>

                {/* M3U Link Copy & Download Buttons */}
                <div className="mt-3 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => handleCopy(activeOrder.credentials?.m3uUrl || '', 'm3u-btn')}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {copiedId === 'm3u-btn' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                    <span>{copiedId === 'm3u-btn' ? 'কপি সফল হয়েছে!' : 'M3U প্লেলিস্ট URL কপি করুন'}</span>
                  </button>

                  <button
                    onClick={() => handleDownloadM3U(activeOrder)}
                    className="py-2 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-xs font-bold text-cyan-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>M3U ফাইল ডাউনলোড</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Tv className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {lang === 'bn' ? 'কোনো সক্রিয় সাবস্ক্রিপশন নেই' : 'No Active Subscription Found'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  {lang === 'bn'
                    ? 'Nest TV HD এর ৩০০+ লাইভ চ্যানেল এবং আল্ট্রা 4K স্ট্রিমিং আনলক করতে আপনার পছন্দের প্ল্যান বেছে নিন।'
                    : 'Choose a subscription plan to unlock 300+ live HD/4K channels with anti-freeze streaming.'}
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'bn' ? 'সাবস্ক্রিপশন প্ল্যান দেখুন' : 'Explore Subscription Plans'}</span>
              </button>
            </div>
          )}

          {/* 2. PENDING ORDERS NOTICE */}
          {pendingOrders.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-spin" />
              <div className="text-xs space-y-1">
                <div className="font-bold text-amber-300">
                  {lang === 'bn' ? 'পেমেন্ট ভেরিফিকেশন অপেক্ষমাণ আছে' : 'Payment Verification Pending'}
                </div>
                <p className="text-slate-300">
                  {lang === 'bn'
                    ? 'আপনার প্রেরিত bKash/Nagad ট্রানজেকশন আইডি অ্যাডমিন কর্তৃক যাচাই করা হচ্ছে। যাচাই সম্পন্ন হলেই সাথে সাথে আপনার একাউন্টে এক্সেস চালু হয়ে যাবে।'
                    : 'Your submitted transaction is being verified by admin. Credentials will activate immediately once approved.'}
                </p>
              </div>
            </div>
          )}

          {/* 3. PAYMENT HISTORY TABLE */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'bn' ? 'পেমেন্ট ও অর্ডার হিস্ট্রি' : 'Payment & Order History'}</span>
              </h4>
              <span className="text-xs text-slate-400">
                {lang === 'bn' ? `মোট ${orders.length} টি লেনদেন` : `${orders.length} transactions`}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                {lang === 'bn' ? 'আপনার কোনো পূর্ববর্তী পেমেন্ট হিস্ট্রি নেই।' : 'No payment history found.'}
              </div>
            ) : (
              <div className="space-y-2.5">
                {orders.map((ord) => {
                  const isPending = ord.status === 'pending';
                  const isApproved = ord.status === 'approved';
                  const isRejected = ord.status === 'rejected';

                  return (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs sm:text-sm">
                            {ord.planNameBn}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                            isPending
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : isApproved
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}>
                            {isPending && <Clock className="w-3 h-3 text-amber-400" />}
                            {isApproved && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                            {isRejected && <XCircle className="w-3 h-3 text-rose-400" />}
                            <span>{ord.status}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono">
                          <span>{ord.gatewayName}</span>
                          <span>•</span>
                          <span>TrxID: <strong className="text-cyan-300">{ord.trxId}</strong></span>
                          <span>•</span>
                          <span>{new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>

                        {ord.adminNote && (
                          <div className="text-[10px] text-slate-400 italic">
                            অ্যাডমিন নোট: {ord.adminNote}
                          </div>
                        )}
                      </div>

                      <div className="text-right sm:self-center shrink-0">
                        <div className="text-base font-extrabold text-white">
                          ৳ {ord.amountBdt} BDT
                        </div>
                        {ord.expiresAt && isApproved && (
                          <div className="text-[10px] text-emerald-400">
                            মেয়াদ: {ord.expiresAt}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'bn' ? '১০০% নিরাপদ ও এনক্রিপ্টেড পেমেন্ট হিস্ট্রি' : '100% Private & Encrypted History'}</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenCheckout();
            }}
            className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
          >
            {lang === 'bn' ? 'নতুন সাবস্ক্রিপশন নিন →' : 'Purchase New Plan →'}
          </button>
        </div>
      </div>
    </div>
  );
};
