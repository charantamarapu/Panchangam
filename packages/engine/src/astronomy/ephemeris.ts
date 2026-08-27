/**
 * High-Precision Astronomical Ephemeris & Vedic Calculations Engine
 * 
 * Computes:
 * - Geocentric/Topocentric apparent planetary & lunar longitudes using VSOP87 & ELP2000 theories
 * - Precise Ayanamshas (Lahiri / Chitrapaksha, KP, Raman)
 * - Exact Horizon events (Sunrise, Sunset, Moonrise, Moonset) with atmospheric refraction & elevation
 * - Five Angas (Tithi, Vara, Nakshatra, Yoga, Karana) with exact transition/end timestamps
 * - Solar & Lunar calendar markers (Samvatsara, Ayana, Ritu, Chandra & Saura Masas)
 * - Muhurthas & 5-fold day divisions (Pratah, Sangava, Madhyahna, Aparahna, Sayahna)
 * - Navagraha Spashta (Planetary positions table with degrees, Rashi, Pada, and Retrogression)
 */

import * as Astronomy from 'astronomy-engine';
import {
  RASHIS,
  NAKSHATRAS,
  TITHI_NAMES,
  getTithiName,
  YOGA_NAMES,
  KARANA_NAMES,
  VARA_NAMES,
  SAMVATSARA_NAMES,
  SOLAR_MASA_NAMES,
  LUNAR_MASA_NAMES,
  RITU_NAMES,
  AyanamshaType,
  CalendarSystemType,
  ChoghadiyaType,
  AuspiciousnessType,
  ChoghadiyaDefinition,
  CHOGHADIYA_DEFINITIONS,
  DAY_CHOGHADIYA_TABLE,
  NIGHT_CHOGHADIYA_TABLE,
  CHALDEAN_HORA_ORDER,
  WEEKDAY_FIRST_HORA_INDEX
} from './constants.js';
import { LOCALIZED_SAMVATSARAS } from './localization.js';

export interface ObserverLocation {
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  timezone: string; // e.g. 'Asia/Kolkata'
}

export interface DayTimes {
  sunrise: Date;
  sunset: Date;
  civilDawn: Date;
  civilDusk: Date;
  solarNoon: Date;
  moonrise: Date | null;
  moonset: Date | null;
  dayLengthMinutes: number;
  nightLengthMinutes: number;
}

export interface FiveAngas {
  tithi: {
    index: number; // 0-29
    name: string;
    paksha: 'Shukla' | 'Krishna';
    numberInPaksha: number; // 1-15
    fractionElapsed: number;
    endTime: Date;
    nextTithiName: string;
  };
  vara: {
    index: number; // 0-6
    name: string;
    english: string;
    planet: string;
  };
  nakshatra: {
    index: number; // 0-26
    name: string;
    pada: number; // 1-4
    fractionElapsed: number;
    endTime: Date;
    lord: string;
    deity: string;
    nextNakshatraName: string;
  };
  yoga: {
    index: number; // 0-26
    name: string;
    fractionElapsed: number;
    endTime: Date;
  };
  karana: {
    index: number;
    name: string;
    type: 'Chara' | 'Sthira';
    fractionElapsed: number;
    endTime: Date;
  };
}

export interface DayDivisions {
  pratah: { start: Date; end: Date };
  sangava: { start: Date; end: Date };
  madhyahna: { start: Date; end: Date };
  aparahna: { start: Date; end: Date }; // Essential for Shraddha
  sayahna: { start: Date; end: Date };
  brahmaMuhurtha: { start: Date; end: Date };
  abhijit: { start: Date; end: Date } | null;
  rahuKalam: { start: Date; end: Date };
  yamagandam: { start: Date; end: Date };
  gulikaKalam: { start: Date; end: Date };
  durmuhurtham: Array<{ start: Date; end: Date }>;
  amritKalam: { start: Date; end: Date } | null;
  varjyam: { start: Date; end: Date } | null;
}

export interface PlanetaryPosition {
  name: string;
  symbol: string;
  longitude: number;
  rashiIndex: number;
  rashiName: string;
  degreesInRashi: number;
  minutesInRashi: number;
  nakshatraIndex: number;
  nakshatraName: string;
  pada: number;
  isRetrograde: boolean;
}

export interface SolarLunarInfo {
  samvatsara: {
    index: number;
    name: string;
    sanskrit: string;
    transliterated: string;
    shakaYear: number;
    vikramaYear: number;
  };
  ayana: {
    sanskrit: string;
    english: string;
  };
  ritu: {
    index: number;
    sanskrit: string;
    english: string;
  };
  activeSystem: CalendarSystemType;
  activeMonth: string;
  activeRitu: {
    index: number;
    sanskrit: string;
    english: string;
  };
  systems: {
    souramana: {
      system: CalendarSystemType;
      name: string;
      masa: {
        index: number;
        rashi: string;
        sanskrit: string;
        tamil: string;
        malayalam?: string;
      };
      ritu: {
        index: number;
        sanskrit: string;
        english: string;
      };
    };
    chandramanaAmanta: {
      system: CalendarSystemType;
      name: string;
      masa: string;
      isAdhika: boolean;
      ritu: {
        index: number;
        sanskrit: string;
        english: string;
      };
    };
    chandramanaPurnimanta: {
      system: CalendarSystemType;
      name: string;
      masa: string;
      isAdhika: boolean;
      ritu: {
        index: number;
        sanskrit: string;
        english: string;
      };
    };
  };
  chandraMasa: {
    amanta: string;
    purnimanta: string;
    isAdhika: boolean;
  };
  sauraMasa: {
    index: number;
    rashi: string;
    tamil: string;
    sanskrit: string;
  };
}

export interface PanchangamOutput {
  date: string;
  location: ObserverLocation;
  ayanamsha: {
    type: AyanamshaType;
    value: number;
    formatted: string;
  };
  timings: DayTimes;
  angas: FiveAngas;
  divisions: DayDivisions;
  solarLunarInfo: SolarLunarInfo;
  planets: PlanetaryPosition[];
}

export interface LagnaInfo {
  index: number; // 0 to 11
  rashi: string; // Sanskrit name
  english: string;
  degreesInRashi: number; // 0 to 30
  formatted: string;
  lord: string;
  element: string;
  navamshaIndex: number;
  navamshaRashi: string;
  nakshatraIndex: number;
  nakshatraName: string;
  pada: number;
  nextLagnaTime: Date;
}

export interface HoraSlot {
  index: number;
  lord: string;
  start: Date;
  end: Date;
  quality: AuspiciousnessType;
  isDaytime: boolean;
}

export interface CurrentHoraInfo {
  slot: HoraSlot;
  timeRemainingMinutes: number;
}

export interface ChoghadiyaSlot {
  index: number;
  type: ChoghadiyaType;
  sanskrit: string;
  transliterated: string;
  english: string;
  ruler: string;
  quality: AuspiciousnessType;
  meaning: string;
  start: Date;
  end: Date;
  isDaytime: boolean;
}

export interface CurrentChoghadiyaInfo {
  slot: ChoghadiyaSlot;
  timeRemainingMinutes: number;
}

export interface RealTimeAngas {
  tithi: {
    index: number;
    name: string;
    paksha: 'Shukla' | 'Krishna';
    numberInPaksha: number;
    fractionElapsed: number;
    startTime: Date;
    endTime: Date;
    remainingMs: number;
    nextTithiName: string;
  };
  vara: {
    index: number;
    name: string;
    english: string;
    planet: string;
  };
  nakshatra: {
    index: number;
    name: string;
    pada: number;
    fractionElapsed: number;
    degreesInNakshatra: number;
    startTime: Date;
    endTime: Date;
    remainingMs: number;
    lord: string;
    deity: string;
    nextNakshatraName: string;
    moonRashi: string;
    moonDegreeInRashi: number;
  };
  yoga: {
    index: number;
    name: string;
    fractionElapsed: number;
    endTime: Date;
    remainingMs: number;
    quality: AuspiciousnessType;
  };
  karana: {
    index: number;
    name: string;
    type: 'Chara' | 'Sthira';
    fractionElapsed: number;
    endTime: Date;
    remainingMs: number;
    isVishtiBhadra: boolean;
  };
}

