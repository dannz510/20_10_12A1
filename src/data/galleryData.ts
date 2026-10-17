/**
 * Curated youth memories and custom gallery store for Class 12A1
 * Photos sourced from the shared Drive folder of the girls.
 */

export interface MemoryPhoto {
  id: string;
  imageUrl: string;
  title: string;
  caption: string;
  date: string;
  author?: string;
  isCustom?: boolean;
}

export const INITIAL_MEMORIES: MemoryPhoto[] = [
  {
    id: 'girl-anh-thu',
    imageUrl: '/src/assets/images/class12a1/anh_thu.jpg',
    title: 'Anh Thư',
    caption: 'Nụ cười rạng rỡ của Anh Thư luôn mang đến năng lượng tích cực cho cả lớp. Chúc bạn 20/10 thật hạnh phúc và xinh đẹp!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-bich-huyen',
    imageUrl: '/src/assets/images/class12a1/bich_huyen.jpg',
    title: 'Bích Huyền',
    caption: 'Bích Huyền dịu dàng như những cánh hoa. Mong bạn luôn giữ được nét duyên dáng và sự tự tin riêng của mình.',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-chau-thu',
    imageUrl: '/src/assets/images/class12a1/chau_thu.jpg',
    title: 'Châu Thư',
    caption: 'Châu Thư — ánh mắt trong veo và nụ cười tươi tắn. Chúc bạn một ngày 20/10 ngập tràn yêu thương!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-gia-linh',
    imageUrl: '/src/assets/images/class12a1/gia_linh.jpg',
    title: 'Gia Linh',
    caption: 'Gia Linh luôn tỏa sáng theo cách riêng. Cảm ơn bạn vì đã là một phần không thể thiếu của 12A1.',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-gia-thanh',
    imageUrl: '/src/assets/images/class12a1/gia_thanh.jpg',
    title: 'Gia Thành',
    caption: 'Gia Thành rực rỡ và đầy sức sống. Chúc bạn luôn tự tin bước tới những ước mơ của mình!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-h-thuy-duong',
    imageUrl: '/src/assets/images/class12a1/h_thuy_duong.jpg',
    title: 'H. Thùy Dương',
    caption: 'Thùy Dương dịu dàng, ấm áp như ánh nắng ban mai. 20/10 chúc bạn luôn được yêu thương và trân trọng.',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-hong-diem',
    imageUrl: '/src/assets/images/class12a1/hong_diem.jpg',
    title: 'Hồng Diễm',
    caption: 'Hồng Diễm — cái tên đã nói lên sự xinh đẹp. Mong bạn luôn rạng rỡ và hạnh phúc mỗi ngày.',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-hong-ngoc',
    imageUrl: '/src/assets/images/class12a1/hong_ngoc.jpg',
    title: 'Hồng Ngọc',
    caption: 'Hồng Ngọc như viên ngọc quý giữa lớp. Chúc bạn một ngày 20/10 thật nhiều niềm vui!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-khanh-nhu',
    imageUrl: '/src/assets/images/class12a1/khanh_nhu.jpg',
    title: 'Khánh Như',
    caption: 'Khánh Như duyên dáng và đáng yêu. Cảm ơn bạn đã mang đến bao tiếng cười cho 12A1.',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-l-thuy-duong',
    imageUrl: '/src/assets/images/class12a1/l_thuy_duong.jpg',
    title: 'L. Thùy Dương',
    caption: 'Thùy Dương với nụ cười tươi rói. Chúc bạn luôn giữ được sự tự tin và ánh mắt lấp lánh ấy.',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-minh-anh',
    imageUrl: '/src/assets/images/class12a1/minh_anh.jpg',
    title: 'Minh Anh',
    caption: 'Minh Anh — sự thông minh và duyên dáng hòa quyện. 20/10 chúc bạn tỏa sáng hơn bao giờ hết!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-ngoc-thuy',
    imageUrl: '/src/assets/images/class12a1/ngoc_thuy.jpg',
    title: 'Ngọc Thúy',
    caption: 'Ngọc Thúy dịu dàng như những cánh hoa anh đào. Mong bạn luôn được bao bọc bởi yêu thương.',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-ngoc-anh',
    imageUrl: '/src/assets/images/class12a1/ngoc_anh.jpg',
    title: 'Ngọc Ánh',
    caption: 'Ngọc Ánh rực rỡ và đầy sức hút. Chúc bạn một ngày 20/10 thật đặc biệt và đáng nhớ!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-p-bao-ngoc',
    imageUrl: '/src/assets/images/class12a1/p_bao_ngoc.jpg',
    title: 'P. Bảo Ngọc',
    caption: 'Bảo Ngọc — viên ngọc quý giá của 12A1. Cảm ơn bạn vì những khoảnh khắc tuyệt vời bên nhau.',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-phuong-linh',
    imageUrl: '/src/assets/images/class12a1/phuong_linh.jpg',
    title: 'Phương Linh',
    caption: 'Phương Linh duyên dáng và thanh thoát. Chúc bạn luôn mạnh mẽ và tự do theo đuổi ước mơ.',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-phuong-ngan',
    imageUrl: '/src/assets/images/class12a1/phuong_ngan.jpg',
    title: 'Phương Ngân',
    caption: 'Phương Ngân với nụ cười tỏa nắng. 20/10 chúc bạn ngập tràn hạnh phúc và yêu thương!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-quynh-chi',
    imageUrl: '/src/assets/images/class12a1/quynh_chi.jpg',
    title: 'Quỳnh Chi',
    caption: 'Quỳnh Chi xinh đẹp và đầy cá tính. Mong bạn luôn giữ được ngọn lửa nhiệt huyết ấy.',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-quynh-le',
    imageUrl: '/src/assets/images/class12a1/quynh_le.jpg',
    title: 'Quỳnh Lê',
    caption: 'Quỳnh Lê — sự dịu dàng và mạnh mẽ hòa quyện. Chúc bạn một ngày 20/10 thật rực rỡ!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-quynh-nhu',
    imageUrl: '/src/assets/images/class12a1/quynh_nhu.jpg',
    title: 'Quỳnh Như',
    caption: 'Quỳnh Như đáng yêu và ấm áp. Cảm ơn bạn đã làm cho thanh xuân 12A1 thêm phần rực rỡ.',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-quynh-tram',
    imageUrl: '/src/assets/images/class12a1/quynh_tram.jpg',
    title: 'Quỳnh Trâm',
    caption: 'Quỳnh Trâm với ánh mắt trong trẻo. Chúc bạn luôn được yêu thương và tự do tỏa sáng!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-t-bao-ngoc',
    imageUrl: '/src/assets/images/class12a1/t_bao_ngoc.jpg',
    title: 'T. Bảo Ngọc',
    caption: 'Bảo Ngọc — nụ cười và sự thân thiện luôn lan tỏa. 20/10 chúc bạn thật nhiều niềm vui!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-thuy-tram',
    imageUrl: '/src/assets/images/class12a1/thuy_tram.jpg',
    title: 'Thùy Trâm',
    caption: 'Thùy Trâm dịu dàng và đầy duyên dáng. Mong bạn luôn giữ được nét đẹp ấy trong lòng mình.',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-thuy-hien',
    imageUrl: '/src/assets/images/class12a1/thuy_hien.jpg',
    title: 'Thúy Hiền',
    caption: 'Thúy Hiền — sự hiền lành và xinh xắn. Chúc bạn một ngày 20/10 ngập tràn hoa và nụ cười!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-thuc-ky',
    imageUrl: '/src/assets/images/class12a1/thuc_ky.png',
    title: 'Thục Kỳ',
    caption: 'Thục Kỳ rạng rỡ và đầy cá tính. Cảm ơn bạn vì những kỷ niệm đẹp bên nhau suốt năm học này.',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-thuy-tien',
    imageUrl: '/src/assets/images/class12a1/thuy_tien.jpg',
    title: 'Thủy Tiên',
    caption: 'Thủy Tiên như đóa hoa thanh khiết. Chúc bạn luôn tự tin và rực rỡ theo cách riêng của mình!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-tu-quyen',
    imageUrl: '/src/assets/images/class12a1/tu_quyen.jpg',
    title: 'Tú Quyên',
    caption: 'Tú Quyên — nụ cười và sự ấm áp lan tỏa. 20/10 chúc bạn thật nhiều yêu thương và hạnh phúc!',
    date: '20/10/2026',
    author: '12A1',
  },
];

const LOCAL_STORAGE_KEY = '12A1_GALLERY_MEMORIES_V2';

export function getStoredMemories(): MemoryPhoto[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return INITIAL_MEMORIES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // If stored list is smaller than the curated set, prefer the new curated photos
      // (user can still upload more via the modal)
      if (parsed.length < INITIAL_MEMORIES.length) {
        return INITIAL_MEMORIES;
      }
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to read memories from localStorage:', err);
  }
  return INITIAL_MEMORIES;
}

export function saveStoredMemories(memories: MemoryPhoto[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(memories));
  } catch (err) {
    console.warn('Failed to save memories to localStorage:', err);
  }
}

export function addCustomMemory(photo: Omit<MemoryPhoto, 'id'>): MemoryPhoto {
  const current = getStoredMemories();
  const newMemory: MemoryPhoto = {
    ...photo,
    id: 'custom-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    isCustom: true,
  };
  const updated = [newMemory, ...current];
  saveStoredMemories(updated);
  return newMemory;
}
