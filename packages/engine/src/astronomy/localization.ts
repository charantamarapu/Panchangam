/**
 * Multi-Language & Transliteration Localization System
 * 
 * Supports:
 * 1. SANSKRIT_DEVANAGARI: Pure Sanskrit in Devanagari script (संस्कृतम् - देवनागरी)
 * 2. SANSKRIT_TRANSLITERATED: Sanskrit in Roman IAST transliteration (Śukla, Dhaniṣṭhā, Guruvāsara)
 * 3. ENGLISH: English names and meanings (Bright 14th Day, Thursday, Monsoon)
 */

export enum LanguageMode {
  SANSKRIT_DEVANAGARI = 'SANSKRIT_DEVANAGARI',
  SANSKRIT_TRANSLITERATED = 'SANSKRIT_TRANSLITERATED',
  ENGLISH = 'ENGLISH'
}

export interface LocalizedTerm {
  devanagari: string;
  transliterated: string;
  english: string;
}

// 1. Tithis (1-15)
export const LOCALIZED_TITHIS: LocalizedTerm[] = [
  { devanagari: 'प्रतिपदा', transliterated: 'Pratipadā', english: '1st Lunar Day (Pratipada)' },
  { devanagari: 'द्वितीया', transliterated: 'Dvitīyā', english: '2nd Lunar Day (Dvitiya)' },
  { devanagari: 'तृतीया', transliterated: 'Tṛtīyā', english: '3rd Lunar Day (Tritiya)' },
  { devanagari: 'चतुर्थी', transliterated: 'Caturthī', english: '4th Lunar Day (Chaturthi)' },
  { devanagari: 'पञ्चमी', transliterated: 'Pañcamī', english: '5th Lunar Day (Panchami)' },
  { devanagari: 'षष्ठी', transliterated: 'Ṣaṣṭhī', english: '6th Lunar Day (Shashti)' },
  { devanagari: 'सप्तमी', transliterated: 'Saptamī', english: '7th Lunar Day (Saptami)' },
  { devanagari: 'अष्टमी', transliterated: 'Aṣṭamī', english: '8th Lunar Day (Ashtami)' },
  { devanagari: 'नवमी', transliterated: 'Navamī', english: '9th Lunar Day (Navami)' },
  { devanagari: 'दशमी', transliterated: 'Daśamī', english: '10th Lunar Day (Dashami)' },
  { devanagari: 'एकादशी', transliterated: 'Ekādaśī', english: '11th Lunar Day (Ekadashi Fasting)' },
  { devanagari: 'द्वादशी', transliterated: 'Dvādaśī', english: '12th Lunar Day (Dvadashi Parana)' },
  { devanagari: 'त्रयोदशी', transliterated: 'Trayodaśī', english: '13th Lunar Day (Trayodashi)' },
  { devanagari: 'चतुर्दशी', transliterated: 'Caturdaśī', english: '14th Lunar Day (Chaturdashi)' },
  { devanagari: 'पूर्णिमा', transliterated: 'Pūrṇimā', english: 'Full Moon (Purnima)' }
];

export const LOCALIZED_PURNIMA: LocalizedTerm = {
  devanagari: 'पूर्णिमा',
  transliterated: 'Pūrṇimā',
  english: 'Full Moon (Purnima)'
};

export const LOCALIZED_AMAVASYA: LocalizedTerm = {
  devanagari: 'अमावस्या',
  transliterated: 'Amāvasyā',
  english: 'New Moon (Amavasya)'
};

export const LOCALIZED_PAKSHAS: Record<'Shukla' | 'Krishna', LocalizedTerm> = {
  Shukla: {
    devanagari: 'शुक्लपक्षः',
    transliterated: 'Śukla Pakṣa',
    english: 'Bright (Waxing) Fortnight'
  },
  Krishna: {
    devanagari: 'कृष्णपक्षः',
    transliterated: 'Kṛṣṇa Pakṣa',
    english: 'Dark (Waning) Fortnight'
  }
};

