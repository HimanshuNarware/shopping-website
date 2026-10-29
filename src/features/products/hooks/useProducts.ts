import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchProducts } from '../api/products.api';
import type { Product, ProductFilterState } from '../types/product.types';

export function useProducts(filters: ProductFilterState) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const refetch = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  // Fetch full product catalog from DummyJSON API to support combined multi-category,
  // multi-brand, price-range, and instant search filtering.
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchProducts({
          limit: 0,
          signal: controller.signal,
        });
        setAllProducts(response.products || []);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const msg = err instanceof Error ? err.message : 'Failed to fetch products';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [reloadTrigger]);

  // Extract all unique brands dynamically from products, including product count per brand
  const { availableBrands, brandCounts } = useMemo(() => {
    const counts: Record<string, number> = {};
    const brandSet = new Set<string>();

    allProducts.forEach((product) => {
      if (product.brand && product.brand.trim()) {
        const trimmed = product.brand.trim();
        brandSet.add(trimmed);
        counts[trimmed] = (counts[trimmed] || 0) + 1;
      }
    });

    const sortedBrands = Array.from(brandSet).sort((a, b) => a.localeCompare(b));
    return { availableBrands: sortedBrands, brandCounts: counts };
  }, [allProducts]);

  // Combined filtering: multi-select categories, multi-select brands, price range, and search
  const filteredProducts = useMemo(() => {
    const searchLower = filters.search.trim().toLowerCase();

    return allProducts.filter((product) => {
      // 1. Multi-select categories filter
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(product.category)) {
          return false;
        }
      }

      // 2. Multi-select brand filter
      if (filters.brands.length > 0) {
        if (!product.brand || !filters.brands.includes(product.brand)) {
          return false;
        }
      }

      // 3. Price range filter
      if (filters.minPrice !== null && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== null && product.price > filters.maxPrice) {
        return false;
      }

      // 4. Text search filter
      if (searchLower) {
        const matchesTitle = product.title.toLowerCase().includes(searchLower);
        const matchesDesc = product.description.toLowerCase().includes(searchLower);
        const matchesBrand = product.brand ? product.brand.toLowerCase().includes(searchLower) : false;
        const matchesCategory = product.category ? product.category.toLowerCase().includes(searchLower) : false;

        if (!matchesTitle && !matchesDesc && !matchesBrand && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [allProducts, filters.categories, filters.brands, filters.minPrice, filters.maxPrice, filters.search]);

  // Pagination calculations
  const total = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / filters.limit));
  const safePage = Math.min(Math.max(1, filters.page), totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * filters.limit;
    return filteredProducts.slice(start, start + filters.limit);
  }, [filteredProducts, safePage, filters.limit]);

  return {
    products: paginatedProducts,
    total,
    totalPages,
    currentPage: safePage,
    availableBrands,
    brandCounts,
    isLoading,
    error,
    refetch,
  };
}
