import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a050d]/80 border border-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-2xl">
        <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-black text-white italic">
          ₹{payload[0].value.toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
};

const SalesChart = ({ data }) => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          barSize={32}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />

          <XAxis
            dataKey="category"
            stroke="#ffffff20"
            tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 800 }}
            axisLine={false}
            tickLine={false}
            dy={10}
            textAnchor="middle"
            interval={0}
            tickFormatter={(val) => val.toUpperCase()}
          />

          <YAxis
            stroke="#ffffff20"
            tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 800 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(0) + 'K' : value}`}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'white', fillOpacity: 0.03 }} />

          <Bar
            dataKey="revenue"
            radius={[8, 8, 8, 8]}
            animationDuration={2000}
            animationEasing="ease-in-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="url(#barGradient)" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
