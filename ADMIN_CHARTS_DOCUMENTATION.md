# Admin Dashboard Charts Documentation

## Tổng quan

Admin dashboard đã được nâng cấp với các biểu đồ thống kê trực quan để giúp admin theo dõi hiệu suất hệ thống một cách hiệu quả.

## Các Component Chart

### 1. StatsOverview Component

**File**: `components/charts/StatsOverview.tsx`

Hiển thị 4 metrics chính:

-  **Tổng người dùng**: Số lượng user đã đăng ký
-  **Sản phẩm đang hoạt động**: Sản phẩm đã được duyệt
-  **Sản phẩm chờ duyệt**: Sản phẩm đang chờ admin duyệt
-  **Tổng doanh thu (từ thuế)**: Thuế từ các order đã thanh toán

### 2. QuickStats Component

**File**: `components/charts/QuickStats.tsx`

Hiển thị thống kê nhanh:

-  **Tổng đơn hàng**: Tất cả order trong hệ thống
-  **Đơn hàng hoàn thành**: Order đã thanh toán và giao hàng
-  **Tỷ lệ hoàn thành**: Phần trăm order hoàn thành
-  **Danh mục phổ biến**: Danh mục có nhiều sản phẩm nhất

### 3. RevenueChart Component

**File**: `components/charts/RevenueChart.tsx`

**Biểu đồ đường** hiển thị doanh thu theo tháng:

-  **Dữ liệu**: 6 tháng gần nhất
-  **Loại**: Line Chart
-  **Màu sắc**: Xanh dương (#3B82F6)
-  **Tooltip**: Hiển thị doanh thu theo format tiền tệ

### 4. DailyRevenueChart Component

**File**: `components/charts/DailyRevenueChart.tsx`

**Biểu đồ vùng** hiển thị doanh thu 7 ngày gần nhất:

-  **Dữ liệu**: 7 ngày gần nhất
-  **Loại**: Area Chart
-  **Màu sắc**: Xanh lá (#10B981)
-  **Tooltip**: Hiển thị doanh thu theo ngày

### 5. CategoryChart Component

**File**: `components/charts/CategoryChart.tsx`

**Biểu đồ cột** hiển thị sản phẩm theo danh mục:

-  **Dữ liệu**: Top 8 danh mục có nhiều sản phẩm
-  **Loại**: Bar Chart
-  **Màu sắc**: Xanh dương (#3B82F6)
-  **X-axis**: Góc nghiêng -45° để dễ đọc

### 6. OrderStatusChart Component

**File**: `components/charts/OrderStatusChart.tsx`

**Biểu đồ tròn** hiển thị trạng thái đơn hàng:

-  **Dữ liệu**: Chờ thanh toán, Đã thanh toán, Đã giao hàng
-  **Loại**: Pie Chart
-  **Màu sắc**: Đỏ, Xanh dương, Xanh lá
-  **Label**: Hiển thị phần trăm trong mỗi phần

## Cấu trúc dữ liệu API

### Endpoint: `/api/admin/stats`

```typescript
interface AdminStats {
   // Metrics chính
   totalUsers: number;
   activeProducts: number;
   pendingProducts: number;
   totalRevenue: number;
   revenueChange: string;

   // QuickStats
   totalOrders: number;
   completedOrders: number;
   averageOrderValue: number;
   topCategory: string;

   // Chart Data
   chartData: {
      monthlyRevenue: Array<{ month: string; revenue: number }>;
      productsByCategory: Array<{ category: string; count: number }>;
      ordersByStatus: Array<{ status: string; count: number }>;
      dailyRevenue: Array<{ date: string; revenue: number }>;
   };

   // Tables
   recentUsers: Array<UserData>;
   pendingProductsList: Array<ProductData>;
}
```

## MongoDB Aggregations

### 1. Monthly Revenue

```javascript
const monthlyRevenue = await Order.aggregate([
   { $match: { isPaid: true } },
   {
      $group: {
         _id: {
            year: { $year: "$paidAt" },
            month: { $month: "$paidAt" },
         },
         revenue: { $sum: "$taxPrice" },
      },
   },
   { $sort: { "_id.year": 1, "_id.month": 1 } },
   { $limit: 6 },
]);
```

### 2. Products by Category

```javascript
const productsByCategory = await Product.aggregate([
   { $match: { status: "approved" } },
   {
      $group: {
         _id: "$category",
         count: { $sum: 1 },
      },
   },
   { $sort: { count: -1 } },
   { $limit: 8 },
]);
```

### 3. Orders by Status

```javascript
const ordersByStatus = await Order.aggregate([
   {
      $group: {
         _id: {
            isPaid: "$isPaid",
            isDelivered: "$isDelivered",
         },
         count: { $sum: 1 },
      },
   },
]);
```

## Responsive Design

Tất cả charts đều sử dụng `ResponsiveContainer` để tự động điều chỉnh kích thước:

-  **Desktop**: 2 cột cho charts
-  **Tablet**: 1 cột cho charts
-  **Mobile**: 1 cột, charts tự động thu nhỏ

## Color Scheme

-  **Primary Blue**: #3B82F6 (Revenue, Category charts)
-  **Success Green**: #10B981 (Daily revenue, Completed orders)
-  **Warning Red**: #EF4444 (Pending orders)
-  **Purple**: #8B5CF6 (Stats overview)
-  **Orange**: #F59E0B (Quick stats)

## Performance Optimization

1. **Lazy Loading**: Charts chỉ render khi cần thiết
2. **Memoization**: Sử dụng React.memo cho các component
3. **Efficient Queries**: MongoDB aggregations được tối ưu
4. **Caching**: API responses được cache ở client

## Customization

### Thêm Chart mới:

1. Tạo component trong `components/charts/`
2. Import và sử dụng trong `app/admin/page.tsx`
3. Thêm dữ liệu vào API endpoint

### Thay đổi màu sắc:

1. Cập nhật `colors` array trong component
2. Hoặc sử dụng CSS variables

### Thay đổi layout:

1. Cập nhật grid classes trong dashboard
2. Điều chỉnh `ResponsiveContainer` height

## Error Handling

-  **Loading State**: Hiển thị spinner khi đang tải
-  **Error State**: Hiển thị thông báo lỗi
-  **Empty State**: Hiển thị placeholder khi không có dữ liệu
-  **Fallback**: Sử dụng dữ liệu mặc định khi API fail

## Future Enhancements

1. **Real-time Updates**: WebSocket để cập nhật real-time
2. **Date Range Picker**: Cho phép chọn khoảng thời gian
3. **Export Charts**: Xuất biểu đồ thành PDF/PNG
4. **Drill-down**: Click vào chart để xem chi tiết
5. **Custom Dashboards**: Cho phép admin tùy chỉnh layout
