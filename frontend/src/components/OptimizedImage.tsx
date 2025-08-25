import React, { useState, useCallback } from 'react';
import { resolveImageUrl } from '../services/api';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  forceRefresh?: boolean; // Add force refresh prop
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E",
  onLoad,
  onError,
  style,
  loading = 'lazy',
  forceRefresh = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(resolveImageUrl(src));

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setImageError(true);
    }
    onError?.();
  }, [currentSrc, fallbackSrc, onError]);

  // Update currentSrc when src prop changes
  React.useEffect(() => {
    let newSrc = resolveImageUrl(src);

    // Add cache busting parameter if forceRefresh is true
    if (forceRefresh && newSrc && !newSrc.includes('data:image')) {
      const separator = newSrc.includes('?') ? '&' : '?';
      newSrc = `${newSrc}${separator}t=${Date.now()}`;
    }

    console.log('OptimizedImage src changed:', { src, newSrc, forceRefresh }); // Debug log
    setCurrentSrc(newSrc);
    setImageLoaded(false);
    setImageError(false);
  }, [src, forceRefresh]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Placeholder/Loading state */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        style={{
          ...style,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
      
      {/* Error state indicator */}
      {imageError && imageLoaded && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          Fallback
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
