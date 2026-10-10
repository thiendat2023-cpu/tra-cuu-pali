import React from 'react';
import { X, Heart, Sparkles } from 'lucide-react';

interface AuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthorModal: React.FC<AuthorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Fallback direct Google Drive CDN stream if uc?export=view has rate limit
    const target = e.target as HTMLImageElement;
    if (!target.src.includes('googleusercontent.com')) {
      target.src = 'https://lh3.googleusercontent.com/d/14Aaf-RdwXNE34kGy6N07JDksLlYvdZB1';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      {/* Khung Modal tự động co giãn: w-[90%] md:w-[400px], luôn ở trung tâm, không tràn mép màn hình */}
      <div className="bg-[#15171f] border border-amber-900/40 rounded-2xl w-[90%] md:w-[400px] max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 border-b border-stone-800 bg-stone-900/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <h3 className="font-semibold text-stone-100 text-sm sm:text-base tracking-wide">
              Tác giả & Ủng hộ
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content with smooth vertical scroll if screen height is small */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          <div className="text-center space-y-1">
            <h4 className="font-pali text-lg sm:text-xl font-bold text-amber-200">
              Thầy Đạt cute ^v^
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Dự án TRA CỨU PALI được phát triển với tâm nguyện phụng sự việc học tập và nghiên cứu ngữ pháp Pāḷi Phật giáo Theravāda.
            </p>
          </div>

          {/* Khu vực Ủng hộ (Donation) */}
          <div className="pt-3 border-t border-stone-800/80 space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ủng hộ (Donation)</span>
            </div>

            {/* Mã QR căn giữa, max-w-[180px], rounded-md, shadow-sm */}
            <div className="flex justify-center">
              <div className="p-2 bg-white rounded-md shadow-sm border border-stone-700/50 flex items-center justify-center">
                <img
                  src="https://drive.google.com/uc?export=view&id=14Aaf-RdwXNE34kGy6N07JDksLlYvdZB1"
                  alt="Mã QR ủng hộ tác giả"
                  onError={handleImageError}
                  className="max-w-[180px] w-full h-auto rounded-md object-contain"
                />
              </div>
            </div>

            {/* Dòng chữ nhỏ (text-sm), màu xám nhẹ, căn giữa */}
            <p className="text-sm text-stone-400 text-center leading-normal">
              Tuỳ hỷ ủng hộ tác giả duy trì dự án
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-stone-900/60 border-t border-stone-800 flex justify-center shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
