'use client';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export interface PlatformMetaPixelPublicConfig {
  enabled: boolean;
  pixelId: string;
  capiEnabled: boolean;
  events: {
    PageView: boolean;
    ViewContent: boolean;
    CompleteRegistration: boolean;
    StartTrial: boolean;
    InitiateCheckout: boolean;
    Purchase: boolean;
    Contact: boolean;
  };
}

const DEFAULT_META_CONFIG: PlatformMetaPixelPublicConfig = {
  enabled: false,
  pixelId: '',
  capiEnabled: false,
  events: {
    PageView: true,
    ViewContent: true,
    CompleteRegistration: true,
    StartTrial: true,
    InitiateCheckout: true,
    Purchase: true,
    Contact: true,
  },
};

let currentConfig: PlatformMetaPixelPublicConfig = { ...DEFAULT_META_CONFIG };
let configLoaded = false;
let configResolvers: Array<() => void> = [];

export const setPlatformTrackingConfig = (cfg?: Partial<PlatformMetaPixelPublicConfig>) => {
  if (cfg) {
    currentConfig = {
      enabled: Boolean(cfg.enabled && cfg.pixelId),
      pixelId: (cfg.pixelId || '').trim(),
      capiEnabled: Boolean(cfg.capiEnabled && cfg.pixelId),
      events: {
        ...DEFAULT_META_CONFIG.events,
        ...(cfg.events || {}),
      },
    };
  }
  configLoaded = true;
  configResolvers.forEach((resolve) => resolve());
  configResolvers = [];
};

export const getPlatformTrackingConfig = (): PlatformMetaPixelPublicConfig => currentConfig;

const waitForConfigAndFbq = async (timeoutMs = 3000): Promise<void> => {
  if (typeof window === 'undefined') return;

  if (!configLoaded) {
    await Promise.race([
      new Promise<void>((resolve) => configResolvers.push(resolve)),
      new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
    ]);
  }

  if (!currentConfig.enabled) return;

  const deadline = Date.now() + timeoutMs;
  while (typeof window.fbq !== 'function' && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 100));
  }
};

const readCookie = (name: string): string => {
  if (typeof document === 'undefined') return '';
  const match = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : '';
};

const writeCookie = (name: string, value: string, days = 90) => {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

export const getFbpCookie = (): string => {
  const val = readCookie('_fbp');
  return val.startsWith('fb.') ? val : '';
};

export const getOrInitFbcCookie = (): string => {
  if (typeof window === 'undefined') return '';
  const existing = readCookie('_fbc');
  if (existing.startsWith('fb.')) return existing;

  try {
    const params = new URLSearchParams(window.location.search);
    const fbclid = params.get('fbclid')?.trim();
    if (fbclid) {
      // Meta official _fbc format: fb.1.<creation_time_ms>.<fbclid>
      const fbcValue = `fb.1.${Date.now()}.${fbclid}`;
      writeCookie('_fbc', fbcValue, 90);
      return fbcValue;
    }
  } catch {
    // Ignore URL parse error
  }
  return '';
};

export const getPlatformTrackingContext = () => {
  if (typeof window === 'undefined') {
    return { fbp: '', fbc: '', eventSourceUrl: '' };
  }
  return {
    fbp: getFbpCookie(),
    fbc: getOrInitFbcCookie(),
    eventSourceUrl: window.location.href,
  };
};

export const generatePlatformEventId = (prefix = 'evt'): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const STORAGE_PREFIX = 'masheco_meta_evt_';

export const hasEventFiredInBrowser = (key: string, persistent = false): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const store = persistent ? window.localStorage : window.sessionStorage;
    return store.getItem(`${STORAGE_PREFIX}${key}`) === '1';
  } catch {
    return false;
  }
};

export const markEventFiredInBrowser = (key: string, persistent = false): void => {
  if (typeof window === 'undefined') return;
  try {
    const store = persistent ? window.localStorage : window.sessionStorage;
    store.setItem(`${STORAGE_PREFIX}${key}`, '1');
  } catch {
    // Ignore storage quota / private mode issues
  }
};

export const isEligiblePlatformPageViewRoute = (pathname: string): boolean => {
  if (!pathname) return false;
  if (
    pathname === '/' ||
    pathname.startsWith('/landing') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/dashboard/subscription')
  ) {
    return true;
  }
  return false;
};

/**
 * Fires browser Pixel + server CAPI for browser-initiated top-of-funnel events (PageView, ViewContent)
 * using the exact same eventId for Meta deduplication.
 */
export const trackPlatformBrowserAndServerEvent = async (
  eventName: 'PageView' | 'ViewContent',
  customData?: Record<string, any>,
  dedupeKey?: string
): Promise<void> => {
  if (typeof window === 'undefined') return;
  if (dedupeKey && hasEventFiredInBrowser(dedupeKey, false)) {
    return;
  }

  await waitForConfigAndFbq();

  const isEventEnabled = currentConfig.events?.[eventName] ?? true;
  if (!isEventEnabled) return;
  if (!currentConfig.enabled && !currentConfig.capiEnabled) return;

  if (dedupeKey) {
    if (hasEventFiredInBrowser(dedupeKey, false)) return;
    markEventFiredInBrowser(dedupeKey, false);
  }

  const eventId = generatePlatformEventId(eventName.toLowerCase());

  if (currentConfig.enabled && typeof window.fbq === 'function') {
    try {
      window.fbq('track', eventName, customData || {}, { eventID: eventId });
    } catch {
      // Ignore pixel script errors
    }
  }

  if (currentConfig.capiEnabled) {
    const ctx = getPlatformTrackingContext();
    try {
      await fetch('/api/tracking/platform/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          eventId,
          eventSourceUrl: ctx.eventSourceUrl,
          fbp: ctx.fbp || undefined,
          fbc: ctx.fbc || undefined,
          customData: customData || undefined,
        }),
        keepalive: true,
      });
    } catch {
      // Non-blocking
    }
  }
};

/**
 * Fires only the browser Pixel copy using an authoritative eventId already emitted by the backend
 * via CAPI (e.g., CompleteRegistration, StartTrial, InitiateCheckout, Purchase, Contact).
 */
export const trackPlatformDeduplicatedBrowserEvent = async (
  eventName: keyof PlatformMetaPixelPublicConfig['events'],
  eventId: string,
  customData?: Record<string, any>,
  persistent = false
): Promise<void> => {
  if (typeof window === 'undefined' || !eventId) return;

  const dedupeKey = `${eventName}_${eventId}`;
  if (hasEventFiredInBrowser(dedupeKey, persistent)) return;

  await waitForConfigAndFbq();

  if (!currentConfig.enabled) return;
  if (currentConfig.events?.[eventName] === false) return;
  if (typeof window.fbq !== 'function') return;

  if (hasEventFiredInBrowser(dedupeKey, persistent)) return;
  markEventFiredInBrowser(dedupeKey, persistent);

  try {
    window.fbq('track', eventName, customData || {}, { eventID: eventId });
  } catch {
    // Non-blocking
  }
};
