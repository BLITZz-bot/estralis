export const getOptimizedImage = (imageUrl, width = 'auto') => {
  if (!imageUrl) return imageUrl;

  const cloudName = 'delpppor4';
  
  const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  if (isLocal) return imageUrl;

  const siteUrl = 'https://estralisfest.vercel.app'; 
  
  let absoluteUrl = imageUrl;
  if (imageUrl.startsWith('/')) {
    absoluteUrl = `${siteUrl}${imageUrl}`;
  }

  if (absoluteUrl.includes('res.cloudinary.com')) return absoluteUrl;

  return `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_auto,w_${width},c_scale/${absoluteUrl}`;
};
