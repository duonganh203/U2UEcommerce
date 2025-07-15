import React from "react";

interface StatsOverviewProps {
   totalRevenue: number;
   totalUsers: number;
   activeProducts: number;
   pendingProducts: number;
   revenueChange: string;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
   totalRevenue,
   totalUsers,
   activeProducts,
   pendingProducts,
   revenueChange,
}) => {
   const stats = [
      {
         name: "Tổng người dùng",
         value: totalUsers.toLocaleString(),
         icon: "👥",
         change: "+5.2%",
         color: "text-blue-600",
         bgColor: "bg-blue-50",
      },
      {
         name: "Sản phẩm đang hoạt động",
         value: activeProducts.toLocaleString(),
         icon: "📦",
         change: "+2.4%",
         color: "text-green-600",
         bgColor: "bg-green-50",
      },
      {
         name: "Sản phẩm chờ duyệt",
         value: pendingProducts.toLocaleString(),
         icon: "⏳",
         change: "+18.7%",
         color: "text-yellow-600",
         bgColor: "bg-yellow-50",
      },
      {
         name: "Tổng doanh thu (từ thuế)",
         value: `$${totalRevenue.toLocaleString()}`,
         icon: "💰",
         change: revenueChange,
         color: "text-purple-600",
         bgColor: "bg-purple-50",
      },
   ];

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
         {stats.map((stat) => (
            <div
               key={stat.name}
               className="bg-white rounded-lg shadow p-5 transition-all hover:shadow-md border-l-4 border-l-blue-500"
            >
               <div className="flex justify-between items-center">
                  <div>
                     <p className="text-gray-500 text-sm font-medium">
                        {stat.name}
                     </p>
                     <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`text-3xl ${stat.bgColor} p-3 rounded-full`}>
                     {stat.icon}
                  </div>
               </div>
               <div className="mt-2 text-sm text-green-600">
                  {stat.change} từ tháng trước
               </div>
            </div>
         ))}
      </div>
   );
};

export default StatsOverview;
