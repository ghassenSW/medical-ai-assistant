import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

// Fix for default marker icons in React-Leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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

export const DoctorsMap: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('all');

  useEffect(() => {
    // Load the CSV data
    fetch('/data/cleaned_doctor_profiles_info2.csv')
      .then(response => response.text())
      .then(csvText => {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        
        const doctorsData = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            // Simple CSV parsing (handle quoted fields)
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

  // Get unique specialties and governorates
  const specialties = ['all', ...new Set(doctors.map(d => d.specialty))].sort();
  const governorates = ['all', ...new Set(doctors.map(d => {
    const parts = d.address.split(' ');
    return parts[parts.length - 1];
  }))].sort();

  // Filter doctors based on selection
  const filteredDoctors = doctors.filter(doctor => {
    const specialtyMatch = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    const governorateMatch = selectedGovernorate === 'all' || doctor.address.includes(selectedGovernorate);
    return specialtyMatch && governorateMatch;
  });

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
        <CardTitle className="text-xl">Geographic Distribution of Doctors</CardTitle>
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
              Filter by Governorate
            </label>
            <select
              value={selectedGovernorate}
              onChange={(e) => setSelectedGovernorate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {governorates.map(gov => (
                <option key={gov} value={gov}>
                  {gov === 'all' ? 'All Governorates' : gov}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Showing {filteredDoctors.length} of {doctors.length} doctors
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] w-full rounded-lg overflow-hidden">
          <MapContainer
            center={[34.0, 9.5]} // Center of Tunisia
            zoom={7}
            className="h-full w-full"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {filteredDoctors.map((doctor, index) => (
              <Marker
                key={`${doctor.name}-${index}`}
                position={[doctor.x, doctor.y]}
                icon={defaultIcon}
              >
                <Popup maxWidth={300}>
                  <div className="p-2">
                    <h3 className="font-bold text-gray-900 mb-1">{doctor.name}</h3>
                    <p className="text-sm font-medium text-primary-600 mb-2">
                      {doctor.specialty}
                    </p>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p><strong>Address:</strong> {doctor.address}</p>
                      {doctor.phone1 && (
                        <p><strong>Phone:</strong> {doctor.phone1}</p>
                      )}
                      {doctor.phone2 && (
                        <p><strong>Phone 2:</strong> {doctor.phone2}</p>
                      )}
                    </div>
                    {doctor.presentation && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-3">
                        {doctor.presentation}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};
