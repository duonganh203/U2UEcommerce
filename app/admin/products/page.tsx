"use client";

import React, { useState, useEffect } from "react";

interface Product {
   _id: string;
   name: string;
   images: string[];
   seller: {
      _id: string;
      name: string;
      email: string;
   };
   category: string;
   price: number;
   status: "pending" | "approved" | "rejected";
   createdAt: string;
   brand: string;
   description: string;
   condition: string;
   countInStock: number;
}

interface ApiResponse {
   success: boolean;
   data: Product[];
   statusCounts: {
      pending: number;
      approved: number;
      rejected: number;
   };
}

const ProductsPage = () => {
   const [products, setProducts] = useState<Product[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [searchTerm, setSearchTerm] = useState("");
   const [categoryFilter, setCategoryFilter] = useState("all");
   const [statusFilter, setStatusFilter] = useState("all");
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
   const [confirmAction, setConfirmAction] = useState<{
      type: string;
      id: string;
   } | null>(null);
   const [rejectionReason, setRejectionReason] = useState("");
   const [statusCounts, setStatusCounts] = useState({
      pending: 0,
      approved: 0,
      rejected: 0,
   });

   // Fetch products from API
   const fetchProducts = async () => {
      try {
         setLoading(true);
         const queryParams = new URLSearchParams();

         if (statusFilter !== "all") {
            queryParams.append("status", statusFilter);
         }
         if (categoryFilter !== "all") {
            queryParams.append("category", categoryFilter);
         }
         if (searchTerm) {
            queryParams.append("search", searchTerm);
         }
         queryParams.append("limit", "100"); // Get more products for admin view

         const response = await fetch(`/api/admin/products?${queryParams}`);
         const data: ApiResponse = await response.json();

         if (data.success) {
            setProducts(data.data);
            setStatusCounts(data.statusCounts);
            setError("");
         } else {
            setError("Failed to fetch products");
         }
      } catch (err) {
         setError("Error fetching products");
         console.error("Error:", err);
      } finally {
         setLoading(false);
      }
   }; // Load products on component mount and when filters change
   useEffect(() => {
      const timer = setTimeout(() => {
         fetchProducts();
      }, 300); // Debounce search to avoid too many API calls

      return () => clearTimeout(timer);
   }, [statusFilter, categoryFilter, searchTerm]); // Filter products based on search term and filters (client-side for real-time filtering)
   const filteredProducts = products.filter((product) => {
      const matchesSearch =
         product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         // product.seller.firstName
         //    .toLowerCase()
         //    .includes(searchTerm.toLowerCase()) ||
         product.brand.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
         categoryFilter === "all" || product.category === categoryFilter;
      const matchesStatus =
         statusFilter === "all" || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
   });

   // Get unique categories for the filter dropdown
   const categories = Array.from(
      new Set(products.map((product) => product.category))
   );
   const handleViewProduct = (product: Product) => {
      setSelectedProduct(product);
      setIsModalOpen(true);
   };

   const handleApproveProduct = (productId: string) => {
      setConfirmAction({ type: "approve", id: productId });
      setIsConfirmModalOpen(true);
   };

   const handleRejectProduct = (productId: string) => {
      setConfirmAction({ type: "reject", id: productId });
      setRejectionReason("");
      setIsConfirmModalOpen(true);
   };

   const confirmStatusChange = async () => {
      if (!confirmAction) return;

      const { type, id } = confirmAction;

      try {
         const response = await fetch("/api/admin/products", {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               productId: id,
               status: type === "approve" ? "approved" : "rejected",
               rejectionReason: type === "reject" ? rejectionReason : undefined,
            }),
         });

         const data = await response.json();

         if (data.success) {
            // Refresh the products list
            await fetchProducts();
            setIsConfirmModalOpen(false);
            setConfirmAction(null);
            setRejectionReason("");
         } else {
            setError(data.error || "Failed to update product status");
         }
      } catch (err) {
         setError("Error updating product status");
         console.error("Error:", err);
      }
   };

   return (
      <div className="space-y-6">
         {/* Tiêu đề và tổng số sản phẩm */}
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
               Quản lý sản phẩm
            </h1>
            <div className="text-sm text-gray-600">
               <span className="font-medium">{filteredProducts.length}</span> sản phẩm được tìm thấy
            </div>
         </div>

         {/* Bộ lọc và tìm kiếm */}
         <div className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                  <label
                     htmlFor="search"
                     className="block text-sm font-medium text-gray-700 mb-1"
                  >
                     Tìm kiếm sản phẩm
                  </label>
                  <input
                     type="text"
                     id="search"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     placeholder="Tìm theo tên hoặc người bán..."
                     className="w-full border border-gray-300 rounded-md p-2"
                  />
               </div>
               <div>
                  <label
                     htmlFor="category"
                     className="block text-sm font-medium text-gray-700 mb-1"
                  >
                     Lọc theo danh mục
                  </label>
                  <select
                     id="category"
                     value={categoryFilter}
                     onChange={(e) => setCategoryFilter(e.target.value)}
                     className="w-full border border-gray-300 rounded-md p-2"
                  >
                     <option value="all">Tất cả danh mục</option>
                     {categories.map((category) => (
                        <option key={category} value={category}>
                           {category}
                        </option>
                     ))}
                  </select>
               </div>
               <div>
                  <label
                     htmlFor="status"
                     className="block text-sm font-medium text-gray-700 mb-1"
                  >
                     Lọc theo trạng thái
                  </label>
                  <select
                     id="status"
                     value={statusFilter}
                     onChange={(e) => setStatusFilter(e.target.value)}
                     className="w-full border border-gray-300 rounded-md p-2"
                  >
                     <option value="all">Tất cả trạng thái</option>
                     <option value="pending">Đang chờ duyệt</option>
                     <option value="approved">Đã duyệt</option>
                     <option value="rejected">Đã từ chối</option>
                  </select>
               </div>
            </div>
         </div>

         {/* Thống kê trạng thái */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="font-medium text-yellow-800">
                        Đang chờ duyệt
                     </h3>
                     <p className="text-2xl font-bold mt-1">
                        {statusCounts.pending}
                     </p>
                  </div>
                  <div className="text-3xl text-yellow-400">⏳</div>
               </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="font-medium text-green-800">
                        Sản phẩm đã duyệt
                     </h3>
                     <p className="text-2xl font-bold mt-1">
                        {statusCounts.approved}
                     </p>
                  </div>
                  <div className="text-3xl text-green-500">✅</div>
               </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="font-medium text-red-800">
                        Sản phẩm bị từ chối
                     </h3>
                     <p className="text-2xl font-bold mt-1">
                        {statusCounts.rejected}
                     </p>
                  </div>
                  <div className="text-3xl text-red-500">❌</div>
               </div>
            </div>
         </div>{" "}
         {/* Bảng sản phẩm */}
         {loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
               <div className="text-gray-500">Đang tải danh sách sản phẩm...</div>
            </div>
         ) : error ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
               <div className="text-red-500">{error}</div>
               <button
                  onClick={fetchProducts}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
               >
                  Thử lại
               </button>
            </div>
         ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sản phẩm
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Người bán
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Danh mục
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Giá
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Trạng thái
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ngày gửi
                           </th>
                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Hành động
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                           <tr key={product._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0">
                                       <img
                                          className="h-10 w-10 rounded-md object-cover"
                                          src={
                                             product.images[0] ||
                                             "https://via.placeholder.com/100"
                                          }
                                          alt={product.name}
                                       />
                                    </div>
                                    <div className="ml-4">
                                       <div className="text-sm font-medium text-gray-900">
                                          {product.name}
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {product.seller.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {product.category}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 ${product.price.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <span
                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === "approved"
                                          ? "bg-green-100 text-green-800"
                                          : product.status === "pending"
                                             ? "bg-yellow-100 text-yellow-800"
                                             : "bg-red-100 text-red-800"
                                       }`}
                                 >
                                    {product.status.charAt(0).toUpperCase() +
                                       product.status.slice(1)}
                                 </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {new Date(product.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                 <button
                                    onClick={() => handleViewProduct(product)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                 >
                                    Xem
                                 </button>
                                 {product.status === "pending" && (
                                    <>
                                       <button
                                          onClick={() =>
                                             handleApproveProduct(product._id)
                                          }
                                          className="text-green-600 hover:text-green-900 mr-3"
                                       >
                                          Duyệt
                                       </button>
                                       <button
                                          onClick={() =>
                                             handleRejectProduct(product._id)
                                          }
                                          className="text-red-600 hover:text-red-900"
                                       >
                                          Từ chối
                                       </button>
                                    </>
                                 )}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               {filteredProducts.length === 0 && (
                  <div className="py-6 text-center text-gray-500">
                     Không tìm thấy sản phẩm nào khớp với bộ lọc.
                  </div>
               )}
            </div>
         )}
         {" "}
         {/* Modal xem chi tiết sản phẩm */}
         {isModalOpen && selectedProduct && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
               <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-medium text-gray-900">Chi tiết sản phẩm</h3>
                     <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-gray-400 hover:text-gray-500"
                     >
                        <span className="text-xl">×</span>
                     </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <img
                           src={
                              selectedProduct.images[0] ||
                              "https://via.placeholder.com/300"
                           }
                           alt={selectedProduct.name}
                           className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="mt-4 space-y-2">
                           <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Người bán:</span>
                              <span className="text-sm font-medium">{selectedProduct.seller.name}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Danh mục:</span>
                              <span className="text-sm font-medium">{selectedProduct.category}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Thương hiệu:</span>
                              <span className="text-sm font-medium">{selectedProduct.brand}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Giá:</span>
                              <span className="text-sm font-medium">
                                 ${selectedProduct.price.toFixed(2)}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Tồn kho:</span>
                              <span className="text-sm font-medium">{selectedProduct.countInStock}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Tình trạng:</span>
                              <span className="text-sm font-medium">{selectedProduct.condition}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Ngày gửi:</span>
                              <span className="text-sm font-medium">
                                 {new Date(selectedProduct.createdAt).toLocaleDateString()}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Trạng thái:</span>
                              <span
                                 className={`text-sm font-medium ${selectedProduct.status === "approved"
                                       ? "text-green-600"
                                       : selectedProduct.status === "pending"
                                          ? "text-yellow-600"
                                          : "text-red-600"
                                    }`}
                              >
                                 {selectedProduct.status.charAt(0).toUpperCase() +
                                    selectedProduct.status.slice(1)}
                              </span>
                           </div>
                        </div>
                     </div>
                     <div>
                        <h4 className="text-xl font-medium text-gray-900 mb-2">{selectedProduct.name}</h4>
                        <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

                        {selectedProduct.status === "pending" && (
                           <div className="mt-6 flex space-x-3">
                              <button
                                 onClick={() => {
                                    setIsModalOpen(false);
                                    handleApproveProduct(selectedProduct._id);
                                 }}
                                 className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md"
                              >
                                 Duyệt
                              </button>
                              <button
                                 onClick={() => {
                                    setIsModalOpen(false);
                                    handleRejectProduct(selectedProduct._id);
                                 }}
                                 className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md"
                              >
                                 Từ chối
                              </button>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         )}
         {/* Modal xác nhận duyệt hoặc từ chối */}
         {isConfirmModalOpen && confirmAction && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
               <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-medium text-gray-900">
                        {confirmAction.type === "approve"
                           ? "Xác nhận duyệt sản phẩm"
                           : "Xác nhận từ chối sản phẩm"}
                     </h3>
                     <button
                        onClick={() => setIsConfirmModalOpen(false)}
                        className="text-gray-400 hover:text-gray-500"
                     >
                        <span className="text-xl">×</span>
                     </button>
                  </div>
                  <div>
                     {confirmAction.type === "approve" ? (
                        <p className="text-gray-600">
                           Bạn có chắc muốn duyệt sản phẩm này không? Sản phẩm sẽ hiển thị cho khách hàng sau khi được duyệt.
                        </p>
                     ) : (
                        <div>
                           <p className="text-gray-600 mb-3">
                              Vui lòng nhập lý do từ chối sản phẩm này:
                           </p>
                           <textarea
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              className="w-full h-24 border border-gray-300 rounded-md p-2"
                              placeholder="Nhập lý do từ chối..."
                           ></textarea>
                        </div>
                     )}
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                     <button
                        type="button"
                        onClick={() => setIsConfirmModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                     >
                        Huỷ
                     </button>
                     <button
                        type="button"
                        onClick={confirmStatusChange}
                        className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white ${confirmAction.type === "approve"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-600 hover:bg-red-700"
                           }`}
                        disabled={confirmAction.type === "reject" && !rejectionReason.trim()}
                     >
                        {confirmAction.type === "approve" ? "Duyệt" : "Từ chối"}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default ProductsPage;
