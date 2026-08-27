import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, Globe, X, GripHorizontal } from 'lucide-react';
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
  const [mapHeight, setMapHeight] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('panchangam_map_height');
      return saved ? Math.max(180, Math.min(750, Number(saved))) : 320;
    } catch {
      return 320;
    }
  });
  const [isResizing, setIsResizing] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(320);

  // Close search dropdown on outside click
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, []);

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
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    } else {
      mapInstanceRef.current.setView([location.latitude, location.longitude], 6);
      if (markerRef.current) {
        markerRef.current.setLatLng([location.latitude, location.longitude]);
      }
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 50);
    }
  }, [showMap, location.latitude, location.longitude]);

  // Clean up Leaflet on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Invalidate map size whenever map height changes or map is toggled
  useEffect(() => {
    if (mapInstanceRef.current && showMap) {
      const timer = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [mapHeight, showMap]);

  // ResizeObserver for any container size change
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, [showMap]);

  // Drag resizing logic
  const handleDragStart = (clientY: number) => {
    isDraggingRef.current = true;
    setIsResizing(true);
    startYRef.current = clientY;
    startHeightRef.current = mapHeight;

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaY = e.clientY - startYRef.current;
      const nextHeight = Math.min(Math.max(startHeightRef.current + deltaY, 180), 750);
      setMapHeight(nextHeight);
      try {
        localStorage.setItem('panchangam_map_height', String(nextHeight));
      } catch {}
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      setIsResizing(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchDragStart = (clientY: number) => {
    isDraggingRef.current = true;
    setIsResizing(true);
    startYRef.current = clientY;
    startHeightRef.current = mapHeight;

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !e.touches[0]) return;
      const deltaY = e.touches[0].clientY - startYRef.current;
      const nextHeight = Math.min(Math.max(startHeightRef.current + deltaY, 180), 750);
      setMapHeight(nextHeight);
      try {
        localStorage.setItem('panchangam_map_height', String(nextHeight));
      } catch {}
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
      setIsResizing(false);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };

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
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div
      className="vedic-card"
      style={{
        marginBottom: 20,
        position: 'relative',
        zIndex: showDropdown ? 1000 : 20
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <MapPin size={18} color="var(--gold-400)" style={{ flexShrink: 0 }} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {location.name}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>•</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
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

      {/* Search Input & High-z-index Dropdown */}
      <div ref={searchContainerRef} style={{ position: 'relative', marginBottom: 12, zIndex: 1050 }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: 12 }} />
          <input
            type="text"
            placeholder="Search any world city, temple town, or mutt location..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={e => {
              if (e.key === 'Escape') setShowDropdown(false);
            }}
            className="vedic-input"
            style={{ paddingLeft: 38, paddingRight: searchQuery ? 38 : 12 }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSuggestions([]);
                setShowDropdown(false);
              }}
              style={{
                position: 'absolute',
                right: 12,
                top: 10,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: 2,
                display: 'flex',
                alignItems: 'center'
              }}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
          {isSearching && (
            <span style={{ position: 'absolute', right: searchQuery ? 36 : 12, top: 10, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Searching...
            </span>
          )}
        </div>

        {/* Floating City Dropdown with high stacking index */}
        {showDropdown && searchQuery.trim().length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              backgroundColor: '#0f172a',
              border: '1px solid var(--border-gold)',
              borderRadius: 10,
              zIndex: 2000,
              maxHeight: 280,
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(245, 158, 11, 0.25)'
            }}
          >
            {suggestions.length > 0 ? (
              suggestions.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectCity(s)}
                  style={{
                    padding: '11px 14px',
                    cursor: 'pointer',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    fontSize: '0.84rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.15)')}
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
              ))
            ) : !isSearching ? (
              <div style={{ padding: '14px 16px', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                No cities found for &ldquo;{searchQuery}&rdquo;. Try another town or select on the map.
              </div>
            ) : null}
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

      {/* Interactive Resizable Leaflet Map Container */}
      <div style={{ marginTop: 14, display: showMap ? 'block' : 'none' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 8
        }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
            Click anywhere on the globe or drag the pin to set exact coordinates.
          </p>

          {/* Quick Height Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Height:</span>
            {[
              { label: 'Compact', h: 220 },
              { label: 'Medium', h: 340 },
              { label: 'Large', h: 500 },
              { label: 'Full', h: 680 }
            ].map(preset => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setMapHeight(preset.h);
                  try {
                    localStorage.setItem('panchangam_map_height', String(preset.h));
                  } catch {}
                }}
                style={{
                  backgroundColor: Math.abs(mapHeight - preset.h) < 30 ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: Math.abs(mapHeight - preset.h) < 30 ? '1px solid var(--gold-400)' : '1px solid var(--border-subtle)',
                  color: Math.abs(mapHeight - preset.h) < 30 ? 'var(--gold-300)' : 'var(--text-secondary)',
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resizable Map Canvas Wrapper */}
        <div
          style={{
            position: 'relative',
            borderRadius: 12,
            border: isResizing ? '1px solid var(--gold-400)' : '1px solid var(--border-gold)',
            boxShadow: isResizing ? '0 0 16px rgba(245, 158, 11, 0.3)' : 'none',
            overflow: 'hidden',
            transition: isResizing ? 'none' : 'border-color 0.2s ease, box-shadow 0.2s ease'
          }}
        >
          <div
            ref={mapContainerRef}
            style={{
              height: mapHeight,
              width: '100%',
              backgroundColor: '#0c1220'
            }}
          />

          {/* Interactive Drag Handle to Resize Height */}
          <div
            onMouseDown={e => {
              e.preventDefault();
              handleDragStart(e.clientY);
            }}
            onTouchStart={e => {
              if (e.touches[0]) handleTouchDragStart(e.touches[0].clientY);
            }}
            title="Click and drag to freely adjust map height"
            style={{
              height: 24,
              backgroundColor: isResizing ? 'rgba(245, 158, 11, 0.35)' : 'rgba(15, 23, 42, 0.95)',
              borderTop: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'ns-resize',
              userSelect: 'none',
              transition: 'background-color 0.15s ease'
            }}
          >
            <GripHorizontal size={14} color="var(--gold-400)" />
            <span style={{ fontSize: '0.68rem', color: 'var(--gold-300)', fontWeight: 500, letterSpacing: '0.02em' }}>
              {mapHeight}px • Drag to Resize
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
