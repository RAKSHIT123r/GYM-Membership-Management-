import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const AttendanceChart = ({ data }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A303F" vertical={false} />
          <XAxis dataKey="day" stroke="#8E9BB0" fontSize={11} tickLine={false} />
          <YAxis stroke="#8E9BB0" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#14171F', borderColor: '#2A303F', borderRadius: '12px', fontSize: '12px' }}
            formatter={(value) => [`${value} Members`, 'Check-ins']}
          />
          <Bar dataKey="checkins" fill="#06b6d4" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
