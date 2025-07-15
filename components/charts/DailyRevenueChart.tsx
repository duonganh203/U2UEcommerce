import React from "react";
import {
   AreaChart,
   Area,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
} from "recharts";

interface DailyRevenueData {
   date: string;
   revenue: number;
}

interface DailyRevenueChartProps {
   data: DailyRevenueData[];
}

const DailyRevenueChart: React.FC<DailyRevenueChartProps> = ({ data }) => {
   const formatCurrency = (value: number) => {
      return `$${value.toLocaleString()}`;
   };

   return (
      <div className="bg-white rounded-lg shadow p-6">
         <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Doanh thu 7 ngày gần nhất
         </h3>
         <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis
                  dataKey="date"
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
                  labelFormatter={(label) => `Ngày: ${label}`}
               />
               <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.3}
                  strokeWidth={2}
               />
            </AreaChart>
         </ResponsiveContainer>
      </div>
   );
};

export default DailyRevenueChart;
