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
    imageUrl: '/assets/images/class12a1/anh_thu.jpg',
    title: 'Lê Vũ Anh Thư',
    caption: 'Nụ cười rạng rỡ của Anh Thư luôn mang đến năng lượng tích cực cho cả lớp. Chúc bà 20/10 thật hạnh phúc và xinh đẹp nha!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-bich-huyen',
    imageUrl: '/assets/images/class12a1/bich_huyen.jpg',
    title: 'Trần Ngọc Bích Huyền',
    caption: 'Hi Bích Huyền, 3 năm học ở Châu Thành là một hành trình dài. Tụi tui rất vui vì hành trình đó luôn có dấu chân của bà. Chúc bà xinh đẹp, học giỏi và đạt được mục tiêu của mình.',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-chau-thu',
    imageUrl: '/assets/images/class12a1/chau_thu.jpg',
    title: 'Nguyễn Văn Châu Thư',
    caption: 'Châu Thư này! ánh mắt trong veo và nụ cười tươi tắn của bà là một phần không thể thiếu để làm lớp mình nhộn nhịp hơn. Chúc Thư một ngày 20/10 ngập tràn yêu thương, con đường học tập sẽ thuận buồm xuôi gió nhé!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-gia-linh',
    imageUrl: '/assets/images/class12a1/gia_linh.jpg',
    title: 'Trần Gia Linh',
    caption: 'Gia Linh ơi, bà cho tụi tui hỏi làm thế nào để có thể vừa xinh đẹp vừa hài hước được như bà vậy. Nhân ngày 20/10, tụi tui chúc bà gặt hái được nhiều điều tốt đẹp và ngọt ngào nhé!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-gia-thanh',
    imageUrl: '/assets/images/class12a1/gia_thanh.jpg',
    title: 'Nguyễn Vũ Gia Thành',
    caption: 'Gia Thành ơi! Bà biết tụi tui gọi bà là gì hong nè! Là cây văn súp pơ cu te của lớp 12A1 chúng ta đó. Tương lai còn nhiều điều đang chờ bà ở phía trước, tụi tui mong rằng mọi điều sắp đến đều sẽ tích cực và được như ý bà nha!!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-h-thuy-duong',
    imageUrl: '/assets/images/class12a1/h_thuy_duong.jpg',
    title: 'Hoàng Nguyễn Thùy Dương',
    caption: 'Thùy Dương ơi! Bà dịu dàng, ấm áp như ánh nắng ban mai vậy đóoo. GIRL "Khéo tay hay làm" chính hiệu của lớp! Dương ơi, tụi tui chúc bà sẽ thật thành công trong năm học này nhé!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-hong-diem',
    imageUrl: '/assets/images/class12a1/hong_diem.jpg',
    title: 'Phan Thị Hồng Diễm',
    caption: 'Chời ơi! Cô gái hiền dịu nết na nhất lớp mình nè, hãy toả sáng thật rực rỡ nhất trên hành trình này cùng tụi mình nhéee!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-hong-ngoc',
    imageUrl: '/assets/images/class12a1/hong_ngoc.jpg',
    title: 'Nguyễn Thị Hồng Ngọc',
    caption: 'Hồng Ngọc như viên ngọc quý giữa lớp đó nha. Cảm ơn vì Ngọc đã cùng tụi tui trên quãng đường ba năm ngắn ngủi này với thật nhiều kỉ niệm đẹp! Chúc bà một ngày 20/10 thật nhiều niềm vui!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-khanh-nhu',
    imageUrl: '/assets/images/class12a1/khanh_nhu.jpg',
    title: 'Đinh Hoàng Khánh Như',
    caption: 'Khánh Như (jos 🐬) duyên dáng và đáng yêu. Cảm ơn Như đã mang đến bao tiếng cười cho 12A1! Chúc Như luôn vui vẻ, hạnh phúc, gặp nhiều may mắn và có một hành trình thanh xuân thật rực rỡ nhé! Mong Như sẽ luôn giữ được nụ cười tươi tắn, đạt được những điều mình mong muốn và có thật nhiều kỷ niệm đẹp bên tập thể 12A1. Chúc Như mãi đáng yêu và luôn tỏa sáng theo cách riêng của mình nha! 💗',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-l-thuy-duong',
    imageUrl: '/assets/images/class12a1/l_thuy_duong.jpg',
    title: 'Lại Thùy Dương',
    caption: 'Thùy Dương - leader văn nghệ cực chất của lớp. Hi bà, năm nay là một năm quan trọng, nên tụi tui chúc bà tràn đầy sức sống, bình an mỗi ngày để tập trung cho các kỳ thi quan trọng của bà nhé! *(we are BEST FRIEND!!! forever)',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-minh-anh',
    imageUrl: '/assets/images/class12a1/minh_anh.jpg',
    title: 'Hồ Minh Anh',
    caption: 'Hề lố Minh Anh. Năm nay là cơ hội để chúng ta tỏa sáng, nên tụi tui chúc bà thật vững vàng, nhiều năng lượng để bà luôn rạng rỡ trong mọi tình huống nhé!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-ngoc-thuy',
    imageUrl: '/assets/images/class12a1/ngoc_thuy.jpg',
    title: 'Hoàng Ngọc Thúy',
    caption: 'Ngọc Thúy ơi! Thuý biết gì không?? Bà là cô gái siu cấp dịu dàng, dễ thương và là người cầm quỹ đầy trách nhiệm của tụi tui đó!. Mong Thuý luôn là ngôi sao lấp lánh nhất và hành trình của bà luôn thuận lợi và thành công nhaa!.',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-ngoc-anh',
    imageUrl: '/assets/images/class12a1/ngoc_anh.jpg',
    title: 'Nguyễn Ngọc Ánh',
    caption: 'Ngọc Ánh nè! Bà có biết bà rực rỡ thế nào không? Nhân ngày lễ lớn, tụi tui chúc bà có nhiều sức khỏe để học tập, đạt được thành tích cao trong năm nay nhé!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-p-bao-ngoc',
    imageUrl: '/assets/images/class12a1/p_bao_ngoc.jpg',
    title: 'Nguyễn Phùng Bảo Ngọc',
    caption: 'Hiluu Phùng Ngọc nè! Một viên ngọc quý giá không thể thiếu của tập thể 12A1. Cảm ơn Ngọc vì những khoảnh khắc tuyệt vời bên nhau và những tác phẩm tuyệt vời do đôi tay thân kỳ của bà đã sáng tác nha.',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-phuong-linh',
    imageUrl: '/assets/images/class12a1/phuong_linh.jpg',
    title: 'Phan Ngọc Phương Linh',
    caption: 'Hello Phương Linh - học bá ngầm của lớp - cô gái thông minh và duyên dáng, tụi tui chúc bà một ngày lễ thật nhiều quà và nhiều lời chúc nhé!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-phuong-ngan',
    imageUrl: '/assets/images/class12a1/phuong_ngan.jpg',
    title: 'Lê Phương Ngân',
    caption: 'Phương Ngân - nàng thơ nhỏ nhắn, thời gian trôi qua nhanh thiệt bà nhỉ. Mong rằng trong năm nay chúng ta sẽ có thêm thật nhiều kỷ niệm đẹp với nhau nhé!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-quynh-chi',
    imageUrl: '/assets/images/class12a1/quynh_chi.jpg',
    title: 'Phạm Quỳnh Chi',
    caption: 'À nhon Quỳnh Chi - dancer cá tính và cute của lớp. "Sao bà có thể nhiều năng lượng đến vậy" Bà như thể một trạm sạc nhỏ của lớp 12A1 vậy đó! Tụi tui chúc bà luôn giữ mãi "chất" riêng của mình. Năm nay chính là sân khấu của bà á, hãy cùng tỏa sáng với tụi tui nhé!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-quynh-le',
    imageUrl: '/assets/images/class12a1/quynh_le.jpg',
    title: 'Lê Thị Quỳnh Lê',
    caption: 'Hí lô Quỳnh Lê - cô "tấm" của lớp mình, bà đã học tập và nỗ lực rất nhiều rồi á. Tụi tui chúc bà luôn khỏe mạnh, xinh đẹp chinh phục những mục tiêu lớn hơn nhé!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-quynh-nhu',
    imageUrl: '/assets/images/class12a1/quynh_nhu.jpg',
    title: 'Nguyễn Quỳnh Như',
    caption: 'Quỳnh Như đáng yêu và ấm áp - dancer xinh đẹp - girl thể thao chính hiệu của lớp. Tụi tui rất vui vì đã gặp được bà trong thanh xuân của mình. Mong rằng những điều nhẹ nhàng và êm ả sẽ đến bên bà trong năm học này!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-quynh-tram',
    imageUrl: '/assets/images/class12a1/quynh_tram.jpg',
    title: 'Hoàng Quỳnh Trâm',
    caption: 'Nếu phải nhắc đến một người ít nói hiền dịu - Đích thị là bà đó Quỳnh Trâm, Girl thể thao xịn đét, học giỏi và chăm nữa. Tụi tui rất vui bởi vì chúng ta đã đồng hành với nhau trên một chặng đường dài. Chúc bà luôn khoẻ mạnh, bền bỉ để cùng tụi tui về đích nhé!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-t-bao-ngoc',
    imageUrl: '/assets/images/class12a1/t_bao_ngoc.jpg',
    title: 'Trịnh Bảo Ngọc',
    caption: 'Hi Trịnh Ngọc, thanh xuân cấp 3 ở Châu Thành tuy ngắn ngủi nhưng đẹp thật bà nhỉ. Đẹp là khi chúng mình cùng học tập với nhau, cùng làm việc với nhau, cùng sai với nhau, để rồi chúng mình cũng cùng trưởng thành với nhau. Rất vui khi được đồng hành với bà, tụi tui chúc bà một ngày lễ thật ấm áp bên gia đình, người thân và bạn bè nhé!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-thuy-tram',
    imageUrl: '/assets/images/class12a1/thuy_tram.jpg',
    title: 'Chế Đặng Thùy Trâm',
    caption: 'Nụ cười của Trâm🐷 mang đầy năng lượng tích cực như thể mỗi phút bà cười là mỗi lần tỏa nắng vậy đó! Bà hãy luôn tươi đời như thế nhé. Tui rất vui vì đã được đồng hành cùng bà trên hành trình cấp ba này, chúc Trâm khỏe mạnh, xinh đẹp, và thành công nghe bà!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-thuy-hien',
    imageUrl: '/assets/images/class12a1/thuy_hien.jpg',
    title: 'Lý Thị Thúy Hiền',
    caption: 'Chào Thúy Hiền. Bà tinh tế và nhẹ nhàng như hoa ly vậy á. Tụi tui chúc bà một ngày lễ ngập tràn hoa và nụ cười nhaa!',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-thuc-ky',
    imageUrl: '/assets/images/class12a1/thuc_ky.png',
    title: 'Trương Thục Kỳ',
    caption: 'Thục Kỳ rạng rỡ và đầy cá tính. Cảm ơn bạn vì những kỷ niệm đẹp bên nhau suốt năm học này.',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-thuy-tien',
    imageUrl: '/assets/images/class12a1/thuy_tien.jpg',
    title: 'Nguyễn Ngọc Thủy Tiên',
    caption: 'Thủy Tiên - một loài hoa thuần khiết, thanh tao nhưng vẫn kiên cường vượt qua mọi thử thách của thiên nhiên. Hi bà, nhân ngày 20/10, tụi tui chúc bà luôn tự tin và rực rỡ trên chặng đường phía trước.',
    date: '20/10/2026',
    author: '12A1',
  },
  {
    id: 'girl-tu-quyen',
    imageUrl: '/assets/images/class12a1/tu_quyen.jpg',
    title: 'Nguyễn Hoàng Tú Quyên',
    caption: 'Tú Quyên —  Chào Wyn nhe! nụ cười và sự ấm áp của bà lan tỏa nhiều lắm đó. Nhân ngày 20/10, tụi tui chúc bà nhận được siêu nhiều lời yêu thương nhé!',
    date: '20/10/2026',
    author: '12A1',
  },
];

const LOCAL_STORAGE_KEY = '12A1_GALLERY_MEMORIES_V3';

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
