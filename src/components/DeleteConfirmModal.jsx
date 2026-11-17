import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  item
}) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-md overflow-hidden p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto mb-4">
          <Trash2 className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-900">
          Xác nhận xóa nội dung?
        </h3>

        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Bạn có chắc chắn muốn xóa bài <span className="font-semibold text-slate-800">"{item.code}"</span>?
          Hành động này sẽ xóa vĩnh viễn nội dung này khỏi danh sách quản lý.
        </p>

        <div className="mt-3 p-3 bg-slate-50 rounded-lg text-left text-xs border border-slate-200/60">
          <p className="font-semibold text-slate-800 truncate">{item.topic}</p>
          <p className="text-slate-500 mt-0.5">{item.channel} • {item.format}</p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => onConfirm(item.id)}
            className="flex-1 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
}
