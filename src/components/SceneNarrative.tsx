import React from 'react';

interface SceneNarrativeProps {
  currentScene: number;
}

export const SceneNarrative: React.FC<SceneNarrativeProps> = ({ currentScene }) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-end items-center select-none">
      {/* Soft gradient only under text — never covers the 3D center */}
      <div className="absolute inset-x-0 bottom-0 h-48 sm:h-56 narrative-soft-backdrop" />

      <div className="relative max-w-4xl mx-auto text-center px-5 pb-20 sm:pb-24 space-y-2.5">
        {/* SCENE 01: MYSTERIOUS OPENING */}
        {currentScene === 1 && (
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif-display font-semibold text-white text-glow-pink tracking-tight leading-[1.15]">
              Có một điều thật đặc biệt…
            </h2>
            <p className="text-base sm:text-xl md:text-2xl font-serif-display italic text-pink-100 text-glow-white font-light">
              Dành tặng những bông hoa rực rỡ nhất của lớp 12A1
            </p>
          </div>
        )}

        {/* SCENE 02: THE BLOOMING PINK UNIVERSE */}
        {currentScene === 2 && (
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif-display font-semibold text-white text-glow-pink tracking-tight leading-[1.15]">
              Chúc mừng ngày Phụ nữ Việt Nam 20/10
            </h2>
            <p className="text-lg sm:text-2xl md:text-3xl font-serif-display italic text-pink-100 text-glow-white">
              Gửi những bông hoa rực rỡ nhất của lớp 12A1
            </p>
          </div>
        )}

        {/* SCENE 03: 3D MEMORY GALAXY */}
        {currentScene === 3 && (
          <div className="space-y-2.5 animate-fade-in">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif-display font-semibold text-white text-glow-pink">
              Dải Ngân Hà Kỷ Niệm 12A1
            </h2>
            <p className="text-sm sm:text-lg md:text-xl font-serif-display italic text-pink-100 text-glow-white">
              Từng nụ cười, từng khoảnh khắc thanh xuân chúng mình bên nhau
            </p>
          </div>
        )}

        {/* SCENE 04: FLOWER EXPLOSION */}
        {currentScene === 4 && (
          <div className="space-y-2.5 animate-fade-in">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif-display font-semibold text-white text-glow-pink">
              Bung Nở Yêu Thương
            </h2>
            <p className="text-sm sm:text-lg md:text-xl font-serif-display italic text-pink-100 text-glow-white">
              Ấn vào quả cầu để bung nở ngàn đóa hoa và trái tim
            </p>
          </div>
        )}

        {/* SCENE 05: LETTER */}
        {currentScene === 5 && (
          <div className="space-y-2.5 animate-fade-in">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif-display font-semibold text-white text-glow-pink">
              Lá Thư Gửi 12A1
            </h2>
            <p className="text-sm sm:text-lg md:text-xl font-serif-display italic text-pink-100 text-glow-white">
              Những tâm tình ấm áp được nắn nót từ trái tim
            </p>
          </div>
        )}

        {/* SCENE 06: GRAND FINALE */}
        {currentScene === 6 && (
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif-display font-semibold text-white text-glow-pink tracking-tight leading-[1.15]">
              20/10 — Mãi rực rỡ nhé, những bông hoa của 12A1!
            </h2>
            <p className="text-base sm:text-xl md:text-2xl font-serif-display italic text-pink-100 text-glow-white">
              Thanh xuân có thể đi qua, nhưng những kỷ niệm đẹp sẽ luôn ở lại.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
