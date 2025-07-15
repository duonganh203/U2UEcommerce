import React from "react";
import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
} from "recharts";

interface RevenueData {
   month: string;
   revenue: number;
}

interface RevenueChartProps {
   data: RevenueData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
   const formatCurrency = (value: number) => {
      return `$${value.toLocaleString()}`;
   };

   return (
      <div className="bg-white rounded-lg shadow p-6">
         <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Doanh thu theo tháng
         </h3>
         <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
               />
               <YAxis
                  tickFormatter={formatCurrency}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
               />
               <Tooltip
                  formatter={(value: number) => [
                     formatCurrency(value),
                     "Doanh thu",
                  ]}
                  labelFormatter={(label) => `Tháng: ${label}`}
               />
               <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
               />
            </LineChart>
         </ResponsiveContainer>
      </div>
   );
};

export default RevenueChart;
