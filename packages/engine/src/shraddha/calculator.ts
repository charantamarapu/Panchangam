/**
 * High-Precision Shraddha Nirnaya Engine
 * Calculates Aparahna Vyapti, Kutapa Kala, two-day conflict resolutions, and .ics export
 */

import { ObserverLocation, calculateDailyPanchangam, DayTimes } from '../astronomy/ephemeris.js';
import { SampradayaType } from '../mutts/rules.js';

export type ShraddhaCalendarSystem = 'LUNAR' | 'SOLAR';
export type ShraddhaRelationship =
  | 'FATHER'
  | 'MOTHER'
  | 'PATERNAL_GRANDFATHER'
  | 'PATERNAL_GRANDMOTHER'
  | 'MATERNAL_GRANDFATHER'
  | 'MATERNAL_GRANDMOTHER'
  | 'SPOUSE'
  | 'OTHER';

export interface AncestorShraddhaProfile {
  id?: string;
  personName: string;
  relationship: ShraddhaRelationship;
  gotra: string;
  tradition: SampradayaType;
  system: ShraddhaCalendarSystem;
  // Lunar Details
  chandraMasa?: string; // e.g. 'Bhadrapada'
  paksha?: 'Shukla' | 'Krishna';
  tithiNumber?: number; // 1 to 15 (15 = Purnima/Amavasya)
  // Solar Details
  sauraMasa?: string; // e.g. 'Simha' or 'Aavani'
  nakshatraIndex?: number; // 0 to 26
  location: ObserverLocation;
  notes?: string;
}

export interface ShraddhaDateResult {
  year: number;
  date: string; // YYYY-MM-DD
  displayDate: string;
  dayOfWeek: string;
  tithiName: string;
  nakshatraName: string;
  // Timings
  sunrise: string;
  sunset: string;
  aparahnaStart: string;
  aparahnaEnd: string;
  kutapaKalaStart: string;
  kutapaKalaEnd: string;
  rohinaKalaStart: string;
  rohinaKalaEnd: string;
  aparahnaVyaptiMinutes: number;
  decisionReason: string;
}

/**
 * Calculates Kutapa and Rohina Muhurtha (8th & 9th of 15 daytime muhurthas).
 */
export function getKutapaRohinaKala(dayTimes: DayTimes) {
  const sunrise = dayTimes.sunrise.getTime();
  const sunset = dayTimes.sunset.getTime();
  const dayLength = sunset - sunrise;
  const muhurthaMs = dayLength / 15;

  // Kutapa is 8th muhurtha (index 7)
  const kutapaStart = new Date(sunrise + 7 * muhurthaMs);
  const kutapaEnd = new Date(sunrise + 8 * muhurthaMs);

  // Rohina is 9th muhurtha (index 8)
  const rohinaStart = new Date(sunrise + 8 * muhurthaMs);
  const rohinaEnd = new Date(sunrise + 9 * muhurthaMs);

  return {
    kutapa: { start: kutapaStart, end: kutapaEnd },
    rohina: { start: rohinaStart, end: rohinaEnd }
  };
}

/**
 * Checks how many minutes a given Tithi overlaps with a day's Aparahna window.
 */
function calculateAparahnaVyaptiMinutes(
  panchangam: ReturnType<typeof calculateDailyPanchangam>,
  targetTithiIdx: number
): number {
  const aparahna = panchangam.divisions.aparahna;
  const apStart = aparahna.start.getTime();
  const apEnd = aparahna.end.getTime();

  // If tithi at sunrise matches target
  const currentTithi = panchangam.angas.tithi;
  if (currentTithi.index === targetTithiIdx) {
    const tEnd = currentTithi.endTime.getTime();
    if (tEnd >= apEnd) {
      // Tithi spans entire Aparahna
      return (apEnd - apStart) / 60000;
    } else if (tEnd > apStart) {
      // Tithi ends during Aparahna
      return (tEnd - apStart) / 60000;
    } else {
      // Tithi ended before Aparahna started
      return 0;
    }
  }

  // Check if previous tithi was active at sunrise, but target tithi begins before or during Aparahna
  const prevTithiTarget = ((currentTithi.index + 1) % 30);
  if (prevTithiTarget === targetTithiIdx) {
    const tStart = currentTithi.endTime.getTime();
    if (tStart <= apStart) {
      // Target tithi started before Aparahna
      return (apEnd - apStart) / 60000;
    } else if (tStart < apEnd) {
      // Target tithi started during Aparahna
      return (apEnd - tStart) / 60000;
    }
  }

  return 0;
}

