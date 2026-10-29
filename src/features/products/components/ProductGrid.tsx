import React from 'react';
import type { Product } from '../types/product.types';
import { ProductCard } from './ProductCard';
import { SkeletonGrid } from '../../../components/ui/SkeletonCard';
import { ErrorAlert } from '../../../components/ui/ErrorAlert';
import { InboxOutlined, ClearOutlined } from '@ant-design/icons';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  error,
  onRetry,
  onResetFilters,
}) => {
  if (isLoading) {
    return <SkeletonGrid count={8} />;
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorAlert
          title="Failed to load products"
          message={error}
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center my-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-3xl">
          <InboxOutlined />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          No products found
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
          We couldn't find any products matching your current filters. Try relaxing or clearing your filter criteria.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-900 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <ClearOutlined />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