export interface RealTimeActivePeriods {
  activeKala: string;
  isRahuKalam: boolean;
  rahuKalamRemainingMs: number | null;
  nextRahuKalamStart: Date | null;
  isYamagandam: boolean;
  yamagandamRemainingMs: number | null;
  isGulikaKalam: boolean;
  gulikaRemainingMs: number | null;
  isAbhijit: boolean;
  abhijitRemainingMs: number | null;
  isAparahnaPitru: boolean;
}

export interface RealTimePanchangam {
  timestamp: string;
  localTimeFormatted: string;
  location: ObserverLocation;
  ayanamsha: {
    type: AyanamshaType;
    value: number;
    formatted: string;
  };
  currentAngas: RealTimeAngas;
  lagna: LagnaInfo;
  currentHora: CurrentHoraInfo;
  currentChoghadiya: CurrentChoghadiyaInfo;
  activePeriods: RealTimeActivePeriods;
  sunMoon: {
    sunLongitude: number;
    moonLongitude: number;
    sunAltitude: number;
    isDaylight: boolean;
    moonIlluminationPct: number;
    moonPhaseName: string;
  };
  dayPanchangam: PanchangamOutput;
}

/**
 * Calculates high-precision Ayanamsha based on Lahiri, KP, or Raman.
 * In astronomy-engine, time.tt is ALREADY days since J2000.0 (JD 2451545.0).
 */
export function getAyanamsha(date: Date, type: AyanamshaType = AyanamshaType.LAHIRI): number {
  const time = Astronomy.MakeTime(date);
  // Julian centuries since J2000.0
  const T = time.tt / 36525.0;

  // Lahiri Ayanamsha standard IAU polynomial: 23° 51' 25.53" at J2000.0
  const lahiri = 23.857091667 + (5029.0966 / 3600.0) * T + (1.1116 / 3600.0) * T * T;

  if (type === AyanamshaType.KP) {
    // Krishnamurti Padhdhati is approx 5' 56" less than Lahiri
    return lahiri - (5.0 / 60.0 + 56.0 / 3600.0);
  } else if (type === AyanamshaType.RAMAN) {
    // Raman Ayanamsha is approx 1° 24' less than Lahiri
    return lahiri - (1.0 + 24.0 / 60.0);
  }
  return lahiri;
}

/**
 * Formats degrees into DD° MM' SS"
 */
export function formatDegrees(deg: number): string {
  const normalized = (deg % 360 + 360) % 360;
  const d = Math.floor(normalized);
  const mFloat = (normalized - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  return `${d}° ${m}' ${s}"`;
}

/**
 * Computes apparent geocentric/topocentric Sun & Moon ecliptic positions.
 * NOTE: For Moon, we MUST use GeoVector (geocentric/topocentric), NOT EclipticLongitude
 * (which is heliocentric relative to the Sun).
 */
export function getSunMoonLongitudes(date: Date, ayanamsha: number, observer?: Astronomy.Observer) {
  const time = Astronomy.MakeTime(date);

  // Apparent geocentric Sun position
  const sunPos = Astronomy.SunPosition(time);
  const tropicalSun = sunPos.elon;

  // Geocentric or Topocentric Moon position
  const moonVec = Astronomy.GeoVector(Astronomy.Body.Moon, time, true);
  const moonEclip = Astronomy.Ecliptic(moonVec);
  const tropicalMoon = moonEclip.elon;

  const siderealSun = (tropicalSun - ayanamsha + 360) % 360;
  const siderealMoon = (tropicalMoon - ayanamsha + 360) % 360;

  return {
    tropicalSun,
    tropicalMoon,
    siderealSun,
    siderealMoon,
    moonSunDiff: (tropicalMoon - tropicalSun + 360) % 360
  };
}

/**
 * Computes exact Sunrise, Sunset, Moonrise, Moonset for observer.
 */
export function getDayTimes(date: Date, location: ObserverLocation): DayTimes {
  const obs = new Astronomy.Observer(
    location.latitude,
    location.longitude,
    location.elevationMeters || 10
  );

  const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));

  // Search Sun rise and set
  const sunriseEvent = Astronomy.SearchRiseSet(Astronomy.Body.Sun, obs, 1, startOfDay, 1);
  const sunsetEvent = Astronomy.SearchRiseSet(Astronomy.Body.Sun, obs, -1, startOfDay, 1);

  const sunrise = sunriseEvent ? sunriseEvent.date : new Date(startOfDay.getTime() + 6 * 3600000);
  const sunset = sunsetEvent ? sunsetEvent.date : new Date(startOfDay.getTime() + 18 * 3600000);

  // Civil Twilight (-6 deg solar altitude)
  const civilDawnEvent = Astronomy.SearchAltitude(Astronomy.Body.Sun, obs, 1, startOfDay, 1, -6);
  const civilDuskEvent = Astronomy.SearchAltitude(Astronomy.Body.Sun, obs, -1, startOfDay, 1, -6);

  const civilDawn = civilDawnEvent ? civilDawnEvent.date : new Date(sunrise.getTime() - 25 * 60000);
  const civilDusk = civilDuskEvent ? civilDuskEvent.date : new Date(sunset.getTime() + 25 * 60000);

  // Solar Noon (Culmination)
  const transitTime = Astronomy.SearchHourAngle(Astronomy.Body.Sun, obs, 0, startOfDay);
  const solarNoon = transitTime ? transitTime.time.date : new Date((sunrise.getTime() + sunset.getTime()) / 2);

  // Moon rise and set
  const moonriseEvent = Astronomy.SearchRiseSet(Astronomy.Body.Moon, obs, 1, startOfDay, 1);
  const moonsetEvent = Astronomy.SearchRiseSet(Astronomy.Body.Moon, obs, -1, startOfDay, 1);

  const dayLengthMinutes = Math.round((sunset.getTime() - sunrise.getTime()) / 60000);
  const nightLengthMinutes = 1440 - dayLengthMinutes;

  return {
    sunrise,
    sunset,
    civilDawn,
    civilDusk,
    solarNoon,
    moonrise: moonriseEvent ? moonriseEvent.date : null,
    moonset: moonsetEvent ? moonsetEvent.date : null,
    dayLengthMinutes,
    nightLengthMinutes
  };
}

/**
 * Robust search for exact time when Moon - Sun phase angle reaches next multiple of 12°.
 */
