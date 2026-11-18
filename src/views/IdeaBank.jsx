import React, { useState } from 'react';
import { ideaService } from '@/services/otherDataService';
import { Plus, ArrowRight, Trash2, Lightbulb } from 'lucide-react';

export default function IdeaBank({ onConvertIdeaToContent, onShowToast }) {
  const [ideas, setIdeas] = useState(() => ideaService.get() || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: '',
    channel: 'TikTok',
    format: 'Video ngắn',
    status: 'Ý tưởng mới',
    notes: '',
    tags: 'GSA, Study'
  });

  const safeIdeas = Array.isArray(ideas) ? ideas : [];

  const handleAddIdea = async (e) => {
    e.preventDefault();
    if (!newIdea.title.trim()) return;
    const item = {
      ...newIdea,
      tags: typeof newIdea.tags === 'string'
        ? newIdea.tags.split(',').map(t => t.trim()).filter(Boolean)
        : []
    };
    const updated = await ideaService.add(item);
    setIdeas(updated || []);
    setShowAddModal(false);
    setNewIdea({
      title: '',
      channel: 'TikTok',
      format: 'Video ngắn',
      status: 'Ý tưởng mới',
      notes: '',
      tags: 'GSA, Study'
    });
    onShowToast?.('Đã thêm ý tưởng mới!', 'success');
  };

  const handleDeleteIdea = async (id) => {
    const updated = await ideaService.delete(id);
    setIdeas(updated || []);
    onShowToast?.('Đã xóa ý tưởng', 'info');
  };

  const statusColors = {
    'Ý tưởng mới': 'bg-blue-50 text-blue-700 border-blue-200/80',
    'Đang ấp ủ': 'bg-amber-50 text-amber-700 border-amber-200/80',
    'Sẵn sàng': 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    'Đã dùng': 'bg-slate-100 text-slate-600 border-slate-200'
  };

  return (
    <div className="space-y-6">
      {/* Header toolbar */}
      <div className="tactile-card p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-semibold text-[#0F172A] text-sm sm:text-base">Kho lưu trữ ý tưởng sáng tạo</h3>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Ghi lại ý tưởng mới, phân loại kênh và chuyển đổi thành bài đăng trong lịch nội dung
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="tactile-btn inline-flex items-center gap-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer self-start sm:self-auto border border-slate-800"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Thêm ý tưởng</span>
        </button>
      </div>

      {/* Idea Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {safeIdeas.length > 0 ? (
          safeIdeas.map((idea) => {
            const tags = Array.isArray(idea?.tags) ? idea.tags : [];
            return (
              <div
                key={idea?.id || Math.random()}
                className="tactile-card rounded-xl p-4 sm:p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${statusColors[idea?.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                      {idea?.status || 'Ý tưởng mới'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{idea?.channel || 'TikTok'}</span>
                  </div>

                  <h4 className="font-semibold text-[#0F172A] text-sm mb-1.5 leading-snug">
                    {idea?.title || 'Ý tưởng chưa đặt tên'}
                  </h4>

                  {idea?.notes && (
                    <p className="text-xs text-slate-500 mb-3.5 leading-relaxed font-normal">
                      {idea.notes}
                    </p>
                  )}

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3.5">
                      {tags.map((tag, i) => (
                        <span key={i} className="text-[10px] font-mono bg-slate-50 border border-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleDeleteIdea(idea?.id)}
                    className="text-xs text-slate-400 hover:text-rose-600 font-medium p-1 transition-colors cursor-pointer"
                    title="Xóa ý tưởng"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onConvertIdeaToContent?.(idea)}
                    className="tactile-btn inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-[#0F172A] bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-md border border-slate-200 transition-colors cursor-pointer"
                  >
                    <span>Chuyển vào lịch</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white p-10 rounded-xl border border-slate-200/90 text-center text-xs text-slate-400">
            Chưa có ý tưởng nào. Hãy nhấn "+ Thêm ý tưởng" để bắt đầu!
          </div>
        )}
      </div>

      {/* Add Idea Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-lg p-5 sm:p-6">
            <h3 className="text-base font-bold text-[#0F172A] mb-4">Thêm ý tưởng nội dung mới</h3>
            <form onSubmit={handleAddIdea} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tiêu đề ý tưởng *</label>
                <input
                  type="text"
                  required
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  placeholder="VD: Bí quyết tóm tắt tài liệu 50 trang bằng Gemini..."
                  className="w-full px-3 py-2 border rounded-lg text-xs sm:text-sm border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Kênh phù hợp</label>
                  <select
                    value={newIdea.channel}
                    onChange={(e) => setNewIdea({ ...newIdea, channel: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs sm:text-sm bg-white border-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="TikTok">TikTok</option>
                    <option value="Facebook cá nhân">Facebook cá nhân</option>
                    <option value="YouTube Shorts">YouTube Shorts</option>
                    <option value="Threads">Threads</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Trạng thái</label>
                  <select
                    value={newIdea.status}
                    onChange={(e) => setNewIdea({ ...newIdea, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs sm:text-sm bg-white border-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="Ý tưởng mới">Ý tưởng mới</option>
                    <option value="Đang ấp ủ">Đang ấp ủ</option>
                    <option value="Sẵn sàng">Sẵn sàng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Ghi chú chi tiết / Góc nhìn</label>
                <textarea
                  rows={3}
                  value={newIdea.notes}
                  onChange={(e) => setNewIdea({ ...newIdea, notes: e.target.value })}
                  placeholder="Cách triển khai, kịch bản sơ bộ..."
                  className="w-full px-3 py-2 border rounded-lg text-xs sm:text-sm border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tags (cách nhau bởi dấu phẩy)</label>
                <input
                  type="text"
                  value={newIdea.tags}
                  onChange={(e) => setNewIdea({ ...newIdea, tags: e.target.value })}
                  placeholder="GSA, Study, Prompt"
                  className="w-full px-3 py-2 border rounded-lg text-xs sm:text-sm border-slate-200 focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="tactile-btn px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="tactile-btn px-4 py-1.5 text-xs bg-[#0F172A] text-white font-medium rounded-lg hover:bg-slate-800 cursor-pointer shadow-2xs border border-slate-800"
                >
                  Lưu ý tưởng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
