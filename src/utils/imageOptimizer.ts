/**
 * MASH ECO – Global Cloudinary Image Optimization Policy
 *
 * Cloudinary Transformation Format:
 *   f_auto,q_auto:good,w_WIDTH,c_limit
 *
 * Module / Page Standard Widths:
 *   - Merchant Dashboard – Products: 100px
 *   - Merchant Dashboard – Categories: 100px
 *   - Merchant Dashboard – Avatar: 100px
 *
 * Smart Dual-Environment Routing:
 *   - In Production (VPS / Live Dashboard): Routes 100% through cdn.masheco.com/img/...
 *     so that res.cloudinary.com is never exposed in the browser.
 *   - In Development (Local Device): Routes directly to Cloudinary so local development
 *     is never blocked by local ISP DNS propagation.
 */

const IS_DEV = process.env.NODE_ENV === 'development';
const FORCE_CDN = process.env.NEXT_PUBLIC_FORCE_CDN === 'true';
const USE_CDN = !IS_DEV || FORCE_CDN;

/** CDN proxy in prod; direct Cloudinary in dev */
export const CDN_IMG_BASE = USE_CDN
  ? 'https://cdn.masheco.com/img'
  : 'https://res.cloudinary.com/dapjiys4/image/upload';

export type ImagePreset =
  | 'merchant-product'    // 100px
  | 'merchant-category'   // 100px
  | 'product-card'        // 300px
  | 'category-card'       // 300px
  | 'logo'                // 150px
  | 'search'              // 50px
  | 'cart';               // 50px

export const IMAGE_WIDTHS: Record<ImagePreset, number> = {
  'merchant-product': 100,
  'merchant-category': 100,
  'product-card': 300,
  'category-card': 300,
  'logo': 150,
  'search': 50,
  'cart': 50,
};

function stripCloudinaryTransforms(rawRest: string): string {
  let rest = rawRest;
  const transformSegmentRegex = /^((?:(?:[a-z]{1,4}_[^,/]+|f_auto|q_auto[^,/]*)[,;]?)+\/)/i;
  while (transformSegmentRegex.test(rest)) {
    rest = rest.replace(transformSegmentRegex, '');
  }
  return rest;
}

export function getOptimizedImageUrl(
  url?: string | null,
  presetOrWidth: ImagePreset | number = 'merchant-product'
): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  const width =
    typeof presetOrWidth === 'number'
      ? presetOrWidth
      : IMAGE_WIDTHS[presetOrWidth] || 100;

  // Cloudinary upload URL
  if (trimmed.includes('res.cloudinary.com') && trimmed.includes('/image/upload/')) {
    const parts = trimmed.split('/image/upload/');
    if (parts.length === 2) {
      const rest = stripCloudinaryTransforms(parts[1]);
      return `${CDN_IMG_BASE}/f_auto,q_auto:good,w_${width},c_limit/${rest}`;
    }
  }

  // Already CDN URL
  if (trimmed.includes('cdn.masheco.com/img/')) {
    const parts = trimmed.split('/img/');
    if (parts.length === 2) {
      const rest = stripCloudinaryTransforms(parts[1]);
      return `${CDN_IMG_BASE}/f_auto,q_auto:good,w_${width},c_limit/${rest}`;
    }
  }

  return trimmed;
}

// Semantic helper functions matching the Global Optimization Standard
export const getMerchantProductThumbnailUrl = (url?: string | null) => getOptimizedImageUrl(url, 100);
export const getMerchantCategoryThumbnailUrl = (url?: string | null) => getOptimizedImageUrl(url, 100);
export const getStoreLogoUrl = (url?: string | null) => getOptimizedImageUrl(url, 150);
