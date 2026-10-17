# 20/10 Lớp 12A1 — A Love Letter in Motion

Món quà bất ngờ 3D lãng mạn dành tặng các bạn nữ lớp **12A1** nhân ngày Phụ nữ Việt Nam 20/10.

## Chạy local

```bash
npm install --legacy-peer-deps
npm run dev
```

Mở http://localhost:3000

## Deploy Vercel (quan trọng về ảnh)

Ảnh nằm trong thư mục **`public/assets/images/`** (không phải `src/assets`).

Đường dẫn đúng trong code:
```
/assets/images/class12a1/ten_anh.jpg
```

**Không** dùng `/src/assets/...` — path đó chỉ chạy được lúc `npm run dev`, khi build production trên Vercel sẽ **404**.

### Cách deploy

1. Push project lên GitHub (bao gồm thư mục `public/`)
2. Import repo vào Vercel
3. Framework Preset: **Vite**
4. Build Command: `npm run build` (hoặc `vite build`)
5. Output Directory: `dist`
6. Install Command: `npm install --legacy-peer-deps`

Sau khi deploy xong, mở trang → Scene 3 (gallery) sẽ load đủ ảnh các bạn.

Nếu vẫn không thấy ảnh:
- Hard refresh (Ctrl+Shift+R)
- Xóa localStorage của domain Vercel (DevTools → Application → Local Storage → Clear)
- Kiểm tra Network tab xem request `/assets/images/...` có 200 không

## Thêm ảnh

1. Đặt file vào `public/assets/images/class12a1/`
2. Thêm entry trong `src/data/galleryData.ts` với `imageUrl: '/assets/images/class12a1/ten-file.jpg'`
3. Commit + push → Vercel tự deploy lại

## Âm nhạc

- Nút vinyl góc phải → Upload MP3/WAV từ máy (chạy local, không upload server)
