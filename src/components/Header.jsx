import React from 'react';
import { Plus } from 'lucide-react';

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
    <div className="pb-5 pt-0.5">
      {/* Top row: Breadcrumb & Right Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium tracking-normal">
          <span>{breadcrumb}</span>
        </div>

        {/* Status Badge & Action Button */}
        <div className="flex items-center gap-2.5">
          {/* Storage status badge: Live Supabase Connected */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-emerald-200/80 text-[11px] font-medium text-emerald-700 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>{storageStatus}</span>
          </div>

          {/* Create Button */}
          {showCreateButton && (
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs sm:text-sm font-medium px-3.5 py-1.5 sm:py-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.2]" />
              <span>{actionButtonLabel.replace(/^\+\s*/, '')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed font-normal max-w-4xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
