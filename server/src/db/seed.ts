import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { db, initDatabase } from './database.js';
import { config } from '../config.js';

export function seedDatabase(force = false) {
  initDatabase();

  // 1. Seed Admin User
  const existingUser = db.prepare('SELECT id, password_hash FROM users WHERE username = ?').get(config.admin.username) as { id: number; password_hash: string } | undefined;
  
  // Determine password hash (from ADMIN_PASSWORD_HASH or hash plain ADMIN_PASSWORD)
  let passwordHash = config.admin.passwordHash;
  if (!passwordHash) {
    if (config.admin.password.startsWith('$2a$') || config.admin.password.startsWith('$2b$') || config.admin.password.startsWith('$2y$')) {
      passwordHash = config.admin.password;
    } else {
      const salt = bcrypt.genSaltSync(10);
      passwordHash = bcrypt.hashSync(config.admin.password, salt);
    }
  }

  if (!existingUser) {
    db.prepare('INSERT INTO users (username, password_hash, email, role) VALUES (?, ?, ?, ?)')
      .run(config.admin.username, passwordHash, config.admin.email, 'admin');
    console.log(`[Seed] Admin user '${config.admin.username}' created with bcrypt password hash.`);
  } else if (force || (config.admin.passwordHash && existingUser.password_hash !== config.admin.passwordHash)) {
    db.prepare('UPDATE users SET password_hash = ?, email = ? WHERE username = ?')
      .run(passwordHash, config.admin.email, config.admin.username);
    console.log(`[Seed] Admin user '${config.admin.username}' updated with new password hash.`);
  }

  // Check if categories exist
  const categoryCountRow = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  if (categoryCountRow.count > 0 && !force) {
    return;
  }

  console.log('[Seed] Seeding authentic Ong Dú Việt Nam catalog...');

  // Clear existing if force
  if (force) {
    db.exec('DELETE FROM products;');
    db.exec('DELETE FROM categories;');
  }

  // Check if products.json exists
  const candidates = [
    path.resolve(process.cwd(), 'server/src/data/products.json'),
    path.resolve(process.cwd(), 'server/data/products.json'),
    path.resolve(process.cwd(), 'data/products.json'),
    path.resolve(__dirname, '../data/products.json'),
    path.resolve(__dirname, '../../data/products.json'),
  ];
  let jsonCatalog: { categories: any[]; products: any[] } | null = null;
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      try {
        jsonCatalog = JSON.parse(fs.readFileSync(p, 'utf-8'));
        console.log(`[Seed] Loaded catalog directly from JSON: ${p}`);
        break;
      } catch {
        // fallback
      }
    }
  }

  // 2. Insert Categories
  const categories = [
    {
      name: 'Mật Ong Dú Đa Hoa Rừng',
      slug: 'mat-ong-du-da-hoa-rung',
      description: 'Mật ong từ loài ong không ngòi đốt Meliponini (giống Tetragonula), vị ngọt thanh hậu chua dịu tự nhiên, giàu Trehalulose và enzyme sống.',
      order_index: 1,
    },
    {
      name: 'Keo Ong Dú (Propolis) Thượng Hạng',
      slug: 'keo-ong-du-propolis',
      description: 'Chiết xuất từ hỗn hợp nhựa cây quý và sáp cerumen mà đàn ong dùng xây tổ, kháng sinh tự nhiên hỗ trợ đề kháng và dịu họng.',
      order_index: 2,
    },
    {
      name: 'Phấn Hoa & Sáp Cerumen Ong Dú',
      slug: 'phan-hoa-sap-cerumen',
      description: 'Hạt phấn hoa vi mô siêu nhỏ từ các loài hoa dại li ti và sáp tổ Cerumen giàu dưỡng chất bồi bổ sinh lực.',
      order_index: 3,
    },
    {
      name: 'Hộp Quà & Combo Sức Khỏe',
      slug: 'combo-qua-tang-suc-khoe',
      description: 'Bộ sưu tập quà biếu cao cấp kết hợp mật ong dú rừng, keo ong giọt và thảo dược tự nhiên.',
      order_index: 4,
    },
  ];

  const insertCategory = db.prepare(`
    INSERT INTO categories (id, name, slug, description, order_index)
    VALUES (?, ?, ?, ?, ?)
  `);

  const categoryMap: Record<string, number> = {};
  for (const cat of (jsonCatalog?.categories || categories)) {
    const result = insertCategory.run(cat.id || null, cat.name, cat.slug, cat.description || '', cat.order_index || 0);
    const assignedId = cat.id || Number(result.lastInsertRowid);
    categoryMap[cat.slug] = assignedId;
    categoryMap[String(assignedId)] = assignedId;
  }

  // 3. Insert Products
  const products = [
    {
      name: 'Mật Ong Dú Rừng Nguyên Chất Thượng Hạng (Chai Thủy Tinh 250ml)',
      slug: 'mat-ong-du-rung-nguyen-chat-250ml',
      category_id: categoryMap['mat-ong-du-da-hoa-rung'],
      short_description: 'Mật ong dú Meliponini nguyên chất 100%, vị ngọt thanh pha chua nhẹ tự nhiên, giàu đường quý Trehalulose và polyphenol chống oxy hóa.',
      description: `Mật ong dú (Stingless Bee Honey - còn gọi dân gian là ong rú, ong lỗ, ong muỗi) thuộc phân họ Meliponini. Đây là nhóm ong bản địa nhiệt đới hoàn toàn không có ngòi đốt.

Đặc tính nổi bật từ thiên nhiên:
- Khai thác từ giống ong Tetragonula bản địa với kích thước tí hon (2–8mm), có khả năng thu lượm mật từ những loài hoa rừng và cây dược liệu li ti mà ong mật thông thường không thể tiếp cận.
- Mật được tích trữ trong các túi mật hình cầu đan bằng hỗn hợp sáp và keo ong (Cerumen), trải qua quá trình lên men tự nhiên có kiểm soát tạo nên vị ngọt thanh xen lẫn vị chua nhẹ đặc trưng.
- Chứa hàm lượng đường Trehalulose quý hiếm tự nhiên - loại đường phóng thích chậm, ít gây tăng vọt đường huyết đột ngột.
- Sản lượng mỗi tổ cực kỳ khan hiếm: chỉ từ 0,2 đến 1,5 lít mật/năm.`,
      price: 550000,
      original_price: 620000,
      volume: '250ml',
      image_url: '/images/product-honey-bottle.jpg',
      additional_images: JSON.stringify([
        '/images/product-honey-bottle.jpg',
        '/images/about-cerumen-nest.jpg',
        '/images/hero-stingless-bee.jpg'
      ]),
      is_featured: 1,
      is_active: 1,
      in_stock: 1,
      origin: 'Vườn sinh thái Suối Cát, Cam Lâm, Khánh Hòa',
      ingredients: '100% Mật ong dú tự nhiên nguyên chất đa hoa rừng, không pha đường, không qua xử lý nhiệt.',
      usage_instructions: 'Dùng trực tiếp 1–2 thìa cà phê mỗi sáng hoặc pha cùng nước ấm (dưới 40°C). Hỗ trợ làm dịu họng, bồi bổ tiêu hóa và tăng cường miễn dịch.',
      preservation: 'Bảo quản nơi khô ráo, thoáng mát hoặc ngăn mát tủ lạnh sau khi mở nắp để giữ trọn men sống tự nhiên. Lưu ý: Không dùng cho trẻ em dưới 1 tuổi.',
      rating: 5.0,
      review_count: 58,
    },
    {
      name: 'Mật Ong Dú Rừng Đại Ngàn Chai Thủy Tinh Sẫm Màu 500ml',
      slug: 'mat-ong-du-rung-dai-ngan-500ml',
      category_id: categoryMap['mat-ong-du-da-hoa-rung'],
      short_description: 'Dung tích 500ml tiết kiệm cho gia đình, thu hoạch từ các cánh rừng nguyên sinh miền Trung, mật vàng nâu tự nhiên ánh trong.',
      description: `Dòng sản phẩm mật ong dú tự nhiên dung tích 500ml đóng trong chai thủy tinh sẫm màu chống quang hóa. Sản phẩm thu hoạch từ chuỗi trang trại nuôi ong dú sinh thái tại Khánh Hòa và Phú Yên.

Ưu điểm nổi bật:
- 100% mật ong đa hoa tự nhiên từ hoa dại vùng núi, vị chua thanh độc bản.
- Phương pháp hút mật chân không vi sinh khép kín, không làm dập ấu trùng, bảo tồn đàn ong bền vững.
- Hỗ trợ tiêu hóa (đầy bụng, táo bón), hỗ trợ giảm ho và sát khuẩn niêm mạc họng nhẹ tự nhiên.`,
      price: 1050000,
      original_price: 1200000,
      volume: '500ml',
      image_url: '/images/product-honey-bottle.jpg',
      additional_images: JSON.stringify([
        '/images/product-honey-bottle.jpg',
        '/images/knowledge-honey-harvest.jpg'
      ]),
      is_featured: 1,
      is_active: 1,
      in_stock: 1,
      origin: 'Khánh Hòa & Phú Yên, Việt Nam',
      ingredients: '100% Mật ong dú tự nhiên nguyên chất.',
      usage_instructions: 'Mỗi ngày dùng 10–20ml cùng nước ấm vào buổi sáng hoặc tối trước khi ngủ.',
      preservation: 'Nơi khô mát hoặc ngăn mát tủ lạnh. Không dùng cho trẻ dưới 1 tuổi.',
      rating: 4.9,
      review_count: 42,
    },
    {
      name: 'Keo Ong Dú Tự Nhiên Nguyên Chất Dạng Giọt (Propolis Tincture 30ml)',
      slug: 'keo-ong-du-propolis-tincture-30ml',
      category_id: categoryMap['keo-ong-du-propolis'],
      short_description: 'Chiết xuất từ keo ong dú (hỗn hợp nhựa cây và sáp cerumen), chất kháng sinh tự nhiên hỗ trợ tăng đề kháng và giảm rát cổ họng.',
      description: `Keo ong dú (Stingless Bee Propolis) là thành phần bảo vệ tổ kiên cố của loài ong dú trước mọi loại nấm mốc và vi khuẩn nhiệt đới. Mỗi tổ ong dú trong năm chỉ thu hoạch được khoảng 100–200 gram keo quý.

Công dụng hỗ trợ:
- Hỗ trợ làm dịu đau rát cổ họng, viêm amidan, ho khan, nhiệt miệng.
- Hỗ trợ tăng cường sức đề kháng và miễn dịch tự nhiên của cơ thể.
- Tính sát khuẩn, kháng viêm nhẹ, hỗ trợ làm dịu vết côn trùng cắn, trầy xước ngoài da.
*Lưu ý: Keo ong là sản phẩm hỗ trợ, không thay thế thuốc chữa bệnh.*`,
      price: 420000,
      original_price: 480000,
      volume: 'Lọ 30ml có ống nhỏ giọt',
      image_url: '/images/product-propolis.jpg',
      additional_images: JSON.stringify([
        '/images/product-propolis.jpg'
      ]),
      is_featured: 1,
      is_active: 1,
      in_stock: 1,
      origin: 'Cam Lâm, Khánh Hòa, Việt Nam',
      ingredients: 'Chiết xuất keo ong dú tự nhiên (Propolis) 30%, dung dịch tinh khiết.',
      usage_instructions: 'Nhỏ 3–5 giọt vào 50ml nước ấm khuấy đều và uống, hoặc nhỏ trực tiếp 1–2 giọt vào vòm họng khi thấy ngứa rát cổ.',
      preservation: 'Bảo quản nơi khô ráo thoáng mát, tránh ánh sáng trực tiếp.',
      rating: 5.0,
      review_count: 67,
    },
    {
      name: 'Keo Ong Dú Dạng Xịt Họng Thảo Dược Kháng Khuẩn 20ml',
      slug: 'keo-ong-du-dang-xit-hong-thao-duoc-20ml',
      category_id: categoryMap['keo-ong-du-propolis'],
      short_description: 'Xịt họng keo ong dú kết hợp tinh dầu bạc hà và tràm gió, thơm mát tức thì, êm dịu vòm họng tiện lợi mang theo.',
      description: `Bình xịt họng Keo Ong Dú Thảo Dược là giải pháp chăm sóc hệ hô hấp tức thì cho người làm việc văn phòng máy lạnh, giáo viên, diễn giả, người hay giao tiếp.

Ưu điểm nổi bật:
- Đầu vòi phun sương siêu mịn giúp hoạt chất keo ong thẩm thấu đều khắp niêm mạc họng.
- Hương vị thanh mát, the dịu dễ chịu, không nồng gắt.
- Chai nhỏ gọn 20ml bỏ túi tiện lợi mang theo mọi lúc mọi nơi.`,
      price: 280000,
      original_price: 320000,
      volume: 'Chai xịt 20ml',
      image_url: '/images/product-propolis.jpg',
      additional_images: JSON.stringify([
        '/images/product-propolis.jpg'
      ]),
      is_featured: 0,
      is_active: 1,
      in_stock: 1,
      origin: 'Việt Nam',
      ingredients: 'Keo ong dú, dịch chiết lá trầu không, tinh dầu bạc hà, tinh dầu tràm gió, mật ong dú.',
      usage_instructions: 'Xịt trực tiếp vào khoang miệng và cổ họng mỗi lần 2–3 nhát, ngày dùng 3–5 lần khi cần thiết.',
      preservation: 'Nơi khô mát, đậy nắp bảo vệ sau khi dùng.',
      rating: 4.8,
      review_count: 38,
    },
    {
      name: 'Phấn Hoa Ong Dú Tươi Tự Nhiên Bồi Bổ Thể Lực (Hũ 220g)',
      slug: 'phan-hoa-ong-du-tuoi-tu-nhien-220g',
      category_id: categoryMap['phan-hoa-sap-cerumen'],
      short_description: 'Hạt phấn hoa ong dú vi mô từ các loài hoa dại li ti, giàu protein thực vật, acid amin và vitamin nhóm B bồi bổ cơ thể.',
      description: `Phấn hoa được các chú ong thợ Tetragonula thu gom từ nhị hoa rừng li ti trong bán kính quanh tổ. Kích thước hạt phấn siêu nhỏ kết hợp với dịch men tiêu hóa của ong tạo nên nguồn dưỡng chất dễ hấp thụ.

Công dụng:
- Bổ sung dinh dưỡng tự nhiên, hỗ trợ tiêu hóa và phục hồi thể lực.
- Phù hợp cho người mới ốm dậy, người ăn chay, người lớn tuổi và vận động viên.
- Mỗi tổ ong dú một năm chỉ thu được khoảng 50–100 gram phấn hoa.`,
      price: 350000,
      original_price: 400000,
      volume: 'Hũ 220g',
      image_url: '/images/product-pollen.jpg',
      additional_images: JSON.stringify([]),
      is_featured: 0,
      is_active: 1,
      in_stock: 1,
      origin: 'Khánh Hòa, Việt Nam',
      ingredients: '100% Phấn hoa ong dú tự nhiên nguyên chất sấy lạnh.',
      usage_instructions: 'Ăn trực tiếp 1–2 thìa cà phê mỗi ngày hoặc hòa vào sữa chua, sinh tố, mật ong hoặc nước ấm.',
      preservation: 'Đậy kín nắp, bảo quản trong ngăn mát tủ lạnh.',
      rating: 4.9,
      review_count: 26,
    },
    {
      name: 'Sáp Tổ Ong Dú Cerumen Thuần Khiết (Khối 100g)',
      slug: 'sap-to-ong-du-cerumen-100g',
      category_id: categoryMap['phan-hoa-sap-cerumen'],
      short_description: 'Sáp tổ ong dú tự nhiên (Cerumen) kết hợp giữa sáp ong và keo nhựa cây quý, nguyên liệu quý cho chăm sóc da hữu cơ.',
      description: `Sáp tổ ong dú (Cerumen) được lấy từ cấu trúc tổ tự nhiên của loài ong dú. Với đặc tính dẻo quánh, chứa hàm lượng keo thực vật tự nhiên cao, sáp ong dú là nguyên liệu tuyệt vời trong dưỡng ẩm da, làm dịu vết nứt nẻ và làm mỹ phẩm organic handmade.`,
      price: 260000,
      original_price: null,
      volume: 'Khối 100g',
      image_url: '/images/about-cerumen-nest.jpg',
      additional_images: JSON.stringify([]),
      is_featured: 0,
      is_active: 1,
      in_stock: 1,
      origin: 'Việt Nam',
      ingredients: '100% Sáp tổ ong dú tự nhiên (Cerumen).',
      usage_instructions: 'Dùng ngâm thảo dược, làm nến thơm tự nhiên hoặc dưỡng ẩm da handmade.',
      preservation: 'Nơi khô ráo thoáng mát.',
      rating: 4.8,
      review_count: 19,
    },
    {
      name: 'Set Quà Tặng Thượng Phẩm Ong Dú - Tinh Hoa Rừng Nhiệt Đới',
      slug: 'set-qua-tang-thuong-pham-ong-du-tinh-hoa-rung-nhiet-doi',
      category_id: categoryMap['combo-qua-tang-suc-khoe'],
      short_description: 'Hộp quà cao cấp gồm 01 Chai Mật ong dú 250ml nắp gỗ, 01 Lọ Keo ong Propolis 30ml, 01 Hũ phấn hoa và 01 Gáo lấy mật gỗ dừa nghệ nhân.',
      description: `Set Quà Tặng Tinh Hoa Ong Dú Việt Nam là sự hòa quyện hoàn hảo giữa giá trị chăm sóc sức khỏe trân quý từ rừng nhiệt đới và tính thẩm mỹ sang trọng, trang nhã.

Bộ sản phẩm bao gồm:
1. 01 Chai Mật ong dú rừng nguyên chất 250ml nắp gỗ khắc laser tinh tế.
2. 01 Lọ Keo ong dú tự nhiên dạng giọt cô đặc 30ml.
3. 01 Hũ phấn hoa ong dú sấy lạnh thượng hạng.
4. 01 Muỗng lấy mật ong chuyên dụng bằng gỗ dừa tự nhiên tiện tay.
5. Hộp quà cứng cáp kèm thiệp chúc sức khỏe thiết kế độc quyền từ Ong Dú Việt Nam.`,
      price: 1050000,
      original_price: 1250000,
      volume: 'Hộp quà 4 món cao cấp',
      image_url: '/images/product-giftset.jpg',
      additional_images: JSON.stringify([
        '/images/product-giftset.jpg',
        '/images/product-honey-bottle.jpg'
      ]),
      is_featured: 1,
      is_active: 1,
      in_stock: 1,
      origin: 'Ong Dú Việt Nam',
      ingredients: 'Mật ong dú tự nhiên, keo ong dú thượng hạng, phấn hoa nguyên chất, phụ kiện gỗ dừa tự nhiên.',
      usage_instructions: 'Món quà ý nghĩa dành tặng cha mẹ, đối tác, thầy cô trong các dịp lễ Tết, tri ân.',
      preservation: 'Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp.',
      rating: 5.0,
      review_count: 73,
    },
    {
      name: 'Thùng Nuôi Ong Dú Giống Chuẩn Sinh Thái (Tổ 2 Tầng Thuần Hóa)',
      slug: 'thung-nuoi-ong-du-giong-chuan-sinh-thai',
      category_id: categoryMap['combo-qua-tang-suc-khoe'],
      short_description: 'Thùng nuôi 2 tầng gỗ tuyết tùng tự nhiên, đã có sẵn đàn ong dú khỏe mạnh sung mãn, chúa tơ đang đẻ và tích lũy mật.',
      description: `Thùng nuôi ong dú thông minh 2 tầng thiết kế theo tiêu chuẩn nông nghiệp sinh thái hiện đại, dễ dàng mở nắp quan sát và nhân đàn. Đàn ong có khả năng tự kiếm ăn trong bán kính 1km, không cắn đốt, thân thiện với vườn nhà và ban công.`,
      price: 1850000,
      original_price: 2100000,
      volume: 'Tổ ong giống hoàn chỉnh',
      image_url: '/images/product-hive-box.jpg',
      additional_images: JSON.stringify([
        '/images/product-hive-box.jpg',
        '/images/knowledge-hive-split.jpg'
      ]),
      is_featured: 1,
      is_active: 1,
      in_stock: 1,
      origin: 'Trại giống Ong Dú Việt Nam, Khánh Hòa',
      ingredients: 'Thùng gỗ tự nhiên 2 tầng, đàn ong giống Tetragonula kèm trứng chúa và quân thợ.',
      usage_instructions: 'Đặt nơi râm mát dưới tán cây hoặc hiên nhà, quay cửa tổ về hướng Đông/Đông Nam đón nắng sớm.',
      preservation: 'Tránh ánh nắng gay gắt trực tiếp giữa trưa và nước mưa tạt.',
      rating: 5.0,
      review_count: 46,
    },
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (
      id, name, slug, category_id, short_description, description,
      price, original_price, volume, image_url, additional_images,
      is_featured, is_active, in_stock, origin, ingredients,
      usage_instructions, preservation, rating, review_count
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  for (const prod of (jsonCatalog?.products || products)) {
    const categoryId = prod.category_id || categoryMap[prod.category_slug] || null;
    const additionalImagesStr = Array.isArray(prod.additional_images)
      ? JSON.stringify(prod.additional_images)
      : (typeof prod.additional_images === 'string' ? prod.additional_images : '[]');

    insertProduct.run(
      prod.id || null,
      prod.name,
      prod.slug,
      categoryId,
      prod.short_description,
      prod.description,
      prod.price,
      prod.original_price,
      prod.volume,
      prod.image_url,
      additionalImagesStr,
      prod.is_featured !== undefined ? (prod.is_featured ? 1 : 0) : 0,
      prod.is_active !== undefined ? (prod.is_active ? 1 : 0) : 1,
      prod.in_stock !== undefined ? (prod.in_stock ? 1 : 0) : 1,
      prod.origin || 'Việt Nam',
      prod.ingredients || '',
      prod.usage_instructions || '',
      prod.preservation || '',
      prod.rating || 5.0,
      prod.review_count || 0
    );
  }

  console.log(`[Seed] Seeded ${categories.length} categories and ${(jsonCatalog?.products || products).length} products successfully.`);
}

// Auto seed when executed directly via CLI
if (process.argv[1]?.includes('seed.ts') || process.argv[1]?.includes('seed.js')) {
  seedDatabase(true);
}
