import React, { useState } from 'react';
import { HistoryItem, ActiveTab } from '../types/pali.ts';
import {
  Clock,
  Bookmark,
  Trash2,
  X,
  Download,
  BookOpen,
  Layers,
} from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onToggleBookmark: (id: string) => void;
}

const getModeLabel = (mode: ActiveTab) => {
  switch (mode) {
    case 'pali-to-vi':
      return 'Pāḷi ➔ Việt';
    case 'vi-to-pali':
      return 'Việt ➔ Pāḷi';
    case 'sentence-pali-to-vi':
      return 'Cú pháp Pāḷi ➔ Việt';
    case 'sentence-vi-to-pali':
      return 'Dịch câu Việt ➔ Pāḷi';
    default:
      return 'Tra cứu';
  }
};

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onRemoveItem,
  onClearAll,
  onToggleBookmark,
}) => {
  const [filter, setFilter] = useState<'all' | 'bookmarked'>('all');

  if (!isOpen) return null;

  const filteredItems = items.filter((item) =>
    filter === 'bookmarked' ? item.bookmarked : true
  );

  const handleExportMarkdown = () => {
    if (items.length === 0) return;
    const content = items
      .map(
        (it, index) =>
          `### [${index + 1}] [${getModeLabel(it.mode)}] ${it.query}\n- Tóm tắt: ${it.summary}\n- Thời gian: ${new Date(it.timestamp).toLocaleString()}\n\n---\n`
      )
      .join('\n');

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pali-nirutti-recent10-${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full sm:max-w-md bg-[#13151b] border-l border-amber-900/30 h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-800 bg-stone-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-stone-200 text-sm tracking-wide">
                Lịch Sử Tra Cứu Gần Nhất
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-stone-400">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-500" />
              <span>Giới hạn tối đa 10 mục (FIFO chống tràn bộ nhớ)</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-stone-800 text-amber-300 font-mono font-medium">
              {items.length}/10
            </span>
          </div>
        </div>

        {/* Filter Bar & Export */}
        <div className="flex items-center justify-between p-3 bg-stone-950/60 border-b border-stone-800/80 text-xs">
          <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-lg border border-stone-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Tất cả ({items.length})
            </button>
            <button
              onClick={() => setFilter('bookmarked')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-colors ${
                filter === 'bookmarked'
                  ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Bookmark className="w-3 h-3 text-amber-400" />
              <span>Đã lưu ({items.filter((i) => i.bookmarked).length})</span>
            </button>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleExportMarkdown}
              title="Xuất file Markdown"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-stone-400" />
              <span>Xuất MD</span>
            </button>
          )}
        </div>

        {/* Items List with smooth custom scrollbar */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredItems.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-stone-500 text-xs">
              <BookOpen className="w-8 h-8 text-stone-600 mb-2 stroke-1" />
              <p>Chưa có mục nào trong danh sách này.</p>
              <p className="text-[11px] text-stone-600 mt-1">
                Khi tra cứu, tối đa 10 mục gần nhất sẽ được ghi nhớ tại đây.
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="group p-3 bg-stone-900/60 hover:bg-stone-800/80 rounded-xl border border-stone-800/80 hover:border-amber-800/50 transition-all flex items-start justify-between gap-2.5 cursor-pointer"
                onClick={() => {
                  onSelectItem(item);
                  onClose();
                }}
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <span className="text-[10px] font-mono font-bold text-stone-500 group-hover:text-amber-400/80 mt-1 shrink-0">
                    #{index + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-pali font-semibold text-amber-200 text-base truncate">
                        {item.query}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-amber-400/90 font-sans truncate shrink-0">
                        {getModeLabel(item.mode)}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 mt-1 line-clamp-2 italic font-pali">
                      {item.summary}
                    </p>
                    <span className="text-[10px] text-stone-500 mt-1 block">
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      · {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div
                  className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onToggleBookmark(item.id)}
                    className="p-1 text-stone-400 hover:text-amber-400 transition-colors"
                    title={item.bookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu'}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        item.bookmarked ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 text-stone-500 hover:text-red-400 transition-colors"
                    title="Xóa mục này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-3 border-t border-stone-800 bg-stone-900/60 flex items-center justify-between text-xs text-stone-400">
            <span>
              Lưu trữ: <strong className="text-amber-300">{items.length}/10</strong> mục
            </span>
            <button
              onClick={onClearAll}
              className="text-stone-500 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Xóa toàn bộ</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