// 2. Varas (Weekdays 0-6)
export const LOCALIZED_VARAS: LocalizedTerm[] = [
  { devanagari: 'भानुवासरः', transliterated: 'Bhānuvāsara (Ravivāra)', english: 'Sunday (Sun\'s Day)' },
  { devanagari: 'सोमवासरः', transliterated: 'Somavāsara (Somavāra)', english: 'Monday (Moon\'s Day)' },
  { devanagari: 'भौमवासरः', transliterated: 'Bhaumavāsara (Maṅgalavāra)', english: 'Tuesday (Mars\'s Day)' },
  { devanagari: 'सौम्यवासरः', transliterated: 'Saumyavāsara (Budhavāra)', english: 'Wednesday (Mercury\'s Day)' },
  { devanagari: 'गुरुवासरः', transliterated: 'Guruvāsara (Bṛhaspativāra)', english: 'Thursday (Jupiter\'s Day)' },
  { devanagari: 'भृगुवासरः', transliterated: 'Bhṛguvāsara (Śukravāra)', english: 'Friday (Venus\'s Day)' },
  { devanagari: 'स्थिरवासरः', transliterated: 'Sthiravāsara (Śanivāra)', english: 'Saturday (Saturn\'s Day)' }
];

// 3. Nakshatras (0-26)
export const LOCALIZED_NAKSHATRAS: LocalizedTerm[] = [
  { devanagari: 'अश्विनी', transliterated: 'Aśvinī', english: 'Ashvini (Beta Arietis)' },
  { devanagari: 'भरणी', transliterated: 'Bharaṇī', english: 'Bharani (35 Arietis)' },
  { devanagari: 'कृत्तिका', transliterated: 'Kṛttikā', english: 'Krittika (Pleiades)' },
  { devanagari: 'रोहिणी', transliterated: 'Rohiṇī', english: 'Rohini (Aldebaran)' },
  { devanagari: 'मृगशीर्ष', transliterated: 'Mṛgaśīrṣa', english: 'Mrigashirsha (Lambda Orionis)' },
  { devanagari: 'आर्द्रा', transliterated: 'Ārdrā', english: 'Ardra (Betelgeuse)' },
  { devanagari: 'पुनर्वसु', transliterated: 'Punarvasu', english: 'Punarvasu (Castor & Pollux)' },
  { devanagari: 'पुष्य', transliterated: 'Puṣya', english: 'Pushya (Delta Cancri)' },
  { devanagari: 'आश्लेषा', transliterated: 'Āśleṣā', english: 'Ashlesha (Hydrae)' },
  { devanagari: 'मघा', transliterated: 'Maghā', english: 'Magha (Regulus)' },
  { devanagari: 'पूर्वफाल्गुनी', transliterated: 'Pūrva Phālgunī', english: 'Purva Phalguni (Delta Leonis)' },
  { devanagari: 'उत्तरफाल्गुनी', transliterated: 'Uttara Phālgunī', english: 'Uttara Phalguni (Denebola)' },
  { devanagari: 'हस्त', transliterated: 'Hasta', english: 'Hasta (Corvi)' },
  { devanagari: 'चित्रा', transliterated: 'Citrā', english: 'Chitra (Spica)' },
  { devanagari: 'स्वाती', transliterated: 'Svātī', english: 'Svati (Arcturus)' },
  { devanagari: 'विशाखा', transliterated: 'Viśākhā', english: 'Vishakha (Alpha Librae)' },
  { devanagari: 'अनुराधा', transliterated: 'Anurādhā', english: 'Anuradha (Delta Scorpionis)' },
  { devanagari: 'ज्येष्ठा', transliterated: 'Jyeṣṭhā', english: 'Jyeshtha (Antares)' },
  { devanagari: 'मूल', transliterated: 'Mūla', english: 'Mula (Shaula / Gal. Center)' },
  { devanagari: 'पूर्वाषाढा', transliterated: 'Pūrvāṣāḍhā', english: 'Purva Ashadha (Kaus Australis)' },
  { devanagari: 'उत्तराषाढा', transliterated: 'Uttarāṣāḍhā', english: 'Uttara Ashadha (Nunki)' },
  { devanagari: 'श्रवण', transliterated: 'Śravaṇa', english: 'Shravana (Altair)' },
  { devanagari: 'धनिष्ठा', transliterated: 'Dhaniṣṭhā', english: 'Dhanishta (Delphini)' },
  { devanagari: 'शतभिषक्', transliterated: 'Śatabhiṣaj', english: 'Shatabhisha (Lambda Aquarii)' },
  { devanagari: 'पूर्वभाद्रपदा', transliterated: 'Pūrva Bhādrapadā', english: 'Purva Bhadrapada (Markab)' },
  { devanagari: 'उत्तरभाद्रपदा', transliterated: 'Uttara Bhādrapadā', english: 'Uttara Bhadrapada (Algenib)' },
  { devanagari: 'रेवती', transliterated: 'Revatī', english: 'Revati (Zeta Piscium)' }
];

