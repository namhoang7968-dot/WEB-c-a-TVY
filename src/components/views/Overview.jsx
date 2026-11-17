import React from 'react';
import {
  CalendarCheck,
  Clock,
  Sparkles,
  TrendingUp,
  FileText,
  Video,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export default function Overview({ contents, stats, onNavigateToCalendar, onOpenCreateModal }) {
  const requiredDone = stats?.requiredDone || 0;
  const requiredTotal = stats?.requiredTotal || 8;
  const progressPercent = Math.min(100, Math.round((requiredDone / requiredTotal) * 100));

  const upcomingPosts = contents
    .filter(item => item.status !== 'Đã đăng')
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Banner / Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white shadow-lg border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GSA Creator Studio • Chiến Dịch 2024</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Theo dõi & Quản lý Chiến Dịch GSA
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed font-normal">
            Chào mừng bạn đến với dashboard điều hành nội dung cá nhân. Quản lý 8 bài bắt buộc, đồng bộ lịch đăng đa nền tảng và kiểm soát mục tiêu chiến dịch chuẩn xác.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToCalendar}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <span>Xem Lịch nội dung</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg border border-white/20 transition-all cursor-pointer"
            >
              <span>+ Thêm nội dung mới</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative background shapes */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none"></div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 8 Bài bắt buộc */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bài bắt buộc</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{requiredDone}</span>
            <span className="text-sm font-medium text-slate-400">/ {requiredTotal} bài</span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
              <span>Tiến độ hoàn thành</span>
              <span className="font-semibold text-blue-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 2: Đang làm */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đang sản xuất</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats?.totalInProgress || 0}</span>
            <span className="text-xs font-medium text-slate-500">nội dung</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {stats?.requiredInProgress || 0} bài bắt buộc đang được làm
          </p>
        </div>

        {/* Card 3: Đã xuất bản */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đã đăng</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats?.totalDone || 0}</span>
            <span className="text-xs font-medium text-slate-500">nội dung</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {stats?.extraDone || 0} nội dung bổ sung đã hoàn tất
          </p>
        </div>

        {/* Card 4: Tổng kho nội dung */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng kế hoạch</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{contents.length}</span>
            <span className="text-xs font-medium text-slate-500">tổng số bài</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Bao gồm {stats?.extraCount || 0} nội dung phát triển thêm
          </p>
        </div>
      </div>

      {/* Grid: Upcoming posts & Quick Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Content */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Nội dung sắp tới cần chú ý</h3>
              <p className="text-xs text-slate-500">Các bài đang làm hoặc sắp đến hạn chót</p>
            </div>
            <button
              onClick={onNavigateToCalendar}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Xem tất cả →
            </button>
          </div>

          <div className="space-y-3">
            {upcomingPosts.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">{item.code}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                      {item.group}
                    </span>
                    <span className="text-xs text-slate-500">• {item.channel}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 truncate">{item.topic}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-semibold text-slate-700 block">{item.scheduledDate}</span>
                  <span className="text-[11px] text-amber-600 font-medium">Hạn: {item.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Campaign Rules / Tips */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Quy định chiến dịch GSA</h3>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900">8 Bài bắt buộc</p>
                <p className="text-blue-700/80 mt-0.5 leading-relaxed">
                  Cần hoàn thành tối thiểu 8 bài theo chủ đề hàng tuần (Study, Career, Productivity).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Không tự động đánh dấu</p>
                <p className="text-amber-700/80 mt-0.5 leading-relaxed">
                  Chỉ chuyển trạng thái sang "Đã đăng" khi bạn đã upload thực tế và có link bài viết.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Hashtags chuẩn</p>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Luôn đính kèm #GSA #GoogleAI #GoogleGemini trong caption bài viết.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
