import React, { useState } from 'react';
import { useFilterParams } from '../hooks/useFilterParams';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { Navbar } from '../../../components/layout/Navbar';
import { ProductFilters } from '../components/ProductFilters';
import { ProductGrid } from '../components/ProductGrid';
import { Pagination } from '../../../components/ui/Pagination';
import { AppstoreOutlined, CloseOutlined } from '@ant-design/icons';

export const ProductListingPage: React.FC = () => {
  const { filters, updateFilters, resetFilters } = useFilterParams();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const {
    products,
    total,
    totalPages,
    currentPage,
    availableBrands,
    brandCounts,
    isLoading,
    error,
    refetch,
  } = useProducts(filters);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Multi-select Category toggle handler
  const handleCategoryToggle = (slug: string) => {
    const nextCategories = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    updateFilters({ categories: nextCategories });
  };

  // Price Range handler
  const handlePriceRangeChange = (min: number | null, max: number | null) => {
    updateFilters({ minPrice: min, maxPrice: max });
  };

  // Brand toggle handler
  const handleBrandToggle = (brand: string) => {
    const nextBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    updateFilters({ brands: nextBrands });
  };

  // Search handler
  const handleSearchChange = (query: string) => {
    updateFilters({ search: query });
  };

  // Page change handler
  const handlePageChange = (page: number) => {
    updateFilters({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isFilterActive = Boolean(
    filters.categories.length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.brands.length > 0 ||
    filters.search
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        searchQuery={filters.search}
        onSearchChange={handleSearchChange}
        onToggleSidebar={() => setMobileFilterOpen((prev) => !prev)}
        showSidebarToggle={true}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Desktop Left Sidebar Filters */}
          <div className="hidden md:block w-64 lg:w-72 shrink-0 sticky top-22">
            <ProductFilters
              categories={categories}
              isCategoriesLoading={isCategoriesLoading}
              selectedCategories={filters.categories}
              onCategoryToggle={handleCategoryToggle}
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onPriceRangeChange={handlePriceRangeChange}
              availableBrands={availableBrands}
              brandCounts={brandCounts}
              selectedBrands={filters.brands}
              onBrandToggle={handleBrandToggle}
              onResetAll={resetFilters}
              isFilterActive={isFilterActive}
            />
          </div>

          {/* Mobile Filter Drawer Modal */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
                onClick={() => setMobileFilterOpen(false)}
              />

              {/* Drawer Content */}
              <div className="relative ml-0 w-4/5 max-w-sm bg-white h-full shadow-2xl p-4 overflow-y-auto z-10 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-2">
                  <span className="font-semibold text-slate-800 text-base">Filter Products</span>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1.5 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                    aria-label="Close filters"
                  >
                    <CloseOutlined />
                  </button>
                </div>
                <ProductFilters
                  categories={categories}
                  isCategoriesLoading={isCategoriesLoading}
                  selectedCategories={filters.categories}
                  onCategoryToggle={handleCategoryToggle}
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  onPriceRangeChange={handlePriceRangeChange}
                  availableBrands={availableBrands}
                  brandCounts={brandCounts}
                  selectedBrands={filters.brands}
                  onBrandToggle={handleBrandToggle}
                  onResetAll={resetFilters}
                  isFilterActive={isFilterActive}
                />
              </div>
            </div>
          )}

          {/* Right Product Grid Area */}
          <section className="flex-1 min-w-0 w-full" aria-label="Product Catalog">
            {/* Top Toolbar */}
            <div className="bg-white rounded-xl border border-slate-200/80 px-4 py-3 mb-4 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm sm:text-base">
                <AppstoreOutlined className="text-amber-500 text-base" />
                <span>
                  {filters.categories.length > 0
                    ? `Categories (${filters.categories.length})`
                    : 'All Products'}
                </span>
                {filters.brands.length > 0 && (
                  <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-full font-normal hidden sm:inline">
                    {filters.brands.length} brand{filters.brands.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="text-xs sm:text-sm text-slate-500">
                {!isLoading && (
                  <span>
                    Showing <strong className="text-slate-800">{total > 0 ? (currentPage - 1) * filters.limit + 1 : 0}</strong> - <strong className="text-slate-800">{Math.min(currentPage * filters.limit, total)}</strong> of <strong className="text-slate-800">{total}</strong> products
                  </span>
                )}
              </div>
            </div>

            {/* Product Grid */}
            <ProductGrid
              products={products}
              isLoading={isLoading}
              error={error}
              onRetry={refetch}
              onResetFilters={resetFilters}
            />

            {/* Pagination at bottom */}
            {!isLoading && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
};