// 4. Yogas (0-26)
export const LOCALIZED_YOGAS: LocalizedTerm[] = [
  { devanagari: 'विष्कम्भ', transliterated: 'Viṣkambha', english: 'Vishkambha (Obstacle)' },
  { devanagari: 'प्रीति', transliterated: 'Prīti', english: 'Priti (Affection & Joy)' },
  { devanagari: 'आयुष्मान्', transliterated: 'Āyuṣmān', english: 'Ayushman (Longevity)' },
  { devanagari: 'सौभाग्य', transliterated: 'Saubhāgya', english: 'Saubhagya (Good Fortune)' },
  { devanagari: 'शोभन', transliterated: 'Śobhana', english: 'Shobhana (Splendor & Grace)' },
  { devanagari: 'अतिगण्ड', transliterated: 'Atigaṇḍa', english: 'Atiganda (Great Danger)' },
  { devanagari: 'सुकर्मा', transliterated: 'Sukarmā', english: 'Sukarma (Virtuous Deeds)' },
  { devanagari: 'धृति', transliterated: 'Dhṛti', english: 'Dhriti (Patience & Steadfastness)' },
  { devanagari: 'शूल', transliterated: 'Śūla', english: 'Shoola (Spear / Pain)' },
  { devanagari: 'गण्ड', transliterated: 'Gaṇḍa', english: 'Ganda (Knot / Obstacle)' },
  { devanagari: 'वृद्धि', transliterated: 'Vṛddhi', english: 'Vriddhi (Growth & Prosperity)' },
  { devanagari: 'ध्रुव', transliterated: 'Dhruva', english: 'Dhruva (Constant / Pole Star)' },
  { devanagari: 'व्याघात', transliterated: 'Vyāghāta', english: 'Vyaghata (Striking)' },
  { devanagari: 'हर्षण', transliterated: 'Harṣaṇa', english: 'Harshana (Delight & Joy)' },
  { devanagari: 'वज्र', transliterated: 'Vajra', english: 'Vajra (Thunderbolt)' },
  { devanagari: 'सिद्धि', transliterated: 'Siddhi', english: 'Siddhi (Accomplishment)' },
  { devanagari: 'व्यतीपात', transliterated: 'Vyatīpāta', english: 'Vyatipata (Calamity)' },
  { devanagari: 'वरीयान्', transliterated: 'Varīyān', english: 'Variyan (Exalted / Superior)' },
  { devanagari: 'परिघ', transliterated: 'Parigha', english: 'Parigha (Iron Bar / Defense)' },
  { devanagari: 'शिव', transliterated: 'Śiva', english: 'Shiva (Auspiciousness)' },
  { devanagari: 'सिद्ध', transliterated: 'Siddha', english: 'Siddha (Perfected)' },
  { devanagari: 'साध्य', transliterated: 'Sādhya', english: 'Sadhya (Achievable)' },
  { devanagari: 'शुभ', transliterated: 'Śubha', english: 'Shubha (Auspicious)' },
  { devanagari: 'शुक्ल', transliterated: 'Śukla', english: 'Shukla (Pure & Bright)' },
  { devanagari: 'ब्रह्म', transliterated: 'Brahma', english: 'Brahma (Divine Knowledge)' },
  { devanagari: 'इन्द्र', transliterated: 'Indra', english: 'Indra (Leader / Sovereign)' },
  { devanagari: 'वैधृति', transliterated: 'Vaidhṛti', english: 'Vaidhriti (Divisive)' }
];

