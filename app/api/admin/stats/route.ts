import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { Product } from "@/models/Product";

export async function GET(request: NextRequest) {
   try {
      await connectDB();

      // Lấy tổng số người dùng
      const totalUsers = await User.countDocuments();

      // Lấy số sản phẩm đang hoạt động
      const activeProducts = await Product.countDocuments({
         status: "approved",
      });

      // Lấy số sản phẩm đang chờ duyệt
      const pendingProducts = await Product.countDocuments({
         status: "pending",
      });

      // Lấy tổng doanh thu từ thuế của các order đã thanh toán
      const totalRevenue = await Order.aggregate([
         { $match: { isPaid: true } },
         { $group: { _id: null, totalTax: { $sum: "$taxPrice" } } },
      ]);

      const revenue = totalRevenue.length > 0 ? totalRevenue[0].totalTax : 0;

      // Tính phần trăm thay đổi (so với tháng trước)
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const lastMonthRevenue = await Order.aggregate([
         {
            $match: {
               isPaid: true,
               paidAt: { $gte: lastMonth },
            },
         },
         { $group: { _id: null, totalTax: { $sum: "$taxPrice" } } },
      ]);

      const lastMonthTotal =
         lastMonthRevenue.length > 0 ? lastMonthRevenue[0].totalTax : 0;
      const revenueChange =
         lastMonthTotal > 0
            ? (((revenue - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1)
            : "0.0";

      // Dữ liệu cho biểu đồ doanh thu theo tháng (6 tháng gần nhất)
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

      // Dữ liệu cho biểu đồ sản phẩm theo danh mục
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

      // Dữ liệu cho biểu đồ order theo trạng thái
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

      // Dữ liệu cho biểu đồ doanh thu theo ngày (7 ngày gần nhất)
      const dailyRevenue = await Order.aggregate([
         { $match: { isPaid: true } },
         {
            $group: {
               _id: {
                  year: { $year: "$paidAt" },
                  month: { $month: "$paidAt" },
                  day: { $dayOfMonth: "$paidAt" },
               },
               revenue: { $sum: "$taxPrice" },
            },
         },
         { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
         { $limit: 7 },
      ]);

      // Thống kê bổ sung cho QuickStats
      const totalOrders = await Order.countDocuments();
      const completedOrders = await Order.countDocuments({
         isPaid: true,
         isDelivered: true,
      });

      const averageOrderValue = await Order.aggregate([
         { $match: { isPaid: true } },
         { $group: { _id: null, avgValue: { $avg: "$totalPrice" } } },
      ]);

      const topCategoryData = await Product.aggregate([
         { $match: { status: "approved" } },
         { $group: { _id: "$category", count: { $sum: 1 } } },
         { $sort: { count: -1 } },
         { $limit: 1 },
      ]);

      // Lấy người dùng gần đây
      const recentUsers = await User.find()
         .sort({ createdAt: -1 })
         .limit(4)
         .select("firstName lastName email createdAt isActive");

      // Lấy sản phẩm đang chờ duyệt
      const pendingProductsList = await Product.find({ status: "pending" })
         .sort({ createdAt: -1 })
         .limit(3)
         .populate("seller", "firstName lastName");

      // Xử lý dữ liệu biểu đồ
      const chartData = {
         monthlyRevenue: monthlyRevenue.map((item) => ({
            month: `${item._id.month}/${item._id.year}`,
            revenue: item.revenue,
         })),
         productsByCategory: productsByCategory.map((item) => ({
            category: item._id,
            count: item.count,
         })),
         ordersByStatus: ordersByStatus.map((item) => {
            let status = "Chờ thanh toán";
            if (item._id.isPaid && item._id.isDelivered)
               status = "Đã giao hàng";
            else if (item._id.isPaid) status = "Đã thanh toán";
            return { status, count: item.count };
         }),
         dailyRevenue: dailyRevenue.map((item) => ({
            date: `${item._id.day}/${item._id.month}`,
            revenue: item.revenue,
         })),
      };

      const stats = {
         totalUsers,
         activeProducts,
         pendingProducts,
         totalRevenue: revenue,
         revenueChange:
            revenue > lastMonthTotal
               ? `+${revenueChange}%`
               : `${revenueChange}%`,
         totalOrders,
         completedOrders,
         averageOrderValue:
            averageOrderValue.length > 0 ? averageOrderValue[0].avgValue : 0,
         topCategory:
            topCategoryData.length > 0 ? topCategoryData[0]._id : "N/A",
         chartData,
         recentUsers: recentUsers.map((user) => ({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            joined: user.createdAt.toLocaleDateString("vi-VN", {
               year: "numeric",
               month: "long",
               day: "numeric",
            }),
            status: user.isActive ? "active" : "inactive",
         })),
         pendingProductsList: pendingProductsList.map((product) => ({
            id: product._id,
            name: product.name,
            seller:
               product.seller && typeof product.seller === "object"
                  ? `${(product.seller as any).firstName} ${
                       (product.seller as any).lastName
                    }`
                  : "Unknown",
            category: product.category,
            price: `$${product.price.toFixed(2)}`,
            submitted: product.createdAt.toLocaleDateString("vi-VN", {
               year: "numeric",
               month: "long",
               day: "numeric",
            }),
         })),
      };

      return NextResponse.json(stats);
   } catch (error) {
      console.error("Error fetching admin stats:", error);
      return NextResponse.json(
         { error: "Failed to fetch admin statistics" },
         { status: 500 }
      );
   }
}
