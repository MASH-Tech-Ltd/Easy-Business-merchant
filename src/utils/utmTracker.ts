/**
 * UTM & Ad Attribution Tracker for Landing Pages
 * Tracks Facebook Ads (fbclid, utm_source=facebook), Google Ads (gclid, utm_source=google),
 * and other marketing campaigns, persisting attribution throughout the visitor's session.
 */

export interface AttributionData {
  source: 'facebook' | 'google' | 'direct' | 'organic' | 'other';
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  fbclid: string;
  gclid: string;
  landingPageUrl: string;
}

const STORAGE_KEY = 'masheco_ad_attribution';

export const captureAttribution = (): AttributionData => {
  if (typeof window === 'undefined') {
    return {
      source: 'direct',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmContent: '',
      utmTerm: '',
      fbclid: '',
      gclid: '',
      landingPageUrl: '',
    };
  }

  try {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    const utmSource = params.get('utm_source') || '';
    const utmMedium = params.get('utm_medium') || '';
    const utmCampaign = params.get('utm_campaign') || '';
    const utmContent = params.get('utm_content') || '';
    const utmTerm = params.get('utm_term') || '';
    const fbclid = params.get('fbclid') || '';
    const gclid = params.get('gclid') || '';

    // If fresh marketing tags exist in current URL, save them immediately
    if (utmSource || fbclid || gclid || utmCampaign) {
      let detectedSource: AttributionData['source'] = 'other';
      if (fbclid || /facebook|fb|ig|instagram/i.test(utmSource)) {
        detectedSource = 'facebook';
      } else if (gclid || /google|adwords/i.test(utmSource)) {
        detectedSource = 'google';
      } else if (utmSource) {
        detectedSource = 'other';
      }

      const freshData: AttributionData = {
        source: detectedSource,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
        fbclid,
        gclid,
        landingPageUrl: window.location.href,
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
      return freshData;
    }

    // Check existing session attribution
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    // Check organic referrer
    const ref = document.referrer ? new URL(document.referrer).hostname : '';
    let detectedSource: AttributionData['source'] = 'direct';
    if (/facebook\.com|instagram\.com/i.test(ref)) {
      detectedSource = 'facebook';
    } else if (/google\./i.test(ref)) {
      detectedSource = 'google';
    } else if (ref && !ref.includes(window.location.hostname)) {
      detectedSource = 'organic';
    }

    const defaultData: AttributionData = {
      source: detectedSource,
      utmSource: detectedSource !== 'direct' ? ref : '',
      utmMedium: detectedSource === 'organic' ? 'referral' : '',
      utmCampaign: '',
      utmContent: '',
      utmTerm: '',
      fbclid: '',
      gclid: '',
      landingPageUrl: window.location.href,
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
  } catch (err) {
    return {
      source: 'direct',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmContent: '',
      utmTerm: '',
      fbclid: '',
      gclid: '',
      landingPageUrl: typeof window !== 'undefined' ? window.location.href : '',
    };
  }
};

/**
 * Fires Facebook Pixel ('Lead') and Google Analytics / Ads ('generate_lead') conversion events
 */
export const triggerLeadConversionEvents = (data: { topic?: string; value?: number } = {}) => {
  if (typeof window === 'undefined') return;

  // 1. Meta (Facebook) Pixel Lead Event
  try {
    const win = window as any;
    if (typeof win.fbq === 'function') {
      win.fbq('track', 'Lead', {
        content_name: data.topic || 'Merchant Landing Lead',
        content_category: 'Merchant Onboarding',
        value: data.value || 0,
        currency: 'BDT',
      });
    }
  } catch (err) {
    console.debug('Meta Pixel lead track error', err);
  }

  // 2. Google Analytics 4 / Google Ads generate_lead Event
  try {
    const win = window as any;
    if (typeof win.gtag === 'function') {
      win.gtag('event', 'generate_lead', {
        event_category: 'Lead',
        event_label: data.topic || 'Merchant Landing Lead',
        value: data.value || 0,
        currency: 'BDT',
      });
    }
  } catch (err) {
    console.debug('Google Analytics lead track error', err);
  }
};
