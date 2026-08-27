/**
 * Vedic Astronomical Constants, Glossaries, and Enums
 */

export enum AyanamshaType {
  LAHIRI = 'LAHIRI', // Chitrapaksha (Indian Gov standard)
  KP = 'KP',         // Krishnamurti Padhdhati
  RAMAN = 'RAMAN'
}

export enum CalendarSystemType {
  SOURAMANA = 'SOURAMANA',                     // Solar (Tamil, Malayalam, Odia, Bengali)
  CHANDRAMANA_AMANTA = 'CHANDRAMANA_AMANTA',   // Lunar Amavasyanta (Andhra, Karnataka, Maharashtra, Gujarat)
  CHANDRAMANA_PURNIMANTA = 'CHANDRAMANA_PURNIMANTA' // Lunar Purnimanta (North India, UP, Bihar, MP, Rajasthan)
}

export interface RashiInfo {
  index: number; // 0 to 11
  sanskrit: string;
  english: string;
  tamil: string;
  lord: string;
  element: string;
}

export const RASHIS: RashiInfo[] = [
  { index: 0, sanskrit: 'मेष (Mesha)', english: 'Aries', tamil: 'மேஷம்', lord: 'Mars (Kuja)', element: 'Fire' },
  { index: 1, sanskrit: 'वृषभ (Vrishabha)', english: 'Taurus', tamil: 'ரிஷபம்', lord: 'Venus (Shukra)', element: 'Earth' },
  { index: 2, sanskrit: 'मिथुन (Mithuna)', english: 'Gemini', tamil: 'மிதுனம்', lord: 'Mercury (Budha)', element: 'Air' },
  { index: 3, sanskrit: 'कर्क (Karka)', english: 'Cancer', tamil: 'கடகம்', lord: 'Moon (Chandra)', element: 'Water' },
  { index: 4, sanskrit: 'सिंह (Simha)', english: 'Leo', tamil: 'சிம்மம்', lord: 'Sun (Surya)', element: 'Fire' },
  { index: 5, sanskrit: 'कन्या (Kanya)', english: 'Virgo', tamil: 'கன்னி', lord: 'Mercury (Budha)', element: 'Earth' },
  { index: 6, sanskrit: 'तुला (Tula)', english: 'Libra', tamil: 'துலாம்', lord: 'Venus (Shukra)', element: 'Air' },
  { index: 7, sanskrit: 'वृश्चिक (Vrishchika)', english: 'Scorpio', tamil: 'விருச்சிகம்', lord: 'Mars (Kuja)', element: 'Water' },
  { index: 8, sanskrit: 'धनु (Dhanus)', english: 'Sagittarius', tamil: 'தனுசு', lord: 'Jupiter (Guru)', element: 'Fire' },
  { index: 9, sanskrit: 'मकर (Makara)', english: 'Capricorn', tamil: 'மகரம்', lord: 'Saturn (Shani)', element: 'Earth' },
  { index: 10, sanskrit: 'कुम्भ (Kumbha)', english: 'Aquarius', tamil: 'கும்பம்', lord: 'Saturn (Shani)', element: 'Air' },
  { index: 11, sanskrit: 'मीन (Meena)', english: 'Pisces', tamil: 'மீனம்', lord: 'Jupiter (Guru)', element: 'Water' },
];

export interface NakshatraInfo {
  index: number; // 0 to 26
  sanskrit: string;
  english: string;
  tamil: string;
  lord: string;
  deity: string;
}

