import React from "react";

interface QuickStatsProps {
   totalOrders: number;
   completedOrders: number;
   averageOrderValue: number;
   topCategory: string;
}

const QuickStats: React.FC<QuickStatsProps> = ({
   totalOrders,
   completedOrders,
   averageOrderValue,
   topCategory,
}) => {
   const completionRate =
      totalOrders > 0
         ? ((completedOrders / totalOrders) * 100).toFixed(1)
         : "0";

   const stats = [
      {
         name: "Tổng đơn hàng",
         value: totalOrders.toLocaleString(),
         icon: "📋",
         color: "text-blue-600",
         bgColor: "bg-blue-50",
      },
      {
         name: "Đơn hàng hoàn thành",
         value: completedOrders.toLocaleString(),
         icon: "✅",
         color: "text-green-600",
         bgColor: "bg-green-50",
      },
      {
         name: "Tỷ lệ hoàn thành",
         value: `${completionRate}%`,
         icon: "📊",
         color: "text-purple-600",
         bgColor: "bg-purple-50",
      },
      {
         name: "Danh mục phổ biến",
         value: topCategory || "N/A",
         icon: "🏆",
         color: "text-orange-600",
         bgColor: "bg-orange-50",
      },
   ];

   return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
         <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Thống kê nhanh
         </h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
               <div key={stat.name} className="text-center">
                  <div
                     className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} mb-2`}
                  >
                     <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                     {stat.name}
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                     {stat.value}
                  </p>
               </div>
            ))}
         </div>
      </div>
   );
};

export default QuickStats;
