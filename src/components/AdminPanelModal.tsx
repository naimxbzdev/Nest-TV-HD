import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Search, Filter, CheckCircle2, XCircle, 
  Clock, Plus, Copy, Check, Users, Tv, RefreshCw, 
  ExternalLink, Trash2, Calendar, Phone, Hash, CreditCard 
} from 'lucide-react';
import { authStore } from '../utils/authStore';
import { SubscriptionOrder, User as UserType } from '../types/auth';
import { SUBSCRIPTION_PLANS } from '../data/channelsData';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'users' | 'manual_grant'>('subscriptions');
  const [orders, setOrders] = useState<SubscriptionOrder[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Selected order for viewing/editing credentials modal
  const [viewingCredentialsOrder, setViewingCredentialsOrder] = useState<SubscriptionOrder | null>(null);

  // Manual Grant form state
  const [manualName, setManualName] = useState('');
  const [manualPhoneOrEmail, setManualPhoneOrEmail] = useState('');
  const [manualPlanId, setManualPlanId] = useState('standard_1m');
  const [manualNotes, setManualNotes] = useState('Admin issued account.');
  const [manualSuccessMsg, setManualSuccessMsg] = useState<string | null>(null);

  const loadData = () => {
    setOrders(authStore.getAllOrders());
    setUsers(authStore.getAllUsers());
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }

    const handleOrderChange = () => {
      loadData();
    };

    window.addEventListener('xbz-orders-change', handleOrderChange);
    window.addEventListener('xbz-auth-change', handleOrderChange);

    return () => {
      window.removeEventListener('xbz-orders-change', handleOrderChange);
      window.removeEventListener('xbz-auth-change', handleOrderChange);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Stats calculation
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const approvedOrders = orders.filter(o => o.status === 'approved');
  const totalRevenue = approvedOrders.reduce((sum, o) => sum + (o.amountBdt || 0), 0);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmailOrPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.senderNumber.includes(searchTerm) ||
      order.trxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApprove = (orderId: string) => {
    authStore.updateOrderStatus(orderId, 'approved', 'Payment verified and subscription activated by Admin.');
    loadData();
  };

  const handleReject = (orderId: string) => {
    const reason = prompt(
      lang === 'bn' 
        ? 'বাতিল করার কারণ লিখুন (যেমন: TrxID পাওয়া যায়নি বা ভুল নম্বর):' 
        : 'Enter rejection reason:', 
      lang === 'bn' ? 'টাকা ক্রেডিট হয়নি অথবা ভুল TrxID।' : 'Payment not received or invalid TrxID.'
    );
    if (reason !== null) {
      authStore.updateOrderStatus(orderId, 'rejected', reason);
      loadData();
    }
  };

  const handleExtend = (orderId: string, days: number) => {
    authStore.extendSubscription(orderId, days);
    loadData();
  };

  const handleDelete = (orderId: string) => {
    if (confirm(lang === 'bn' ? 'আপনি কি নিশ্চিত যে এই অর্ডারটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this order?')) {
      authStore.deleteOrder(orderId);
      loadData();
    }
  };

  const handleManualGrantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualPhoneOrEmail) return;

    const plan = SUBSCRIPTION_PLANS.find(p => p.id === manualPlanId) || SUBSCRIPTION_PLANS[1];
    const cleanPhone = manualPhoneOrEmail.replace(/[^0-9]/g, '');
    const username = `nest_${cleanPhone.slice(-6) || Math.floor(100000 + Math.random() * 900000)}`;
    const password = Math.random().toString(36).substring(2, 8);

    const expDate = new Date();
    const days = manualPlanId.includes('12m') ? 365 : manualPlanId.includes('3m') ? 90 : 30;
    expDate.setDate(expDate.getDate() + days);

    authStore.createOrder({
      userId: 'usr-manual-' + Date.now(),
      userName: manualName,
      userEmailOrPhone: manualPhoneOrEmail,
      planId: plan.id,
      planNameBn: plan.nameBn,
      planNameEn: plan.name,
      amountBdt: plan.priceBdt,
      gatewayId: 'admin_manual',
      gatewayName: 'Admin Direct Grant',
      senderNumber: manualPhoneOrEmail,
      trxId: 'ADMIN-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      status: 'approved',
      approvedAt: new Date().toISOString(),
      expiresAt: expDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      adminNote: manualNotes,
      credentials: {
        serverUrl: 'http://line.nesttv.live:8080',
        username,
        password,
        m3uUrl: 'https://raw.githubusercontent.com/naimxbzbd/XBZ-Prime-TV/main/playlist.m3u',
        epgUrl: `http://line.nesttv.live:8080/xmltv.php?username=${username}`,
        activeScreens: plan.screens,
      }
    });

    setManualSuccessMsg(lang === 'bn' ? 'ম্যানুয়াল সাবস্ক্রিপশন সফলভাবে প্রদান করা হয়েছে!' : 'Subscription issued successfully!');
    setManualName('');
    setManualPhoneOrEmail('');
    loadData();
    setTimeout(() => {
      setManualSuccessMsg(null);
      setActiveTab('subscriptions');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#070b1a] border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/80 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80 gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-amber-400/50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  {lang === 'bn' ? 'অ্যাডমিন কন্ট্রোল ও সাবস্ক্রিপশন ম্যানেজমেন্ট' : 'Admin Subscription Control Panel'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ADMIN: naimxbz@gmail.com
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'bn' 
                  ? 'গ্রাহকদের bKash/Nagad পেমেন্ট TrxID যাচাই করুন এবং অনুমোদন প্রদান করুন।'
                  : 'Verify customer bKash/Nagad payments, approve subscriptions, and issue credentials.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/40 border-b border-slate-800/80 shrink-0">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-medium text-slate-400">মোট রিকোয়েস্ট</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">{totalOrders}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="text-[11px] font-medium text-amber-300 flex items-center justify-between">
              <span>পেন্ডিং ভেরিফিকেশন</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">{pendingOrders.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="text-[11px] font-medium text-emerald-300">অ্যাক্টিভ / অনুমোদিত</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">{approvedOrders.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <div className="text-[11px] font-medium text-cyan-300">মোট সংগৃহীত রাজস্ব</div>
            <div className="text-xl sm:text-2xl font-black text-cyan-400 mt-1">৳ {totalRevenue.toLocaleString('en-BD')}</div>
          </div>
        </div>

        {/* MFS Gateway Alert Bar */}
        <div className="px-5 py-2.5 bg-cyan-950/30 border-b border-cyan-800/40 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            <span>
              টাকা পাঠানোর অফিসিয়াল নম্বর: <strong className="text-cyan-300 font-mono">01703223141</strong> (bKash & Nagad)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            গ্রাহকের প্রেরিত TrxID আপনার ফোনে আসা SMS-এর সাথে মিলিয়ে অ্যাপ্রুভ বাটনে ক্লিক করুন।
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-5 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'subscriptions'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>{lang === 'bn' ? 'সাবস্ক্রিপশন ও পেমেন্ট রিকোয়েস্ট' : 'Subscription Requests'}</span>
            {pendingOrders.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                {pendingOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'users'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{lang === 'bn' ? 'ইউজার তালিকা' : 'Registered Users'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('manual_grant')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'manual_grant'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'bn' ? 'ম্যানুয়াল সাবস্ক্রিপশন তৈরি' : 'Issue Subscription'}</span>
          </button>
        </div>

        {/* TAB 1: SUBSCRIPTIONS & PAYMENTS */}
        {activeTab === 'subscriptions' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={lang === 'bn' ? 'TrxID, ফোন নম্বর, বা নাম দিয়ে খুঁজুন...' : 'Search by TrxID, Phone, or Name...'}
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
              </div>

              {/* Status pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  সব ({orders.length})
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === 'pending'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-amber-400 hover:bg-slate-800'
                  }`}
                >
                  পেন্ডিং ({pendingOrders.length})
                </button>
                <button
                  onClick={() => setStatusFilter('approved')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === 'approved'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-900 text-emerald-400 hover:bg-slate-800'
                  }`}
                >
                  অনুমোদিত ({approvedOrders.length})
                </button>
                <button
                  onClick={() => setStatusFilter('rejected')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === 'rejected'
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-900 text-rose-400 hover:bg-slate-800'
                  }`}
                >
                  বাতিল ({orders.filter(o => o.status === 'rejected').length})
                </button>
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-slate-400 border border-dashed border-slate-800 rounded-2xl">
                কোনো সাবস্ক্রিপশন রেকর্ড পাওয়া যায়নি।
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const isPending = order.status === 'pending';
                  const isApproved = order.status === 'approved';
                  const isRejected = order.status === 'rejected';

                  return (
                    <div
                      key={order.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isPending 
                          ? 'bg-[#0f1429] border-amber-500/40 shadow-lg shadow-amber-950/20' 
                          : isApproved 
                          ? 'bg-[#0a0f24] border-slate-800/80 hover:border-cyan-500/30' 
                          : 'bg-[#0a0e20] border-rose-900/30 opacity-75'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Left Info */}
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-white text-sm sm:text-base">
                              {order.userName}
                            </span>
                            <span className="text-xs text-slate-400">
                              ({order.userEmailOrPhone})
                            </span>
                            {/* Status badge */}
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                              isPending
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : isApproved
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}>
                              {isPending && <Clock className="w-3 h-3 text-amber-400 animate-spin" />}
                              {isApproved && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                              {isRejected && <XCircle className="w-3 h-3 text-rose-400" />}
                              <span>{order.status}</span>
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Order ID: #{order.id}
                            </span>
                          </div>

                          {/* Plan and Price info */}
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <span className="font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800/50">
                              {order.planNameBn}
                            </span>
                            <span className="font-black text-white text-sm">
                              ৳ {order.amountBdt} BDT
                            </span>
                            <span className="text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              {new Date(order.createdAt).toLocaleString('en-GB', { 
                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                              })}
                            </span>
                            {order.expiresAt && (
                              <span className="text-emerald-400 font-medium">
                                মেয়াদ: {order.expiresAt} পর্যন্ত
                              </span>
                            )}
                          </div>

                          {/* Payment details: TrxID, sender number, gateway */}
                          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-wrap items-center gap-4 text-xs font-mono">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500">গেটওয়ে:</span>
                              <span className="text-white font-sans font-bold">{order.gatewayName}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-slate-400">প্রেরক নম্বর:</span>
                              <span className="text-cyan-300 font-bold">{order.senderNumber}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                              <Hash className="w-3.5 h-3.5 text-amber-400" />
                              <span className="text-slate-400">TrxID:</span>
                              <span className="text-amber-300 font-bold select-all">{order.trxId}</span>
                              <button
                                onClick={() => handleCopy(order.trxId, `trx-${order.id}`)}
                                className="text-slate-400 hover:text-white cursor-pointer ml-1"
                                title="Copy TrxID"
                              >
                                {copiedId === `trx-${order.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Admin Note if any */}
                          {order.adminNote && (
                            <div className="text-[11px] text-slate-400 italic">
                              নোট: {order.adminNote}
                            </div>
                          )}
                        </div>

                        {/* Right Action Buttons */}
                        <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 shrink-0">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleApprove(order.id)}
                                className="px-4 py-2 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>অনুমোদন ও চালু করুন</span>
                              </button>
                              <button
                                onClick={() => handleReject(order.id)}
                                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 cursor-pointer flex items-center gap-1.5"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>বাতিল</span>
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <>
                              <button
                                onClick={() => setViewingCredentialsOrder(order)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 cursor-pointer flex items-center gap-1.5"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>ক্রেডেনশিয়ালস ভিউ</span>
                              </button>
                              <button
                                onClick={() => handleExtend(order.id, 30)}
                                className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 cursor-pointer"
                                title="Add 30 Days"
                              >
                                +৩০ দিন মেয়াদ বৃদ্ধি
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REGISTERED USERS */}
        {activeTab === 'users' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            <div className="text-xs text-slate-400 mb-2">
              সিস্টেমে নিবন্ধিত মোট ব্যবহারকারী ({users.length} জন):
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {users.map(u => {
                const userOrders = authStore.getUserOrders(u.id, u.emailOrPhone);
                const activeOrder = userOrders.find(o => o.status === 'approved');

                return (
                  <div key={u.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{u.name}</span>
                        {u.role === 'admin' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            ADMIN
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                            USER
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 font-mono">
                      {u.emailOrPhone}
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        মোট অর্ডার: <strong className="text-white">{userOrders.length} টি</strong>
                      </span>
                      {activeOrder ? (
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>অ্যাক্টিভ গ্রাহক</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">কোনো সক্রিয় প্ল্যান নেই</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: MANUAL GRANT */}
        {activeTab === 'manual_grant' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-xl mx-auto w-full">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">গ্রাহককে সরাসরি সাবস্ক্রিপশন প্রদান করুন</h3>
                <p className="text-xs text-slate-400 mt-1">
                  কোনো TrxID ছাড়াই অ্যাডমিন সরাসরি যেকোনো ফোন বা ইমেইলে ফুল এক্সেস চালু করতে পারেন।
                </p>
              </div>

              {manualSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{manualSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleManualGrantSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">গ্রাহকের নাম</label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="যেমন: সোহেল রানা"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">মোবাইল নম্বর অথবা ইমেইল</label>
                  <input
                    type="text"
                    required
                    value={manualPhoneOrEmail}
                    onChange={(e) => setManualPhoneOrEmail(e.target.value)}
                    placeholder="017XXXXXXXX বা customer@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">সাবস্ক্রিপশন প্ল্যান</label>
                  <select
                    value={manualPlanId}
                    onChange={(e) => setManualPlanId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-cyan-400"
                  >
                    {SUBSCRIPTION_PLANS.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nameBn} - ৳{p.priceBdt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">অ্যাডমিন নোট</label>
                  <input
                    type="text"
                    value={manualNotes}
                    onChange={(e) => setManualNotes(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-lg cursor-pointer"
                >
                  সাবস্ক্রিপশন জেনারেট ও একটিভ করুন
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW / EDIT CREDENTIALS POPUP */}
        {viewingCredentialsOrder && viewingCredentialsOrder.credentials && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#090e24] border border-cyan-500/40 rounded-2xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Tv className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-bold text-white text-sm">
                    {viewingCredentialsOrder.userName} এর IPTV ক্রেডেনশিয়ালস
                  </h4>
                </div>
                <button
                  onClick={() => setViewingCredentialsOrder(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Xtream Server:</span>
                  <span className="font-mono text-cyan-300">{viewingCredentialsOrder.credentials.serverUrl}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Username:</span>
                  <span className="font-mono text-cyan-300 font-bold">{viewingCredentialsOrder.credentials.username}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Password:</span>
                  <span className="font-mono text-amber-300 font-bold">{viewingCredentialsOrder.credentials.password}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">M3U Playlist:</span>
                  <button
                    onClick={() => handleCopy(viewingCredentialsOrder.credentials?.m3uUrl || '', 'm3u-cred')}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{copiedId === 'm3u-cred' ? 'কপি হয়েছে!' : 'M3U লিঙ্ক কপি করুন'}</span>
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">অনুমোদিত স্ক্রিন:</span>
                  <span className="text-white font-bold">{viewingCredentialsOrder.credentials.activeScreens} টি ডিভাইস</span>
                </div>
              </div>

              <button
                onClick={() => setViewingCredentialsOrder(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