export const NAKSHATRAS: NakshatraInfo[] = [
  { index: 0, sanskrit: 'अश्विनी (Ashwini)', english: 'Ashwini', tamil: 'அஸ்வினி', lord: 'Ketu', deity: 'Ashwini Kumaras' },
  { index: 1, sanskrit: 'भरणी (Bharani)', english: 'Bharani', tamil: 'பரணி', lord: 'Shukra', deity: 'Yama' },
  { index: 2, sanskrit: 'कृत्तिका (Krittika)', english: 'Krittika', tamil: 'கார்த்திகை', lord: 'Surya', deity: 'Agni' },
  { index: 3, sanskrit: 'रोहिणी (Rohini)', english: 'Rohini', tamil: 'ரோகிணி', lord: 'Chandra', deity: 'Brahma / Prajapati' },
  { index: 4, sanskrit: 'मृगशिरा (Mrigashira)', english: 'Mrigashirsha', tamil: 'மிருகசீரிஷம்', lord: 'Mangala', deity: 'Soma / Chandra' },
  { index: 5, sanskrit: 'आर्द्रा (Ardra)', english: 'Ardra', tamil: 'திருவாதிரை', lord: 'Rahu', deity: 'Rudra' },
  { index: 6, sanskrit: 'पुनर्वसु (Punarvasu)', english: 'Punarvasu', tamil: 'புனர்பூசம்', lord: 'Guru', deity: 'Aditi' },
  { index: 7, sanskrit: 'पुष्य (Pushya)', english: 'Pushya', tamil: 'பூசம்', lord: 'Shani', deity: 'Brihaspati' },
  { index: 8, sanskrit: 'आश्लेषा (Ashlesha)', english: 'Ashlesha', tamil: 'ஆயில்யம்', lord: 'Budha', deity: 'Sarpas' },
  { index: 9, sanskrit: 'मघा (Magha)', english: 'Magha', tamil: 'மகம்', lord: 'Ketu', deity: 'Pitrus' },
  { index: 10, sanskrit: 'पूर्वाफाल्गुनी (Purva Phalguni)', english: 'Purva Phalguni', tamil: 'பூரம்', lord: 'Shukra', deity: 'Bhaga' },
  { index: 11, sanskrit: 'उत्तराफाल्गुनी (Uttara Phalguni)', english: 'Uttara Phalguni', tamil: 'உத்திரம்', lord: 'Surya', deity: 'Aryaman' },
  { index: 12, sanskrit: 'हस्त (Hasta)', english: 'Hasta', tamil: 'அஸ்தம்', lord: 'Chandra', deity: 'Savitr' },
  { index: 13, sanskrit: 'चित्रा (Chitra)', english: 'Chitra', tamil: 'சித்திரை', lord: 'Mangala', deity: 'Tvashtar' },
  { index: 14, sanskrit: 'स्वाती (Swati)', english: 'Swati', tamil: 'சுவாதி', lord: 'Rahu', deity: 'Vayu' },
  { index: 15, sanskrit: 'विशाखा (Vishakha)', english: 'Vishakha', tamil: 'விசாகம்', lord: 'Guru', deity: 'Indragni' },
  { index: 16, sanskrit: 'अनुराधा (Anuradha)', english: 'Anuradha', tamil: 'அனுஷம்', lord: 'Shani', deity: 'Mitra' },
  { index: 17, sanskrit: 'ज्येष्ठा (Jyeshtha)', english: 'Jyeshtha', tamil: 'கேட்டை', lord: 'Budha', deity: 'Indra' },
  { index: 18, sanskrit: 'मूल (Mula)', english: 'Mula', tamil: 'மூலம்', lord: 'Ketu', deity: 'Nirriti' },
  { index: 19, sanskrit: 'पूर्वाषाढा (Purva Ashadha)', english: 'Purva Ashadha', tamil: 'பூராடம்', lord: 'Shukra', deity: 'Apah (Water)' },
  { index: 20, sanskrit: 'उत्तराषाढा (Uttara Ashadha)', english: 'Uttara Ashadha', tamil: 'உத்திராடம்', lord: 'Surya', deity: 'Vishvedevas' },
  { index: 21, sanskrit: 'श्रवण (Shravana)', english: 'Shravana', tamil: 'திருவோணம்', lord: 'Chandra', deity: 'Vishnu' },
  { index: 22, sanskrit: 'धनिष्ठा (Dhanishta)', english: 'Dhanishta', tamil: 'அவிட்டம்', lord: 'Mangala', deity: 'Ashta Vasus' },
  { index: 23, sanskrit: 'शतभिषा (Shatabhisha)', english: 'Shatabhisha', tamil: 'சதயம்', lord: 'Rahu', deity: 'Varuna' },
  { index: 24, sanskrit: 'पूर्वभाद्रपदा (Purva Bhadrapada)', english: 'Purva Bhadrapada', tamil: 'பூரட்டாதி', lord: 'Guru', deity: 'Aja Ekapada' },
  { index: 25, sanskrit: 'उत्तरभाद्रपदा (Uttara Bhadrapada)', english: 'Uttara Bhadrapada', tamil: 'உத்திரட்டாதி', lord: 'Shani', deity: 'Ahirbudhnya' },
  { index: 26, sanskrit: 'रेवती (Revati)', english: 'Revati', tamil: 'ரேவதி', lord: 'Budha', deity: 'Pushan' }
];

