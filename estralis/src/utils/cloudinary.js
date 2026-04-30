export const getOptimizedImage = (imageUrl, width = 'auto') => {
  if (!imageUrl) return imageUrl;

  const cloudName = 'delpppor4';
  
  // Detect if we are in local development
  const isLocal = typeof window !== 'undefined' && 
                 (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // If it's a local asset (starts with /), Cloudinary can't fetch it during local development
  if (isLocal && imageUrl.startsWith('/')) return imageUrl;

  // If it's already a Cloudinary URL, don't wrap it again
  if (imageUrl.includes('res.cloudinary.com')) return imageUrl;

  let absoluteUrl = imageUrl;
  if (imageUrl.startsWith('/')) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://estralisfest2026.vercel.app';
    absoluteUrl = `${origin}${imageUrl}`;
  } else if (imageUrl.includes('images.unsplash.com')) {
    // Strip Unsplash parameters to avoid conflicts with Cloudinary transformations
    absoluteUrl = imageUrl.split('?')[0];
  }

  // Use f_auto and q_100 for exact original quality
  // Use encodeURIComponent to handle query parameters correctly
  return `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_100,w_${width}/${encodeURIComponent(absoluteUrl)}`;
};
