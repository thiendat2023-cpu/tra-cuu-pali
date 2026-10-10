import React, { useState } from 'react';
import { VIBHATTI_CASES, VERB_PURISA_LIST } from '../data/paliGrammarRef.ts';
import { X, BookMarked, HelpCircle, Sparkles } from 'lucide-react';

interface GrammarReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GrammarReferenceModal: React.FC<GrammarReferenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'verbs' | 'alphabet'>('cases');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#14161d] border border-amber-900/40 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-800 bg-stone-900/60">
          <div className="flex items-center gap-2.5">
            <BookMarked className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-stone-100 font-display tracking-wide">
                Sổ Tay Ngữ Pháp Pāḷi (Pāḷi Nirutti Sāra)
              </h3>
              <p className="text-xs text-stone-400">
                Bảng quy chiếu 8 Biến Cách (Vibhatti), Ngôi Động Từ và Bảng Mẫu Tự Pāḷi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-stone-950/60 border-b border-stone-800 text-xs">
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'cases'
                ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            8 Biến Cách (Aṭṭha Vibhatti)
          </button>
          <button
            onClick={() => setActiveTab('verbs')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'verbs'
                ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            Ngôi Động Từ (Purisa)
          </button>
          <button
            onClick={() => setActiveTab('alphabet')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'alphabet'
                ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            Nguyên Âm & Phụ Âm (Akkhara)
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-stone-300">
          {activeTab === 'cases' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl text-xs text-amber-200/90 leading-relaxed">
                Trong ngữ pháp Pāḷi, danh từ và tính từ biến đổi đuôi (vibhatti) qua 8 cách ở hai số (Số ít: Ekavacana và Số nhiều: Bahuvacana) để biểu thị chức năng ngữ pháp trong câu.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {VIBHATTI_CASES.map((item) => (
                  <div
                    key={item.number}
                    className="p-3.5 bg-stone-900/60 rounded-xl border border-stone-800 hover:border-amber-700/40 transition-colors"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-stone-800/80">
                      <div>
                        <span className="text-amber-400 font-semibold text-sm">
                          Cách {item.number}: {item.paliName}
                        </span>
                        <h4 className="text-xs text-stone-300 font-medium mt-0.5">
                          {item.vietnameseName} ({item.englishName})
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                        Số {item.number}
                      </span>
                    </div>

                    <div className="mt-2.5 space-y-1.5 text-xs">
                      <div className="flex items-start gap-1">
                        <span className="text-stone-400 font-medium">Trợ từ dịch:</span>
                        <span className="text-amber-300 font-semibold">{item.vietnameseParticle}</span>
                      </div>
                      <div className="text-stone-400 leading-relaxed">
                        {item.description}
                      </div>
                      <div className="pt-2 border-t border-stone-800/50 flex flex-wrap gap-2 text-[11px]">
                        <span className="text-stone-400">
                          Đuôi a nam tính Sg: <code className="font-pali text-amber-200">{item.masculineAEndingSg}</code>
                        </span>
                        <span className="text-stone-500">·</span>
                        <span className="text-stone-400">
                          Pl: <code className="font-pali text-amber-200">{item.masculineAEndingPl}</code>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'verbs' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl text-xs text-amber-200/90 leading-relaxed">
                Động từ Pāḷi (Kriyāpada) được chia theo 3 Ngôi (Purisa) và 8 Thời/Thể/Thì (Kāla) chính. Thứ tự các ngôi trong truyền thống ngữ pháp Pāḷi bắt đầu từ Ngôi thứ 3 (Paṭhama-purisa) đến Ngôi thứ 1 (Uttama-purisa).
              </div>

              <div className="space-y-3">
                {VERB_PURISA_LIST.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-stone-900/60 rounded-xl border border-stone-800"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-amber-300 text-sm">
                        {item.paliName} — {item.vietnameseName}
                      </h4>
                      <span className="text-xs text-stone-400">{item.englishEquivalent}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-stone-800/80 text-xs">
                      <div className="bg-stone-950/50 p-2.5 rounded-lg border border-stone-800/60">
                        <div className="text-stone-400 font-medium">Số ít (Ekavacana): Đuôi <span className="font-pali text-amber-300 font-bold">{item.endingSg}</span></div>
                        <div className="mt-1 font-pali text-stone-200">Ví dụ: {item.exampleSg}</div>
                      </div>
                      <div className="bg-stone-950/50 p-2.5 rounded-lg border border-stone-800/60">
                        <div className="text-stone-400 font-medium">Số nhiều (Bahuvacana): Đuôi <span className="font-pali text-amber-300 font-bold">{item.endingPl}</span></div>
                        <div className="mt-1 font-pali text-stone-200">Ví dụ: {item.examplePl}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'alphabet' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 leading-relaxed">
                <h4 className="font-semibold text-amber-300 mb-2">8 Nguyên âm Pāḷi (Sara):</h4>
                <div className="flex flex-wrap gap-2 text-sm font-pali">
                  <span className="px-2.5 py-1 bg-stone-950 rounded border border-stone-800 text-amber-200">a, ā</span>
                  <span className="px-2.5 py-1 bg-stone-950 rounded border border-stone-800 text-amber-200">i, ī</span>
                  <span className="px-2.5 py-1 bg-stone-950 rounded border border-stone-800 text-amber-200">u, ū</span>
                  <span className="px-2.5 py-1 bg-stone-950 rounded border border-stone-800 text-amber-200">e, o</span>
                </div>
                <p className="mt-2 text-stone-400 text-[11px]">
                  (a, i, u là nguyên âm ngắn / Rassa; ā, ī, ū, e, o là nguyên âm dài / Dīgha).
                </p>
              </div>

              <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 leading-relaxed">
                <h4 className="font-semibold text-amber-300 mb-2">33 Phụ âm Pāḷi (Vyañjana) theo 5 nhóm Vị trí phát âm:</h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-stone-400 font-medium">1. Cổ họng (Kaṇṭhaja):</span>
                    <span className="ml-2 font-pali text-stone-200">ka, kha, ga, gha, ṅa</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium">2. Vòm họng (Tāluja):</span>
                    <span className="ml-2 font-pali text-stone-200">ca, cha, ja, jha, ña</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium">3. Nóc họng / Quặt lưỡi (Muddhaja):</span>
                    <span className="ml-2 font-pali text-stone-200">ṭa, ṭha, ḍa, ḍha, ṇa</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium">4. Răng (Dantaja):</span>
                    <span className="ml-2 font-pali text-stone-200">ta, tha, da, dha, na</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium">5. Môi (Oṭṭhaja):</span>
                    <span className="ml-2 font-pali text-stone-200">pa, pha, ba, bha, ma</span>
                  </div>
                  <div className="pt-2 border-t border-stone-800">
                    <span className="text-stone-400 font-medium">Bất định âm (Avagga) & Niggahīta:</span>
                    <span className="ml-2 font-pali text-amber-200">ya, ra, la, va, sa, ha, ḷa, ṃ</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Đóng bảng tra cứu
          </button>
        </div>
      </div>
    </div>
  );
};
