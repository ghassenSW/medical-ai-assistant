import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface Doctor {
  name: string;
  specialty: string;
  phone1: string;
  phone2: string;
  address: string;
  x: number;
  y: number;
  presentation: string;
  working_hours: string;
}

interface HeatmapData {
  lat: number;
  lng: number;
  count: number;
  doctors: Doctor[];
}

// Component to auto-fit bounds
const AutoFitBounds: React.FC<{ data: HeatmapData[] }> = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (data.length > 0) {
      const bounds = data.map(d => [d.lat, d.lng] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [data, map]);

  return null;
};

export const DoctorsClusterMap: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [clusterRadius, setClusterRadius] = useState<number>(0.05); // degrees

  useEffect(() => {
    fetch('/data/cleaned_doctor_profiles_info2.csv')
      .then(response => response.text())
      .then(csvText => {
        const lines = csvText.split('\n');
        
        const doctorsData = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
            const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());
            
            return {
              name: cleanValues[1] || '',
              specialty: cleanValues[2] || '',
              phone1: cleanValues[3] || '',
              phone2: cleanValues[4] || '',
              address: cleanValues[5] || '',
              x: parseFloat(cleanValues[6]) || 0,
              y: parseFloat(cleanValues[7]) || 0,
              presentation: cleanValues[8] || '',
              working_hours: cleanValues[9] || ''
            };
          })
          .filter(doc => doc.x && doc.y && !isNaN(doc.x) && !isNaN(doc.y));

        setDoctors(doctorsData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading doctors data:', error);
        setLoading(false);
      });
  }, []);

  const specialties = ['all', ...new Set(doctors.map(d => d.specialty))].sort();

  const filteredDoctors = doctors.filter(doctor => 
    selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty
  );

  // Cluster doctors by location
  const clusteredData: HeatmapData[] = [];
  
  filteredDoctors.forEach(doctor => {
    const existing = clusteredData.find(
      c => Math.abs(c.lat - doctor.x) < clusterRadius && 
           Math.abs(c.lng - doctor.y) < clusterRadius
    );
    
    if (existing) {
      existing.doctors.push(doctor);
      existing.count++;
      // Update center to average
      existing.lat = existing.doctors.reduce((sum, d) => sum + d.x, 0) / existing.doctors.length;
      existing.lng = existing.doctors.reduce((sum, d) => sum + d.y, 0) / existing.doctors.length;
    } else {
      clusteredData.push({
        lat: doctor.x,
        lng: doctor.y,
        count: 1,
        doctors: [doctor]
      });
    }
  });

  // Calculate circle size based on count
  const getRadius = (count: number) => {
    if (count === 1) return 5;
    if (count < 5) return 8;
    if (count < 10) return 12;
    if (count < 20) return 16;
    return 20;
  };

  // Get color based on count
  const getColor = (count: number) => {
    if (count === 1) return '#3B82F6'; // blue
    if (count < 5) return '#10B981'; // green
    if (count < 10) return '#F59E0B'; // amber
    if (count < 20) return '#EF4444'; // red
    return '#991B1B'; // dark red
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500">Loading map data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Geographic Distribution & Clustering</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Specialty
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>
                  {specialty === 'all' ? 'All Specialties' : specialty}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cluster Radius
            </label>
            <select
              value={clusterRadius}
              onChange={(e) => setClusterRadius(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={0.01}>Very Tight</option>
              <option value={0.05}>Normal</option>
              <option value={0.1}>Wide</option>
              <option value={0.2}>Very Wide</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span> 1 doctor
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500"></span> 2-4 doctors
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span> 5-9 doctors
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500"></span> 10-19 doctors
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-900"></span> 20+ doctors
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Showing {filteredDoctors.length} doctors in {clusteredData.length} clusters
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] w-full rounded-lg overflow-hidden">
          <MapContainer
            center={[34.0, 9.5]}
            zoom={7}
            className="h-full w-full"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <AutoFitBounds data={clusteredData} />
            
            {clusteredData.map((cluster, index) => (
              <CircleMarker
                key={`cluster-${index}`}
                center={[cluster.lat, cluster.lng]}
                radius={getRadius(cluster.count)}
                pathOptions={{
                  fillColor: getColor(cluster.count),
                  fillOpacity: 0.7,
                  color: getColor(cluster.count),
                  weight: 2,
                  opacity: 0.9
                }}
              >
                <Popup maxWidth={400} maxHeight={300}>
                  <div className="p-2">
                    <h3 className="font-bold text-gray-900 mb-2">
                      {cluster.count} Doctor{cluster.count > 1 ? 's' : ''} in this area
                    </h3>
                    <div className="max-h-64 overflow-y-auto space-y-3">
                      {cluster.doctors.map((doctor, idx) => (
                        <div key={idx} className="border-b last:border-0 pb-2 last:pb-0">
                          <p className="font-semibold text-sm text-gray-900">{doctor.name}</p>
                          <p className="text-xs text-primary-600 font-medium">{doctor.specialty}</p>
                          <p className="text-xs text-gray-600 mt-1">{doctor.address}</p>
                          {doctor.phone1 && (
                            <p className="text-xs text-gray-500">📞 {doctor.phone1}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};
