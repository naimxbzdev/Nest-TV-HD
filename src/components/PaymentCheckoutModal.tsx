import React, { useState } from 'react';
import { 
  X, Check, Copy, Download, ShieldCheck, CreditCard, 
  Smartphone, ArrowRight, Sparkles, CheckCircle2, QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SubscriptionPlan, PaymentGateway, ActivationCredentials } from '../types/iptv';
import { PAYMENT_GATEWAYS, SUBSCRIPTION_PLANS, CHANNELS_DATA } from '../data/channelsData';
import { authStore } from '../utils/authStore';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: SubscriptionPlan | null;
  lang: 'bn' | 'en';
  onViewHistoryClick?: () => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPlan: initialPlan,
  lang,
  onViewHistoryClick,
}) => {
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>(
    initialPlan || SUBSCRIPTION_PLANS[2] // Default to 3 Months Pro Saver
  );
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>(PAYMENT_GATEWAYS[0]);
  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');

  // Customer Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [trxId, setTrxId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Generated Activation credentials
  const [credentials, setCredentials] = useState<ActivationCredentials | null>(null);

  // Auto-fill logged in user info if available
  React.useEffect(() => {
    if (isOpen) {
      const user = authStore.getCurrentUser();
      if (user) {
        if (!customerName) setCustomerName(user.name);
        if (!customerPhone && user.phone) setCustomerPhone(user.phone);
        if (!customerPhone && !user.phone && !user.emailOrPhone.includes('@')) setCustomerPhone(user.emailOrPhone);
        if (!customerEmail && user.email) setCustomerEmail(user.email);
        if (!customerEmail && user.emailOrPhone.includes('@')) setCustomerEmail(user.emailOrPhone);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate pricing
  const basePrice = currentPlan.priceBdt;
  const discountedPrice = Math.round(basePrice * (1 - discountPercent / 100));

  // Apply Coupon
  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'NEST50' || code === 'XBZ50') {
      setDiscountPercent(50);
      setCouponApplied(true);
    } else if (code === 'EID2026' || code === 'STREAM30') {
      setDiscountPercent(30);
      setCouponApplied(true);
    } else if (code === 'WELCOME') {
      setDiscountPercent(15);
      setCouponApplied(true);
    } else {
      alert(lang === 'bn' ? 'অকার্যকর কুপন কোড! দয়া করে NEST50 ব্যবহার করুন।' : 'Invalid promo code! Try using NEST50.');
    }
  };

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Process Payment & Instant Activation
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerPhone || customerPhone.length < 8) {
      alert(lang === 'bn' ? 'সঠিক মোবাইল নম্বর প্রদান করুন।' : 'Please enter a valid phone number.');
      return;
    }

    if (currentPlan.priceBdt > 0 && selectedGateway.category === 'mfs' && !trxId) {
      alert(lang === 'bn' ? 'পেমেন্ট TrxID বসিয়ে যাচাই করুন।' : 'Please enter the transaction TrxID.');
      return;
    }

    setStep('processing');

    // Simulate instant automated activation verification
    setTimeout(() => {
      const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
      const username = `nest_${cleanPhone.slice(-6) || Math.floor(100000 + Math.random() * 900000)}`;
      const password = Math.random().toString(36).substring(2, 10);
      const serverUrl = 'http://line.nesttv.live:8080';
      const m3uUrl = 'https://raw.githubusercontent.com/naimxbzbd/XBZ-Prime-TV/main/playlist.m3u';
      const epgUrl = `${serverUrl}/xmltv.php?username=${username}&password=${password}`;

      const expiryDays = currentPlan.priceBdt === 0 ? 1 : currentPlan.id.includes('12m') ? 365 : currentPlan.id.includes('3m') ? 90 : 30;
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + expiryDays);

      const generatedCreds = {
        serverUrl,
        username,
        password,
        m3uUrl,
        epgUrl,
        expiresAt: expDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        activeScreens: currentPlan.screens,
      };

      setCredentials(generatedCreds);

      // Save order to persistent authStore so Admin and Customer can track payment history
      const currentUser = authStore.getCurrentUser();
      const effectiveUserId = currentUser ? currentUser.id : `usr-phone-${cleanPhone}`;
      const effectiveUserName = customerName || (currentUser ? currentUser.name : `Customer ${cleanPhone.slice(-4)}`);

      authStore.createOrder({
        userId: effectiveUserId,
        userName: effectiveUserName,
        userEmailOrPhone: customerEmail || customerPhone,
        planId: currentPlan.id,
        planNameBn: currentPlan.nameBn,
        planNameEn: currentPlan.name,
        amountBdt: discountedPrice,
        gatewayId: selectedGateway.id,
        gatewayName: selectedGateway.name,
        senderNumber: customerPhone,
        trxId: trxId.trim() || ('FREE-TRIAL-' + Math.random().toString(36).substring(2, 7).toUpperCase()),
        status: currentPlan.priceBdt === 0 ? 'approved' : 'pending',
        approvedAt: currentPlan.priceBdt === 0 ? new Date().toISOString() : undefined,
        expiresAt: generatedCreds.expiresAt,
        credentials: generatedCreds,
        adminNote: currentPlan.priceBdt === 0 ? '24 Hours Free Trial Activated.' : 'Awaiting admin verification.',
      });

      setStep('success');

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {}
    }, 1200);
  };

  // Download M3U Playlist file directly
  const handleDownloadM3u = () => {
    if (!credentials) return;
    let content = '#EXTM3U\n#PLAYLIST: Nest TV HD by Naim Xbz\n';
    SUBSCRIPTION_PLANS; // keep reference
    const list = CHANNELS_DATA.slice(0, 100);
    list.forEach(c => {
      content += `#EXTINF:-1 tvg-logo="${c.logo}" group-title="${c.categoryLabel}",${c.name}\n${c.streamUrl}\n`;
    });
    const blob = new Blob([content], { type: 'audio/x-mpegurl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nest_tv_hd_${credentials.username}.m3u`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#090d20] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {step === 'success' 
                  ? (lang === 'bn' ? 'অ্যাকাউন্ট সফলভাবে সচল হয়েছে!' : 'Activation Successful!')
                  : (lang === 'bn' ? 'নিরাপদ পেমেন্ট ও এক্টিভেশন' : 'Secure Payment & Activation')}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {step === 'success' ? 'INSTANT XTREAM & M3U GENERATED' : 'AUTOMATED 24/7 INSTANT LINE'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[82vh] overflow-y-auto">
          {step === 'checkout' && (
            <form onSubmit={handleSubmitPayment} className="space-y-6">
              {/* Selected Plan Summary Banner */}
              <div className="p-4 rounded-xl glass-surface border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                    {lang === 'bn' ? 'নির্বাচিত প্ল্যান' : 'SELECTED PLAN'}
                  </div>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {lang === 'bn' ? currentPlan.nameBn : currentPlan.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {currentPlan.screens} {lang === 'bn' ? 'ডিভাইস একসাথে' : 'Screens Simultaneous'} · 300+ 4K Channels
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                    ৳{discountedPrice}
                  </div>
                  {discountPercent > 0 && (
                    <div className="text-xs text-emerald-400 font-semibold">
                      {discountPercent}% OFF applied!
                    </div>
                  )}
                </div>
              </div>

              {/* Promo Code Input */}
              {currentPlan.priceBdt > 0 && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={lang === 'bn' ? 'কুপন কোড (যেমন: NEST50)' : 'Promo Code (e.g. NEST50)'}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs rounded-xl border border-slate-700 cursor-pointer"
                  >
                    {lang === 'bn' ? 'প্রয়োগ করুন' : 'Apply'}
                  </button>
                </div>
              )}

              {/* Customer Contact Details */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 block">
                  {lang === 'bn' ? 'আপনার তথ্য দিন (WhatsApp / Mobile)' : 'Your Mobile Number / WhatsApp'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder={lang === 'bn' ? 'আপনার নাম' : 'Your Full Name'}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX (+880)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Gateway Selector */}
              {currentPlan.priceBdt > 0 && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300 block">
                    {lang === 'bn' ? 'পেমেন্ট মাধ্যম বেছে নিন' : 'Choose Payment Gateway'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {PAYMENT_GATEWAYS.map((gateway) => (
                      <button
                        key={gateway.id}
                        type="button"
                        onClick={() => setSelectedGateway(gateway)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                          selectedGateway.id === gateway.id
                            ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-[11px] font-semibold text-slate-400">
                          {gateway.category.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-white truncate">
                          {gateway.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Gateway Specific Instructions */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                      <div className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-cyan-400" />
                        <span>{selectedGateway.name} {lang === 'bn' ? 'পেমেন্ট নির্দেশিকা' : 'Instructions'}</span>
                      </div>

                      {selectedGateway.merchantNumber && (
                        <div className="flex items-center gap-2 bg-cyan-950/50 border border-cyan-500/40 px-3 py-1.5 rounded-lg">
                          <span className="text-[11px] text-cyan-300 font-medium">
                            {lang === 'bn' ? 'টাকা পাঠানোর নম্বর:' : 'Send Money to:'}
                          </span>
                          <span className="text-xs font-mono font-black text-white tracking-wider select-all">
                            {selectedGateway.merchantNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(selectedGateway.merchantNumber!, 'gatewayNo')}
                            className="p-1 rounded bg-cyan-500/20 text-cyan-300 hover:text-white hover:bg-cyan-500/40 cursor-pointer transition-colors"
                            title={lang === 'bn' ? 'নম্বর কপি করুন' : 'Copy Number'}
                          >
                            {copiedField === 'gatewayNo' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {copiedField === 'gatewayNo' && (
                            <span className="text-[10px] text-emerald-400 font-semibold">
                              {lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Step by Step text */}
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                      {(lang === 'bn' ? selectedGateway.instructions.bn : selectedGateway.instructions.en).map(
                        (inst, i) => (
                          <li key={i}>{inst}</li>
                        )
                      )}
                    </ul>

                    {/* TrxID Field for MFS */}
                    {selectedGateway.category === 'mfs' && (
                      <div className="pt-2">
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          {lang === 'bn' ? 'ট্রানজেকশন আইডি (TrxID) দিন' : 'Enter Transaction ID (TrxID)'}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. BL92A8FK3M"
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono tracking-wider"
                        />
                      </div>
                    )}

                    {/* Card fields */}
                    {selectedGateway.category === 'card' && (
                      <div className="pt-2 space-y-2">
                        <input
                          type="text"
                          placeholder="Card Number (4000 1234 5678 9010)"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="MM / YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                          />
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="CVC / CVV"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-xl shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>
                  {currentPlan.priceBdt === 0
                    ? lang === 'bn' ? 'ফ্রি ট্রায়াল সক্রিয় করুন' : 'Activate 24h Free Trial'
                    : lang === 'bn' ? `৳${discountedPrice} পেমেন্ট কনফার্ম করুন` : `Confirm ৳${discountedPrice} Payment`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step: Processing State */}
          {step === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin mx-auto" />
              <h4 className="text-lg font-bold text-white">
                {lang === 'bn' ? 'পেমেন্ট ও সার্ভার যাচাই হচ্ছে...' : 'Verifying Transaction & Provisioning Server Line...'}
              </h4>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'অনুগ্রহ করে অপেক্ষা করুন, ৫ সেকেন্ডের মধ্যে আপনার লাইন তৈরি হচ্ছে।' : 'Please hold on, creating your personal Xtream Codes API login.'}
              </p>
            </div>
          )}

          {/* Step: Success / Activation Credentials */}
          {step === 'success' && credentials && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white">
                    {lang === 'bn' ? 'অভিনন্দন! আপনার প্রিমিয়াম লাইন অ্যাক্টিভ হয়েছে।' : 'Congratulations! Your IPTV Line is Live.'}
                  </div>
                  <div className="text-xs text-emerald-300">
                    {lang === 'bn' ? `মেয়াদ: ${credentials.expiresAt} পর্যন্ত সচল থাকবে` : `Active until: ${credentials.expiresAt}`}
                  </div>
                </div>
              </div>

              {/* Xtream Codes Login Box */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {lang === 'bn' ? 'Xtream Codes API লগইন তথ্য (টিভি ও অ্যাপের জন্য)' : 'XTREAM CODES API CREDENTIALS'}
                </div>

                <div className="p-4 rounded-xl glass-surface border border-slate-800 space-y-3">
                  {/* Server URL */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400">Server URL:</span>
                    <div className="flex items-center gap-1.5 font-mono text-xs text-white">
                      <span>{credentials.serverUrl}</span>
                      <button
                        onClick={() => handleCopy(credentials.serverUrl, 'serverUrl')}
                        className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400">Username:</span>
                    <div className="flex items-center gap-1.5 font-mono text-xs text-cyan-300 font-bold">
                      <span>{credentials.username}</span>
                      <button
                        onClick={() => handleCopy(credentials.username, 'username')}
                        className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400">Password:</span>
                    <div className="flex items-center gap-1.5 font-mono text-xs text-cyan-300 font-bold">
                      <span>{credentials.password}</span>
                      <button
                        onClick={() => handleCopy(credentials.password, 'password')}
                        className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* M3U Playlist URL Box */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {lang === 'bn' ? 'M3U প্লেলিস্ট লিঙ্ক' : 'M3U PLUS PLAYLIST URL'}
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-slate-300 truncate">
                    {credentials.m3uUrl}
                  </span>
                  <button
                    onClick={() => handleCopy(credentials.m3uUrl, 'm3uUrl')}
                    className="p-1.5 rounded bg-slate-800 text-cyan-300 hover:text-white shrink-0 cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Order Recorded Notice & History Link */}
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs">
                <span className="text-slate-300">
                  {lang === 'bn' 
                    ? 'আপনার এই সাবস্ক্রিপশন অর্ডারটি পেমেন্ট হিস্ট্রিতে সেভ করা হয়েছে।' 
                    : 'This subscription order is saved to your payment history.'}
                </span>
                {onViewHistoryClick && (
                  <button
                    onClick={() => {
                      onClose();
                      onViewHistoryClick();
                    }}
                    className="text-cyan-300 hover:text-white font-bold underline cursor-pointer ml-2 whitespace-nowrap"
                  >
                    {lang === 'bn' ? 'হিস্ট্রি দেখুন →' : 'View History →'}
                  </button>
                )}
              </div>

              {/* Action Buttons: Download M3U / Close */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={handleDownloadM3u}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'প্লেলিস্ট ফাইল ডাউনলোড (.m3u)' : 'Download Playlist (.m3u)'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="py-3 px-6 rounded-xl font-semibold text-xs sm:text-sm text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  {lang === 'bn' ? 'সম্পন্ন করুন' : 'Done'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
