import { TabId } from '../types';

export const TAB_PATHS: Record<TabId, string> = {
  summary: '/',
  tracking: '/tracking',
  arbitrage: '/arbitrage',
  hardware: '/hardware',
  timeline: '/timeline',
  energy: '/energy',
  economics: '/economics',
  challenges: '/challenges',
  media: '/media',
};

export const TAB_TITLES: Record<TabId, string> = {
  summary: 'STRATOS · Orbital Computing Intelligence Platform',
  tracking: 'STRATOS · Live Orbit & Constellation Tracker',
  arbitrage: 'STRATOS · Real-Time Terrestrial Grid Arbitrage',
  hardware: 'STRATOS · Space-Rated AI Silicon Matrix',
  timeline: 'STRATOS · Mission Intelligence & Milestones Timeline',
  energy: 'STRATOS · Orbital Thermodynamics & Radiative Cooling',
  economics: 'STRATOS · 10-Year Cumulative Financial TCO Model',
  challenges: 'STRATOS · Physical & Engineering Orbit Challenges',
  media: 'STRATOS · Media, Briefings & Starcloud Interview',
};

function matchPathToTab(path: string): TabId | null {
  const clean = path.replace(/^\/+|\/+$/g, '').toLowerCase().trim();
  if (!clean || clean === 'summary' || clean === 'overview') {
    return 'summary';
  }
  if (clean === 'tracking' || clean === 'orbit') return 'tracking';
  if (clean === 'arbitrage' || clean === 'grid' || clean === 'power') return 'arbitrage';
  if (clean === 'hardware' || clean === 'silicon') return 'hardware';
  if (clean === 'timeline' || clean === 'news') return 'timeline';
  if (clean === 'energy' || clean === 'thermodynamics') return 'energy';
  if (clean === 'economics' || clean === 'tco') return 'economics';
  if (clean === 'challenges') return 'challenges';
  if (clean === 'media') return 'media';
  return null;
}

export function parseTabFromUrl(): TabId {
  if (typeof window === 'undefined') return 'summary';

  // Check hash first (e.g. #/tracking, #tracking)
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
  if (hash) {
    const tabFromHash = matchPathToTab(hash);
    if (tabFromHash) return tabFromHash;
  }

  // Check pathname (e.g. /tracking, /)
  const pathname = window.location.pathname;
  const tabFromPath = matchPathToTab(pathname);
  if (tabFromPath) return tabFromPath;

  return 'summary';
}

export function navigateToTab(tabId: TabId, replace: boolean = false) {
  if (typeof window === 'undefined') return;

  const targetPath = TAB_PATHS[tabId] || '/';
  const currentPath = window.location.pathname;

  if (currentPath !== targetPath || window.location.hash) {
    if (replace) {
      window.history.replaceState({ tabId }, '', targetPath);
    } else {
      window.history.pushState({ tabId }, '', targetPath);
    }
  }

  if (TAB_TITLES[tabId]) {
    document.title = TAB_TITLES[tabId];
  }
}

export function getTabPath(tabId: TabId): string {
  return TAB_PATHS[tabId] || '/';
}
