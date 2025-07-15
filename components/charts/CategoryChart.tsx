import React from "react";
import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
} from "recharts";

interface CategoryData {
   category: string;
   count: number;
}

interface CategoryChartProps {
   data: CategoryData[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
   const colors = [
      "#3B82F6",
      "#EF4444",
      "#10B981",
      "#F59E0B",
      "#8B5CF6",
      "#EC4899",
      "#06B6D4",
      "#84CC16",
   ];

   return (
      <div className="bg-white rounded-lg shadow p-6">
         <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Sản phẩm theo danh mục
         </h3>
         <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
               />
               <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
               />
               <Tooltip
                  formatter={(value: number) => [value, "Số lượng"]}
                  labelFormatter={(label) => `Danh mục: ${label}`}
               />
               <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
         </ResponsiveContainer>
      </div>
   );
};

export default CategoryChart;
