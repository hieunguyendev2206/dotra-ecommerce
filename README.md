# DOTRA - Nền tảng Thương mại Điện tử Đa nhà cung cấp

<div align="center">
  <img src="https://github.com/user-attachments/assets/d37728ba-d70a-4b8a-bcd7-86922f662891" alt="Dotra E-commerce" width="600px"/>
  
  <p>
    <a href="#giới-thiệu"><strong>Giới thiệu »</strong></a> ·
    <a href="#công-nghệ-sử-dụng"><strong>Công nghệ »</strong></a> ·
    <a href="#tính-năng"><strong>Tính năng »</strong></a> ·
    <a href="#cài-đặt"><strong>Cài đặt »</strong></a> ·
    <a href="#sử-dụng"><strong>Sử dụng »</strong></a> ·
    <a href="#đóng-góp"><strong>Đóng góp »</strong></a>
  </p>
</div>

## 📋 Giới thiệu

Dotra là một nền tảng thương mại điện tử đa nhà cung cấp hiện đại, được xây dựng trên MERN Stack (MongoDB, Express, React, Node.js). Dự án cho phép nhiều nhà cung cấp đăng ký và bán sản phẩm của họ trên cùng một nền tảng, với đầy đủ tính năng của một hệ thống thương mại điện tử chuyên nghiệp.

### 📦 Tính năng chính

- 🔐 **Xác thực đa cấp**: Hệ thống phân quyền cho Người dùng, Nhà cung cấp, và Admin
- 🛒 **Quản lý sản phẩm toàn diện**: Thêm, sửa, xóa và quản lý sản phẩm với các thuộc tính đa dạng
- 💳 **Tích hợp thanh toán**: Hỗ trợ đa nền tảng thanh toán (Stripe, PayPal)
- 💬 **Chat trực tiếp**: Hệ thống chat thời gian thực giữa người mua và nhà cung cấp
- 📊 **Thống kê và báo cáo**: Biểu đồ và báo cáo chi tiết cho nhà cung cấp và admin
- 🔍 **Tìm kiếm và lọc nâng cao**: Hỗ trợ lọc đa chiều và tìm kiếm thông minh
- 📱 **Thiết kế Responsive**: Trải nghiệm tối ưu trên mọi thiết bị

## 🖼️ Demo

<div align="center">
  <table>
    <tr>
      <td align="center"><strong>Trang chủ</strong></td>
      <td align="center"><strong>Chi tiết sản phẩm</strong></td>
    </tr>
    <tr>
      <td><img src="https://res.cloudinary.com/dhtjbo5g2/image/upload/v1752404801/github-portfolio/home-page_iknpl4.png" alt="Trang chủ"/></td>
      <td><img src="https://res.cloudinary.com/dhtjbo5g2/image/upload/v1752404801/github-portfolio/product-detail-page_trjqp8.png" alt="Chi tiết sản phẩm"/></td>
    </tr>
    <tr>
      <td align="center"><strong>Bảng điều khiển</strong></td>
      <td align="center"><strong>Thanh toán</strong></td>
    </tr>
    <tr>
      <td><img src="https://res.cloudinary.com/dhtjbo5g2/image/upload/v1752404801/github-portfolio/dashboard_vvv2bl.png" alt="Bảng điều khiển"/></td>
      <td><img src="https://res.cloudinary.com/dhtjbo5g2/image/upload/v1752404801/github-portfolio/payment-page_ftrcqq.png" alt="Thanh toán"/></td>
    </tr>
  </table>
</div>

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js & Express**: Xây dựng RESTful API
- **MongoDB**: Cơ sở dữ liệu NoSQL
- **JWT Authentication**: Xác thực và phân quyền
- **Socket.io**: Giao tiếp thời gian thực
- **Stripe & PayPal API**: Tích hợp cổng thanh toán
- **Nodemailer**: Gửi email tự động
- **Cloudinary**: Quản lý hình ảnh

### Frontend
- **React**: Thư viện UI
- **Redux Toolkit**: Quản lý state
- **Tailwind CSS**: Framework CSS
- **Framer Motion**: Animations
- **Socket.io Client**: Kết nối thời gian thực
- **React Router**: Định tuyến
- **Axios**: HTTP client
- **CKEditor**: Trình soạn thảo văn bản
- **Swiper**: Slider component

### Admin Dashboard
- **React**: Thư viện UI
- **Redux Toolkit**: Quản lý state
- **Tailwind CSS**: Framework CSS
- **DaisyUI**: Component library

### DevOps
- **Docker**: Containerization
- **Nginx**: Web server và reverse proxy

## 🏗️ Cấu trúc dự án

Dự án được chia thành ba phần chính:

