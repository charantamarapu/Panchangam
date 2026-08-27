import {
  LanguageMode,
  LOCALIZED_TITHIS,
  LOCALIZED_PAKSHAS,
  LOCALIZED_VARAS,
  LOCALIZED_NAKSHATRAS,
  LOCALIZED_YOGAS,
  LOCALIZED_KARANAS,
  LOCALIZED_RASHIS,
  LOCALIZED_RITUS,
  LOCALIZED_AYANAS,
  LOCALIZED_LUNAR_MASAS,
  LOCALIZED_DAY_DIVISIONS,
  LOCALIZED_PLANETS,
  getLocalizedText,
  getLocalizedTithi,
  formatSamvatsara
} from '@panchangam/engine';

export { LanguageMode, formatSamvatsara };

export function formatTithi(paksha: 'Shukla' | 'Krishna', numberInPaksha: number, mode: LanguageMode): string {
  return getLocalizedTithi(paksha, numberInPaksha, mode);
}

export function formatVara(dayIndex: number, mode: LanguageMode): { name: string; planet: string } {
  const vTerm = LOCALIZED_VARAS[dayIndex] || LOCALIZED_VARAS[0];
  const planets = ['Surya', 'Chandra', 'Mangala', 'Budha', 'Guru', 'Shukra', 'Shani'];
  const pName = planets[dayIndex];
  const pTerm = LOCALIZED_PLANETS[pName] || { devanagari: pName, transliterated: pName, english: pName };

  return {
    name: getLocalizedText(vTerm, mode),
    planet: getLocalizedText(pTerm, mode)
  };
}

export function formatNakshatra(nakshatraIndex: number, pada: number, mode: LanguageMode): string {
  const nTerm = LOCALIZED_NAKSHATRAS[nakshatraIndex] || LOCALIZED_NAKSHATRAS[0];
  const name = getLocalizedText(nTerm, mode);

  if (mode === LanguageMode.SANSKRIT_DEVANAGARI) {
    return `${name} (पाद ${pada})`;
  }
  if (mode === LanguageMode.SANSKRIT_TRANSLITERATED) {
    return `${name} (Pāda ${pada})`;
  }
  return `${name} (Quarter ${pada})`;
}

export function formatYoga(yogaIndex: number, mode: LanguageMode): string {
  const yTerm = LOCALIZED_YOGAS[yogaIndex] || LOCALIZED_YOGAS[0];
  return getLocalizedText(yTerm, mode);
}

export function formatKarana(karanaIndexFull: number, mode: LanguageMode): string {
  let kTerm;
  if (karanaIndexFull === 0) {
    kTerm = LOCALIZED_KARANAS[10]; // Kimstughna
  } else if (karanaIndexFull >= 57) {
    kTerm = LOCALIZED_KARANAS[7 + (karanaIndexFull - 57)]; // Shakuni, Chatushpada, Naga
  } else {
    const charaIndex = (karanaIndexFull - 1) % 7;
    kTerm = LOCALIZED_KARANAS[charaIndex];
  }
  return getLocalizedText(kTerm || LOCALIZED_KARANAS[0], mode);
}

export function formatRashi(rashiIndex: number, mode: LanguageMode): string {
  const rTerm = LOCALIZED_RASHIS[rashiIndex] || LOCALIZED_RASHIS[0];
  return getLocalizedText(rTerm, mode);
}

export function formatRitu(rituIndex: number, mode: LanguageMode): string {
  const rTerm = LOCALIZED_RITUS[rituIndex] || LOCALIZED_RITUS[0];
  return getLocalizedText(rTerm, mode);
}

export function formatAyana(isUttarayana: boolean, mode: LanguageMode): string {
  const aTerm = isUttarayana ? LOCALIZED_AYANAS.Uttarayana : LOCALIZED_AYANAS.Dakshinayana;
  return getLocalizedText(aTerm, mode);
}

export function formatLunarMonth(monthIndex: number, mode: LanguageMode): string {
  const mTerm = LOCALIZED_LUNAR_MASAS[monthIndex % 12] || LOCALIZED_LUNAR_MASAS[0];
  const name = getLocalizedText(mTerm, mode);
  if (mode === LanguageMode.SANSKRIT_DEVANAGARI) {
    return `${name}मासः`;
  }
  if (mode === LanguageMode.SANSKRIT_TRANSLITERATED) {
    return `${name} Māsa`;
  }
  return `${name} (Lunar Month)`;
}

export function formatSolarMonth(rashiIndex: number, mode: LanguageMode): string {
  const rTerm = LOCALIZED_RASHIS[rashiIndex % 12] || LOCALIZED_RASHIS[0];
  const name = getLocalizedText(rTerm, mode);
  if (mode === LanguageMode.SANSKRIT_DEVANAGARI) {
    return `${name}सौरमासः`;
  }
  if (mode === LanguageMode.SANSKRIT_TRANSLITERATED) {
    return `${name} Saura Māsa`;
  }
  return `${name} (Solar Month)`;
}
