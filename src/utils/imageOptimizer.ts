/**
 * MASH ECO – Global Cloudinary Image Optimization Policy
 *
 * Cloudinary Transformation Format:
 *   f_auto,q_auto:good,w_WIDTH,c_limit
 *
 * Module / Page Standard Widths:
 *   - Merchant Dashboard – Products: 100px
 *   - Merchant Dashboard – Categories: 100px
 *
 * CDN Proxy:
 *   All Cloudinary URLs are rewritten to go through cdn.masheco.com
 *   so that res.cloudinary.com is never exposed in the browser.
 */

/** CDN proxy — maps /img/... → Cloudinary /dapjiys4/image/upload/... */
const CDN_IMG_BASE = 'https://cdn.masheco.com/img';
const CLOUDINARY_UPLOAD_PREFIX = 'https://res.cloudinary.com/dapjiys4/image/upload/';

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

  // Non-Cloudinary or already optimized internal assets
  if (!trimmed.includes('res.cloudinary.com') || !trimmed.includes('/image/upload/')) {
    return trimmed;
  }

  const parts = trimmed.split('/image/upload/');
  if (parts.length !== 2) return trimmed;

  // baseUrl = https://res.cloudinary.com/dapjiys4/image/upload/
  const baseUrl = parts[0] + '/image/upload/';
  let rest = parts[1];

  // Remove any existing transformation segments (prevents double transformation)
  const transformSegmentRegex = /^((?:(?:[a-z]{1,4}_[^,/]+|f_auto|q_auto[^,/]*)[,;]?)+\/)/i;
  while (transformSegmentRegex.test(rest)) {
    rest = rest.replace(transformSegmentRegex, '');
  }

  // Build the Cloudinary optimized URL then rewrite to CDN:
  // https://res.cloudinary.com/dapjiys4/image/upload/TRANSFORMS/photo.jpg
  //   → https://cdn.masheco.com/img/TRANSFORMS/photo.jpg
  const fullCloudinaryUrl = `${baseUrl}f_auto,q_auto:good,w_${width},c_limit/${rest}`;
  return fullCloudinaryUrl.replace(CLOUDINARY_UPLOAD_PREFIX, `${CDN_IMG_BASE}/`);
}

// Semantic helper functions matching the Global Optimization Standard
export const getMerchantProductThumbnailUrl = (url?: string | null) => getOptimizedImageUrl(url, 100);
export const getMerchantCategoryThumbnailUrl = (url?: string | null) => getOptimizedImageUrl(url, 100);

