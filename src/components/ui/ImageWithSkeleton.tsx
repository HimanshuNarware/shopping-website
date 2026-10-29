import React, { useState } from 'react';
import { PictureOutlined } from '@ant-design/icons';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  loading?: 'lazy' | 'eager';
}

export const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  loading = 'lazy',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${containerClassName}`}>
      {/* Animated Shimmer Skeleton Placeholder while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-200/80 animate-pulse flex items-center justify-center z-10">
          <div className="w-8 h-8 rounded-full bg-slate-300/80 flex items-center justify-center text-slate-400">
            <PictureOutlined className="text-sm" />
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {hasError ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-2">
          <PictureOutlined className="text-xl mb-1" />
          <span className="text-[11px]">Image unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setIsLoaded(true);
            setHasError(true);
          }}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      )}
    </div>
  );
};