// 5. Karanas (0-10)
export const LOCALIZED_KARANAS: LocalizedTerm[] = [
  { devanagari: 'बव', transliterated: 'Bava', english: 'Bava (Lion)' },
  { devanagari: 'बालव', transliterated: 'Bālava', english: 'Balava (Leopard)' },
  { devanagari: 'कौलव', transliterated: 'Kaulava', english: 'Kaulava (Wild Boar)' },
  { devanagari: 'तैतिल', transliterated: 'Taitila', english: 'Taitila (Donkey / Rhino)' },
  { devanagari: 'गर', transliterated: 'Gara', english: 'Gara (Elephant)' },
  { devanagari: 'वणिज', transliterated: 'Vaṇija', english: 'Vanija (Merchant)' },
  { devanagari: 'विष्टि (भद्रा)', transliterated: 'Viṣṭi (Bhadrā)', english: 'Vishti (Bhadra - Heavy Period)' },
  { devanagari: 'शकुनि', transliterated: 'Śakuni', english: 'Shakuni (Crow / Vulture)' },
  { devanagari: 'चतुष्पाद्', transliterated: 'Catuṣpād', english: 'Chatushpada (Four-legged)' },
  { devanagari: 'नाग', transliterated: 'Nāga', english: 'Naga (Serpent)' },
  { devanagari: 'किंस्तुघ्न', transliterated: 'Kiṁstughna', english: 'Kinstughna (Worm / Caterpillar)' }
];

// 6. Rashis (0-11)
export const LOCALIZED_RASHIS: LocalizedTerm[] = [
  { devanagari: 'मेष', transliterated: 'Meṣa', english: 'Aries (Ram)' },
  { devanagari: 'वृषभ', transliterated: 'Vṛṣabha', english: 'Taurus (Bull)' },
  { devanagari: 'मिथुन', transliterated: 'Mithuna', english: 'Gemini (Twins)' },
  { devanagari: 'कर्क', transliterated: 'Karka', english: 'Cancer (Crab)' },
  { devanagari: 'सिंह', transliterated: 'Siṁha', english: 'Leo (Lion)' },
  { devanagari: 'कन्या', transliterated: 'Kanyā', english: 'Virgo (Maiden)' },
  { devanagari: 'तुला', transliterated: 'Tulā', english: 'Libra (Scales)' },
  { devanagari: 'वृश्चिक', transliterated: 'Vṛścika', english: 'Scorpio (Scorpion)' },
  { devanagari: 'धनु', transliterated: 'Dhanu', english: 'Sagittarius (Archer)' },
  { devanagari: 'मकर', transliterated: 'Makara', english: 'Capricorn (Sea-Monster)' },
  { devanagari: 'कुम्भ', transliterated: 'Kumbha', english: 'Aquarius (Water-Pitcher)' },
  { devanagari: 'मीन', transliterated: 'Mīna', english: 'Pisces (Fishes)' }
];

// 7. Ritus (0-5)
export const LOCALIZED_RITUS: LocalizedTerm[] = [
  { devanagari: 'वसन्त', transliterated: 'Vasanta', english: 'Spring' },
  { devanagari: 'ग्रीष्म', transliterated: 'Grīṣma', english: 'Summer' },
  { devanagari: 'वर्षा', transliterated: 'Varṣā', english: 'Monsoon' },
  { devanagari: 'शरद्', transliterated: 'Śarad', english: 'Autumn' },
  { devanagari: 'हेमन्त', transliterated: 'Hemanta', english: 'Pre-Winter' },
  { devanagari: 'शिशिर', transliterated: 'Śiśira', english: 'Winter' }
];

// 8. Ayanas
export const LOCALIZED_AYANAS: Record<'Uttarayana' | 'Dakshinayana', LocalizedTerm> = {
  Uttarayana: {
    devanagari: 'उत्तरायणम्',
    transliterated: 'Uttarāyaṇam',
    english: 'Northern Solar Course'
  },
  Dakshinayana: {
    devanagari: 'दक्षिणायनम्',
    transliterated: 'Dakṣiṇāyanam',
    english: 'Southern Solar Course'
  }
};

