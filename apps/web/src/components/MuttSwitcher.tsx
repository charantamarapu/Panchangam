import React from 'react';
import { Columns3, Info } from 'lucide-react';

interface MuttSwitcherProps {
  selectedMutt: string;
  onChangeMutt: (mutt: string) => void;
  onOpenCompare: () => void;
  observanceData?: any;
}

const MUTT_OPTIONS = [
  { id: 'ADVAITA_SMARTHA', label: 'Smartha (Advaita)', sub: 'Sringeri / Kanchi', tradition: 'Advaita' },
  { id: 'VISHISHTADVAITA_VADAKALAI_AHOBILA', label: 'Sri Ahobila Mutt', sub: 'Vadakalai', tradition: 'Vishishtadvaita' },
  { id: 'VISHISHTADVAITA_VADAKALAI_ANDAVAN', label: 'Andavan Ashramam', sub: 'Munithraya', tradition: 'Vishishtadvaita' },
  { id: 'VISHISHTADVAITA_THENGALAI', label: 'Thengalai', sub: 'Vanamamalai', tradition: 'Vishishtadvaita' },
  { id: 'DVAITA_UTTARADI', label: 'Uttaradi Matha', sub: 'Dvaita', tradition: 'Dvaita' },
  { id: 'DVAITA_RAYAR_MANTRALAYAM', label: 'Mantralayam Rayar Mutt', sub: 'Dvaita', tradition: 'Dvaita' }
];

export const MuttSwitcher: React.FC<MuttSwitcherProps> = ({
  selectedMutt,
  onChangeMutt,
  onOpenCompare,
  observanceData
}) => {
  return (
    <div className="vedic-card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.2rem' }}>🏛️</span>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Sampradaya & Mutt Tradition Rulebook
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Select your traditional Peetham to apply its exact Shastric Nirnaya rules (Ekadashi, Sankranti, Tharpanam)
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCompare}
          className="btn-vedic btn-vedic-gold"
          style={{ fontSize: '0.8rem', padding: '6px 14px' }}
        >
          <Columns3 size={15} /> Compare All Traditions Side-by-Side
        </button>
      </div>

      {/* Mutt Pills Selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {MUTT_OPTIONS.map(m => {
          const isSelected = selectedMutt === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onChangeMutt(m.id)}
              style={{
                flex: '1 1 180px',
                padding: '10px 14px',
                textAlign: 'left',
                borderRadius: 12,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                border: isSelected ? '1px solid var(--gold-400)' : '1px solid var(--border-subtle)',
                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: isSelected ? '0 0 16px rgba(245, 158, 11, 0.2)' : 'none'
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.84rem', color: isSelected ? 'var(--gold-300)' : 'var(--text-primary)' }}>
                {m.label}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {m.sub} • {m.tradition}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Observance Indicator */}
      {observanceData && (
        <div style={{
          marginTop: 14,
          padding: '10px 14px',
          borderRadius: 8,
          background: 'rgba(245, 158, 11, 0.05)',
          border: '1px solid rgba(245, 158, 11, 0.18)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
          fontSize: '0.82rem'
        }}>
          <div>
            <strong>Active Nirnaya:</strong> {observanceData.muttName}
            {observanceData.isEkadashiFastingDay && (
              <span className="vedic-badge badge-saffron" style={{ marginLeft: 8 }}>
                ⚡ Ekadashi Fasting Day
              </span>
            )}
            {observanceData.isDvadashiParanaDay && (
              <span className="vedic-badge badge-emerald" style={{ marginLeft: 8 }}>
                🍽️ Dvadashi Parana Day
              </span>
            )}
            {observanceData.isTharpanamDay && (
              <span className="vedic-badge badge-gold" style={{ marginLeft: 8 }}>
                🌊 Tharpanam Day
              </span>
            )}
          </div>

          {observanceData.festivalsAndEvents?.length > 0 && (
            <div style={{ color: 'var(--gold-400)', fontWeight: 600 }}>
              {observanceData.festivalsAndEvents.join(' • ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
