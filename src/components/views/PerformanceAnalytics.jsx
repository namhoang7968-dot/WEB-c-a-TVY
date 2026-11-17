import React from 'react';
import { metricsService } from '../../services/otherDataService';
import { TrendingUp, Award, Smartphone, Share2, ThumbsUp } from 'lucide-react';

export default function PerformanceAnalytics({ contents }) {
  const metrics = metricsService.get();

  // Combine content + metrics
  const merged = contents.map(c => {
    const m = metrics.find(item => item.code === c.code) || { views: 0, likes: 0, comments: 0, shares: 0 };
    return {
      ...c,
      views: Number(m.views) || 0,
      likes: Number(m.likes) || 0,
      comments: Number(m.comments) || 0,
      shares: Number(m.shares) || 0,
      totalEngagement: (Number(m.likes) || 0) + (Number(m.comments) || 0) + (Number(m.shares) || 0)
    };
  });

  const sortedByViews = [...merged].sort((a, b) => b.views - a.views);
  const top3 = sortedByViews.slice(0, 3);

  // Platform breakdown
  const platforms = {};
  merged.forEach(item => {
    const ch = item.channel || 'Khác';
    if (!platforms[ch]) platforms[ch] = { views: 0, count: 0, engagement: 0 };
    platforms[ch].views += item.views;
    platforms[ch].count += 1;
    platforms[ch].engagement += item.totalEngagement;
  });

  const totalAllViews = merged.reduce((acc, c) => acc + c.views, 0);

  return (
    <div className="space-y-6">
      {/* Top 3 Leaderboard */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900">Top 3 Bài Có Lượt Xem Cao Nhất</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3.map((item, idx) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border relative ${
                idx === 0
                  ? 'border-amber-300 bg-amber-50/30 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx === 0 ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-700'
                }`}>
                  #{idx + 1}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">{item.channel}</span>
              </div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 mb-3">
                {item.topic}
              </p>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                <span className="text-slate-500">Lượt xem:</span>
                <span className="font-bold text-blue-600">{item.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-slate-500">Tương tác:</span>
                <span className="font-semibold text-slate-700">{item.totalEngagement.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Tỷ trọng lượt xem theo kênh xuất bản</h3>
          <div className="space-y-4">
            {Object.entries(platforms).map(([platform, data]) => {
              const percent = totalAllViews > 0 ? Math.round((data.views / totalAllViews) * 100) : 0;
              return (
                <div key={platform}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800">{platform} ({data.count} bài)</span>
                    <span className="text-slate-500">{data.views.toLocaleString()} views ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Đúc kết & Gợi ý tối ưu</h3>
          <div className="space-y-3 text-xs text-slate-600 mt-4">
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg">
              <span className="font-bold text-blue-900">1. Video ngắn TikTok đạt tương tác cao nhất:</span>
              <p className="mt-0.5 text-blue-800">
                Các video giải quyết trực tiếp tình huống "Chạy deadline thuyết trình" có tỷ lệ giữ chân (retention) và share cao gấp 2.8 lần.
              </p>
            </div>
            <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-lg">
              <span className="font-bold text-purple-900">2. Facebook cá nhân tối ưu cho tài liệu học tập:</span>
              <p className="mt-0.5 text-purple-800">
                Bài viết kèm link Notion template có lượt bình luận hỏi link và chia sẻ tự nhiên rất tốt.
              </p>
            </div>
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-lg">
              <span className="font-bold text-emerald-900">3. Duy trì tần suất đăng:</span>
              <p className="mt-0.5 text-emerald-800">
                Đảm bảo mỗi tuần đăng ít nhất 2 bài bắt buộc để duy trì tương tác thuật toán đề xuất.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
