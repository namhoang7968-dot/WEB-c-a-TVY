import React, { useState } from 'react';
import { checklistService } from '@/services/otherDataService';
import { Square, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function CampaignChecklist({ onShowToast }) {
  const [items, setItems] = useState(() => checklistService.get() || []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Sản xuất nội dung');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');

  const safeItems = Array.isArray(items) ? items : [];
  const completedCount = safeItems.filter(i => Boolean(i?.completed)).length;
  const totalCount = safeItems.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = async (id) => {
    const updated = await checklistService.toggle(id);
    setItems(updated || []);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const updated = await checklistService.add({
      title: newTaskTitle,
      category: newTaskCategory,
      deadline: newTaskDeadline || '30/10/2024'
    });
    setItems(updated || []);
    setNewTaskTitle('');
    onShowToast?.('Đã thêm nhiệm vụ vào checklist!', 'success');
  };

  const handleDelete = async (id) => {
    const updated = await checklistService.delete(id);
    setItems(updated || []);
    onShowToast?.('Đã xóa nhiệm vụ khỏi checklist', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Progress overview */}
      <div className="tactile-card rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[#0F172A]">Tiến độ checklist chiến dịch GSA</h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5">Đã hoàn thành {completedCount} trên tổng số {totalCount} đầu mục</p>
          </div>
          <span className="text-2xl font-bold font-mono text-blue-600">{percent}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>

      {/* Add new task bar */}
      <form onSubmit={handleAdd} className="tactile-card p-3 rounded-xl flex flex-col sm:flex-row gap-2.5">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Thêm nhiệm vụ mới cần làm..."
          className="flex-1 px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
        />
        <select
          value={newTaskCategory}
          onChange={(e) => setNewTaskCategory(e.target.value)}
          className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white focus:outline-none cursor-pointer"
        >
          <option value="Sản xuất nội dung">Sản xuất nội dung</option>
          <option value="Onboarding">Onboarding</option>
          <option value="Báo cáo">Báo cáo</option>
          <option value="Mục tiêu">Mục tiêu</option>
        </select>
        <button
          type="submit"
          className="tactile-btn bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs border border-slate-800"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm việc</span>
        </button>
      </form>

      {/* Task list */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {safeItems.length > 0 ? (
          safeItems.map((item) => (
            <div
              key={item?.id || Math.random()}
              className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                item?.completed ? 'bg-slate-50/50' : 'hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                  onClick={() => handleToggle(item?.id)}
                  className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors shrink-0 cursor-pointer"
                >
                  {item?.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
                <div className="min-w-0">
                  <p className={`text-xs sm:text-sm font-medium ${item?.completed ? 'line-through text-slate-400' : 'text-[#0F172A]'}`}>
                    {item?.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200/60 font-sans">
                      {item?.category}
                    </span>
                    {item?.deadline && (
                      <span className="font-mono">Hạn chót: {item.deadline}</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(item?.id)}
                className="text-slate-300 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                title="Xóa đầu việc"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            Checklist trống. Hãy thêm các đầu việc cần làm của chiến dịch!
          </div>
        )}
      </div>
    </div>
  );
}