function findTithiEnd(startDate: Date): Date {
  const t0 = Astronomy.MakeTime(startDate);
  const s0 = Astronomy.SunPosition(t0).elon;
  const m0 = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, t0, true)).elon;
  const diff0 = (m0 - s0 + 360) % 360;
  const currentIdx = Math.floor(diff0 / 12);
  const targetDeg = (currentIdx + 1) * 12;

  let prev = diff0;
  let unwrapped = diff0;

  // Search forward up to 36 hours in 15-minute steps
  for (let step = 1; step <= 144; step++) {
    const nextDate = new Date(startDate.getTime() + step * 15 * 60000);
    const nextTime = Astronomy.MakeTime(nextDate);
    const curS = Astronomy.SunPosition(nextTime).elon;
    const curM = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, nextTime, true)).elon;
    const curDiff = (curM - curS + 360) % 360;

    let delta = (curDiff - prev + 360) % 360;
    if (delta > 180) delta -= 360;
    unwrapped += delta;
    prev = curDiff;

    if (unwrapped >= targetDeg) {
      let low = startDate.getTime() + (step - 1) * 15 * 60000;
      let high = nextDate.getTime();
      for (let i = 0; i < 20; i++) {
        const mid = (low + high) / 2;
        const midTime = Astronomy.MakeTime(new Date(mid));
        const midS = Astronomy.SunPosition(midTime).elon;
        const midM = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, midTime, true)).elon;
        const d = (midM - midS + 360) % 360;
        let rel = (d - (targetDeg % 360) + 540) % 360 - 180;
        if (rel >= 0) high = mid;
        else low = mid;
      }
      return new Date((low + high) / 2);
    }
  }

  return new Date(startDate.getTime() + 24 * 3600000);
}

/**
 * Robust search for exact time when Sidereal Moon reaches next Nakshatra boundary (multiple of 13° 20').
 */
function findNakshatraEnd(startDate: Date, ayanamshaType: AyanamshaType): Date {
  const span = 360 / 27; // 13.333333333333334
  const t0 = Astronomy.MakeTime(startDate);
  const aya0 = getAyanamsha(startDate, ayanamshaType);
  const m0 = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, t0, true)).elon;
  const sidereal0 = (m0 - aya0 + 360) % 360;

  const currentIdx = Math.floor(sidereal0 / span);
  const targetDeg = (currentIdx + 1) * span;

  let prev = sidereal0;
  let unwrapped = sidereal0;

  for (let step = 1; step <= 144; step++) {
    const nextDate = new Date(startDate.getTime() + step * 15 * 60000);
    const nextTime = Astronomy.MakeTime(nextDate);
    const aya = getAyanamsha(nextDate, ayanamshaType);
    const m = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, nextTime, true)).elon;
    const curSidereal = (m - aya + 360) % 360;

    let delta = (curSidereal - prev + 360) % 360;
    if (delta > 180) delta -= 360;
    unwrapped += delta;
    prev = curSidereal;

    if (unwrapped >= targetDeg) {
      let low = startDate.getTime() + (step - 1) * 15 * 60000;
      let high = nextDate.getTime();
      for (let i = 0; i < 20; i++) {
        const mid = (low + high) / 2;
        const midDate = new Date(mid);
        const midTime = Astronomy.MakeTime(midDate);
        const midAya = getAyanamsha(midDate, ayanamshaType);
        const midM = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, midTime, true)).elon;
        const midSidereal = (midM - midAya + 360) % 360;
        let rel = (midSidereal - (targetDeg % 360) + 540) % 360 - 180;
        if (rel >= 0) high = mid;
        else low = mid;
      }
      return new Date((low + high) / 2);
    }
  }

  return new Date(startDate.getTime() + 24 * 3600000);
}

/**
 * Robust search for exact time when (Sidereal Sun + Sidereal Moon) reaches next Yoga boundary.
 */
function findYogaEnd(startDate: Date, ayanamshaType: AyanamshaType): Date {
  const span = 360 / 27;
  const t0 = Astronomy.MakeTime(startDate);
  const aya0 = getAyanamsha(startDate, ayanamshaType);
  const s0 = (Astronomy.SunPosition(t0).elon - aya0 + 360) % 360;
  const m0 = (Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, t0, true)).elon - aya0 + 360) % 360;
  const y0 = (s0 + m0) % 360;

  const currentIdx = Math.floor(y0 / span);
  const targetDeg = (currentIdx + 1) * span;

  let prev = y0;
  let unwrapped = y0;

  for (let step = 1; step <= 144; step++) {
    const nextDate = new Date(startDate.getTime() + step * 15 * 60000);
    const nextTime = Astronomy.MakeTime(nextDate);
    const aya = getAyanamsha(nextDate, ayanamshaType);
    const s = (Astronomy.SunPosition(nextTime).elon - aya + 360) % 360;
    const m = (Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, nextTime, true)).elon - aya + 360) % 360;
    const curY = (s + m) % 360;

    let delta = (curY - prev + 360) % 360;
    if (delta > 180) delta -= 360;
    unwrapped += delta;
    prev = curY;

    if (unwrapped >= targetDeg) {
      let low = startDate.getTime() + (step - 1) * 15 * 60000;
      let high = nextDate.getTime();
      for (let i = 0; i < 20; i++) {
        const mid = (low + high) / 2;
        const midDate = new Date(mid);
        const midTime = Astronomy.MakeTime(midDate);
        const midAya = getAyanamsha(midDate, ayanamshaType);
        const midS = (Astronomy.SunPosition(midTime).elon - midAya + 360) % 360;
        const midM = (Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, midTime, true)).elon - midAya + 360) % 360;
        const midY = (midS + midM) % 360;
        let rel = (midY - (targetDeg % 360) + 540) % 360 - 180;
        if (rel >= 0) high = mid;
        else low = mid;
      }
      return new Date((low + high) / 2);
    }
  }

  return new Date(startDate.getTime() + 24 * 3600000);
}

/**
 * Calculates Five Angas at a given date/time (usually local sunrise).
 */
