import React, { useState } from 'react';
import { SearchOutlined, ClearOutlined, FilterOutlined } from '@ant-design/icons';
import type { CategoryItem } from '../types/product.types';

interface PriceRangeFormProps {
  minPrice: number | null;
  maxPrice: number | null;
  onPriceRangeChange: (min: number | null, max: number | null) => void;
}

const PriceRangeForm: React.FC<PriceRangeFormProps> = ({
  minPrice,
  maxPrice,
  onPriceRangeChange,
}) => {
  const [localMin, setLocalMin] = useState<string>(minPrice !== null ? minPrice.toString() : '');
  const [localMax, setLocalMax] = useState<string>(maxPrice !== null ? maxPrice.toString() : '');

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedMin = localMin.trim() !== '' && !isNaN(Number(localMin)) ? Math.max(0, Number(localMin)) : null;
    const parsedMax = localMax.trim() !== '' && !isNaN(Number(localMax)) ? Math.max(0, Number(localMax)) : null;

    if (parsedMin !== null && parsedMax !== null && parsedMin > parsedMax) {
      onPriceRangeChange(parsedMax, parsedMin);
    } else {
      onPriceRangeChange(parsedMin, parsedMax);
    }
  };

  const handleClear = () => {
    setLocalMin('');
    setLocalMax('');
    onPriceRangeChange(null, null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Price Range
        </h4>
        {(minPrice !== null || maxPrice !== null) && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-amber-700 hover:text-amber-900 underline cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      <form onSubmit={handleApplyPrice} className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="min-price-input" className="sr-only">
              Min Price
            </label>
            <input
              id="min-price-input"
              type="number"
              min="0"
              step="any"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              placeholder="Min"
              className="w-full px-2.5 py-1.5 bg-slate-50 text-slate-800 placeholder-slate-400 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <label htmlFor="max-price-input" className="sr-only">
              Max Price
            </label>
            <input
              id="max-price-input"
              type="number"
              min="0"
              step="any"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              placeholder="Max"
              className="w-full px-2.5 py-1.5 bg-slate-50 text-slate-800 placeholder-slate-400 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Amazon Signature Yellow/Gold Button */}
        <button
          type="submit"
          className="w-full py-1.5 px-3 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-slate-900 text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          Apply
        </button>
      </form>
    </div>
  );
};

interface ProductFiltersProps {
  categories: CategoryItem[];
  isCategoriesLoading?: boolean;
  selectedCategories: string[];
  onCategoryToggle: (categorySlug: string) => void;
  minPrice: number | null;
  maxPrice: number | null;
  onPriceRangeChange: (min: number | null, max: number | null) => void;
  availableBrands: string[];
  brandCounts?: Record<string, number>;
  selectedBrands: string[];
  onBrandToggle: (brand: string) => void;
  onResetAll: () => void;
  isFilterActive?: boolean;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  isCategoriesLoading = false,
  selectedCategories,
  onCategoryToggle,
  minPrice,
  maxPrice,
  onPriceRangeChange,
  availableBrands,
  brandCounts = {},
  selectedBrands,
  onBrandToggle,
  onResetAll,
  isFilterActive = false,
}) => {
  // Local state for sidebar quick filter search (filters visible categories & brands)
  const [filterQuery, setFilterQuery] = useState('');

  // Filter categories and brands based on sidebar search
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const filteredBrands = availableBrands.filter((b) =>
    b.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <aside className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col gap-5 text-slate-800">
      {/* Header & Quick Search */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-base">
            <FilterOutlined className="text-amber-500" />
            <span>Filters</span>
          </div>
          {isFilterActive && (
            <button
              type="button"
              onClick={onResetAll}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ClearOutlined />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Sidebar search box */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
            <SearchOutlined className="text-xs" />
          </span>
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search categories/brands..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 text-slate-800 placeholder-slate-400 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
          />
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Multi-Select Categories Filter */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Categories
            </h4>
            {selectedCategories.length > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-full">
                {selectedCategories.length}
              </span>
            )}
          </div>
          {selectedCategories.length > 0 && (
            <button
              type="button"
              onClick={() => {
                selectedCategories.forEach((slug) => onCategoryToggle(slug));
              }}
              className="text-xs text-amber-700 hover:text-amber-900 underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {isCategoriesLoading ? (
          <div className="space-y-2 py-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-1">No categories match.</p>
        ) : (
          <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 text-sm custom-scrollbar">
            {filteredCategories.map((cat) => {
              const isChecked = selectedCategories.includes(cat.slug);
              return (
                <label
                  key={cat.slug}
                  className="flex items-center justify-between text-xs sm:text-sm text-slate-700 hover:text-slate-900 cursor-pointer select-none py-0.5 rounded px-1 hover:bg-amber-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onCategoryToggle(cat.slug)}
                      className="w-4 h-4 accent-amber-500 text-amber-600 rounded border-slate-300 focus:ring-amber-400 cursor-pointer"
                    />
                    <span className={`truncate capitalize ${isChecked ? 'font-bold text-slate-900' : ''}`}>
                      {cat.name}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="h-px bg-slate-100" />

      {/* Price Range Filter */}
      <PriceRangeForm
        key={`${minPrice ?? 'none'}-${maxPrice ?? 'none'}`}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceRangeChange={onPriceRangeChange}
      />

      <div className="h-px bg-slate-100" />

      {/* Multi-Select Brands Filter */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Brands
            </h4>
            {selectedBrands.length > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-full">
                {selectedBrands.length}
              </span>
            )}
          </div>
          {selectedBrands.length > 0 && (
            <button
              type="button"
              onClick={() => {
                selectedBrands.forEach((b) => onBrandToggle(b));
              }}
              className="text-xs text-amber-700 hover:text-amber-900 underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {filteredBrands.length === 0 ? (
          <div className="py-2 space-y-1.5">
            {availableBrands.length === 0 ? (
              // Loading brands skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" />
              ))
            ) : (
              <p className="text-xs text-slate-400 italic py-1">No matching brands.</p>
            )}
          </div>
        ) : (
          <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 text-sm custom-scrollbar">
            {filteredBrands.map((brand) => {
              const isChecked = selectedBrands.includes(brand);
              const count = brandCounts[brand];
              return (
                <label
                  key={brand}
                  className="flex items-center justify-between text-xs sm:text-sm text-slate-700 hover:text-slate-900 cursor-pointer select-none py-0.5 rounded px-1 hover:bg-amber-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onBrandToggle(brand)}
                      className="w-4 h-4 accent-amber-500 text-amber-600 rounded border-slate-300 focus:ring-amber-400 cursor-pointer"
                    />
                    <span className={`truncate ${isChecked ? 'font-bold text-slate-900' : ''}`}>
                      {brand}
                    </span>
                  </div>
                  {count !== undefined && (
                    <span className="text-[11px] text-slate-400 ml-1">({count})</span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