```
dotra/
├── frontend/         # Giao diện người dùng
│   ├── src/          # Mã nguồn React
│   ├── public/       # Tài nguyên tĩnh
│   └── ...
│
├── admin/            # Bảng điều khiển quản trị
│   ├── src/          # Mã nguồn React
│   ├── public/       # Tài nguyên tĩnh
│   └── ...
│
├── backend/          # API và logic nghiệp vụ
│   ├── controllers/  # Xử lý logic
│   ├── routes/       # Định tuyến API
│   ├── models/       # Schema dữ liệu
│   ├── middlewares/  # Middleware
│   ├── utils/        # Tiện ích
│   └── ...
│
└── nginx/            # Cấu hình Nginx
```

## 🚀 Cài đặt

### Yêu cầu hệ thống
- Node.js (v18+)
- npm hoặc yarn
- MongoDB
- Docker & Docker Compose (tùy chọn)

### Cài đặt thủ công

1. Clone repository:
```bash
git clone https://github.com/hieunguyendev2206/dotra-ecommerce.git
cd dotra-ecommerce
```

2. Cài đặt dependencies:
```bash
# Cài đặt dependencies chung
npm install

# Cài đặt dependencies cho backend
cd backend
npm install

# Cài đặt dependencies cho frontend
cd ../frontend
npm install

# Cài đặt dependencies cho admin
cd ../admin
npm install
```

3. Cấu hình biến môi trường:
   Tạo file `.env` trong các thư mục tương ứng với nội dung sau:

   **Backend (.env)**
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret
   PAYPAL_CLIENT_ID=your_paypal_client_id
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

   **Frontend & Admin (.env)**
   ```
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. Khởi động ứng dụng:
```bash
# Khởi động backend
cd backend
npm run server

# Khởi động frontend
cd ../frontend
npm run dev

# Khởi động admin
cd ../admin
npm run dev
```

### Cài đặt bằng Docker

Sử dụng Docker Compose để khởi động toàn bộ ứng dụng:

```bash
docker-compose up
```

Sau khi khởi động, các dịch vụ sẽ có sẵn tại:
- Frontend: http://localhost:3001
- Admin Dashboard: http://localhost:3000
- Backend API: http://localhost:5000
- Nginx: http://localhost

## 📝 Sử dụng

### Tài khoản demo

- **Admin**: admin@dotra.com (Mật khẩu: admin123) | Truy cập trang Admin: https://admin-topaz-three.vercel.app
- **Nhà cung cấp**: vendor@dotra.com (Mật khẩu: vendor123) | Truy cập trang Nhà cung cấp: https://admin-topaz-three.vercel.app
- **Người dùng**: user@dotra.com (Mật khẩu: user123) | Truy cập trang chủ: https://dotra-home.vercel.app

### Quy trình sử dụng

1. **Đăng ký/Đăng nhập**: Tạo tài khoản mới hoặc đăng nhập với tài khoản hiện có
2. **Duyệt sản phẩm**: Xem danh sách sản phẩm, lọc và tìm kiếm
3. **Thêm vào giỏ hàng**: Chọn sản phẩm và thêm vào giỏ hàng
4. **Thanh toán**: Hoàn tất quá trình mua hàng qua các cổng thanh toán

### Dành cho nhà cung cấp

1. **Đăng ký làm nhà cung cấp**: Nâng cấp tài khoản thành nhà cung cấp
2. **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm
3. **Xử lý đơn hàng**: Quản lý và cập nhật trạng thái đơn hàng
4. **Phân tích thống kê**: Xem báo cáo doanh thu và hiệu suất

## 🔄 Kế hoạch phát triển

- [ ] Tích hợp thêm các phương thức thanh toán mới
- [ ] Thêm tính năng đánh giá và nhận xét sản phẩm
- [ ] Xây dựng ứng dụng di động (React Native)
- [ ] Tối ưu hóa SEO
- [ ] Thêm hỗ trợ đa ngôn ngữ
- [ ] Tích hợp AI để gợi ý sản phẩm

## 🤝 Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp để cải thiện dự án Dotra. Để đóng góp:

1. Fork dự án
2. Tạo nhánh tính năng (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi (`git commit -m 'Add some amazing feature'`)
4. Push lên nhánh (`git push origin feature/amazing-feature`)
5. Mở Pull Request

### Quy trình đóng góp

- Tuân thủ coding style và format
- Viết unit test cho các tính năng mới
- Cập nhật tài liệu nếu cần thiết
- Đảm bảo mã nguồn đã được kiểm tra lỗi

## 📚 Tài liệu tham khảo

- [Tài liệu MongoDB](https://docs.mongodb.com/)
- [Tài liệu React](https://reactjs.org/docs/getting-started.html)
- [Tài liệu Tailwind CSS](https://tailwindcss.com/docs)
- [Tài liệu Node.js](https://nodejs.org/en/docs/)
- [Tài liệu Stripe API](https://stripe.com/docs/api)
- [Tài liệu PayPal API](https://developer.paypal.com/docs/api/overview/)

## 👨‍💻 Tác giả

Phát triển bởi [HieuNguyenDev](https://github.com/hieunguyendev2206)

## 📄 Giấy phép

Dự án này được cấp phép theo [Giấy phép ISC](LICENSE).