export function calculateFiveAngas(
  targetDate: Date,
  location: ObserverLocation,
  dayTimes: DayTimes,
  ayanamshaType: AyanamshaType = AyanamshaType.LAHIRI
): FiveAngas {
  const aya = getAyanamsha(targetDate, ayanamshaType);
  const observer = new Astronomy.Observer(location.latitude, location.longitude, location.elevationMeters || 10);
  const { siderealSun, siderealMoon, moonSunDiff } = getSunMoonLongitudes(targetDate, aya, observer);

  // 1. Tithi (12 degrees per Tithi)
  const tithiIndex = Math.floor(moonSunDiff / 12);
  const tithiFraction = (moonSunDiff % 12) / 12;
  const paksha: 'Shukla' | 'Krishna' = tithiIndex < 15 ? 'Shukla' : 'Krishna';
  const numberInPaksha = (tithiIndex % 15) + 1;
  const tithiEndTime = findTithiEnd(targetDate);

  const tithiName = `${paksha} ${getTithiName(paksha, numberInPaksha)}`;
  const nextTithiIdx = (tithiIndex + 1) % 30;
  const nextTithiPaksha = nextTithiIdx < 15 ? 'Shukla' : 'Krishna';
  const nextTithiNum = (nextTithiIdx % 15) + 1;
  const nextTithiName = `${nextTithiPaksha} ${getTithiName(nextTithiPaksha, nextTithiNum)}`;

  // 2. Vara (Day starts strictly at local Sunrise)
  let varaDate = targetDate;
  if (targetDate.getTime() < dayTimes.sunrise.getTime()) {
    varaDate = new Date(targetDate.getTime() - 24 * 3600000);
  }
  const dayOfWeek = varaDate.getDay(); // 0 is Sunday
  const varaInfo = VARA_NAMES[dayOfWeek];

  // 3. Nakshatra (13° 20' = 13.3333333° per Nakshatra)
  const nakshatraSpan = 360 / 27; // 13.333333333
  const nakshatraIndex = Math.floor(siderealMoon / nakshatraSpan) % 27;
  const nakshatraRemainder = siderealMoon % nakshatraSpan;
  const nakshatraFraction = nakshatraRemainder / nakshatraSpan;
  const pada = Math.floor(nakshatraRemainder / (nakshatraSpan / 4)) + 1;
  const nakshatraEndTime = findNakshatraEnd(targetDate, ayanamshaType);

  const nakshatraData = NAKSHATRAS[nakshatraIndex];
  const nextNakshatraIndex = (nakshatraIndex + 1) % 27;
  const nextNakshatraData = NAKSHATRAS[nextNakshatraIndex];

  // 4. Yoga ((Sidereal Sun + Sidereal Moon) / 13° 20')
  const yogaAngle = (siderealSun + siderealMoon) % 360;
  const yogaIndex = Math.floor(yogaAngle / nakshatraSpan) % 27;
  const yogaFraction = (yogaAngle % nakshatraSpan) / nakshatraSpan;
  const yogaEndTime = findYogaEnd(targetDate, ayanamshaType);

  // 5. Karana (Half a Tithi = 6 degrees)
  const karanaIndexFull = Math.floor(moonSunDiff / 6);
  const karanaFraction = (moonSunDiff % 6) / 6;
  let karanaName: string;
  let karanaType: 'Chara' | 'Sthira';

  if (karanaIndexFull === 0) {
    karanaName = 'Kintughna';
    karanaType = 'Sthira';
  } else if (karanaIndexFull >= 57) {
    const sthiraMap = ['Shakuni', 'Chatushpada', 'Naga'];
    karanaName = sthiraMap[karanaIndexFull - 57];
    karanaType = 'Sthira';
  } else {
    // 7 Repeating Chara (moving) Karanas
    const charaIndex = (karanaIndexFull - 1) % 7;
    karanaName = KARANA_NAMES[charaIndex];
    karanaType = 'Chara';
  }

  // Karana end time is roughly halfway to or at tithi end
  const karanaEndTime = tithiFraction < 0.5
    ? new Date(targetDate.getTime() + (1 - karanaFraction) * 6 * 3600000)
    : tithiEndTime;

  return {
    tithi: {
      index: tithiIndex,
      name: tithiName,
      paksha,
      numberInPaksha,
      fractionElapsed: Number(tithiFraction.toFixed(3)),
      endTime: tithiEndTime,
      nextTithiName
    },
    vara: {
      index: dayOfWeek,
      name: varaInfo.sanskrit,
      english: varaInfo.english,
      planet: varaInfo.planet
    },
    nakshatra: {
      index: nakshatraIndex,
      name: nakshatraData.sanskrit,
      pada,
      fractionElapsed: Number(nakshatraFraction.toFixed(3)),
      endTime: nakshatraEndTime,
      lord: nakshatraData.lord,
      deity: nakshatraData.deity,
      nextNakshatraName: nextNakshatraData.sanskrit
    },
    yoga: {
      index: yogaIndex,
      name: YOGA_NAMES[yogaIndex],
      fractionElapsed: Number(yogaFraction.toFixed(3)),
      endTime: yogaEndTime
    },
    karana: {
      index: karanaIndexFull,
      name: karanaName,
      type: karanaType,
      fractionElapsed: Number(karanaFraction.toFixed(3)),
      endTime: karanaEndTime
    }
  };
}

/**
 * Computes traditional day divisions and Muhurthas.
 */
export function calculateDayDivisions(dayTimes: DayTimes, varaIndex: number): DayDivisions {
  const sunrise = dayTimes.sunrise.getTime();
  const sunset = dayTimes.sunset.getTime();
  const dayLengthMs = sunset - sunrise;
  const partLengthMs = dayLengthMs / 5; // 5-fold day division

  // 1. Five-fold divisions: Pratah, Sangava, Madhyahna, Aparahna, Sayahna
  const pratah = { start: new Date(sunrise), end: new Date(sunrise + partLengthMs) };
  const sangava = { start: new Date(sunrise + partLengthMs), end: new Date(sunrise + 2 * partLengthMs) };
  const madhyahna = { start: new Date(sunrise + 2 * partLengthMs), end: new Date(sunrise + 3 * partLengthMs) };
  const aparahna = { start: new Date(sunrise + 3 * partLengthMs), end: new Date(sunrise + 4 * partLengthMs) };
  const sayahna = { start: new Date(sunrise + 4 * partLengthMs), end: new Date(sunset) };

  // 2. Brahma Muhurtha (2 muhurthas before sunrise = 96 minutes before sunrise)
  const brahmaMuhurtha = {
    start: new Date(sunrise - 96 * 60000),
    end: new Date(sunrise - 48 * 60000)
  };

  // 3. Abhijit Muhurtha (8th Muhurtha of 15 daylight muhurthas, approx centered on solar noon)
  // Not observed on Wednesday (Durmuhurtha overlap)
  const muhurthaLengthMs = dayLengthMs / 15;
  const abhijitStart = new Date(sunrise + 7 * muhurthaLengthMs);
  const abhijitEnd = new Date(sunrise + 8 * muhurthaLengthMs);
  const abhijit = varaIndex === 3 ? null : { start: abhijitStart, end: abhijitEnd };

  // 4. Rahu Kalam (1/8th of daylight based on weekday)
  const rahuParts = [7, 1, 6, 4, 5, 3, 2];
  const octantMs = dayLengthMs / 8;
  const rahuPartIndex = rahuParts[varaIndex];
  const rahuKalam = {
    start: new Date(sunrise + rahuPartIndex * octantMs),
    end: new Date(sunrise + (rahuPartIndex + 1) * octantMs)
  };

  // 5. Yamagandam (Sunday=4, Mon=3, Tue=2, Wed=1, Thu=0, Fri=6, Sat=5)
  const yamaParts = [4, 3, 2, 1, 0, 6, 5];
  const yamaPartIndex = yamaParts[varaIndex];
  const yamagandam = {
    start: new Date(sunrise + yamaPartIndex * octantMs),
    end: new Date(sunrise + (yamaPartIndex + 1) * octantMs)
  };

  // 6. Gulika Kalam (Sunday=6, Mon=5, Tue=4, Wed=3, Thu=2, Fri=1, Sat=0)
  const gulikaParts = [6, 5, 4, 3, 2, 1, 0];
  const gulikaPartIndex = gulikaParts[varaIndex];
  const gulikaKalam = {
    start: new Date(sunrise + gulikaPartIndex * octantMs),
    end: new Date(sunrise + (gulikaPartIndex + 1) * octantMs)
  };

  // 7. Durmuhurtham
  const durmuhurthamParts: Record<number, number[]> = {
    0: [13],
    1: [8, 11],
    2: [1, 6],
    3: [7],
    4: [5, 12],
    5: [3, 8],
    6: [0, 1]
  };
  const dParts = durmuhurthamParts[varaIndex] || [0];
  const durmuhurtham = dParts.map(p => ({
    start: new Date(sunrise + p * muhurthaLengthMs),
    end: new Date(sunrise + (p + 1) * muhurthaLengthMs)
  }));

  return {
    pratah,
    sangava,
    madhyahna,
    aparahna,
    sayahna,
    brahmaMuhurtha,
    abhijit,
    rahuKalam,
    yamagandam,
    gulikaKalam,
    durmuhurtham,
    amritKalam: null,
    varjyam: null
  };
}

/**
 * Computes Planetary Positions (Navagraha Spashta).
 */
