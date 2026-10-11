/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sparkles,
  BookOpen,
  History as HistoryIcon,
  RotateCcw,
  AlertCircle,
  Loader2,
  X,
  Languages,
  BookMarked,
  ArrowRightLeft,
  FileText,
  Flame,
  Heart,
  Info,
} from 'lucide-react';
import {
  ActiveTab,
  HubResult,
  HistoryItem,
  PaliWordAnalysisResult,
  SentencePaliToViResult,
  SentenceViToPaliResult,
} from './types/pali.ts';
import { DiacriticsBar } from './components/DiacriticsBar.tsx';
import { AnalysisResult } from './components/AnalysisResult.tsx';
import { SentencePaliToViResultView } from './components/SentencePaliToViResult.tsx';
import { SentenceViToPaliResultView } from './components/SentenceViToPaliResult.tsx';
import { GrammarHandbookView } from './components/GrammarHandbookView.tsx';
import { HistoryDrawer } from './components/HistoryDrawer.tsx';
import { SupportModal } from './components/SupportModal.tsx';
import { InfoModal } from './components/InfoModal.tsx';

const STORAGE_KEY = 'pali_nirutti_history_v2';
const MAX_HISTORY_ITEMS = 10;

const TAB_CONFIGS: {
  id: ActiveTab;
  label: string;
  placeholder: string;
  buttonText: string;
}[] = [
  {
    id: 'pali-to-vi',
    label: 'Tra từ Pali - Việt',
    placeholder: 'Nhập một từ Pāḷi bất kỳ...',
    buttonText: 'Phân tích chuẩn 4 ý',
  },
  {
    id: 'vi-to-pali',
    label: 'Tra từ Việt - Pali',
    placeholder: 'Nhập từ tiếng Việt cần tra...',
    buttonText: 'Tra từ Pāḷi chuẩn 3 ý',
  },
  {
    id: 'sentence-pali-to-vi',
    label: 'Dịch câu Pali - Việt',
    placeholder: 'Nhập câu Pāḷi cần dịch...',
    buttonText: 'Phân tích cú pháp & dịch',
  },
  {
    id: 'sentence-vi-to-pali',
    label: 'Dịch câu Việt - Pali',
    placeholder: 'Nhập câu tiếng Việt cần dịch...',
    buttonText: 'Dịch sang Pāḷi (SOV)',
  },
  {
    id: 'grammar-handbook',
    label: 'Sổ tay Ngữ pháp',
    placeholder: '',
    buttonText: '',
  },
];

