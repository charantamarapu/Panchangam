import React, { useState, useEffect } from 'react';
import { api, UserSession } from '../services/api';
import { Sparkles, Plus, Download, Trash2, Lock, Calendar, Heart, Shield } from 'lucide-react';
import { LUNAR_MASA_NAMES, SOLAR_MASA_NAMES, TITHI_NAMES } from '@panchangam/engine';

interface ShraddhaHubProps {
  user: UserSession | null;
  onOpenAuth: () => void;
  currentLocation: any;
}

export const ShraddhaHub: React.FC<ShraddhaHubProps> = ({
  user,
  onOpenAuth,
  currentLocation
}) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [upcomingMap, setUpcomingMap] = useState<Record<string, any[]>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // New Profile Form State
  const [personName, setPersonName] = useState('');
  const [relationship, setRelationship] = useState('FATHER');
  const [gotra, setGotra] = useState('');
  const [tradition, setTradition] = useState('ADVAITA_SMARTHA');
  const [system, setSystem] = useState<'LUNAR' | 'SOLAR'>('LUNAR');
  const [chandraMasa, setChandraMasa] = useState('Bhadrapada');
  const [paksha, setPaksha] = useState<'Shukla' | 'Krishna'>('Krishna');
  const [tithiNumber, setTithiNumber] = useState(8);
  const [sauraMasa, setSauraMasa] = useState('Simha');
  const [notes, setNotes] = useState('');

  // Clean up any stale dummy data from localStorage on mount
  useEffect(() => {
    localStorage.removeItem('local_shraddha_profiles');
  }, []);

  // Load profiles ONLY when user is authenticated
  useEffect(() => {
    if (user) {
      loadProfiles();
    } else {
      setProfiles([]);
      setUpcomingMap({});
    }
  }, [user]);

  const loadProfiles = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Authenticated: load exclusively from cloud database for this user
      const list = await api.getUserShraddhaProfiles();
      setProfiles(list);

      // Calculate upcoming 5-year dates
      const upcoming = await api.getUserUpcomingShraddhas();
      const map: Record<string, any[]> = {};
      upcoming.forEach(u => {
        map[u.profile.id] = u.upcomingDates;
      });
      setUpcomingMap(map);
    } catch (err) {
      console.error('Failed to load Shraddha profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    if (!personName.trim()) {
      alert('Please enter the name of your dear one.');
      return;
    }

    const newRecord = {
      personName: personName.trim(),
      relationship,
      gotra: gotra.trim() || 'Kashyapa',
      tradition,
      system,
      chandraMasa,
      paksha,
      tithiNumber: Number(tithiNumber),
      sauraMasa,
      city: currentLocation.name,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      timezone: currentLocation.timezone,
      notes
    };

    try {
      await api.createShraddhaProfile(newRecord);
      setIsAddModalOpen(false);
      resetForm();
      await loadProfiles();
    } catch (err: any) {
      alert(err.message || 'Failed to save profile');
    }
  };

  const handleDeleteProfile = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this remembrance profile?')) return;
    try {
      await api.deleteShraddhaProfile(id);
      await loadProfiles();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleDownloadICS = async (p: any) => {
    try {
      await api.downloadSavedProfileICS(p.id, p.personName);
    } catch (e: any) {
      alert(e.message || 'Failed to download calendar file');
    }
  };

  const resetForm = () => {
    setPersonName('');
    setRelationship('FATHER');
    setGotra('');
    setTradition('ADVAITA_SMARTHA');
    setSystem('LUNAR');
    setChandraMasa('Bhadrapada');
    setPaksha('Krishna');
    setTithiNumber(8);
    setNotes('');
  };

  // 1. If user is NOT logged in: Show clean, respectful Login Prompt (NO demo/dummy profiles!)
  if (!user) {
    return (
      <div style={{ maxWidth: 720, margin: '40px auto 60px', padding: '0 16px' }}>
        <div className="vedic-card" style={{
          textAlign: 'center',
          padding: '50px 32px',
          background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.95), rgba(27, 38, 59, 0.85))',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(245, 158, 11, 0.15)'
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Lock size={30} color="var(--gold-400)" />
          </div>

          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.45rem',
            color: 'var(--gold-300)',
            marginBottom: 12
          }}>
            Sacred Ancestral Shraddha Hub
          </h3>

          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: 540,
            margin: '0 auto 28px'
          }}>
            To maintain privacy and sanctity, ancestral Shraddha profiles (Father, Mother, Grandparents) are stored securely under your private account.
            <br />
            Sign in easily with your mobile number to save your dear ones and compute their exact 5-year Aparahna Vyapti dates.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={onOpenAuth}
              className="btn-vedic btn-vedic-gold"
              style={{ fontSize: '0.95rem', padding: '12px 30px' }}
            >
              🔑 Log In / Sign Up with Mobile Number
            </button>
          </div>

          <div style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            textAlign: 'left'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gold-400)', fontSize: '0.85rem', fontWeight: 600 }}>
                <Heart size={15} /> Private & Sacred
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Only you can view or manage your family's pitru remembrance records.
              </p>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gold-400)', fontSize: '0.85rem', fontWeight: 600 }}>
                <Calendar size={15} /> Shastric Aparahna Vyapti
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Calculates precise afternoon Kutapa & Aparahna windows for your exact city.
              </p>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gold-400)', fontSize: '0.85rem', fontWeight: 600 }}>
                <Shield size={15} /> 5-Year Alarms (.ics)
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Direct export to Google Calendar, Apple Calendar, and Outlook with reminders.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. User IS logged in: Render User's Actual Saved Profiles
  return (
    <div>
      {/* Top Banner */}
      <div className="vedic-card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, rgba(20, 27, 43, 0.9), rgba(245, 158, 11, 0.08))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }} className="gold-gradient-text">
              <Sparkles size={20} /> Your Ancestral Remembrance Hub
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Precise Aparahna Vyapti & Kutapa Kala calculation for your parents & ancestors. Add to Apple, Google, or Outlook Calendar with automatic reminders.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-vedic btn-vedic-gold"
            >
              <Plus size={16} /> Add Dear One (Father, Mother, etc.)
            </button>
          </div>
        </div>
      </div>

      {loading && profiles.length === 0 && (
        <div className="vedic-card" style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ color: 'var(--text-secondary)' }}>Loading your saved profiles...</div>
        </div>
      )}

      {/* List of Saved Profiles */}
      {!loading && profiles.length === 0 ? (
        <div className="vedic-card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <span style={{ fontSize: '2.5rem' }}>🪷</span>
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--gold-300)', marginTop: 12 }}>
            No Ancestor Profiles Added Yet
          </h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: 480, margin: '8px auto 20px' }}>
            Click the button below to add your dear ones (Father, Mother, Grandfather, etc.) with their Gotra and Death Tithi to calculate exact annual Shraddha dates for the next 5 years.
          </p>
          <button onClick={() => setIsAddModalOpen(true)} className="btn-vedic btn-vedic-gold">
            <Plus size={16} /> Add Dear One Profile
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {profiles.map(p => {
            const upcomingDates = upcomingMap[p.id] || [];

            return (
              <div key={p.id} className="vedic-card">
                {/* Profile Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 12,
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: 14,
                  marginBottom: 16
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--gold-300)' }}>
                        {p.personName}
                      </h4>
                      <span className="vedic-badge badge-gold">
                        {p.relationship}
                      </span>
                      {p.gotra && (
                        <span className="vedic-badge badge-saffron">
                          Gotra: {p.gotra}
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      Tradition: <strong>{p.tradition}</strong> • System: <strong>{p.system}</strong> (
                      {p.system === 'LUNAR'
                        ? `${p.chandraMasa} Masa, ${p.paksha} Paksha, Tithi ${p.tithiNumber}`
                        : `${p.sauraMasa} Solar Month`}
                      ) • Place: <strong>{p.city}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleDownloadICS(p)}
                      className="btn-vedic btn-vedic-outline"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      title="Download .ics Calendar File with Alarms"
                    >
                      <Download size={14} /> Download .ics (5-Year Alarms)
                    </button>
                    <button
                      onClick={() => handleDeleteProfile(p.id)}
                      className="btn-vedic btn-vedic-subtle"
                      style={{ color: '#ef4444', padding: '6px 10px' }}
                      title="Remove Profile"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Upcoming Dates Table */}
                <div>
                  <h5 style={{ fontSize: '0.85rem', color: 'var(--gold-400)', marginBottom: 8 }}>
                    Upcoming Annual Shraddha Dates & Aparahna Windows (Next 5 Years)
                  </h5>

                  {upcomingDates.length === 0 ? (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Computing high-precision Aparahna Vyapti calendar...
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="vedic-table">
                        <thead>
                          <tr>
                            <th>Year</th>
                            <th>Shraddha Date</th>
                            <th>Day of Week</th>
                            <th>Tithi at Sunrise</th>
                            <th>Aparahna Kala (Shraddha)</th>
                            <th>Kutapa Kala (Ideal)</th>
                            <th>Nirnaya Reasoning</th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingDates.map((item, idx) => {
                            const d = new Date(item.shraddhaDate);
                            const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                            return (
                              <tr key={idx}>
                                <td style={{ fontWeight: 700, color: 'var(--gold-300)' }}>{item.targetYear}</td>
                                <td><strong style={{ color: 'var(--text-primary)' }}>{dateStr}</strong></td>
                                <td>{item.dayOfWeek}</td>
                                <td>{item.tithiName}</td>
                                <td>
                                  <span className="vedic-badge badge-saffron" style={{ fontSize: '0.72rem' }}>
                                    {new Date(item.aparahnaKala.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(item.aparahnaKala.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </td>
                                <td>
                                  <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                                    {new Date(item.kutapaKala.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(item.kutapaKala.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </td>
                                <td style={{ fontSize: '0.72rem', color: 'var(--text-muted)', maxWidth: 280 }}>
                                  {item.nirnayaReasoning}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Profile Modal */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20
        }}>
          <div className="vedic-card" style={{ maxWidth: 550, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--gold-300)' }}>
                Add Ancestor Remembrance Profile
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="btn-vedic btn-vedic-subtle">✕</button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="vedic-label">Person / Parent Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Father (Late Shri R. Sharma)"
                  value={personName}
                  onChange={e => setPersonName(e.target.value)}
                  className="vedic-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="vedic-label">Relationship</label>
                  <select value={relationship} onChange={e => setRelationship(e.target.value)} className="vedic-input">
                    <option value="FATHER">Father (Pitru)</option>
                    <option value="MOTHER">Mother (Matru)</option>
                    <option value="PATERNAL_GRANDFATHER">Paternal Grandfather</option>
                    <option value="PATERNAL_GRANDMOTHER">Paternal Grandmother</option>
                    <option value="MATERNAL_GRANDFATHER">Maternal Grandfather</option>
                    <option value="MATERNAL_GRANDMOTHER">Maternal Grandmother</option>
                    <option value="SPOUSE">Spouse</option>
                    <option value="BROTHER">Brother</option>
                    <option value="OTHER">Other Kin</option>
                  </select>
                </div>
                <div>
                  <label className="vedic-label">Gotra</label>
                  <input
                    type="text"
                    placeholder="e.g. Kashyapa, Bharadvaja"
                    value={gotra}
                    onChange={e => setGotra(e.target.value)}
                    className="vedic-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="vedic-label">Tradition / Mutt Rule</label>
                  <select value={tradition} onChange={e => setTradition(e.target.value)} className="vedic-input">
                    <option value="ADVAITA_SMARTHA">Advaita Smartha (Nirnaya Sindhu)</option>
                    <option value="VISHISHTADVAITA_VADAKALAI">Sri Vaishnava (Vadakalai)</option>
                    <option value="VISHISHTADVAITA_THENGALAI">Sri Vaishnava (Thengalai)</option>
                    <option value="DVAITA_MADHVA">Dvaita Madhva</option>
                  </select>
                </div>
                <div>
                  <label className="vedic-label">Month System</label>
                  <select value={system} onChange={e => setSystem(e.target.value as any)} className="vedic-input">
                    <option value="LUNAR">Chandramana (Lunar Masa)</option>
                    <option value="SOLAR">Souramana (Solar Month)</option>
                  </select>
                </div>
              </div>

              {system === 'LUNAR' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <label className="vedic-label">Chandra Masa</label>
                    <select value={chandraMasa} onChange={e => setChandraMasa(e.target.value)} className="vedic-input">
                      {LUNAR_MASA_NAMES.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="vedic-label">Paksha</label>
                    <select value={paksha} onChange={e => setPaksha(e.target.value as any)} className="vedic-input">
                      <option value="Shukla">Shukla (Bright)</option>
                      <option value="Krishna">Krishna (Dark)</option>
                    </select>
                  </div>
                  <div>
                    <label className="vedic-label">Tithi</label>
                    <select value={tithiNumber} onChange={e => setTithiNumber(Number(e.target.value))} className="vedic-input">
                      {TITHI_NAMES.map((name, idx) => (
                        <option key={idx + 1} value={idx + 1}>#{idx + 1} {name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="vedic-label">Saura Solar Month</label>
                    <select value={sauraMasa} onChange={e => setSauraMasa(e.target.value)} className="vedic-input">
                      {SOLAR_MASA_NAMES.map(m => (
                        <option key={m.rashi} value={m.rashi}>{m.sanskrit} ({m.tamil})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="vedic-label">Tithi</label>
                    <select value={tithiNumber} onChange={e => setTithiNumber(Number(e.target.value))} className="vedic-input">
                      {TITHI_NAMES.map((name, idx) => (
                        <option key={idx + 1} value={idx + 1}>#{idx + 1} {name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="vedic-label">Remembrance Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional notes or sankalpa details..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="vedic-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-vedic btn-vedic-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-vedic btn-vedic-gold">
                  Save Remembrance Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