export function getPlanetaryPositions(date: Date, ayanamsha: number): PlanetaryPosition[] {
  const time = Astronomy.MakeTime(date);
  const bodies = [
    { body: Astronomy.Body.Sun, name: 'Surya (Sun)', symbol: '☉' },
    { body: Astronomy.Body.Moon, name: 'Chandra (Moon)', symbol: '☽' },
    { body: Astronomy.Body.Mars, name: 'Mangala (Mars)', symbol: '♂' },
    { body: Astronomy.Body.Mercury, name: 'Budha (Mercury)', symbol: '☿' },
    { body: Astronomy.Body.Jupiter, name: 'Brihaspati (Jupiter)', symbol: '♃' },
    { body: Astronomy.Body.Venus, name: 'Shukra (Venus)', symbol: '♀' },
    { body: Astronomy.Body.Saturn, name: 'Shani (Saturn)', symbol: '♄' },
  ];

  const nakshatraSpan = 360 / 27;

  return bodies.map(b => {
    let tropicalLon = 0;
    let isRetro = false;

    if (b.body === Astronomy.Body.Sun) {
      tropicalLon = Astronomy.SunPosition(time).elon;
    } else if (b.body === Astronomy.Body.Moon) {
      const gv = Astronomy.GeoVector(Astronomy.Body.Moon, time, true);
      tropicalLon = Astronomy.Ecliptic(gv).elon;
    } else {
      tropicalLon = Astronomy.EclipticLongitude(b.body, time);

      // Check retrogression by comparing with position 1 hour later
      const timeLater = Astronomy.MakeTime(new Date(date.getTime() + 3600000));
      const lonLater = Astronomy.EclipticLongitude(b.body, timeLater);
      const rate = (lonLater - tropicalLon + 540) % 360 - 180;
      isRetro = rate < 0;
    }

    const siderealLon = (tropicalLon - ayanamsha + 360) % 360;
    const rashiIndex = Math.floor(siderealLon / 30) % 12;
    const degInRashi = siderealLon % 30;
    const d = Math.floor(degInRashi);
    const m = Math.floor((degInRashi - d) * 60);

    const nakshatraIndex = Math.floor(siderealLon / nakshatraSpan) % 27;
    const pada = Math.floor((siderealLon % nakshatraSpan) / (nakshatraSpan / 4)) + 1;

    return {
      name: b.name,
      symbol: b.symbol,
      longitude: Number(siderealLon.toFixed(4)),
      rashiIndex,
      rashiName: RASHIS[rashiIndex].sanskrit,
      degreesInRashi: d,
      minutesInRashi: m,
      nakshatraIndex,
      nakshatraName: NAKSHATRAS[nakshatraIndex].sanskrit,
      pada,
      isRetrograde: isRetro
    };
  });
}

/**
 * Calculates Solar and Lunar calendar markers (Samvatsara, Ayana, Ritu, Masas)
 * supporting Souramana, Chandramana Amanta, and Chandramana Purnimanta systems.
 */
export function getSolarLunarInfo(
  date: Date,
  siderealSun: number,
  tithiIndex: number,
  calendarSystem: CalendarSystemType = CalendarSystemType.CHANDRAMANA_AMANTA
): SolarLunarInfo {
  const gregYear = date.getFullYear();
  const isAfterChaitra = (date.getMonth() > 2) || (date.getMonth() === 2 && date.getDate() >= 22);
  const shakaYear = isAfterChaitra ? gregYear - 78 : gregYear - 79;
  const vikramaYear = shakaYear + 135;
  const samvatsaraIndex = (shakaYear + 11) % 60;
  const samvatsaraName = SAMVATSARA_NAMES[samvatsaraIndex];

  const isUttarayana = siderealSun >= 270 || siderealSun < 90;
  const ayana = isUttarayana
    ? { sanskrit: 'उत्तरायण (Uttarayana)', english: 'Northern Course' }
    : { sanskrit: 'दक्षिणायन (Dakshinayana)', english: 'Southern Course' };

  // 1. Souramana (Solar Calendar)
  const sauraMasaIndex = Math.floor(siderealSun / 30) % 12;
  const sauraMasa = SOLAR_MASA_NAMES[sauraMasaIndex];
  const sauraRituIndex = Math.floor(sauraMasaIndex / 2) % 6;
  const sauraRitu = RITU_NAMES[sauraRituIndex];

  // 2. Chandramana Amanta (New Moon to New Moon)
  const amantaMasaIndex = sauraMasaIndex;
  const amantaMasa = LUNAR_MASA_NAMES[amantaMasaIndex];
  const amantaRituIndex = Math.floor(amantaMasaIndex / 2) % 6;
  const amantaRitu = RITU_NAMES[amantaRituIndex];

  // 3. Chandramana Purnimanta (Full Moon to Full Moon)
  // In Shukla Paksha (0-14), Purnimanta month name is identical to Amanta.
  // In Krishna Paksha (15-29), Purnimanta month shifts 1 month ahead!
  const purnimantaMasaIndex = tithiIndex >= 15 ? (amantaMasaIndex + 1) % 12 : amantaMasaIndex;
  const purnimantaMasa = LUNAR_MASA_NAMES[purnimantaMasaIndex];
  const purnimantaRituIndex = Math.floor(purnimantaMasaIndex / 2) % 6;
  const purnimantaRitu = RITU_NAMES[purnimantaRituIndex];

  // Determine active display month and ritu based on user preference
  let activeMonth: string;
  let activeRitu = amantaRitu;

  if (calendarSystem === CalendarSystemType.SOURAMANA) {
    activeMonth = `${sauraMasa.sanskrit} (${sauraMasa.tamil})`;
    activeRitu = sauraRitu;
  } else if (calendarSystem === CalendarSystemType.CHANDRAMANA_PURNIMANTA) {
    activeMonth = purnimantaMasa;
    activeRitu = purnimantaRitu;
  } else {
    // Default: CHANDRAMANA_AMANTA
    activeMonth = amantaMasa;
    activeRitu = amantaRitu;
  }

  return {
    samvatsara: {
      index: samvatsaraIndex,
      name: samvatsaraName,
      sanskrit: LOCALIZED_SAMVATSARAS[samvatsaraIndex].devanagari,
      transliterated: LOCALIZED_SAMVATSARAS[samvatsaraIndex].transliterated,
      shakaYear,
      vikramaYear
    },
    ayana,
    ritu: activeRitu,
    activeSystem: calendarSystem,
    activeMonth,
    activeRitu,
    systems: {
      souramana: {
        system: CalendarSystemType.SOURAMANA,
        name: 'Souramana (Solar)',
        masa: sauraMasa,
        ritu: sauraRitu
      },
      chandramanaAmanta: {
        system: CalendarSystemType.CHANDRAMANA_AMANTA,
        name: 'Chandramana Amanta (Amavasyanta)',
        masa: amantaMasa,
        isAdhika: false,
        ritu: amantaRitu
      },
      chandramanaPurnimanta: {
        system: CalendarSystemType.CHANDRAMANA_PURNIMANTA,
        name: 'Chandramana Purnimanta',
        masa: purnimantaMasa,
        isAdhika: false,
        ritu: purnimantaRitu
      }
    },
    chandraMasa: {
      amanta: amantaMasa,
      purnimanta: purnimantaMasa,
      isAdhika: false
    },
    sauraMasa: {
      index: sauraMasa.index,
      rashi: sauraMasa.rashi,
      tamil: sauraMasa.tamil,
      sanskrit: sauraMasa.sanskrit
    }
  };
}

/**
 * Primary calculation entry point for a single day.
 */
