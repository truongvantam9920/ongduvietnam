# 🐝 Ong Dú Việt Nam - Monolith Website Giới Thiệu Sản Phẩm

Website giới thiệu sản phẩm chính thức của **Ong Dú Việt Nam** - Chuyên cung cấp mật ong dú thiên nhiên nguyên chất, keo ong dú thượng hạng, phấn hoa và các chế phẩm tự nhiên cao cấp từ loài ong không ngòi đốt (*Meliponini*) bản địa Việt Nam.

Dự án được xây dựng theo kiến trúc **Monolith hiện đại**, kết hợp Frontend (React 19 + Vite + Tailwind CSS v4) và Backend (Node.js + Express + SQLite + TypeScript) trong cùng một codebase duy nhất, dễ dàng triển khai và vận hành.

---

## 🌟 Tính Năng Chính

### 1. 🏠 Trang Chủ (`/`)
- **Hero Banner sang trọng**: Giới thiệu câu chuyện thương hiệu và thông điệp chất lượng "100% Thuần khiết thiên nhiên - Kháng sinh tự nhiên gấp 5 lần".
- **Về Loài Ong Dú**: Phân tích sự độc đáo của loài ong không ngòi đốt, tập tính làm tổ bằng keo ong (*propolis*) và lý do mật ong dú được mệnh danh là "vàng lỏng".
- **Sản Phẩm Tiêu Biểu**: Trưng bày các dòng sản phẩm mật ong dú và keo ong nổi bật nhất kèm đánh giá sao, nhãn tiết kiệm, nút xem chi tiết và đặt hàng nhanh.
- **6 Giá Trị Dược Tính Khoa Học**: Tăng cường miễn dịch, kháng khuẩn vòm họng, bảo vệ dạ dày & tiêu hóa, đường huyết thấp (*Trehalulose*), chống oxy hóa.
- **Quy Trình Khai Thác Sinh Thái 4 Bước**: Nuôi tự nhiên dưới tán rừng dược liệu Suối Cát (Khánh Hòa) $\rightarrow$ Khai thác hút mật vô trùng $\rightarrow$ Lọc lạnh giữ nguyên men sống $\rightarrow$ Đóng chai thủy tinh sẫm màu cao cấp.
- **Tích hợp Đặt Mua & Tư Vấn**: Nút gọi Hotline `0384 575 593` và kết nối Chat Zalo `0384575593` trực tiếp.

### 2. 🛍️ Trang Sản Phẩm (`/san-pham`)
- **Danh mục phân loại đầy đủ**: Mật Ong Dú Tự Nhiên, Keo Ong Dú Thượng Hạng, Phấn Hoa & Sáp Ong Dú, Combo Quà Tặng Sức Khỏe.
- **Bộ lọc & Tìm kiếm thông minh**:
  - Tìm kiếm theo từ khóa tức thì.
  - Lọc theo từng danh mục sản phẩm (kèm đếm số lượng).
  - Lọc nhanh các sản phẩm đang được ghim "Nổi bật".
  - Sắp xếp theo: Mặc định, Giá tăng dần, Giá giảm dần, Mới nhất, Tên A-Z.
- **Cửa sổ Xem Chi Tiết (Product Detail Modal)**:
  - Xem album ảnh sản phẩm chất lượng cao.
  - Đầy đủ thông tin: Dung tích, Giá bán, Giá gốc, Xuất xứ, Thành phần, Hướng dẫn sử dụng, Hướng dẫn bảo quản.
- **Hộp thoại Đặt Hàng & Tư Vấn (Order Modal)**:
  - Tùy chỉnh số lượng mua $\rightarrow$ Tự động tính tổng tiền VND.
  - Điền nhanh thông tin nhận hàng (Họ tên, SĐT, Địa chỉ, Ghi chú).
  - Tự động tạo tin nhắn đặt hàng chuẩn cấu trúc và mở ứng dụng Zalo chat ngay lập tức.

