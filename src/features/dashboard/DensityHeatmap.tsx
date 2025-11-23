import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { GOVERNORATE_STATS } from '@/lib/mockData';

export const DensityHeatmap: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor Density by Governorate</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={GOVERNORATE_STATS} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#059669" name="Number of Doctors" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
