import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3 flex flex-col animate-pulse shadow-xs">
      <div className="w-full aspect-square bg-slate-100 rounded-lg mb-3 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-slate-200" />
      </div>
      <div className="h-4 bg-slate-200 rounded w-4/5 mb-2.5" />
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="h-3 bg-slate-200 rounded w-1/3" />
      </div>
    </div>
  );
};

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
