import React, { useState } from 'react';
import { PALI_DIACRITICS } from '../data/paliGrammarRef.ts';
import { ArrowUp, Keyboard } from 'lucide-react';

interface DiacriticsBarProps {
  onInsertChar: (char: string) => void;
}

export const DiacriticsBar: React.FC<DiacriticsBarProps> = ({ onInsertChar }) => {
  const [uppercase, setUppercase] = useState(false);

  return (
    <div className="flex items-center gap-1.5 py-1.5 px-2 bg-stone-900/80 border border-stone-800/80 rounded-xl text-xs backdrop-blur-sm overflow-x-auto whitespace-nowrap scrollbar-none">
      <div className="flex items-center gap-1 text-stone-400 mr-1 select-none shrink-0">
        <Keyboard className="w-3.5 h-3.5 text-amber-500/80" />
        <span className="hidden sm:inline font-medium text-[11px] uppercase tracking-wider text-stone-400">
          Ký tự Pāḷi:
        </span>
      </div>

      <button
        type="button"
        onClick={() => setUppercase(!uppercase)}
        title={uppercase ? 'Chuyển sang chữ thường' : 'Chuyển sang chữ in hoa (Shift)'}
        className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-0.5 shrink-0 ${
          uppercase
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-700/60'
        }`}
      >
        <ArrowUp className="w-3 h-3" />
        <span>Caps</span>
      </button>

      <div className="flex items-center gap-1 shrink-0">
        {PALI_DIACRITICS.map((item) => {
          const char = uppercase ? item.char.toUpperCase() : item.char;
          return (
            <button
              key={item.char}
              type="button"
              onClick={() => onInsertChar(char)}
              title={`${char} (${item.label})`}
              className="w-7 h-7 flex items-center justify-center font-pali text-sm font-semibold rounded bg-stone-800/90 hover:bg-amber-600/30 hover:text-amber-200 hover:border-amber-500/50 text-stone-200 border border-stone-700/50 transition-all active:scale-95 shadow-sm shrink-0"
            >
              {char}
            </button>
          );
        })}
      </div>

      <span className="ml-auto text-[10px] text-stone-500 hidden md:inline shrink-0 pl-2">
        Nhấp để chèn ký tự đặc biệt
      </span>
    </div>
  );
};
