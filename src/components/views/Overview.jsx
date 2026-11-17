import React from 'react';
import {
  CalendarCheck,
  Clock,
  Sparkles,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Flame,
  Layers
} from 'lucide-react';

export default function Overview({ contents = [], stats = {}, onNavigateToCalendar, onOpenCreateModal }) {
  const safeContents = Array.isArray(contents) ? contents : [];
  const requiredDone = Number(stats?.requiredDone) || 0;
  const requiredTotal = Number(stats?.requiredTotal) || 8;
  const progressPercent = Math.min(100, Math.round((requiredDone / requiredTotal) * 100));

  const upcomingPosts = safeContents
    .filter(item => item?.status !== 'Đã đăng')
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Overview Hero Card */}
      <div className="tactile-card rounded-xl p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/90 text-slate-700 text-[11px] font-medium mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-700" />
              <span>GSA Creator Studio • Chiến dịch 2024</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]">
              Tổng quan chiến dịch cá nhân
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              Theo dõi tiến độ hoàn thành 8 bài bắt buộc, đồng bộ số liệu tương tác thực tế từ TikTok & Facebook và quản lý ngân hàng ý tưởng sáng tạo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onNavigateToCalendar}
              className="tactile-btn inline-flex items-center gap-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <span>Xem lịch nội dung</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenCreateModal}
              className="tactile-btn inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg border border-slate-200 hover:border-slate-300 shadow-2xs transition-colors cursor-pointer"
            >
              <span>+ Tạo nội dung</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Instrument Cluster (Hallmark Data-Viz Metric Spine) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Metric 1: 8 Bài bắt buộc */}
          <div className="p-5 flex flex-col justify-between border-b sm:border-r lg:border-b-0 border-slate-200/80">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
                <span>Bài bắt buộc</span>
                <span className="text-[11px] font-mono font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                  {progressPercent}%
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#0F172A] tracking-tight">
                  {requiredDone}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ {requiredTotal} bài</span>
              </div>
            </div>
            <div className="mt-3.5">
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">
                {requiredDone >= requiredTotal ? 'Đã hoàn thành chỉ tiêu' : `Còn thiếu ${requiredTotal - requiredDone} bài`}
              </p>
            </div>
          </div>

          {/* Metric 2: Đang sản xuất */}
          <div className="p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200/80">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
                <span>Đang sản xuất</span>
                <Clock className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#0F172A] tracking-tight">
                  {stats?.totalInProgress || 0}
                </span>
                <span className="text-xs text-slate-400">nội dung</span>
              </div>
            </div>
            <div className="mt-3.5">
              <p className="text-[11px] text-slate-500">
                <span className="font-mono font-medium text-amber-600">{stats?.requiredInProgress || 0}</span> bài bắt buộc đang viết
              </p>
            </div>
          </div>

          {/* Metric 3: Đã xuất bản */}
          <div className="p-5 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-slate-200/80">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
                <span>Đã đăng tải</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#0F172A] tracking-tight">
                  {stats?.totalDone || 0}
                </span>
                <span className="text-xs text-slate-400">bài viết</span>
              </div>
            </div>
            <div className="mt-3.5">
              <p className="text-[11px] text-slate-500">
                <span className="font-mono font-medium text-emerald-600">+{stats?.extraDone || 0}</span> bài bổ sung thêm
              </p>
            </div>
          </div>

          {/* Metric 4: Tổng kế hoạch */}
          <div className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
                <span>Tổng kế hoạch</span>
                <Layers className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#0F172A] tracking-tight">
                  {safeContents.length}
                </span>
                <span className="text-xs text-slate-400">nội dung</span>
              </div>
            </div>
            <div className="mt-3.5">
              <p className="text-[11px] text-slate-500">
                Kho lưu trữ trên Supabase
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Upcoming posts & Quick Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Upcoming Content */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-semibold text-[#0F172A] text-sm">Nội dung đang triển khai</h3>
              <p className="text-xs text-slate-500">Các bài đang chuẩn bị hoặc sắp đến hạn chót</p>
            </div>
            <button
              onClick={onNavigateToCalendar}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer transition-colors"
            >
              Xem tất cả →
            </button>
          </div>

          <div className="space-y-2">
            {upcomingPosts.length > 0 ? (
              upcomingPosts.map((item) => (
                <div
                  key={item?.id || Math.random()}
                  className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold font-mono text-slate-900">{item?.code}</span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60">
                        {item?.group || 'Nội dung'}
                      </span>
                      <span className="text-xs text-slate-400">• {item?.channel}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-800 truncate">{item?.topic}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-medium font-mono text-slate-800 block">{item?.scheduledDate}</span>
                    <span className="text-[11px] text-amber-600 font-mono">Hạn: {item?.deadline}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">Không có bài viết nào đang chờ xử lý</p>
            )}
          </div>
        </div>

        {/* Right 1 Col: Campaign Guidelines */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
          <h3 className="font-semibold text-[#0F172A] text-sm mb-3">Quy chuẩn chiến dịch GSA</h3>
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-200/70 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">8 Bài bắt buộc</p>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Hoàn thành tối thiểu 8 bài theo chủ đề tuần (Study, Career, Productivity).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-200/70 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">Cập nhật chính xác</p>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Chỉ chuyển sang "Đã đăng" khi bạn đã upload thực tế và có link bài viết.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-200/70 flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">Hashtags bắt buộc</p>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Đính kèm #GSA #GoogleAI #GoogleGemini trong caption bài viết.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
