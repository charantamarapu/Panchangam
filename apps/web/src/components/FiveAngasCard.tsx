import React from 'react';
import { Moon, Sun, Star, Activity, Compass } from 'lucide-react';
import {
  formatTithi,
  formatVara,
  formatNakshatra,
  formatYoga,
  formatKarana,
  LanguageMode
} from '../utils/language';

interface FiveAngasProps {
  angas: any;
  languageMode: LanguageMode;
}

export const FiveAngasCard: React.FC<FiveAngasProps> = ({ angas, languageMode }) => {
  if (!angas) return null;

  const { tithi, vara, nakshatra, yoga, karana } = angas;

  const formatTime = (t: string | Date) => {
    return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const displayTithi = formatTithi(tithi.paksha, tithi.numberInPaksha, languageMode);
  const displayVara = formatVara(vara.index, languageMode);
  const displayNakshatra = formatNakshatra(nakshatra.index, nakshatra.pada, languageMode);
  const displayYoga = formatYoga(yoga.index, languageMode);
  const displayKarana = formatKarana(karana.index, languageMode);

  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.15rem',
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }} className="gold-gradient-text">
        <Compass size={18} />
        {languageMode === LanguageMode.SANSKRIT_DEVANAGARI
          ? 'पञ्चाङ्गानि (पञ्च अङ्गानि)'
          : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED
          ? 'Pañcāṅgāni (Five Sacred Limbs)'
          : 'The Five Limbs of Panchangam'}
      </h3>

      <div className="grid-5-angas">
        {/* 1. Tithi */}
        <div className="vedic-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              1. TITHI ({tithi.paksha})
            </span>
            <Moon size={16} color="var(--gold-400)" />
          </div>

          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-300)', marginBottom: 4 }}>
            {displayTithi}
          </h4>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
            Paksha: <strong>{tithi.paksha}</strong> (#{tithi.numberInPaksha})
          </div>

          {/* Progress bar of elapsed Tithi */}
          <div style={{ width: '100%', height: 5, backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ width: `${Math.round((tithi.fractionElapsed || 0) * 100)}%`, height: '100%', backgroundColor: 'var(--gold-500)' }} />
          </div>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Up to: <strong style={{ color: 'var(--text-primary)' }}>{formatTime(tithi.endTime)}</strong>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Next: {tithi.nextTithiName}
          </div>
        </div>

        {/* 2. Vara */}
        <div className="vedic-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              2. VARA (WEEKDAY)
            </span>
            <Sun size={16} color="var(--saffron-400)" />
          </div>

          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fed7aa', marginBottom: 4 }}>
            {displayVara.name}
          </h4>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
            Lord: <strong style={{ color: 'var(--gold-400)' }}>{displayVara.planet}</strong>
          </div>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 8 }}>
            Reckoned from local Sunrise
          </div>
        </div>

        {/* 3. Nakshatra */}
        <div className="vedic-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              3. NAKSHATRA (ASTERISM)
            </span>
            <Star size={16} color="#60a5fa" />
          </div>

          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#93c5fd', marginBottom: 4 }}>
            {displayNakshatra}
          </h4>

          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <span className="vedic-badge badge-gold" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
              Pada {nakshatra.pada}
            </span>
            <span className="vedic-badge badge-saffron" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
              Lord: {nakshatra.lord}
            </span>
          </div>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Up to: <strong style={{ color: 'var(--text-primary)' }}>{formatTime(nakshatra.endTime)}</strong>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Next: {nakshatra.nextNakshatraName}
          </div>
        </div>

        {/* 4. Yoga */}
        <div className="vedic-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              4. YOGA (LUNI-SOLAR)
            </span>
            <Activity size={16} color="#34d399" />
          </div>

          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#a7f3d0', marginBottom: 4 }}>
            {displayYoga}
          </h4>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
            Index #{yoga.index + 1} of 27
          </div>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Up to: <strong style={{ color: 'var(--text-primary)' }}>{formatTime(yoga.endTime)}</strong>
          </div>
        </div>

        {/* 5. Karana */}
        <div className="vedic-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              5. KARANA (HALF-TITHI)
            </span>
            <span style={{ fontSize: '1.1rem' }}>🌗</span>
          </div>

          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-300)', marginBottom: 4 }}>
            {displayKarana}
          </h4>

          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <span className={`vedic-badge ${karana.type === 'Sthira' ? 'badge-crimson' : 'badge-emerald'}`} style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
              {karana.type === 'Sthira' ? 'Fixed (Sthira)' : 'Movable (Chara)'}
            </span>
          </div>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Up to: <strong style={{ color: 'var(--text-primary)' }}>{formatTime(karana.endTime)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
