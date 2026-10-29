import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetail } from '../hooks/useProductDetail';
import { useCart } from '../../cart/context/useCart';
import { Navbar } from '../../../components/layout/Navbar';
import { StarRating } from '../../../components/ui/StarRating';
import { ErrorAlert } from '../../../components/ui/ErrorAlert';
import { ImageWithSkeleton } from '../../../components/ui/ImageWithSkeleton';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  SafetyCertificateOutlined,
  CarOutlined,
  UserOutlined,
  CheckOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, isLoading, error, refetch } = useProductDetail(id);
  const { addToCart } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const handleBack = () => {
    // Navigate back to listing page preserving filter search params in browser history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar showSidebarToggle={false} />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs animate-pulse">
            <div className="w-24 h-9 bg-slate-200 rounded-lg mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="aspect-square bg-slate-200/80 rounded-xl" />
              <div className="space-y-4">
                <div className="h-8 bg-slate-200 rounded w-3/4" />
                <div className="h-6 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-px bg-slate-100 my-4" />
                <div className="h-20 bg-slate-100 rounded" />
                <div className="h-px bg-slate-100 my-4" />
                <div className="h-24 bg-slate-100 rounded" />
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="py-8">
            <ErrorAlert
              title="Product not found"
              message={error}
              onRetry={refetch}
            />
            <div className="mt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ArrowLeftOutlined />
                <span>Return to Product Listing</span>
              </button>
            </div>
          </div>
        )}

        {/* Product Details Card matching Screenshot */}
        {product && !isLoading && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            {/* Back Button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
              >
                <ArrowLeftOutlined className="text-xs" />
                <span>Back</span>
              </button>
            </div>

            {/* Product Body: 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Column: Product Image Gallery with ImageWithSkeleton */}
              <div className="flex flex-col gap-4">
                <div className="w-full aspect-square bg-slate-50/70 border border-slate-100 rounded-2xl overflow-hidden flex items-center justify-center p-6">
                  <ImageWithSkeleton
                    src={product.images[selectedImageIndex] || product.thumbnail}
                    alt={product.title}
                    containerClassName="w-full h-full"
                    className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Thumbnail Previews with ImageWithSkeleton */}
                {product.images && product.images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {product.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-16 h-16 rounded-lg border-2 p-1 bg-slate-50 shrink-0 overflow-hidden transition-all cursor-pointer ${
                          selectedImageIndex === idx
                            ? 'border-amber-500 ring-2 ring-amber-100'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        aria-label={`View photo ${idx + 1}`}
                      >
                        <ImageWithSkeleton
                          src={imgUrl}
                          alt={`${product.title} thumbnail ${idx + 1}`}
                          containerClassName="w-full h-full"
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Badges / Meta */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
                  {product.availabilityStatus && (
                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100">
                      <CheckCircleOutlined className="text-emerald-600" />
                      <span className="font-medium">{product.availabilityStatus}</span>
                      {product.stock !== undefined && (
                        <span className="text-emerald-700">({product.stock} left)</span>
                      )}
                    </div>
                  )}
                  {product.warrantyInformation && (
                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-100">
                      <SafetyCertificateOutlined className="text-amber-600" />
                      <span className="font-medium truncate">{product.warrantyInformation}</span>
                    </div>
                  )}
                  {product.shippingInformation && (
                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 col-span-2">
                      <CarOutlined className="text-slate-500" />
                      <span>{product.shippingInformation}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Title, Price, Rating, Specs, Description, Reviews */}
              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
                  {product.title}
                </h1>

                {/* Price & Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-extrabold text-slate-900">
                    ₹{product.price.toFixed(2)}
                  </span>
                  {product.discountPercentage && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-100 text-red-700">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                  <StarRating rating={product.rating} size="md" />
                </div>

                {/* Brand & Category */}
                <div className="space-y-1.5 text-sm text-slate-600 mb-5">
                  <p>
                    <span className="font-semibold text-slate-800">Brand: </span>
                    <span className="text-slate-900 font-medium bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded text-xs uppercase tracking-wide">
                      {product.brand || 'Generic'}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">Category: </span>
                    <span className="capitalize text-slate-700">{product.category}</span>
                  </p>
                  {product.sku && (
                    <p className="text-xs text-slate-400">
                      <span>SKU: </span>
                      <code>{product.sku}</code>
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-200 mb-5" />

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-200 mb-5" />

                {/* Customer Reviews Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      Reviews
                    </h3>
                    {product.reviews && product.reviews.length > 0 && (
                      <span className="text-xs text-slate-500">
                        {product.reviews.length} customer review{product.reviews.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((rev, index) => (
                        <div
                          key={index}
                          className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3.5 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-semibold">
                                <UserOutlined />
                              </div>
                              <span className="text-xs font-semibold text-slate-800">
                                {rev.reviewerName}
                              </span>
                            </div>
                            <StarRating rating={rev.rating} size="sm" />
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 italic">
                            "{rev.comment}"
                          </p>
                          {rev.date && (
                            <p className="text-[11px] text-slate-400">
                              {new Date(rev.date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      No customer reviews yet.
                    </p>
                  )}
                </div>

                {/* Quantity and Amazon-styled CTA Buttons */}
                <div className="mt-8 pt-4 border-t border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <label htmlFor="qty-select" className="text-xs font-bold text-slate-700">
                      Quantity:
                    </label>
                    <select
                      id="qty-select"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="px-2.5 py-1 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Primary Amazon Yellow Button: Add to Cart */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`flex-1 py-3 px-6 text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        justAdded
                          ? 'bg-emerald-600 text-white border border-emerald-600'
                          : 'bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-slate-900'
                      }`}
                    >
                      {justAdded ? (
                        <>
                          <CheckOutlined className="text-base" />
                          <span>Added to Cart ({quantity})</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCartOutlined className="text-base" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    {/* Secondary Amazon Orange Button: Buy Now */}
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="flex-1 py-3 px-6 bg-[#ffa41c] hover:bg-[#ff8f00] active:bg-[#e07e00] border border-[#ff8f00] text-slate-900 font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ThunderboltFilled className="text-base" />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
