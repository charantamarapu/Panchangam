import React, { useState } from 'react';
import { api, UserSession } from '../services/api';
import { X, Phone, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        const res = await api.register(phone, name, password);
        onSuccess(res.user);
        onClose();
      } else {
        const res = await api.login(phone, password);
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }} className="gold-gradient-text">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {isRegister
                ? 'Sign up with mobile to sync Shraddha records across devices'
                : 'Enter your registered mobile number and password'}
            </p>
          </div>
          <button onClick={onClose} className="btn-vedic btn-vedic-subtle" style={{ padding: 6 }}>
            <X size={18} />
          </button>
        </div>

        {/* Demo Credentials Prompt */}
        <div style={{
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: 8,
          padding: '10px 12px',
          fontSize: '0.75rem',
          color: 'var(--gold-300)',
          marginBottom: 16
        }}>
          <strong>Demo Logins:</strong><br />
          👤 User: <code>9876543210</code> / <code>user123</code><br />
          🛡️ Admin: <code>9999999999</code> / <code>admin123</code>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'rgba(220, 38, 38, 0.15)',
            border: '1px solid rgba(220, 38, 38, 0.4)',
            borderRadius: 8,
            padding: '10px 12px',
            color: '#fca5a5',
            fontSize: '0.82rem',
            marginBottom: 16
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramanathan Iyer"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="vedic-input"
                  style={{ paddingLeft: 38 }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Mobile Number
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="vedic-input"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="vedic-input"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-vedic btn-vedic-gold"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '11px 0' }}
          >
            {loading ? 'Processing...' : (
              <>
                {isRegister ? 'Complete Registration' : 'Log In Securely'} <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Register and Login */}
        <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(false); setError(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--gold-400)', fontWeight: 600, cursor: 'pointer' }}
              >
                Log In
              </button>
            </span>
          ) : (
            <span>
              New user?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(true); setError(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--gold-400)', fontWeight: 600, cursor: 'pointer' }}
              >
                Create Account with Mobile
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
