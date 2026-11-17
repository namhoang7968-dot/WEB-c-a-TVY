import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Hash,
  TrendingUp,
  Lightbulb,
  Compass,
  Target,
  CheckSquare,
  Clock,
  Settings,
  Sparkles,
  ChevronRight,
  BookmarkCheck,
  X
} from 'lucide-react';

export default function Sidebar({
  currentTab,
  onSelectTab,
  stats,
  isMobileOpen = false,
  onCloseMobile
}) {
  const mainNavItems = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'calendar', label: 'Lịch nội dung', icon: Calendar },
    { id: 'manual-metrics', label: 'Số liệu thủ công', icon: Hash },
    { id: 'analytics', label: 'Phân tích hiệu quả', icon: TrendingUp },
    { id: 'idea-bank', label: 'Ngân hàng ý tưởng', icon: Lightbulb },
    { id: 'growth', label: 'Phát triển trang cá nhân', icon: Compass },
    { id: 'conversions', label: 'Theo dõi chuyển đổi', icon: Target },
    { id: 'checklist', label: 'Checklist chiến dịch', icon: CheckSquare },
  ];

  const managementNavItems = [
    { id: 'weekly-summary', label: 'Tổng kết tuần', icon: Clock },
    { id: 'settings', label: 'Cài đặt & Dữ liệu', icon: Settings },
  ];

  const requiredDone = Number(stats?.requiredDone) || 0;
  const requiredTotal = Number(stats?.requiredTotal) || 8;
  const progressPercent = Math.min(100, Math.round((requiredDone / requiredTotal) * 100));

  const handleItemClick = (id) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="w-64 bg-[#090D16] text-slate-300 flex flex-col h-full select-none border-r border-slate-800/70">
      {/* Brand Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white border border-slate-700/80 shadow-xs">
            <Sparkles className="w-4 h-4 text-slate-200" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs font-semibold text-white tracking-tight leading-none truncate">
                Creator Studio
              </h1>
              <span className="text-[9px] bg-slate-800 text-slate-400 font-mono px-1 py-0.2 rounded border border-slate-700/50">
                GSA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal mt-1 leading-none truncate">
              Google Ambassador 2024
            </p>
          </div>
        </div>

        {/* Close Button for mobile */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/80 cursor-pointer"
            aria-label="Đóng menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation scrollable area */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
        <div className="px-2.5 pb-1 pt-1">
          <p className="text-[11px] font-medium text-slate-400">
            Nội dung & Phân tích
          </p>
        </div>

        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-800/90 text-white shadow-xs border border-slate-700/80 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
              {item.id === 'checklist' && stats?.checklistPending > 0 && (
                <span className="ml-auto text-[10px] bg-amber-400/15 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded-full font-mono font-medium">
                  {stats.checklistPending}
                </span>
              )}
            </button>
          );
        })}

        {/* Section: HỆ THỐNG */}
        <div className="pt-4 pb-1 px-2.5">
          <p className="text-[11px] font-medium text-slate-400">
            Hệ thống & Cài đặt
          </p>
        </div>

        {managementNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-800/90 text-white shadow-xs border border-slate-700/80 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Campaign Goal Card (Tactile Capsule) */}
      <div className="p-3 border-t border-slate-800/60 bg-[#090D16]">
        <div
          onClick={() => handleItemClick('calendar')}
          className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-xs transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
              <BookmarkCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Tiến độ chiến dịch</span>
            </div>
            <span className="text-[10px] font-mono text-slate-300 bg-slate-800 border border-slate-700/70 px-1.5 py-0.5 rounded">
              {progressPercent}%
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
            <span className="text-slate-400">8 bài bắt buộc</span>
            <span className="text-white font-semibold font-mono">{requiredDone}/{requiredTotal} bài</span>
          </div>

          <div className="w-full bg-slate-800/90 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-slate-300">
            <span>Xem lịch duyệt bài</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (visible on lg and above) */}
      <aside className="hidden lg:flex w-64 h-screen shrink-0 sticky top-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (visible on < lg when isMobileOpen is true) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200 h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
