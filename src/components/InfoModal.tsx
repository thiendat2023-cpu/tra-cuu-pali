import React, { useState } from 'react';
import { X, Info } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const [avatarError, setAvatarError] = useState(false);
  const [qrError, setQrError] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      id="info-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      {/* Khung Modal Thông Tin (Hình của Thầy & Zalo) */}
      <div className="bg-[#15171f] border border-amber-500/40 rounded-3xl w-[90%] sm:w-[420px] max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-stone-800 bg-stone-900/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-amber-500">
            <Info className="w-4 h-4 text-amber-500" />
            <h3 className="font-semibold text-amber-500 text-sm sm:text-base tracking-wide">
              Thông Tin
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition-colors"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {/* 1. Khung Hình Ảnh (Top): portrait, rounded-3xl, border-2 border-amber-500 */}
          <div className="w-full max-w-[240px] aspect-[3/4] mx-auto rounded-3xl border-2 border-amber-500 overflow-hidden shadow-lg bg-stone-900 flex items-center justify-center relative">
            {!avatarError ? (
              <img
                src="/avatar.jpg"
                alt="Hình của Thầy"
                onError={() => setAvatarError(true)}
                className="w-full h-full object-cover rounded-3xl"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-stone-900 text-amber-500 text-center font-bold tracking-wider text-base sm:text-lg">
                HÌNH CỦA THẦY
              </div>
            )}
          </div>

          {/* 2. Phần Định danh (Middle) */}
          <div className="text-center mt-5">
            {/* Dòng 1: "Sadi" (vừa) và "Thích Ngộ Pháp Đạt" (lớn hơn, in đậm font-bold) */}
            <div className="text-amber-500 flex items-baseline justify-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-medium">Sadi</span>
              <span className="text-xl sm:text-2xl font-bold font-pali tracking-wide">
                Thích Ngộ Pháp Đạt
              </span>
            </div>

            {/* Dòng 2: "Học viên PHTX Khoá XI", căn giữa, mt-2 */}
            <p className="text-amber-500 text-sm sm:text-base font-medium mt-2">
              Học viên PHTX Khoá XI
            </p>
          </div>

          {/* 3. Phần Liên hệ & Mã QR (Bottom Flexbox) */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-stone-800/80 gap-3">
            {/* Khối bên trái (Thông tin): 2 dòng căn trái, màu vàng cam */}
            <div className="text-left text-amber-500 space-y-1.5 text-xs sm:text-sm font-medium">
              <div>Zalo: 0933.459.385</div>
              <div>Email: thiendat2023@gmail.com</div>
            </div>

            {/* Khối bên phải (Mã QR): ô vuông nhỏ bo góc rounded-lg, border border-amber-500 */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-amber-500 p-1 flex items-center justify-center bg-stone-900 shrink-0 overflow-hidden shadow-sm">
              {!qrError ? (
                <img
                  src="/qr-zalo.jpg"
                  alt="Mã QR Zalo"
                  onError={() => setQrError(true)}
                  className="w-full h-full object-contain rounded-md"
                />
              ) : (
                <span className="text-[11px] sm:text-xs text-amber-500 text-center font-medium leading-tight">
                  Mã QR Zalo
                </span>
              )}
            </div>
          </div>

          {/* 4. Nút Đóng (Footer): bg-gray-800, chữ sáng, rounded-md, hover mượt mà */}
          <div className="mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-100 font-medium text-sm sm:text-base rounded-md transition-colors shadow-sm focus:outline-none"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
