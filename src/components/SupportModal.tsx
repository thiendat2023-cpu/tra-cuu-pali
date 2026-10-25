import React from 'react';
import { X, Heart, Sparkles } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Fallback direct Google Drive CDN stream if uc?export=view has rate limit
    const target = e.target as HTMLImageElement;
    if (!target.src.includes('googleusercontent.com')) {
      target.src = 'https://lh3.googleusercontent.com/d/14Aaf-RdwXNE34kGy6N07JDksLlYvdZB1';
    }
  };

  return (
    <div
      id="support-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      {/* Khung Modal Ủng Hộ (QR Ngân Hàng) */}
      <div className="bg-[#15171f] border border-amber-900/40 rounded-2xl w-[90%] md:w-[400px] max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 border-b border-stone-800 bg-stone-900/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <h3 className="font-semibold text-stone-100 text-sm sm:text-base tracking-wide">
              Ủng Hộ Duy Trì Dự Án
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          <div className="text-center space-y-2">
            <h4 className="font-pali text-base sm:text-lg font-bold text-amber-200">
              Gieo Duyên Pháp Thí – Phụng Sự Cộng Đồng
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              Mỗi sự đóng góp quý báu của bạn là <strong className="text-amber-300">hạt mầm Bố thí Pháp trực tiếp</strong>, giúp duy trì máy chủ và phát triển hệ sinh thái miễn phí:
            </p>
            <div className="bg-stone-900/80 p-2.5 rounded-lg border border-amber-500/20 text-left space-y-1 text-[11px] sm:text-xs font-sans text-stone-300">
              <p>• <strong className="text-emerald-400">Đã hoàn thành:</strong> Từ điển Pāḷi • Anh văn Phật pháp</p>
              <p>• <strong className="text-amber-400">Đang xây dựng:</strong> Bách khoa Phật giáo • Dinh dưỡng Thuần chay</p>
            </div>
          </div>

          {/* Khu vực Ủng hộ (Donation) */}
          <div className="pt-3 border-t border-stone-800/80 space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ủng hộ (Donation)</span>
            </div>

            {/* Mã QR ngân hàng căn giữa, max-w-[180px], rounded-md, shadow-sm */}
            <div className="flex justify-center">
              <div className="p-2 bg-white rounded-md shadow-sm border border-stone-700/50 flex items-center justify-center">
                <img
                  src="https://drive.google.com/uc?export=view&id=14Aaf-RdwXNE34kGy6N07JDksLlYvdZB1"
                  alt="Mã QR ủng hộ ngân hàng"
                  onError={handleImageError}
                  className="max-w-[180px] w-full h-auto rounded-md object-contain"
                />
              </div>
            </div>

            {/* Dòng chữ nhỏ dưới mã QR */}
            <p className="text-xs text-stone-400 text-center italic leading-normal">
              "Pháp thí thắng mọi thí" — Tri ân bạn đã đồng hành lan tỏa tri thức.
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
