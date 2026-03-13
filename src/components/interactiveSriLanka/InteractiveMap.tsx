'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { destinations } from '@/data/destinations';
import { Destination } from '@/types/destination';
import DestinationPanel from './DestinationPanel';

export default function InteractiveMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      // Initialize map centered on Sri Lanka
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: [
                'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors',
              maxzoom: 19
            }
          },
          layers: [
            {
              id: 'osm-layer',
              type: 'raster',
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        },
        center: [80.7718, 7.8731],
        zoom: 7,
        minZoom: 6.5,
        maxZoom: 12,
        cooperativeGestures: true // Enable Ctrl+scroll and two-finger zoom
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      // Error handling
      map.current.on('error', (e) => {
        console.error('Map error:', e);
      });

      // Wait for map to load
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);

        // Add markers for each destination
        destinations.forEach((destination) => {
          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.style.width = '40px';
          el.style.height = '40px';
          el.style.cursor = 'pointer';
          
          const categoryColors = {
            Heritage: '#D97706',
            Nature: '#059669',
            Adventure: '#DC2626',
            Coastal: '#0284C7'
          };

          const categoryIcons = {
            Heritage: '🏛️',
            Nature: '🌿',
            Adventure: '🦁',
            Coastal: '🏖️'
          };

          el.innerHTML = `
            <div class="marker-pin" style="
              width: 40px;
              height: 40px;
              background: ${categoryColors[destination.category]};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s ease;
              transform-origin: center center;
            ">
              <span style="color: white; font-size: 20px; font-weight: bold;">
                ${categoryIcons[destination.category]}
              </span>
            </div>
          `;

          el.addEventListener('mouseenter', () => {
            const pin = el.querySelector('.marker-pin') as HTMLElement;
            if (pin) pin.style.transform = 'scale(1.2)';
          });
          
          el.addEventListener('mouseleave', () => {
            const pin = el.querySelector('.marker-pin') as HTMLElement;
            if (pin) pin.style.transform = 'scale(1)';
          });

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat(destination.coordinates)
            .addTo(map.current!);

          el.addEventListener('click', () => {
            setSelectedDestination(destination);
            map.current?.flyTo({
              center: destination.coordinates,
              zoom: 9,
              duration: 1500
            });
          });

          markersRef.current.push(marker);
        });
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const handleClosePanel = () => {
    setSelectedDestination(null);
    if (map.current) {
      map.current.flyTo({
        center: [80.7718, 7.8731],
        zoom: 7,
        duration: 1500
      });
    }
  };

  return (
    <section className="relative w-full h-screen bg-slate-50">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 z-0"
        style={{ width: '100%', height: '100%' }}
      />
      
      {!mapLoaded && (
        <div className="absolute inset-0 z-5 flex items-center justify-center bg-slate-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-8 pointer-events-none">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Explore Sri Lanka
          </h2>
          <p className="text-lg text-white/90 max-w-2xl">
            Discover the island&#39;s most captivating destinations. Click on any location to learn more.
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 z-10 bg-white rounded-lg shadow-xl p-4">
        <h3 className="font-semibold text-sm mb-3 text-gray-800">Destination Types</h3>
        <div className="space-y-2">
          {[
            { category: 'Heritage', color: '#D97706', icon: '🏛️' },
            { category: 'Nature', color: '#059669', icon: '🌿' },
            { category: 'Adventure', color: '#DC2626', icon: '🦁' },
            { category: 'Coastal', color: '#0284C7', icon: '🏖️' }
          ].map(({ category, color, icon }) => (
            <div key={category} className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-xs"
                style={{ background: color }}
              >
                {icon}
              </div>
              <span className="text-sm text-gray-700">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedDestination && (
        <DestinationPanel 
          destination={selectedDestination} 
          onClose={handleClosePanel}
        />
      )}
    </section>
  );
}