export function calculateDailyPanchangam(
  date: Date,
  location: ObserverLocation,
  ayanamshaType: AyanamshaType = AyanamshaType.LAHIRI,
  calendarSystem: CalendarSystemType = CalendarSystemType.CHANDRAMANA_AMANTA
): PanchangamOutput {
  const aya = getAyanamsha(date, ayanamshaType);
  const observer = new Astronomy.Observer(location.latitude, location.longitude, location.elevationMeters || 10);

  // 1. Precise Horizon Timings
  const timings = getDayTimes(date, location);

  // 2. Day Divisions & Muhurthas based on Sunrise & Sunset
  const dayOfWeek = timings.sunrise.getDay();
  const divisions = calculateDayDivisions(timings, dayOfWeek);

  // 3. Five Angas calculated at local Sunrise
  const angas = calculateFiveAngas(timings.sunrise, location, timings, ayanamshaType);

  // 4. Solar & Lunar Calendar Markers (Samvatsara, Ayana, Ritu, Masas)
  const { siderealSun } = getSunMoonLongitudes(timings.sunrise, aya, observer);
  const solarLunarInfo = getSolarLunarInfo(date, siderealSun, angas.tithi.index, calendarSystem);

  // 5. Navagraha Spashta (Planetary Positions)
  const planets = getPlanetaryPositions(timings.sunrise, aya);

  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');

  return {
    date: `${y}-${m}-${d}`,
    location,
    ayanamsha: {
      type: ayanamshaType,
      value: Number(aya.toFixed(4)),
      formatted: formatDegrees(aya)
    },
    timings,
    angas,
    divisions,
    solarLunarInfo,
    planets
  };
}

/**
 * Robust search for exact start time of the current Tithi (stepping backwards).
 */
export function findTithiStart(startDate: Date): Date {
  const t0 = Astronomy.MakeTime(startDate);
  const s0 = Astronomy.SunPosition(t0).elon;
  const m0 = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, t0, true)).elon;
  const diff0 = (m0 - s0 + 360) % 360;
  const currentIdx = Math.floor(diff0 / 12);
  const targetDeg = currentIdx * 12;

  let prev = diff0;
  let unwrapped = diff0;

  for (let step = 1; step <= 144; step++) {
    const prevDate = new Date(startDate.getTime() - step * 15 * 60000);
    const prevTime = Astronomy.MakeTime(prevDate);
    const curS = Astronomy.SunPosition(prevTime).elon;
    const curM = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, prevTime, true)).elon;
    const curDiff = (curM - curS + 360) % 360;

    let delta = (curDiff - prev + 360) % 360;
    if (delta > 180) delta -= 360;
    unwrapped += delta;
    prev = curDiff;

    if (unwrapped <= targetDeg) {
      let low = prevDate.getTime();
      let high = startDate.getTime() - (step - 1) * 15 * 60000;
      for (let i = 0; i < 20; i++) {
        const mid = (low + high) / 2;
        const midTime = Astronomy.MakeTime(new Date(mid));
        const midS = Astronomy.SunPosition(midTime).elon;
        const midM = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, midTime, true)).elon;
        const d = (midM - midS + 360) % 360;
        let rel = (d - (targetDeg % 360) + 540) % 360 - 180;
        if (rel <= 0) low = mid;
        else high = mid;
      }
      return new Date((low + high) / 2);
    }
  }
  return new Date(startDate.getTime() - 24 * 3600000);
}

/**
 * Robust search for exact start time of the current Nakshatra (stepping backwards).
 */
export function findNakshatraStart(startDate: Date, ayanamshaType: AyanamshaType): Date {
  const span = 360 / 27; // 13.333333333333334
  const t0 = Astronomy.MakeTime(startDate);
  const aya0 = getAyanamsha(startDate, ayanamshaType);
  const m0 = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, t0, true)).elon;
  const sidereal0 = (m0 - aya0 + 360) % 360;

  const currentIdx = Math.floor(sidereal0 / span);
  const targetDeg = currentIdx * span;

  let prev = sidereal0;
  let unwrapped = sidereal0;

  for (let step = 1; step <= 144; step++) {
    const prevDate = new Date(startDate.getTime() - step * 15 * 60000);
    const prevTime = Astronomy.MakeTime(prevDate);
    const aya = getAyanamsha(prevDate, ayanamshaType);
    const m = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, prevTime, true)).elon;
    const curSidereal = (m - aya + 360) % 360;

    let delta = (curSidereal - prev + 360) % 360;
    if (delta > 180) delta -= 360;
    unwrapped += delta;
    prev = curSidereal;

    if (unwrapped <= targetDeg) {
      let low = prevDate.getTime();
      let high = startDate.getTime() - (step - 1) * 15 * 60000;
      for (let i = 0; i < 20; i++) {
        const mid = (low + high) / 2;
        const midDate = new Date(mid);
        const midTime = Astronomy.MakeTime(midDate);
        const midAya = getAyanamsha(midDate, ayanamshaType);
        const midM = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, midTime, true)).elon;
        const midSidereal = (midM - midAya + 360) % 360;
        let rel = (midSidereal - (targetDeg % 360) + 540) % 360 - 180;
        if (rel <= 0) low = mid;
        else high = mid;
      }
      return new Date((low + high) / 2);
    }
  }
  return new Date(startDate.getTime() - 24 * 3600000);
}

/**
 * Computes high-precision Sidereal Ascendant (Udaya Lagna) for any date and location.
 */
export function calculateLagna(
  targetDate: Date,
  location: ObserverLocation,
  ayanamsha: number
): LagnaInfo {
  const time = Astronomy.MakeTime(targetDate);
  const gst = Astronomy.SiderealTime(time);
  const lstHours = (gst + location.longitude / 15 + 24) % 24;
  const theta = lstHours * 15 * (Math.PI / 180);
  const eps = 23.4392911 * (Math.PI / 180); // True obliquity of ecliptic
  const phi = location.latitude * (Math.PI / 180);

  const y = Math.cos(theta);
  const x = -Math.sin(theta) * Math.cos(eps) - Math.tan(phi) * Math.sin(eps);
  let ascTropical = Math.atan2(y, x) * (180 / Math.PI);
  if (ascTropical < 0) ascTropical += 360;

  const ascSidereal = (ascTropical - ayanamsha + 360) % 360;
  const rashiIndex = Math.floor(ascSidereal / 30) % 12;
  const degInRashi = ascSidereal % 30;

  const nakshatraSpan = 360 / 27; // 13.333333333
  const nakIndex = Math.floor(ascSidereal / nakshatraSpan) % 27;
  const nakRem = ascSidereal % nakshatraSpan;
  const pada = Math.floor(nakRem / (nakshatraSpan / 4)) + 1;

  const navamshaTotalIdx = Math.floor(ascSidereal / (nakshatraSpan / 4)) % 108;
  const navamshaRashiIdx = navamshaTotalIdx % 12;

  const rashiInfo = RASHIS[rashiIndex];

  // Calculate when next Lagna rises
  let nextLagnaTime = new Date(targetDate.getTime() + Math.max(10, (30 - degInRashi) * 4) * 60000);
  for (let s = 1; s <= 90; s++) {
    const checkDate = new Date(targetDate.getTime() + s * 2 * 60000);
    const cTime = Astronomy.MakeTime(checkDate);
    const cGst = Astronomy.SiderealTime(cTime);
    const cLstHours = (cGst + location.longitude / 15 + 24) % 24;
    const cTheta = cLstHours * 15 * (Math.PI / 180);
    const cy = Math.cos(cTheta);
    const cx = -Math.sin(cTheta) * Math.cos(eps) - Math.tan(phi) * Math.sin(eps);
    let cAscTrop = Math.atan2(cy, cx) * (180 / Math.PI);
    if (cAscTrop < 0) cAscTrop += 360;
    const cAscSid = (cAscTrop - ayanamsha + 360) % 360;
    const cRashi = Math.floor(cAscSid / 30) % 12;
    if (cRashi !== rashiIndex) {
      nextLagnaTime = checkDate;
      break;
    }
  }

  return {
    index: rashiIndex,
    rashi: rashiInfo.sanskrit,
    english: rashiInfo.english,
    degreesInRashi: Number(degInRashi.toFixed(2)),
    formatted: formatDegrees(degInRashi),
    lord: rashiInfo.lord,
    element: rashiInfo.element,
    navamshaIndex: navamshaRashiIdx,
    navamshaRashi: RASHIS[navamshaRashiIdx].sanskrit,
    nakshatraIndex: nakIndex,
    nakshatraName: NAKSHATRAS[nakIndex].sanskrit,
    pada,
    nextLagnaTime
  };
}

