import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const iconStyles = {
    success: 'text-emerald-400',
    error: 'text-rose-400',
    info: 'text-blue-400'
  };

  const Icon = type === 'error' ? AlertCircle : type === 'info' ? Info : CheckCircle2;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-3 duration-150">
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl shadow-xl bg-slate-900 text-white border border-slate-800 text-xs font-medium">
        <Icon className={`w-4 h-4 shrink-0 ${iconStyles[type] || 'text-blue-400'}`} />
        <span className="text-slate-100">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
