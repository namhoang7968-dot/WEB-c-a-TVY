import React from 'react';
import {
  CalendarCheck,
  Clock,
  Sparkles,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight
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
    <div className="space-y-5">
      {/* Overview Hero Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-[11px] font-medium mb-2.5">
              <Sparkles className="w-3 h-3" />
              <span>GSA Creator Studio • Chiến dịch 2024</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Tổng quan chiến dịch cá nhân
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              Theo dõi tiến độ hoàn thành 8 bài bắt buộc, đồng bộ số liệu tương tác thực tế từ TikTok & Facebook và quản lý ngân hàng ý tưởng sáng tạo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onNavigateToCalendar}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <span>Xem Lịch nội dung</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg border border-slate-200 hover:border-slate-300 shadow-2xs transition-colors cursor-pointer"
            >
              <span>+ Tạo nội dung</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: 8 Bài bắt buộc */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Bài bắt buộc</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <CalendarCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl font-bold text-slate-900">{requiredDone}</span>
              <span className="text-xs text-slate-400 font-sans">/ {requiredTotal} bài</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
              <span>Tiến độ</span>
              <span className="font-semibold text-blue-600 font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 2: Đang sản xuất */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Đang sản xuất</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl font-bold text-slate-900">{stats?.totalInProgress || 0}</span>
              <span className="text-xs text-slate-400 font-sans">nội dung</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {stats?.requiredInProgress || 0} bài bắt buộc đang được làm
          </p>
        </div>

        {/* Card 3: Đã xuất bản */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Đã đăng</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl font-bold text-slate-900">{stats?.totalDone || 0}</span>
              <span className="text-xs text-slate-400 font-sans">nội dung</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {stats?.extraDone || 0} nội dung bổ sung đã hoàn tất
          </p>
        </div>

        {/* Card 4: Tổng kho nội dung */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tổng kế hoạch</span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl font-bold text-slate-900">{safeContents.length}</span>
              <span className="text-xs text-slate-400 font-sans">bài đăng</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Bao gồm {stats?.extraCount || 0} bài bổ sung thêm
          </p>
        </div>
      </div>

      {/* Grid: Upcoming posts & Quick Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Upcoming Content */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Nội dung đang triển khai</h3>
              <p className="text-xs text-slate-500">Các bài đang làm hoặc sắp đến hạn chót</p>
            </div>
            <button
              onClick={onNavigateToCalendar}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Xem tất cả →
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingPosts.length > 0 ? (
              upcomingPosts.map((item) => (
                <div
                  key={item?.id || Math.random()}
                  className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold font-mono text-slate-900">{item?.code}</span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
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

        {/* Right 1 Col: Campaign Rules / Tips */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5">
          <h3 className="font-semibold text-slate-900 text-sm mb-3">Quy chuẩn chiến dịch GSA</h3>
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100/80 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">8 Bài bắt buộc</p>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Hoàn thành tối thiểu 8 bài theo chủ đề tuần (Study, Career, Productivity).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-100/80 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">Cập nhật chính xác</p>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Chỉ chuyển sang "Đã đăng" khi bạn đã upload thực tế và có link bài viết.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
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
