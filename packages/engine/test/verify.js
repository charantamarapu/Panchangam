import { calculateDailyPanchangam, evaluateMuttObservances, SampradayaType, calculateAnnualShraddha } from '../dist/index.js';

console.log('Testing Panchangam Engine...');

const chennai = {
  latitude: 13.0827,
  longitude: 80.2707,
  timezone: 'Asia/Kolkata'
};

const date = new Date('2026-08-27T06:00:00Z');
const panchangam = calculateDailyPanchangam(date, chennai);

console.log('--- Panchangam for Chennai ---');
console.log('Date:', panchangam.date);
console.log('Sunrise:', panchangam.timings.sunrise.toLocaleTimeString());
console.log('Sunset:', panchangam.timings.sunset.toLocaleTimeString());
console.log('Tithi:', panchangam.angas.tithi.name, 'ends at:', panchangam.angas.tithi.endTime.toLocaleTimeString());
console.log('Nakshatra:', panchangam.angas.nakshatra.name, 'Pada:', panchangam.angas.nakshatra.pada);
console.log('Yoga:', panchangam.angas.yoga.name);
console.log('Karana:', panchangam.angas.karana.name);
console.log('Vara:', panchangam.angas.vara.name);
console.log('Rahu Kalam:', panchangam.divisions.rahuKalam.start.toLocaleTimeString(), '-', panchangam.divisions.rahuKalam.end.toLocaleTimeString());
console.log('Aparahna (for Shraddha):', panchangam.divisions.aparahna.start.toLocaleTimeString(), '-', panchangam.divisions.aparahna.end.toLocaleTimeString());

console.log('\n--- Mutt Observances ---');
const advaita = evaluateMuttObservances(panchangam, SampradayaType.ADVAITA_SMARTHA);
console.log('Advaita (Smartha):', advaita.festivalsAndEvents);

const dvaita = evaluateMuttObservances(panchangam, SampradayaType.DVAITA_UTTARADI);
console.log('Dvaita (Uttaradi):', dvaita.festivalsAndEvents);

console.log('\n--- Shraddha Calculation Test ---');
const shraddhaTest = calculateAnnualShraddha({
  personName: 'Father',
  relationship: 'FATHER',
  gotra: 'Kashyapa',
  tradition: SampradayaType.ADVAITA_SMARTHA,
  system: 'LUNAR',
  chandraMasa: 'Bhadrapada',
  paksha: 'Krishna',
  tithiNumber: 8,
  location: chennai
}, 2026);

console.log('Shraddha Result:', shraddhaTest);
