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
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ currentTab, onSelectTab, stats }) {
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

  const requiredDone = stats?.requiredDone || 0;
  const requiredTotal = stats?.requiredTotal || 8;
  const progressPercent = Math.min(100, Math.round((requiredDone / requiredTotal) * 100));

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col h-screen select-none shrink-0 border-r border-slate-800 sticky top-0">
      {/* Brand Logo / Header */}
      <div className="px-5 py-5 flex items-center gap-3 border-b border-slate-800/80">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-wide uppercase">Creator Studio</h1>
          <p className="text-[11px] text-slate-400 font-medium">GSA Campaign 2024</p>
        </div>
      </div>

      {/* Navigation scrollable area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#1E293B] text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
              {item.id === 'checklist' && stats?.checklistPending > 0 && (
                <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full font-semibold">
                  {stats.checklistPending}
                </span>
              )}
            </button>
          );
        })}

        {/* Section: QUẢN LÝ */}
        <div className="pt-6 pb-2 px-3">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Quản lý
          </p>
        </div>

        {managementNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#1E293B] text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Campaign Goal Card */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0F172A]">
        <div className="bg-[#131c31] border border-slate-800 rounded-xl p-3.5 shadow-inner">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Mục tiêu chiến dịch</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
            Hoàn thành {requiredTotal} bài bắt buộc, chia sẻ tài liệu học tập
          </p>
          <div className="flex items-center justify-between text-[11px] mb-1 font-medium">
            <span className="text-slate-400">Tiến độ bài bắt buộc:</span>
            <span className="text-blue-400 font-bold">{requiredDone}/{requiredTotal} bài</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
