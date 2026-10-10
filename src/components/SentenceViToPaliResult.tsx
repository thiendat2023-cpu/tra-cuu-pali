import React, { useState } from 'react';
import { SentenceViToPaliResult } from '../types/pali.ts';
import { Copy, Check, Bookmark, BookmarkCheck, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

interface SentenceViToPaliResultProps {
  data: SentenceViToPaliResult;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const SentenceViToPaliResultView: React.FC<SentenceViToPaliResultProps> = ({
  data,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#15171e] border border-amber-900/30 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
        <div>
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1">
            Câu tiếng Việt gốc:
          </span>
          <p className="text-base sm:text-lg text-stone-200 font-medium italic">
            &ldquo;{data.originalSentence}&rdquo;
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={onToggleBookmark}
            title={isBookmarked ? 'Bỏ lưu câu này' : 'Lưu câu vào sổ tay'}
            className={`p-2 rounded-lg border transition-all ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-stone-900 text-stone-400 hover:text-amber-300 border-stone-800'
            }`}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-amber-400" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => handleCopy(data.rawOutput || `${data.paliTranslation}\n\n${data.grammarBreakdown}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-medium transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Đã chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-400" />
                <span>Sao chép toàn bộ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Part 1: BẢN DỊCH PĀḶI (SOV Structure) */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/40 via-stone-900/80 to-stone-900/60 rounded-xl border border-amber-600/40 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              1. Bản Dịch Pāḷi (Chuẩn cú pháp SOV):
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300">
            SOV (Chủ - Bổ - Vị)
          </span>
        </div>

        <div className="mt-3">
          <p className="font-pali text-2xl sm:text-3xl font-bold text-amber-200 tracking-wide">
            {data.paliTranslation}
          </p>
        </div>
      </div>

      {/* Part 2: GIẢI TRÌNH NGỮ PHÁP (Phân tích ngược) */}
      <div className="p-4 bg-stone-900/70 rounded-xl border border-stone-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
          <BookOpen className="w-3.5 h-3.5" />
          <span>2. Giải Trình Ngữ Pháp (Phân tích ngược bằng ký hiệu viết tắt):</span>
        </div>
        <div className="p-3 bg-stone-950/80 rounded-lg border border-stone-800/80 text-xs sm:text-sm font-mono text-stone-300 whitespace-pre-wrap leading-relaxed">
          {data.grammarBreakdown}
        </div>
      </div>

      {/* Part 3: LƯU Ý DỊCH THUẬT */}
      {data.translationNotes && (
        <div className="p-4 bg-amber-950/20 rounded-xl border border-amber-800/30 flex items-start gap-2.5 text-xs text-amber-200/90 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 block mb-0.5">3. Lưu Ý Dịch Thuật:</strong>
            {data.translationNotes}
          </div>
        </div>
      )}
    </div>
  );
};
