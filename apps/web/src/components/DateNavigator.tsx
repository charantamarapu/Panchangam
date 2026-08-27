import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface DateNavigatorProps {
  selectedDate: string; // YYYY-MM-DD
  onChangeDate: (d: string) => void;
  ayanamsha: string;
  onChangeAyanamsha: (a: string) => void;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({
  selectedDate,
  onChangeDate,
  ayanamsha,
  onChangeAyanamsha
}) => {
  const handleShiftDay = (delta: number) => {
    const d = new Date(selectedDate + 'T06:00:00Z');
    d.setDate(d.getDate() + delta);
    onChangeDate(d.toISOString().split('T')[0]);
  };

  const handleSetToday = () => {
    const today = new Date().toISOString().split('T')[0];
    onChangeDate(today);
  };

  return (
    <div className="vedic-card" style={{ marginBottom: 20, padding: '14px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        {/* Date Shift Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => handleShiftDay(-1)}
            className="btn-vedic btn-vedic-outline"
            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
            title="Previous Day"
          >
            <ChevronLeft size={16} /> Prev Day
          </button>

          <button
            onClick={handleSetToday}
            className="btn-vedic btn-vedic-subtle"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            <RotateCcw size={14} /> Today
          </button>

          <button
            onClick={() => handleShiftDay(1)}
            className="btn-vedic btn-vedic-outline"
            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
            title="Next Day"
          >
            Next Day <ChevronRight size={16} />
          </button>
        </div>

        {/* Date Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={18} color="var(--gold-400)" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => onChangeDate(e.target.value)}
              className="vedic-input"
              style={{ padding: '6px 12px', fontSize: '0.88rem', width: 160 }}
            />
          </div>
        </div>

        {/* Ayanamsha Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ayanamsha:</span>
          <select
            value={ayanamsha}
            onChange={e => onChangeAyanamsha(e.target.value)}
            className="vedic-select"
            style={{ padding: '6px 10px', fontSize: '0.8rem', width: 140 }}
          >
            <option value="LAHIRI">Lahiri (Chitrapaksha)</option>
            <option value="KP">KP (Krishnamurti)</option>
            <option value="RAMAN">B.V. Raman</option>
          </select>
        </div>
      </div>
    </div>
  );
};
