import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, ExternalLink } from 'lucide-react';

export const NotificationDropdown: React.FC = () => {
  const { notifications, unreadCount, markNotificationRead } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#4A453E] hover:text-[#1A1A1A] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C2A676] ring-2 ring-[#FAF9F5]" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FAF9F5] border border-[#E5E0D5] shadow-2xl rounded-md p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E0D5]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                Atelier Communications ({notifications.length})
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={() => notifications.forEach((n) => markNotificationRead(n.id))}
                  className="text-[11px] text-[#C2A676] hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {notifications.length === 0 ? (
                <p className="text-xs text-center py-6 text-[#7A7469]">No new messages or atelier notices.</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.link) {
                        window.location.hash = n.link;
                        setIsOpen(false);
                      }
                    }}
                    className={`p-2.5 rounded text-xs transition-colors cursor-pointer border ${
                      n.isRead
                        ? 'bg-transparent border-transparent text-[#666055]'
                        : 'bg-[#F2EEE4] border-[#E5DFCE] text-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{n.title}</span>
                      <span className="text-[10px] text-[#8C8476]">
                        {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#554F44] mt-1 leading-relaxed">{n.message}</p>
                    {n.link && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#C2A676] mt-1 font-medium">
                        View detail <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
