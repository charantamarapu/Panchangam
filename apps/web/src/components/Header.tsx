import React, { useState } from 'react';
import { UserSession } from '../services/api';
import { Sparkles, Shield, User, LogOut, BookOpen, Compass, Settings, Languages, Check } from 'lucide-react';
import { MUTT_REGISTRY, LanguageMode } from '@panchangam/engine';

interface HeaderProps {
  user: UserSession | null;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenMuttSettings: () => void;
  selectedMutt: string;
  languageMode: LanguageMode;
  onChangeLanguageMode: (mode: LanguageMode) => void;
  onLogout: () => void;
  activeTab: 'panchangam' | 'shraddha';
  setActiveTab: (tab: 'panchangam' | 'shraddha') => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenAuth,
  onOpenAdmin,
  onOpenMuttSettings,
  selectedMutt,
  languageMode,
  onChangeLanguageMode,
  onLogout,
  activeTab,
  setActiveTab
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const currentMuttObj = MUTT_REGISTRY[selectedMutt];
  const muttDisplayName = selectedMutt === 'STANDARD' ? 'Standard' : (currentMuttObj?.name.split('(')[0].trim() || selectedMutt);

  const LANG_OPTIONS = [
    {
      id: LanguageMode.SANSKRIT_DEVANAGARI,
      label: 'संस्कृतम् (देवनागरी)',
      desc: 'Pure Sanskrit in Devanagari script (e.g. शुक्ल चतुर्दशी, धनिष्ठा)',
      icon: '🕉️'
    },
    {
      id: LanguageMode.SANSKRIT_TRANSLITERATED,
      label: 'IAST (Transliterated)',
      desc: 'Sanskrit in Roman English alphabet (e.g. Śukla Caturdaśī, Dhaniṣṭhā)',
      icon: '🔤'
    },
    {
      id: LanguageMode.ENGLISH,
      label: 'English (Translation)',
      desc: 'English translations and astronomical terms (e.g. Bright 14th Day, Thursday)',
      icon: '🇬🇧'
    }
  ];

  const currentLangLabel = LANG_OPTIONS.find(l => l.id === languageMode)?.label.split(' ')[0] || 'Language';

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'rgba(10, 13, 20, 0.9)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '10px 20px'
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 14
      }}>
        {/* Brand & Sacred Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(234, 88, 12, 0.15))',
            border: '1px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            color: 'var(--gold-400)',
            boxShadow: '0 0 16px rgba(245, 158, 11, 0.25)'
          }}>
            🕉️
          </div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '0.5px'
            }} className="gold-gradient-text">
              {languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? 'रियल पञ्चाङ्गम्' : 'Real Panchangam'}
            </h1>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {languageMode === LanguageMode.SANSKRIT_DEVANAGARI
                ? 'दृग्गणित पञ्चाङ्गम् तथा वार्षिक श्राद्ध निर्णयः'
                : 'High-Precision Vedic Ephemeris & Shraddha Hub'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 10,
          padding: 3,
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveTab('panchangam')}
            className="btn-vedic"
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: '0.82rem',
              backgroundColor: activeTab === 'panchangam' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              color: activeTab === 'panchangam' ? 'var(--gold-300)' : 'var(--text-secondary)',
              border: activeTab === 'panchangam' ? '1px solid var(--border-gold)' : 'none'
            }}
          >
            <Compass size={15} /> Daily Panchangam
          </button>
          <button
            onClick={() => setActiveTab('shraddha')}
            className="btn-vedic"
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: '0.82rem',
              backgroundColor: activeTab === 'shraddha' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              color: activeTab === 'shraddha' ? 'var(--gold-300)' : 'var(--text-secondary)',
              border: activeTab === 'shraddha' ? '1px solid var(--border-gold)' : 'none'
            }}
          >
            <Sparkles size={15} /> Shraddha Hub & Reminders
          </button>
        </div>

        {/* Right Side: Language Switcher, Mutt Settings, Auth, Admin, Swagger Docs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
          {/* Language Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="btn-vedic btn-vedic-outline"
              style={{
                fontSize: '0.78rem',
                padding: '6px 10px',
                borderColor: 'var(--border-gold)',
                color: 'var(--gold-300)',
                background: 'rgba(245, 158, 11, 0.08)'
              }}
              title="Change Display Language (Sanskrit / Transliterated / English)"
            >
              <Languages size={14} />
              <span>{currentLangLabel}</span>
            </button>

            {/* Dropdown Menu */}
            {isLangMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  width: 270,
                  backgroundColor: '#0f172a',
                  border: '1px solid var(--gold-400)',
                  borderRadius: 10,
                  padding: 6,
                  boxShadow: '0 12px 32px rgba(0,0,0,0.8), 0 0 16px rgba(245, 158, 11, 0.2)',
                  zIndex: 200
                }}
              >
                <div style={{ padding: '6px 8px', fontSize: '0.72rem', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 4 }}>
                  Select Display Script / Language
                </div>

                {LANG_OPTIONS.map(opt => {
                  const isSelected = languageMode === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => {
                        onChangeLanguageMode(opt.id);
                        setIsLangMenuOpen(false);
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.18)' : 'transparent',
                        color: isSelected ? 'var(--gold-300)' : 'var(--text-primary)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>{opt.icon}</span> {opt.label}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {opt.desc}
                        </div>
                      </div>
                      {isSelected && <Check size={14} color="var(--gold-400)" style={{ marginTop: 2 }} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mutt Settings Badge Button */}
          <button
            onClick={onOpenMuttSettings}
            className="btn-vedic btn-vedic-outline"
            style={{
              fontSize: '0.78rem',
              padding: '6px 10px',
              backgroundColor: selectedMutt !== 'STANDARD' ? 'rgba(245, 158, 11, 0.15)' : 'transparent'
            }}
            title="Custom Sampradaya & Mutt Rules Settings"
          >
            <Settings size={14} />
            Mutt: <strong style={{ color: selectedMutt !== 'STANDARD' ? 'var(--gold-400)' : 'var(--text-primary)' }}>{muttDisplayName}</strong>
          </button>

          {/* Direct link to OpenAPI / Swagger docs */}
          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-vedic btn-vedic-subtle"
            style={{ fontSize: '0.78rem', padding: '6px 10px' }}
            title="Open Interactive Swagger REST API Documentation"
          >
            <BookOpen size={14} /> API
          </a>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {user.role === 'ADMIN' && (
                <button
                  onClick={onOpenAdmin}
                  className="btn-vedic"
                  style={{
                    backgroundColor: 'rgba(220, 38, 38, 0.2)',
                    border: '1px solid rgba(220, 38, 38, 0.4)',
                    color: '#fca5a5',
                    fontSize: '0.78rem',
                    padding: '6px 10px'
                  }}
                >
                  <Shield size={14} /> Admin
                </button>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 10px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.05)',
                fontSize: '0.8rem'
              }}>
                <User size={13} color="var(--gold-400)" />
                <span style={{ fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
              </div>

              <button
                onClick={onLogout}
                className="btn-vedic btn-vedic-subtle"
                style={{ padding: '6px 8px' }}
                title="Log out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-vedic btn-vedic-gold"
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              <User size={14} /> Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
