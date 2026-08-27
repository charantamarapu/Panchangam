import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, Globe, ChevronDown, Check } from 'lucide-react';
import { api } from '../services/api';
import L from 'leaflet';

export interface LocationState {
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
}

interface LocationPickerProps {
  location: LocationState;
  onChange: (loc: LocationState) => void;
}

const QUICK_PLACES = [
  { name: 'Ujjain (Mahakal)', lat: 23.1765, lon: 75.7885, tz: 'Asia/Kolkata' },
  { name: 'Varanasi (Kashi)', lat: 25.3176, lon: 82.9739, tz: 'Asia/Kolkata' },
  { name: 'Sringeri', lat: 13.4167, lon: 75.2500, tz: 'Asia/Kolkata' },
  { name: 'Kanchipuram', lat: 12.8342, lon: 79.7036, tz: 'Asia/Kolkata' },
  { name: 'Mantralayam', lat: 15.9389, lon: 77.4267, tz: 'Asia/Kolkata' },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707, tz: 'Asia/Kolkata' },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, tz: 'Asia/Kolkata' },
  { name: 'New York', lat: 40.7128, lon: -74.0060, tz: 'America/New_York' },
  { name: 'London', lat: 51.5074, lon: -0.1278, tz: 'Europe/London' },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, tz: 'Asia/Singapore' }
];

export const LocationPicker: React.FC<LocationPickerProps> = ({ location, onChange }) => {
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Search autocomplete
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await api.searchLocations(searchQuery);
        setSuggestions(results);
        setShowDropdown(true);
      } catch (err) {
        console.error('Location search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Leaflet Map Initialization
  useEffect(() => {
    if (!showMap || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([location.latitude, location.longitude], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const marker = L.marker([location.latitude, location.longitude], { draggable: true }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onChange({
          name: `Custom Location (${pos.lat.toFixed(3)}, ${pos.lng.toFixed(3)})`,
          latitude: Number(pos.lat.toFixed(4)),
          longitude: Number(pos.lng.toFixed(4)),
          elevation: location.elevation,
          timezone: location.timezone
        });
      });

      map.on('click', (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        onChange({
          name: `Selected Coordinates (${e.latlng.lat.toFixed(3)}, ${e.latlng.lng.toFixed(3)})`,
          latitude: Number(e.latlng.lat.toFixed(4)),
          longitude: Number(e.latlng.lng.toFixed(4)),
          elevation: location.elevation,
          timezone: location.timezone
        });
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else {
      mapInstanceRef.current.setView([location.latitude, location.longitude], 6);
      if (markerRef.current) {
        markerRef.current.setLatLng([location.latitude, location.longitude]);
      }
    }
  }, [showMap, location.latitude, location.longitude]);

  // GPS Auto-detect
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        onChange({
          name: 'My GPS Location',
          latitude: Number(pos.coords.latitude.toFixed(4)),
          longitude: Number(pos.coords.longitude.toFixed(4)),
          elevation: Math.round(pos.coords.altitude || 10),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'
        });
      },
      err => {
        alert(`Failed to detect GPS location: ${err.message}`);
      }
    );
  };

  const handleSelectCity = (c: any) => {
    onChange({
      name: c.name + (c.country ? `, ${c.country}` : ''),
      latitude: c.latitude,
      longitude: c.longitude,
      elevation: c.elevation || 10,
      timezone: c.timezone
    });
    setSearchQuery('');
    setShowDropdown(false);
  };

  return (
    <div className="vedic-card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MapPin size={20} color="var(--gold-400)" />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {location.name}
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Lat: {location.latitude}° | Lon: {location.longitude}° | TZ: {location.timezone}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleDetectGPS}
            className="btn-vedic btn-vedic-outline"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            title="Detect My Location via GPS"
          >
            <Navigation size={14} /> Detect GPS
          </button>
          <button
            onClick={() => setShowMap(!showMap)}
            className="btn-vedic btn-vedic-outline"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <Globe size={14} /> {showMap ? 'Hide Map' : 'Select on Map'}
          </button>
        </div>
      </div>

      {/* Search Input & Dropdown */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: 12 }} />
          <input
            type="text"
            placeholder="Search any world city, temple town, or mutt location..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            className="vedic-input"
            style={{ paddingLeft: 38 }}
          />
          {isSearching && (
            <span style={{ position: 'absolute', right: 12, top: 10, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Searching...
            </span>
          )}
        </div>

        {showDropdown && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#111827',
            border: '1px solid var(--border-gold)',
            borderRadius: 8,
            marginTop: 4,
            zIndex: 50,
            maxHeight: 220,
            overflowY: 'auto',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.7)'
          }}>
            {suggestions.map((s, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectCity(s)}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '0.84rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.12)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div>
                  <strong style={{ color: 'var(--gold-300)' }}>{s.name}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 6 }}>
                    ({s.state ? `${s.state}, ` : ''}{s.country})
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {s.latitude}°, {s.longitude}°
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sacred Cities Quick Pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: showMap ? 14 : 0 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: 4 }}>
          Quick Select:
        </span>
        {QUICK_PLACES.map(q => (
          <button
            key={q.name}
            onClick={() => onChange({
              name: q.name,
              latitude: q.lat,
              longitude: q.lon,
              elevation: 0,
              timezone: q.tz
            })}
            style={{
              background: location.latitude === q.lat && location.longitude === q.lon
                ? 'rgba(245, 158, 11, 0.25)'
                : 'rgba(255, 255, 255, 0.04)',
              border: location.latitude === q.lat && location.longitude === q.lon
                ? '1px solid var(--gold-400)'
                : '1px solid var(--border-subtle)',
              color: location.latitude === q.lat && location.longitude === q.lon
                ? 'var(--gold-300)'
                : 'var(--text-secondary)',
              borderRadius: 16,
              padding: '3px 10px',
              fontSize: '0.74rem',
              cursor: 'pointer'
            }}
          >
            {q.name}
          </button>
        ))}
      </div>

      {/* Interactive Leaflet Map Container */}
      {showMap && (
        <div style={{ marginTop: 12 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
            Click anywhere on the globe or drag the pin to set exact coordinates for high-precision Drigganita calculation.
          </p>
          <div
            ref={mapContainerRef}
            style={{
              height: 260,
              width: '100%',
              borderRadius: 12,
              border: '1px solid var(--border-gold)',
              overflow: 'hidden'
            }}
          />
        </div>
      )}
    </div>
  );
};