// 9. Lunar Masas (0-11)
export const LOCALIZED_LUNAR_MASAS: LocalizedTerm[] = [
  { devanagari: 'चैत्र', transliterated: 'Caitra', english: 'Chaitra' },
  { devanagari: 'वैशाख', transliterated: 'Vaiśākha', english: 'Vaishakha' },
  { devanagari: 'ज्येष्ठ', transliterated: 'Jyeṣṭha', english: 'Jyeshtha' },
  { devanagari: 'आषाढ', transliterated: 'Āṣāḍha', english: 'Ashadha' },
  { devanagari: 'श्रावण', transliterated: 'Śrāvaṇa', english: 'Shravana' },
  { devanagari: 'भाद्रपद', transliterated: 'Bhādrapada', english: 'Bhadrapada' },
  { devanagari: 'आश्विन', transliterated: 'Āśvina', english: 'Ashvina' },
  { devanagari: 'कार्तिक', transliterated: 'Kārtika', english: 'Karttika' },
  { devanagari: 'मार्गशीर्ष', transliterated: 'Mārgaśīrṣa', english: 'Margashirsha' },
  { devanagari: 'पौष', transliterated: 'Pauṣa', english: 'Pausha' },
  { devanagari: 'माघ', transliterated: 'Māgha', english: 'Magha' },
  { devanagari: 'फाल्गुन', transliterated: 'Phālguna', english: 'Phalguna' }
];

// 10. Day Divisions (Pancha Kala)
export const LOCALIZED_DAY_DIVISIONS: Record<string, LocalizedTerm> = {
  pratah: { devanagari: 'प्रातःकालः (सन्ध्या वन्दनम्)', transliterated: 'Prātaḥkāla (Morning Devotions)', english: 'Dawn / Morning (Sandhya Prayers)' },
  sangava: { devanagari: 'सङ्गवकालः (स्वाध्यायः)', transliterated: 'Saṅgavakāla (Forenoon)', english: 'Forenoon (Vedic Study)' },
  madhyahna: { devanagari: 'मध्याह्नकालः (देवपूजा)', transliterated: 'Madhyāhnakāla (Midday Pooja)', english: 'Midday (Deva Pooja & Sandhya)' },
  aparahna: { devanagari: 'अपराह्नकालः (पितृकार्यम्)', transliterated: 'Aparāhnakāla (Pitṛkāryam / Śrāddha)', english: 'Afternoon (Ancestor Shraddha Window)' },
  sayahna: { devanagari: 'सायाह्नकालः (सन्ध्याप्रदोषः)', transliterated: 'Sāyāhnakāla (Sunset Sandhya)', english: 'Evening Twilight (Sandhya & Pradosha)' }
};

// 11. Navagraha Planets
export const LOCALIZED_PLANETS: Record<string, LocalizedTerm> = {
  Sun: { devanagari: 'सूर्यः (रविः)', transliterated: 'Sūrya (Ravi)', english: 'Sun' },
  Moon: { devanagari: 'चन्द्रः (सोमः)', transliterated: 'Candra (Soma)', english: 'Moon' },
  Mars: { devanagari: 'मङ्गलः (भौमः)', transliterated: 'Maṅgala (Kuja)', english: 'Mars' },
  Mercury: { devanagari: 'बुधः', transliterated: 'Budha', english: 'Mercury' },
  Jupiter: { devanagari: 'बृहस्पतिः (गुरुः)', transliterated: 'Bṛhaspati (Guru)', english: 'Jupiter' },
  Venus: { devanagari: 'शुक्रः', transliterated: 'Śukra', english: 'Venus' },
  Saturn: { devanagari: 'शनिः (मन्दः)', transliterated: 'Śani (Manda)', english: 'Saturn' }
};

