import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  text: string;
}

interface NotificationProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export default function Notification({ toasts, onRemove }: NotificationProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border bg-white shadow-xl overflow-hidden relative"
            style={{
              borderColor:
                toast.type === 'success'
                  ? '#bbf7d0'
                  : toast.type === 'warning'
                    ? '#fef08a'
                    : '#e0f2fe',
            }}
          >
            {/* Color Accent Indicator Strip */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5"
              style={{
                backgroundColor:
                  toast.type === 'success'
                    ? '#22c55e'
                    : toast.type === 'warning'
                      ? '#eab308'
                      : '#06b6d4',
              }}
            />

            <div className="pl-1">
              {toast.type === 'success' && (
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
              )}
              {toast.type === 'warning' && (
                <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
              )}
              {toast.type === 'info' && (
                <Info className="h-5 w-5 text-cyan-600 shrink-0" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-2">
              <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                {toast.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {toast.text}
              </p>
            </div>

            <button
              onClick={() => onRemove(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded-lg hover:bg-gray-100 shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
