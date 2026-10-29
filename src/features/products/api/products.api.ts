import { apiClient } from '../../../lib/apiClient';
import type { CategoryItem, Product, ProductsResponse } from '../types/product.types';

export interface FetchProductsOptions {
  category?: string;
  limit?: number;
  skip?: number;
  signal?: AbortSignal;
}

export async function fetchProducts({
  category,
  limit = 0,
  skip = 0,
  signal,
}: FetchProductsOptions = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  if (limit !== undefined) params.append('limit', limit.toString());
  if (skip !== undefined) params.append('skip', skip.toString());

  const queryString = params.toString() ? `?${params.toString()}` : '';

  if (category && category.trim()) {
    return apiClient<ProductsResponse>(
      `/products/category/${encodeURIComponent(category.trim())}${queryString}`,
      { signal }
    );
  }

  return apiClient<ProductsResponse>(`/products${queryString}`, { signal });
}

export async function fetchCategories(signal?: AbortSignal): Promise<CategoryItem[]> {
  const data = await apiClient<unknown[]>('/products/categories', { signal });

  // DummyJSON returns array of objects [{slug, name, url}] or array of strings in some versions
  return (data || []).map((item) => {
    if (typeof item === 'string') {
      return {
        slug: item,
        name: item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, ' '),
      };
    }
    const cat = item as { slug?: string; name?: string; url?: string };
    return {
      slug: cat.slug || '',
      name: cat.name || cat.slug || '',
      url: cat.url,
    };
  }).filter((cat) => Boolean(cat.slug));
}

export async function fetchProductById(
  id: string | number,
  signal?: AbortSignal
): Promise<Product> {
  return apiClient<Product>(`/products/${id}`, { signal });
}
