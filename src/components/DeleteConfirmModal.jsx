import React from 'react';
import { Trash2 } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  item
}) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-sm overflow-hidden p-5 sm:p-6 text-center">
        <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto mb-3">
          <Trash2 className="w-5 h-5" />
        </div>

        <h3 className="text-sm sm:text-base font-semibold text-[#0F172A]">
          Xác nhận xóa nội dung?
        </h3>

        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-normal">
          Bạn có chắc chắn muốn xóa bài <span className="font-semibold text-slate-900 font-mono">"{item.code}"</span>?
          Hành động này sẽ xóa dữ liệu khỏi danh sách quản lý.
        </p>

        <div className="mt-3 p-3 bg-slate-50/70 rounded-lg text-left text-xs border border-slate-200/70">
          <p className="font-medium text-slate-900 truncate">{item.topic}</p>
          <p className="text-slate-400 mt-0.5">{item.channel} • {item.format}</p>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2.5">
          <button
            onClick={onClose}
            className="tactile-btn flex-1 px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => onConfirm(item.id)}
            className="tactile-btn flex-1 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-medium text-xs transition-colors shadow-2xs cursor-pointer"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
}
