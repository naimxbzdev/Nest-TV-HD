import { Channel, SubscriptionPlan, AppPlatform, PaymentGateway } from '../types/iptv';
import m3uChannelsStatic from './m3uChannels.json';

// All genuine channels loaded and parsed from https://github.com/naimxbzbd/XBZ-Prime-TV/blob/main/playlist.m3u
export const CHANNELS_DATA: Channel[] = (m3uChannelsStatic as any[]).map((c) => ({
  ...c,
  epgCurrent: {
    title: `${c.name} - Live Broadcast Feed`,
    titleBn: `${c.name} - সরাসরি লাইভ সম্প্রচার`,
    time: '24/7 Continuous Feed',
    progressPercent: 55,
  },
  epgNext: {
    title: `${c.name} - Upcoming Program`,
    titleBn: `${c.name} - পরবর্তী বিশেষ শো`,
    time: 'Next On Air',
  },
}));

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'trial-24h',
    name: '24-Hour Free Trial',
    nameBn: '২৪ ঘণ্টার ফ্রি ট্রায়াল',
    durationLabel: '24 Hours',
    durationLabelBn: '২৪ ঘণ্টা সম্পূর্ণ ফ্রি',
    priceBdt: 0,
    priceUsd: 0,
    priceInr: 0,
    originalPriceBdt: 50,
    screens: 1,
    badge: 'FREE TEST',
    badgeBn: 'ফ্রি টেস্ট',
    features: [
      'Access to 300+ Live Channels',
      'FHD 1080p Stream Quality',
      'Android / TV / FireStick Support',
      'Instant Xtream / M3U Activation',
      'No Credit Card Required'
    ],
    featuresBn: [
      '৩০০+ লাইভ চ্যানেলের অ্যাক্সেস',
      '১০৮০পি ফুল এইচডি কোয়ালিটি',
      'স্মার্ট টিভি ও মোবাইলে ব্যবহারযোগ্য',
      'তাৎক্ষণিক ইউজারনেম ও পাসওয়ার্ড',
      'কোনো কার্ড বা আগাম পেমেন্ট ছাড়াই'
    ]
  },
  {
    id: 'starter-1m',
    name: '1 Month Starter',
    nameBn: '১ মাস রেগুলার প্ল্যান',
    durationLabel: '1 Month',
    durationLabelBn: '১ মাস মেয়াদ',
    priceBdt: 250,
    priceUsd: 2.5,
    priceInr: 220,
    originalPriceBdt: 350,
    screens: 1,
    features: [
      '300+ Live HD & FHD Channels',
      '1 Device Active Connection',
      '7 Days Electronic Program Guide (EPG)',
      'Anti-Freeze V8 CDN Acceleration',
      'Dhaka & Singapore Low Latency Nodes',
      '24/7 WhatsApp Tech Support'
    ],
    featuresBn: [
      '৩০০+ লাইভ এইচডি ও ফুল এইচডি চ্যানেল',
      '১টি ডিভাইসে একসাথে চলবে',
      '৭ দিনের পূর্ণাঙ্গ টিভি গাইড (ইপিজি)',
      'অ্যান্টি-ফ্রিজ ভি৮ বাফারলেস টেকনোলজি',
      'ঢাকা ও সিঙ্গাপুর ফাস্ট ক্যাশ সার্ভার',
      '২৪/৭ হোয়াটসঅ্যাপ হেল্পলাইন সাপোর্ট'
    ]
  },
  {
    id: 'popular-3m',
    name: '3 Months Pro Saver',
    nameBn: '৩ মাস প্রো সেভার প্ল্যান',
    durationLabel: '3 Months',
    durationLabelBn: '৩ মাস মেয়াদ (জনপ্রিয়)',
    priceBdt: 650,
    priceUsd: 6.9,
    priceInr: 580,
    originalPriceBdt: 900,
    screens: 2,
    isPopular: true,
    badge: 'MOST POPULAR · SAVE 28%',
    badgeBn: 'সবচেয়ে জনপ্রিয় · ২৮% ছাড়',
    features: [
      '300+ All Channels in 4K UHD & 60FPS',
      '2 Simultaneous Screens (TV + Phone)',
      'Catch-up TV (Rewind 7 Days)',
      'Zero Buffering High-Priority Dhaka CDN',
      'Free Smart TV & FireStick Setup Guide',
      'Dedicated VIP Support Manager'
    ],
    featuresBn: [
      '৩০০+ সব চ্যানেল ফোরকে আল্ট্রা এইচডি ও ৬০ এফপিএস',
      '২টি ডিভাইসে একসাথে দেখা যাবে (টিভি + মোবাইল)',
      'মিস হওয়া অনুষ্ঠান ৭ দিন পর্যন্ত রিওয়াইন্ড সুবিধা',
      'জিরো বাফারিং হাই প্রায়োরিটি ঢাকা সিডিএন',
      'অ্যান্ড্রয়েড টিভি ও ফায়ারস্টিক সম্পূর্ণ সেটআপ গাইড',
      'ডেডিকেটেড ভিআইপি সাপোর্ট ও ফাস্ট রিপ্লাই'
    ]
  },
  {
    id: 'vip-12m',
    name: '12 Months Cinema Pass',
    nameBn: '১ বছর ভিআইপি সিনেমা পাস',
    durationLabel: '1 Full Year',
    durationLabelBn: '১ পূর্ণ বছর (সেরা অফার)',
    priceBdt: 1999,
    priceUsd: 19.9,
    priceInr: 1750,
    originalPriceBdt: 3600,
    screens: 4,
    badge: 'BEST VALUE · 4 SCREENS',
    badgeBn: 'সেরা ডিল · ৪টি স্ক্রিন একসাথে',
    features: [
      '300+ Live Channels + 12,000+ VOD Movies',
      '4 Simultaneous Screens for Entire Family',
      'Uncapped 4K HDR & Dolby 5.1 Surround',
      'Dedicated 10 Gbps Tier-1 VIP Bandwidth',
      'Full Catch-up & DVR Cloud Storage',
      'Free Premium App License Included'
    ],
    featuresBn: [
      '৩০০+ লাইভ টিভি + ১২,০০০+ মুভি ও ওয়েব সিরিজ',
      'একসাথে ৪টি স্ক্রিনে পরিবারের সবাই দেখতে পারবে',
      'আল্ট্রা ফোরকে এইচডিআর ও ডলবি অডিও সাপোর্ট',
      'ডেডিকেটেড ১০ জিবিপিএস ভিআইপি ব্যান্ডউইথ',
      '৭ দিনের ক্লাউড ক্যাচ-আপ ও অটো রেকর্ডিং',
      'প্রিমিয়াম অ্যাপ অ্যাক্টিভেশন সম্পূর্ণ ফ্রি'
    ]
  }
];

