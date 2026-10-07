import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderClass = 'border-[#C2A676]/40';
        let iconColor = 'text-[#C2A676]';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-[#EF4444]/40';
          iconColor = 'text-[#EF4444]';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-[#3B82F6]/40';
          iconColor = 'text-[#3B82F6]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 bg-[#FAF9F5] text-[#1A1A1A] border ${borderClass} shadow-xl rounded-md animate-in slide-in-from-bottom-2 duration-200 text-xs leading-relaxed`}
          >
            <Icon className={`w-4 h-4 ${iconColor} shrink-0 mt-0.5`} />
            <div className="flex-1 font-medium">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#999] hover:text-[#1A1A1A] transition-colors p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
