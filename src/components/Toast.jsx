import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const bgStyles = {
    success: 'bg-emerald-600 text-white shadow-emerald-500/20',
    error: 'bg-rose-600 text-white shadow-rose-500/20',
    info: 'bg-blue-600 text-white shadow-blue-500/20'
  };

  const Icon = type === 'error' ? AlertCircle : type === 'info' ? Info : CheckCircle2;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-xs font-medium ${bgStyles[type]}`}>
        <Icon className="w-4 h-4 shrink-0" />
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-80 p-0.5 rounded transition-opacity"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
