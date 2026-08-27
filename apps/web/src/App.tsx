import React, { useState, useEffect } from 'react';
import { api, UserSession } from './services/api';
import { Header } from './components/Header';
import { LocationPicker, LocationState } from './components/LocationPicker';
import { TodayHero } from './components/TodayHero';
import { FiveAngasCard } from './components/FiveAngasCard';
import { SolarLunarBar } from './components/SolarLunarBar';
import { MuhurthaTimetable } from './components/MuhurthaTimetable';
import { ShraddhaHub } from './components/ShraddhaHub';
import { AuthModal } from './components/AuthModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { TraditionCompareModal } from './components/TraditionCompareModal';
import { MuttPreferenceModal } from './components/MuttPreferenceModal';
import { LanguageMode } from '@panchangam/engine';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(api.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'panchangam' | 'shraddha'>('panchangam');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isMuttSettingsOpen, setIsMuttSettingsOpen] = useState(false);

  // State: Location (Default Chennai)
  const [location, setLocation] = useState<LocationState>({
    name: 'Chennai, Tamil Nadu, India',
    latitude: 13.0827,
    longitude: 80.2707,
    elevation: 0,
    timezone: 'Asia/Kolkata'
  });

  // State: Date (Default Today)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [ayanamsha, setAyanamsha] = useState<string>('LAHIRI');

  // State: Mutt Preference (Default: STANDARD / Universal Drigganita)
  const [selectedMutt, setSelectedMutt] = useState<string>(() => {
    return localStorage.getItem('panchangam_preferred_mutt') || 'STANDARD';
  });

  // State: Calendar System (Souramana vs Chandramana Amanta vs Purnimanta)
  const [calendarSystem, setCalendarSystem] = useState<string>(() => {
    return localStorage.getItem('panchangam_calendar_system') || 'CHANDRAMANA_AMANTA';
  });

  // State: Language Mode (Sanskrit Devanagari vs IAST Transliteration vs English)
  const [languageMode, setLanguageMode] = useState<LanguageMode>(() => {
    return (localStorage.getItem('panchangam_language_mode') as LanguageMode) || LanguageMode.SANSKRIT_DEVANAGARI;
  });

  // Panchangam data from API
  const [panchangamData, setPanchangamData] = useState<any>(null);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch Panchangam data on parameter change
  useEffect(() => {
    fetchPanchangam();
  }, [selectedDate, location, ayanamsha, selectedMutt, calendarSystem]);

  const fetchPanchangam = async () => {
    setLoading(true);
    try {
      const data = await api.getPanchangam({
        date: selectedDate,
        latitude: location.latitude,
        longitude: location.longitude,
        elevation: location.elevation,
        timezone: location.timezone,
        ayanamsha,
        mutt: selectedMutt,
        calendarSystem
      });
      setPanchangamData(data);

      // Fetch comparison in background
      api.getMuttComparison({
        date: selectedDate,
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: location.timezone
      }).then(res => setComparisonData(res)).catch(() => {});
    } catch (err) {
      console.error('Failed to fetch panchangam:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMutt = (muttId: string) => {
    setSelectedMutt(muttId);
    localStorage.setItem('panchangam_preferred_mutt', muttId);
  };

  const handleSelectLanguage = (mode: LanguageMode) => {
    setLanguageMode(mode);
    localStorage.setItem('panchangam_language_mode', mode);
  };

  const handleLogout = () => {
    api.clearSession();
    setCurrentUser(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        user={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenMuttSettings={() => setIsMuttSettingsOpen(true)}
        selectedMutt={selectedMutt}
        languageMode={languageMode}
        onChangeLanguageMode={handleSelectLanguage}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="app-container" style={{ flex: 1 }}>
        {/* Global Location Selector */}
        <LocationPicker
          location={location}
          onChange={newLoc => setLocation(newLoc)}
        />

        {activeTab === 'panchangam' ? (
          <div>
            {/* 🌟 TODAY'S HERO SECTION: Front & Center at the very top */}
            {panchangamData && (
              <TodayHero
                panchangam={panchangamData}
                selectedDate={selectedDate}
                onChangeDate={d => setSelectedDate(d)}
                selectedMutt={selectedMutt}
                onOpenMuttSettings={() => setIsMuttSettingsOpen(true)}
                languageMode={languageMode}
              />
            )}

            {loading && !panchangamData ? (
              <div className="vedic-card" style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '1.8rem', color: 'var(--gold-400)' }}>🕉️</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
                  Computing high-precision Drigganita ephemeris for {location.name}...
                </div>
              </div>
            ) : (
              panchangamData && (
                <div>
                  {/* Solar & Lunar Calendar Markers (Samvatsara, Ayana, Ritu, Masas) */}
                  <SolarLunarBar
                    info={panchangamData.solarLunarInfo}
                    calendarSystem={calendarSystem}
                    onChangeCalendarSystem={sys => {
                      setCalendarSystem(sys);
                      localStorage.setItem('panchangam_calendar_system', sys);
                    }}
                    languageMode={languageMode}
                  />

                  {/* The 5 Angas Breakdown Cards */}
                  <FiveAngasCard angas={panchangamData.angas} languageMode={languageMode} />

                  {/* Day Divisions, Muhurthas, and Planetary Positions */}
                  <MuhurthaTimetable
                    timings={panchangamData.timings}
                    divisions={panchangamData.divisions}
                    planets={panchangamData.planets}
                  />
                </div>
              )
            )}
          </div>
        ) : (
          /* Shraddha Remembrance Hub */
          <ShraddhaHub
            user={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
            currentLocation={location}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '20px 20px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        backgroundColor: 'rgba(10, 13, 20, 0.95)'
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div>
            🕉️ <strong>Real Panchangam Platform</strong> • High-Precision Drigganita calculations for any location globally.
          </div>
          <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span>Dvaita & Vishishtadvaita Vaishnava Nirnaya</span>
            <span>•</span>
            <span>Advaita Smartha Nirnaya</span>
            <span>•</span>
            <button
              onClick={() => setIsMuttSettingsOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--gold-400)', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Configure Mutt Settings
            </button>
            <span>•</span>
            <a href="/docs" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-400)', textDecoration: 'none' }}>
              REST API & Swagger Docs
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={user => setCurrentUser(user)}
      />

      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <MuttPreferenceModal
        isOpen={isMuttSettingsOpen}
        onClose={() => setIsMuttSettingsOpen(false)}
        selectedMutt={selectedMutt}
        onSelectMutt={handleSelectMutt}
        onOpenCompare={() => setIsCompareOpen(true)}
      />

      <TraditionCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        comparisonData={comparisonData}
      />
    </div>
  );
};