/**
 * Computes active Hora for current instant.
 */
export function calculateHora(
  targetDate: Date,
  dayTimes: DayTimes,
  location: ObserverLocation
): CurrentHoraInfo {
  const sunrise = dayTimes.sunrise.getTime();
  const sunset = dayTimes.sunset.getTime();
  const target = targetDate.getTime();

  let isDaytime = true;
  let slotIndex = 0;
  let slotStart: Date;
  let slotEnd: Date;
  let lord: string;
  const dayOfWeek = dayTimes.sunrise.getDay();

  if (target >= sunrise && target < sunset) {
    isDaytime = true;
    const slotLen = (sunset - sunrise) / 12;
    slotIndex = Math.min(11, Math.max(0, Math.floor((target - sunrise) / slotLen)));
    slotStart = new Date(sunrise + slotIndex * slotLen);
    slotEnd = new Date(sunrise + (slotIndex + 1) * slotLen);
    const startHora = WEEKDAY_FIRST_HORA_INDEX[dayOfWeek];
    lord = CHALDEAN_HORA_ORDER[(startHora + slotIndex) % 7];
  } else if (target >= sunset) {
    isDaytime = false;
    const nextDayTimes = getDayTimes(new Date(dayTimes.sunrise.getTime() + 24 * 3600000), location);
    const nextSunrise = nextDayTimes.sunrise.getTime();
    const slotLen = (nextSunrise - sunset) / 12;
    slotIndex = Math.min(11, Math.max(0, Math.floor((target - sunset) / slotLen)));
    slotStart = new Date(sunset + slotIndex * slotLen);
    slotEnd = new Date(sunset + (slotIndex + 1) * slotLen);
    const startHora = WEEKDAY_FIRST_HORA_INDEX[dayOfWeek];
    lord = CHALDEAN_HORA_ORDER[(startHora + 12 + slotIndex) % 7];
  } else {
    isDaytime = false;
    const prevDayTimes = getDayTimes(new Date(dayTimes.sunrise.getTime() - 24 * 3600000), location);
    const prevSunset = prevDayTimes.sunset.getTime();
    const prevVara = (dayOfWeek + 6) % 7;
    const slotLen = (sunrise - prevSunset) / 12;
    slotIndex = Math.min(11, Math.max(0, Math.floor((target - prevSunset) / slotLen)));
    slotStart = new Date(prevSunset + slotIndex * slotLen);
    slotEnd = new Date(prevSunset + (slotIndex + 1) * slotLen);
    const startHora = WEEKDAY_FIRST_HORA_INDEX[prevVara];
    lord = CHALDEAN_HORA_ORDER[(startHora + 12 + slotIndex) % 7];
  }

  const horaQualityMap: Record<string, AuspiciousnessType> = {
    Guru: 'Auspicious',
    Shukra: 'Auspicious',
    Budha: 'Auspicious',
    Chandra: 'Auspicious',
    Surya: 'Neutral',
    Mangala: 'Inauspicious',
    Shani: 'Inauspicious'
  };

  const quality = horaQualityMap[lord] || 'Neutral';
  const remainingMinutes = Math.max(0, Math.round((slotEnd.getTime() - target) / 60000));

  return {
    slot: {
      index: isDaytime ? slotIndex : slotIndex + 12,
      lord,
      start: slotStart,
      end: slotEnd,
      quality,
      isDaytime
    },
    timeRemainingMinutes: remainingMinutes
  };
}

/**
 * Computes active Choghadiya for current instant.
 */
export function calculateChoghadiya(
  targetDate: Date,
  dayTimes: DayTimes,
  location: ObserverLocation
): CurrentChoghadiyaInfo {
  const sunrise = dayTimes.sunrise.getTime();
  const sunset = dayTimes.sunset.getTime();
  const target = targetDate.getTime();

  let isDaytime = true;
  let slotIndex = 0;
  let slotStart: Date;
  let slotEnd: Date;
  let type: ChoghadiyaType;
  const dayOfWeek = dayTimes.sunrise.getDay();

  if (target >= sunrise && target < sunset) {
    isDaytime = true;
    const slotLen = (sunset - sunrise) / 8;
    slotIndex = Math.min(7, Math.max(0, Math.floor((target - sunrise) / slotLen)));
    slotStart = new Date(sunrise + slotIndex * slotLen);
    slotEnd = new Date(sunrise + (slotIndex + 1) * slotLen);
    type = DAY_CHOGHADIYA_TABLE[dayOfWeek][slotIndex];
  } else if (target >= sunset) {
    isDaytime = false;
    const nextDayTimes = getDayTimes(new Date(dayTimes.sunrise.getTime() + 24 * 3600000), location);
    const nextSunrise = nextDayTimes.sunrise.getTime();
    const slotLen = (nextSunrise - sunset) / 8;
    slotIndex = Math.min(7, Math.max(0, Math.floor((target - sunset) / slotLen)));
    slotStart = new Date(sunset + slotIndex * slotLen);
    slotEnd = new Date(sunset + (slotIndex + 1) * slotLen);
    type = NIGHT_CHOGHADIYA_TABLE[dayOfWeek][slotIndex];
  } else {
    isDaytime = false;
    const prevDayTimes = getDayTimes(new Date(dayTimes.sunrise.getTime() - 24 * 3600000), location);
    const prevSunset = prevDayTimes.sunset.getTime();
    const prevVara = (dayOfWeek + 6) % 7;
    const slotLen = (sunrise - prevSunset) / 8;
    slotIndex = Math.min(7, Math.max(0, Math.floor((target - prevSunset) / slotLen)));
    slotStart = new Date(prevSunset + slotIndex * slotLen);
    slotEnd = new Date(prevSunset + (slotIndex + 1) * slotLen);
    type = NIGHT_CHOGHADIYA_TABLE[prevVara][slotIndex];
  }

  const def = CHOGHADIYA_DEFINITIONS[type];
  const remainingMinutes = Math.max(0, Math.round((slotEnd.getTime() - target) / 60000));

  return {
    slot: {
      index: slotIndex,
      type,
      sanskrit: def.sanskrit,
      transliterated: def.transliterated,
      english: def.english,
      ruler: def.ruler,
      quality: def.quality,
      meaning: def.meaning,
      start: slotStart,
      end: slotEnd,
      isDaytime
    },
    timeRemainingMinutes: remainingMinutes
  };
}

/**
 * Calculates complete Real-Time Panchangam for the exact instant (now).
 */
