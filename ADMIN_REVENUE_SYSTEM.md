# Hệ thống Tính Doanh Thu Admin Dashboard

## Tổng quan

Trong admin dashboard, **Total Revenue** được tính dựa trên thuế sản phẩm (`taxPrice`) của tất cả các đơn hàng đã thanh toán (`isPaid: true`).

## Cách tính Total Revenue

### 1. Nguồn dữ liệu

-  **Model**: `Order`
-  **Trường**: `taxPrice` (thuế sản phẩm)
-  **Điều kiện**: `isPaid: true` (chỉ tính các order đã thanh toán)

### 2. Công thức tính

```javascript
// MongoDB Aggregation
const totalRevenue = await Order.aggregate([
   { $match: { isPaid: true } },
   { $group: { _id: null, totalTax: { $sum: "$taxPrice" } } },
]);
```

### 3. API Endpoint

-  **URL**: `/api/admin/stats`
-  **Method**: `GET`
-  **Response**:

```json
{
   "totalRevenue": 24500,
   "revenueChange": "+12.1%"
   // ... other stats
}
```

## Cấu trúc dữ liệu Order

```typescript
interface IOrder {
   // ... other fields
   itemsPrice: number; // Giá sản phẩm
   shippingPrice: number; // Phí vận chuyển
   taxPrice: number; // Thuế sản phẩm ← Đây là nguồn tính revenue
   totalPrice: number; // Tổng giá trị
   isPaid: boolean; // Đã thanh toán chưa
   paidAt?: Date; // Thời gian thanh toán
}
```

## Dashboard Display

### Total Revenue Card

-  **Label**: "Tổng doanh thu (từ thuế)"
-  **Value**: `$${totalRevenue.toLocaleString()}`
-  **Icon**: 💰
-  **Change**: Phần trăm thay đổi so với tháng trước

### Ví dụ hiển thị

```
Tổng doanh thu (từ thuế)
$24,500
+12.1% từ tháng trước
```

## Tính năng bổ sung

### 1. So sánh tháng trước

-  Tính toán phần trăm thay đổi so với tháng trước
-  Hiển thị dấu + hoặc - tùy theo xu hướng

### 2. Real-time Data

-  Dashboard tự động cập nhật khi có order mới thanh toán
-  Sử dụng React hooks để fetch data

### 3. Error Handling

-  Loading state khi đang tải dữ liệu
-  Error state khi có lỗi
-  Fallback khi không có dữ liệu

## Bảo mật

-  API được bảo vệ bởi middleware
-  Chỉ admin mới có quyền truy cập
-  Validation dữ liệu đầu vào

## Testing

Chạy script test để kiểm tra API:

```bash
node scripts/test-admin-stats.js
```

## Lưu ý quan trọng

1. **Chỉ tính order đã thanh toán**: Revenue chỉ được tính từ các order có `isPaid: true`
2. **Thuế sản phẩm**: Sử dụng `taxPrice` thay vì `totalPrice` để tính revenue
3. **Định dạng tiền tệ**: Hiển thị theo format USD với dấu phẩy ngăn cách hàng nghìn
4. **Cập nhật real-time**: Dashboard sẽ tự động refresh khi có dữ liệu mới
