import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ProductFilterState } from '../types/product.types';

const DEFAULT_LIMIT = 8;

export function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ProductFilterState = useMemo(() => {
    const categoryParam = searchParams.get('category');
    const minPriceRaw = searchParams.get('minPrice');
    const maxPriceRaw = searchParams.get('maxPrice');
    const brandParam = searchParams.get('brand');
    const search = searchParams.get('search') || '';
    const pageRaw = searchParams.get('page');

    const categories = categoryParam ? categoryParam.split(',').map((c) => c.trim()).filter(Boolean) : [];
    const minPrice = minPriceRaw !== null && !isNaN(Number(minPriceRaw)) ? Number(minPriceRaw) : null;
    const maxPrice = maxPriceRaw !== null && !isNaN(Number(maxPriceRaw)) ? Number(maxPriceRaw) : null;
    const brands = brandParam ? brandParam.split(',').map((b) => b.trim()).filter(Boolean) : [];
    const page = pageRaw && !isNaN(Number(pageRaw)) && Number(pageRaw) > 0 ? parseInt(pageRaw, 10) : 1;

    return {
      categories,
      minPrice,
      maxPrice,
      brands,
      search,
      page,
      limit: DEFAULT_LIMIT,
    };
  }, [searchParams]);

  // Update a single filter or multiple filters, automatically resetting page to 1 unless page itself is explicitly being set
  const updateFilters = useCallback(
    (updates: Partial<ProductFilterState>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        // Check if filter updates include non-page changes
        const hasFilterChange = Object.keys(updates).some(
          (key) => key !== 'page' && key !== 'limit'
        );

        if (hasFilterChange && updates.page === undefined) {
          next.set('page', '1');
        }

        if (updates.categories !== undefined) {
          if (updates.categories.length > 0) {
            next.set('category', updates.categories.join(','));
          } else {
            next.delete('category');
          }
        }

        if (updates.minPrice !== undefined) {
          if (updates.minPrice !== null && !isNaN(updates.minPrice)) {
            next.set('minPrice', updates.minPrice.toString());
          } else {
            next.delete('minPrice');
          }
        }

        if (updates.maxPrice !== undefined) {
          if (updates.maxPrice !== null && !isNaN(updates.maxPrice)) {
            next.set('maxPrice', updates.maxPrice.toString());
          } else {
            next.delete('maxPrice');
          }
        }

        if (updates.brands !== undefined) {
          if (updates.brands.length > 0) {
            next.set('brand', updates.brands.join(','));
          } else {
            next.delete('brand');
          }
        }

        if (updates.search !== undefined) {
          if (updates.search.trim()) {
            next.set('search', updates.search.trim());
          } else {
            next.delete('search');
          }
        }

        if (updates.page !== undefined) {
          if (updates.page > 1) {
            next.set('page', updates.page.toString());
          } else {
            next.delete('page');
          }
        }

        return next;
      }, { replace: false });
    },
    [setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: false });
  }, [setSearchParams]);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}
