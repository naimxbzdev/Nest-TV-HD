import React, { useState } from 'react';
import { 
  X, LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff, 
  ShieldCheck, AlertCircle, CheckCircle2, Sparkles, KeyRound 
} from 'lucide-react';
import { authStore } from '../utils/authStore';
import { User as UserType } from '../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
  onLoginSuccess: (user: UserType) => void;
  initialTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLoginSuccess,
  initialTab = 'login',
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupIdentifier, setSignupIdentifier] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Status feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = authStore.login(loginIdentifier, loginPassword);
      setIsLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || (lang === 'bn' ? 'লগইন ব্যর্থ হয়েছে।' : 'Login failed.'));
      } else if (res.user) {
        setSuccessMsg(
          res.user.role === 'admin' 
            ? (lang === 'bn' ? 'অ্যাডমিন হিসেবে লগইন সফল হয়েছে!' : 'Logged in as Admin successfully!') 
            : (lang === 'bn' ? `স্বাগতম, ${res.user.name}!` : `Welcome back, ${res.user.name}!`)
        );
        setTimeout(() => {
          onLoginSuccess(res.user!);
          onClose();
        }, 600);
      }
    }, 400);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (signupPassword !== signupConfirmPassword) {
      setErrorMsg(lang === 'bn' ? 'পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না।' : 'Passwords do not match.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = authStore.signup(signupName, signupIdentifier, signupPassword);
      setIsLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || (lang === 'bn' ? 'রেজিস্ট্রেশন ব্যর্থ হয়েছে।' : 'Signup failed.'));
      } else if (res.user) {
        setSuccessMsg(lang === 'bn' ? 'আপনার একাউন্ট সফলভাবে তৈরি হয়েছে!' : 'Account created successfully!');
        setTimeout(() => {
          onLoginSuccess(res.user!);
          onClose();
        }, 700);
      }
    }, 450);
  };

  // Quick autofill for Admin
  const handleAutoFillAdmin = () => {
    setTab('login');
    setLoginIdentifier('naimxbz@gmail.com');
    setLoginPassword('K@bbo#12345Naim');
    setErrorMsg(null);
  };

  // Quick autofill for Regular User
  const handleAutoFillUser = () => {
    setTab('login');
    setLoginIdentifier('tanvir@gmail.com');
    setLoginPassword('123456');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#080d1f] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Glow ambient header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {tab === 'login' 
                  ? (lang === 'bn' ? 'একাউন্টে লগইন করুন' : 'Sign In to Your Account') 
                  : (lang === 'bn' ? 'নতুন একাউন্ট খুলুন' : 'Create Free Account')}
              </h3>
              <p className="text-[11px] text-slate-400">
                {tab === 'login'
                  ? (lang === 'bn' ? 'এডমিন ও ইউজার সবার জন্য সমন্বিত প্যানেল' : 'Unified portal for users & admin')
                  : (lang === 'bn' ? 'ফোন বা ইমেইল দিয়ে মাত্র ৩০ সেকেন্ডে সাইন আপ' : 'Register in 30 seconds with phone or email')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Login vs Sign Up */}
        <div className="flex border-b border-slate-800/80 bg-slate-950/40 p-1.5 gap-1.5 m-4 rounded-xl">
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>{lang === 'bn' ? 'লগইন (Sign In)' : 'Sign In'}</span>
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              tab === 'signup'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{lang === 'bn' ? 'সাইন আপ (Sign Up)' : 'Sign Up'}</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        <div className="px-5">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="px-5 pb-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'bn' ? 'ইমেইল অথবা মোবাইল নম্বর' : 'Email or Mobile Number'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: naimxbz@gmail.com বা 017xxxxxxxx' : 'e.g. naimxbz@gmail.com or 017xxxxxxxx'}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl text-sm text-white placeholder-slate-500 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl text-sm text-white placeholder-slate-500 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
                </>
              )}
            </button>

            {/* Quick Demo Access Bar */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="text-[11px] font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'bn' ? 'ওয়ান-ক্লিক টেস্ট ক্রেডেনশিয়াল:' : 'Quick autofill credentials:'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAutoFillAdmin}
                  className="px-2.5 py-1.5 text-[11px] font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-left transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Admin login: naimxbz@gmail.com"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">Admin (naimxbz)</span>
                </button>
                <button
                  type="button"
                  onClick={handleAutoFillUser}
                  className="px-2.5 py-1.5 text-[11px] font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-left transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Demo user login"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Demo User</span>
                </button>
              </div>
              <p className="mt-2 text-[10px] text-slate-400 text-center">
                {lang === 'bn'
                  ? '🔒 অ্যাডমিন অ্যাক্সেস কেবল naimxbz@gmail.com এর জন্য সংরক্ষিত।'
                  : '🔒 Admin access is strictly reserved for naimxbz@gmail.com.'}
              </p>
            </div>
          </form>
        )}

        {/* SIGN UP FORM */}
        {tab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="px-5 pb-5 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'bn' ? 'আপনার পূর্ণ নাম' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: মোহাম্মদ রাকিব' : 'e.g. John Doe'}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl text-sm text-white placeholder-slate-500 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'bn' ? 'মোবাইল নম্বর অথবা ইমেইল' : 'Mobile Number or Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={signupIdentifier}
                  onChange={(e) => setSignupIdentifier(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: 01712345678 বা rakib@gmail.com' : '017XXXXXXXX or your@email.com'}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl text-sm text-white placeholder-slate-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full pl-8 pr-8 py-2 bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'bn' ? 'পুনরায় পাসওয়ার্ড' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full pl-8 pr-3 py-2 bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'একাউন্ট তৈরি করুন' : 'Create My Account'}</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              {lang === 'bn'
                ? 'একাউন্ট খুলে আপনি শুধুমাত্র আপনার নিজস্ব সাবস্ক্রিপশন ও পেমেন্ট হিস্ট্রি দেখতে পারবেন।'
                : 'Your subscriptions & payment history are strictly private to your account.'}
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
