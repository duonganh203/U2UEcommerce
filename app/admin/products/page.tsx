"use client";

import React, { useState } from "react";

const ProductsPage = () => {
   // Mock data for demonstration
   const initialProducts = [
      {
         id: "1",
         name: "Wireless Earbuds",
         image: "https://via.placeholder.com/100",
         seller: "TechStore",
         category: "Electronics",
         price: "$89.99",
         status: "pending",
         submitted: "May 31, 2025",
      },
      {
         id: "2",
         name: "Fitness Tracker",
         image: "https://via.placeholder.com/100",
         seller: "SportGoods",
         category: "Wearables",
         price: "$59.99",
         status: "pending",
         submitted: "May 30, 2025",
      },
      {
         id: "3",
         name: "Organic Coffee Beans",
         image: "https://via.placeholder.com/100",
         seller: "GreenCoffee",
         category: "Food & Beverages",
         price: "$24.99",
         status: "pending",
         submitted: "May 29, 2025",
      },
      {
         id: "4",
         name: "Smart Watch",
         image: "https://via.placeholder.com/100",
         seller: "TechStore",
         category: "Electronics",
         price: "$129.99",
         status: "approved",
         submitted: "May 25, 2025",
      },
      {
         id: "5",
         name: "Bluetooth Speaker",
         image: "https://via.placeholder.com/100",
         seller: "AudioWorld",
         category: "Electronics",
         price: "$79.99",
         status: "approved",
         submitted: "May 24, 2025",
      },
      {
         id: "6",
         name: "Yoga Mat",
         image: "https://via.placeholder.com/100",
         seller: "SportGoods",
         category: "Fitness",
         price: "$45.99",
         status: "rejected",
         submitted: "May 23, 2025",
      },
      {
         id: "7",
         name: "Mechanical Keyboard",
         image: "https://via.placeholder.com/100",
         seller: "PCAccessories",
         category: "Electronics",
         price: "$149.99",
         status: "approved",
         submitted: "May 22, 2025",
      },
      {
         id: "8",
         name: "Herbal Tea Set",
         image: "https://via.placeholder.com/100",
         seller: "NaturalTea",
         category: "Food & Beverages",
         price: "$39.99",
         status: "rejected",
         submitted: "May 21, 2025",
      },
   ];

   const [products, setProducts] = useState(initialProducts);
   const [searchTerm, setSearchTerm] = useState("");
   const [categoryFilter, setCategoryFilter] = useState("all");
   const [statusFilter, setStatusFilter] = useState("all");
   const [selectedProduct, setSelectedProduct] = useState<any>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
   const [confirmAction, setConfirmAction] = useState<{
      type: string;
      id: string;
   } | null>(null);
   const [rejectionReason, setRejectionReason] = useState("");

   // Filter products based on search term and filters
   const filteredProducts = products.filter((product) => {
      const matchesSearch =
         product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         product.seller.toLowerCase().includes(searchTerm.toLowerCase());

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

   const handleViewProduct = (product: any) => {
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

   const confirmStatusChange = () => {
      if (!confirmAction) return;

      const { type, id } = confirmAction;

      setProducts(
         products.map((product) =>
            product.id === id
               ? {
                    ...product,
                    status: type === "approve" ? "approved" : "rejected",
                 }
               : product
         )
      );

      setIsConfirmModalOpen(false);
      setConfirmAction(null);
      setRejectionReason("");
   };

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
               Product Management
            </h1>
            <div className="text-sm text-gray-600">
               <span className="font-medium">{filteredProducts.length}</span>{" "}
               products found
            </div>
         </div>

         {/* Filters and Search */}
         <div className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                  <label
                     htmlFor="search"
                     className="block text-sm font-medium text-gray-700 mb-1"
                  >
                     Search Products
                  </label>
                  <input
                     type="text"
                     id="search"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     placeholder="Search by name or seller..."
                     className="w-full border border-gray-300 rounded-md p-2"
                  />
               </div>
               <div>
                  <label
                     htmlFor="category"
                     className="block text-sm font-medium text-gray-700 mb-1"
                  >
                     Filter by Category
                  </label>
                  <select
                     id="category"
                     value={categoryFilter}
                     onChange={(e) => setCategoryFilter(e.target.value)}
                     className="w-full border border-gray-300 rounded-md p-2"
                  >
                     <option value="all">All Categories</option>
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
                     Filter by Status
                  </label>
                  <select
                     id="status"
                     value={statusFilter}
                     onChange={(e) => setStatusFilter(e.target.value)}
                     className="w-full border border-gray-300 rounded-md p-2"
                  >
                     <option value="all">All Statuses</option>
                     <option value="pending">Pending</option>
                     <option value="approved">Approved</option>
                     <option value="rejected">Rejected</option>
                  </select>
               </div>
            </div>
         </div>

         {/* Status Summary */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="font-medium text-yellow-800">
                        Pending Approval
                     </h3>
                     <p className="text-2xl font-bold mt-1">
                        {products.filter((p) => p.status === "pending").length}
                     </p>
                  </div>
                  <div className="text-3xl text-yellow-400">⏳</div>
               </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="font-medium text-green-800">
                        Approved Products
                     </h3>
                     <p className="text-2xl font-bold mt-1">
                        {products.filter((p) => p.status === "approved").length}
                     </p>
                  </div>
                  <div className="text-3xl text-green-500">✅</div>
               </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="font-medium text-red-800">
                        Rejected Products
                     </h3>
                     <p className="text-2xl font-bold mt-1">
                        {products.filter((p) => p.status === "rejected").length}
                     </p>
                  </div>
                  <div className="text-3xl text-red-500">❌</div>
               </div>
            </div>
         </div>

         {/* Products Table */}
         <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                     <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Seller
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Submitted
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                     {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                           <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                 <div className="h-10 w-10 flex-shrink-0">
                                    <img
                                       className="h-10 w-10 rounded-md object-cover"
                                       src={product.image}
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
                              {product.seller}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.category}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.price}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                 className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    product.status === "approved"
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
                              {product.submitted}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                 onClick={() => handleViewProduct(product)}
                                 className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                 View
                              </button>
                              {product.status === "pending" && (
                                 <>
                                    <button
                                       onClick={() =>
                                          handleApproveProduct(product.id)
                                       }
                                       className="text-green-600 hover:text-green-900 mr-3"
                                    >
                                       Approve
                                    </button>
                                    <button
                                       onClick={() =>
                                          handleRejectProduct(product.id)
                                       }
                                       className="text-red-600 hover:text-red-900"
                                    >
                                       Reject
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
                  No products found matching your filters.
               </div>
            )}
         </div>

         {/* View Product Modal */}
         {isModalOpen && selectedProduct && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
               <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-medium text-gray-900">
                        Product Details
                     </h3>
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
                           src={selectedProduct.image}
                           alt={selectedProduct.name}
                           className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="mt-4 space-y-2">
                           <div className="flex justify-between">
                              <span className="text-sm text-gray-500">
                                 Seller:
                              </span>
                              <span className="text-sm font-medium">
                                 {selectedProduct.seller}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-sm text-gray-500">
                                 Category:
                              </span>
                              <span className="text-sm font-medium">
                                 {selectedProduct.category}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-sm text-gray-500">
                                 Price:
                              </span>
                              <span className="text-sm font-medium">
                                 {selectedProduct.price}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-sm text-gray-500">
                                 Submitted:
                              </span>
                              <span className="text-sm font-medium">
                                 {selectedProduct.submitted}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-sm text-gray-500">
                                 Status:
                              </span>
                              <span
                                 className={`text-sm font-medium ${
                                    selectedProduct.status === "approved"
                                       ? "text-green-600"
                                       : selectedProduct.status === "pending"
                                       ? "text-yellow-600"
                                       : "text-red-600"
                                 }`}
                              >
                                 {selectedProduct.status
                                    .charAt(0)
                                    .toUpperCase() +
                                    selectedProduct.status.slice(1)}
                              </span>
                           </div>
                        </div>
                     </div>
                     <div>
                        <h4 className="text-xl font-medium text-gray-900 mb-2">
                           {selectedProduct.name}
                        </h4>
                        <p className="text-gray-600 mb-4">
                           Lorem ipsum dolor sit amet, consectetur adipiscing
                           elit. Sed euismod, nisl vel tincidunt luctus, nisl
                           nisl aliquam nisl, vel aliquam nisl nisl sit amet
                           nisl. Sed euismod, nisl vel tincidunt luctus, nisl
                           nisl aliquam nisl, vel aliquam nisl nisl sit amet
                           nisl.
                        </p>
                        <div className="space-y-4">
                           <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-1">
                                 Specifications
                              </h5>
                              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                 <li>Specification 1</li>
                                 <li>Specification 2</li>
                                 <li>Specification 3</li>
                                 <li>Specification 4</li>
                              </ul>
                           </div>
                           <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-1">
                                 Features
                              </h5>
                              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                 <li>Feature 1</li>
                                 <li>Feature 2</li>
                                 <li>Feature 3</li>
                              </ul>
                           </div>
                        </div>

                        {selectedProduct.status === "pending" && (
                           <div className="mt-6 flex space-x-3">
                              <button
                                 onClick={() => {
                                    setIsModalOpen(false);
                                    handleApproveProduct(selectedProduct.id);
                                 }}
                                 className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md"
                              >
                                 Approve
                              </button>
                              <button
                                 onClick={() => {
                                    setIsModalOpen(false);
                                    handleRejectProduct(selectedProduct.id);
                                 }}
                                 className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md"
                              >
                                 Reject
                              </button>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Confirmation Modal */}
         {isConfirmModalOpen && confirmAction && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
               <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-medium text-gray-900">
                        {confirmAction.type === "approve"
                           ? "Approve Product"
                           : "Reject Product"}
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
                           Are you sure you want to approve this product? It
                           will be visible to customers after approval.
                        </p>
                     ) : (
                        <div>
                           <p className="text-gray-600 mb-3">
                              Please provide a reason for rejecting this
                              product:
                           </p>
                           <textarea
                              value={rejectionReason}
                              onChange={(e) =>
                                 setRejectionReason(e.target.value)
                              }
                              className="w-full h-24 border border-gray-300 rounded-md p-2"
                              placeholder="Enter rejection reason..."
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
                        Cancel
                     </button>
                     <button
                        type="button"
                        onClick={confirmStatusChange}
                        className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white ${
                           confirmAction.type === "approve"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-600 hover:bg-red-700"
                        }`}
                        disabled={
                           confirmAction.type === "reject" &&
                           !rejectionReason.trim()
                        }
                     >
                        {confirmAction.type === "approve"
                           ? "Approve"
                           : "Reject"}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default ProductsPage;
