import React, { useState } from 'react';
import {
  CloseOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onAuthSuccess?: (username: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);


  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = mode === 'signup' && name ? name : email.split('@')[0] || 'User';
    setIsSuccess(true);
    setTimeout(() => {
      onAuthSuccess?.(displayName);
      onClose();
    }, 1000);
  };

  const handleDemoLogin = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onAuthSuccess?.('Demo Customer');
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close authentication modal"
        >
          <CloseOutlined className="text-sm" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl">
              <CheckCircleFilled />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              {mode === 'login' ? 'Welcome back!' : 'Account created successfully!'}
            </h3>
            <p className="text-xs text-slate-500">Redirecting to your session...</p>
          </div>
        ) : (
          <div>
            {/* Title & Tabs */}
            <div className="flex items-center border-b border-slate-200 mb-6">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 pb-3 text-sm font-semibold transition-all relative ${
                  mode === 'login'
                    ? 'text-slate-900 border-b-2 border-amber-500'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 pb-3 text-sm font-semibold transition-all relative ${
                  mode === 'signup'
                    ? 'text-slate-900 border-b-2 border-amber-500'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Create Account
              </button>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {mode === 'login' ? 'Sign in to ShopSphere' : 'Create your account'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              {mode === 'login'
                ? 'Access your orders, saved items, and personalized filters.'
                : 'Enjoy member discounts, fast checkout, and order tracking.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <UserOutlined className="text-xs" />
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Smith"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MailOutlined className="text-xs" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <LockOutlined className="text-xs" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Amazon-styled Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-slate-900 font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {mode === 'login' ? 'Sign In' : 'Create your ShopSphere Account'}
              </button>

              {/* Quick Demo Login Option */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                Demo 1-Click Sign In
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
