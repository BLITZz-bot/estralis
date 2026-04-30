/**
 * Cloudinary Image Optimization Utility
 * Converts any image URL (local or external) to a Cloudinary-optimized URL
 */

const CLOUDINARY_CLOUD_NAME = 'dly7f8p2f'; // Change this to your Cloudinary cloud name

export const getOptimizedImage = (src, width = 1200) => {
  if (!src) return '';
  
  // If it's already a Cloudinary URL, return as is (or apply further transforms)
  if (src.includes('res.cloudinary.com')) return src;

  // If it's a local path (starts with /), we need the full URL for Cloudinary Fetch
  // In production, this would be your site's domain.
  // For now, we'll assume it's relative to the origin.
  let absoluteUrl = src;
  if (src.startsWith('/')) {
    absoluteUrl = window.location.origin + src;
  }

  // Use Cloudinary Fetch API
  // f_auto: Automatic format (WebP/AVIF)
  // q_auto: Automatic quality
  // w_: Responsive width
  // c_limit: Upscale only if smaller
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/f_auto,q_auto,w_${width},c_limit/${absoluteUrl}`;
};
