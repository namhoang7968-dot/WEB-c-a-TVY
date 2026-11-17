import React from 'react';
import { Plus, Database, CloudCheck, Sparkles } from 'lucide-react';

export default function Header({
  breadcrumb = 'GSA Campaign / Lịch nội dung',
  title = 'Lịch nội dung',
  subtitle = 'Theo dõi riêng 8 bài bắt buộc và các nội dung bổ sung. Không có bài nào tự động được đánh dấu đã đăng.',
  onOpenCreateModal,
  showCreateButton = true,
  actionButtonLabel = '+ Tạo nội dung',
  storageStatus = 'Đồng bộ Supabase trực tuyến'
}) {
  return (
    <div className="pb-5 pt-1">
      {/* Top row: Breadcrumb & Right Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        {/* Breadcrumb */}
        <div className="text-xs text-slate-400 font-medium">
          {breadcrumb}
        </div>

        {/* Status Badge & Action Button */}
        <div className="flex items-center gap-3">
          {/* Storage status badge: Live Supabase Connected */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-xs font-semibold text-emerald-700 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span>{storageStatus}</span>
          </div>

          {/* Create Button */}
          {showCreateButton && (
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-all duration-150 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{actionButtonLabel.replace(/^\+\s*/, '')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500 leading-normal font-normal">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
