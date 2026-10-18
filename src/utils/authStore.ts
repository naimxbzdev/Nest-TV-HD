import { User, SubscriptionOrder, PaymentOrderStatus } from '../types/auth';

const ADMIN_EMAIL = 'naimxbz@gmail.com';
const ADMIN_PASSWORD = 'K@bbo#12345Naim';

const USERS_STORAGE_KEY = 'xbz_intelligence_users_v2';
const ORDERS_STORAGE_KEY = 'xbz_intelligence_orders_v2';
const CURRENT_USER_KEY = 'xbz_intelligence_current_user_v2';

// Initial seed orders for demonstration so Admin has orders to manage right away
const INITIAL_SEED_ORDERS: SubscriptionOrder[] = [
  {
    id: 'ord-849102',
    userId: 'usr-demo-001',
    userName: 'Tanvir Hossain',
    userEmailOrPhone: 'tanvir@gmail.com',
    planId: 'standard_1m',
    planNameBn: 'স্ট্যান্ডার্ড ১ মাস (Full HD)',
    planNameEn: 'Standard 1 Month (Full HD)',
    amountBdt: 180,
    gatewayId: 'bkash',
    gatewayName: 'bKash (বিকাশ)',
    senderNumber: '01712984521',
    trxId: 'BKH98214KLA',
    status: 'pending',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 mins ago
    credentials: {
      serverUrl: 'http://line.nesttv.live:8080',
      username: 'nest_984521',
      password: 'tan' + Math.random().toString(36).substring(2, 7),
      m3uUrl: 'https://raw.githubusercontent.com/naimxbzbd/XBZ-Prime-TV/main/playlist.m3u',
      epgUrl: 'http://line.nesttv.live:8080/xmltv.php?username=nest_984521',
      activeScreens: 1,
    },
    adminNote: 'Waiting for merchant account payment verification.',
  },
  {
    id: 'ord-739103',
    userId: 'usr-demo-002',
    userName: 'Rahim Sheikh',
    userEmailOrPhone: '01819234812',
    planId: 'premium_3m',
    planNameBn: 'প্রিমিয়াম কোয়ার্টারলি ৩ মাস (4K Ultra)',
    planNameEn: 'Premium 3 Months (4K Ultra)',
    amountBdt: 450,
    gatewayId: 'nagad',
    gatewayName: 'Nagad (নগদ)',
    senderNumber: '01819234812',
    trxId: 'NGD74820PQR',
    status: 'approved',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 88 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    credentials: {
      serverUrl: 'http://line.nesttv.live:8080',
      username: 'nest_234812',
      password: 'rah' + Math.random().toString(36).substring(2, 7),
      m3uUrl: 'https://raw.githubusercontent.com/naimxbzbd/XBZ-Prime-TV/main/playlist.m3u',
      epgUrl: 'http://line.nesttv.live:8080/xmltv.php?username=nest_234812',
      activeScreens: 2,
    },
    adminNote: 'Payment confirmed via Nagad. Subscription active for 90 days.',
  },
  {
    id: 'ord-619201',
    userId: 'usr-demo-003',
    userName: 'Mehedi Hasan',
    userEmailOrPhone: 'mehedi@yahoo.com',
    planId: 'vip_12m',
    planNameBn: 'ভিআইপি আল্টিমেট ১ বছর (4K Ultra + Smart TV)',
    planNameEn: 'VIP Ultimate 1 Year (4K Ultra + Smart TV)',
    amountBdt: 1200,
    gatewayId: 'bkash',
    gatewayName: 'bKash (বিকাশ)',
    senderNumber: '01911482019',
    trxId: 'BKH39108ZTY',
    status: 'approved',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    approvedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    credentials: {
      serverUrl: 'http://line.nesttv.live:8080',
      username: 'nest_482019',
      password: 'meh' + Math.random().toString(36).substring(2, 7),
      m3uUrl: 'https://raw.githubusercontent.com/naimxbzbd/XBZ-Prime-TV/main/playlist.m3u',
      epgUrl: 'http://line.nesttv.live:8080/xmltv.php?username=nest_482019',
      activeScreens: 4,
    },
    adminNote: 'VIP 1 Year plan activated. 4-screens authorized.',
  }
];

interface StoredAccount {
  user: User;
  passwordHash: string; // Plain/stored password
}

