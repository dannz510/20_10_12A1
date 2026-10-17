import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Plus, Upload, Calendar, Heart } from 'lucide-react';
import { MemoryPhoto } from '../data/galleryData';

interface PhotoModalProps {
  photo: MemoryPhoto | null;
  photos: MemoryPhoto[];
  onClose: () => void;
  onSelectPhoto: (p: MemoryPhoto) => void;
  onAddPhoto: (newP: Omit<MemoryPhoto, 'id'>) => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({
  photo,
  photos,
  onClose,
  onSelectPhoto,
  onAddPhoto,
}) => {
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newDate, setNewDate] = useState('20/10/2026');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!photo && !isAddingMode) return null;

  const currentIndex = photo ? photos.findIndex((p) => p.id === photo.id) : 0;

  const handlePrev = () => {
    if (photos.length === 0) return;
    const prevIdx = (currentIndex - 1 + photos.length) % photos.length;
    onSelectPhoto(photos[prevIdx]);
  };

  const handleNext = () => {
    if (photos.length === 0) return;
    const nextIdx = (currentIndex + 1) % photos.length;
    onSelectPhoto(photos[nextIdx]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitNewPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl || !newTitle.trim()) {
      alert('Vui lòng chọn ảnh và nhập tiêu đề.');
      return;
    }

    onAddPhoto({
      imageUrl: previewUrl,
      title: newTitle.trim(),
      caption: newCaption.trim() || 'Một khoảnh khắc thanh xuân đáng nhớ của lớp 12A1.',
      date: newDate.trim() || '20/10/2026',
      author: 'Thành viên 12A1',
      isCustom: true,
    });

    setIsAddingMode(false);
    setPreviewUrl(null);
    setNewTitle('');
    setNewCaption('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in interactive-modal">
      <div className="relative w-full max-w-3xl bg-stone-950 border border-pink-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-pink-500/20 bg-pink-950/30">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
            <span className="text-xs font-semibold tracking-wider text-pink-200 uppercase">
              {isAddingMode ? 'Thêm Kỷ Niệm 12A1 Mới' : 'Kỷ Niệm Thanh Xuân 12A1'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isAddingMode ? (
              <button
                onClick={() => setIsAddingMode(true)}
                className="px-3 py-1.5 text-xs font-medium bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-200 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm ảnh của bạn</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAddingMode(false)}
                className="text-xs text-pink-300 hover:text-white px-2 py-1 rounded-md"
              >
                Quay lại xem ảnh
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {isAddingMode ? (
          /* Add Photo Form */
          <form onSubmit={handleSubmitNewPhoto} className="p-6 overflow-y-auto space-y-4">
            <div>
              <label className="block text-xs font-medium text-pink-300 mb-1.5">
                Chọn hình ảnh kỷ niệm:
              </label>
              <div className="border-2 border-dashed border-pink-500/30 hover:border-pink-500/60 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-pink-950/20 relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {previewUrl ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-48 rounded-xl object-contain shadow"
                    />
                    <span className="text-xs text-pink-300 mt-2">Nhấn để đổi ảnh khác</span>
                  </div>
                ) : (
                  <div className="py-6 flex flex-col items-center text-slate-300">
                    <Upload className="w-8 h-8 text-pink-400 mb-2" />
                    <p className="text-xs font-medium">Nhấn vào đây để tải ảnh từ máy</p>
                    <p className="text-[11px] text-slate-500 mt-1">PNG, JPG, JPEG hỗ trợ</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-pink-300 mb-1">Tiêu đề bức ảnh:</label>
              <input
                type="text"
                placeholder="Ví dụ: Giờ thể dục vui nhộn, Buổi lễ 20/10..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-stone-900 border border-pink-500/30 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-pink-300 mb-1">
                Lời nhắn / Cảm xúc gửi đến lớp:
              </label>
              <textarea
                placeholder="Viết một lời nhắn dễ thương cho các bạn nữ hoặc kỷ niệm gắn liền..."
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                rows={3}
                className="w-full bg-stone-900 border border-pink-500/30 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-400"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingMode(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-xl"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white rounded-xl shadow-md transition-all active:scale-95"
              >
                Lưu vào Ngân Hà 12A1
              </button>
            </div>
          </form>
        ) : photo ? (
          /* View Photo Card */
          <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
            {/* Image Preview */}
            <div className="relative md:w-3/5 bg-black/60 flex items-center justify-center p-4">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="max-h-[50vh] md:max-h-[65vh] w-auto object-contain rounded-2xl shadow-xl border border-pink-500/20"
              />

              {/* Prev / Next controls */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 border border-pink-500/30 text-white flex items-center justify-center transition-transform active:scale-90"
                title="Ảnh trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 border border-pink-500/30 text-white flex items-center justify-center transition-transform active:scale-90"
                title="Ảnh tiếp"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Details */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-pink-500/20">
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-xs text-pink-300">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{photo.date}</span>
                  {photo.author && (
                    <>
                      <span>·</span>
                      <span>{photo.author}</span>
                    </>
                  )}
                </div>

                <h3 className="text-xl font-serif-display font-semibold text-white text-glow-pink">
                  {photo.title}
                </h3>

                <p className="text-sm text-pink-100/90 leading-relaxed font-light">
                  {photo.caption}
                </p>
              </div>

              {/* Index indicator */}
              <div className="pt-6 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Ảnh {currentIndex + 1} / {photos.length}
                </span>
                <span className="text-[11px] text-pink-400/80">
                  Dùng phím mũi tên hoặc nút để chuyển ảnh
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
