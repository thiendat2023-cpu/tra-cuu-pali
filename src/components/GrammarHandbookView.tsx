import React, { useState } from 'react';
import { VIBHATTI_CASES, VERB_PURISA_LIST } from '../data/paliGrammarRef.ts';
import { BookMarked, Layers, Code, Award, Sparkles } from 'lucide-react';

export const GrammarHandbookView: React.FC = () => {
  const [section, setSection] = useState<'nouns' | 'verbs' | 'abbreviations' | 'alphabet'>('nouns');

  return (
    <div className="space-y-6">
      {/* Handbook Top Switcher */}
      <div className="bg-[#15171e] border border-amber-900/30 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-lg sm:text-xl text-amber-200 tracking-wider">
              SỔ TAY NGỮ PHÁP PĀḶI CĂN BẢN
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Tổng hợp toàn bộ 8 Biến cách (Danh từ), 3 Ngôi & Thì (Động từ) và Hệ thống ký hiệu cú pháp viết tắt chuẩn
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-900 rounded-xl border border-stone-800 text-xs overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setSection('nouns')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
              section === 'nouns'
                ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            1. Biến Cách Danh Từ (8 Cách)
          </button>
          <button
            onClick={() => setSection('verbs')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
              section === 'verbs'
                ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            2. Chia Ngôi Động Từ
          </button>
          <button
            onClick={() => setSection('abbreviations')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
              section === 'abbreviations'
                ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            3. Ký Hiệu Viết Tắt Cú Pháp
          </button>
          <button
            onClick={() => setSection('alphabet')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
              section === 'alphabet'
                ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            4. Mẫu Tự (Akkhara)
          </button>
        </div>
      </div>

      {/* SECTION 1: NOUNS (Aṭṭha Vibhatti) */}
      {section === 'nouns' && (
        <div className="space-y-6">
          {/* Card summary of 8 cases */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {VIBHATTI_CASES.map((item) => (
              <div
                key={item.number}
                className="p-4 bg-stone-900/60 rounded-xl border border-stone-800 hover:border-amber-700/40 transition-colors"
              >
                <div className="flex items-center justify-between pb-2 border-b border-stone-800/80">
                  <div>
                    <span className="text-amber-400 font-semibold text-sm">
                      Cách {item.number}: {item.vietnameseName}
                    </span>
                    <h4 className="text-xs font-pali text-stone-300 font-medium mt-0.5">
                      {item.paliName} ({item.englishName})
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                    Cách {item.number}
                  </span>
                </div>

                <div className="mt-2.5 space-y-1.5 text-xs">
                  <div className="flex items-start gap-1">
                    <span className="text-stone-400 font-medium">Trợ từ dịch tiếng Việt:</span>
                    <span className="text-amber-300 font-semibold">{item.vietnameseParticle}</span>
                  </div>
                  <div className="text-stone-400 leading-relaxed">
                    {item.description}
                  </div>
                  <div className="pt-2 border-t border-stone-800/50 flex flex-wrap gap-2 text-[11px]">
                    <span className="text-stone-400">
                      Mẫu đuôi -a Nam tính: Số ít <code className="font-pali text-amber-200 font-semibold">{item.masculineAEndingSg}</code>
                    </span>
                    <span className="text-stone-500">·</span>
                    <span className="text-stone-400">
                      Số nhiều <code className="font-pali text-amber-200 font-semibold">{item.masculineAEndingPl}</code>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Complete Paradigm Table for -a Masculine (e.g., Buddha) */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 sm:p-5">
            <h4 className="font-semibold text-amber-300 text-sm mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Bảng chia mẫu chuẩn: Danh từ Nam tính tận cùng -a (Buddha - Đức Phật)</span>
            </h4>
            <div className="overflow-x-auto rounded-xl border border-stone-800 scrollbar-thin">
              <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[580px]">
                <thead>
                  <tr className="bg-stone-950 text-stone-400 uppercase text-[11px] border-b border-stone-800">
                    <th className="py-2.5 px-3 font-semibold text-stone-300">Cách (Vibhatti)</th>
                    <th className="py-2.5 px-3 font-semibold text-amber-300">Số ít (Ekavacana)</th>
                    <th className="py-2.5 px-3 font-semibold text-stone-400">Nghĩa tiếng Việt (Số ít)</th>
                    <th className="py-2.5 px-3 font-semibold text-amber-300">Số nhiều (Bahuvacana)</th>
                    <th className="py-2.5 px-3 font-semibold text-stone-400">Nghĩa tiếng Việt (Số nhiều)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/70 font-pali">
                  <tr><td className="py-2 px-3 font-sans font-medium text-stone-300">1. Chủ cách (Paṭhamā)</td><td className="py-2 px-3 text-amber-200 font-semibold">buddho</td><td className="py-2 px-3 text-stone-400 font-sans">Đức Phật (chủ từ)</td><td className="py-2 px-3 text-amber-200 font-semibold">buddhā</td><td className="py-2 px-3 text-stone-400 font-sans">các Đức Phật (chủ từ)</td></tr>
                  <tr><td className="py-2 px-3 font-sans font-medium text-stone-300">2. Đối cách (Dutiyā)</td><td className="py-2 px-3 text-amber-200 font-semibold">buddhaṃ</td><td className="py-2 px-3 text-stone-400 font-sans">đến Đức Phật</td><td className="py-2 px-3 text-amber-200 font-semibold">buddhe</td><td className="py-2 px-3 text-stone-400 font-sans">đến các Đức Phật</td></tr>
                  <tr><td className="py-2 px-3 font-sans font-medium text-stone-300">3. Sử dụng cách (Tatiyā)</td><td className="py-2 px-3 text-amber-200 font-semibold">buddhena</td><td className="py-2 px-3 text-stone-400 font-sans">bằng / nhờ Đức Phật</td><td className="py-2 px-3 text-amber-200 font-semibold">buddhehi / buddhebhi</td><td className="py-2 px-3 text-stone-400 font-sans">bằng các Đức Phật</td></tr>
                  <tr><td className="py-2 px-3 font-sans font-medium text-stone-300">4. Chỉ định cách (Catutthī)</td><td className="py-2 px-3 text-amber-200 font-semibold">buddhassa / buddhāya</td><td className="py-2 px-3 text-stone-400 font-sans">cho / đến Đức Phật</td><td className="py-2 px-3 text-amber-200 font-semibold">buddhānaṃ</td><td className="py-2 px-3 text-stone-400 font-sans">cho các Đức Phật</td></tr>
                  <tr><td className="py-2 px-3 font-sans font-medium text-stone-300">5. Xuất xứ cách (Pañcamī)</td><td className="py-2 px-3 text-amber-200 font-semibold">buddhā / buddhasmā / buddhamhā</td><td className="py-2 px-3 text-stone-400 font-sans">từ / do Đức Phật</td><td className="py-2 px-3 text-amber-200 font-semibold">buddhehi / buddhebhi</td><td className="py-2 px-3 text-stone-400 font-sans">từ các Đức Phật</td></tr>
                  <tr><td className="py-2 px-3 font-sans font-medium text-stone-300">6. Sở thuộc cách (Chaṭṭhī)</td><td className="py-2 px-3 text-amber-200 font-semibold">buddhassa</td><td className="py-2 px-3 text-stone-400 font-sans">của Đức Phật</td><td className="py-2 px-3 text-amber-200 font-semibold">buddhānaṃ</td><td className="py-2 px-3 text-stone-400 font-sans">của các Đức Phật</td></tr>
                  <tr><td className="py-2 px-3 font-sans font-medium text-stone-300">7. Định vị cách (Sattamī)</td><td className="py-2 px-3 text-amber-200 font-semibold">buddhe / buddhasmiṃ / buddhamhi</td><td className="py-2 px-3 text-stone-400 font-sans">nơi / ở Đức Phật</td><td className="py-2 px-3 text-amber-200 font-semibold">buddhesu</td><td className="py-2 px-3 text-stone-400 font-sans">nơi các Đức Phật</td></tr>
                  <tr><td className="py-2 px-3 font-sans font-medium text-stone-300">8. Hô cách (Ālapana)</td><td className="py-2 px-3 text-amber-200 font-semibold">buddha / buddhā</td><td className="py-2 px-3 text-stone-400 font-sans">Này Đức Phật!</td><td className="py-2 px-3 text-amber-200 font-semibold">buddhā</td><td className="py-2 px-3 text-stone-400 font-sans">Này các Đức Phật!</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: VERBS (Purisa & Kāla) */}
      {section === 'verbs' && (
        <div className="space-y-6">
          <div className="space-y-3">
            {VERB_PURISA_LIST.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-stone-900/60 rounded-xl border border-stone-800"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-amber-300 text-sm">
                    {item.vietnameseName} ({item.paliName})
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

          {/* Present Tense Vattamānā paradigm */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 sm:p-5">
            <h4 className="font-semibold text-amber-300 text-sm mb-3">
              Bảng chia mẫu thì Hiện tại (Vattamānā) - Động từ √gam ➔ gaccha (đi)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-stone-800 scrollbar-thin">
              <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[540px]">
                <thead>
                  <tr className="bg-stone-950 text-stone-400 uppercase text-[11px] border-b border-stone-800">
                    <th className="py-2.5 px-3 font-semibold text-stone-300">Ngôi (Purisa)</th>
                    <th className="py-2.5 px-3 font-semibold text-amber-300">Số ít (Ekavacana)</th>
                    <th className="py-2.5 px-3 font-semibold text-stone-400">Nghĩa tiếng Việt</th>
                    <th className="py-2.5 px-3 font-semibold text-amber-300">Số nhiều (Bahuvacana)</th>
                    <th className="py-2.5 px-3 font-semibold text-stone-400">Nghĩa tiếng Việt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/70 font-pali">
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-medium text-stone-300">1. Ngôi 3 (Paṭhama)</td>
                    <td className="py-2.5 px-3 text-amber-200 font-semibold">gacchati (-ti)</td>
                    <td className="py-2.5 px-3 text-stone-400 font-sans">vị ấy đi</td>
                    <td className="py-2.5 px-3 text-amber-200 font-semibold">gacchanti (-nti)</td>
                    <td className="py-2.5 px-3 text-stone-400 font-sans">các vị ấy đi</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-medium text-stone-300">2. Ngôi 2 (Majjhima)</td>
                    <td className="py-2.5 px-3 text-amber-200 font-semibold">gacchasi (-si)</td>
                    <td className="py-2.5 px-3 text-stone-400 font-sans">bạn đi</td>
                    <td className="py-2.5 px-3 text-amber-200 font-semibold">gacchatha (-tha)</td>
                    <td className="py-2.5 px-3 text-stone-400 font-sans">các bạn đi</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-medium text-stone-300">3. Ngôi 1 (Uttama)</td>
                    <td className="py-2.5 px-3 text-amber-200 font-semibold">gacchāmi (-mi)</td>
                    <td className="py-2.5 px-3 text-stone-400 font-sans">tôi đi</td>
                    <td className="py-2.5 px-3 text-amber-200 font-semibold">gacchāma (-ma)</td>
                    <td className="py-2.5 px-3 text-stone-400 font-sans">chúng tôi đi</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: ABBREVIATIONS CHEATSHEET */}
      {section === 'abbreviations' && (
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="border-b border-stone-800 pb-3">
            <h4 className="font-semibold text-amber-300 text-sm flex items-center gap-2">
              <Code className="w-4 h-4 text-amber-400" />
              <span>Bảng giải mã các ký hiệu viết tắt ngữ pháp Pāḷi (Dùng trong Tab 3 & Tab 4)</span>
            </h4>
            <p className="text-xs text-stone-400 mt-1">
              Ví dụ: <code className="font-mono text-amber-300">(m/a, c2, si)</code> ➔ Danh từ nam tánh / vĩ ngữ &ldquo;a&rdquo;, cách 2 (Đối cách), số ít.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Giống (Gender) */}
            <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 space-y-1.5">
              <span className="font-bold text-amber-400 block uppercase">1. Giống (Gender / Liṅga)</span>
              <div><code className="text-amber-300 font-mono">m</code> : Nam tánh (Pulliṅga)</div>
              <div><code className="text-amber-300 font-mono">f</code> : Nữ tánh (Itthiliṅga)</div>
              <div><code className="text-amber-300 font-mono">nt</code> : Trung tánh (Napuṃsakaliṅga)</div>
            </div>

            {/* Vĩ ngữ (Endings) */}
            <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 space-y-1.5">
              <span className="font-bold text-amber-400 block uppercase">2. Vĩ ngữ nguyên âm</span>
              <div><code className="text-amber-300 font-mono">/a, /ā, /i, /ī, /u, /ū</code> : Vĩ ngữ tận cùng của từ gốc (base stem)</div>
              <div>Ví dụ: <code className="text-stone-300 font-mono">m/a</code> là danh từ nam tánh vĩ ngữ a (như <em>dhamma</em>).</div>
            </div>

            {/* 8 Cách (Cases) */}
            <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 space-y-1.5">
              <span className="font-bold text-amber-400 block uppercase">3. Biến cách (Cases / Vibhatti)</span>
              <div><code className="text-amber-300 font-mono">c1</code> : Cách 1 - Chủ cách (Paṭhamā)</div>
              <div><code className="text-amber-300 font-mono">c2</code> : Cách 2 - Đối cách (Dutiyā)</div>
              <div><code className="text-amber-300 font-mono">c3</code> : Cách 3 - Sử dụng cách (Tatiyā)</div>
              <div><code className="text-amber-300 font-mono">c4</code> : Cách 4 - Chỉ định cách (Catutthī)</div>
              <div><code className="text-amber-300 font-mono">c5</code> : Cách 5 - Xuất xứ cách (Pañcamī)</div>
              <div><code className="text-amber-300 font-mono">c6</code> : Cách 6 - Sở thuộc cách (Chaṭṭhī)</div>
              <div><code className="text-amber-300 font-mono">c7</code> : Cách 7 - Định vị cách (Sattamī)</div>
              <div><code className="text-amber-300 font-mono">c8</code> : Cách 8 - Hô cách (Ālapana)</div>
            </div>

            {/* Số & Động từ */}
            <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 space-y-1.5">
              <span className="font-bold text-amber-400 block uppercase">4. Số & Động từ (Number & Verbs)</span>
              <div><code className="text-amber-300 font-mono">si</code> : Số ít (Ekavacana)</div>
              <div><code className="text-amber-300 font-mono">pl</code> : Số nhiều (Bahuvacana)</div>
              <div><code className="text-amber-300 font-mono">v</code> : Động từ (Kriyāpada)</div>
              <div><code className="text-amber-300 font-mono">pres</code> : Thì hiện tại (Vattamānā)</div>
              <div><code className="text-amber-300 font-mono">past / aor</code> : Thì quá khứ (Ajjatanī)</div>
              <div><code className="text-amber-300 font-mono">p1, p2, p3</code> : Ngôi 1, Ngôi 2, Ngôi 3</div>
              <div><code className="text-amber-300 font-mono">SOV</code> : Thứ tự cú pháp Pāḷi: Subject (Chủ) - Object (Bổ) - Verb (Vị)</div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: ALPHABET */}
      {section === 'alphabet' && (
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 sm:p-5 space-y-4">
          <div>
            <h4 className="font-semibold text-amber-300 text-sm mb-2">8 Nguyên âm Pāḷi (Sara):</h4>
            <div className="flex flex-wrap gap-2 text-sm font-pali">
              <span className="px-3 py-1.5 bg-stone-950 rounded-lg border border-stone-800 text-amber-200">a, ā</span>
              <span className="px-3 py-1.5 bg-stone-950 rounded-lg border border-stone-800 text-amber-200">i, ī</span>
              <span className="px-3 py-1.5 bg-stone-950 rounded-lg border border-stone-800 text-amber-200">u, ū</span>
              <span className="px-3 py-1.5 bg-stone-950 rounded-lg border border-stone-800 text-amber-200">e, o</span>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-800">
            <h4 className="font-semibold text-amber-300 text-sm mb-2">33 Phụ âm Pāḷi (Vyañjana):</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800">
                <span className="text-stone-400 font-medium block">1. Nhóm Họng (Kaṇṭhaja):</span>
                <span className="font-pali text-amber-200 text-sm mt-1 block">ka, kha, ga, gha, ṅa</span>
              </div>
              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800">
                <span className="text-stone-400 font-medium block">2. Nhóm Vòm họng (Tāluja):</span>
                <span className="font-pali text-amber-200 text-sm mt-1 block">ca, cha, ja, jha, ña</span>
              </div>
              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800">
                <span className="text-stone-400 font-medium block">3. Nhóm Quặt lưỡi (Muddhaja):</span>
                <span className="font-pali text-amber-200 text-sm mt-1 block">ṭa, ṭha, ḍa, ḍha, ṇa</span>
              </div>
              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800">
                <span className="text-stone-400 font-medium block">4. Nhóm Răng (Dantaja):</span>
                <span className="font-pali text-amber-200 text-sm mt-1 block">ta, tha, da, dha, na</span>
              </div>
              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800">
                <span className="text-stone-400 font-medium block">5. Nhóm Môi (Oṭṭhaja):</span>
                <span className="font-pali text-amber-200 text-sm mt-1 block">pa, pha, ba, bha, ma</span>
              </div>
              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800">
                <span className="text-stone-400 font-medium block">Bất định âm (Avagga) & Niggahīta:</span>
                <span className="font-pali text-amber-300 text-sm mt-1 block">ya, ra, la, va, sa, ha, ḷa, ṃ</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
