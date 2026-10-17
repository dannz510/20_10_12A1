import React, { useEffect, useRef, useState } from 'react';
import { Disc3, Volume2, VolumeX, Play, Pause, Upload, RotateCcw } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface AudioPlayerDockProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioPlayerDock: React.FC<AudioPlayerDockProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(soundEngine.isPlaying);
  const [volume, setVolume] = useState(soundEngine.volume);
  const [isMuted, setIsMuted] = useState(soundEngine.isMuted);
  const [trackTitle, setTrackTitle] = useState(soundEngine.trackTitle);
  const [visualizerBars, setVisualizerBars] = useState<number[]>([20, 40, 60, 30, 80, 50, 70, 45]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = soundEngine.subscribe(() => {
      setIsPlaying(soundEngine.isPlaying);
      setVolume(soundEngine.volume);
      setIsMuted(soundEngine.isMuted);
      setTrackTitle(soundEngine.trackTitle);
    });

    const animTimer = setInterval(() => {
      if (soundEngine.isPlaying) {
        const metrics = soundEngine.getAudioMetrics();
        setVisualizerBars([
          Math.max(15, Math.min(95, metrics.bass * 100 * (0.8 + Math.random() * 0.4))),
          Math.max(20, Math.min(90, metrics.mid * 110 * (0.7 + Math.random() * 0.5))),
          Math.max(25, Math.min(100, metrics.energy * 120)),
          Math.max(15, Math.min(85, metrics.treble * 90)),
          Math.max(20, Math.min(95, metrics.mid * 95)),
          Math.max(25, Math.min(90, metrics.energy * 110)),
          Math.max(15, Math.min(80, metrics.bass * 85)),
          Math.max(10, Math.min(75, metrics.treble * 95)),
        ]);
      }
    }, 80);

    return () => {
      unsubscribe();
      clearInterval(animTimer);
    };
  }, []);

  const handleTogglePlay = () => {
    soundEngine.togglePlay();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundEngine.setVolume(val);
  };

  const handleToggleMute = () => {
    soundEngine.toggleMute();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ok = await soundEngine.loadCustomAudioFile(file);
      if (!ok) {
        alert('Không thể phát file nhạc này. Vui lòng thử file định dạng MP3 hoặc WAV khác.');
      }
    }
  };

  const handleResetMusic = () => {
    soundEngine.resetToDefaultMusic();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-6 z-40 w-80 sm:w-96 bg-black/85 border border-pink-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-white animate-fade-in control-dock">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-pink-500/20">
        <div className="flex items-center gap-2">
          <Disc3 className={`w-5 h-5 text-pink-400 ${isPlaying ? 'animate-spin-slow' : ''}`} />
          <span className="text-xs font-semibold tracking-wider text-pink-300 uppercase">
            Hộp Âm Nhạc 12A1
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          Đóng
        </button>
      </div>

      {/* Vinyl Record & Track Info */}
      <div className="py-4 flex items-center gap-4">
        {/* Animated Vinyl Disc */}
        <div className="relative w-20 h-20 shrink-0">
          <div
            className={`w-full h-full rounded-full bg-gradient-to-tr from-stone-950 via-stone-900 to-stone-950 border-2 border-stone-800 shadow-lg flex items-center justify-center ${
              isPlaying ? 'animate-spin-slow' : 'animate-spin-paused'
            }`}
          >
            {/* Vinyl grooves */}
            <div className="w-14 h-14 rounded-full border border-pink-500/20 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 border border-pink-300 flex items-center justify-center shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Track Title & Equalizer */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-pink-200 truncate" title={trackTitle}>
            {trackTitle}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isPlaying ? 'Đang phát lãng mạn' : 'Đang tạm dừng'}
          </p>

          {/* Equalizer Bars */}
          <div className="flex items-end gap-1 h-5 mt-2">
            {visualizerBars.map((h, i) => (
              <span
                key={i}
                className="w-1.5 bg-gradient-to-t from-pink-500 to-rose-300 rounded-full transition-all duration-75"
                style={{ height: isPlaying ? `${h}%` : '20%' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-pink-500/15">
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
            title={isPlaying ? 'Tạm dừng' : 'Phát nhạc'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={handleToggleMute}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 accent-pink-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            title="Âm lượng"
          />
        </div>

        {/* Upload Custom Music */}
        <div className="flex items-center gap-1.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 text-[11px] font-medium bg-pink-950/80 border border-pink-500/40 hover:bg-pink-900 text-pink-200 rounded-lg flex items-center gap-1 transition-colors"
            title="Tải bài hát riêng của lớp từ máy"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Tải nhạc</span>
          </button>

          <button
            onClick={handleResetMusic}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Trở về nhạc mặc định"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
