import React, { useState, useEffect } from 'react';
import { X, Heart, Sparkles, ArrowRight, Eye } from 'lucide-react';

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToFinale: () => void;
}

const LETTER_PARAGRAPHS = [
  'Gửi những cô gái tuyệt vời của 12A1,',
  'Nhân ngày Phụ nữ Việt Nam 20/10, chúc các bạn luôn rạng rỡ theo cách riêng của mình, luôn tự tin, mạnh mẽ và giữ trong tim những điều dịu dàng nhất.',
  'Mong rằng mỗi ngày đến lớp đều có thật nhiều tiếng cười, mỗi bài kiểm tra đều đạt kết quả như ý, và mỗi ước mơ của tuổi 18 đều có cơ hội trở thành hiện thực.',
  'Những năm tháng cuối cấp này có thể nhiều áp lực và bận rộn, nhưng cảm ơn các bạn vì đã luôn mang lại nguồn năng lượng tích cực, sự ấm áp và làm cho 12A1 trở thành một phần thanh xuân rực rỡ nhất.',
  'Chúc các bạn một ngày 20/10 thật hạnh phúc, luôn được nâng niu, trân trọng và tự do toả sáng như những bông hoa đẹp nhất!',
  'Thân gửi,\nTập thể các bạn nam lớp 12A1.',
];

export const LetterModal: React.FC<LetterModalProps> = ({ isOpen, onClose, onGoToFinale }) => {
  const [revealedIndex, setRevealedIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setRevealedIndex(0);
      return;
    }

    // Progressively reveal paragraphs
    const timer = setInterval(() => {
      setRevealedIndex((prev) => {
        if (prev < LETTER_PARAGRAPHS.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 700);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleRevealAll = () => {
    setRevealedIndex(LETTER_PARAGRAPHS.length);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in interactive-modal">
      <div className="relative w-full max-w-2xl bg-[#fffdfa] text-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-[#fce7f3] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Subtle lined notebook background pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: 'repeating-linear-gradient(#fffdfa 0px, #fffdfa 27px, #fbcfe8 28px)',
          }}
        />

        {/* Top Header Stamp */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-pink-200/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-rose-800 uppercase">
              Thư Gửi 12A1 · 20/10/2026
            </span>
          </div>

          <div className="flex items-center gap-2">
            {revealedIndex < LETTER_PARAGRAPHS.length && (
              <button
                onClick={handleRevealAll}
                className="px-3 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg flex items-center gap-1 transition-colors"
                title="Hiện toàn bộ bức thư ngay"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem tất cả</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-800 rounded-full hover:bg-rose-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Letter Body */}
        <div className="relative z-10 py-6 overflow-y-auto space-y-4 font-serif text-stone-800 text-sm sm:text-base leading-relaxed pr-2">
          {LETTER_PARAGRAPHS.slice(0, revealedIndex).map((paragraph, idx) => (
            <p
              key={idx}
              className={`transition-all duration-500 animate-fade-in ${
                idx === 0
                  ? 'text-lg sm:text-xl font-bold text-rose-700 font-handwritten'
                  : idx === LETTER_PARAGRAPHS.length - 1
                  ? 'text-right font-handwritten text-lg font-semibold text-rose-800 pt-3 whitespace-pre-line'
                  : 'text-stone-700'
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="relative z-10 pt-4 border-t border-pink-200/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Thanh xuân năm ấy có các bạn là điều tuyệt vời nhất!</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onGoToFinale();
            }}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-rose-400/30 transition-transform active:scale-95"
          >
            <span>Đến Trái Tim Ánh Sáng</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