### 3. 🔐 Trang Quản Trị Ẩn (`/admin`)
- **Đăng nhập bảo mật**: Xác thực tài khoản quản trị bằng JSON Web Token (JWT) và mã hóa mật khẩu `bcryptjs`.
- **Thống kê tổng quan (Dashboard Stats)**: Tổng số sản phẩm, Sản phẩm đang hiển thị, Sản phẩm nổi bật, Hàng tạm hết, Tổng số danh mục.
- **Quản lý Sản Phẩm (Full CRUD)**:
  - **Thêm sản phẩm mới**: Nhập tên, tự động tạo slug, chọn danh mục, giá bán, giá gốc, dung tích, mô tả ngắn, mô tả chi tiết, thành phần, cách dùng, bảo quản.
  - **Tải ảnh trực tiếp lên máy chủ**: Hỗ trợ upload ảnh từ máy tính hoặc dán URL ảnh ngoài, hỗ trợ thêm album ảnh phụ.
  - **Bật/Tắt trạng thái nhanh 1 chạm (Quick Switch)**:
    - 👁️ **Hiển thị/Ẩn sản phẩm** (`is_active`).
    - ✨ **Ghim nổi bật trang chủ** (`is_featured`).
    - 📦 **Chuyển đổi Còn hàng / Tạm hết hàng** (`in_stock`).
  - **Chỉnh sửa & Xóa sản phẩm**: Có hộp thoại xác nhận an toàn trước khi xóa.
- **Quản lý Danh Mục (Category Manager)**:
  - Thêm danh mục mới, chỉnh sửa tên/slug/mô tả, xóa danh mục (tự động giải phóng liên kết sản phẩm).
- **Đổi Mật Khẩu Quản Trị**: Cho phép quản trị viên đổi mật khẩu an toàn bất cứ lúc nào.

---

## 🔑 Tài Khoản Quản Trị Hệ Thống

| Thông tin | Cấu hình |
|---|---|
| **Đường dẫn trang quản trị** | `/admin` (hoặc click icon khóa ở chân trang web) |
| **Tên đăng nhập** | Cấu hình qua biến `ADMIN_USERNAME` trong file `.env` |
| **Mật khẩu** | Cấu hình qua biến `ADMIN_PASSWORD` trong file `.env` |

> [!TIP]
> Không bao giờ commit mật khẩu hoặc file `.env` chứa khóa bí mật lên kho lưu trữ mã nguồn công khai (GitHub).

---

## 📁 Cấu Trúc Mã Nguồn Monolith

```
ongduvietnam/
├── client/                     # Mã nguồn Frontend (React + Vite + Tailwind CSS)
│   ├── index.html              # Template HTML chính với font Playfair Display & Plus Jakarta Sans
│   ├── src/
│   │   ├── main.tsx            # Điểm khởi tạo React DOM
│   │   ├── App.tsx             # Root Component & Điều hướng Router (Home, Products, Admin)
│   │   ├── index.css           # Cấu hình Tailwind CSS v4 & theme màu hổ phách/mật ong
│   │   ├── types/              # TypeScript types (Product, Category, User, Stats, Form)
│   │   ├── services/           # API Client giao tiếp backend (Fetch wrapper + JWT storage)
│   │   ├── context/            # AuthContext (quản lý login/logout) & ToastContext (thông báo)
│   │   ├── components/
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   ├── ui/             # Modal, Badge, ConfirmDialog
│   │   │   ├── home/           # Hero, About, Benefits, FeaturedProducts, Process, CTA
│   │   │   ├── product/        # ProductCard, ProductFilters, ProductDetailModal, OrderContactModal
│   │   │   └── admin/          # AdminStats, ProductFormModal, CategoryManagerModal, ChangePasswordModal
│   │   └── pages/
│   │       ├── HomePage.tsx            # Trang chủ
│   │       ├── ProductsPage.tsx        # Trang danh sách & lọc sản phẩm
│   │       ├── AdminLoginPage.tsx      # Trang đăng nhập quản trị ẩn
│   │       └── AdminDashboardPage.tsx  # Trang điều khiển quản trị sản phẩm
├── server/                     # Mã nguồn Backend (Node.js + Express + SQLite)
│   ├── tsconfig.json           # Cấu hình biên dịch TypeScript cho server
│   └── src/
│       ├── index.ts            # Entry point: Khởi tạo Express, Mount API, Phục vụ tĩnh Monolith
│       ├── config.ts           # Đọc biến môi trường (.env) và cấu hình mặc định
│       ├── db/
│       │   ├── database.ts     # Khởi tạo SQLite (DatabaseSync từ node:sqlite)
│       │   └── seed.ts         # Khởi tạo dữ liệu mẫu thực tế về Mật ong dú & Admin mặc định
│       ├── middleware/
│       │   ├── auth.ts         # Middleware kiểm tra JWT xác thực quyền Admin
│       │   ├── upload.ts       # Middleware Multer xử lý tải ảnh sản phẩm vào thư mục uploads/
│       │   └── errorHandler.ts # Xử lý lỗi toàn cục chuẩn JSON
│       ├── routes/
│       │   ├── auth.routes.ts      # API đăng nhập, xác thực session, đổi mật khẩu
│       │   ├── product.routes.ts   # API lấy danh sách, chi tiết, thêm, sửa, xóa, toggle status, stats
│       │   ├── category.routes.ts  # API danh mục sản phẩm
│       │   └── upload.routes.ts    # API tải lên hình ảnh sản phẩm
│       └── types/              # TypeScript types cho server
├── data/                       # Thư mục chứa cơ sở dữ liệu SQLite (`ongdu.sqlite`)
├── uploads/                    # Thư mục lưu trữ hình ảnh sản phẩm được tải lên
├── dist/                       # Thư mục mã nguồn đã build (dist/client & dist/server)
├── package.json                # Quản lý dependencies và scripts toàn dự án
├── tsconfig.json               # Cấu hình TypeScript gốc
├── vite.config.ts              # Cấu hình Vite & Proxy API
├── .env.example                # File mẫu các biến môi trường
└── .env                        # File biến môi trường đang sử dụng
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Khởi tạo Cơ Sở Dữ Liệu & Seed Dữ Liệu Mẫu
Lệnh này sẽ tự động tạo bảng và nạp 4 danh mục và 8 sản phẩm mẫu thực tế cùng tài khoản admin:
```bash
npm run seed
```

### 3. Chạy Môi Trường Phát Triển (Development Mode)
Chạy cả Backend (Port 5000) và Frontend Vite (Port 3000) đồng thời với 1 lệnh duy nhất:
```bash
npm run dev
```
- Truy cập Website: `http://localhost:3000`
- Trang Quản trị: `http://localhost:3000/admin`
- Backend API: `http://localhost:5000/api`