export const PAYMENT_GATEWAYS: PaymentGateway[] = [
  {
    id: 'bkash',
    name: 'bKash (বিকাশ)',
    category: 'mfs',
    logoColor: '#e2136e',
    merchantNumber: '01703223141',
    accountType: 'Personal Send Money (পার্সোনাল সেন্ড মানি)',
    chargePercent: 0,
    instructions: {
      en: [
        'Open your bKash Mobile App or dial *247#',
        'Choose "Send Money" to 01703223141',
        'Enter exact plan amount as specified',
        'Use your Phone number as Reference',
        'Enter your bKash PIN to confirm transaction',
        'Copy the TrxID (Transaction ID) and paste below'
      ],
      bn: [
        'আপনার বিকাশ অ্যাপ খুলুন অথবা *247# ডায়াল করুন',
        'নম্বর 01703223141 তে "Send Money" করুন',
        'প্ল্যানের নির্ধারিত টাকার পরিমাণ দিন',
        'রেফারেন্সে আপনার মোবাইল নম্বরটি লিখুন',
        'পিন দিয়ে ট্রানজেকশন সফল হলে পাওয়া TrxID নিচে বসিয়ে যাচাই করুন'
      ]
    }
  },
  {
    id: 'nagad',
    name: 'Nagad (নগদ)',
    category: 'mfs',
    logoColor: '#f7941d',
    merchantNumber: '01703223141',
    accountType: 'Personal Send Money (সেন্ড মানি)',
    chargePercent: 0,
    instructions: {
      en: [
        'Open your Nagad App or dial *167#',
        'Send money to Nagad number: 01703223141',
        'Enter total plan amount',
        'Enter your phone number in Reference',
        'Confirm with your secret PIN',
        'Submit the 8-character Nagad TrxID below'
      ],
      bn: [
        'আপনার নগদ অ্যাপ ওপেন করুন অথবা *167# ডায়াল করুন',
        'নগদ নম্বর 01703223141 তে সেন্ড মানি করুন',
        'মোট টাকার পরিমাণ লিখুন',
        'রেফারেন্স বক্সে আপনার মোবাইল নম্বর দিন',
        'পিন দিয়ে পেমেন্ট কনফার্ম করে TrxID টি নিচে দিন'
      ]
    }
  },
  {
    id: 'rocket',
    name: 'Rocket (রকেট) / Upay',
    category: 'mfs',
    logoColor: '#8c288e',
    merchantNumber: '01703223141',
    accountType: 'Personal Send Money',
    chargePercent: 0,
    instructions: {
      en: [
        'Open Rocket or Upay App',
        'Send Money to number: 01703223141',
        'Put your mobile number in reference',
        'Paste the TrxID below to verify instantly'
      ],
      bn: [
        'রকেট অথবা উপায় অ্যাপ থেকে সেন্ড মানি করুন',
        'নম্বর: 01703223141',
        'পেমেন্ট শেষ করে ট্রানজেকশন আইডি নিচে পেস্ট করুন'
      ]
    }
  },
  {
    id: 'card',
    name: 'Visa / Mastercard / AMEX',
    category: 'card',
    logoColor: '#0284c7',
    chargePercent: 0,
    instructions: {
      en: [
        'Instant automated card payment processing',
        'Supports all local Bangladeshi and International debit/credit cards',
        'Instant account activation after OTP approval'
      ],
      bn: [
        'যেকোনো ব্যাংকের ভিসা, মাস্টারকার্ড ও অ্যামেক্স কার্ড সাপোর্টেড',
        'ওটিপি সাবমিট করার সাথে সাথেই তাৎক্ষণিক এক্টিভেশন পেয়ে যাবেন'
      ]
    }
  },
  {
    id: 'crypto',
    name: 'Binance Pay / USDT / Crypto',
    category: 'crypto',
    logoColor: '#f3ba2f',
    chargePercent: 0,
    instructions: {
      en: [
        'Pay with USDT (TRC20 / BEP20) or Binance Pay ID: 84920193',
        'Instant automated confirmation within 30 seconds'
      ],
      bn: [
        'ইউএসডিটি (TRC20/BEP20) অথবা বাইন্যান্স পে আইডি: 84920193 এর মাধ্যমে পেমেন্ট করুন',
        '৩০ সেকেন্ডের মধ্যে স্বয়ংক্রিয়ভাবে অ্যাকাউন্ট সচল হয়ে যাবে'
      ]
    }
  }
];

