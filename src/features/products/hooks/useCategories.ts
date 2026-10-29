import { useEffect, useState } from 'react';
import { fetchCategories } from '../api/products.api';
import type { CategoryItem } from '../types/product.types';

export function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchCategories(controller.signal);
        setCategories(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const msg = err instanceof Error ? err.message : 'Failed to fetch categories';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, []);

  return { categories, isLoading, error };
}
