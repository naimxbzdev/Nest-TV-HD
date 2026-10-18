import { Channel, ChannelCategory } from '../types/iptv';
import m3uChannelsStatic from '../data/m3uChannels.json';

export const M3U_SOURCE_URL = 'https://raw.githubusercontent.com/naimxbzbd/XBZ-Prime-TV/main/playlist.m3u';

/**
 * Normalizes mathematical unicode bold/sans characters to standard ASCII
 */
export function cleanMathBold(str: string): string {
  if (!str) return '';
  let out = '';
  for (const ch of str) {
    const code = ch.codePointAt(0);
    if (!code) continue;
    if (code >= 0x1d400 && code <= 0x1d419) out += String.fromCharCode(65 + (code - 0x1d400));
    else if (code >= 0x1d41a && code <= 0x1d433) out += String.fromCharCode(97 + (code - 0x1d41a));
    else if (code >= 0x1d5d4 && code <= 0x1d5ed) out += String.fromCharCode(65 + (code - 0x1d5d4));
    else if (code >= 0x1d5ee && code <= 0x1d607) out += String.fromCharCode(97 + (code - 0x1d5ee));
    else out += ch;
  }
  return out.replace(/[^a-zA-Z0-9\s&]/g, '').trim();
}

/**
 * Maps raw group-title into clean category enum
 */
export function mapGroupToCategory(rawGroup: string): ChannelCategory {
  const g = cleanMathBold(rawGroup).toLowerCase();
  if (g.includes('bangla') && !g.includes('indian')) return 'bangla';
  if (g.includes('indian bangla')) return 'indian-bangla';
  if (g.includes('sport')) return 'sports';
  if (g.includes('kid')) return 'kids';
  if (g.includes('islam') || g.includes('makka') || g.includes('quran')) return 'spiritual';
  if (g.includes('docu') || g.includes('discover') || g.includes('geo')) return 'infotainment';
  if (g.includes('news')) return 'news';
  if (g.includes('music') || g.includes('song')) return 'music';
  if (g.includes('movie') || g.includes('cinema')) return 'movies';
  if (g.includes('hindi')) return 'movies';
  return 'bangla';
}

function getCategoryLabels(cat: ChannelCategory) {
  switch (cat) {
    case 'bangla': return { en: 'Bangla TV', bn: 'বাংলাদেশি চ্যানেল' };
    case 'sports': return { en: 'Live Sports', bn: 'খেলাধুলা' };
    case 'indian-bangla': return { en: 'Indian Bangla', bn: 'ইন্ডিয়ান বাংলা' };
    case 'movies': return { en: 'Movies & Hindi', bn: 'সিনেমা ও বিনোদন' };
    case 'infotainment': return { en: 'Documentary', bn: 'প্রামাণ্যচিত্র' };
    case 'kids': return { en: 'Kids & Cartoons', bn: 'কার্টুন' };
    case 'spiritual': return { en: 'Islamic', bn: 'ইসলামিক' };
    case 'news': return { en: 'News', bn: 'সংবাদ' };
    case 'music': return { en: 'Music', bn: 'মিউজিক' };
    default: return { en: 'General', bn: 'সাধারণ' };
  }
}

function getCountryFlag(cat: ChannelCategory, name: string): string {
  if (cat === 'spiritual') return '🇸🇦';
  if (cat === 'indian-bangla' || cat === 'movies') return '🇮🇳';
  const n = name.toLowerCase();
  if (n.includes('willow') || n.includes('tudn')) return '🇺🇸';
  if (n.includes('sky sports') || n.includes('euro')) return '🇬🇧';
  if (n.includes('ptv')) return '🇵🇰';
  return '🇧🇩';
}

/**
 * Parses raw M3U text into an array of Channel objects
 */
