import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-[#2a1336] border border-pink-500 rounded-lg shadow-lg">
        <p className="font-bold text-pink-300">{label}</p>
        <p className="text-sm text-white">
          Revenue: <span className="font-semibold">₹{payload[0].value.toLocaleString('en-IN')}</span>
        </p>
      </div>
    );
  }
  return null;
};

const SalesChart = ({ data }) => {
  return (
    <div className="w-full h-[300px] sm:h-[350px] lg:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 50 }} // Extra bottom for X-axis labels
          barSize={20}
        >
          <CartesianGrid stroke="#333" strokeDasharray="3 3" />
          
          {/* X-Axis */}
          <XAxis 
            dataKey="category"
            stroke="#fff"
            tick={{ fill: '#ffc1e3', fontSize: 12 }}
            angle={-15} // Tilt labels
            textAnchor="end"
            interval={0} // Show all labels
          />

          {/* Y-Axis */}
          <YAxis 
            stroke="#5e587bff"
            tick={{ fill: '#ffc1e3', fontSize: 12 }}
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} 
          />

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          {/* Bars */}
          <Bar 
            dataKey="revenue" 
            fill="#ff69b4" 
            radius={[5, 5, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
