import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { Navbar } from '../../../components/layout/Navbar';
import { ImageWithSkeleton } from '../../../components/ui/ImageWithSkeleton';
import { Modal } from '../../../components/ui/Modal';
import {
  DeleteOutlined,
  ShoppingOutlined,
  CheckCircleFilled,
  LockOutlined,
  ArrowLeftOutlined,
  MinusOutlined,
  PlusOutlined,
  WarningFilled,
  CarOutlined,
} from '@ant-design/icons';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalItems, subtotal, isLoading, updateQuantity, removeFromCart, clearCart } = useCart();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [confirmedTotal, setConfirmedTotal] = useState(0);
  const [orderNumber] = useState(() => Math.floor(100000 + Math.random() * 900000));

  const handleProceedToCheckout = () => {
    setConfirmedTotal(subtotal);
    setIsCheckoutModalOpen(true);
    clearCart();
  };

  const handleConfirmClear = () => {
    clearCart();
    setIsClearModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar showSidebarToggle={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Back Link */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeftOutlined className="text-xs" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Loading State Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-slate-200 rounded w-48 mb-4" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 flex gap-4">
                  <div className="w-24 h-24 bg-slate-200 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="bg-white rounded-xl p-6 border border-slate-200 space-y-4">
                <div className="h-6 bg-slate-200 rounded w-1/2" />
                <div className="h-4 bg-slate-100 rounded" />
                <div className="h-10 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-2xl mx-auto shadow-xs my-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 text-4xl">
              <ShoppingOutlined />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Your Shopping Cart is empty
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              Looks like you haven't added anything to your cart yet. Browse our top products and find great deals!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 py-3 px-6 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-slate-900 font-bold text-sm rounded-xl shadow-xs transition-colors"
            >
              <ShoppingOutlined />
              <span>Explore Products</span>
            </Link>
          </div>
        ) : (
          /* Cart Content Layout: 2 Columns */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                      Shopping Cart
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {totalItems} item{totalItems > 1 ? 's' : ''} in your cart
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsClearModalOpen(true)}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline cursor-pointer"
                  >
                    Clear all items
                  </button>
                </div>

                {/* Items */}
                <div className="divide-y divide-slate-100">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                    >
                      {/* Product Image with Skeleton */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 border border-slate-200/80 rounded-xl p-2 shrink-0 flex items-center justify-center">
                        <ImageWithSkeleton
                          src={product.thumbnail || product.images[0]}
                          alt={product.title}
                          containerClassName="w-full h-full"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      {/* Item Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            {product.brand && (
                              <span className="text-[10px] font-bold uppercase tracking-wide text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 inline-block mb-1">
                                {product.brand}
                              </span>
                            )}
                            <Link
                              to={`/product/${product.id}`}
                              className="text-sm sm:text-base font-semibold text-slate-900 hover:text-amber-700 transition-colors line-clamp-1"
                            >
                              {product.title}
                            </Link>
                            <p className="text-xs text-slate-500 capitalize mt-0.5">
                              Category: {product.category}
                            </p>
                          </div>
                          <span className="text-base sm:text-lg font-bold text-slate-900">
                            ₹{(product.price * quantity).toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-emerald-700 mt-1 font-medium">
                          <CheckCircleFilled className="text-emerald-600" />
                          <span>In Stock</span>
                        </div>

                        {/* Quantity and Remove Controls */}
                        <div className="flex items-center justify-between mt-3 pt-2">
                          <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="p-1.5 sm:px-2.5 sm:py-1 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <MinusOutlined className="text-xs" />
                            </button>
                            <span className="px-3 py-1 text-xs sm:text-sm font-bold text-slate-800 min-w-8 text-center bg-white">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="p-1.5 sm:px-2.5 sm:py-1 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <PlusOutlined className="text-xs" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                          >
                            <DeleteOutlined />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="sticky top-22">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Items ({totalItems}):</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping:</span>
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Estimated Tax:</span>
                    <span>₹0.00</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-base font-bold text-slate-900">
                  <span>Order Total:</span>
                  <span className="text-xl font-extrabold text-slate-900">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Amazon Signature Yellow Proceed to Checkout Button */}
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 px-4 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-slate-900 font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LockOutlined className="text-base" />
                  <span>Proceed to Checkout</span>
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                  <LockOutlined className="text-xs" />
                  <span>100% Secure Transaction & Free Returns</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Proper Checkout Confirmation Modal */}
      <Modal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        title="Order Placed Successfully"
        footer={
          <button
            type="button"
            onClick={() => {
              setIsCheckoutModalOpen(false);
              navigate('/');
            }}
            className="w-full sm:w-auto py-2.5 px-6 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-slate-900 font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        }
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl">
            <CheckCircleFilled />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Thank you for your order, Himanshu!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Your order confirmation has been sent to himanshu@shopit.com.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2 text-xs">
            <div className="flex justify-between text-slate-700">
              <span className="font-semibold">Order ID:</span>
              <span className="font-mono text-slate-900">#SHOPIT-{orderNumber}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span className="font-semibold">Amount Paid:</span>
              <span className="font-bold text-slate-900 text-sm">₹{confirmedTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 pt-2 border-t border-slate-200/80 font-medium">
              <CarOutlined className="text-sm" />
              <span>Estimated Delivery: Within 2-3 business days</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Proper Clear Cart Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear Shopping Cart"
        maxWidth="sm"
        footer={
          <div className="flex items-center gap-2 w-full justify-end">
            <button
              type="button"
              onClick={() => setIsClearModalOpen(false)}
              className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmClear}
              className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Clear All Items
            </button>
          </div>
        }
      >
        <div className="flex items-start gap-3 py-2">
          <span className="text-amber-500 text-2xl shrink-0 mt-0.5">
            <WarningFilled />
          </span>
          <p className="text-xs sm:text-sm text-slate-600">
            Are you sure you want to remove all items from your cart? You will lose all selected items.
          </p>
        </div>
      </Modal>
    </div>
  );
};
