import React from 'react';
import { Compass } from 'lucide-react';
import {
  formatRitu,
  formatAyana,
  formatLunarMonth,
  formatSolarMonth,
  formatSamvatsara,
  LanguageMode
} from '../utils/language';

interface SolarLunarBarProps {
  info: any;
  calendarSystem: string;
  onChangeCalendarSystem: (system: string) => void;
  languageMode: LanguageMode;
}

export const SolarLunarBar: React.FC<SolarLunarBarProps> = ({
  info,
  calendarSystem,
  onChangeCalendarSystem,
  languageMode
}) => {
  if (!info) return null;

  const { samvatsara, ayana, ritu, chandraMasa, sauraMasa, activeRitu } = info;

  const isUttarayana = ayana.sanskrit.includes('उत्तर') || ayana.english.includes('Northern');
  const displayAyana = formatAyana(isUttarayana, languageMode);
  const displayRitu = formatRitu(activeRitu?.index ?? ritu?.index ?? 2, languageMode);

  const amantaIndex = sauraMasa.index;
  const isPurnimantaDiff = chandraMasa?.purnimanta !== chandraMasa?.amanta;
  const purnimantaIndex = isPurnimantaDiff ? (sauraMasa.index + 1) % 12 : sauraMasa.index;

  // Month Display based on language and calendar system
  let displayActiveMonthTitle = '';
  let displayActiveMonth = '';
  let displayActiveMonthSub = '';

  if (calendarSystem === 'SOURAMANA') {
    displayActiveMonthTitle = languageMode === LanguageMode.SANSKRIT_DEVANAGARI
      ? 'सौरमासः'
      : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED
      ? 'Saura Māsa'
      : 'Solar Month (Souramana)';
    displayActiveMonth = formatSolarMonth(sauraMasa.index, languageMode);
    displayActiveMonthSub = sauraMasa?.tamil ? `${sauraMasa.tamil}` : (sauraMasa?.rashi || '');
  } else if (calendarSystem === 'CHANDRAMANA_PURNIMANTA') {
    displayActiveMonthTitle = languageMode === LanguageMode.SANSKRIT_DEVANAGARI
      ? 'मासः (पूर्णिमान्त)'
      : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED
      ? 'Māsa (Pūrṇimānta)'
      : 'Month (Purnimanta)';
    displayActiveMonth = formatLunarMonth(purnimantaIndex, languageMode);
    displayActiveMonthSub = languageMode === LanguageMode.SANSKRIT_DEVANAGARI
      ? `पूर्णिमान्त: ${formatLunarMonth(purnimantaIndex, languageMode)} (अमान्ते: ${formatLunarMonth(amantaIndex, languageMode)})`
      : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED
      ? `Pūrṇimānta: ${formatLunarMonth(purnimantaIndex, languageMode)} (Amānta: ${formatLunarMonth(amantaIndex, languageMode)})`
      : `Purnimanta: ${chandraMasa?.purnimanta} (Amanta: ${chandraMasa?.amanta})`;
  } else {
    // CHANDRAMANA_AMANTA
    displayActiveMonthTitle = languageMode === LanguageMode.SANSKRIT_DEVANAGARI
      ? 'मासः (अमान्त)'
      : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED
      ? 'Māsa (Amānta)'
      : 'Month (Amanta)';
    displayActiveMonth = formatLunarMonth(amantaIndex, languageMode);
    displayActiveMonthSub = languageMode === LanguageMode.SANSKRIT_DEVANAGARI
      ? `अमान्त: ${formatLunarMonth(amantaIndex, languageMode)} (पूर्णिमान्ते: ${formatLunarMonth(purnimantaIndex, languageMode)})`
      : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED
      ? `Amānta: ${formatLunarMonth(amantaIndex, languageMode)} (Pūrṇimānta: ${formatLunarMonth(purnimantaIndex, languageMode)})`
      : `Amanta: ${chandraMasa?.amanta} (Purnimanta: ${chandraMasa?.purnimanta})`;
  }

  const SYSTEMS = [
    {
      id: 'CHANDRAMANA_AMANTA',
      label: languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? '🌙 चान्द्रमानम् (अमान्त)' : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED ? '🌙 Cāndramāna (Amānta)' : '🌙 Chandramana (Amanta)',
      sub: 'New Moon to New Moon • South & West India (AP, KA, MH, GJ)'
    },
    {
      id: 'CHANDRAMANA_PURNIMANTA',
      label: languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? '🌕 चान्द्रमानम् (पूर्णिमान्त)' : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED ? '🌕 Cāndramāna (Pūrṇimānta)' : '🌕 Chandramana (Purnimanta)',
      sub: 'Full Moon to Full Moon • North India (UP, BR, MP, RJ, HR)'
    },
    {
      id: 'SOURAMANA',
      label: languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? '☀️ सौरमानम् (सौर)' : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED ? '☀️ Sauramāna (Solar)' : '☀️ Souramana (Solar)',
      sub: 'Sankranti / Rashi based • Tamil, Malayalam, Odia, Bengali'
    }
  ];

  return (
    <div className="vedic-card" style={{ marginBottom: 20, padding: '16px 20px' }}>
      {/* Calendar System Switcher Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 14,
        paddingBottom: 12,
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Compass size={16} color="var(--gold-400)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {languageMode === LanguageMode.SANSKRIT_DEVANAGARI
              ? 'कालमान पद्धतिः (मासः तथा ऋतुः)'
              : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED
              ? 'Kālamāna Paddhati (Māsa & Ṛtu)'
              : 'Calendar System (Month & Ritu Reckoning)'}:
          </span>
        </div>

        {/* 3 Interactive System Pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SYSTEMS.map(sys => {
            const isActive = calendarSystem === sys.id;
            return (
              <button
                key={sys.id}
                onClick={() => onChangeCalendarSystem(sys.id)}
                className="btn-vedic"
                style={{
                  fontSize: '0.78rem',
                  padding: '6px 12px',
                  borderRadius: 8,
                  backgroundColor: isActive ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: isActive ? '1px solid var(--gold-400)' : '1px solid var(--border-subtle)',
                  color: isActive ? 'var(--gold-300)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500
                }}
                title={sys.sub}
              >
                {sys.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 14,
        textAlign: 'center'
      }}>
        {/* Samvatsara */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 8px', borderRadius: 8 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? 'संवत्सरः' : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED ? 'Saṁvatsara' : 'Samvatsara (Year)'}
          </span>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-300)', marginTop: 2 }}>
            {formatSamvatsara(samvatsara.index, languageMode)}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            {languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? `शक ${samvatsara.shakaYear} • विक्रम ${samvatsara.vikramaYear}` : `Shaka ${samvatsara.shakaYear} • Vikrama ${samvatsara.vikramaYear}`}
          </div>
        </div>

        {/* Ayana */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 8px', borderRadius: 8 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? 'अयनम्' : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED ? 'Ayanam' : 'Ayana (Solar Course)'}
          </span>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-300)', marginTop: 2 }}>
            {displayAyana}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            {ayana.english}
          </div>
        </div>

        {/* Dynamic Ritu (Season based on active system) */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(234, 88, 12, 0.05))',
          padding: '10px 8px',
          borderRadius: 8,
          border: '1px solid rgba(245, 158, 11, 0.25)'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--gold-400)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
            {languageMode === LanguageMode.SANSKRIT_DEVANAGARI
              ? (calendarSystem === 'SOURAMANA' ? 'सौरऋतुः' : calendarSystem === 'CHANDRAMANA_PURNIMANTA' ? 'ऋतुः (पूर्णिमान्त)' : 'ऋतुः (अमान्त)')
              : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED
              ? (calendarSystem === 'SOURAMANA' ? 'Saura Ṛtu' : calendarSystem === 'CHANDRAMANA_PURNIMANTA' ? 'Ṛtu (Pūrṇimānta)' : 'Ṛtu (Amānta)')
              : `Ritu (${calendarSystem === 'SOURAMANA' ? 'Saura' : calendarSystem === 'CHANDRAMANA_PURNIMANTA' ? 'Purnimanta' : 'Amanta'})`}
          </span>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-300)', marginTop: 2 }}>
            {displayRitu}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            {calendarSystem === 'SOURAMANA'
              ? (languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? 'सौरपद्धत्या' : 'Solar Sidereal')
              : (calendarSystem === 'CHANDRAMANA_PURNIMANTA'
                ? (languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? 'पूर्णिमान्तपद्धत्या' : 'Purnimanta Reckoning')
                : (languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? 'अमान्तपद्धत्या' : 'Amanta Reckoning'))}
          </div>
        </div>

        {/* Active Month (Reckoned by chosen system) */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(255, 255, 255, 0.02))',
          padding: '10px 8px',
          borderRadius: 8,
          border: '1px solid var(--border-gold)'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--gold-400)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
            {displayActiveMonthTitle}
          </span>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-300)', marginTop: 2 }}>
            {displayActiveMonth}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            {displayActiveMonthSub}
          </div>
        </div>
      </div>

      {/* System Comparison Drawer / Footer Hint */}
      <div style={{
        marginTop: 12,
        padding: '8px 12px',
        borderRadius: 6,
        background: 'rgba(0, 0, 0, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        fontSize: '0.74rem',
        color: 'var(--text-muted)'
      }}>
        <div>
          <span>{languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? 'अमान्त' : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED ? 'Amānta' : 'Amanta'}: <strong style={{ color: 'var(--text-primary)' }}>{formatLunarMonth(sauraMasa.index, languageMode)}</strong></span>
          <span style={{ margin: '0 8px' }}>•</span>
          <span>{languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? 'पूर्णिमान्त' : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED ? 'Pūrṇimānta' : 'Purnimanta'}: <strong style={{ color: 'var(--text-primary)' }}>{formatLunarMonth(chandraMasa?.purnimanta === chandraMasa?.amanta ? sauraMasa.index : (sauraMasa.index + 1) % 12, languageMode)}</strong></span>
          <span style={{ margin: '0 8px' }}>•</span>
          <span>{languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? 'सौर' : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED ? 'Saura' : 'Saura'}: <strong style={{ color: 'var(--text-primary)' }}>{formatSolarMonth(sauraMasa.index, languageMode)}</strong></span>
        </div>
        <div style={{ color: 'var(--gold-400)' }}>
          {calendarSystem === 'SOURAMANA'
            ? (languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? '☀️ सौरऋतुः सूर्यस्य राशिसङ्क्रमणेन भवति' : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED ? '☀️ Saura Ṛtuḥ Sūryasya saṅkramaṇena bhavati' : '☀️ Saura Ritu reckoned strictly by Sun\'s Rashi transit')
            : calendarSystem === 'CHANDRAMANA_PURNIMANTA'
            ? (languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? '🌕 पूर्णिमान्तऋतुः कृष्णप्रतिपदि प्रवर्तते' : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED ? '🌕 Pūrṇimānta Ṛtuḥ Kṛṣṇapratipadi pravartate' : '🌕 Purnimanta Ritu shifts at Krishna Pratipada')
            : (languageMode === LanguageMode.SANSKRIT_DEVANAGARI ? '🌙 अमान्तऋतुः शुक्लप्रतिपदि प्रवर्तते' : languageMode === LanguageMode.SANSKRIT_TRANSLITERATED ? '🌙 Amānta Ṛtuḥ Śuklapratipadi pravartate' : '🌙 Amanta Ritu shifts at Shukla Pratipada')}
        </div>
      </div>
    </div>
  );
};
