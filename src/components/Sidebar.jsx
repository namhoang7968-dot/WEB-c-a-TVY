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

  const requiredDone = Number(stats?.requiredDone) || 0;
  const requiredTotal = Number(stats?.requiredTotal) || 8;
  const progressPercent = Math.min(100, Math.round((requiredDone / requiredTotal) * 100));

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col h-screen select-none shrink-0 border-r border-slate-800/80 sticky top-0">
      {/* Brand Header */}
      <div className="px-5 py-4.5 flex items-center gap-3 border-b border-slate-800/70">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs border border-white/15">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-white tracking-tight leading-none truncate">Creator Studio</h1>
          <p className="text-[11px] text-slate-400 font-normal mt-1 leading-none">GSA Campaign 2024</p>
        </div>
      </div>

      {/* Navigation scrollable area */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3.5 space-y-0.5">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-white shadow-xs border border-slate-700/50 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
              {item.id === 'checklist' && stats?.checklistPending > 0 && (
                <span className="ml-auto text-[10px] bg-amber-400/10 text-amber-300 border border-amber-400/20 px-1.5 py-0.5 rounded-full font-mono font-medium">
                  {stats.checklistPending}
                </span>
              )}
            </button>
          );
        })}

        {/* Section: QUẢN LÝ */}
        <div className="pt-4 pb-1.5 px-3">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
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
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-white shadow-xs border border-slate-700/50 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
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
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
              <span>Mục tiêu chiến dịch</span>
            </div>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded">
              {progressPercent}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
            Hoàn thành {requiredTotal} bài bắt buộc, chia sẻ tài liệu học tập
          </p>
          <div className="flex items-center justify-between text-[11px] mb-1 font-medium">
            <span className="text-slate-400">Tiến độ bài bắt buộc:</span>
            <span className="text-slate-200 font-semibold font-mono">{requiredDone}/{requiredTotal} bài</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