const PRESETS: Record<ActiveTab, { label: string; text: string }[]> = {
  'pali-to-vi': [
    { label: 'dhammena', text: 'dhammena' },
    { label: 'buddhassa', text: 'buddhassa' },
    { label: 'gacchati', text: 'gacchati' },
    { label: 'bhikkhave', text: 'bhikkhave' },
    { label: 'nibbānaṃ', text: 'nibbānaṃ' },
    { label: 'anattā', text: 'anattā' },
  ],
  'vi-to-pali': [
    { label: 'giáo pháp', text: 'giáo pháp' },
    { label: 'đức Phật', text: 'đức Phật' },
    { label: 'đi (động từ)', text: 'đi' },
    { label: 'tâm / ý', text: 'tâm' },
    { label: 'trí tuệ', text: 'trí tuệ' },
    { label: 'khổ đau', text: 'khổ đau' },
  ],
  'sentence-pali-to-vi': [
    { label: 'Buddho dhammaṃ deseti', text: 'Buddho dhammaṃ deseti' },
    { label: 'Bhikkhū gāmaṃ gacchanti', text: 'Bhikkhū gāmaṃ gacchanti' },
    { label: 'Namo tassa bhagavato', text: 'Namo tassa bhagavato arahato sammāsambuddhassa' },
  ],
  'sentence-vi-to-pali': [
    { label: 'Đức Phật thuyết pháp cho chư Tỳ-khưu', text: 'Đức Phật thuyết pháp cho chư Tỳ-khưu' },
    { label: 'Người trí không làm ác', text: 'Người trí tuệ không làm điều ác' },
    { label: 'Tâm dẫn đầu các pháp', text: 'Tâm dẫn đầu các pháp' },
  ],
  'grammar-handbook': [],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('pali-to-vi');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Results state for each tab
  const [paliToViResult, setPaliToViResult] = useState<PaliWordAnalysisResult | null>(null);
  const [viToPaliResult, setViToPaliResult] = useState<PaliWordAnalysisResult | null>(null);
  const [sentencePaliToViResult, setSentencePaliToViResult] = useState<SentencePaliToViResult | null>(null);
  const [sentenceViToPaliResult, setSentenceViToPaliResult] = useState<SentenceViToPaliResult | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Load history on mount (giới hạn 10 mục)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, MAX_HISTORY_ITEMS));
        }
      }
    } catch (e) {
      console.warn('Lỗi tải lịch sử:', e);
    }
  }, []);

  const saveHistory = (items: HistoryItem[]) => {
    const trimmed = items.slice(0, MAX_HISTORY_ITEMS);
    setHistory(trimmed);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('Lỗi lưu lịch sử:', e);
    }
  };

  const handleTabChange = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setError(null);
    setInputText('');
  };

  const handleSubmit = async (overrideText?: string) => {
    if (activeTab === 'grammar-handbook') return;

    const query = (overrideText ?? inputText).trim();
    if (!query) return;

    setLoading(true);
    setError(null);
    setInputText(query);

    try {
      const response = await fetch('/api/pali-hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: activeTab, input: query }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Lỗi máy chủ (${response.status})`);
      }

      const res = await response.json();
      const mode = res.mode as ActiveTab;
      const data = res.data;

      let summary = '';
      let hubResult: HubResult;

      if (mode === 'pali-to-vi') {
        setPaliToViResult(data);
        summary = `${data.rootAndType?.wordType || ''} · ${data.directMeaning || ''}`;
        hubResult = { mode: 'pali-to-vi', data };
      } else if (mode === 'vi-to-pali') {
        setViToPaliResult(data);
        summary = `➔ ${data.analyzedWord} (${data.rootAndType?.wordType || ''})`;
        hubResult = { mode: 'vi-to-pali', data };
      } else if (mode === 'sentence-pali-to-vi') {
        setSentencePaliToViResult(data);
        summary = data.smoothTranslation || '';
        hubResult = { mode: 'sentence-pali-to-vi', data };
      } else {
        setSentenceViToPaliResult(data);
        summary = data.paliTranslation || '';
        hubResult = { mode: 'sentence-vi-to-pali', data };
      }

      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        mode,
        query,
        summary,
        timestamp: Date.now(),
        bookmarked: false,
        result: hubResult,
      };

      const nextHistory = [
        newItem,
        ...history.filter((h) => !(h.query.toLowerCase() === query.toLowerCase() && h.mode === mode)),
      ].slice(0, MAX_HISTORY_ITEMS); // Cơ chế FIFO: Tối đa 10 mục, mục thứ 11 sẽ tự động bị loại bỏ khỏi danh sách

      saveHistory(nextHistory);
    } catch (err: any) {
      console.error('Lỗi khi gọi API:', err);
      setError(err?.message || 'Không thể thực hiện yêu cầu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleInsertChar = (char: string) => {
    if (inputRef.current) {
      const input = inputRef.current;
      const start = input.selectionStart ?? inputText.length;
      const end = input.selectionEnd ?? inputText.length;
      const nextVal = inputText.substring(0, start) + char + inputText.substring(end);
      setInputText(nextVal);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + char.length, start + char.length);
      }, 10);
    } else {
      setInputText((prev) => prev + char);
    }
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setActiveTab(item.mode);
    setInputText(item.query);
    if (item.result.mode === 'pali-to-vi') {
      setPaliToViResult(item.result.data);
    } else if (item.result.mode === 'vi-to-pali') {
      setViToPaliResult(item.result.data);
    } else if (item.result.mode === 'sentence-pali-to-vi') {
      setSentencePaliToViResult(item.result.data);
    } else if (item.result.mode === 'sentence-vi-to-pali') {
      setSentenceViToPaliResult(item.result.data);
    }
  };

  const isCurrentBookmarked = history.some(
    (h) => h.query.toLowerCase() === inputText.trim().toLowerCase() && h.mode === activeTab && h.bookmarked
  );

  const toggleBookmarkCurrent = () => {
    const q = inputText.trim().toLowerCase();
    const updated = history.map((h) =>
      h.query.toLowerCase() === q && h.mode === activeTab ? { ...h, bookmarked: !h.bookmarked } : h
    );
    saveHistory(updated);
  };

  const currentTabConfig = TAB_CONFIGS.find((t) => t.id === activeTab)!;
  const isSentenceMode = activeTab === 'sentence-pali-to-vi' || activeTab === 'sentence-vi-to-pali';

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0f14] text-[#e2dfd9] relative selection:bg-amber-600/30 selection:text-amber-200">
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(180,120,40,0.12),transparent)] pointer-events-none" />

      {/* Main Header */}
      <header className="border-b border-stone-800/80 bg-[#12141c]/95 sticky top-0 z-30 backdrop-blur-md">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
              <span className="font-pali text-xl sm:text-2xl font-bold leading-none select-none">ဓ</span>
            </div>
            <div>
              <h1 className="font-pali font-bold text-lg sm:text-xl lg:text-2xl text-amber-100 tracking-[0.12em] sm:tracking-[0.16em] uppercase drop-shadow-sm">
                TRA CỨU PALI
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Nút [Ủng hộ] */}
            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-200 border border-stone-800 text-xs sm:text-sm font-medium transition-colors"
              title="Ủng hộ dự án (QR Ngân hàng)"
            >
              <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span>Ủng hộ</span>
            </button>

            {/* Nút [Thông Tin] */}
            <button
              onClick={() => setIsInfoModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-200 border border-stone-800 text-xs sm:text-sm font-medium transition-colors"
              title="Thông tin tác giả"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Thông Tin</span>
            </button>

            {/* Nút [Lịch sử] */}
            <button
              onClick={() => setIsHistoryDrawerOpen(true)}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-200 border border-stone-800 text-xs sm:text-sm font-medium transition-colors"
            >
              <HistoryIcon className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">Lịch sử</span>
              {history.length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-600/30 text-amber-300 text-[10px] font-bold">
                  {history.length}/10
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 1. THANH NAVIGATION / TABS: Cuộn ngang trên mobile, dàn trải trên tablet/desktop */}
        <div className="border-t border-stone-800/60 bg-[#0e1017]">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-x-auto whitespace-nowrap py-2 scrollbar-none">
            <nav className="flex items-center gap-1.5 sm:gap-2 min-w-max md:min-w-0 md:flex-wrap lg:justify-center" aria-label="Tabs">
              {TAB_CONFIGS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 select-none ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-sm shadow-amber-950/40 font-semibold'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900 border border-transparent'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area: Padding p-4 trên mobile, p-6 trên tablet, p-8 trên desktop */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 relative z-10">
        {/* TAB 5: SỔ TAY NGỮ PHÁP (KHÔNG CẦN Ô NHẬP LIỆU) */}
        {activeTab === 'grammar-handbook' ? (
          <GrammarHandbookView />
        ) : (
          /* TAB 1, 2, 3, 4: CÓ Ô NHẬP LIỆU TÙY BIẾN THEO TAB */
          <section className="bg-[#14161f]/80 border border-amber-900/30 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-3"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />

                  {isSentenceMode ? (
                    <textarea
                      ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                      rows={2}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={currentTabConfig.placeholder}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-950/80 border border-stone-800 text-stone-100 placeholder:text-stone-500 font-pali text-sm sm:text-base focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 transition-all resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <input
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={currentTabConfig.placeholder}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-stone-950/80 border border-stone-800 text-stone-100 placeholder:text-stone-500 font-pali text-base sm:text-lg focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 transition-all"
                      autoFocus
                    />
                  )}

                  {inputText && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputText('');
                        inputRef.current?.focus();
                      }}
                      className="absolute right-3 top-3.5 p-1 text-stone-400 hover:text-stone-200 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-semibold text-sm transition-all shadow-md shadow-amber-900/20 self-stretch sm:self-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{currentTabConfig.buttonText}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Virtual Diacritics Bar */}
              <DiacriticsBar onInsertChar={handleInsertChar} />
            </form>

            {/* Presets based on active tab */}
            {PRESETS[activeTab] && PRESETS[activeTab].length > 0 && (
              <div className="pt-2 border-t border-stone-800/70">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-stone-400 font-medium flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Gợi ý mẫu:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESETS[activeTab].map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSubmit(preset.text)}
                        disabled={loading}
                        className="px-2.5 py-1 rounded-md bg-stone-900/90 hover:bg-amber-600/20 hover:text-amber-200 text-stone-300 border border-stone-800 hover:border-amber-500/40 font-pali text-xs transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-amber-600/20 border-t-amber-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-amber-400 font-pali font-bold text-sm">
                ဓ
              </div>
            </div>
            <p className="font-pali text-base text-amber-200 font-medium">
              {activeTab === 'pali-to-vi' && 'Đang bóc tách 4 ý ngữ pháp Pāḷi...'}
              {activeTab === 'vi-to-pali' && 'Đang tìm từ Pāḷi sát nghĩa & phân tích 3 ý...'}
              {activeTab === 'sentence-pali-to-vi' && 'Đang phân tích cú pháp từng từ & dịch nghĩa...'}
              {activeTab === 'sentence-vi-to-pali' && 'Đang chuyển ngữ Pāḷi theo cú pháp SOV & giải trình...'}
            </p>
            <p className="text-xs text-stone-400 max-w-md">
              Hệ thống xử lý theo đúng nguyên tắc văn phạm kinh điển Theravāda.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && !loading && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm">
              <h4 className="font-semibold text-red-300">Không thể hoàn tất yêu cầu</h4>
              <p className="mt-1 text-red-300/80 leading-relaxed">{error}</p>
              <button
                onClick={() => handleSubmit()}
                className="mt-2.5 px-3 py-1 rounded bg-red-900/60 hover:bg-red-800/80 text-red-100 text-xs font-medium transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {/* RESULT RENDERERS BASED ON ACTIVE TAB */}
        {!loading && (
          <>
            {activeTab === 'pali-to-vi' && paliToViResult && (
              <AnalysisResult
                data={paliToViResult}
                mode="pali-to-vi"
                isBookmarked={isCurrentBookmarked}
                onToggleBookmark={toggleBookmarkCurrent}
              />
            )}

            {activeTab === 'vi-to-pali' && viToPaliResult && (
              <AnalysisResult
                data={viToPaliResult}
                mode="vi-to-pali"
                isBookmarked={isCurrentBookmarked}
                onToggleBookmark={toggleBookmarkCurrent}
              />
            )}

            {activeTab === 'sentence-pali-to-vi' && sentencePaliToViResult && (
              <SentencePaliToViResultView
                data={sentencePaliToViResult}
                isBookmarked={isCurrentBookmarked}
                onToggleBookmark={toggleBookmarkCurrent}
              />
            )}

            {activeTab === 'sentence-vi-to-pali' && sentenceViToPaliResult && (
              <SentenceViToPaliResultView
                data={sentenceViToPaliResult}
                isBookmarked={isCurrentBookmarked}
                onToggleBookmark={toggleBookmarkCurrent}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/60 pt-5 pb-6 bg-[#0f1117] text-center mt-auto w-full">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          {/* Dòng 1: Màu xám sáng nhẹ, thanh thoát */}
          <p className="text-xs sm:text-sm text-stone-400 font-sans tracking-wide">
            Dự án đang cần kinh phí để nâng cấp và duy trì dung lượng tra cứu (token).
          </p>

          {/* Dòng 2: Lời kêu gọi kèm nút bấm liên kết nổi bật */}
          <p className="text-xs sm:text-sm text-stone-300 font-sans flex items-center justify-center gap-1.5 flex-wrap">
            <span>Tuỳ hỷ ủng hộ bấm vào đây --&gt;</span>
            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="text-amber-400 font-bold font-pali hover:underline hover:text-amber-300 cursor-pointer transition-all inline-flex items-center gap-1 focus:outline-none"
              title="Mở mã QR ngân hàng ủng hộ tác giả"
            >
              <span>Thầy Đạt cute ^v^</span>
            </button>
          </p>
        </div>
      </footer>

      {/* Support Modal (QR Ngân Hàng - id="support-modal") */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      {/* Info Modal (Hình Của Thầy & Zalo - id="info-modal") */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        items={history}
        onSelectItem={handleSelectHistoryItem}
        onRemoveItem={(id) => saveHistory(history.filter((h) => h.id !== id))}
        onClearAll={() => {
          if (window.confirm('Xóa toàn bộ lịch sử?')) saveHistory([]);
        }}
        onToggleBookmark={(id) =>
          saveHistory(history.map((h) => (h.id === id ? { ...h, bookmarked: !h.bookmarked } : h)))
        }
      />
    </div>
  );
}
