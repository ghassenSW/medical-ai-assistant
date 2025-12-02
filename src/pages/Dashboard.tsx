import React, { useState, useEffect } from 'react';
import { SpecialtyChart } from '@/features/dashboard/SpecialtyChart';
import { DensityHeatmap } from '@/features/dashboard/DensityHeatmap';
import { DoctorsInteractiveMap } from '@/features/dashboard/DoctorsInteractiveMap';
import { Activity, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Papa from 'papaparse';

interface DoctorData {
  specialty: string;
  address: string;
}

interface DashboardStats {
  totalDoctors: number;
  totalSpecialties: number;
  totalGovernorates: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalDoctors: 0,
    totalSpecialties: 0,
    totalGovernorates: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/data/doctors_dataset.csv');
        const csvText = await response.text();
        
        Papa.parse<DoctorData>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const doctors = results.data;
            
            // Total doctors
            const totalDoctors = doctors.length;
            
            // Unique specialties
            const specialties = new Set<string>();
            doctors.forEach(d => {
              if (d.specialty) specialties.add(d.specialty);
            });
            
            // Unique governorates (last word from address)
            const governorates = new Set<string>();
            doctors.forEach(d => {
              if (d.address) {
                const parts = d.address.trim().split(/\s+/);
                if (parts.length > 0) {
                  governorates.add(parts[parts.length - 1]);
                }
              }
            });
            
            setStats({
              totalDoctors,
              totalSpecialties: specialties.size,
              totalGovernorates: governorates.size,
            });
            setLoading(false);
          },
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Medical Statistics Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary-600" />
                Total Doctors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.totalDoctors.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">Across Tunisia</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Specialties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.totalSpecialties}
              </p>
              <p className="text-sm text-gray-500 mt-1">Medical specialties</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Governorates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.totalGovernorates}
              </p>
              <p className="text-sm text-gray-500 mt-1">Regions covered</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SpecialtyChart />
          <DensityHeatmap />
        </div>

        {/* Interactive Map */}
        <DoctorsInteractiveMap />
      </div>
    </div>
  );
};
