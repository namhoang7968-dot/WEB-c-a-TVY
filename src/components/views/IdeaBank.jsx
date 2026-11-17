import React, { useState } from 'react';
import { ideaService } from '../../services/otherDataService';
import { Lightbulb, Plus, ArrowRight, Tag, Trash2 } from 'lucide-react';

export default function IdeaBank({ onConvertIdeaToContent, onShowToast }) {
  const [ideas, setIdeas] = useState(() => ideaService.get());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: '',
    channel: 'TikTok',
    format: 'Video ngắn',
    status: 'Ý tưởng mới',
    notes: '',
    tags: 'GSA, Study'
  });

  const handleAddIdea = (e) => {
    e.preventDefault();
    if (!newIdea.title.trim()) return;
    const item = {
      ...newIdea,
      tags: newIdea.tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    const updated = ideaService.add(item);
    setIdeas(updated);
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

  const handleDeleteIdea = (id) => {
    const updated = ideaService.delete(id);
    setIdeas(updated);
    onShowToast?.('Đã xóa ý tưởng', 'info');
  };

  const statusColors = {
    'Ý tưởng mới': 'bg-blue-50 text-blue-700 border-blue-200',
    'Đang ấp ủ': 'bg-amber-50 text-amber-700 border-amber-200',
    'Sẵn sàng': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Đã dùng': 'bg-slate-100 text-slate-600 border-slate-200'
  };

  return (
    <div className="space-y-6">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Kho lưu trữ & Phát triển ý tưởng sáng tạo</h3>
          <p className="text-xs text-slate-500">Lưu lại các ý tưởng bất chợt, phân loại và chuyển thành bài đăng chính thức</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm ý tưởng</span>
        </button>
      </div>

      {/* Idea Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4 flex flex-col justify-between hover:shadow-sm transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[idea.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {idea.status}
                </span>
                <span className="text-xs font-medium text-slate-400">{idea.channel}</span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm mb-1.5 leading-snug">
                {idea.title}
              </h4>

              {idea.notes && (
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  {idea.notes}
                </p>
              )}

              {idea.tags && idea.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {idea.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleDeleteIdea(idea.id)}
                className="text-xs text-rose-500 hover:text-rose-700 font-medium p-1"
                title="Xóa ý tưởng"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onConvertIdeaToContent(idea)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors"
              >
                <span>Đưa vào lịch đăng</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Idea Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Thêm ý tưởng mới</h3>
            <form onSubmit={handleAddIdea} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề ý tưởng *</label>
                <input
                  type="text"
                  required
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  placeholder="VD: Bí quyết tóm tắt tài liệu 50 trang bằng Gemini..."
                  className="w-full px-3 py-2 border rounded-lg text-sm border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kênh phù hợp</label>
                  <select
                    value={newIdea.channel}
                    onChange={(e) => setNewIdea({ ...newIdea, channel: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white border-slate-300"
                  >
                    <option value="TikTok">TikTok</option>
                    <option value="Facebook cá nhân">Facebook cá nhân</option>
                    <option value="YouTube Shorts">YouTube Shorts</option>
                    <option value="Threads">Threads</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Trạng thái</label>
                  <select
                    value={newIdea.status}
                    onChange={(e) => setNewIdea({ ...newIdea, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white border-slate-300"
                  >
                    <option value="Ý tưởng mới">Ý tưởng mới</option>
                    <option value="Đang ấp ủ">Đang ấp ủ</option>
                    <option value="Sẵn sàng">Sẵn sàng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú chi tiết / Góc nhìn</label>
                <textarea
                  rows={3}
                  value={newIdea.notes}
                  onChange={(e) => setNewIdea({ ...newIdea, notes: e.target.value })}
                  placeholder="Cách triển khai, kịch bản sơ bộ..."
                  className="w-full px-3 py-2 border rounded-lg text-sm border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (cách nhau bởi dấu phẩy)</label>
                <input
                  type="text"
                  value={newIdea.tags}
                  onChange={(e) => setNewIdea({ ...newIdea, tags: e.target.value })}
                  placeholder="GSA, Study, Prompt"
                  className="w-full px-3 py-2 border rounded-lg text-sm border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
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