export const APP_PLATFORMS: AppPlatform[] = [
  {
    id: 'android-apk',
    name: 'Android Mobile & Tablet',
    deviceGroup: 'Mobile',
    version: 'v4.8.2 (Latest 2026)',
    size: '34.8 MB',
    downloadUrl: '#download-android-apk',
    requirements: 'Android 6.0 or higher',
    instructionsEn: [
      'Click the "Download APK" button below to save the installer.',
      'Open the downloaded file and allow "Install from Unknown Sources" if prompted.',
      'Open Nest TV HD App, select "Login with Xtream Codes", and enter your credentials.'
    ],
    instructionsBn: [
      'নিচের "Download APK" বাটনে ক্লিক করে ফাইলটি ডাউনলোড করুন।',
      'ডাউনলোড শেষে ফাইলে ক্লিক করুন এবং পারমিশন চাইলে "Allow" করুন।',
      'অ্যাপ ওপেন করে আপনার প্রাপ্ত ইউজারনেম ও পাসওয়ার্ড দিয়ে লগইন করে লাইভ টিভি উপভোগ করুন।'
    ]
  },
  {
    id: 'android-tv',
    name: 'Android TV / Google TV / Mi Box',
    deviceGroup: 'TV',
    version: 'v4.8.2 TV Edition',
    size: '38.2 MB',
    downloadUrl: '#download-tv-apk',
    downCode: '84920',
    requirements: 'Android TV 8+, Sony Bravia, Mi Box, Walton, Realme TV',
    instructionsEn: [
      'Install the "Downloader" app on your TV from Google Play Store.',
      'Open Downloader and type shortcode "84920" in the URL bar, then press GO.',
      'The Nest TV HD APK will download and prompt to install automatically.',
      'Log in with your provided Xtream codes or scan the TV QR code.'
    ],
    instructionsBn: [
      'টিভি প্লে-স্টোর থেকে "Downloader" অ্যাপটি ইনস্টল করুন।',
      'Downloader অ্যাপের ইউআরএল বক্সে টাইপ করুন কোড "84920" এবং GO চাপুন।',
      'স্বয়ংক্রিয়ভাবে টিভি অ্যাপটি ডাউনলোড হবে এবং ইনস্টল হয়ে যাবে।',
      'আপনার দেয়া ইউজারনেম ও পাসওয়ার্ড বসিয়ে রিমোট দিয়ে উপভোগ করুন।'
    ]
  },
  {
    id: 'firestick',
    name: 'Amazon FireStick & Fire TV',
    deviceGroup: 'TV',
    version: 'v4.8.2 Fire Edition',
    size: '38.2 MB',
    downloadUrl: '#download-firestick',
    downCode: '84920',
    requirements: 'Fire OS 5 or above (4K & Lite supported)',
    instructionsEn: [
      'Go to FireStick Settings > My Fire TV > Developer Options > Enable Apps from Unknown Sources.',
      'Open the Downloader app and enter code "84920".',
      'Click Install when the download completes and launch Nest TV HD.'
    ],
    instructionsBn: [
      'ফায়ারস্টিকের Settings > My Fire TV > Developer Options এ গিয়ে "Unknown Sources" চালু করুন।',
      'Downloader অ্যাপ ওপেন করে টাইপ করুন "84920"।',
      'ডাউনলোড শেষ হলে Install চাপুন এবং লাইভ টিভি উপভোগ করুন।'
    ]
  },
  {
    id: 'apple-ios',
    name: 'Apple iOS, iPad & Apple TV',
    deviceGroup: 'Mobile',
    version: 'IPTV Smarters Pro iOS',
    size: '42 MB',
    downloadUrl: 'https://apps.apple.com/app/iptv-smarters-pro/id1383614972',
    requirements: 'iOS 13+ / tvOS 14+',
    instructionsEn: [
      'Install "IPTV Smarters Pro" from the Apple App Store.',
      'Choose "Login with Xtream Codes API".',
      'Enter Server URL: http://line.nesttv.live:8080 along with your username and password.'
    ],
    instructionsBn: [
      'অ্যাপল অ্যাপ স্টোর থেকে "IPTV Smarters Pro" অথবা "GSE Smart IPTV" নামিয়ে নিন।',
      'লগইন অপশনে "Xtream Codes API" সিলেক্ট করুন।',
      'আমাদের সার্ভার URL: http://line.nesttv.live:8080 এবং আপনার ইউজারনেম পাসওয়ার্ড দিন।'
    ]
  },
  {
    id: 'pc-windows',
    name: 'Windows PC & macOS Player',
    deviceGroup: 'PC',
    version: 'v3.2.0 Desktop Suite',
    size: '64.5 MB',
    downloadUrl: '#download-windows-pc',
    requirements: 'Windows 10/11 or macOS 11+ (Intel / Apple Silicon)',
    instructionsEn: [
      'Download and run the Nest TV HD Desktop installer or use VLC Player.',
      'If using VLC Player: Open VLC > Media > Open Network Stream > Paste your M3U Playlist URL.',
      'All 300+ channels will load instantly in high bitrate 60FPS.'
    ],
    instructionsBn: [
      'উইন্ডোজ অথবা ম্যাকের জন্য ডেক্সটপ প্লেয়ার ইন্সটলার ডাউনলোড করুন অথবা VLC প্লেয়ার ব্যবহার করুন।',
      'VLC তে গিয়ে Media > Open Network Stream এ গিয়ে আপনার M3U লিঙ্কটি পেস্ট করুন।',
      'মুহূর্তেই ৩০০০+ লাইভ চ্যানেল লোড হয়ে যাবে।'
    ]
  },
  {
    id: 'samsung-lg-tv',
    name: 'Samsung Tizen & LG webOS Smart TV',
    deviceGroup: 'TV',
    version: 'IBO Player / Smart IPTV',
    size: 'Built-in TV App',
    downloadUrl: '#smart-tv-guide',
    requirements: 'Samsung Smart TV (2018+) or LG webOS (2018+)',
    instructionsEn: [
      'Open your TV App Store (Samsung Apps / LG Content Store) and search for "IBO Player" or "Smart IPTV".',
      'Install and launch the app. Note down the Device ID and Device Key shown on the TV screen.',
      'Send the ID to our WhatsApp support, and we will remotely bind your 300+ channels within 2 minutes!'
    ],
    instructionsBn: [
      'আপনার স্যামসাং বা এলজি টিভির অ্যাপ স্টোর থেকে "IBO Player" বা "Smart IPTV" ইনস্টল করুন।',
      'টিভি স্ক্রিনে আসা Device MAC / Device Key লিখে আমাদের হোয়াটসঅ্যাপে পাঠান।',
      'আমরা ২ মিনিটের মধ্যে সরাসরি আপনার টিভিতে সমস্ত চ্যানেল সচল করে দেবো।'
    ]
  }
];