### 4. Build & Chạy Production (Monolith Mode)
Biên dịch toàn bộ Frontend vào `dist/client` và Backend vào `dist/server`:
```bash
npm run build
npm start
```
Khi chạy lệnh `npm start`, máy chủ Express duy nhất tại cổng `5000` sẽ vừa cung cấp toàn bộ REST API vừa phục vụ ứng dụng web tĩnh và xử lý định tuyến SPA fallback.

---

## 📡 Danh Sách API Endpoints

### 🔐 Xác thực (Authentication)
- `POST /api/auth/login` - Đăng nhập tài khoản quản trị (trả về JWT token).
- `GET /api/auth/me` - Kiểm tra tính hợp lệ của token hiện tại.
- `POST /api/auth/change-password` - Đổi mật khẩu tài khoản quản trị viên.

### 📦 Sản phẩm (Products)
- `GET /api/products` - Lấy danh sách sản phẩm (hỗ trợ `category`, `search`, `featured`, `sort`, `limit`, `offset`).
- `GET /api/products/featured` - Lấy 6 sản phẩm nổi bật cho trang chủ.
- `GET /api/products/:idOrSlug` - Lấy thông tin chi tiết một sản phẩm theo ID hoặc Slug.
- `POST /api/products` *(Admin)* - Tạo sản phẩm mới.
- `PUT /api/products/:id` *(Admin)* - Cập nhật thông tin sản phẩm.
- `PATCH /api/products/:id/toggle` *(Admin)* - Bật/tắt nhanh trạng thái (`is_active`, `is_featured`, `in_stock`).
- `DELETE /api/products/:id` *(Admin)* - Xóa sản phẩm.
- `GET /api/products/admin/stats` *(Admin)* - Thống kê số lượng sản phẩm/danh mục.

### 🗂️ Danh mục (Categories)
- `GET /api/categories` - Lấy danh sách danh mục (kèm số lượng sản phẩm mỗi loại).
- `POST /api/categories` *(Admin)* - Tạo danh mục mới.
- `PUT /api/categories/:id` *(Admin)* - Cập nhật danh mục.
- `DELETE /api/categories/:id` *(Admin)* - Xóa danh mục.

### 🖼️ Tải lên hình ảnh (Uploads)
- `POST /api/upload` *(Admin)* - Tải lên 1 hình ảnh sản phẩm (trả về URL `/uploads/filename`).
- `POST /api/upload/multiple` *(Admin)* - Tải lên nhiều hình ảnh cùng lúc.

---

## 🌿 Bản Quyền & Giấy Phép
Dự án được xây dựng và phát triển cho thương hiệu **Ong Dú Việt Nam**. Mọi quyền được bảo lưu.
