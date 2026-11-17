import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle, FileText, Send, Award } from 'lucide-react';

export default function WeeklySummary({ contents, stats, onShowToast }) {
  const [selectedWeek, setSelectedWeek] = useState('Tuần 1');
  const [reflection, setReflection] = useState(
    'Tuần đầu tiên tập trung vào việc kích hoạt chiến dịch và bài viết chủ đề Study / Deadline thuyết trình. Video TikTok đạt lượt xem vượt kỳ vọng nhờ đánh trúng tâm lý sinh viên mùa thi cuối kỳ.'
  );

  const [nextWeekPlan, setNextWeekPlan] = useState(
    'Triển khai chủ đề Career: Hướng dẫn tối ưu CV và mock interview với Gemini. Chuẩn bị bộ 5 slide infographic cho bài viết Facebook.'
  );

  const handleSaveSummary = (e) => {
    e.preventDefault();
    onShowToast?.('Đã lưu báo cáo tổng kết tuần!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Week Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Báo cáo & Tổng kết tuần chiến dịch</h3>
          <p className="text-xs text-slate-500">Ghi lại kết quả, bài học kinh nghiệm và chuẩn bị cho tuần tiếp theo</p>
        </div>

        <div className="flex items-center gap-2">
          {['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'].map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeek(w)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedWeek === w
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nội dung hoàn thành</p>
          <p className="text-2xl font-bold text-slate-900">2 bài đăng</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">100% đúng hạn deadline</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Lượt tiếp cận tuần này</p>
          <p className="text-2xl font-bold text-blue-600">42,700 views</p>
          <p className="text-xs text-slate-400 mt-1">Từ TikTok & Facebook cá nhân</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Signups ghi nhận</p>
          <p className="text-2xl font-bold text-emerald-600">+128 sinh viên</p>
          <p className="text-xs text-slate-400 mt-1">Đã đăng ký qua link cá nhân</p>
        </div>
      </div>

      {/* Reflection Form */}
      <form onSubmit={handleSaveSummary} className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Điểm nổi bật & Bài học kinh nghiệm ({selectedWeek})
          </label>
          <textarea
            rows={3}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Kế hoạch hành động tuần tiếp theo
          </label>
          <textarea
            rows={3}
            value={nextWeekPlan}
            onChange={(e) => setNextWeekPlan(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Lưu bản tổng kết</span>
          </button>
        </div>
      </form>
    </div>
  );
}
