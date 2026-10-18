export type ChannelCategory = 
  | 'all'
  | 'bangla'
  | 'sports'
  | 'indian-bangla'
  | 'movies'
  | 'news'
  | 'kids'
  | 'infotainment'
  | 'spiritual'
  | 'music';

export interface Channel {
  id: string;
  number: number;
  name: string;
  category: ChannelCategory;
  categoryLabel: string;
  categoryLabelBn: string;
  resolution: '4K UHD' | 'FHD 1080p' | 'HD 720p';
  fps: number;
  country: string;
  countryFlag: string;
  logo: string;
  streamUrl: string;
  posterBg: string;
  httpReferrer?: string;
  httpUserAgent?: string;
  groupTitle?: string;
  epgCurrent: {
    title: string;
    titleBn: string;
    time: string;
    progressPercent: number;
  };
  epgNext: {
    title: string;
    titleBn: string;
    time: string;
  };
  viewersCount: number;
  isVip?: boolean;
}

export type Currency = 'BDT' | 'USD' | 'INR';

export interface SubscriptionPlan {
  id: string;
  name: string;
  nameBn: string;
  durationLabel: string;
  durationLabelBn: string;
  priceBdt: number;
  priceUsd: number;
  priceInr: number;
  originalPriceBdt: number;
  screens: number;
  badge?: string;
  badgeBn?: string;
  isPopular?: boolean;
  features: string[];
  featuresBn: string[];
}

export interface PaymentGateway {
  id: string;
  name: string;
  category: 'mfs' | 'card' | 'crypto';
  logoColor: string;
  merchantNumber?: string;
  accountType?: string;
  chargePercent: number;
  instructions: {
    en: string[];
    bn: string[];
  };
}

export interface ActivationCredentials {
  serverUrl: string;
  username: string;
  password: string;
  m3uUrl: string;
  epgUrl: string;
  expiresAt: string;
  activeScreens: number;
}

export interface AppPlatform {
  id: string;
  name: string;
  deviceGroup: 'Mobile' | 'TV' | 'PC';
  version: string;
  size: string;
  downloadUrl: string;
  downCode?: string;
  requirements: string;
  instructionsEn: string[];
  instructionsBn: string[];
}
