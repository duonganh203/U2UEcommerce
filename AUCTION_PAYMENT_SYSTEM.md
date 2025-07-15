# Hệ thống Thanh toán Đấu giá

## Tổng quan

Hệ thống thanh toán đấu giá cho phép người thắng cuộc đấu giá tạo đơn hàng thanh toán và thanh toán qua VNPay. Hệ thống được tích hợp hoàn toàn với hệ thống đấu giá hiện có.

## Tính năng chính

### 1. Tự động xác định người thắng

-  Khi auction kết thúc, hệ thống tự động xác định người thắng dựa trên giá cao nhất
-  Cập nhật trạng thái auction thành "ended" và lưu thông tin người thắng

### 2. Tạo đơn hàng thanh toán

-  Người thắng có thể tạo đơn hàng thanh toán cho auction đã thắng
-  Hệ thống tính toán phí vận chuyển và thuế tự động
-  Tích hợp với VNPay để thanh toán

### 3. Quản lý trạng thái thanh toán

-  Hiển thị trạng thái thanh toán: chưa thanh toán, đã thanh toán, đã giao hàng
-  Theo dõi lịch sử thanh toán và giao hàng

## Cấu trúc API

### 1. Tạo đơn hàng thanh toán đấu giá

```
POST /api/auction-orders/[auctionId]
```

**Yêu cầu:**

-  User phải là người thắng cuộc đấu giá
-  Auction phải đã kết thúc và có người thắng

**Response:**

```json
{
   "success": true,
   "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
   "orderId": "order_id",
   "txnRef": "AUCTION_auctionId_orderId_timestamp",
   "auctionId": "auction_id",
   "auctionTitle": "Auction Title",
   "winnerAmount": 28000000,
   "totalPrice": 30240000
}
```

### 2. Lấy thông tin thanh toán đấu giá

```
GET /api/auction-orders/[auctionId]
```

**Response:**

```json
{
   "auction": {
      "_id": "auction_id",
      "title": "Auction Title",
      "winnerAmount": 28000000,
      "status": "ended",
      "endTime": "2024-01-01T00:00:00.000Z"
   },
   "existingOrder": {
      "_id": "order_id",
      "totalPrice": 30240000,
      "isPaid": false,
      "isDelivered": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
   }
}
```

### 3. Lấy danh sách auction đã thắng

```
GET /api/auctions/won
```

**Response:**

```json
{
   "success": true,
   "auctions": [
      {
         "_id": "auction_id",
         "title": "Auction Title",
         "winnerAmount": 28000000,
         "status": "ended",
         "endTime": "2024-01-01T00:00:00.000Z"
      }
   ],
   "count": 1
}
```

## Components

### 1. AuctionPaymentButton

Component hiển thị nút thanh toán cho người thắng cuộc đấu giá.

**Props:**

-  `auctionId`: ID của auction

**Trạng thái:**

-  Chưa có đơn hàng: Hiển thị nút "Tạo đơn hàng thanh toán"
-  Có đơn hàng chưa thanh toán: Hiển thị nút "Thanh toán ngay"
-  Đã thanh toán: Hiển thị thông tin đã thanh toán

### 2. WonAuctions

Component hiển thị danh sách các auction đã thắng trong dashboard.

**Tính năng:**

-  Hiển thị danh sách auction đã thắng
-  Trạng thái thanh toán cho từng auction
-  Nút thanh toán nhanh
-  Link đến trang chi tiết auction

## Luồng thanh toán

### 1. Auction kết thúc

1. Cron job chạy và cập nhật trạng thái auction thành "ended"
2. Xác định người thắng dựa trên giá cao nhất
3. Cập nhật thông tin winner và winnerAmount

### 2. Người thắng tạo đơn hàng

1. Người thắng vào trang chi tiết auction
2. Nhấn nút "Tạo đơn hàng thanh toán"
3. Hệ thống tạo Order với thông tin auction
4. Tạo URL thanh toán VNPay
5. Chuyển hướng đến trang thanh toán VNPay

### 3. Thanh toán

1. User thanh toán trên VNPay
2. VNPay callback về hệ thống
3. Cập nhật trạng thái Order thành "đã thanh toán"
4. Chuyển hướng về trang success

## Cấu hình

### VNPay Configuration

```javascript
const VNPAY_TMN_CODE = "UDPRUCJX"; // Test merchant code
const VNPAY_HASH_SECRET = "DLZ5B0HXFL9GQQSE6M0YSVTMGLZPB5WQ"; // Test hash secret
const VNPAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // Test URL
const VNPAY_RETURN_URL = "http://localhost:3000/api/payment/vnpay/callback"; // Callback URL
```

### Tính toán giá

-  **Giá sản phẩm**: Giá thắng cuộc đấu giá
-  **Phí vận chuyển**: Miễn phí cho đơn hàng > 500k, 50k cho đơn hàng ≤ 500k
-  **Thuế**: 8% giá sản phẩm
-  **Tổng tiền**: Giá sản phẩm + Phí vận chuyển + Thuế

## Testing

### Chạy script test

```bash
node scripts/test-auction-payment.js
```

Script này sẽ:

1. Tạo user test với email: test@example.com, password: password123
2. Tạo auction test đã kết thúc với user test là người thắng
3. Cung cấp thông tin để test hệ thống

### Test thủ công

1. Đăng nhập với tài khoản test
2. Vào dashboard để xem danh sách auction đã thắng
3. Click vào auction để xem nút thanh toán
4. Test luồng thanh toán

## Lưu ý quan trọng

1. **Bảo mật**: Chỉ người thắng cuộc mới có thể tạo đơn hàng thanh toán
2. **Trùng lặp**: Hệ thống kiểm tra và ngăn chặn tạo đơn hàng trùng lặp
3. **Callback**: VNPay callback được cập nhật để xử lý cả order thường và auction order
4. **Database**: Model Order được cập nhật để cho phép product field null cho auction orders

## Troubleshooting

### Lỗi thường gặp

1. **"Only the auction winner can create payment order"**: User không phải người thắng
2. **"Payment order already exists"**: Đã có đơn hàng cho auction này
3. **"Auction has not ended yet"**: Auction chưa kết thúc

### Debug

-  Kiểm tra console log để xem thông tin debug
-  Kiểm tra trạng thái auction trong database
-  Kiểm tra thông tin user và winner
