# Hướng dẫn sử dụng hệ thống gói dịch vụ

## Tổng quan

Hệ thống gói dịch vụ cho phép người dùng đăng ký các gói khác nhau để sử dụng các tính năng nâng cao của nền tảng U2U E-commerce.

## Các gói dịch vụ

### 1. Gói Cơ Bản (Basic) - Miễn phí

-   **Giá**: Miễn phí
-   **Thời hạn**: 30 ngày
-   **Tính năng**:
    -   Đăng 5 tin/tháng
    -   Sử dụng AI định giá 3 lần/tháng
    -   Không có tính năng đẩy tin

### 2. Gói Pro - 50.000₫

-   **Giá**: 50.000₫
-   **Thời hạn**: 30 ngày
-   **Tính năng**:
    -   Đăng 15 tin/tháng
    -   Đẩy 3 tin trong 3 ngày
    -   Sử dụng AI định giá 3-5 lần/ngày
    -   Kiểm duyệt nhanh

### 3. Gói VIP - 150.000₫

-   **Giá**: 150.000₫
-   **Thời hạn**: 30 ngày
-   **Tính năng**:
    -   Đăng tin không giới hạn
    -   Đẩy 7 tin trong 7 ngày
    -   Sử dụng AI định giá không giới hạn
    -   Kiểm duyệt nhanh trong 1h
    -   Ưu tiên hiển thị
    -   Báo cáo hiệu suất

### 4. Gói Đẩy Tin Lẻ - 20.000₫/tin

-   **Giá**: 20.000₫/tin (mua 5 tin trở lên: 75.000₫/5 tin)
-   **Thời hạn**: 7 ngày
-   **Tính năng**:
    -   Đẩy 5 tin trong 7 ngày
    -   Đẩy tin theo từ khóa
    -   Cá nhân hóa tìm kiếm

## Cách sử dụng

### 1. Đăng ký gói

1. Truy cập trang `/pricing`
2. Chọn gói phù hợp
3. Nhấn "Đăng ký ngay"
4. Nếu là gói trả phí, sẽ được chuyển hướng đến VNPay
5. Sau khi thanh toán thành công, gói sẽ được kích hoạt

### 2. Xem trạng thái gói

-   Trong dropdown menu của user (góc trên bên phải)
-   Trên trang pricing
-   Thông báo cố định ở góc trên bên phải màn hình

### 3. Kiểm tra quyền sử dụng

-   AI credits: Số lần còn lại có thể sử dụng AI định giá
-   Push credits: Số lần còn lại có thể đẩy tin
-   Trạng thái active: Gói có đang hoạt động hay không

## API Endpoints

### 1. Đăng ký gói

```
POST /api/payment/subscription
Body: { planId: "basic" | "pro" | "vip" | "push-single" }
```

### 2. Lấy thông tin gói

```
GET /api/user/subscription
```

### 3. Callback thanh toán

```
GET /api/payment/subscription/callback
```

### 4. Kiểm tra trạng thái gói (Cron job)

```
GET /api/cron/check-subscriptions
Headers: { Authorization: "Bearer CRON_SECRET_KEY" }
```

## Cấu hình

### Environment Variables

```env
# VNPay Configuration
VNPAY_TMN_CODE=your_merchant_code
VNPAY_HASH_SECRET=your_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/api/payment/subscription/callback

# Cron Job
CRON_SECRET_KEY=your_cron_secret_key
```

### Database Schema

```javascript
subscription: {
  plan: "basic" | "pro" | "vip",
  startDate: Date,
  endDate: Date,
  isActive: Boolean,
  pushCredits: Number,
  aiCredits: Number
}
```

## Cron Jobs

### Kiểm tra trạng thái gói hàng ngày

```bash
# Chạy hàng ngày lúc 00:00
curl -H "Authorization: Bearer YOUR_CRON_SECRET_KEY" \
     http://localhost:3000/api/cron/check-subscriptions
```

## Scripts

### Khởi tạo gói cơ bản cho user hiện có

```bash
node scripts/init-subscriptions.js
```

## Components

### 1. SubscriptionStatus

Hiển thị thông tin chi tiết về gói hiện tại

### 2. SubscriptionBadge

Hiển thị badge nhỏ trong dropdown menu

### 3. SubscriptionNotification

Thông báo cố định ở góc màn hình

### 4. useSubscription Hook

Hook để quản lý state của subscription

## Lưu ý

1. Gói Basic được kích hoạt ngay lập tức
2. Các gói trả phí cần thanh toán qua VNPay
3. AI credits được reset hàng tháng cho gói Basic
4. Gói hết hạn sẽ tự động bị vô hiệu hóa
5. Push credits chỉ có ở gói Pro, VIP và Push Single