export function calculateRealTimePanchangam(
  targetDate: Date = new Date(),
  location: ObserverLocation,
  ayanamshaType: AyanamshaType = AyanamshaType.LAHIRI,
  calendarSystem: CalendarSystemType = CalendarSystemType.CHANDRAMANA_AMANTA
): RealTimePanchangam {
  const aya = getAyanamsha(targetDate, ayanamshaType);
  const observer = new Astronomy.Observer(location.latitude, location.longitude, location.elevationMeters || 10);
  const targetTime = Astronomy.MakeTime(targetDate);

  // 1. Foundational Day Times for this location
  const dayTimes = getDayTimes(targetDate, location);

  // 2. Daily foundational Panchangam (evaluated at Sunrise)
  const dayPanchangam = calculateDailyPanchangam(targetDate, location, ayanamshaType, calendarSystem);

  // 3. Real-Time Angas (evaluated at current targetDate instant)
  const liveAngasRaw = calculateFiveAngas(targetDate, location, dayTimes, ayanamshaType);
  const tithiStartTime = findTithiStart(targetDate);
  const nakshatraStartTime = findNakshatraStart(targetDate, ayanamshaType);

  const nowMs = targetDate.getTime();
  const tithiEndMs = liveAngasRaw.tithi.endTime.getTime();
  const tithiRemainingMs = Math.max(0, tithiEndMs - nowMs);

  const nakEndMs = liveAngasRaw.nakshatra.endTime.getTime();
  const nakRemainingMs = Math.max(0, nakEndMs - nowMs);

  const yogaEndMs = liveAngasRaw.yoga.endTime.getTime();
  const yogaRemainingMs = Math.max(0, yogaEndMs - nowMs);

  const karanaEndMs = liveAngasRaw.karana.endTime.getTime();
  const karanaRemainingMs = Math.max(0, karanaEndMs - nowMs);

  // Moon Rashi & Degree right now
  const { siderealMoon, siderealSun } = getSunMoonLongitudes(targetDate, aya, observer);
  const moonRashiIdx = Math.floor(siderealMoon / 30) % 12;
  const moonDegInRashi = siderealMoon % 30;

  // Inauspicious Yogas list
  const inauspiciousYogas = [0, 5, 8, 9, 12, 14, 16, 18, 26];
  const yogaQuality: AuspiciousnessType = inauspiciousYogas.includes(liveAngasRaw.yoga.index)
    ? 'Inauspicious'
    : 'Auspicious';

  // Vishti / Bhadra check
  const isVishtiBhadra = liveAngasRaw.karana.name === 'Vishti';

  const currentAngas: RealTimeAngas = {
    tithi: {
      ...liveAngasRaw.tithi,
      startTime: tithiStartTime,
      remainingMs: tithiRemainingMs
    },
    vara: liveAngasRaw.vara,
    nakshatra: {
      ...liveAngasRaw.nakshatra,
      startTime: nakshatraStartTime,
      remainingMs: nakRemainingMs,
      degreesInNakshatra: Number((siderealMoon % (360 / 27)).toFixed(2)),
      moonRashi: RASHIS[moonRashiIdx].sanskrit,
      moonDegreeInRashi: Number(moonDegInRashi.toFixed(2))
    },
    yoga: {
      ...liveAngasRaw.yoga,
      remainingMs: yogaRemainingMs,
      quality: yogaQuality
    },
    karana: {
      ...liveAngasRaw.karana,
      remainingMs: karanaRemainingMs,
      isVishtiBhadra
    }
  };

  // 4. Real-Time Udaya Lagna (Ascendant)
  const lagna = calculateLagna(targetDate, location, aya);

  // 5. Real-Time Hora & Choghadiya
  const currentHora = calculateHora(targetDate, dayTimes, location);
  const currentChoghadiya = calculateChoghadiya(targetDate, dayTimes, location);

  // 6. Active Periods & Alerts
  const divs = dayPanchangam.divisions;
  const rahuStart = divs.rahuKalam.start.getTime();
  const rahuEnd = divs.rahuKalam.end.getTime();
  const isRahuKalam = nowMs >= rahuStart && nowMs <= rahuEnd;
  const rahuKalamRemainingMs = isRahuKalam ? rahuEnd - nowMs : null;
  const nextRahuKalamStart = nowMs < rahuStart ? divs.rahuKalam.start : null;

  const yamaStart = divs.yamagandam.start.getTime();
  const yamaEnd = divs.yamagandam.end.getTime();
  const isYamagandam = nowMs >= yamaStart && nowMs <= yamaEnd;
  const yamagandamRemainingMs = isYamagandam ? yamaEnd - nowMs : null;

  const gulikaStart = divs.gulikaKalam.start.getTime();
  const gulikaEnd = divs.gulikaKalam.end.getTime();
  const isGulikaKalam = nowMs >= gulikaStart && nowMs <= gulikaEnd;
  const gulikaRemainingMs = isGulikaKalam ? gulikaEnd - nowMs : null;

  let isAbhijit = false;
  let abhijitRemainingMs: number | null = null;
  if (divs.abhijit) {
    const abStart = divs.abhijit.start.getTime();
    const abEnd = divs.abhijit.end.getTime();
    isAbhijit = nowMs >= abStart && nowMs <= abEnd;
    abhijitRemainingMs = isAbhijit ? abEnd - nowMs : null;
  }

  const isAparahnaPitru = nowMs >= divs.aparahna.start.getTime() && nowMs < divs.aparahna.end.getTime();

  let activeKala = 'Ratri';
  if (nowMs >= divs.pratah.start.getTime() && nowMs < divs.pratah.end.getTime()) activeKala = 'Pratah';
  else if (nowMs >= divs.sangava.start.getTime() && nowMs < divs.sangava.end.getTime()) activeKala = 'Sangava';
  else if (nowMs >= divs.madhyahna.start.getTime() && nowMs < divs.madhyahna.end.getTime()) activeKala = 'Madhyahna';
  else if (nowMs >= divs.aparahna.start.getTime() && nowMs < divs.aparahna.end.getTime()) activeKala = 'Aparahna';
  else if (nowMs >= divs.sayahna.start.getTime() && nowMs < divs.sayahna.end.getTime()) activeKala = 'Sayahna';

  const activePeriods: RealTimeActivePeriods = {
    activeKala,
    isRahuKalam,
    rahuKalamRemainingMs,
    nextRahuKalamStart,
    isYamagandam,
    yamagandamRemainingMs,
    isGulikaKalam,
    gulikaRemainingMs,
    isAbhijit,
    abhijitRemainingMs,
    isAparahnaPitru
  };

  // 7. Sun & Moon Horizon / Altitude / Illumination
  const sunEq = Astronomy.Equator(Astronomy.Body.Sun, targetTime, observer, true, true);
  const sunHoriz = Astronomy.Horizon(targetTime, observer, sunEq.ra, sunEq.dec, 'normal');
  const moonPhaseAngle = Astronomy.MoonPhase(targetTime); // Phase in degrees 0-360
  const moonIllum = Astronomy.Illumination(Astronomy.Body.Moon, targetTime);

  let moonPhaseName = 'Waxing Gibbous';
  if (moonPhaseAngle < 22.5 || moonPhaseAngle >= 337.5) moonPhaseName = 'New Moon (Amavasya)';
  else if (moonPhaseAngle < 67.5) moonPhaseName = 'Waxing Crescent';
  else if (moonPhaseAngle < 112.5) moonPhaseName = 'First Quarter';
  else if (moonPhaseAngle < 157.5) moonPhaseName = 'Waxing Gibbous';
  else if (moonPhaseAngle < 202.5) moonPhaseName = 'Full Moon (Purnima)';
  else if (moonPhaseAngle < 247.5) moonPhaseName = 'Waning Gibbous';
  else if (moonPhaseAngle < 292.5) moonPhaseName = 'Third Quarter';
  else moonPhaseName = 'Waning Crescent';

  const localTimeFormatted = targetDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: location.timezone
  });

  return {
    timestamp: targetDate.toISOString(),
    localTimeFormatted,
    location,
    ayanamsha: {
      type: ayanamshaType,
      value: Number(aya.toFixed(4)),
      formatted: formatDegrees(aya)
    },
    currentAngas,
    lagna,
    currentHora,
    currentChoghadiya,
    activePeriods,
    sunMoon: {
      sunLongitude: Number(siderealSun.toFixed(2)),
      moonLongitude: Number(siderealMoon.toFixed(2)),
      sunAltitude: Number(sunHoriz.altitude.toFixed(2)),
      isDaylight: sunHoriz.altitude > -0.833,
      moonIlluminationPct: Math.round(moonIllum.phase_fraction * 100),
      moonPhaseName
    },
    dayPanchangam
  };
}