export const FAQS_DATA = [
  {
    qEn: 'Can I watch 300+ channels directly on my browser without downloading any app?',
    qBn: 'কোনো অ্যাপ ডাউনলোড না করেই কি ব্রাউজারে সরাসরি ৩০০+ চ্যানেল দেখা যাবে?',
    aEn: 'Yes! Our Web TV Player works in real-time on any browser (Chrome, Safari, Edge, Firefox). Simply click the "Watch Now" button, select any channel from the list, and enjoy instant live streaming with 4K resolution and zero lag.',
    aBn: 'হ্যাঁ! আমাদের ওয়েব প্লেয়ার যেকোনো ব্রাউজারে (Chrome, Safari, Edge, Firefox) সরাসরি কাজ করে। উপরে "Watch Now" বাটনে ক্লিক করে যেকোনো চ্যানেল সিলেক্ট করলেই সাথে সাথে লাইভ স্ট্রিমিং শুরু হবে।'
  },
  {
    qEn: 'How much internet speed is required for 4K and FHD streaming?',
    qBn: 'ফোরকে ও ফুল এইচডি চ্যানেলের জন্য কত স্পিড ইন্টারনেট প্রয়োজন?',
    aEn: 'For HD 720p, 5 Mbps is sufficient. For FHD 1080p, 10 Mbps is recommended. For 4K UHD 60FPS sports broadcasts, 15-20 Mbps stable broadband will provide a completely bufferless, seamless experience powered by our Dhaka CDN cache servers.',
    aBn: 'এইচডি চ্যানেলের জন্য ৫ এমবিপিএস, ফুল এইচডির জন্য ১০ এমবিপিএস এবং ফোরকে আল্ট্রা এইচডি চ্যানেলের জন্য ১৫-২০ এমবিপিএস ব্রডব্যান্ড স্পিড থাকলে ঢাকা ক্যাশ সার্ভারের কারণে ০% বাফারিংয়ে চমৎকার দেখতে পারবেন।'
  },
  {
    qEn: 'How does the payment and activation process work?',
    qBn: 'পেমেন্ট করার কতক্ষণ পর অ্যাকাউন্ট সচল হয়?',
    aEn: 'Activation is 100% instant and automated. Once you make the payment via bKash, Nagad, Rocket, or Card and enter your TrxID/Mobile number, your Xtream Codes API username, password, M3U playlist link, and Smart TV QR code are generated on the screen within seconds.',
    aBn: 'পেমেন্ট সম্পূর্ণ স্বয়ংক্রিয় ও তাৎক্ষণিক। বিকাশ, নগদ, রকেট বা কার্ডের মাধ্যমে পেমেন্ট সম্পন্ন করে TrxID সাবমিট করলেই স্ক্রিনে সাথে সাথে আপনার পার্সোনাল ইউজারনেম, পাসওয়ার্ড ও M3U লিঙ্ক জেনারেট হয়ে যাবে।'
  },
  {
    qEn: 'Can I test the service for free before subscribing?',
    qBn: 'পেমেন্ট করার আগে কি ফ্রি ট্রায়াল দিয়ে চেক করা সম্ভব?',
    aEn: 'Absolutely! We offer a 24-Hour Free Trial with no payment details required. Select the "24-Hour Free Trial" plan in our pricing section to receive instant test credentials for your Smart TV, Android Box, or phone.',
    aBn: 'অবশ্যই! আমাদের রয়েছে ২৪ ঘণ্টার ফ্রি ট্রায়াল। প্রাইসিং সেকশন থেকে "২৪ ঘণ্টার ফ্রি ট্রায়াল" সিলেক্ট করে আপনার মোবাইল বা টিভিতে টেস্ট করে দেখার জন্য ইনস্ট্যান্ট লাইন পেয়ে যাবেন।'
  },
  {
    qEn: 'What devices are supported?',
    qBn: 'কোন কোন ডিভাইসে এই সার্ভিস চালানো যাবে?',
    aEn: 'We support all platforms: Android TV, Google TV, Mi Box, Amazon FireStick, Apple TV, iPhone, iPad, Android Phones/Tablets, Samsung Tizen Smart TV, LG webOS, Windows PC, Mac, and Mag Box.',
    aBn: 'অ্যান্ড্রয়েড টিভি, গুগল টিভি, শাওমি টিভি স্টিক/বক্স, অ্যামাজন ফায়ারস্টিক, অ্যাপল টিভি, আইফোন, আইপ্যাড, স্যামসাং ও এলজি স্মার্ট টিভি, উইন্ডোজ পিসি এবং ম্যাক সহ সব ডিভাইসে চলবে।'
  }
];

