import React from 'react';
import { StarFilled } from '@ant-design/icons';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  showScore = true,
  size = 'sm',
  className = '',
}) => {
  const normalizedRating = Math.max(0, Math.min(rating, maxStars));
  const fullStars = Math.floor(normalizedRating);
  const remainder = normalizedRating - fullStars;
  const hasHalfStar = remainder >= 0.25;

  const iconSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`} aria-label={`Rating: ${normalizedRating.toFixed(1)} out of ${maxStars}`}>
      <div className="flex items-center text-amber-400">
        {Array.from({ length: maxStars }).map((_, index) => {
          let fillClass = 'text-slate-200';
          if (index < fullStars) {
            fillClass = 'text-amber-400';
          } else if (index === fullStars && hasHalfStar) {
            fillClass = 'text-amber-300';
          }

          return (
            <span key={index} className={`inline-block ${iconSizes[size]} ${fillClass} mr-0.5`}>
              <StarFilled />
            </span>
          );
        })}
      </div>
      {showScore && (
        <span className={`text-slate-500 font-medium ${textSizes[size]}`}>
          ({normalizedRating.toFixed(1)})
        </span>
      )}
    </div>
  );
};
