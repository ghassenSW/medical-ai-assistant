import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './DoctorsMap.css';
import 'leaflet.markercluster';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface Doctor {
  url: string;
  name: string;
  specialty: string;
  phone1: string;
  phone2: string;
  address: string;
  x: number;
  y: number;
  presentation: string;
  Lundi: string;
  Mardi: string;
  Mercredi: string;
  Jeudi: string;
  Vendredi: string;
  Samedi: string;
  Dimanche: string;
}

export const DoctorsInteractiveMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerClusterRef = useRef<any>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('all');

  useEffect(() => {
    // Load Font Awesome
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(link);
    }

    // Load CSV data
    fetch('/data/doctors_dataset.csv')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load data');
        return response.text();
      })
      .then(csvText => {
        const lines = csvText.split('\n');
        
        const doctorsData = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
            const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());
            
            return {
              url: cleanValues[0] || '',
              name: cleanValues[1] || '',
              specialty: cleanValues[2] || '',
              phone1: cleanValues[3] || '',
              phone2: cleanValues[4] || '',
              address: cleanValues[5] || '',
              x: parseFloat(cleanValues[6]) || 0,
              y: parseFloat(cleanValues[7]) || 0,
              presentation: cleanValues[8] || '',
              Lundi: cleanValues[9] || '',
              Mardi: cleanValues[10] || '',
              Mercredi: cleanValues[11] || '',
              Jeudi: cleanValues[12] || '',
              Vendredi: cleanValues[13] || '',
              Samedi: cleanValues[14] || '',
              Dimanche: cleanValues[15] || ''
            };
          })
          .filter(doc => doc.x && doc.y && !isNaN(doc.x) && !isNaN(doc.y));

        console.log(`Loaded ${doctorsData.length} doctors`);
        setDoctors(doctorsData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading doctors data:', error);
        setError('Failed to load doctor data');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || loading) return;

    try {
      console.log('Initializing map...');
      
      // Add a small delay to ensure the DOM is fully ready
      const timer = setTimeout(() => {
        if (!mapContainerRef.current || mapRef.current) return;
        
        const map = L.map(mapContainerRef.current, {
          center: [34.0, 9.5],
          zoom: 7,
          zoomControl: true,
          preferCanvas: false,
        });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;
        console.log('Map initialized successfully');
        
        // Force map to invalidate size after initialization
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize();
            setMapReady(true);
          }
        }, 100);
      }, 100);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }
  }, [loading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {
          console.error('Error removing map:', e);
        }
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || doctors.length === 0 || loading || !mapReady) return;

    try {
      console.log('Updating markers...');
      
      // Remove existing marker cluster
      if (markerClusterRef.current) {
        mapRef.current.removeLayer(markerClusterRef.current);
        markerClusterRef.current = null;
      }

      // Create new marker cluster group
      const markerCluster = (L as any).markerClusterGroup({
        chunkedLoading: true,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
      });

      // Filter doctors
      const filteredDoctors = doctors.filter(doctor => {
        const specialtyMatch = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
        const governorateMatch = selectedGovernorate === 'all' || doctor.address.includes(selectedGovernorate);
        return specialtyMatch && governorateMatch;
      });

      console.log(`Adding ${filteredDoctors.length} markers...`);

      // Add markers
      filteredDoctors.forEach((doctor) => {
        const marker = L.marker([doctor.x, doctor.y], {
          icon: L.divIcon({
            html: `
              <div style="
                background-color: #2563eb;
                width: 30px;
                height: 30px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 2px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <i class="fas fa-user-md" style="
                  color: white;
                  font-size: 14px;
                  transform: rotate(45deg);
                "></i>
              </div>
            `,
            className: 'custom-marker-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
          })
        });

        // Format working hours
        const workingHours = [
          { day: 'Lundi', hours: doctor.Lundi },
          { day: 'Mardi', hours: doctor.Mardi },
          { day: 'Mercredi', hours: doctor.Mercredi },
          { day: 'Jeudi', hours: doctor.Jeudi },
          { day: 'Vendredi', hours: doctor.Vendredi },
          { day: 'Samedi', hours: doctor.Samedi },
          { day: 'Dimanche', hours: doctor.Dimanche }
        ].filter(item => item.hours && item.hours.trim() !== '');

        const popupContent = `
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">
              ${doctor.name}
            </h3>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #2563eb; font-weight: 500;">
              <i class="fas fa-stethoscope"></i> ${doctor.specialty}
            </p>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #4b5563;">
              <i class="fas fa-map-marker-alt"></i> ${doctor.address}
            </p>
            ${doctor.phone1 ? `
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #4b5563;">
                <i class="fas fa-phone"></i> ${doctor.phone1}
              </p>
            ` : ''}
            ${doctor.phone2 ? `
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #4b5563;">
                <i class="fas fa-phone"></i> ${doctor.phone2}
              </p>
            ` : ''}
            ${workingHours.length > 0 ? `
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: #374151;">
                  <i class="fas fa-clock"></i> Horaires:
                </p>
                ${workingHours.map(item => `
                  <p style="margin: 0 0 2px 0; font-size: 11px; color: #6b7280; padding-left: 16px;">
                    ${item.day}: ${item.hours}
                  </p>
                `).join('')}
              </div>
            ` : ''}
            ${doctor.url ? `
              <a href="${doctor.url}" target="_blank" 
                 style="display: inline-block; margin-top: 8px; padding: 4px 12px; 
                        background-color: #2563eb; color: white; text-decoration: none; 
                        border-radius: 4px; font-size: 12px;">
                <i class="fas fa-external-link-alt"></i> Voir Profil
              </a>
            ` : ''}
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 300 });
        markerCluster.addLayer(marker);
      });

      mapRef.current.addLayer(markerCluster);
      markerClusterRef.current = markerCluster;

      // Fit bounds if there are markers
      if (filteredDoctors.length > 0) {
        const bounds = L.latLngBounds(filteredDoctors.map(d => [d.x, d.y]));
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
      
      console.log('Markers added successfully');
    } catch (err) {
      console.error('Error updating markers:', err);
      setError('Failed to update markers');
    }
  }, [doctors, selectedSpecialty, selectedGovernorate, loading, mapReady]);  // Get unique specialties and governorates sorted by frequency
  const specialties = React.useMemo(() => {
    if (doctors.length === 0) return ['all'];
    
    // Count frequency of each specialty
    const specialtyCount = doctors.reduce((acc, doctor) => {
      acc[doctor.specialty] = (acc[doctor.specialty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Sort by frequency (descending)
    const sortedSpecialties = Object.entries(specialtyCount)
      .sort((a, b) => b[1] - a[1])
      .map(([specialty]) => specialty);
    
    return ['all', ...sortedSpecialties];
  }, [doctors]);

  const governorates = React.useMemo(() => {
    if (doctors.length === 0) return ['all'];
    
    // Extract governorates and count frequency
    const governorateCount = doctors.reduce((acc, doctor) => {
      const parts = doctor.address.split(' ');
      const gov = parts[parts.length - 1];
      acc[gov] = (acc[gov] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Sort by frequency (descending)
    const sortedGovernorates = Object.entries(governorateCount)
      .sort((a, b) => b[1] - a[1])
      .map(([gov]) => gov);
    
    return ['all', ...sortedGovernorates];
  }, [doctors]);

  const filteredCount = doctors.filter(doctor => {
    const specialtyMatch = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    const governorateMatch = selectedGovernorate === 'all' || doctor.address.includes(selectedGovernorate);
    return specialtyMatch && governorateMatch;
  }).length;

  if (loading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading map data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <p className="text-gray-700 font-semibold">Error Loading Map</p>
              <p className="text-gray-500 text-sm mt-2">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Reload Page
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <i className="fas fa-map-marked-alt text-primary-600"></i>
          Geographic Distribution of Doctors in Tunisia
        </CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-filter"></i> Filter by Specialty
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            >
              {specialties.map(specialty => {
                if (specialty === 'all') {
                  return <option key={specialty} value={specialty}>🏥 All Specialties</option>;
                }
                // Count for this specialty
                const count = doctors.filter(d => d.specialty === specialty).length;
                return (
                  <option key={specialty} value={specialty}>
                    {specialty} ({count})
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-map-marker-alt"></i> Filter by Governorate
            </label>
            <select
              value={selectedGovernorate}
              onChange={(e) => setSelectedGovernorate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            >
              {governorates.map(gov => {
                if (gov === 'all') {
                  return <option key={gov} value={gov}>📍 All Governorates</option>;
                }
                // Count for this governorate
                const count = doctors.filter(d => d.address.includes(gov)).length;
                return (
                  <option key={gov} value={gov}>
                    {gov} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 text-sm">
          <p className="text-gray-600">
            <i className="fas fa-info-circle text-blue-500"></i> Showing <strong>{filteredCount}</strong> of <strong>{doctors.length}</strong> doctors
          </p>
          <p className="text-gray-500 text-xs">
            <i className="fas fa-hand-pointer"></i> Click markers or clusters to explore
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapContainerRef}
          className="h-[700px] w-full rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg"
          style={{ height: '700px', width: '100%', zIndex: 0 }}
        />
      </CardContent>
    </Card>
  );
};
