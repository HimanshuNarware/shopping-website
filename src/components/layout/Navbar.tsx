import React, { useState, useRef, useEffect } from 'react';
import {
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  BellOutlined,
  UserOutlined,
  CloseCircleFilled,
  ShoppingOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../features/cart/context/useCart';
import { Modal } from '../ui/Modal';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

type UserModalType = 'profile' | 'orders' | 'addresses' | 'settings' | null;

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery = '',
  onSearchChange,
  onToggleSidebar,
  showSidebarToggle = true,
}) => {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeUserModal, setActiveUserModal] = useState<UserModalType>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenUserModal = (type: UserModalType) => {
    setActiveUserModal(type);
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <header className="bg-slate-800 text-slate-100 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Mobile Sidebar Toggle and Brand Name (No logo icon, Pacifico font) */}
          <div className="flex items-center gap-3">
            {showSidebarToggle && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors md:hidden cursor-pointer"
                aria-label="Toggle filters sidebar"
              >
                <MenuOutlined className="text-lg" />
              </button>
            )}

            {/* ShopIt with Pacifico font family and no front logo */}
            <Link
              to="/"
              className="font-pacifico text-2xl sm:text-3xl text-white hover:text-amber-300 transition-colors tracking-wide select-none"
            >
              ShopIt
            </Link>
          </div>

          {/* Center: Search input */}
          <div className="flex-1 max-w-xl mx-2">
            {onSearchChange ? (
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <SearchOutlined className="text-sm" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-8 py-1.5 bg-slate-900/60 text-slate-100 placeholder-slate-400 text-sm rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <CloseCircleFilled className="text-xs" />
                  </button>
                )}
              </div>
            ) : (
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <SearchOutlined className="text-sm" />
                </span>
                <input
                  type="text"
                  disabled
                  placeholder="Search products..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900/40 text-slate-400 text-sm rounded-lg border border-slate-700/60 cursor-not-allowed"
                />
              </div>
            )}
          </div>

          {/* Right: Icons (Cart, Notifications, Profile) */}
          <div className="flex items-center gap-2 sm:gap-3 text-slate-300">
            {/* Cart Button */}
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="p-2 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors relative cursor-pointer"
              aria-label={`Shopping Cart with ${totalItems} items`}
            >
              <ShoppingCartOutlined className="text-xl" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-[#ffd814] text-slate-900 font-bold text-[11px] rounded-full flex items-center justify-center border-2 border-slate-800 shadow-xs">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Notifications Dropdown: Shows 0 Notifications on Click */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => {
                  setIsNotificationOpen((prev) => !prev);
                  setIsUserMenuOpen(false);
                }}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isNotificationOpen
                    ? 'text-white bg-slate-700/70'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
                aria-label="Notifications"
              >
                <BellOutlined className="text-lg" />
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-3 z-50 text-slate-800 animate-in fade-in-50 duration-150">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Notifications
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded-full">
                      0 New
                    </span>
                  </div>
                  <div className="py-6 px-4 text-center space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-lg">
                      <BellOutlined />
                    </div>
                    <p className="text-sm font-bold text-slate-800">0 Notifications</p>
                    <p className="text-xs text-slate-500">You have 0 unread notifications right now.</p>
                  </div>
                </div>
              )}
            </div>

            {/* User Account Dropdown for Himanshu with 4 Dead Options */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsUserMenuOpen((prev) => !prev);
                  setIsNotificationOpen(false);
                }}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
                  isUserMenuOpen
                    ? 'text-white bg-slate-700/70 ring-1 ring-slate-600'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
                aria-label="User Account Menu"
                aria-expanded={isUserMenuOpen}
              >
                <div className="w-6 h-6 rounded-full bg-[#ffd814] text-slate-900 font-extrabold text-xs flex items-center justify-center shadow-xs">
                  H
                </div>
                <span className="text-xs font-semibold hidden md:inline text-slate-100">
                  Himanshu
                </span>
              </button>

              {/* Profile Menu with 4 Options */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in-50 duration-150">
                  {/* User Header */}
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#ffd814] text-slate-900 font-extrabold text-sm flex items-center justify-center shadow-xs">
                        H
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">Himanshu</p>
                        <p className="text-[11px] text-slate-400 truncate">himanshu@shopit.com</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                      <CheckCircleOutlined className="text-amber-600 text-xs" />
                      <span>Prime Member</span>
                    </div>
                  </div>

                  {/* 4 Options triggering proper modals */}
                  <div className="p-1 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => handleOpenUserModal('profile')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      <UserOutlined className="text-slate-400 text-sm" />
                      <span>My Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenUserModal('orders')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      <ShoppingOutlined className="text-slate-400 text-sm" />
                      <span>Your Orders</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenUserModal('addresses')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      <EnvironmentOutlined className="text-slate-400 text-sm" />
                      <span>Saved Addresses</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenUserModal('settings')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      <SettingOutlined className="text-slate-400 text-sm" />
                      <span>Account Settings</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Proper Modals for User Options (Replacing all window warnings) */}
      <Modal
        isOpen={activeUserModal === 'profile'}
        onClose={() => setActiveUserModal(null)}
        title="My Profile"
        footer={
          <button
            type="button"
            onClick={() => setActiveUserModal(null)}
            className="py-2 px-5 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-bold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-[#ffd814] text-slate-900 font-extrabold text-lg flex items-center justify-center">
              H
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Himanshu</h4>
              <p className="text-xs text-slate-500">himanshu@shopit.com</p>
            </div>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-400 block mb-0.5">Membership</span>
            <span className="font-semibold text-amber-700">ShopIt Prime</span>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeUserModal === 'orders'}
        onClose={() => setActiveUserModal(null)}
        title="Your Orders"
        footer={
          <button
            type="button"
            onClick={() => setActiveUserModal(null)}
            className="py-2 px-5 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-bold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        }
      >
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">Order #SHOPIT-78291</p>
              <p className="text-[11px] text-slate-500">Delivered on 25 Oct 2026</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Delivered
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">Order #SHOPIT-64218</p>
              <p className="text-[11px] text-slate-500">Delivered on 18 Oct 2026</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Delivered
            </span>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeUserModal === 'addresses'}
        onClose={() => setActiveUserModal(null)}
        title="Saved Addresses"
        footer={
          <button
            type="button"
            onClick={() => setActiveUserModal(null)}
            className="py-2 px-5 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-bold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        }
      >
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs text-slate-700">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-slate-900 text-sm">Himanshu (Default)</span>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
              Home
            </span>
          </div>
          <p>Flat 402, Green Valley Towers</p>
          <p>Indiranagar, Bengaluru, Karnataka, 560038</p>
        </div>
      </Modal>

      <Modal
        isOpen={activeUserModal === 'settings'}
        onClose={() => setActiveUserModal(null)}
        title="Account Settings"
        footer={
          <button
            type="button"
            onClick={() => setActiveUserModal(null)}
            className="py-2 px-5 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-bold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        }
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">Currency</p>
              <p className="text-slate-500 text-[11px]">Display prices in Indian Rupee</p>
            </div>
            <span className="font-bold text-slate-800 bg-white px-2.5 py-1 rounded border border-slate-200">
              INR (₹)
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">Security & 2FA</p>
              <p className="text-slate-500 text-[11px]">Two-Factor Authentication is active</p>
            </div>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <SafetyCertificateOutlined />
              <span>Enabled</span>
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};
