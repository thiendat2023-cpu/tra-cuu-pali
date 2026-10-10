import React, { useState } from 'react';
import { SentencePaliToViResult } from '../types/pali.ts';
import { Copy, Check, Bookmark, BookmarkCheck, ArrowRight, BookOpen } from 'lucide-react';

interface SentencePaliToViResultProps {
  data: SentencePaliToViResult;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const SentencePaliToViResultView: React.FC<SentencePaliToViResultProps> = ({
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
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
            Câu Pāḷi gốc:
          </span>
          <div>
            <h3 className="font-pali text-xl sm:text-2xl font-bold text-amber-200">
              {data.originalSentence}
            </h3>
          </div>
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
            onClick={() => handleCopy(data.rawOutput || data.smoothTranslation)}
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
                <span>Sao chép</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Word-by-Word Grammatical Parsing Cards */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Bóc tách cú pháp từng từ (Đầy đủ 3 lớp: Từ Pāḷi - Nghĩa tiếng Việt - Giải phẫu ngữ pháp):</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {data.words.map((item, index) => {
            const displayMeaning = item.vietnameseMeaning || 'Chưa có nghĩa';

            return (
              <div
                key={index}
                className="p-4 bg-stone-900/70 hover:bg-stone-900/90 rounded-xl border border-stone-800 hover:border-amber-700/50 transition-all flex flex-col justify-between space-y-2.5 shadow-sm"
              >
                {/* 1. Dòng trên: Từ Pāḷi gốc (in đậm màu vàng) & Ký hiệu viết tắt (Góc phải) */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-pali text-lg sm:text-xl font-bold text-amber-300 tracking-wide">
                    {item.word}
                  </span>
                  <code className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-stone-950 border border-amber-500/30 text-amber-300 shrink-0">
                    {item.abbreviation}
                  </code>
                </div>

                {/* 2. Dòng giữa: Nghĩa tiếng Việt trực tiếp nổi bật (text cỡ vừa, màu trắng hoặc xám sáng) */}
                <div className="py-1">
                  <div className="text-sm sm:text-base font-semibold text-stone-100 flex items-center gap-1.5 leading-snug">
                    <span className="text-stone-100">{displayMeaning}</span>
                  </div>
                </div>

                {/* 3. Dòng dưới cùng: Phần giải thích ngữ pháp in nghiêng */}
                <div className="pt-2 border-t border-stone-800/80">
                  <p className="text-xs italic text-stone-400 font-pali leading-relaxed">
                    {item.detailedAnalysis}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prominent Smooth Vietnamese Translation */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/30 via-stone-900/80 to-stone-900/60 rounded-xl border border-amber-700/40 shadow-lg">
        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
          <ArrowRight className="w-4 h-4 text-amber-400" />
          <span>Bản dịch tiếng Việt mượt mà:</span>
        </span>
        <div className="text-base sm:text-lg text-amber-100 font-medium leading-relaxed font-pali pl-1">
          {data.smoothTranslation.startsWith('=>')
            ? data.smoothTranslation
            : `=> ${data.smoothTranslation}`}
        </div>
      </div>
    </div>
  );
};
