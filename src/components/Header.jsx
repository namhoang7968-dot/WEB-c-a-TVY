import React from 'react';
import { Plus, Menu } from 'lucide-react';

export default function Header({
  breadcrumb = 'GSA Campaign / Lịch nội dung',
  title = 'Lịch nội dung',
  subtitle = 'Theo dõi riêng 8 bài bắt buộc và các nội dung bổ sung. Không có bài nào tự động được đánh dấu đã đăng.',
  onOpenCreateModal,
  showCreateButton = true,
  actionButtonLabel = '+ Tạo nội dung',
  storageStatus = 'Đồng bộ Supabase trực tuyến',
  onToggleMobileMenu
}) {
  return (
    <div className="pb-6 pt-1">
      {/* Top row: Breadcrumb & Right Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2.5">
        {/* Left: Mobile hamburger menu & Breadcrumb */}
        <div className="flex items-center gap-2">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-1.5 -ml-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Mở menu điều hướng"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <span className="text-xs text-slate-500 font-medium">
            {breadcrumb}
          </span>
        </div>

        {/* Right: Storage status badge & Action Button */}
        <div className="flex items-center gap-2.5">
          {/* Storage status badge: Live Supabase Connected */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-slate-200/90 text-[11px] font-medium text-slate-700 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>{storageStatus}</span>
          </div>

          {/* Tactile Create Button */}
          {showCreateButton && (
            <button
              onClick={onOpenCreateModal}
              className="tactile-btn inline-flex items-center gap-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-medium px-3.5 py-1.5 sm:py-2 rounded-lg shadow-2xs transition-transform cursor-pointer border border-slate-800"
            >
              <Plus className="w-4 h-4 stroke-[2.2]" />
              <span>{actionButtonLabel.replace(/^\+\s*/, '')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed font-normal max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
