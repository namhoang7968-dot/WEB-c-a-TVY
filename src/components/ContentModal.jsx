import React, { useState, useEffect } from 'react';
import { X, Calendar, Link2, Tag, Layers, Share2, AlignLeft, Check } from 'lucide-react';

export default function ContentModal({
  isOpen,
  onClose,
  onSave,
  initialData = null
}) {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    code: '',
    group: 'Bài bắt buộc',
    topic: '',
    description: '',
    channel: 'TikTok',
    format: 'Video ngắn',
    scheduledDate: '',
    deadline: '',
    status: 'Đang làm',
    link: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || '',
        group: initialData.group || 'Bài bắt buộc',
        topic: initialData.topic || '',
        description: initialData.description || '',
        channel: initialData.channel || 'TikTok',
        format: initialData.format || 'Video ngắn',
        scheduledDate: initialData.scheduledDate || '',
        deadline: initialData.deadline || '',
        status: initialData.status || 'Đang làm',
        link: initialData.link || '',
        notes: initialData.notes || ''
      });
    } else {
      // Auto-suggest next code
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const dateStr = `${dd}/${mm}/${yyyy}`;

      setFormData({
        code: `GSA-${Math.floor(10 + Math.random() * 90)}-TikTok`,
        group: 'Bài bắt buộc',
        topic: '',
        description: '',
        channel: 'TikTok',
        format: 'Video ngắn',
        scheduledDate: dateStr,
        deadline: dateStr,
        status: 'Đang làm',
        link: '',
        notes: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.code.trim()) errs.code = 'Mã nội dung không được để trống';
    if (!formData.topic.trim()) errs.topic = 'Chủ đề & mục tiêu không được để trống';
    if (!formData.scheduledDate.trim()) errs.scheduledDate = 'Vui lòng chọn ngày dự kiến';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditing ? 'Chỉnh sửa nội dung' : 'Tạo mới nội dung'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing ? 'Cập nhật thông tin chi tiết của bài đăng' : 'Điền thông tin kế hoạch nội dung mới cho chiến dịch'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-sm flex-1">
          {/* Row 1: Mã & Nhóm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mã nội dung <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="VD: GSA-CH01-STUDY-TikTok"
                className={`w-full px-3.5 py-2 rounded-lg border text-sm ${
                  errors.code ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
              />
              {errors.code && <p className="text-[11px] text-rose-500 mt-1">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nhóm nội dung <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Bài bắt buộc">Bài bắt buộc (Target 8 bài)</option>
                <option value="Nội dung bổ sung">Nội dung bổ sung</option>
              </select>
            </div>
          </div>

          {/* Row 2: Chủ đề & Mục tiêu */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Chủ đề & Tiêu đề chính <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="VD: Topic: Tuần 1 — Study | Chạy Deadline Thuyết Trình..."
              className={`w-full px-3.5 py-2 rounded-lg border text-sm ${
                errors.topic ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
            />
            {errors.topic && <p className="text-[11px] text-rose-500 mt-1">{errors.topic}</p>}
          </div>

          {/* Row 3: Mô tả tóm tắt */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mục tiêu & Nội dung chi tiết
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Minh họa quy trình sử dụng Gemini để giải quyết bài toán cụ thể..."
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Row 4: Kênh & Định dạng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kênh xuất bản
              </label>
              <select
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="TikTok">TikTok</option>
                <option value="Facebook cá nhân">Facebook cá nhân</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="Fanpage">Fanpage</option>
                <option value="Threads">Threads</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Định dạng nội dung
              </label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Video ngắn">Video ngắn (9:16)</option>
                <option value="Bài viết">Bài viết (Single Post / Text + Ảnh)</option>
                <option value="Carousel ảnh">Carousel ảnh (Infographic)</option>
                <option value="Video dài">Video dài ngang (16:9)</option>
                <option value="Livestream">Livestream / Q&A</option>
              </select>
            </div>
          </div>

          {/* Row 5: Ngày dự kiến & Hạn chót & Trạng thái */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ngày dự kiến <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                placeholder="VD: 22/10/2024"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Hạn chót (Deadline)
              </label>
              <input
                type="text"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                placeholder="VD: 23/10/2024"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Trạng thái
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
              >
                <option value="Đang làm">Đang làm</option>
                <option value="Đã đăng">Đã đăng</option>
                <option value="Chưa làm">Chưa làm</option>
              </select>
            </div>
          </div>

          {/* Row 6: Link bài viết (tùy chọn) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Link bài viết sau khi đăng (Tùy chọn)
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://tiktok.com/@... hoặc https://facebook.com/..."
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Row 7: Ghi chú */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Ghi chú thêm & Hashtags
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="VD: #GSA #GoogleAI #Deadline"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
            >
              {isEditing ? 'Lưu thay đổi' : 'Tạo nội dung'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
