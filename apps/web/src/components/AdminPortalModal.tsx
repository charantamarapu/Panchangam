import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { X, Shield, Users, Database, RefreshCw, Trash2, Search } from 'lucide-react';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'records'>('stats');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, u, r] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getAdminShraddhaRecords()
      ]);
      setStats(s);
      setUsers(u);
      setRecords(r);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, phone: string) => {
    if (!window.confirm(`Are you sure you want to delete user with phone ${phone}? This deletes all their records.`)) {
      return;
    }
    try {
      await api.deleteAdminUser(id);
      await loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to delete user');
    }
  };

  if (!isOpen) return null;

  const filteredRecords = records.filter(r =>
    r.personName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.gotra.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.relationship.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (r.user && r.user.phone.includes(searchFilter))
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 900 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'rgba(220, 38, 38, 0.2)',
              border: '1px solid rgba(220, 38, 38, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fca5a5'
            }}>
              <Shield size={20} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }} className="gold-gradient-text">
                Administrator Command Center
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                System-wide visibility across registered mobile users and ancestral Shraddha records
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={loadData}
              disabled={loading}
              className="btn-vedic btn-vedic-subtle"
              style={{ padding: '6px 10px', fontSize: '0.78rem' }}
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button onClick={onClose} className="btn-vedic btn-vedic-subtle" style={{ padding: 6 }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 20,
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 10
        }}>
          <button
            onClick={() => setActiveTab('stats')}
            className={`btn-vedic ${activeTab === 'stats' ? 'btn-vedic-gold' : 'btn-vedic-subtle'}`}
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
          >
            <Database size={14} /> Platform Metrics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`btn-vedic ${activeTab === 'users' ? 'btn-vedic-gold' : 'btn-vedic-subtle'}`}
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
          >
            <Users size={14} /> Registered Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`btn-vedic ${activeTab === 'records' ? 'btn-vedic-gold' : 'btn-vedic-subtle'}`}
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
          >
            <Database size={14} /> Master Shraddha Vault ({records.length})
          </button>
        </div>

        {/* TAB 1: Metrics & Tradition Breakdown */}
        {activeTab === 'stats' && stats && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              marginBottom: 24
            }}>
              <div className="vedic-card" style={{ padding: 16 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Total Mobile Users
                </span>
                <h4 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold-400)', marginTop: 4 }}>
                  {stats.totalUsers}
                </h4>
              </div>

              <div className="vedic-card" style={{ padding: 16 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Saved Shraddha Records
                </span>
                <h4 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#60a5fa', marginTop: 4 }}>
                  {stats.totalShraddhaRecords}
                </h4>
              </div>

              <div className="vedic-card" style={{ padding: 16 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Active Remembrances
                </span>
                <h4 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#34d399', marginTop: 4 }}>
                  {stats.usersWithShraddha}
                </h4>
              </div>
            </div>

            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--gold-300)', marginBottom: 12 }}>
              Breakdown by Sampradaya / Mutt
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              {stats.traditionBreakdown?.map((t: any, idx: number) => (
                <div key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  padding: 12
                }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{t.tradition}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold-400)', marginTop: 2 }}>
                    {t.count} profiles
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Users Directory */}
        {activeTab === 'users' && (
          <div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 8px' }}>User / Name</th>
                    <th style={{ padding: '10px 8px' }}>Mobile Number</th>
                    <th style={{ padding: '10px 8px' }}>Role</th>
                    <th style={{ padding: '10px 8px' }}>Shraddha Records</th>
                    <th style={{ padding: '10px 8px' }}>Joined Date</th>
                    <th style={{ padding: '10px 8px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>{u.phone}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span className={`vedic-badge ${u.role === 'ADMIN' ? 'badge-crimson' : 'badge-gold'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        {u._count?.shraddhaProfiles || 0}
                      </td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.phone)}
                            className="btn-vedic"
                            style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#fca5a5', padding: '4px 8px' }}
                            title="Remove User"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Master Shraddha Records */}
        {activeTab === 'records' && (
          <div>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search by ancestor name, Gotra, relation, or mobile..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="vedic-input"
                style={{ paddingLeft: 38 }}
              />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 8px' }}>Ancestor</th>
                    <th style={{ padding: '10px 8px' }}>Relation</th>
                    <th style={{ padding: '10px 8px' }}>Gotra</th>
                    <th style={{ padding: '10px 8px' }}>Tradition / Tithi</th>
                    <th style={{ padding: '10px 8px' }}>Place</th>
                    <th style={{ padding: '10px 8px' }}>User Account</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '10px 8px', fontWeight: 600, color: 'var(--gold-300)' }}>
                        {r.personName}
                      </td>
                      <td style={{ padding: '10px 8px' }}>{r.relationship}</td>
                      <td style={{ padding: '10px 8px' }}>{r.gotra}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <div>{r.chandraMasa || r.sauraMasa || 'Annual'}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {r.paksha} Tithi {r.tithiNumber || ''}
                        </div>
                      </td>
                      <td style={{ padding: '10px 8px' }}>{r.city}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <div>{r.user?.name}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{r.user?.phone}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
