import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Activity,
  Compass,
  Sun,
  Moon,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Layers,
  Hourglass,
  RefreshCw
} from 'lucide-react';
import {
  calculateRealTimePanchangam,
  RealTimePanchangam,
  AyanamshaType,
  CalendarSystemType,
  ObserverLocation
} from '@panchangam/engine';
import {
  formatTithi,
  formatVara,
  formatNakshatra,
  formatYoga,
  formatKarana,
  formatRashi,
  formatHora,
  formatChoghadiya,
  LanguageMode
} from '../utils/language';
import { LocationState } from './LocationPicker';

interface RealTimeCardProps {
  location: LocationState;
  ayanamsha: string;
  calendarSystem: string;
  languageMode: LanguageMode;
}

export const RealTimeCard: React.FC<RealTimeCardProps> = ({
  location,
  ayanamsha,
  calendarSystem,
  languageMode
}) => {
  // Live ticking clock state (updated every 1s)
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [realTimeData, setRealTimeData] = useState<RealTimePanchangam | null>(null);

  // Compute or refresh real-time panchangam
  const updateRealTime = () => {
    const now = new Date();
    setCurrentTime(now);
    try {
      const loc: ObserverLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
        elevationMeters: location.elevation || 10,
        timezone: location.timezone
      };
      const ayaType = (ayanamsha as AyanamshaType) || AyanamshaType.LAHIRI;
      const calSys = (calendarSystem as CalendarSystemType) || CalendarSystemType.CHANDRAMANA_AMANTA;
      const computed = calculateRealTimePanchangam(now, loc, ayaType, calSys);
      setRealTimeData(computed);
    } catch (err) {
      console.error('Error calculating real-time panchangam:', err);
    }
  };

  // Run on mount and location/settings changes
  useEffect(() => {
    updateRealTime();
  }, [location, ayanamsha, calendarSystem]);

  // 1-second interval ticker for clock & periodic ephemeris recalibration
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      // Recalculate ephemeris every 10 seconds or when seconds hit 0
      if (now.getSeconds() % 10 === 0) {
        try {
          const loc: ObserverLocation = {
            latitude: location.latitude,
            longitude: location.longitude,
            elevationMeters: location.elevation || 10,
            timezone: location.timezone
          };
          const ayaType = (ayanamsha as AyanamshaType) || AyanamshaType.LAHIRI;
          const calSys = (calendarSystem as CalendarSystemType) || CalendarSystemType.CHANDRAMANA_AMANTA;
          const computed = calculateRealTimePanchangam(now, loc, ayaType, calSys);
          setRealTimeData(computed);
        } catch (e) {
          console.error(e);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [location, ayanamsha, calendarSystem]);

  if (!realTimeData) {
    return (
      <div className="vedic-card" style={{
        padding: '24px',
        textAlign: 'center',
        background: 'linear-gradient(145deg, rgba(16, 24, 39, 0.95), rgba(19, 42, 45, 0.85))',
        border: '1px solid rgba(16, 185, 129, 0.35)'
      }}>
        <div style={{ color: 'var(--emerald-400)' }}>Initializing Real-Time Ephemeris...</div>
      </div>
    );
  }

  const { currentAngas, lagna, currentHora, currentChoghadiya, activePeriods, sunMoon } = realTimeData;
  const { tithi, nakshatra, yoga, karana, vara } = currentAngas;

  // Format local clock time with seconds
  const formattedClock = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: location.timezone
  });

  // Calculate live countdowns dynamically from currentTime
  const nowMs = currentTime.getTime();
  const tithiRemainingMs = Math.max(0, tithi.endTime.getTime() - nowMs);
  const nakRemainingMs = Math.max(0, nakshatra.endTime.getTime() - nowMs);

  const formatDuration = (ms: number) => {
    if (ms <= 0) return 'Ending now...';
    const totalSecs = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const formatShortTime = (d: Date | string | null) => {
    if (!d) return '--:--';
    return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: location.timezone });
  };

  // Localized texts
  const displayTithi = formatTithi(tithi.paksha, tithi.numberInPaksha, languageMode);
  const displayNakshatra = formatNakshatra(nakshatra.index, nakshatra.pada, languageMode);
  const displayYoga = formatYoga(yoga.index, languageMode);
  const displayKarana = formatKarana(karana.index, languageMode);
  const displayVara = formatVara(vara.index, languageMode);
  const displayLagnaRashi = formatRashi(lagna.index, languageMode);
  const displayHora = formatHora(currentHora.slot.lord, languageMode);
  const displayChoghadiya = formatChoghadiya(currentChoghadiya.slot.type, languageMode);

  // Calculate elapsed progress percentage
  const tithiDurationMs = tithi.endTime.getTime() - tithi.startTime.getTime();
  const tithiElapsedPct = tithiDurationMs > 0
    ? Math.min(100, Math.max(0, Math.round(((nowMs - tithi.startTime.getTime()) / tithiDurationMs) * 100)))
    : Math.round(tithi.fractionElapsed * 100);

  const nakDurationMs = nakshatra.endTime.getTime() - nakshatra.startTime.getTime();
  const nakElapsedPct = nakDurationMs > 0
    ? Math.min(100, Math.max(0, Math.round(((nowMs - nakshatra.startTime.getTime()) / nakDurationMs) * 100)))
    : Math.round(nakshatra.fractionElapsed * 100);

  return (
    <div className="vedic-card" style={{
      padding: '20px 24px',
      background: 'linear-gradient(145deg, rgba(16, 24, 39, 0.95), rgba(15, 36, 42, 0.9))',
      border: '1px solid rgba(16, 185, 129, 0.35)',
      boxShadow: '0 10px 35px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.12)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginBottom: 0
    }}>
      {/* Top Bar: Live Status & Digital Clock */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 12,
          marginBottom: 16
        }}>
          {/* Live Indicator Heading */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="live-radar-dot" />
            <div>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--emerald-400)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <span>
                  {languageMode === LanguageMode.SANSKRIT_DEVANAGARI
                    ? 'तात्कालिक पञ्चाङ्गम्'
                    : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED
                    ? 'Tātkālika Pañcāṅgam'
                    : 'Real-Time Panchangam'}
                </span>
                <span className="vedic-badge badge-emerald" style={{ padding: '2px 8px', fontSize: '0.68rem' }}>
                  LIVE NOW
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Active Ephemeris at current moment
              </div>
            </div>
          </div>

          {/* Digital Clock with seconds & timezone */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '5px 12px',
            borderRadius: 10
          }}>
            <Clock size={16} color="var(--emerald-400)" />
            <div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '1.08rem',
                fontWeight: 800,
                color: '#6ee7b7',
                letterSpacing: '0.04em',
                lineHeight: 1.1
              }}>
                {formattedClock}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                {location.timezone.split('/')[1] || location.timezone}
              </div>
            </div>
          </div>
        </div>

        {/* Live Active Angas: Tithi & Nakshatra Hero */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 14,
          marginBottom: 16
        }}>
          {/* Live Tithi Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '14px 16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--emerald-400)', fontWeight: 600, letterSpacing: '0.04em' }}>
                ACTIVE TITHI (NOW)
              </span>
              <span style={{
                fontSize: '0.72rem',
                color: '#6ee7b7',
                fontFamily: 'monospace',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '2px 6px',
                borderRadius: 4
              }}>
                {formatDuration(tithiRemainingMs)} left
              </span>
            </div>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#f8fafc',
              marginBottom: 4,
              fontFamily: languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? 'var(--font-serif)' : 'var(--font-sans)'
            }}>
              {displayTithi}
            </h3>

            {/* Live Progress Bar */}
            <div style={{ margin: '8px 0 6px' }}>
              <div style={{
                height: 6,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.1)',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${tithiElapsedPct}%`,
                  background: 'linear-gradient(90deg, #10b981, #34d399)',
                  borderRadius: 3,
                  transition: 'width 0.5s ease'
                }} />
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                marginTop: 4
              }}>
                <span>Started: {formatShortTime(tithi.startTime)}</span>
                <span>{tithiElapsedPct}% elapsed</span>
                <span>Ends: {formatShortTime(tithi.endTime)}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Next: <strong style={{ color: 'var(--text-secondary)' }}>{tithi.nextTithiName}</strong>
            </div>
          </div>

          {/* Live Nakshatra & Pada Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '14px 16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--emerald-400)', fontWeight: 600, letterSpacing: '0.04em' }}>
                ACTIVE NAKSHATRA (NOW)
              </span>
              <span style={{
                fontSize: '0.72rem',
                color: '#6ee7b7',
                fontFamily: 'monospace',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '2px 6px',
                borderRadius: 4
              }}>
                {formatDuration(nakRemainingMs)} left
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#f8fafc',
                marginBottom: 4,
                fontFamily: languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? 'var(--font-serif)' : 'var(--font-sans)'
              }}>
                {displayNakshatra.split('(')[0].trim()}
              </h3>

              {/* Pada Chips (Quarter 1, 2, 3, 4) */}
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {[1, 2, 3, 4].map(p => (
                  <span
                    key={p}
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: p === nakshatra.pada ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.06)',
                      color: p === nakshatra.pada ? '#0f172a' : 'var(--text-muted)',
                      border: p === nakshatra.pada ? '1px solid #fcd34d' : '1px solid transparent'
                    }}
                    title={`Pada (Quarter) ${p}`}
                  >
                    P{p}
                  </span>
                ))}
              </div>
            </div>

            {/* Live Nakshatra Progress Bar */}
            <div style={{ margin: '8px 0 6px' }}>
              <div style={{
                height: 6,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.1)',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${nakElapsedPct}%`,
                  background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                  borderRadius: 3,
                  transition: 'width 0.5s ease'
                }} />
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                marginTop: 4
              }}>
                <span>Started: {formatShortTime(nakshatra.startTime)}</span>
                <span>{nakElapsedPct}% elapsed</span>
                <span>Ends: {formatShortTime(nakshatra.endTime)}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Lord: <strong style={{ color: 'var(--gold-400)' }}>{nakshatra.lord}</strong></span>
              <span>Chandra in <strong style={{ color: 'var(--text-secondary)' }}>{nakshatra.moonRashi}</strong> ({nakshatra.moonDegreeInRashi}°)</span>
            </div>
          </div>
        </div>

        {/* Mid Grid: Udaya Lagna (Ascendant), Current Hora, & Current Choghadiya */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 12,
          marginBottom: 16
        }}>
          {/* Udaya Lagna (Ascendant) */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 10,
            padding: '10px 12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--gold-400)' }}>
              <Compass size={14} />
              <span>
                {languageMode === LanguageMode.SANSKRIT_DEVANAGARI
                  ? 'उदय लग्नम् (Ascendant)'
                  : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED
                  ? 'Udaya Lagna'
                  : 'Rising Ascendant'}
              </span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              {displayLagnaRashi}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#6ee7b7', fontFamily: 'monospace' }}>
              {lagna.formatted}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Lord: {lagna.lord.split('(')[0]} • {lagna.navamshaRashi} Nav.
            </div>
          </div>

          {/* Current Active Hora */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 10,
            padding: '10px 12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#6ee7b7' }}>
                <Hourglass size={14} />
                <span>ACTIVE HORA</span>
              </div>
              <span className={`vedic-badge ${
                currentHora.slot.quality === 'Auspicious' ? 'badge-emerald' : currentHora.slot.quality === 'Inauspicious' ? 'badge-crimson' : 'badge-gold'
              }`} style={{ padding: '1px 6px', fontSize: '0.62rem' }}>
                {currentHora.slot.quality}
              </span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              {displayHora}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              Ends at {formatShortTime(currentHora.slot.end)}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {currentHora.timeRemainingMinutes}m remaining
            </div>
          </div>

          {/* Current Active Choghadiya */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 10,
            padding: '10px 12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--saffron-400)' }}>
                <Layers size={14} />
                <span>CHOGHADIYA</span>
              </div>
              <span className={`vedic-badge ${
                currentChoghadiya.slot.quality === 'Auspicious' ? 'badge-emerald' : currentChoghadiya.slot.quality === 'Inauspicious' ? 'badge-crimson' : 'badge-gold'
              }`} style={{ padding: '1px 6px', fontSize: '0.62rem' }}>
                {currentChoghadiya.slot.type}
              </span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              {displayChoghadiya}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              Ruler: {currentChoghadiya.slot.ruler.split('(')[0]}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Ends {formatShortTime(currentChoghadiya.slot.end)} ({currentChoghadiya.timeRemainingMinutes}m)
            </div>
          </div>
        </div>

        {/* Live Yoga, Karana, Sun & Moon Telemetry Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 10,
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '8px 12px',
          borderRadius: 8,
          border: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '0.78rem',
          marginBottom: 14
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>LIVE YOGA</span>
            <strong>{displayYoga}</strong>
            <span style={{ fontSize: '0.68rem', color: yoga.quality === 'Auspicious' ? '#6ee7b7' : '#fca5a5', marginLeft: 4 }}>
              ({yoga.quality})
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>LIVE KARANA</span>
            <strong>{displayKarana}</strong>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: 4 }}>
              ({karana.type})
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>SUN ALTITUDE</span>
            <span style={{ color: sunMoon.isDaylight ? '#fcd34d' : '#94a3b8' }}>
              {sunMoon.isDaylight ? '☀️ Daytime' : '🌙 Night'} ({sunMoon.sunAltitude}°)
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>MOON PHASE</span>
            <span style={{ color: '#fde68a' }}>
              {sunMoon.moonIlluminationPct}% • {sunMoon.moonPhaseName.split('(')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Live Alert Banners: Rahu Kalam, Bhadra/Vishti, & Abhijit */}
      <div>
        {/* Rahu Kalam Alert */}
        {activePeriods.isRahuKalam ? (
          <div style={{
            background: 'rgba(220, 38, 38, 0.25)',
            border: '1px solid #ef4444',
            borderRadius: 8,
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.8rem',
            color: '#fca5a5',
            marginBottom: 8
          }}>
            <span className="rahu-radar-dot" />
            <AlertTriangle size={15} color="#ef4444" />
            <span>
              <strong>RAHU KALAM ACTIVE NOW!</strong> Ends in {Math.round((activePeriods.rahuKalamRemainingMs || 0) / 60000)}m (at {formatShortTime(new Date(nowMs + (activePeriods.rahuKalamRemainingMs || 0)))}). Avoid auspicious undertakings.
            </span>
          </div>
        ) : activePeriods.nextRahuKalamStart ? (
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 8,
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.74rem',
            color: 'var(--text-muted)',
            marginBottom: 8
          }}>
            <CheckCircle2 size={13} color="var(--emerald-400)" />
            <span>Rahu Kalam today starts at <strong>{formatShortTime(activePeriods.nextRahuKalamStart)}</strong></span>
          </div>
        ) : null}

        {/* Vishti / Bhadra Alert */}
        {karana.isVishtiBhadra && (
          <div style={{
            background: 'rgba(234, 88, 12, 0.2)',
            border: '1px solid rgba(234, 88, 12, 0.5)',
            borderRadius: 8,
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.8rem',
            color: '#fed7aa',
            marginBottom: 8
          }}>
            <ShieldAlert size={16} color="var(--saffron-400)" />
            <span>
              ⚠️ <strong>BHADRA (VISHTI KARANA) ACTIVE:</strong> Inauspicious period for major agreements, travel, and religious rites. Ends at {formatShortTime(karana.endTime)}.
            </span>
          </div>
        )}

        {/* Abhijit Muhurtha Alert */}
        {activePeriods.isAbhijit && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.18)',
            border: '1px solid rgba(245, 158, 11, 0.5)',
            borderRadius: 8,
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.8rem',
            color: 'var(--gold-300)'
          }}>
            <Sparkles size={16} color="var(--gold-400)" />
            <span>
              ✨ <strong>ABHIJIT MUHURTHA ACTIVE NOW!</strong> Highly auspicious window for all ventures.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
