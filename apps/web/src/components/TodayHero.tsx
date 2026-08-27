import React from 'react';
import {
  Sunrise,
  Sunset,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  AlertTriangle,
  Flame,
  Compass
} from 'lucide-react';
import {
  formatTithi,
  formatVara,
  formatNakshatra,
  formatRitu,
  LanguageMode
} from '../utils/language';

interface TodayHeroProps {
  panchangam: any;
  selectedDate: string;
  onChangeDate: (d: string) => void;
  selectedMutt: string;
  onOpenMuttSettings: () => void;
  languageMode: LanguageMode;
}

export const TodayHero: React.FC<TodayHeroProps> = ({
  panchangam,
  selectedDate,
  onChangeDate,
  selectedMutt,
  onOpenMuttSettings,
  languageMode
}) => {
  if (!panchangam) return null;

  const { angas, timings, divisions, solarLunarInfo, muttObservance } = panchangam;
  const { tithi, nakshatra, vara } = angas;

  const formatTime = (t: string | Date | null) => {
    if (!t) return '--:--';
    return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleShiftDay = (delta: number) => {
    const d = new Date(selectedDate + 'T06:00:00Z');
    d.setDate(d.getDate() + delta);
    onChangeDate(d.toISOString().split('T')[0]);
  };

  const handleSetToday = () => {
    const today = new Date().toISOString().split('T')[0];
    onChangeDate(today);
  };

  // Localized terms
  const displayTithi = formatTithi(tithi.paksha, tithi.numberInPaksha, languageMode);
  const displayVara = formatVara(vara.index, languageMode);
  const displayNakshatra = formatNakshatra(nakshatra.index, nakshatra.pada, languageMode);
  const displayRitu = formatRitu(solarLunarInfo?.activeRitu?.index ?? solarLunarInfo?.ritu?.index ?? 2, languageMode);

  // Determine current active Muhurtha right now with localized names
  const now = new Date();
  let isRahuKalamActive = false;
  let currentActiveKala = 'Daytime';

  const kalaMap: Record<string, Record<LanguageMode, string>> = {
    pratah: {
      [LanguageMode.SANSKRIT_DEVANAGARI]: 'प्रातःकालः (सन्ध्या वन्दनम्)',
      [LanguageMode.SANSKRIT_TRANSLITERATED]: 'Prātaḥkāla (Morning Devotions)',
      [LanguageMode.ENGLISH]: 'Dawn / Morning (Sandhya Prayers)'
    },
    sangava: {
      [LanguageMode.SANSKRIT_DEVANAGARI]: 'सङ्गवकालः (स्वाध्यायः)',
      [LanguageMode.SANSKRIT_TRANSLITERATED]: 'Saṅgavakāla (Forenoon)',
      [LanguageMode.ENGLISH]: 'Forenoon (Vedic Study)'
    },
    madhyahna: {
      [LanguageMode.SANSKRIT_DEVANAGARI]: 'मध्याह्नकालः (देवपूजा)',
      [LanguageMode.SANSKRIT_TRANSLITERATED]: 'Madhyāhnakāla (Midday Pooja)',
      [LanguageMode.ENGLISH]: 'Midday (Deva Pooja & Sandhya)'
    },
    aparahna: {
      [LanguageMode.SANSKRIT_DEVANAGARI]: '🌟 अपराह्नकालः (पितृकार्यम् / श्राद्धम्)',
      [LanguageMode.SANSKRIT_TRANSLITERATED]: '🌟 Aparāhnakāla (Pitṛkāryam / Śrāddha)',
      [LanguageMode.ENGLISH]: '🌟 Afternoon Window (Shraddha & Ancestors)'
    },
    sayahna: {
      [LanguageMode.SANSKRIT_DEVANAGARI]: 'सायाह्नकालः (सन्ध्याप्रदोषः)',
      [LanguageMode.SANSKRIT_TRANSLITERATED]: 'Sāyāhnakāla (Sunset Sandhya)',
      [LanguageMode.ENGLISH]: 'Evening Twilight (Sandhya & Pradosha)'
    },
    ratri: {
      [LanguageMode.SANSKRIT_DEVANAGARI]: 'रात्रिकालः',
      [LanguageMode.SANSKRIT_TRANSLITERATED]: 'Rātrikāla',
      [LanguageMode.ENGLISH]: 'Night Period'
    }
  };

  if (divisions) {
    const nowMs = now.getTime();
    const rahuStart = new Date(divisions.rahuKalam.start).getTime();
    const rahuEnd = new Date(divisions.rahuKalam.end).getTime();
    if (nowMs >= rahuStart && nowMs <= rahuEnd) {
      isRahuKalamActive = true;
    }

    if (nowMs >= new Date(divisions.pratah.start).getTime() && nowMs < new Date(divisions.pratah.end).getTime()) {
      currentActiveKala = kalaMap.pratah[languageMode];
    } else if (nowMs >= new Date(divisions.sangava.start).getTime() && nowMs < new Date(divisions.sangava.end).getTime()) {
      currentActiveKala = kalaMap.sangava[languageMode];
    } else if (nowMs >= new Date(divisions.madhyahna.start).getTime() && nowMs < new Date(divisions.madhyahna.end).getTime()) {
      currentActiveKala = kalaMap.madhyahna[languageMode];
    } else if (nowMs >= new Date(divisions.aparahna.start).getTime() && nowMs < new Date(divisions.aparahna.end).getTime()) {
      currentActiveKala = kalaMap.aparahna[languageMode];
    } else if (nowMs >= new Date(divisions.sayahna.start).getTime() && nowMs < new Date(divisions.sayahna.end).getTime()) {
      currentActiveKala = kalaMap.sayahna[languageMode];
    } else {
      currentActiveKala = kalaMap.ratri[languageMode];
    }
  }

  return (
    <div className="vedic-card" style={{
      marginBottom: 20,
      padding: '20px 24px',
      background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.95), rgba(27, 38, 59, 0.85))',
      border: '1px solid rgba(245, 158, 11, 0.35)',
      boxShadow: '0 10px 35px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(245, 158, 11, 0.1)'
    }}>
      {/* Top Bar: Date Navigator & Tradition Indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: 14,
        marginBottom: 16
      }}>
        {/* Date Navigator Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => handleShiftDay(-1)}
            className="btn-vedic btn-vedic-outline"
            style={{ padding: '5px 9px', fontSize: '0.78rem' }}
            title="Previous Day"
          >
            <ChevronLeft size={15} /> Prev
          </button>

          <button
            onClick={handleSetToday}
            className="btn-vedic btn-vedic-subtle"
            style={{ padding: '5px 10px', fontSize: '0.78rem' }}
          >
            <RotateCcw size={13} /> Today
          </button>

          <button
            onClick={() => handleShiftDay(1)}
            className="btn-vedic btn-vedic-outline"
            style={{ padding: '5px 9px', fontSize: '0.78rem' }}
            title="Next Day"
          >
            Next <ChevronRight size={15} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 6 }}>
            <Calendar size={15} color="var(--gold-400)" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => onChangeDate(e.target.value)}
              className="vedic-input"
              style={{ padding: '4px 8px', fontSize: '0.82rem', width: 145 }}
            />
          </div>
        </div>

        {/* Current Active Tradition Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={onOpenMuttSettings}
            className="btn-vedic"
            style={{
              backgroundColor: selectedMutt === 'STANDARD' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(245, 158, 11, 0.15)',
              border: selectedMutt === 'STANDARD' ? '1px solid var(--border-subtle)' : '1px solid var(--gold-400)',
              color: selectedMutt === 'STANDARD' ? 'var(--text-secondary)' : 'var(--gold-300)',
              padding: '6px 12px',
              fontSize: '0.78rem'
            }}
          >
            <Compass size={14} />
            Tradition: <strong>{muttObservance?.muttName || 'Standard Drigganita'}</strong> (Click to change)
          </button>
        </div>
      </div>

      {/* Main Hero Grid: High-Impact Daily Essentials */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 20,
        alignItems: 'center'
      }}>
        {/* Left Column: Tithi & Nakshatra Hero */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span className="vedic-badge badge-gold">
              {displayVara.name}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Lord: <strong style={{ color: 'var(--gold-400)' }}>{displayVara.planet}</strong>
            </span>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--gold-300)',
              marginLeft: 'auto',
              background: 'rgba(245, 158, 11, 0.1)',
              padding: '2px 8px',
              borderRadius: 4,
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
              {solarLunarInfo?.activeMonth || solarLunarInfo?.chandraMasa?.amanta} • {displayRitu}
            </span>
          </div>

          {/* Primary Tithi Heading */}
          <h2 style={{
            fontFamily: languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? 'var(--font-serif)' : 'var(--font-sans)',
            fontSize: '1.75rem',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: 4
          }} className="gold-gradient-text">
            {displayTithi}
          </h2>

          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
            Up to <strong style={{ color: 'var(--text-primary)' }}>{formatTime(tithi.endTime)}</strong>{' '}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ({Math.round((tithi.fractionElapsed || 0) * 100)}% elapsed)
            </span>
          </div>

          {/* Nakshatra Line */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.92rem',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <span style={{ color: 'var(--gold-400)' }}>⭐</span>
            <div>
              <strong>{displayNakshatra}</strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Lord: {nakshatra.lord} • Deity: {nakshatra.deity} • Ends {formatTime(nakshatra.endTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Horizon Timings & Critical Windows */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10
        }}>
          {/* Sunrise */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <Sunrise size={15} color="var(--gold-400)" />
              {languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? 'सूर्योदयः' : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED ? 'SŪRYODAYA' : 'SUNRISE'}
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              {formatTime(timings.sunrise)}
            </div>
          </div>

          {/* Sunset */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <Sunset size={15} color="var(--saffron-400)" />
              {languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? 'सूर्यास्तमयः' : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED ? 'SŪRYĀSTAMAYA' : 'SUNSET'}
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              {formatTime(timings.sunset)}
            </div>
          </div>

          {/* Rahu Kalam */}
          <div style={{
            background: isRahuKalamActive ? 'rgba(220, 38, 38, 0.2)' : 'rgba(255, 255, 255, 0.03)',
            border: isRahuKalamActive ? '1px solid rgba(220, 38, 38, 0.5)' : '1px solid transparent',
            padding: 10,
            borderRadius: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: isRahuKalamActive ? '#fca5a5' : 'var(--text-muted)' }}>
              <AlertTriangle size={14} color="#ef4444" />
              {languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? 'राहुकालः' : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED ? 'RĀHUKĀLA' : 'RAHU KALAM'}
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fca5a5', marginTop: 2 }}>
              {formatTime(divisions.rahuKalam.start)} - {formatTime(divisions.rahuKalam.end)}
            </div>
          </div>

          {/* Aparahna Kala (Shraddha Window) */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(234, 88, 12, 0.08))',
            border: '1px solid var(--border-gold)',
            padding: 10,
            borderRadius: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--gold-400)' }}>
              <Flame size={14} />
              {languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? 'अपराह्नः (श्राद्धम्)' : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED ? 'APARĀHNA (ŚRĀDDHA)' : 'APARAHNA (SHRADDHA)'}
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--gold-300)', marginTop: 2 }}>
              {formatTime(divisions.aparahna.start)} - {formatTime(divisions.aparahna.end)}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Status Banner */}
      <div style={{
        marginTop: 16,
        padding: '10px 14px',
        borderRadius: 8,
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        fontSize: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: isRahuKalamActive ? '#ef4444' : '#10b981',
            display: 'inline-block',
            boxShadow: isRahuKalamActive ? '0 0 8px #ef4444' : '0 0 8px #10b981'
          }} />
          <span>Active Kala: <strong>{currentActiveKala}</strong></span>
        </div>

        {/* Dynamic Vrata / Festival badges */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {muttObservance?.festivalsAndEvents?.map((fest: string, idx: number) => (
            <span key={idx} className="vedic-badge badge-gold" style={{ fontSize: '0.74rem' }}>
              ✨ {fest}
            </span>
          ))}

          {muttObservance?.isEkadashiFastingDay && (
            <span className="vedic-badge badge-saffron" style={{ fontSize: '0.74rem' }}>
              ⚡ {languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? 'एकादशी उपवासः' : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED ? 'Ekādaśī Upavāsa' : 'Ekadashi Fasting'}
            </span>
          )}

          {muttObservance?.isDvadashiParanaDay && (
            <span className="vedic-badge badge-emerald" style={{ fontSize: '0.74rem' }}>
              🍽️ {muttObservance.paranaTimingText || 'Parana Today'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
