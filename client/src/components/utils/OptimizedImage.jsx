import React from 'react';

/**
 * Optimized Image Component
 * Handles lazy loading, responsive sizing, srcSet, and WebP format
 * 
 * Usage:
 * <OptimizedImage
 *   src="https://example.com/image.jpg"
 *   alt="Image description"
 *   width={800}
 *   height={600}
 *   sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 50vw"
 *   priority={false}
 * />
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  size = 'medium',
  sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 50vw',
  priority = false,
  className = '',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Generate srcSet with different sizes
  // Format: src 1x, src2x 2x for retina displays
  const generateSrcSet = (imageSrc) => {
    if (!imageSrc) return '';

    // For images from URLs/CDN, append size parameters
    const baseUrl = imageSrc.split('?')[0];
    const ext = baseUrl.split('.').pop();

    // Support for responsive sizes (mobile, tablet, desktop)
    return `
      ${imageSrc}?w=480&q=75 480w,
      ${imageSrc}?w=768&q=80 768w,
      ${imageSrc}?w=1024&q=85 1024w,
      ${imageSrc}?w=1280&q=85 1280w,
      ${imageSrc}?w=1920&q=90 1920w
    `.trim();
  };

  // Generate WebP srcSet if the image URL supports transformation
  const generateWebPSrcSet = (imageSrc) => {
    if (!imageSrc || !imageSrc.includes('cloudinary') && !imageSrc.includes('imgix')) {
      return null;
    }

    return `
      ${imageSrc}?w=480&f=webp&q=75 480w,
      ${imageSrc}?w=768&f=webp&q=80 768w,
      ${imageSrc}?w=1024&f=webp&q=85 1024w,
      ${imageSrc}?w=1280&f=webp&q=85 1280w,
      ${imageSrc}?w=1920&f=webp&q=90 1920w
    `.trim();
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <picture>
      {/* WebP format for modern browsers */}
      {generateWebPSrcSet(src) && (
        <source
          srcSet={generateWebPSrcSet(src)}
          sizes={sizes}
          type="image/webp"
        />
      )}

      {/* Fallback to JPEG/PNG with srcSet */}
      <source
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        type="image/jpeg"
      />

      {/* Main image element */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={onError}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : 'auto',
        }}
      />
    </picture>
  );
};

/**
 * Portfolio Gallery Image Wrapper
 * Optimized for masonry grid with before/after support
 */
export const PortfolioImage = ({
  imageUrl,
  beforeImageUrl,
  title,
  category,
  onClick,
  className = '',
}) => {
  const [showBefore, setShowBefore] = React.useState(false);

  return (
    <div
      className={`relative group cursor-pointer overflow-hidden bg-gray-200 ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Main Portfolio Image */}
      <OptimizedImage
        src={imageUrl}
        alt={`Portfolio - ${title}`}
        width={600}
        height={600}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Before Image Toggle (if available) */}
      {beforeImageUrl && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowBefore(!showBefore);
          }}
          className="absolute top-4 right-4 z-10 px-3 py-1 bg-black/70 text-white text-xs rounded hover:bg-black transition-colors"
        >
          {showBefore ? 'After' : 'Before'}
        </button>
      )}

      {/* Before Image (initially hidden) */}
      {beforeImageUrl && showBefore && (
        <div className="absolute inset-0">
          <OptimizedImage
            src={beforeImageUrl}
            alt={`Before - ${title}`}
            width={600}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Dark Overlay & Text */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <div className="text-white">
          <h3 className="font-playfair text-lg mb-1">{title}</h3>
          <p className="text-xs uppercase tracking-wider text-gray-300">{category}</p>
        </div>
      </div>
    </div>
  );
};

export default OptimizedImage;
