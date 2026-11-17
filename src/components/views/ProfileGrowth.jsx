import React, { useState } from 'react';
import { growthService } from '../../services/otherDataService';
import { Compass, Users, TrendingUp, Share2, ExternalLink, Award } from 'lucide-react';

export default function ProfileGrowth() {
  const [channels, setChannels] = useState(() => growthService.get() || []);

  const safeChannels = Array.isArray(channels) ? channels : [];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {safeChannels.map((ch, idx) => {
          const current = Number(ch?.currentFollowers) || 0;
          const start = Number(ch?.startFollowers) || 0;
          const target = Number(ch?.target) || 1;
          const gained = current - start;
          const progress = Math.min(100, Math.round((current / target) * 100));

          return (
            <div key={ch?.name || idx} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm">{ch?.name || 'Kênh'}</span>
                <span className="text-[11px] text-emerald-600 bg-emerald-50 font-semibold px-2 py-0.5 rounded-full">
                  +{gained.toLocaleString()} từ đầu chiến dịch
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">{ch?.handle || ''}</p>

              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-2xl font-bold text-slate-900">{current.toLocaleString()}</span>
                <span className="text-xs text-slate-400">Mục tiêu: {target.toLocaleString()}</span>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Clicks vào Bio link:</span>
                <span className="font-semibold text-slate-800">{(ch?.linkClicks || 0).toLocaleString()} lượt</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategies Box */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5">
        <h3 className="font-bold text-slate-900 text-sm mb-3">Chiến lược phát triển kênh cá nhân trong chiến dịch</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <h4 className="font-bold text-slate-900 mb-1.5">1. Đính kèm Bio Link có UTM chuyên nghiệp</h4>
            <p className="leading-relaxed text-slate-500">
              Sử dụng link rút gọn gắn mã định danh cá nhân để Google đo lường chính xác số lượt đăng ký từ bạn. Đặt link này ở phần tiểu sử TikTok và bài ghim Facebook.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <h4 className="font-bold text-slate-900 mb-1.5">2. Reply bình luận bằng Video (TikTok)</h4>
            <p className="leading-relaxed text-slate-500">
              Khi có người hỏi sâu về prompt hoặc thủ thuật Gemini, hãy bấm "Trả lời bằng video" để tạo nội dung bổ sung vừa giải đáp vừa kéo reach tự nhiên.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
