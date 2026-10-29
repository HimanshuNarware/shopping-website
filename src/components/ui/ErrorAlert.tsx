import React from 'react';
import { WarningOutlined, ReloadOutlined } from '@ant-design/icons';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-red-500 text-lg mt-0.5">
          <WarningOutlined />
        </span>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-900">{title}</h3>
          <p className="text-xs sm:text-sm text-red-700 mt-1">{message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors shadow-xs"
            >
              <ReloadOutlined />
              <span>Try Again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