export const TESTIMONIALS_DATA = [
  {
    name: 'Tanvir Hossain',
    role: 'Cricket Enthusiast',
    location: 'Dhanmondi, Dhaka',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    comment: 'বিপিএল ও আইপিএল খেলা দেখার জন্য নিয়েছিলাম। ঢাকা লোকাল সিডিএন সার্ভারের জন্য টি স্পোর্টস আর স্টার স্পোর্টসে ১ সেকেন্ডের জন্যও বাফারিং করে না। পিকচার কোয়ালিটি সত্যিকারের ফোরকে!',
    rating: 5,
    verifiedPurchase: '3 Months Pro Saver'
  },
  {
    name: 'Shahedur Rahman',
    role: 'Expat Professional',
    location: 'London, United Kingdom',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    comment: 'UK তে বসে দেশের সময় টিভি, যমুনা আর নাটকগুলো এতো ক্লিয়ার দেখতে পারবো ভাবিনি। ফায়ারস্টিকে কোড ৮৪৯২০ দিয়ে অ্যাপ ইন্সটল করতে মাত্র ২ মিনিট লেগেছিল। অসাধারণ সার্ভিস!',
    rating: 5,
    verifiedPurchase: '12 Months Cinema Pass'
  },
  {
    name: 'Dr. Nusrat Jahan',
    role: 'Smart TV User',
    location: 'Chittagong, Bangladesh',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    comment: 'স্যামসাং টিভিতে আইবো প্লেয়ারে চ্যানেলগুলো এক্টিভ করে দিলো হোয়াটসঅ্যাপে নক দেওয়ার ২ মিনিটের মধ্যে। বাসার সবাই মিলে এখন ন্যাশনাল জিওগ্রাফিক আর কার্টুন দেখছে আনন্দে।',
    rating: 5,
    verifiedPurchase: '12 Months Cinema Pass'
  }
];
