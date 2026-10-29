import { useCallback, useEffect, useState } from 'react';
import { fetchProductById } from '../api/products.api';
import type { Product } from '../types/product.types';

export function useProductDetail(productId: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const refetch = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      if (!productId) {
        setError('Product ID is missing');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProductById(productId, controller.signal);
        setProduct(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const msg = err instanceof Error ? err.message : 'Failed to fetch product details';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [productId, reloadTrigger]);

  return { product, isLoading, error, refetch };
}