/**
 * Calculates exact annual Shraddha date for an ancestor for a given target year.
 */
export function calculateAnnualShraddha(
  profile: AncestorShraddhaProfile,
  targetYear: number
): ShraddhaDateResult {
  // Convert target lunar parameters to tithi index
  const pakshaOffset = profile.paksha === 'Krishna' ? 15 : 0;
  const targetTithiNumber = profile.tithiNumber || 1;
  const targetTithiIndex = pakshaOffset + (targetTithiNumber - 1);

  // Approximate search window:
  // Each lunar month occurs roughly around the same calendar window
  const chandraMasaApproxMonths: Record<string, number> = {
    Chaitra: 3,
    Vaishakha: 4,
    Jyeshtha: 5,
    Ashadha: 6,
    Shravana: 7,
    Bhadrapada: 8,
    Ashvina: 9,
    Karttika: 10,
    Margashirsha: 11,
    Pausha: 0,
    Magha: 1,
    Phalguna: 2
  };

  const estMonth = profile.chandraMasa ? chandraMasaApproxMonths[profile.chandraMasa] ?? 8 : 8;
  const searchStart = new Date(Date.UTC(targetYear, Math.max(0, estMonth - 1), 1));
  const searchEnd = new Date(Date.UTC(targetYear, Math.min(11, estMonth + 2), 28));

  // Candidate evaluation across window
  interface Candidate {
    date: Date;
    panchangam: ReturnType<typeof calculateDailyPanchangam>;
    vyaptiMinutes: number;
  }

  const candidates: Candidate[] = [];
  const curr = new Date(searchStart);

  while (curr <= searchEnd) {
    const p = calculateDailyPanchangam(curr, profile.location);
    const m = calculateAparahnaVyaptiMinutes(p, targetTithiIndex);

    // Check if target tithi is either present at sunrise or starts during day
    const isTargetAtSunrise = p.angas.tithi.index === targetTithiIndex;
    const isTargetNext = ((p.angas.tithi.index + 1) % 30) === targetTithiIndex;

    if (isTargetAtSunrise || isTargetNext || m > 0) {
      // Also ensure month match if specified
      if (!profile.chandraMasa || p.solarLunarInfo.chandraMasa.amanta === profile.chandraMasa) {
        candidates.push({
          date: new Date(curr),
          panchangam: p,
          vyaptiMinutes: m
        });
      }
    }
    curr.setDate(curr.getDate() + 1);
  }

  // Disambiguation
  let selectedCandidate: Candidate;
  let decisionReason = '';

  if (candidates.length === 0) {
    // Fallback search around middle
    const fallbackDate = new Date(Date.UTC(targetYear, estMonth, 15));
    const p = calculateDailyPanchangam(fallbackDate, profile.location);
    selectedCandidate = { date: fallbackDate, panchangam: p, vyaptiMinutes: 120 };
    decisionReason = 'Estimated based on solar/lunar calendar proximity.';
  } else if (candidates.length === 1) {
    selectedCandidate = candidates[0];
    decisionReason = `Selected Day ${selectedCandidate.date.toISOString().split('T')[0]} having pure Aparahna Vyapti (${Math.round(selectedCandidate.vyaptiMinutes)} minutes).`;
  } else {
    // Multiple candidates (e.g. Day 1 and Day 2 touch Aparahna)
    const [day1, day2] = candidates;
    if (day1.vyaptiMinutes > day2.vyaptiMinutes) {
      selectedCandidate = day1;
      decisionReason = `Day 1 selected due to greater Aparahna Vyapti (${Math.round(day1.vyaptiMinutes)} min vs ${Math.round(day2.vyaptiMinutes)} min on Day 2).`;
    } else if (day2.vyaptiMinutes > day1.vyaptiMinutes) {
      selectedCandidate = day2;
      decisionReason = `Day 2 selected due to greater Aparahna Vyapti (${Math.round(day2.vyaptiMinutes)} min vs ${Math.round(day1.vyaptiMinutes)} min on Day 1).`;
    } else {
      // Equal or 0 minutes: use Udaya Tithi
      selectedCandidate = day1.panchangam.angas.tithi.index === targetTithiIndex ? day1 : day2;
      decisionReason = 'Resolved based on Suryodaya (Udaya Tithi) Aparaviddha rule.';
    }
  }

  const p = selectedCandidate.panchangam;
  const kutapaRohina = getKutapaRohinaKala(p.timings);

  const timeFormat: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: profile.location.timezone
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return {
    year: targetYear,
    date: p.date,
    displayDate: selectedCandidate.date.toLocaleDateString('en-IN', {
      timeZone: profile.location.timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    dayOfWeek: dayNames[selectedCandidate.date.getDay()],
    tithiName: p.angas.tithi.name,
    nakshatraName: p.angas.nakshatra.name,
    sunrise: p.timings.sunrise.toLocaleTimeString([], timeFormat),
    sunset: p.timings.sunset.toLocaleTimeString([], timeFormat),
    aparahnaStart: p.divisions.aparahna.start.toLocaleTimeString([], timeFormat),
    aparahnaEnd: p.divisions.aparahna.end.toLocaleTimeString([], timeFormat),
    kutapaKalaStart: kutapaRohina.kutapa.start.toLocaleTimeString([], timeFormat),
    kutapaKalaEnd: kutapaRohina.kutapa.end.toLocaleTimeString([], timeFormat),
    rohinaKalaStart: kutapaRohina.rohina.start.toLocaleTimeString([], timeFormat),
    rohinaKalaEnd: kutapaRohina.rohina.end.toLocaleTimeString([], timeFormat),
    aparahnaVyaptiMinutes: Math.round(selectedCandidate.vyaptiMinutes),
    decisionReason
  };
}

/**
 * Calculates upcoming Shraddha dates for the next N years (e.g. next 5 years).
 */
export function calculateUpcomingShraddhas(
  profile: AncestorShraddhaProfile,
  yearsCount: number = 5,
  startYear: number = new Date().getFullYear()
): ShraddhaDateResult[] {
  const results: ShraddhaDateResult[] = [];
  for (let i = 0; i < yearsCount; i++) {
    const yr = startYear + i;
    results.push(calculateAnnualShraddha(profile, yr));
  }
  return results;
}

/**
 * Generates an RFC 5545 iCalendar (.ics) string for importing into Google/Apple/Outlook calendars.
 */
export function generateShraddhaICS(profile: AncestorShraddhaProfile, dates: ShraddhaDateResult[]): string {
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Panchangam Platform//Vedic Shraddha Reminders//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  dates.forEach((d, idx) => {
    const eventDateStr = d.date.replace(/-/g, '');
    const uid = `shraddha-${profile.personName.toLowerCase().replace(/\s+/g, '-')}-${d.year}-${idx}@panchangam.app`;

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${now}`);
    lines.push(`DTSTART;VALUE=DATE:${eventDateStr}`);
    lines.push(`DTEND;VALUE=DATE:${eventDateStr}`);
    lines.push(`SUMMARY:Shraddha - ${profile.personName} (${profile.relationship})`);
    lines.push(
      `DESCRIPTION:Sacred Shraddha Remembrance for ${profile.personName} (${profile.relationship}).\\n` +
      `Gotra: ${profile.gotra}\\n` +
      `Tradition: ${profile.tradition}\\n` +
      `Tithi: ${d.tithiName}\\n` +
      `Nakshatra: ${d.nakshatraName}\\n` +
      `Aparahna Kala: ${d.aparahnaStart} - ${d.aparahnaEnd}\\n` +
      `Kutapa Kala: ${d.kutapaKalaStart} - ${d.kutapaKalaEnd} (Ideal window for Pitru Karyam)\\n` +
      `Nirnaya Note: ${d.decisionReason}`
    );
    lines.push(`LOCATION:${profile.location.latitude.toFixed(4)}, ${profile.location.longitude.toFixed(4)}`);

    // 7-day reminder alarm
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:-P7D');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:Upcoming Shraddha for ${profile.personName} in 7 days.`);
    lines.push('END:VALARM');

    // 1-day reminder alarm
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:-P1D');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:Tomorrow is Shraddha for ${profile.personName}. Prepare for Kutapa Kala (${d.kutapaKalaStart}).`);
    lines.push('END:VALARM');

    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
