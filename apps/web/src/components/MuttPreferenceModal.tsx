import React, { useState } from 'react';
import { X, Check, Compass, Columns3, Info, Bookmark } from 'lucide-react';
import { MUTT_REGISTRY } from '@panchangam/engine';

interface MuttPreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMutt: string;
  onSelectMutt: (muttId: string) => void;
  onOpenCompare: () => void;
}

const CATEGORIES = [
  { id: 'Standard', title: 'Universal Baseline (Default)', icon: '🌟' },
  { id: 'Advaita', title: 'Advaita (Smartha Peethams)', icon: '🕉️' },
  { id: 'Vishishtadvaita_Vadakalai', title: 'Sri Vaishnava (Vadakalai)', icon: '🪷' },
  { id: 'Vishishtadvaita_Thengalai', title: 'Sri Vaishnava (Thengalai)', icon: '🪷' },
  { id: 'Dvaita_Pradhana', title: 'Dvaita Madhwa (Pradhana Mathas)', icon: '🔱' },
  { id: 'Dvaita_Udupi', title: 'Udupi Ashta Mathas (Sri Krishna Parayaya)', icon: '🔱' }
];

export const MuttPreferenceModal: React.FC<MuttPreferenceModalProps> = ({
  isOpen,
  onClose,
  selectedMutt,
  onSelectMutt,
  onOpenCompare
}) => {
  const [activeCategory, setActiveCategory] = useState('Standard');

  if (!isOpen) return null;

  const mutts = Object.values(MUTT_REGISTRY);
  const currentMutts = mutts.filter(m => m.category === activeCategory);

  const handleChoose = (id: string) => {
    onSelectMutt(id);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 840 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }} className="gold-gradient-text">
              <Compass size={20} /> Sampradaya & Mutt Tradition Settings
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Choose your specific spiritual Peetham to apply its Shastric rules and Pontiff Aradhanas, or keep Standard.
            </p>
          </div>

          <button onClick={onClose} className="btn-vedic btn-vedic-subtle" style={{ padding: 6 }}>
            <X size={18} />
          </button>
        </div>

        {/* Action: Open Side-by-Side Comparison Matrix */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid var(--border-gold)',
          borderRadius: 10,
          padding: '10px 14px',
          marginBottom: 16
        }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--gold-300)' }}>
            💡 <strong>Want to see how rules differ?</strong> Compare Advaita, Vishishtadvaita, and Dvaita side-by-side.
          </div>
          <button
            onClick={() => { onClose(); onOpenCompare(); }}
            className="btn-vedic btn-vedic-gold"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            <Columns3 size={14} /> Side-by-Side Comparison
          </button>
        </div>

        {/* Tradition Category Tabs */}
        <div style={{
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          paddingBottom: 8,
          marginBottom: 14,
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--gold-400)' : '1px solid transparent',
                  background: isActive ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? 'var(--gold-300)' : 'var(--text-secondary)'
                }}
              >
                <span style={{ marginRight: 4 }}>{cat.icon}</span> {cat.title}
              </button>
            );
          })}
        </div>

        {/* Mutts List for Active Category */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 12,
          maxHeight: 380,
          overflowY: 'auto',
          paddingRight: 4
        }}>
          {currentMutts.map(m => {
            const isSelected = selectedMutt === m.id;
            return (
              <div
                key={m.id}
                onClick={() => handleChoose(m.id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isSelected ? 'rgba(245, 158, 11, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '1px solid var(--gold-400)' : '1px solid var(--border-subtle)',
                  boxShadow: isSelected ? '0 0 16px rgba(245, 158, 11, 0.18)' : 'none'
                }}
                onMouseEnter={e => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-gold)';
                }}
                onMouseLeave={e => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: isSelected ? 'var(--gold-300)' : 'var(--text-primary)' }}>
                      {m.name}
                    </h4>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {m.headquarters} • Authority: {m.primaryAuthority}
                    </div>
                  </div>
                  {isSelected && (
                    <span style={{
                      backgroundColor: 'var(--gold-500)',
                      color: '#0f172a',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={13} strokeWidth={3} />
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.4 }}>
                  {m.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div>
            <Bookmark size={13} style={{ display: 'inline', marginRight: 4 }} />
            Your selection is saved automatically to your device and profile.
          </div>
          <button
            onClick={() => handleChoose('STANDARD')}
            className="btn-vedic btn-vedic-subtle"
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            Reset to Standard
          </button>
        </div>
      </div>
    </div>
  );
};
