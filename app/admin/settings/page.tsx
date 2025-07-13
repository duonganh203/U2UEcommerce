"use client";

import React, { useState } from "react";

const SettingsPage = () => {
   // Mock settings data
   const [generalSettings, setGeneralSettings] = useState({
      storeName: "U2U Ecommerce",
      storeEmail: "contact@u2uecommerce.com",
      phoneNumber: "+1 (555) 123-4567",
      currency: "USD",
      language: "en",
      timezone: "UTC-5",
   });

   const [shippingSettings, setShippingSettings] = useState({
      enableFreeShipping: true,
      freeShippingThreshold: "50",
      standardShippingRate: "5.99",
      expressShippingRate: "15.99",
   });

   const [taxSettings, setTaxSettings] = useState({
      enableTax: true,
      taxRate: "7.5",
      applyTaxToShipping: false,
   });

   const [notificationSettings, setNotificationSettings] = useState({
      orderConfirmation: true,
      orderStatusUpdate: true,
      orderShipped: true,
      orderDelivered: true,
      abandonedCart: true,
      productOutOfStock: true,
   });

   const handleGeneralSettingsChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
   ) => {
      const { name, value } = e.target;
      setGeneralSettings({
         ...generalSettings,
         [name]: value,
      });
   };

   const handleShippingSettingsChange = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      const { name, value, type, checked } = e.target;
      setShippingSettings({
         ...shippingSettings,
         [name]: type === "checkbox" ? checked : value,
      });
   };

   const handleTaxSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setTaxSettings({
         ...taxSettings,
         [name]: type === "checkbox" ? checked : value,
      });
   };

   const handleNotificationSettingsChange = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      const { name, checked } = e.target;
      setNotificationSettings({
         ...notificationSettings,
         [name]: checked,
      });
   };

   const handleSaveSettings = (e: React.FormEvent) => {
      e.preventDefault();
      // In a real application, this would save to a backend
      alert("Settings saved successfully!");
   };

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
               Cài đặt hệ thống
            </h1>
         </div>

         <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
               <form onSubmit={handleSaveSettings}>
                  {/* Tabs */}
                  <div className="border-b border-gray-200 mb-6">
                     <nav className="-mb-px flex space-x-8">
                        <button
                           type="button"
                           className="border-indigo-500 text-indigo-600 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                        >
                           Chung
                        </button>
                        <button
                           type="button"
                           className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                        >
                           Vận chuyển
                        </button>
                        <button
                           type="button"
                           className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                        >
                           Thuế
                        </button>
                        <button
                           type="button"
                           className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                        >
                           Thông báo
                        </button>
                     </nav>
                  </div>

                  {/* General Settings */}
                  <div className="space-y-6">
                     <h2 className="text-lg font-medium text-gray-900">
                        Thông tin chung
                     </h2>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label
                              htmlFor="storeName"
                              className="block text-sm font-medium text-gray-700 mb-1"
                           >
                              Tên Cửa Hàng
                           </label>
                           <input
                              type="text"
                              id="storeName"
                              name="storeName"
                              value={generalSettings.storeName}
                              onChange={handleGeneralSettingsChange}
                              className="w-full border border-gray-300 rounded-md p-2"
                              required
                           />
                        </div>

                        <div>
                           <label
                              htmlFor="storeEmail"
                              className="block text-sm font-medium text-gray-700 mb-1"
                           >
                               Email Cửa Hàng
                           </label>
                           <input
                              type="email"
                              id="storeEmail"
                              name="storeEmail"
                              value={generalSettings.storeEmail}
                              onChange={handleGeneralSettingsChange}
                              className="w-full border border-gray-300 rounded-md p-2"
                              required
                           />
                        </div>

                        <div>
                           <label
                              htmlFor="phoneNumber"
                              className="block text-sm font-medium text-gray-700 mb-1"
                           >
                              Số điện thoại
                           </label>
                           <input
                              type="text"
                              id="phoneNumber"
                              name="phoneNumber"
                              value={generalSettings.phoneNumber}
                              onChange={handleGeneralSettingsChange}
                              className="w-full border border-gray-300 rounded-md p-2"
                           />
                        </div>

                        <div>
                           <label
                              htmlFor="currency"
                              className="block text-sm font-medium text-gray-700 mb-1"
                           >
                              Tiền tệ
                           </label>
                           <select
                              id="currency"
                              name="currency"
                              value={generalSettings.currency}
                              onChange={handleGeneralSettingsChange}
                              className="w-full border border-gray-300 rounded-md p-2"
                           >
                              <option value="USD">USD - US Dollar</option>
                              <option value="EUR">EUR - Euro</option>
                              <option value="GBP">GBP - British Pound</option>
                              <option value="JPY">JPY - Japanese Yen</option>
                              <option value="CAD">CAD - Canadian Dollar</option>
                           </select>
                        </div>

                        <div>
                           <label
                              htmlFor="language"
                              className="block text-sm font-medium text-gray-700 mb-1"
                           >
                              Ngôn ngữ
                           </label>
                           <select
                              id="language"
                              name="language"
                              value={generalSettings.language}
                              onChange={handleGeneralSettingsChange}
                              className="w-full border border-gray-300 rounded-md p-2"
                           >
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                              <option value="ja">Japanese</option>
                           </select>
                        </div>

                        <div>
                           <label
                              htmlFor="timezone"
                              className="block text-sm font-medium text-gray-700 mb-1"
                           >
                              Múi giờ
                           </label>
                           <select
                              id="timezone"
                              name="timezone"
                              value={generalSettings.timezone}
                              onChange={handleGeneralSettingsChange}
                              className="w-full border border-gray-300 rounded-md p-2"
                           >
                              <option value="UTC-12">UTC-12</option>
                              <option value="UTC-11">UTC-11</option>
                              <option value="UTC-10">UTC-10</option>
                              <option value="UTC-9">UTC-9</option>
                              <option value="UTC-8">
                                 UTC-8 (Pacific Time)
                              </option>
                              <option value="UTC-7">
                                 UTC-7 (Mountain Time)
                              </option>
                              <option value="UTC-6">
                                 UTC-6 (Central Time)
                              </option>
                              <option value="UTC-5">
                                 UTC-5 (Eastern Time)
                              </option>
                              <option value="UTC-4">UTC-4</option>
                              <option value="UTC-3">UTC-3</option>
                              <option value="UTC-2">UTC-2</option>
                              <option value="UTC-1">UTC-1</option>
                              <option value="UTC+0">UTC+0</option>
                              <option value="UTC+1">UTC+1</option>
                              <option value="UTC+2">UTC+2</option>
                              <option value="UTC+3">UTC+3</option>
                              <option value="UTC+4">UTC+4</option>
                              <option value="UTC+5">UTC+5</option>
                              <option value="UTC+6">UTC+6</option>
                              <option value="UTC+7">UTC+7</option>
                              <option value="UTC+8">UTC+8</option>
                              <option value="UTC+9">UTC+9</option>
                              <option value="UTC+10">UTC+10</option>
                              <option value="UTC+11">UTC+11</option>
                              <option value="UTC+12">UTC+12</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-6">
                     <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Cài đặt Vận chuyển
                     </h2>

                     <div className="space-y-4">
                        <div className="flex items-center">
                           <input
                              type="checkbox"
                              id="enableFreeShipping"
                              name="enableFreeShipping"
                              checked={shippingSettings.enableFreeShipping}
                              onChange={handleShippingSettingsChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                           />
                           <label
                              htmlFor="enableFreeShipping"
                              className="ml-2 block text-sm text-gray-900"
                           >
                             Kích hoạt giao hàng miễn phí
                           </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div>
                              <label
                                 htmlFor="freeShippingThreshold"
                                 className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                 Ngưỡng miễn phí vận chuyển ($)
                              </label>
                              <input
                                 type="number"
                                 id="freeShippingThreshold"
                                 name="freeShippingThreshold"
                                 value={shippingSettings.freeShippingThreshold}
                                 onChange={handleShippingSettingsChange}
                                 className="w-full border border-gray-300 rounded-md p-2"
                                 min="0"
                                 step="0.01"
                              />
                           </div>

                           <div>
                              <label
                                 htmlFor="standardShippingRate"
                                 className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                 Phí vận chuyển tiêu chuẩn ($)
                              </label>
                              <input
                                 type="number"
                                 id="standardShippingRate"
                                 name="standardShippingRate"
                                 value={shippingSettings.standardShippingRate}
                                 onChange={handleShippingSettingsChange}
                                 className="w-full border border-gray-300 rounded-md p-2"
                                 min="0"
                                 step="0.01"
                              />
                           </div>

                           <div>
                              <label
                                 htmlFor="expressShippingRate"
                                 className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                 Phí vận chuyển nhanh ($)
                              </label>
                              <input
                                 type="number"
                                 id="expressShippingRate"
                                 name="expressShippingRate"
                                 value={shippingSettings.expressShippingRate}
                                 onChange={handleShippingSettingsChange}
                                 className="w-full border border-gray-300 rounded-md p-2"
                                 min="0"
                                 step="0.01"
                              />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-6">
                     <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Cài đặt thuế
                     </h2>

                     <div className="space-y-4">
                        <div className="flex items-center">
                           <input
                              type="checkbox"
                              id="enableTax"
                              name="enableTax"
                              checked={taxSettings.enableTax}
                              onChange={handleTaxSettingsChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                           />
                           <label
                              htmlFor="enableTax"
                              className="ml-2 block text-sm text-gray-900"
                           >
                              Kích hoạt tính thuế
                           </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                              <label
                                 htmlFor="taxRate"
                                 className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                 Thuế suất (%)
                              </label>
                              <input
                                 type="number"
                                 id="taxRate"
                                 name="taxRate"
                                 value={taxSettings.taxRate}
                                 onChange={handleTaxSettingsChange}
                                 className="w-full border border-gray-300 rounded-md p-2"
                                 min="0"
                                 step="0.1"
                              />
                           </div>

                           <div className="flex items-center mt-8">
                              <input
                                 type="checkbox"
                                 id="applyTaxToShipping"
                                 name="applyTaxToShipping"
                                 checked={taxSettings.applyTaxToShipping}
                                 onChange={handleTaxSettingsChange}
                                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label
                                 htmlFor="applyTaxToShipping"
                                 className="ml-2 block text-sm text-gray-900"
                              >
                                 Áp dụng thuế cho phí vận chuyển
                              </label>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-6">
                     <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Cài đặt thông báo
                     </h2>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                           <input
                              type="checkbox"
                              id="orderConfirmation"
                              name="orderConfirmation"
                              checked={notificationSettings.orderConfirmation}
                              onChange={handleNotificationSettingsChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                           />
                           <label
                              htmlFor="orderConfirmation"
                              className="ml-2 block text-sm text-gray-900"
                           >
                              Email xác nhận đơn hàng
                           </label>
                        </div>

                        <div className="flex items-center">
                           <input
                              type="checkbox"
                              id="orderStatusUpdate"
                              name="orderStatusUpdate"
                              checked={notificationSettings.orderStatusUpdate}
                              onChange={handleNotificationSettingsChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                           />
                           <label
                              htmlFor="orderStatusUpdate"
                              className="ml-2 block text-sm text-gray-900"
                           >
                              Email cập nhật trạng thái đơn hàng
                           </label>
                        </div>

                        <div className="flex items-center">
                           <input
                              type="checkbox"
                              id="orderShipped"
                              name="orderShipped"
                              checked={notificationSettings.orderShipped}
                              onChange={handleNotificationSettingsChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                           />
                           <label
                              htmlFor="orderShipped"
                              className="ml-2 block text-sm text-gray-900"
                           >
                              Email thông báo đã giao hàng
                           </label>
                        </div>

                        <div className="flex items-center">
                           <input
                              type="checkbox"
                              id="orderDelivered"
                              name="orderDelivered"
                              checked={notificationSettings.orderDelivered}
                              onChange={handleNotificationSettingsChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                           />
                           <label
                              htmlFor="orderDelivered"
                              className="ml-2 block text-sm text-gray-900"
                           >
                              Email thông báo đã giao thành công
                           </label>
                        </div>

                        <div className="flex items-center">
                           <input
                              type="checkbox"
                              id="abandonedCart"
                              name="abandonedCart"
                              checked={notificationSettings.abandonedCart}
                              onChange={handleNotificationSettingsChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                           />
                           <label
                              htmlFor="abandonedCart"
                              className="ml-2 block text-sm text-gray-900"
                           >
                              Nhắc nhở giỏ hàng bị bỏ quên
                           </label>
                        </div>

                        <div className="flex items-center">
                           <input
                              type="checkbox"
                              id="productOutOfStock"
                              name="productOutOfStock"
                              checked={notificationSettings.productOutOfStock}
                              onChange={handleNotificationSettingsChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                           />
                           <label
                              htmlFor="productOutOfStock"
                              className="ml-2 block text-sm text-gray-900"
                           >
                              Cảnh báo hết hàng
                           </label>
                        </div>
                     </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-6 flex justify-end">
                     <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md"
                     >
                        Lưu cài đặt
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default SettingsPage;