// 12. 60 Samvatsaras (Shastric cycle of 60 Jovian years)
export const LOCALIZED_SAMVATSARAS: LocalizedTerm[] = [
  { devanagari: 'प्रभव', transliterated: 'Prabhava', english: 'Prabhava (#1)' },
  { devanagari: 'विभव', transliterated: 'Vibhava', english: 'Vibhava (#2)' },
  { devanagari: 'शुक्ल', transliterated: 'Śukla', english: 'Shukla (#3)' },
  { devanagari: 'प्रमोद', transliterated: 'Pramoda', english: 'Pramoda (#4)' },
  { devanagari: 'प्रजापति', transliterated: 'Prajāpati', english: 'Prajapati (#5)' },
  { devanagari: 'अङ्गिरा', transliterated: 'Aṅgirasa', english: 'Angirasa (#6)' },
  { devanagari: 'श्रीमुख', transliterated: 'Śrīmukha', english: 'Shrimukha (#7)' },
  { devanagari: 'भाव', transliterated: 'Bhāva', english: 'Bhava (#8)' },
  { devanagari: 'युवा', transliterated: 'Yuvā', english: 'Yuva (#9)' },
  { devanagari: 'धाता', transliterated: 'Dhātā', english: 'Dhatri (#10)' },
  { devanagari: 'ईश्वर', transliterated: 'Īśvara', english: 'Ishvara (#11)' },
  { devanagari: 'बहुधान्य', transliterated: 'Bahudhānya', english: 'Bahudhanya (#12)' },
  { devanagari: 'प्रमाथी', transliterated: 'Pramāthī', english: 'Pramathi (#13)' },
  { devanagari: 'विक्रम', transliterated: 'Vikrama', english: 'Vikrama (#14)' },
  { devanagari: 'वृष', transliterated: 'Vṛṣa', english: 'Vrisha (#15)' },
  { devanagari: 'चित्रभानु', transliterated: 'Citrabhānu', english: 'Chitrabhanu (#16)' },
  { devanagari: 'सुभानु', transliterated: 'Subhānu', english: 'Subhanu (#17)' },
  { devanagari: 'तारण', transliterated: 'Tāraṇa', english: 'Tarana (#18)' },
  { devanagari: 'पार्थिव', transliterated: 'Pārthiva', english: 'Parthiva (#19)' },
  { devanagari: 'व्यय', transliterated: 'Vyaya', english: 'Vyaya (#20)' },
  { devanagari: 'सर्वजित्', transliterated: 'Sarvajit', english: 'Sarvajit (#21)' },
  { devanagari: 'सर्वधारी', transliterated: 'Sarvadhārī', english: 'Sarvadhari (#22)' },
  { devanagari: 'विरोधी', transliterated: 'Virodhī', english: 'Virodhi (#23)' },
  { devanagari: 'विकृत', transliterated: 'Vikṛta', english: 'Vikrita (#24)' },
  { devanagari: 'खर', transliterated: 'Khara', english: 'Khara (#25)' },
  { devanagari: 'नन्दन', transliterated: 'Nandana', english: 'Nandana (#26)' },
  { devanagari: 'विजय', transliterated: 'Vijaya', english: 'Vijaya (#27)' },
  { devanagari: 'जय', transliterated: 'Jaya', english: 'Jaya (#28)' },
  { devanagari: 'मन्मथ', transliterated: 'Manmatha', english: 'Manmatha (#29)' },
  { devanagari: 'दुर्मुख', transliterated: 'Durmukha', english: 'Durmukha (#30)' },
  { devanagari: 'हेमलम्ब', transliterated: 'Hemalamba', english: 'Hemalamba (#31)' },
  { devanagari: 'विलम्ब', transliterated: 'Vilamba', english: 'Vilamba (#32)' },
  { devanagari: 'विकारी', transliterated: 'Vikārī', english: 'Vikari (#33)' },
  { devanagari: 'शर्वरी', transliterated: 'Śarvarī', english: 'Sharvari (#34)' },
  { devanagari: 'प्लव', transliterated: 'Plava', english: 'Plava (#35)' },
  { devanagari: 'शुभकृत्', transliterated: 'Śubhakṛt', english: 'Shubhakrit (#36)' },
  { devanagari: 'शोभकृत्', transliterated: 'Śobhakṛt', english: 'Shobhakrit (#37)' },
  { devanagari: 'क्रोधी', transliterated: 'Krodhī', english: 'Krodhi (#38)' },
  { devanagari: 'विश्वावसु', transliterated: 'Viśvāvasu', english: 'Vishvavasu (#39)' },
  { devanagari: 'पराभव', transliterated: 'Parābhava', english: 'Parabhava (#40)' },
  { devanagari: 'प्लवङ्ग', transliterated: 'Plavaṅga', english: 'Plavanga (#41)' },
  { devanagari: 'कीलक', transliterated: 'Kīlaka', english: 'Kilaka (#42)' },
  { devanagari: 'सौम्य', transliterated: 'Saumya', english: 'Saumya (#43)' },
  { devanagari: 'साधारण', transliterated: 'Sādhāraṇa', english: 'Sadharana (#44)' },
  { devanagari: 'विरोधकृत्', transliterated: 'Virodhakṛt', english: 'Virodhakrit (#45)' },
  { devanagari: 'परिधावी', transliterated: 'Paridhāvī', english: 'Paridhavi (#46)' },
  { devanagari: 'प्रमादी', transliterated: 'Pramādī', english: 'Pramadicha (#47)' },
  { devanagari: 'आनन्द', transliterated: 'Ānanda', english: 'Ananda (#48)' },
  { devanagari: 'राक्षस', transliterated: 'Rākṣasa', english: 'Rakshasa (#49)' },
  { devanagari: 'नल', transliterated: 'Nala', english: 'Nala (#50)' },
  { devanagari: 'पिङ्गल', transliterated: 'Piṅgala', english: 'Pingala (#51)' },
  { devanagari: 'कालयुक्त', transliterated: 'Kālayukta', english: 'Kalayukta (#52)' },
  { devanagari: 'सिद्धार्थी', transliterated: 'Siddhārthī', english: 'Siddharthi (#53)' },
  { devanagari: 'रौद्र', transliterated: 'Raudra', english: 'Raudra (#54)' },
  { devanagari: 'दुर्मती', transliterated: 'Durmatī', english: 'Durmati (#55)' },
  { devanagari: 'दुन्दुभी', transliterated: 'Dundubhī', english: 'Dundubhi (#56)' },
  { devanagari: 'रुधिरोद्गारी', transliterated: 'Rudhirodgārī', english: 'Rudhirodgari (#57)' },
  { devanagari: 'रक्ताक्ष', transliterated: 'Raktākṣa', english: 'Raktakshi (#58)' },
  { devanagari: 'क्रोधन', transliterated: 'Krodhana', english: 'Krodhana (#59)' },
  { devanagari: 'क्षय', transliterated: 'Kṣaya', english: 'Kshaya (#60)' }
];

