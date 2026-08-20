import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const RevenueChart = ({ data }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A303F" vertical={false} />
          <XAxis dataKey="month" stroke="#8E9BB0" fontSize={11} tickLine={false} />
          <YAxis stroke="#8E9BB0" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#14171F', borderColor: '#2A303F', borderRadius: '12px', fontSize: '12px' }}
            formatter={(value) => [`₹${value.toLocaleString()}`, 'Monthly Revenue']}
          />
          <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#revenueGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