// Helper to get all registered accounts
function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      // Seed default admin account + sample regular user
      const defaultAccounts: StoredAccount[] = [
        {
          user: {
            id: 'admin-naimxbz',
            name: 'Naim Xbz (Admin)',
            emailOrPhone: ADMIN_EMAIL,
            email: ADMIN_EMAIL,
            role: 'admin',
            createdAt: '2026-01-01T00:00:00.000Z',
          },
          passwordHash: ADMIN_PASSWORD,
        },
        {
          user: {
            id: 'usr-demo-001',
            name: 'Tanvir Hossain',
            emailOrPhone: 'tanvir@gmail.com',
            email: 'tanvir@gmail.com',
            phone: '01712984521',
            role: 'user',
            createdAt: '2026-02-10T12:00:00.000Z',
          },
          passwordHash: '123456',
        }
      ];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultAccounts));
      return defaultAccounts;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading accounts from localStorage', e);
    return [];
  }
}

function saveStoredAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Error saving accounts to localStorage', e);
  }
}

export const authStore = {
  // Current logged in user
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null) {
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
      window.dispatchEvent(new Event('xbz-auth-change'));
    } catch (e) {
      console.error('Error setting current user', e);
    }
  },

  logout() {
    this.setCurrentUser(null);
  },

  // Login: checks both admin credentials and registered users
  login(identifier: string, password: string): { success: boolean; user?: User; error?: string } {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPw = password.trim();

    if (!cleanId || !cleanPw) {
      return { success: false, error: 'দয়া করে ইমেইল/ফোন নম্বর এবং পাসওয়ার্ড প্রদান করুন।' };
    }

    // Special check for Admin
    if (cleanId === ADMIN_EMAIL.toLowerCase() && cleanPw === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 'admin-naimxbz',
        name: 'Naim Xbz (Admin)',
        emailOrPhone: ADMIN_EMAIL,
        email: ADMIN_EMAIL,
        role: 'admin',
        createdAt: '2026-01-01T00:00:00.000Z',
      };
      this.setCurrentUser(adminUser);
      return { success: true, user: adminUser };
    }

    // Check stored user accounts
    const accounts = getStoredAccounts();
    const found = accounts.find(
      acc => acc.user.emailOrPhone.toLowerCase() === cleanId ||
             acc.user.email?.toLowerCase() === cleanId ||
             (acc.user.phone && acc.user.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, ''))
    );

    if (!found) {
      return { success: false, error: 'কোনো একাউন্ট পাওয়া যায়নি। দয়া করে সাইন আপ (Create Account) করুন।' };
    }

    if (found.passwordHash !== cleanPw) {
      return { success: false, error: 'পাসওয়ার্ড সঠিক নয়। দয়া করে আবার চেষ্টা করুন।' };
    }

    this.setCurrentUser(found.user);
    return { success: true, user: found.user };
  },

  // Register a new user
  signup(name: string, identifier: string, password: string): { success: boolean; user?: User; error?: string } {
    const cleanName = name.trim();
    const cleanId = identifier.trim().toLowerCase();
    const cleanPw = password.trim();

    if (!cleanName) {
      return { success: false, error: 'দয়া করে আপনার পূর্ণ নাম লিখুন।' };
    }

    if (!cleanId || cleanId.length < 5) {
      return { success: false, error: 'সঠিক ইমেইল বা ১১ ডিজিটের মোবাইল নম্বর দিন।' };
    }

    if (cleanPw.length < 6) {
      return { success: false, error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' };
    }

    // Don't allow creating fake admin via regular signup
    if (cleanId === ADMIN_EMAIL.toLowerCase()) {
      return { success: false, error: 'এই ইমেইলটি সংরক্ষিত। দয়া করে লগইন করুন।' };
    }

    const accounts = getStoredAccounts();
    const existing = accounts.find(
      acc => acc.user.emailOrPhone.toLowerCase() === cleanId ||
             acc.user.email?.toLowerCase() === cleanId ||
             (acc.user.phone && acc.user.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, ''))
    );

    if (existing) {
      return { success: false, error: 'এই নম্বর বা ইমেইল দিয়ে ইতিমধ্যে একাউন্ট খোলা আছে। দয়া করে লগইন করুন।' };
    }

    const isEmail = cleanId.includes('@');
    const newUser: User = {
      id: 'usr-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      name: cleanName,
      emailOrPhone: cleanId,
      email: isEmail ? cleanId : undefined,
      phone: !isEmail ? cleanId : undefined,
      role: 'user', // strictly regular user!
      createdAt: new Date().toISOString(),
    };

    accounts.push({
      user: newUser,
      passwordHash: cleanPw,
    });

    saveStoredAccounts(accounts);
    this.setCurrentUser(newUser);

    return { success: true, user: newUser };
  },

  // Get all registered users (for admin panel)
  getAllUsers(): User[] {
    const accounts = getStoredAccounts();
    return accounts.map(a => a.user);
  },

  // ---------------- ORDER MANAGEMENT & USER ISOLATION ---------------- //

  getAllOrders(): SubscriptionOrder[] {
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_SEED_ORDERS));
        return INITIAL_SEED_ORDERS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_SEED_ORDERS;
    }
  },

  // Strictly isolated: only orders belonging to the specified user
  getUserOrders(userId: string, userEmailOrPhone?: string): SubscriptionOrder[] {
    const all = this.getAllOrders();
    const cleanTargetId = (userEmailOrPhone || '').toLowerCase().trim();
    const cleanPhoneDigits = cleanTargetId.replace(/[^0-9]/g, '');

    return all.filter(order => {
      // Direct user ID match
      if (order.userId && order.userId === userId) return true;

      // Or matching phone / email identifier
      if (cleanTargetId && order.userEmailOrPhone) {
        const orderIdClean = order.userEmailOrPhone.toLowerCase().trim();
        if (orderIdClean === cleanTargetId) return true;
        const orderPhoneDigits = orderIdClean.replace(/[^0-9]/g, '');
        if (cleanPhoneDigits.length >= 8 && orderPhoneDigits.endsWith(cleanPhoneDigits)) return true;
      }

      if (cleanPhoneDigits.length >= 8 && order.senderNumber) {
        const senderClean = order.senderNumber.replace(/[^0-9]/g, '');
        if (senderClean.endsWith(cleanPhoneDigits)) return true;
      }

      return false;
    });
  },

  saveOrders(orders: SubscriptionOrder[]) {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      window.dispatchEvent(new Event('xbz-orders-change'));
    } catch (e) {
      console.error('Error saving orders', e);
    }
  },

  // Create / Record a new subscription checkout
  createOrder(orderData: Omit<SubscriptionOrder, 'id' | 'createdAt' | 'status'> & { status?: PaymentOrderStatus }): SubscriptionOrder {
    const all = this.getAllOrders();
    const newOrder: SubscriptionOrder = {
      ...orderData,
      id: 'ord-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      status: orderData.status || 'pending',
    };

    all.unshift(newOrder);
    this.saveOrders(all);
    return newOrder;
  },

  // Admin approves / updates order status
  updateOrderStatus(
    orderId: string, 
    status: PaymentOrderStatus, 
    adminNote?: string, 
    extendDays?: number
  ): boolean {
    const all = this.getAllOrders();
    const index = all.findIndex(o => o.id === orderId);
    if (index === -1) return false;

    const order = all[index];
    order.status = status;
    if (adminNote !== undefined) {
      order.adminNote = adminNote;
    }

    if (status === 'approved') {
      order.approvedAt = new Date().toISOString();
      const days = extendDays || (order.planId.includes('12m') ? 365 : order.planId.includes('3m') ? 90 : 30);
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + days);
      order.expiresAt = expDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      
      // Ensure credentials exist
      if (!order.credentials) {
        const cleanPhone = (order.senderNumber || order.userEmailOrPhone).replace(/[^0-9]/g, '');
        const username = `nest_${cleanPhone.slice(-6) || Math.floor(100000 + Math.random() * 900000)}`;
        const password = Math.random().toString(36).substring(2, 8);
        order.credentials = {
          serverUrl: 'http://line.nesttv.live:8080',
          username,
          password,
          m3uUrl: 'https://raw.githubusercontent.com/naimxbzbd/XBZ-Prime-TV/main/playlist.m3u',
          epgUrl: `http://line.nesttv.live:8080/xmltv.php?username=${username}`,
          activeScreens: order.planId.includes('vip') ? 4 : order.planId.includes('premium') ? 2 : 1,
        };
      }
    }

    all[index] = order;
    this.saveOrders(all);
    return true;
  },

  // Admin deletes an order
  deleteOrder(orderId: string): boolean {
    const all = this.getAllOrders();
    const filtered = all.filter(o => o.id !== orderId);
    if (filtered.length !== all.length) {
      this.saveOrders(filtered);
      return true;
    }
    return false;
  },

  // Admin extends validity
  extendSubscription(orderId: string, extraDays: number): boolean {
    const all = this.getAllOrders();
    const index = all.findIndex(o => o.id === orderId);
    if (index === -1) return false;

    const order = all[index];
    order.status = 'approved';
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + extraDays);
    order.expiresAt = expDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    order.adminNote = (order.adminNote ? order.adminNote + ' | ' : '') + `মেয়াদ +${extraDays} দিন বর্ধিত করা হয়েছে।`;

    all[index] = order;
    this.saveOrders(all);
    return true;
  }
};
