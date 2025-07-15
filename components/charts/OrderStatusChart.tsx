import React from "react";
import {
   PieChart,
   Pie,
   Cell,
   ResponsiveContainer,
   Tooltip,
   Legend,
} from "recharts";

interface OrderStatusData {
   status: string;
   count: number;
}

interface OrderStatusChartProps {
   data: OrderStatusData[];
}

const OrderStatusChart: React.FC<OrderStatusChartProps> = ({ data }) => {
   const colors = ["#EF4444", "#3B82F6", "#10B981"];

   const renderCustomizedLabel = ({
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent,
   }: any) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
      const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

      return (
         <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            fontSize={12}
            fontWeight="bold"
         >
            {`${(percent * 100).toFixed(0)}%`}
         </text>
      );
   };

   return (
      <div className="bg-white rounded-lg shadow p-6">
         <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Trạng thái đơn hàng
         </h3>
         <ResponsiveContainer width="100%" height={300}>
            <PieChart>
               <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
               >
                  {data.map((entry, index) => (
                     <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                     />
                  ))}
               </Pie>
               <Tooltip
                  formatter={(value: number) => [value, "Số lượng"]}
                  labelFormatter={(label) => `Trạng thái: ${label}`}
               />
               <Legend />
            </PieChart>
         </ResponsiveContainer>
      </div>
   );
};

export default OrderStatusChart;
