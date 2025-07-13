"use client";

import React, { useState } from "react";

const OrdersPage = () => {
   // Mock data for demonstration
   const initialOrders = [
      {
         id: "ORD-1001",
         customer: "John Smith",
         email: "john@example.com",
         date: "June 1, 2025",
         total: "$129.99",
         status: "completed",
         items: 2,
      },
      {
         id: "ORD-1002",
         customer: "Sarah Johnson",
         email: "sarah@example.com",
         date: "May 31, 2025",
         total: "$89.50",
         status: "processing",
         items: 3,
      },
      {
         id: "ORD-1003",
         customer: "Michael Brown",
         email: "michael@example.com",
         date: "May 30, 2025",
         total: "$45.99",
         status: "pending",
         items: 1,
      },
      {
         id: "ORD-1004",
         customer: "Emily Davis",
         email: "emily@example.com",
         date: "May 28, 2025",
         total: "$199.95",
         status: "completed",
         items: 4,
      },
      {
         id: "ORD-1005",
         customer: "Robert Wilson",
         email: "robert@example.com",
         date: "May 27, 2025",
         total: "$75.50",
         status: "cancelled",
         items: 2,
      },
      {
         id: "ORD-1006",
         customer: "Jennifer Lee",
         email: "jennifer@example.com",
         date: "May 26, 2025",
         total: "$149.99",
         status: "completed",
         items: 1,
      },
      {
         id: "ORD-1007",
         customer: "David Miller",
         email: "david@example.com",
         date: "May 25, 2025",
         total: "$34.99",
         status: "processing",
         items: 1,
      },
      {
         id: "ORD-1008",
         customer: "Lisa Garcia",
         email: "lisa@example.com",
         date: "May 24, 2025",
         total: "$129.50",
         status: "pending",
         items: 3,
      },
   ];

   const [orders, setOrders] = useState(initialOrders);
   const [searchTerm, setSearchTerm] = useState("");
   const [statusFilter, setStatusFilter] = useState("all");
   const [selectedOrder, setSelectedOrder] = useState<any>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);

   // Filter orders based on search term and status filter
   const filteredOrders = orders.filter((order) => {
      const matchesSearch =
         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
         order.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
         statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
   });

   const handleViewOrder = (order: any) => {
      setSelectedOrder(order);
      setIsModalOpen(true);
   };

   const handleUpdateStatus = (orderId: string, newStatus: string) => {
      setOrders(
         orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
         )
      );

      // If the order being updated is the currently selected one, update it in the modal too
      if (selectedOrder && selectedOrder.id === orderId) {
         setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
   };

   // Mock data for the selected order details
   const orderItems = [
      {
         id: "1",
         name: "Wireless Earbuds",
         price: "$89.99",
         quantity: 1,
         total: "$89.99",
      },
      {
         id: "2",
         name: "Charging Case",
         price: "$39.99",
         quantity: 1,
         total: "$39.99",
      },
   ];

   return (
  <div className="space-y-6">
    {/* Tiêu đề và số lượng đơn hàng */}
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">
        Quản lý đơn hàng
      </h1>
      <div className="text-sm text-gray-600">
        <span className="font-medium">{filteredOrders.length}</span> đơn hàng được tìm thấy
      </div>
    </div>

    {/* Bộ lọc và tìm kiếm */}
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Tìm kiếm đơn hàng
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã đơn hàng, tên khách hàng hoặc email..."
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Lọc theo trạng thái
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>
    </div>

    {/* Thống kê trạng thái */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-yellow-800">Chờ xử lý</h3>
            <p className="text-2xl font-bold mt-1">
              {orders.filter((o) => o.status === "pending").length}
            </p>
          </div>
          <div className="text-3xl text-yellow-400">⏳</div>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-blue-800">Đang xử lý</h3>
            <p className="text-2xl font-bold mt-1">
              {orders.filter((o) => o.status === "processing").length}
            </p>
          </div>
          <div className="text-3xl text-blue-400">🔄</div>
        </div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-green-800">Hoàn thành</h3>
            <p className="text-2xl font-bold mt-1">
              {orders.filter((o) => o.status === "completed").length}
            </p>
          </div>
          <div className="text-3xl text-green-500">✅</div>
        </div>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-red-800">Đã hủy</h3>
            <p className="text-2xl font-bold mt-1">
              {orders.filter((o) => o.status === "cancelled").length}
            </p>
          </div>
          <div className="text-3xl text-red-500">❌</div>
        </div>
      </div>
    </div>

    {/* Bảng danh sách đơn hàng */}
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng cộng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mặt hàng
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                  <div className="text-sm text-gray-500">{order.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{order.total}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === "completed" ? "bg-green-100 text-green-800" :
                    order.status === "processing" ? "bg-blue-100 text-blue-800" :
                    order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredOrders.length === 0 && (
        <div className="py-6 text-center text-gray-500">
          Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
        </div>
      )}
    </div>

    {/* Modal chi tiết đơn hàng */}
    {isModalOpen && selectedOrder && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Chi tiết đơn hàng - {selectedOrder.id}
            </h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="text-xl">×</span>
            </button>
          </div>

          {/* Thông tin khách hàng & đơn hàng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Thông tin khách hàng
              </h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-800 font-medium">{selectedOrder.customer}</p>
                <p className="text-gray-600">{selectedOrder.email}</p>
                <p className="text-gray-600 mt-2">123 Main Street</p>
                <p className="text-gray-600">Anytown, State 12345</p>
                <p className="text-gray-600">Hoa Kỳ</p>
                <p className="text-gray-600 mt-2">(555) 123-4567</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Tóm tắt đơn hàng
              </h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Ngày đặt:</span>
                  <span className="text-gray-800">{selectedOrder.date}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`font-medium ${
                    selectedOrder.status === "completed" ? "text-green-600" :
                    selectedOrder.status === "processing" ? "text-blue-600" :
                    selectedOrder.status === "pending" ? "text-yellow-600" :
                    "text-red-600"
                  }`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Phương thức thanh toán:</span>
                  <span className="text-gray-800">Thẻ tín dụng</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Phương thức giao hàng:</span>
                  <span className="text-gray-800">Giao hàng tiêu chuẩn</span>
                </div>
                <div className="border-t border-gray-200 my-2 pt-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-800">Tổng cộng:</span>
                    <span className="text-gray-800">{selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <h4 className="text-sm font-medium text-gray-500 mb-2">Danh sách sản phẩm</h4>
          <div className="bg-gray-50 rounded-md overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Số lượng
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orderItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cập nhật trạng thái đơn */}
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Cập nhật trạng thái</h4>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              >
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default OrdersPage;
