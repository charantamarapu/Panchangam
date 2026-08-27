import React from 'react';
import { X, CheckCircle, Clock } from 'lucide-react';

interface TraditionCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparisonData: any;
}

export const TraditionCompareModal: React.FC<TraditionCompareModalProps> = ({
  isOpen,
  onClose,
  comparisonData
}) => {
  if (!isOpen || !comparisonData) return null;

  const { traditions, panchangamSummary } = comparisonData;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 880 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem' }} className="gold-gradient-text">
              Multi-Mutt Sampradaya Comparison Matrix
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Side-by-side Shastric Nirnaya analysis for {panchangamSummary?.date} (Tithi: {panchangamSummary?.tithi})
            </p>
          </div>
          <button onClick={onClose} className="btn-vedic btn-vedic-subtle" style={{ padding: 6 }}>
            <X size={18} />
          </button>
        </div>

        {/* 3 Pillars Comparison Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          {/* Pillar 1: Advaita / Smartha */}
          <div className="vedic-card" style={{ borderTop: '3px solid var(--gold-500)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: '1.3rem' }}>🕉️</span>
              <div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--gold-300)' }}>
                  Advaita (Smartha)
                </h4>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Sringeri / Kanchi Kamakoti Peetham
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
              <strong>Authority:</strong> Nirnaya Sindhu & Dharma Sindhu
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.82rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 8 }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>EKADASHI VRATA</span>
                <strong>{traditions?.advaita?.observance?.isEkadashiFastingDay ? '✅ Fasting Observed Today' : 'No Fasting'}</strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  Type: {traditions?.advaita?.observance?.ekadashiType}
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 8 }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>PARANA TIMING</span>
                <span>{traditions?.advaita?.observance?.paranaTimingText || 'Standard Sandhya Parana'}</span>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 8 }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>FESTIVALS & VRATAS</span>
                {traditions?.advaita?.observance?.festivalsAndEvents?.length > 0 ? (
                  traditions?.advaita?.observance?.festivalsAndEvents.map((f: string, i: number) => (
                    <div key={i} style={{ color: 'var(--gold-400)', fontWeight: 600, marginTop: 2 }}>• {f}</div>
                  ))
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Regular Nitya Karma</span>
                )}
              </div>
            </div>
          </div>

          {/* Pillar 2: Vishishtadvaita / Sri Vaishnava */}
          <div className="vedic-card" style={{ borderTop: '3px solid var(--saffron-500)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: '1.3rem' }}>🪷</span>
              <div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: '#fed7aa' }}>
                  Vishishtadvaita
                </h4>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Ahobila Mutt, Andavan & Thengalai
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
              <strong>Authority:</strong> Pancharatra Agama & Sadachara Nirnaya
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.82rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 8 }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>VADAKALAI (AHOBILA / ANDAVAN)</span>
                <strong>{traditions?.vishishtadvaita?.vadakalai?.isEkadashiFastingDay ? '✅ Fasting Observed Today' : 'No Fasting'}</strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  Harivasara / Bimbodbhava Rules Applied
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 8 }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>THENGALAI (VANAMAMALAI)</span>
                <strong>{traditions?.vishishtadvaita?.thengalai?.isEkadashiFastingDay ? '✅ Fasting Observed Today' : 'No Fasting'}</strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  Udaya Tithi Adherence
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 8 }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>FESTIVALS & VRATAS</span>
                {traditions?.vishishtadvaita?.vadakalai?.festivalsAndEvents?.length > 0 ? (
                  traditions?.vishishtadvaita?.vadakalai?.festivalsAndEvents.map((f: string, i: number) => (
                    <div key={i} style={{ color: '#fed7aa', fontWeight: 600, marginTop: 2 }}>• {f}</div>
                  ))
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Regular Nitya Karma</span>
                )}
              </div>
            </div>
          </div>

          {/* Pillar 3: Dvaita / Madhwa */}
          <div className="vedic-card" style={{ borderTop: '3px solid #60a5fa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: '1.3rem' }}>🔱</span>
              <div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: '#93c5fd' }}>
                  Dvaita (Madhwa)
                </h4>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Uttaradi & Mantralayam Rayar Matha
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
              <strong>Authority:</strong> Krishnamruta Maharnava by Acharya Madhwa
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.82rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 8 }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>UTTARADI MUTT FASTING</span>
                <strong>{traditions?.dvaita?.uttaradi?.isEkadashiFastingDay ? '✅ Fasting Observed Today' : 'No Fasting'}</strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  Type: {traditions?.dvaita?.uttaradi?.ekadashiType} (Arunodaya Vedha check)
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 8 }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>DVADASHI PARANA</span>
                <span>{traditions?.dvaita?.uttaradi?.paranaTimingText || 'Standard Madhwa Parana'}</span>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 8 }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>ARADHANAS & EVENTS</span>
                {traditions?.dvaita?.mantralayam?.festivalsAndEvents?.length > 0 ? (
                  traditions?.dvaita?.mantralayam?.festivalsAndEvents.map((f: string, i: number) => (
                    <div key={i} style={{ color: '#93c5fd', fontWeight: 600, marginTop: 2 }}>• {f}</div>
                  ))
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Regular Haridasa Smarane</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Shastric Explanation Note */}
        <div style={{
          marginTop: 20,
          padding: 14,
          borderRadius: 10,
          background: 'rgba(245, 158, 11, 0.06)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          fontSize: '0.78rem',
          color: 'var(--gold-300)'
        }}>
          💡 <strong>Understanding Nirnaya Discrepancies:</strong> Smartha traditions follow Arunodaya Vedha where Dashami must be absent during the 96-minute Arunodaya window. Sri Vaishnavas adhere to strict Harivasara and Bimbodbhava. Madhwas follow Acharya Madhva's injunction that even the slightest Dashami contact at Arunodaya renders the Ekadashi Viddha, moving the fast to Dvadashi.
        </div>
      </div>
    </div>
  );
};
