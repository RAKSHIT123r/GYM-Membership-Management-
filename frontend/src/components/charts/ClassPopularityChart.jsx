import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const ClassPopularityChart = ({ data }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A303F" horizontal={false} />
          <XAxis type="number" stroke="#8E9BB0" fontSize={11} tickLine={false} />
          <YAxis dataKey="category" type="category" stroke="#8E9BB0" fontSize={11} tickLine={false} width={85} />
          <Tooltip
            contentStyle={{ backgroundColor: '#14171F', borderColor: '#2A303F', borderRadius: '12px', fontSize: '12px' }}
            formatter={(value) => [`${value} Classes`, 'Total Bookings']}
          />
          <Bar dataKey="totalClasses" fill="#a855f7" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClassPopularityChart;
