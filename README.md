# 20/10 Lớp 12A1 — A Love Letter in Motion

Món quà bất ngờ 3D lãng mạn dành tặng các bạn nữ lớp **12A1** nhân ngày Phụ nữ Việt Nam 20/10.

Một hành trình điện ảnh liền mạch với:

- Cầu ngọc phát sáng & dải ngân hà hạt bụi
- Vườn hoa anh đào + cánh hoa rơi parallax
- Thư viện ảnh 3D xoay (constellation / cylinder)
- Hiệu ứng bung hoa khi chạm màn hình
- Phong bì 3D mở ra + lá thư đầy đủ
- Trái tim ánh sáng cuối cùng
- Âm nhạc lãng mạn + hỗ trợ tải file audio thủ công
- OrbitControls: xoay / kéo / zoom mượt

## Chạy dự án

```bash
npm install --legacy-peer-deps
npm run dev
```

Mở http://localhost:3000

## Thêm ảnh kỷ niệm

Đặt ảnh vào `src/assets/images/` rồi cập nhật `src/data/galleryData.ts`.

Hoặc dùng nút upload trong modal ảnh khi đang xem gallery.

## Âm nhạc

- Mặc định: nhạc piano/synth procedurally generated (không cần file).
- Muốn dùng bài hát riêng: bấm icon đĩa vinyl → Upload → chọn file MP3/WAV từ máy.
- File chỉ chạy local trong trình duyệt, không upload lên server.

## Tùy chỉnh chữ

Sửa nội dung trong:

- `src/components/SceneNarrative.tsx` (tiêu đề từng cảnh)
- `src/components/LetterModal.tsx` (nội dung lá thư đầy đủ)

## Lưu ý

- Cần trình duyệt hỗ trợ WebGL (Chrome / Edge / Safari / Firefox hiện đại).
- Trên điện thoại: vuốt để xoay, chạm để bung hoa, pinch để zoom.
- Tự động chuyển cảnh mỗi ~14 giây sau lần chạm đầu tiên (có thể bấm mũi tên hoặc chấm nhỏ để nhảy cảnh).
