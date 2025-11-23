import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { SPECIALTY_STATS } from '@/lib/mockData';

export const SpecialtyChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctors by Specialty</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={SPECIALTY_STATS}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="specialty" 
              angle={-45} 
              textAnchor="end" 
              height={150}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#2563eb" name="Number of Doctors" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