export interface TithiInfo {
  index: number; // 0 to 29 (0-14 Shukla, 15-29 Krishna)
  paksha: 'Shukla' | 'Krishna';
  numberInPaksha: number; // 1 to 15
  sanskrit: string;
  english: string;
  tamil: string;
}

export const TITHI_NAMES = [
  'Prathama (Pratipada)', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashti', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dvadashi', 'Trayodashi', 'Chaturdashi', 'Purnima'
];

export function getTithiName(paksha: 'Shukla' | 'Krishna', numberInPaksha: number): string {
  if (numberInPaksha === 15) {
    return paksha === 'Shukla' ? 'Purnima' : 'Amavasya';
  }
  return TITHI_NAMES[numberInPaksha - 1] || TITHI_NAMES[0];
}

export const YOGA_NAMES: string[] = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarma', 'Dhriti', 'Shoola', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Asiddhi (Siddhi)', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra (Aindra)', 'Vaidhriti'
];

export const KARANA_NAMES: string[] = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti (Bhadra)',
  'Shakuni', 'Chatushpada', 'Naga', 'Kintughna'
];

export const VARA_NAMES = [
  { index: 0, sanskrit: 'भानुवासरः', english: 'Sunday (Ravivara)', planet: 'Surya', tamil: 'ஞாயிறு' },
  { index: 1, sanskrit: 'सोमवासरः', english: 'Monday (Somavara)', planet: 'Chandra', tamil: 'திங்கள்' },
  { index: 2, sanskrit: 'भौमवासरः', english: 'Tuesday (Mangalavara)', planet: 'Mangala', tamil: 'செவ்வாய்' },
  { index: 3, sanskrit: 'सौम्यवासरः', english: 'Wednesday (Budhavara)', planet: 'Budha', tamil: 'புதன்' },
  { index: 4, sanskrit: 'गुरुवासरः', english: 'Thursday (Guruvasara)', planet: 'Guru', tamil: 'வியாழன்' },
  { index: 5, sanskrit: 'भृगुवासरः', english: 'Friday (Shukravara)', planet: 'Shukra', tamil: 'வெள்ளி' },
  { index: 6, sanskrit: 'स्थिरवासरः', english: 'Saturday (Shanivara)', planet: 'Shani', tamil: 'சனி' },
];

export const SAMVATSARA_NAMES: string[] = [
  'Prabhava', 'Vibhava', 'Shukla', 'Pramoda', 'Prajapati',
  'Angirasa', 'Shrimukha', 'Bhava', 'Yuva', 'Dhatri',
  'Ishvara', 'Bahudhanya', 'Pramathi', 'Vikrama', 'Vrisha',
  'Chitrabhanu', 'Subhanu', 'Tarana', 'Parthiva', 'Vyaya',
  'Sarvajit', 'Sarvadhari', 'Virodhi', 'Vikrita', 'Khara',
  'Nandana', 'Vijaya', 'Jaya', 'Manmatha', 'Durmukha',
  'Hemalamba', 'Vilamba', 'Vikari', 'Sharvari', 'Plava',
  'Shubhakrit', 'Shobhakrit', 'Krodhi', 'Vishvavasu', 'Parabhava',
  'Plavanga', 'Kilaka', 'Saumya', 'Sadharana', 'Virodhikrit',
  'Paridhavi', 'Pramadicha', 'Ananda', 'Rakshasa', 'Nala',
  'Pingala', 'Kalayukta', 'Siddharthi', 'Raudra', 'Durmati',
  'Dundubhi', 'Rudhirodgari', 'Raktakshi', 'Krodhana', 'Kshaya'
];

