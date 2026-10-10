import React, { useState } from 'react';
import { PaliWordAnalysisResult } from '../types/pali.ts';
import {
  BookOpen,
  Layers,
  Sparkles,
  Table as TableIcon,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  FileText,
  Eye,
  Info,
  ArrowRight,
} from 'lucide-react';

interface AnalysisResultProps {
  data: PaliWordAnalysisResult;
  mode?: 'pali-to-vi' | 'vi-to-pali';
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

const formatCaseOrPerson = (val: string): { vi: string; pali?: string } => {
  if (!val) return { vi: '' };
  const lower = val.toLowerCase();

  if (lower.includes('paṭhamā') || (lower.includes('pathama') && !lower.includes('purisa') && !lower.includes('ngôi'))) {
    return { vi: '1. Chủ cách', pali: 'Paṭhamā' };
  }
  if (lower.includes('dutiyā') || lower.includes('dutiya') || lower.includes('đối cách')) {
    return { vi: '2. Đối cách', pali: 'Dutiyā' };
  }
  if (lower.includes('tatiyā') || lower.includes('tatiya') || lower.includes('sử dụng cách') || lower.includes('công cụ cách')) {
    return { vi: '3. Sử dụng cách', pali: 'Tatiyā' };
  }
  if (lower.includes('catutthī') || lower.includes('catutthi') || lower.includes('chỉ định cách')) {
    return { vi: '4. Chỉ định cách', pali: 'Catutthī' };
  }
  if (lower.includes('pañcamī') || lower.includes('pancami') || lower.includes('xuất xứ cách')) {
    return { vi: '5. Xuất xứ cách', pali: 'Pañcamī' };
  }
  if (lower.includes('chaṭṭhī') || lower.includes('chatthi') || lower.includes('sở thuộc cách')) {
    return { vi: '6. Sở thuộc cách', pali: 'Chaṭṭhī' };
  }
  if (lower.includes('sattamī') || lower.includes('sattami') || lower.includes('định vị cách')) {
    return { vi: '7. Định vị cách', pali: 'Sattamī' };
  }
  if (lower.includes('ālapana') || lower.includes('alapana') || lower.includes('hô cách')) {
    return { vi: '8. Hô cách', pali: 'Ālapana' };
  }

  // Verbs
  if (lower.includes('paṭhama-purisa') || lower.includes('ngôi 3') || lower.includes('ngôi thứ 3') || lower.includes('ngôi thứ ba')) {
    return { vi: '1. Ngôi 3 (Ngôi thứ ba)', pali: 'Paṭhama-purisa' };
  }
  if (lower.includes('majjhima') || lower.includes('ngôi 2') || lower.includes('ngôi thứ 2') || lower.includes('ngôi thứ hai')) {
    return { vi: '2. Ngôi 2 (Ngôi thứ hai)', pali: 'Majjhima-purisa' };
  }
  if (lower.includes('uttama') || lower.includes('ngôi 1') || lower.includes('ngôi thứ 1') || lower.includes('ngôi thứ nhất')) {
    return { vi: '3. Ngôi 1 (Ngôi thứ nhất)', pali: 'Uttama-purisa' };
  }

  return { vi: val };
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({
  data,
  mode = 'pali-to-vi',
  isBookmarked,
  onToggleBookmark,
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'markdown'>('visual');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const isViToPali = mode === 'vi-to-pali';
  const fullTextToCopy = data.formattedMarkdown || data.fourPointsFormattedMarkdown || '';

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="bg-[#15171e] border border-amber-900/30 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-800">
        <div>
          {isViToPali && data.vietnameseWord && (
            <div className="flex items-center gap-2 text-xs font-medium text-stone-400 mb-1">
              <span>Tiếng Việt: <strong className="text-stone-200">{data.vietnameseWord}</strong></span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-400">Từ Pāḷi sát nghĩa nhất:</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <h2 className="text-3xl sm:text-4xl font-pali font-bold text-amber-300 tracking-wide">
              {data.analyzedWord}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-stone-400">
            <span className="text-amber-400/90 font-medium">{data.rootAndType.wordType}</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Gốc: <strong className="font-pali text-stone-300 font-normal">{data.rootAndType.base}</strong></span>
            {data.rootAndType.root && (
              <>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span>Ngữ căn: <strong className="font-pali text-amber-200 font-semibold">{data.rootAndType.root}</strong></span>
              </>
            )}
          </div>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center bg-stone-900/90 p-1 rounded-lg border border-stone-800 text-xs">
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'visual'
                  ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Trực quan</span>
            </button>
            <button
              onClick={() => setActiveTab('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'markdown'
                  ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isViToPali ? 'Bản 3 ý' : 'Bản 4 ý'}</span>
            </button>
          </div>

          <button
            onClick={onToggleBookmark}
            title={isBookmarked ? 'Bỏ lưu từ này' : 'Lưu từ vào sổ tay'}
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
            onClick={() => handleCopy(fullTextToCopy, 'all')}
            title="Sao chép toàn bộ phân tích chuẩn"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 text-xs font-medium transition-colors"
          >
            {copiedSection === 'all' ? (
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

      {/* Main Content Area */}
      {activeTab === 'visual' ? (
        <div className="space-y-6 mt-6">
          <div className={`grid grid-cols-1 md:grid-cols-2 ${data.directMeaning ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-4 sm:gap-5`}>
            {/* 1. TỪ GỐC & TỪ LOẠI */}
            <div className="bg-stone-900/60 border border-stone-800/90 rounded-xl p-4 sm:p-5 flex flex-col justify-between hover:border-amber-800/40 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-amber-400/90 text-xs font-semibold uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>1. Từ gốc & Từ loại</span>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(
                        `Từ gốc: ${data.rootAndType.base} | Ngữ căn: ${data.rootAndType.root} | Từ loại: ${data.rootAndType.wordType}`,
                        'root'
                      )
                    }
                    className="text-stone-500 hover:text-stone-300 p-1"
                    title="Sao chép phần từ gốc"
                  >
                    {copiedSection === 'root' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                <div className="space-y-2 mt-3 text-sm">
                  <div>
                    <span className="text-xs text-stone-400">Ngữ căn (Root):</span>
                    <p className="text-base font-pali font-semibold text-amber-200">
                      {data.rootAndType.root || '—'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-stone-400">Từ gốc (Base / Stem):</span>
                    <p className="text-sm font-pali text-stone-200 font-medium">
                      {data.rootAndType.base}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-stone-400">Từ loại (Word Type):</span>
                    <p className="text-sm text-stone-300 font-medium">
                      {data.rootAndType.wordType}
                      {data.rootAndType.genderOrClass ? ` (${data.rootAndType.genderOrClass})` : ''}
                    </p>
                  </div>
                </div>
              </div>

              {data.rootAndType.etymologyNote && (
                <div className="mt-3 pt-2.5 border-t border-stone-800/70 text-xs text-stone-400 leading-relaxed italic">
                  {data.rootAndType.etymologyNote}
                </div>
              )}
            </div>

            {/* 2. HÌNH THÁI HIỆN TẠI */}
            <div className="bg-stone-900/60 border border-stone-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-amber-800/40 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-amber-400/90 text-xs font-semibold uppercase tracking-wider">
                    <Layers className="w-3.5 h-3.5" />
                    <span>2. Hình thái hiện tại</span>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(
                        `Hình thái: ${data.currentMorphology.classification} - ${data.currentMorphology.number}`,
                        'morph'
                      )
                    }
                    className="text-stone-500 hover:text-stone-300 p-1"
                    title="Sao chép hình thái"
                  >
                    {copiedSection === 'morph' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                <div className="space-y-2 mt-3 text-sm">
                  <div>
                    <span className="text-xs text-stone-400">Cách / Ngôi & Thì:</span>
                    <p className="text-sm font-medium text-amber-200">
                      {data.currentMorphology.classification}
                    </p>
                    {data.currentMorphology.paliTerm && (
                      <span className="text-xs font-pali text-stone-400 block mt-0.5">
                        Thuật ngữ: {data.currentMorphology.paliTerm}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-xs text-stone-400">Số lượng (Vacana):</span>
                    <p className="text-sm text-stone-200 font-semibold">
                      {data.currentMorphology.number}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-stone-400">Tóm tắt hình thái:</span>
                    <p className="text-xs text-stone-300 bg-stone-950/60 p-2 rounded-lg border border-stone-800/80">
                      {data.currentMorphology.summary}
                    </p>
                  </div>
                </div>
              </div>

              {data.currentMorphology.alternativeForms && data.currentMorphology.alternativeForms.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-stone-800/70 text-xs text-stone-400">
                  <span className="text-stone-500 font-medium">Khả năng đồng hình khác:</span>
                  <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-stone-400">
                    {data.currentMorphology.alternativeForms.map((alt, idx) => (
                      <li key={idx}>{alt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 3. NGHĨA TRỰC TIẾP (Nếu có) */}
            {data.directMeaning && (
              <div className="bg-gradient-to-br from-amber-950/20 via-stone-900/70 to-stone-900/60 border border-amber-800/40 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-lg md:col-span-2 lg:col-span-1">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>3. Nghĩa trực tiếp</span>
                    </div>
                    <button
                      onClick={() => handleCopy(data.directMeaning || '', 'meaning')}
                      className="text-stone-500 hover:text-stone-300 p-1"
                      title="Sao chép nghĩa trực tiếp"
                    >
                      {copiedSection === 'meaning' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  <div className="mt-3">
                    <span className="text-xs text-stone-400">Dịch nghĩa tại hình thái bóc tách:</span>
                    <div className="mt-2 p-3.5 bg-amber-950/30 rounded-lg border border-amber-600/30 text-amber-100 font-pali text-base sm:text-lg font-medium leading-relaxed">
                      &ldquo;{data.directMeaning}&rdquo;
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-amber-900/30 text-xs text-amber-300/80 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  <span>Nghĩa chuẩn xác trong ngữ cảnh kinh điển Pāḷi.</span>
                </div>
              </div>
            )}
          </div>

          {/* BẢNG CHIA TỪ (DECLENSION PARADIGM TABLE) */}
          <div className="bg-stone-900/70 border border-stone-800 rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-semibold text-stone-200">
                  {isViToPali ? '3. Bảng chia từ: ' : '4. Bảng chia từ: '}
                  {data.tableData.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1.5 text-stone-400">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500/30 border border-amber-500/80"></span>
                  <span>Hình thái hiện tại</span>
                </span>
                <button
                  onClick={() => handleCopy(data.markdownTable, 'table')}
                  className="ml-3 flex items-center gap-1 text-stone-400 hover:text-amber-300 px-2.5 py-1 rounded bg-stone-800/80 hover:bg-stone-800 border border-stone-700/60 transition-colors"
                >
                  {copiedSection === 'table' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Đã chép bảng MD</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Chép bảng Markdown</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Interactive Declension Table with Vietnamese Case Column */}
            <div className="overflow-x-auto rounded-xl border border-stone-800 scrollbar-thin">
              <table className="w-full text-left text-sm border-collapse min-w-[620px]">
                <thead>
                  <tr className="bg-stone-950 text-stone-400 text-xs uppercase tracking-wider border-b border-stone-800">
                    <th className="py-3 px-3 sm:px-4 font-semibold text-stone-300 w-1/4">
                      Cách / Ngôi
                    </th>
                    <th className="py-3 px-3 sm:px-4 font-semibold text-amber-300 w-1/4">
                      Số ít (Ekavacana)
                    </th>
                    <th className="py-3 px-3 sm:px-4 font-semibold text-stone-400 w-1/4">
                      Nghĩa tiếng Việt (Số ít)
                    </th>
                    <th className="py-3 px-3 sm:px-4 font-semibold text-amber-300 w-1/4">
                      Số nhiều (Bahuvacana)
                    </th>
                    <th className="py-3 px-3 sm:px-4 font-semibold text-stone-400 w-1/4">
                      Nghĩa tiếng Việt (Số nhiều)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80 text-stone-300">
                  {data.tableData.rows.map((row, idx) => {
                    const isSgActive = row.isCurrentSingular;
                    const isPlActive = row.isCurrentPlural;
                    const formattedCase = formatCaseOrPerson(row.caseOrPerson);

                    return (
                      <tr
                        key={idx}
                        className={`transition-colors hover:bg-stone-800/40 ${
                          idx % 2 === 0 ? 'bg-stone-900/30' : 'bg-transparent'
                        }`}
                      >
                        <td className="py-2.5 px-3 sm:px-4 font-medium text-stone-200 text-xs sm:text-sm">
                          <span className="font-semibold text-stone-200">{formattedCase.vi}</span>
                          {formattedCase.pali && (
                            <span className="block text-[11px] text-stone-500 font-pali">
                              {formattedCase.pali}
                            </span>
                          )}
                        </td>

                        {/* Singular Form Cell */}
                        <td
                          className={`py-2.5 px-3 sm:px-4 font-pali text-sm sm:text-base font-medium transition-colors ${
                            isSgActive
                              ? 'bg-amber-500/25 text-amber-200 font-bold border-l-2 border-amber-500'
                              : 'text-amber-100/90'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{row.singularForm}</span>
                            {isSgActive && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 font-sans uppercase font-bold tracking-wider">
                                Hiện tại
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Singular Meaning */}
                        <td className="py-2.5 px-3 sm:px-4 text-xs sm:text-sm text-stone-400">
                          {row.singularMeaning}
                        </td>

                        {/* Plural Form Cell */}
                        <td
                          className={`py-2.5 px-3 sm:px-4 font-pali text-sm sm:text-base font-medium transition-colors ${
                            isPlActive
                              ? 'bg-amber-500/25 text-amber-200 font-bold border-l-2 border-amber-500'
                              : 'text-amber-100/90'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{row.pluralForm}</span>
                            {isPlActive && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 font-sans uppercase font-bold tracking-wider">
                                Hiện tại
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Plural Meaning */}
                        <td className="py-2.5 px-3 sm:px-4 text-xs sm:text-sm text-stone-400">
                          {row.pluralMeaning}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between p-3 bg-stone-900 rounded-lg border border-stone-800 text-xs text-stone-400">
            <span>Bản báo cáo gãy gọn (định dạng Markdown tiêu chuẩn).</span>
            <button
              onClick={() => handleCopy(fullTextToCopy, 'raw')}
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-medium"
            >
              {copiedSection === 'raw' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Đã sao chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép văn bản</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 sm:p-5 bg-stone-950 rounded-xl border border-stone-800/90 font-mono text-xs sm:text-sm text-stone-300 whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-amber-600/30">
            {fullTextToCopy}
          </pre>
        </div>
      )}
    </div>
  );
};
