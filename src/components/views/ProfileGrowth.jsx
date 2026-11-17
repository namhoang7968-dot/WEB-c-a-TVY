import React, { useState } from 'react';
import { growthService } from '../../services/otherDataService';

export default function ProfileGrowth() {
  const [channels] = useState(() => growthService.get() || []);
  const safeChannels = Array.isArray(channels) ? channels : [];

  return (
    <div className="space-y-5">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {safeChannels.map((ch, idx) => {
          const current = Number(ch?.currentFollowers) || 0;
          const start = Number(ch?.startFollowers) || 0;
          const target = Number(ch?.target) || 1;
          const gained = current - start;
          const progress = Math.min(100, Math.round((current / target) * 100));

          return (
            <div key={ch?.name || idx} className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-900 text-sm">{ch?.name || 'Kênh'}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/60 font-medium px-2 py-0.5 rounded-full font-mono">
                    +{gained.toLocaleString()} từ đầu chiến dịch
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mb-3">{ch?.handle || ''}</p>

                <div className="flex items-baseline justify-between mb-1.5 font-mono">
                  <span className="text-2xl font-bold text-slate-900">{current.toLocaleString()}</span>
                  <span className="text-xs text-slate-400 font-sans">Mục tiêu: {target.toLocaleString()}</span>
                </div>

                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Clicks vào Bio link:</span>
                <span className="font-semibold text-slate-800 font-mono">{(ch?.linkClicks || 0).toLocaleString()} lượt</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategies Box */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5">
        <h3 className="font-semibold text-slate-900 text-sm mb-3">Chiến lược phát triển kênh cá nhân</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
            <h4 className="font-semibold text-slate-900 mb-1">1. Đính kèm Bio Link có UTM chuyên nghiệp</h4>
            <p className="leading-relaxed text-slate-500">
              Sử dụng link rút gọn gắn mã định danh cá nhân để Google đo lường chính xác số lượt đăng ký từ bạn. Đặt link này ở phần tiểu sử TikTok và bài ghim Facebook.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
            <h4 className="font-semibold text-slate-900 mb-1">2. Reply bình luận bằng Video (TikTok)</h4>
            <p className="leading-relaxed text-slate-500">
              Khi có người hỏi sâu về prompt hoặc thủ thuật Gemini, hãy bấm "Trả lời bằng video" để tạo nội dung bổ sung vừa giải đáp vừa kéo reach tự nhiên.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