export const LUNAR_MASA_NAMES: string[] = [
  'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha',
  'Shravana', 'Bhadrapada', 'Ashvina', 'Karttika',
  'Margashirsha', 'Pausha', 'Magha', 'Phalguna'
];

export const SOLAR_MASA_NAMES = [
  { index: 0, rashi: 'Mesha', sanskrit: 'मेष (Mesha)', tamil: 'சித்திரை (Chithirai)', malayalam: 'மேடம் (Medam)' },
  { index: 1, rashi: 'Vrishabha', sanskrit: 'वृषभ (Vrishabha)', tamil: 'வைகாசி (Vaikasi)', malayalam: 'இடவம் (Edavam)' },
  { index: 2, rashi: 'Mithuna', sanskrit: 'मिथुन (Mithuna)', tamil: 'ஆனி (Aani)', malayalam: 'மிதுனம் (Mithunam)' },
  { index: 3, rashi: 'Karka', sanskrit: 'कर्क (Karkataka)', tamil: 'ஆடி (Aadi)', malayalam: 'கற்கடகம் (Karkidakam)' },
  { index: 4, rashi: 'Simha', sanskrit: 'सिंह (Simha)', tamil: 'ஆவணி (Aavani)', malayalam: 'சிங்கம் (Chingam)' },
  { index: 5, rashi: 'Kanya', sanskrit: 'कन्या (Kanya)', tamil: 'புரட்டாசி (Purattasi)', malayalam: 'கன்னி (Kanni)' },
  { index: 6, rashi: 'Tula', sanskrit: 'तुला (Tula)', tamil: 'ஐப்பசி (Aippasi)', malayalam: 'துலாம் (Thulam)' },
  { index: 7, rashi: 'Vrishchika', sanskrit: 'वृश्चिक (Vrishchika)', tamil: 'கார்த்திகை (Karthigai)', malayalam: 'விருச்சிகம் (Vrischikam)' },
  { index: 8, rashi: 'Dhanus', sanskrit: 'धनु (Dhanus)', tamil: 'மார்கழி (Margazhi)', malayalam: 'தனு (Dhanu)' },
  { index: 9, rashi: 'Makara', sanskrit: 'मकर (Makara)', tamil: 'தை (Thai)', malayalam: 'மகரம் (Makaram)' },
  { index: 10, rashi: 'Kumbha', sanskrit: 'कुम्भ (Kumbha)', tamil: 'மாசி (Maasi)', malayalam: 'கும்பம் (Kumbham)' },
  { index: 11, rashi: 'Meena', sanskrit: 'मीन (Meena)', tamil: 'பங்குனி (Panguni)', malayalam: 'மீனம் (Meenam)' }
];

export const RITU_NAMES = [
  { index: 0, sanskrit: 'वसन्त (Vasanta)', english: 'Spring' },
  { index: 1, sanskrit: 'ग्रीष्म (Grishma)', english: 'Summer' },
  { index: 2, sanskrit: 'वर्षा (Varsha)', english: 'Monsoon' },
  { index: 3, sanskrit: 'शरद् (Sharad)', english: 'Autumn' },
  { index: 4, sanskrit: 'हेमन्त (Hemanta)', english: 'Pre-Winter' },
  { index: 5, sanskrit: 'शिशिर (Shishira)', english: 'Winter' },
];
