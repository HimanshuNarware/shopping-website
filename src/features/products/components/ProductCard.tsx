import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/product.types';
import { StarRating } from '../../../components/ui/StarRating';
import { ImageWithSkeleton } from '../../../components/ui/ImageWithSkeleton';
import { useCart } from '../../cart/context/useCart';
import {
  ShoppingCartOutlined,
  CheckOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { items, addToCart, updateQuantity } = useCart();

  const cartItem = items.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="group bg-white rounded-xl border border-slate-200/80 p-3.5 flex flex-col cursor-pointer transition-all duration-200 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
      aria-label={`View details for ${product.title}`}
    >
      {/* Product Image with Skeleton Loading */}
      <div className="w-full aspect-square bg-slate-50/70 rounded-lg overflow-hidden flex items-center justify-center p-2 mb-2 group-hover:bg-slate-100/60 transition-colors">
        <ImageWithSkeleton
          src={product.thumbnail || product.images[0]}
          alt={product.title}
          containerClassName="w-full h-full rounded-md"
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Brand Badge */}
      <div className="mb-1">
        <span className="text-[10px] font-bold tracking-wider uppercase text-amber-800 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
          {product.brand || 'Generic'}
        </span>
      </div>

      {/* Product Title */}
      <h3
        className="text-sm font-semibold text-slate-800 line-clamp-1 mb-1.5 group-hover:text-amber-700 transition-colors"
        title={product.title}
      >
        {product.title}
      </h3>

      {/* Price & Rating */}
      <div className="flex items-center justify-between gap-1 mb-3">
        <span className="text-sm font-bold text-slate-900">
          ₹{product.price.toFixed(2)}
        </span>
        <StarRating rating={product.rating} size="sm" />
      </div>

      {/* Action Buttons: Add to Cart OR Added to Cart with -/+ controls */}
      <div className="mt-auto pt-1">
        {quantityInCart === 0 ? (
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-slate-900"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCartOutlined className="text-xs" />
            <span>Add to Cart</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 w-full">
            {/* Added to Cart Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/cart');
              }}
              className="flex-1 min-w-0 py-1.5 px-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
              title="View cart"
            >
              <CheckOutlined className="text-[10px] shrink-0" />
              <span className="truncate">Added to Cart</span>
            </button>

            {/* Quantity Selector on the Right with - and + */}
            <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 overflow-hidden shadow-2xs shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(product.id, quantityInCart - 1);
                }}
                className="py-1 px-1.5 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <MinusOutlined className="text-[9px]" />
              </button>
              <span className="px-1.5 py-0.5 text-xs font-bold text-slate-800 min-w-4 text-center bg-white">
                {quantityInCart}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(product.id, quantityInCart + 1);
                }}
                className="py-1 px-1.5 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <PlusOutlined className="text-[9px]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