/**
 * Universal helper to extract term according to LanguageMode
 */
export function getLocalizedText(term: LocalizedTerm, mode: LanguageMode): string {
  if (mode === LanguageMode.SANSKRIT_DEVANAGARI) {
    return term.devanagari;
  }
  if (mode === LanguageMode.SANSKRIT_TRANSLITERATED) {
    return term.transliterated;
  }
  return term.english;
}

/**
 * Localizes Samvatsara (60-year Jovian cycle)
 */
export function formatSamvatsara(index: number, mode: LanguageMode): string {
  const sTerm = LOCALIZED_SAMVATSARAS[index % 60] || LOCALIZED_SAMVATSARAS[0];
  return getLocalizedText(sTerm, mode);
}

/**
 * Localizes Tithi with strictly correct Shastric distinction between Purnima and Amavasya.
 */
export function getLocalizedTithi(paksha: 'Shukla' | 'Krishna', numberInPaksha: number, mode: LanguageMode): string {
  const pTerm = LOCALIZED_PAKSHAS[paksha];

  if (numberInPaksha === 15) {
    const isPurnima = paksha === 'Shukla';
    const term = isPurnima ? LOCALIZED_PURNIMA : LOCALIZED_AMAVASYA;

    if (mode === LanguageMode.SANSKRIT_DEVANAGARI) {
      return `${pTerm.devanagari} ${term.devanagari}`;
    }
    if (mode === LanguageMode.SANSKRIT_TRANSLITERATED) {
      return `${pTerm.transliterated} ${term.transliterated}`;
    }
    return isPurnima ? 'Full Moon (Purnima)' : 'New Moon (Amavasya)';
  }

  const tTerm = LOCALIZED_TITHIS[numberInPaksha - 1] || LOCALIZED_TITHIS[0];
  if (mode === LanguageMode.SANSKRIT_DEVANAGARI) {
    return `${pTerm.devanagari} ${tTerm.devanagari}`;
  }
  if (mode === LanguageMode.SANSKRIT_TRANSLITERATED) {
    return `${pTerm.transliterated} ${tTerm.transliterated}`;
  }
  return `${pTerm.english} • ${tTerm.english}`;
}


