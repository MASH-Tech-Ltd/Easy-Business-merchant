'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { captureAttribution } from '@/utils/utmTracker';
import {
  getOrInitFbcCookie,
  isEligiblePlatformPageViewRoute,
  setPlatformTrackingConfig,
  trackPlatformBrowserAndServerEvent,
} from '@/utils/platformTracking';

interface TrackingConfigState {
  metaPixelId?: string;
  gaMeasurementId?: string;
  gtmContainerId?: string;
}

export default function PlatformTrackingScripts() {
  const [tracking, setTracking] = useState<TrackingConfigState>({});
  const [configReady, setConfigReady] = useState(false);
  const pathname = usePathname() || '/';
  const lastTrackedPathRef = useRef<string>('');

  useEffect(() => {
    // 1. Capture UTM & click ID attribution (_fbc + utm params)
    captureAttribution();
    getOrInitFbcCookie();

    // 2. Fetch public platform tracking config (Meta Pixel + CAPI status, GA4, GTM)
    const fetchPlatformTracking = async () => {
      try {
        const res = await fetch('/api/tracking/platform/public', { cache: 'no-store' });
        if (!res.ok) {
          setPlatformTrackingConfig();
          setConfigReady(true);
          return;
        }
        const json = await res.json();
        const data = json?.data;
        if (!data) {
          setPlatformTrackingConfig();
          setConfigReady(true);
          return;
        }

        const meta = data.metaPixel;
        if (meta) {
          setPlatformTrackingConfig(meta);
        } else {
          setPlatformTrackingConfig();
        }

        setTracking({
          metaPixelId: meta?.enabled && meta?.pixelId ? meta.pixelId.trim() : undefined,
          gaMeasurementId: data.googleAnalytics?.enabled && data.googleAnalytics?.measurementId
            ? data.googleAnalytics.measurementId.trim()
            : undefined,
          gtmContainerId: data.googleTagManager?.enabled && data.googleTagManager?.containerId
            ? data.googleTagManager.containerId.trim()
            : undefined,
        });
      } catch {
        setPlatformTrackingConfig();
      } finally {
        setConfigReady(true);
      }
    };

    fetchPlatformTracking();
  }, []);

  // Track deduplicated PageView (Browser Pixel + Server CAPI) across eligible platform routes
  useEffect(() => {
    if (!configReady) return;
    if (!isEligiblePlatformPageViewRoute(pathname)) return;
    if (lastTrackedPathRef.current === pathname) return;

    lastTrackedPathRef.current = pathname;
    trackPlatformBrowserAndServerEvent('PageView', {
      page_path: pathname,
    });
  }, [configReady, pathname]);

  return (
    <>
      {/* 1. Meta (Facebook) Pixel Base Initialization (PageView is dispatched with eventID deduplication above) */}
      {tracking.metaPixelId && (
        <Script
          id="fb-platform-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${tracking.metaPixelId}');
            `,
          }}
        />
      )}

      {/* 2. Google Analytics 4 (gtag.js) */}
      {tracking.gaMeasurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${tracking.gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-platform-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${tracking.gaMeasurementId}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}

      {/* 3. Google Tag Manager (GTM) */}
      {tracking.gtmContainerId && (
        <Script
          id="gtm-platform-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${tracking.gtmContainerId}');
            `,
          }}
        />
      )}
    </>
  );
}
