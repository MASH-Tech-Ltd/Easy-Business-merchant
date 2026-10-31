'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useState } from 'react';
import { captureAttribution } from '@/utils/utmTracker';

interface TrackingConfigState {
  metaPixelId?: string;
  gaMeasurementId?: string;
  gtmContainerId?: string;
}

export default function PlatformTrackingScripts() {
  const [tracking, setTracking] = useState<TrackingConfigState>({});

  useEffect(() => {
    // 1. Immediately capture UTM & ad attribution (Facebook fbclid, Google gclid)
    captureAttribution();

    // 2. Fetch platform tracking config for central SaaS landing pages
    const fetchPlatformTracking = async () => {
      try {
        // Route through Next.js BFF proxy — backend URL never exposed to browser
        const res = await fetch(`/api/storefront/main/tracking`);
        if (!res.ok) return;
        const json = await res.json();
        const data = json?.data;
        if (!data) return;

        setTracking({
          metaPixelId: data.metaPixel?.enabled ? data.metaPixel?.pixelId?.trim() : undefined,
          gaMeasurementId: data.googleAnalytics?.enabled ? data.googleAnalytics?.measurementId?.trim() : undefined,
          gtmContainerId: data.googleTagManager?.enabled ? data.googleTagManager?.containerId?.trim() : undefined,
        });
      } catch (err) {
        // Silent catch for resilience
      }
    };

    fetchPlatformTracking();
  }, []);

  return (
    <>
      {/* 1. Meta (Facebook) Pixel */}
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
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {/* 2. Google Analytics 4 (GA4) */}
      {tracking.gaMeasurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${tracking.gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-platform-script"
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
          id="gtm-platform-script"
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
