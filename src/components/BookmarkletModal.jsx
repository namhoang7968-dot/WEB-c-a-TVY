import React, { useState } from 'react';
import { FB_BOOKMARKLET_CODE, TIKTOK_BOOKMARKLET_CODE } from '../services/socialSyncService';
import { X, Copy, Check, Bookmark, ExternalLink, Sparkles, HelpCircle } from 'lucide-react';

export default function BookmarkletModal({ isOpen, onClose, defaultTab = 'facebook' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [copiedFb, setCopiedFb] = useState(false);
  const [copiedTiktok, setCopiedTiktok] = useState(false);

  if (!isOpen) return null;

  const copyCode = (code, type) => {
    navigator.clipboard.writeText(code);
    if (type === 'fb') {
      setCopiedFb(true);
      setTimeout(() => setCopiedFb(false), 2000);
    } else {
      setCopiedTiktok(true);
      setTimeout(() => setCopiedTiktok(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Bookmarklet Đồng Bộ Số Liệu 1-Click
              </h2>
              <p className="text-xs text-slate-500">
                Tự động quét số liệu từ Facebook & TikTok và gửi thẳng về Supabase
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-3 border-b border-slate-100 flex gap-4">
          <button
            onClick={() => setActiveTab('facebook')}
            className={`pb-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'facebook'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Facebook cá nhân (@thuyvy.vandinh)
          </button>
          <button
            onClick={() => setActiveTab('tiktok')}
            className={`pb-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'tiktok'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            TikTok (@thuyvy.risetoshine)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm flex-1">
          {activeTab === 'facebook' ? (
            <div className="space-y-4">
              {/* Draggable button */}
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-blue-900 mb-0.5">
                    👉 Kéo nút này thả lên thanh Dấu trang (Bookmarks Bar):
                  </p>
                  <p className="text-[11px] text-blue-700">
                    Nhấn giữ chuột trái vào nút xanh bên phải và kéo lên thanh Bookmark của Chrome
                  </p>
                </div>
                <a
                  href={FB_BOOKMARKLET_CODE}
                  onClick={(e) => e.preventDefault()}
                  draggable
                  className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-grab active:cursor-grabbing inline-flex items-center gap-2 shrink-0 select-none"
                >
                  <Bookmark className="w-4 h-4 fill-white" />
                  <span>⚡ Đồng bộ FB Thúy Vy</span>
                </a>
              </div>

              {/* Step instructions */}
              <div className="space-y-2 text-xs text-slate-600">
                <p className="font-bold text-slate-800">Các bước thực hiện:</p>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
                  <li>
                    Mở trang cá nhân Facebook của bạn:{' '}
                    <a
                      href="https://www.facebook.com/thuyvy.vandinh?locale=vi_VN"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-0.5"
                    >
                      facebook.com/thuyvy.vandinh <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>Cuộn chuột xuống một chút để các bài viết và số liệu hiển thị trên màn hình.</li>
                  <li>
                    Nhấp vào Bookmark <span className="font-semibold text-blue-700">"⚡ Đồng bộ FB Thúy Vy"</span> trên thanh trình duyệt.
                  </li>
                  <li>
                    Bộ lọc thông minh sẽ tự động loại bỏ bình luận con (chỉ lấy bài viết chính), bóc tách chính xác số Tim/Like, Bình luận và Lượt xem (Reels). Bấm <span className="font-semibold text-blue-600">"🚀 Chuyển về Studio"</span> để tự động lưu vào Supabase!
                  </li>
                </ol>
              </div>

              {/* Raw code copy */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-500">Mã JavaScript Bookmarklet (Hoặc tạo thủ công):</span>
                  <button
                    onClick={() => copyCode(FB_BOOKMARKLET_CODE, 'fb')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedFb ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFb ? 'Đã sao chép!' : 'Sao chép mã'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={3}
                  value={FB_BOOKMARKLET_CODE}
                  className="w-full text-[11px] font-mono bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-600 select-all"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Draggable button */}
              <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-white mb-0.5">
                    👉 Kéo nút này thả lên thanh Dấu trang (Bookmarks Bar):
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Giúp đồng bộ 100% video và follower ngay cả khi TikTok bật captcha chặn server
                  </p>
                </div>
                <a
                  href={TIKTOK_BOOKMARKLET_CODE}
                  onClick={(e) => e.preventDefault()}
                  draggable
                  className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 cursor-grab active:cursor-grabbing inline-flex items-center gap-2 shrink-0 select-none"
                >
                  <Bookmark className="w-4 h-4 fill-white" />
                  <span>🎵 Đồng bộ TikTok Thúy Vy</span>
                </a>
              </div>

              {/* Step instructions */}
              <div className="space-y-2 text-xs text-slate-600">
                <p className="font-bold text-slate-800">Các bước thực hiện:</p>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
                  <li>
                    Mở trang hồ sơ TikTok của bạn:{' '}
                    <a
                      href="https://www.tiktok.com/@thuyvy.risetoshine"
                      target="_blank"
                      rel="noreferrer"
                      className="text-rose-600 font-semibold hover:underline inline-flex items-center gap-0.5"
                    >
                      tiktok.com/@thuyvy.risetoshine <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    Nhấp vào Bookmark <span className="font-semibold text-rose-700">"🎵 Đồng bộ TikTok Thúy Vy"</span> trên trình duyệt.
                  </li>
                  <li>
                    Script tự động đọc chi tiết từng video để bóc tách đầy đủ cả 3 chỉ số: Lượt xem, Tim (likes) và Bình luận (comments). Bấm <span className="font-semibold text-rose-600">"🚀 Chuyển về Studio"</span> để hoàn tất lưu vào Supabase!
                  </li>
                </ol>
              </div>

              {/* Raw code copy */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-500">Mã JavaScript Bookmarklet:</span>
                  <button
                    onClick={() => copyCode(TIKTOK_BOOKMARKLET_CODE, 'tiktok')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedTiktok ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTiktok ? 'Đã sao chép!' : 'Sao chép mã'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={3}
                  value={TIKTOK_BOOKMARKLET_CODE}
                  className="w-full text-[11px] font-mono bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-600 select-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}