export function parseM3U(m3uText: string): Channel[] {
  const lines = m3uText.split(/\r?\n/);
  const channels: Channel[] = [];
  let currentChannel: {
    rawName: string;
    group: string;
    logo: string;
    streamUrl: string;
    httpReferrer: string;
    httpUserAgent: string;
  } | null = null;
  let chNumber = 100;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('#EXTINF:')) {
      const logoMatch = line.match(/tvg-logo="([^"]*)"/i);
      const logo = logoMatch ? logoMatch[1] : '';

      const groupMatch = line.match(/group-title="([^"]*)"/i);
      const rawGroup = groupMatch ? groupMatch[1] : '';
      const cleanGroup = cleanMathBold(rawGroup) || 'Bangladeshi';

      const commaIdx = line.lastIndexOf(',');
      let name = commaIdx !== -1 ? line.substring(commaIdx + 1).trim() : 'Channel';
      name = name.replace(/#EXTINF.*/, '').trim();

      currentChannel = {
        rawName: name,
        group: cleanGroup,
        logo,
        streamUrl: '',
        httpReferrer: '',
        httpUserAgent: '',
      };
    } else if (line.startsWith('#EXTVLCOPT:http-referrer=')) {
      if (currentChannel) {
        currentChannel.httpReferrer = line.substring('#EXTVLCOPT:http-referrer='.length).trim();
      }
    } else if (line.startsWith('#EXTVLCOPT:http-user-agent=')) {
      if (currentChannel) {
        currentChannel.httpUserAgent = line.substring('#EXTVLCOPT:http-user-agent='.length).trim();
      }
    } else if (line.startsWith('http://') || line.startsWith('https://')) {
      if (currentChannel) {
        let streamUrl = line.trim();
        let referrer = currentChannel.httpReferrer;

        if (streamUrl.includes('|Referer=')) {
          const parts = streamUrl.split('|Referer=');
          streamUrl = parts[0];
          referrer = parts[1];
        }

        const cat = mapGroupToCategory(currentChannel.group);
        const labels = getCategoryLabels(cat);
        const is4K =
          currentChannel.rawName.toLowerCase().includes('4k') ||
          currentChannel.rawName.toLowerCase().includes('hd') ||
          cat === 'sports';
        chNumber++;

        const id = `ch-${currentChannel.rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${chNumber}`;

        channels.push({
          id,
          number: chNumber,
          name: currentChannel.rawName,
          category: cat,
          categoryLabel: labels.en,
          categoryLabelBn: labels.bn,
          resolution: is4K ? '4K UHD' : 'FHD 1080p',
          fps: is4K ? 60 : 50,
          country: cat === 'bangla' ? 'Bangladesh' : cat === 'indian-bangla' ? 'India' : 'International',
          countryFlag: getCountryFlag(cat, currentChannel.rawName),
          logo: currentChannel.logo,
          streamUrl,
          posterBg: currentChannel.logo || '',
          httpReferrer: referrer || '',
          httpUserAgent: currentChannel.httpUserAgent || '',
          epgCurrent: {
            title: `${currentChannel.rawName} - Live Broadcast Feed`,
            titleBn: `${currentChannel.rawName} - সরাসরি লাইভ সম্প্রচার`,
            time: '24/7 Continuous Feed',
            progressPercent: 55,
          },
          epgNext: {
            title: `${currentChannel.rawName} - Primetime Program`,
            titleBn: `${currentChannel.rawName} - পরবর্তী বিশেষ শো`,
            time: 'Upcoming Next',
          },
          viewersCount: Math.floor(2500 + Math.random() * 25000),
          isVip: is4K,
        });
        currentChannel = null;
      }
    }
  }

  return channels;
}

/**
 * Loads channels dynamically from GitHub M3U URL, with bundled fallback
 */
export async function loadM3UChannels(): Promise<Channel[]> {
  try {
    const res = await fetch(M3U_SOURCE_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const text = await res.text();
    const parsed = parseM3U(text);
    if (parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('Network fetch of raw M3U failed, using bundled pre-parsed playlist:', err);
  }

  // Fallback to bundled pre-parsed channels
  return (m3uChannelsStatic as any[]).map((c) => ({
    ...c,
    epgCurrent: {
      title: `${c.name} - Live Broadcast Feed`,
      titleBn: `${c.name} - সরাসরি লাইভ সম্প্রচার`,
      time: '24/7 Continuous Feed',
      progressPercent: 55,
    },
    epgNext: {
      title: `${c.name} - Primetime Program`,
      titleBn: `${c.name} - পরবর্তী বিশেষ শো`,
      time: 'Upcoming Next',
    },
  }));
}
