import React from 'react';
import { Sunrise, Sunset, Moon, ShieldAlert, Sparkles, Clock, Compass } from 'lucide-react';

interface MuhurthaTimetableProps {
  timings: any;
  divisions: any;
  planets: any[];
}

export const MuhurthaTimetable: React.FC<MuhurthaTimetableProps> = ({
  timings,
  divisions,
  planets
}) => {
  if (!timings || !divisions) return null;

  const formatTime = (t: string | Date | null) => {
    if (!t) return '--:--';
    return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ marginBottom: 20 }}>
      {/* 1. Sun & Moon Timeline */}
      <div className="vedic-card" style={{ marginBottom: 16 }}>
        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--gold-300)', marginBottom: 14 }}>
          Surya & Chandra Horizon Timings
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 10 }}>
            <Sunrise size={22} color="var(--gold-400)" />
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>SURYODAYA (SUNRISE)</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatTime(timings.sunrise)}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 10 }}>
            <Sunset size={22} color="var(--saffron-500)" />
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>SURYA ASTAMAYA (SUNSET)</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatTime(timings.sunset)}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 10 }}>
            <Moon size={20} color="#60a5fa" />
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>CHANDRODAYA (MOONRISE)</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatTime(timings.moonrise)}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 10 }}>
            <Clock size={20} color="#34d399" />
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>MADHYAHNA (SOLAR NOON)</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatTime(timings.solarNoon)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Grid: 5-Part Day Divisions & Inauspicious / Auspicious Windows */}
      <div className="grid-2-col" style={{ marginBottom: 16 }}>
        {/* Left: Five Day Divisions (Highlighting Aparahna for Shraddha) */}
        <div className="vedic-card">
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--gold-300)', marginBottom: 12 }}>
            Pancha-Kala (5-Fold Day Divisions)
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 6 }}>
              <span>1. Pratah Kala (Morning)</span>
              <strong>{formatTime(divisions.pratah.start)} - {formatTime(divisions.pratah.end)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 6 }}>
              <span>2. Sangava Kala (Forenoon)</span>
              <strong>{formatTime(divisions.sangava.start)} - {formatTime(divisions.sangava.end)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 6 }}>
              <span>3. Madhyahna Kala (Noon)</span>
              <strong>{formatTime(divisions.madhyahna.start)} - {formatTime(divisions.madhyahna.end)}</strong>
            </div>

            {/* Crucial Aparahna Window */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '9px 12px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(234, 88, 12, 0.08))',
              border: '1px solid var(--border-gold)',
              borderRadius: 8,
              color: 'var(--gold-300)'
            }}>
              <div>
                <strong>4. Aparahna Kala</strong>
                <span style={{ fontSize: '0.72rem', display: 'block', color: 'var(--gold-400)' }}>
                  🌟 Mandatory Window for Shraddha & Pitru Karyam
                </span>
              </div>
              <strong style={{ alignSelf: 'center', fontSize: '0.92rem' }}>
                {formatTime(divisions.aparahna.start)} - {formatTime(divisions.aparahna.end)}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 6 }}>
              <span>5. Sayahna Kala (Late Afternoon / Dusk)</span>
              <strong>{formatTime(divisions.sayahna.start)} - {formatTime(divisions.sayahna.end)}</strong>
            </div>
          </div>
        </div>

        {/* Right: Auspicious & Inauspicious Kala */}
        <div className="vedic-card">
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--gold-300)', marginBottom: 12 }}>
            Auspicious & Inauspicious Muhurthas
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 6 }}>
              <span style={{ color: '#6ee7b7' }}>✨ Brahma Muhurtham</span>
              <strong style={{ color: '#6ee7b7' }}>
                {formatTime(divisions.brahmaMuhurtha.start)} - {formatTime(divisions.brahmaMuhurtha.end)}
              </strong>
            </div>

            {divisions.abhijit && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 6 }}>
                <span style={{ color: '#6ee7b7' }}>✨ Abhijit Muhurtham</span>
                <strong style={{ color: '#6ee7b7' }}>
                  {formatTime(divisions.abhijit.start)} - {formatTime(divisions.abhijit.end)}
                </strong>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 6 }}>
              <span style={{ color: '#fca5a5' }}>⚠️ Rahu Kalam</span>
              <strong style={{ color: '#fca5a5' }}>
                {formatTime(divisions.rahuKalam.start)} - {formatTime(divisions.rahuKalam.end)}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 6 }}>
              <span>⚠️ Yamagandam</span>
              <strong>{formatTime(divisions.yamagandam.start)} - {formatTime(divisions.yamagandam.end)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 6 }}>
              <span>⚠️ Gulika Kalam</span>
              <strong>{formatTime(divisions.gulikaKalam.start)} - {formatTime(divisions.gulikaKalam.end)}</strong>
            </div>

            {divisions.durmuhurtham?.map((dm: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 6 }}>
                <span>⚠️ Durmuhurtham #{i + 1}</span>
                <strong>{formatTime(dm.start)} - {formatTime(dm.end)}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Planetary Positions (Graha Spashta) */}
      {planets?.length > 0 && (
        <div className="vedic-card">
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--gold-300)', marginBottom: 12 }}>
            Graha Spashta (Planetary Longitudes & Positions)
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Graha</th>
                  <th style={{ padding: '8px' }}>Rashi</th>
                  <th style={{ padding: '8px' }}>Degrees in Rashi</th>
                  <th style={{ padding: '8px' }}>Nakshatra</th>
                  <th style={{ padding: '8px' }}>Pada</th>
                  <th style={{ padding: '8px' }}>Motion</th>
                </tr>
              </thead>
              <tbody>
                {planets.map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '8px', fontWeight: 600 }}>
                      <span style={{ marginRight: 6, color: 'var(--gold-400)' }}>{p.symbol}</span>
                      {p.name}
                    </td>
                    <td style={{ padding: '8px' }}>{p.rashiName}</td>
                    <td style={{ padding: '8px', fontFamily: 'monospace' }}>
                      {p.degreesInRashi}° {p.minutesInRashi}'
                    </td>
                    <td style={{ padding: '8px' }}>{p.nakshatraName}</td>
                    <td style={{ padding: '8px' }}>
                      <span className="vedic-badge badge-gold" style={{ padding: '1px 6px', fontSize: '0.68rem' }}>
                        Pada {p.pada}
                      </span>
                    </td>
                    <td style={{ padding: '8px' }}>
                      {p.isRetrograde ? (
                        <span className="vedic-badge badge-crimson" style={{ padding: '1px 6px', fontSize: '0.68rem' }}>
                          Vakri (Retro)
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Marga (Direct)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
