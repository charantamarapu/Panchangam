/**
 * Multi-Mutt Sampradaya & Nirnaya Rule Engine
 * 
 * Accurately models:
 * 1. Advaita (Smartha) - Sringeri, Kanchi, Dwarka, Puri, Badri, Kudali
 * 2. Vishishtadvaita (Sri Vaishnava) - Vadakalai (Ahobila, Andavan, Poundarikapuram, Parakala) & Thengalai (Vanamamalai, etc.)
 * 3. Dvaita (Madhwa) - Pradhana Peethas (Uttaradi, Rayar, Vyasaraja, Sripadaraja) & Udupi Ashta Mathas
 * 4. STANDARD - Universal Drigganita displaying both Smartha and Vaishnava determinations
 */

import { PanchangamOutput } from '../astronomy/ephemeris.js';

export enum SampradayaType {
  STANDARD = 'STANDARD', // Universal Drigganita (Default - No Mutt)

  // Advaita (Smartha) Peethams
  ADVAITA_SRINGERI = 'ADVAITA_SRINGERI',
  ADVAITA_KANCHI = 'ADVAITA_KANCHI',
  ADVAITA_DWARKA = 'ADVAITA_DWARKA',
  ADVAITA_PURI = 'ADVAITA_PURI',
  ADVAITA_BADRI = 'ADVAITA_BADRI',
  ADVAITA_KUDALI = 'ADVAITA_KUDALI',

  // Vishishtadvaita - Vadakalai
  VAISHNAVA_VADAKALAI_AHOBILA = 'VAISHNAVA_VADAKALAI_AHOBILA',
  VAISHNAVA_VADAKALAI_ANDAVAN = 'VAISHNAVA_VADAKALAI_ANDAVAN',
  VAISHNAVA_VADAKALAI_POUNDARIKAPURAM = 'VAISHNAVA_VADAKALAI_POUNDARIKAPURAM',
  VAISHNAVA_VADAKALAI_PARAKALA = 'VAISHNAVA_VADAKALAI_PARAKALA',

  // Vishishtadvaita - Thengalai
  VAISHNAVA_THENGALAI_VANAMAMALAI = 'VAISHNAVA_THENGALAI_VANAMAMALAI',
  VAISHNAVA_THENGALAI_SRIPERUMBUDUR = 'VAISHNAVA_THENGALAI_SRIPERUMBUDUR',
  VAISHNAVA_THENGALAI_TIRUMALA = 'VAISHNAVA_THENGALAI_TIRUMALA',
  VAISHNAVA_THENGALAI_ALWAR_THIRUNAGARI = 'VAISHNAVA_THENGALAI_ALWAR_THIRUNAGARI',

  // Dvaita (Madhwa) - Pradhana Mathas
  DVAITA_UTTARADI = 'DVAITA_UTTARADI',
  DVAITA_RAYAR_MANTRALAYAM = 'DVAITA_RAYAR_MANTRALAYAM',
  DVAITA_VYASARAJA = 'DVAITA_VYASARAJA',
  DVAITA_SRIPADARAJA = 'DVAITA_SRIPADARAJA',
  DVAITA_KUDLI_ARYA_AKSHOBHYA = 'DVAITA_KUDLI_ARYA_AKSHOBHYA',

  // Dvaita (Madhwa) - Udupi Ashta Mathas
  DVAITA_UDUPI_PALIMARU = 'DVAITA_UDUPI_PALIMARU',
  DVAITA_UDUPI_ADAMARU = 'DVAITA_UDUPI_ADAMARU',
  DVAITA_UDUPI_KRISHNAPURA = 'DVAITA_UDUPI_KRISHNAPURA',
  DVAITA_UDUPI_PUTHIGE = 'DVAITA_UDUPI_PUTHIGE',
  DVAITA_UDUPI_SHIROOR = 'DVAITA_UDUPI_SHIROOR',
  DVAITA_UDUPI_SODHE = 'DVAITA_UDUPI_SODHE',
  DVAITA_UDUPI_KANIYOOR = 'DVAITA_UDUPI_KANIYOOR',
  DVAITA_UDUPI_PEJAWARA = 'DVAITA_UDUPI_PEJAWARA',

  // Legacy backwards compatibility aliases
  ADVAITA_SMARTHA = 'ADVAITA_SRINGERI',
  VISHISHTADVAITA_VADAKALAI_AHOBILA = 'VAISHNAVA_VADAKALAI_AHOBILA',
  VISHISHTADVAITA_VADAKALAI_ANDAVAN = 'VAISHNAVA_VADAKALAI_ANDAVAN',
  VISHISHTADVAITA_THENGALAI = 'VAISHNAVA_THENGALAI_VANAMAMALAI'
}

export interface MuttProfile {
  id: SampradayaType;
  name: string;
  category: 'Standard' | 'Advaita' | 'Vishishtadvaita_Vadakalai' | 'Vishishtadvaita_Thengalai' | 'Dvaita_Pradhana' | 'Dvaita_Udupi';
  peetham: string;
  headquarters: string;
  primaryAuthority: string;
  calendarSystem: 'Amanta' | 'Purnimanta' | 'Saura';
  description: string;
}

export const MUTT_REGISTRY: Record<string, MuttProfile> = {
  [SampradayaType.STANDARD]: {
    id: SampradayaType.STANDARD,
    name: 'Standard Drigganita (Universal)',
    category: 'Standard',
    peetham: 'Universal Vedic Ephemeris',
    headquarters: 'All Locations',
    primaryAuthority: 'Surya Siddhanta & Drigganita Shastras',
    calendarSystem: 'Amanta',
    description: 'Displays standard Drigganita calculations showing both Smartha and Vaishnava Ekadashis side-by-side without mutt bias.'
  },

  // Advaita (Smartha)
  [SampradayaType.ADVAITA_SRINGERI]: {
    id: SampradayaType.ADVAITA_SRINGERI,
    name: 'Sri Sringeri Sharada Peetham',
    category: 'Advaita',
    peetham: 'Dakshinamnaya Sri Sharada Peetham',
    headquarters: 'Sringeri, Karnataka',
    primaryAuthority: 'Nirnaya Sindhu & Dharma Sindhu',
    calendarSystem: 'Amanta',
    description: 'Established by Sri Adi Shankaracharya. Follows Smartha Arunodaya Vedha criteria for Shuddha Ekadashi, Pradosha Vyapti, and Shankara Jayanti.'
  },
  [SampradayaType.ADVAITA_KANCHI]: {
    id: SampradayaType.ADVAITA_KANCHI,
    name: 'Sri Kanchi Kamakoti Peetham',
    category: 'Advaita',
    peetham: 'Sri Kanchi Kamakoti Moolamnaya Sarvajna Peetham',
    headquarters: 'Kanchipuram, Tamil Nadu',
    primaryAuthority: 'Nirnaya Sindhu & Kanchi Paramacharya Traditions',
    calendarSystem: 'Amanta',
    description: 'Follows traditional Smartha rules with Chandramana tithis and specific Kamakoti Peethadhipati Jayanti/Aradhana dates.'
  },
  [SampradayaType.ADVAITA_DWARKA]: {
    id: SampradayaType.ADVAITA_DWARKA,
    name: 'Sri Dwarka Sharada Peetham',
    category: 'Advaita',
    peetham: 'Paschimamnaya Sharada Peetham',
    headquarters: 'Dwarka, Gujarat',
    primaryAuthority: 'Nirnaya Sindhu & Sama Veda Tradition',
    calendarSystem: 'Amanta',
    description: 'Western cardinal Peetham established by Adi Shankaracharya.'
  },
  [SampradayaType.ADVAITA_PURI]: {
    id: SampradayaType.ADVAITA_PURI,
    name: 'Sri Puri Govardhana Peetham',
    category: 'Advaita',
    peetham: 'Purvamnaya Govardhana Peetham',
    headquarters: 'Puri, Odisha',
    primaryAuthority: 'Rig Veda Tradition & Dharma Sindhu',
    calendarSystem: 'Purnimanta',
    description: 'Eastern cardinal Peetham associated with Lord Jagannatha temple.'
  },
  [SampradayaType.ADVAITA_BADRI]: {
    id: SampradayaType.ADVAITA_BADRI,
    name: 'Sri Jyotirmath (Badrikashram)',
    category: 'Advaita',
    peetham: 'Uttaramnaya Jyotirmath',
    headquarters: 'Joshimath / Badrinath, Uttarakhand',
    primaryAuthority: 'Atharva Veda Tradition & Nirnaya Sindhu',
    calendarSystem: 'Purnimanta',
    description: 'Northern cardinal Peetham in the Himalayas.'
  },
  [SampradayaType.ADVAITA_KUDALI]: {
    id: SampradayaType.ADVAITA_KUDALI,
    name: 'Sri Kudali Sringeri Sharada Matha',
    category: 'Advaita',
    peetham: 'Kudali Sharada Peetham',
    headquarters: 'Kudali, Shimoga, Karnataka',
    primaryAuthority: 'Smartha Agama & Nirnaya Sindhu',
    calendarSystem: 'Amanta',
    description: 'Ancient confluence seat of Tunga and Bhadra rivers.'
  },

  // Vishishtadvaita - Vadakalai
  [SampradayaType.VAISHNAVA_VADAKALAI_AHOBILA]: {
    id: SampradayaType.VAISHNAVA_VADAKALAI_AHOBILA,
    name: 'Sri Ahobila Mutt (Vadakalai)',
    category: 'Vishishtadvaita_Vadakalai',
    peetham: 'Sri Ahobila Matha (46th Srimad Azhagiyasingar)',
    headquarters: 'Ahobilam, Andhra Pradesh',
    primaryAuthority: 'Pancharatra Agama & Srivaishnava Sadachara Nirnaya',
    calendarSystem: 'Saura',
    description: 'Strict Vaishnava Ekadashi (Arunodaya Vedha avoidance, Dvadashi fast, Harivasara adherence), Narasimha Jayanti, and Saura month primacy.'
  },
  [SampradayaType.VAISHNAVA_VADAKALAI_ANDAVAN]: {
    id: SampradayaType.VAISHNAVA_VADAKALAI_ANDAVAN,
    name: 'Srirangam Srimad Andavan Ashramam',
    category: 'Vishishtadvaita_Vadakalai',
    peetham: 'Periyashramam (Munithraya Sampradaya)',
    headquarters: 'Srirangam, Tamil Nadu',
    primaryAuthority: 'Munithraya Sampradaya & Sri Desika Darsanam',
    calendarSystem: 'Saura',
    description: 'Follows Munithraya Vadakalai tradition with Paduka Sivasannidhi determinations and strict Harivasara.'
  },
  [SampradayaType.VAISHNAVA_VADAKALAI_POUNDARIKAPURAM]: {
    id: SampradayaType.VAISHNAVA_VADAKALAI_POUNDARIKAPURAM,
    name: 'Sri Poundarikapuram Andavan Ashramam',
    category: 'Vishishtadvaita_Vadakalai',
    peetham: 'Poundarikapuram Swami Peetham',
    headquarters: 'Srirangam, Tamil Nadu',
    primaryAuthority: 'Munithraya Ahnika Grantha',
    calendarSystem: 'Saura',
    description: 'Rigorous Visishtadvaita orthodox observance of Ekadashi, Parana, and Tharpanam.'
  },
  [SampradayaType.VAISHNAVA_VADAKALAI_PARAKALA]: {
    id: SampradayaType.VAISHNAVA_VADAKALAI_PARAKALA,
    name: 'Sri Parakala Matha (Mysore)',
    category: 'Vishishtadvaita_Vadakalai',
    peetham: 'Sri Brahmatantra Swatantra Parakala Swami Matha',
    headquarters: 'Mysore, Karnataka',
    primaryAuthority: 'Sri Lakshmi Hayagriva Divya Sannidhi',
    calendarSystem: 'Saura',
    description: 'Ancient royal guru peetham of the Mysore Royal family.'
  },

  // Vishishtadvaita - Thengalai
  [SampradayaType.VAISHNAVA_THENGALAI_VANAMAMALAI]: {
    id: SampradayaType.VAISHNAVA_THENGALAI_VANAMAMALAI,
    name: 'Sri Vanamamalai Mutt (Thengalai)',
    category: 'Vishishtadvaita_Thengalai',
    peetham: 'Totadri Matha (Srimat Paramahamsa Jeeyar)',
    headquarters: 'Nanguneri, Tamil Nadu',
    primaryAuthority: 'Thengalai Acharya Parampara & Divya Prabandha',
    calendarSystem: 'Saura',
    description: 'Prime Thengalai seat adhering to Udaya Tithi rules with Vaishnava Ekadashi and Manavala Mamunigal tradition.'
  },
  [SampradayaType.VAISHNAVA_THENGALAI_SRIPERUMBUDUR]: {
    id: SampradayaType.VAISHNAVA_THENGALAI_SRIPERUMBUDUR,
    name: 'Sriperumbudur Emperumanar Jeeyar Matha',
    category: 'Vishishtadvaita_Thengalai',
    peetham: 'Sri Ramanuja Avathara Sthala Peetham',
    headquarters: 'Sriperumbudur, Tamil Nadu',
    primaryAuthority: 'Sri Ramanuja Darsanam',
    calendarSystem: 'Saura',
    description: 'Centered on Sri Ramanuja Avatara Sthalam and Chithirai Thiruvadhirai.'
  },
  [SampradayaType.VAISHNAVA_THENGALAI_TIRUMALA]: {
    id: SampradayaType.VAISHNAVA_THENGALAI_TIRUMALA,
    name: 'Tirumala Sri Pedda Jeeyar Matha',
    category: 'Vishishtadvaita_Thengalai',
    peetham: 'Tirumala Tirupati Sannidhi Peetham',
    headquarters: 'Tirumala, Andhra Pradesh',
    primaryAuthority: 'Vaikhanasa & Thengalai Agama',
    calendarSystem: 'Saura',
    description: 'Chief religious authority of the holy Tirumala Venkateshwara Temple.'
  },
  [SampradayaType.VAISHNAVA_THENGALAI_ALWAR_THIRUNAGARI]: {
    id: SampradayaType.VAISHNAVA_THENGALAI_ALWAR_THIRUNAGARI,
    name: 'Alwar Thirunagari Emperumanar Jeeyar Matha',
    category: 'Vishishtadvaita_Thengalai',
    peetham: 'Nammalwar Avathara Sthala Peetham',
    headquarters: 'Alwar Thirunagari, Tamil Nadu',
    primaryAuthority: 'Nalayira Divya Prabandham',
    calendarSystem: 'Saura',
    description: 'Special observances for Nammalwar and Vaikasi Visakam.'
  },

  // Dvaita (Madhwa) - Pradhana Mathas
  [SampradayaType.DVAITA_UTTARADI]: {
    id: SampradayaType.DVAITA_UTTARADI,
    name: 'Sri Uttaradi Matha (Dvaita)',
    category: 'Dvaita_Pradhana',
    peetham: 'Sri Uttaradi Matha (Sri Satyatma Theertha)',
    headquarters: 'Bangalore / Hospet, Karnataka',
    primaryAuthority: 'Krishnamruta Maharnava by Acharya Madhva',
    calendarSystem: 'Amanta',
    description: 'Follows rigorous Vaishnava rules: any Dashami in Arunodaya necessitates fasting on Dvadashi (Sampurna Dvadashi upavasa); mandatory Harivasara lockout.'
  },
  [SampradayaType.DVAITA_RAYAR_MANTRALAYAM]: {
    id: SampradayaType.DVAITA_RAYAR_MANTRALAYAM,
    name: 'Mantralayam Sri Raghavendra Swamy Matha',
    category: 'Dvaita_Pradhana',
    peetham: 'Sri Raghavendra Swamy Matha (Sri Subudhendra Theertha)',
    headquarters: 'Mantralayam, Andhra Pradesh',
    primaryAuthority: 'Krishnamruta Maharnava & Sri Rayara Nirnaya',
    calendarSystem: 'Amanta',
    description: 'Identical Vaishnava Ekadashi rules with special focus on Sri Raghavendra Theertha Aradhana (Shravana Krishna Dvitiya).'
  },
  [SampradayaType.DVAITA_VYASARAJA]: {
    id: SampradayaType.DVAITA_VYASARAJA,
    name: 'Sri Vyasaraja Matha (Sosale)',
    category: 'Dvaita_Pradhana',
    peetham: 'Sri Vyasaraja Matha',
    headquarters: 'Sosale / Bangalore, Karnataka',
    primaryAuthority: 'Acharya Madhva & Sri Vyasatheertha Samhita',
    calendarSystem: 'Amanta',
    description: 'Vyasakuta lineage with strict Dvadashi Parana timings.'
  },
  [SampradayaType.DVAITA_SRIPADARAJA]: {
    id: SampradayaType.DVAITA_SRIPADARAJA,
    name: 'Sri Sripadaraja Matha',
    category: 'Dvaita_Pradhana',
    peetham: 'Sri Sripadaraja Peetham',
    headquarters: 'Mulbagal, Karnataka',
    primaryAuthority: 'Sri Sripadarajaru Haridasa Samhita',
    calendarSystem: 'Amanta',
    description: 'Birthplace of Haridasa movement with Narasimha Theertha sacred tank.'
  },
  [SampradayaType.DVAITA_KUDLI_ARYA_AKSHOBHYA]: {
    id: SampradayaType.DVAITA_KUDLI_ARYA_AKSHOBHYA,
    name: 'Sri Arya Akshobhya Theertha Matha',
    category: 'Dvaita_Pradhana',
    peetham: 'Sri Akshobhya Theertha Peetham',
    headquarters: 'Kudli, Karnataka',
    primaryAuthority: 'Direct disciple of Acharya Madhva',
    calendarSystem: 'Amanta',
    description: 'Preserves the pristine heritage of Sri Akshobhya Theertha.'
  },

  // Dvaita (Madhwa) - Udupi Ashta Mathas
  [SampradayaType.DVAITA_UDUPI_PALIMARU]: {
    id: SampradayaType.DVAITA_UDUPI_PALIMARU,
    name: 'Sri Palimaru Matha (Udupi)',
    category: 'Dvaita_Udupi',
    peetham: 'First of the Udupi Ashta Mathas',
    headquarters: 'Udupi, Karnataka',
    primaryAuthority: 'Acharya Madhva & Sri Hrishikesha Theertha',
    calendarSystem: 'Amanta',
    description: 'Sri Krishna Pooja Parayaya matha established by Sri Madhvacharya.'
  },
  [SampradayaType.DVAITA_UDUPI_ADAMARU]: {
    id: SampradayaType.DVAITA_UDUPI_ADAMARU,
    name: 'Sri Adamaru Matha (Udupi)',
    category: 'Dvaita_Udupi',
    peetham: 'Sri Narasimha & Sri Krishna Upasana',
    headquarters: 'Udupi, Karnataka',
    primaryAuthority: 'Acharya Madhva & Sri Narasimha Theertha',
    calendarSystem: 'Amanta',
    description: 'Renowned for Sanskrit education and Sri Krishna Seva.'
  },
  [SampradayaType.DVAITA_UDUPI_KRISHNAPURA]: {
    id: SampradayaType.DVAITA_UDUPI_KRISHNAPURA,
    name: 'Sri Krishnapura Matha (Udupi)',
    category: 'Dvaita_Udupi',
    peetham: 'Sri Janardana Deva Aradhana',
    headquarters: 'Udupi, Karnataka',
    primaryAuthority: 'Sri Janardana Theertha',
    calendarSystem: 'Amanta',
    description: 'One of the venerable 8 mathas of Udupi.'
  },
  [SampradayaType.DVAITA_UDUPI_PUTHIGE]: {
    id: SampradayaType.DVAITA_UDUPI_PUTHIGE,
    name: 'Sri Puthige Matha (Udupi)',
    category: 'Dvaita_Udupi',
    peetham: 'Sri Upendra Theertha Peetham',
    headquarters: 'Udupi, Karnataka',
    primaryAuthority: 'Sri Upendra Theertha',
    calendarSystem: 'Amanta',
    description: 'Global messenger of Sri Krishna bhakti.'
  },
  [SampradayaType.DVAITA_UDUPI_SHIROOR]: {
    id: SampradayaType.DVAITA_UDUPI_SHIROOR,
    name: 'Sri Shiroor Matha (Udupi)',
    category: 'Dvaita_Udupi',
    peetham: 'Sri Vamana Deva Aradhana',
    headquarters: 'Udupi, Karnataka',
    primaryAuthority: 'Sri Vamana Theertha',
    calendarSystem: 'Amanta',
    description: 'Ashta matha preserving Sri Vamana worship.'
  },
  [SampradayaType.DVAITA_UDUPI_SODHE]: {
    id: SampradayaType.DVAITA_UDUPI_SODHE,
    name: 'Sri Sodhe Vadiraja Matha (Udupi)',
    category: 'Dvaita_Udupi',
    peetham: 'Sri Vadiraja Gurusarvabhouma Peetham',
    headquarters: 'Sodhe, Sirsi / Udupi, Karnataka',
    primaryAuthority: 'Sri Vadiraja Theertha Samhita',
    calendarSystem: 'Amanta',
    description: 'Seat of saint Sri Vadiraja Theertha, worshipping Lord Hayagriva and Trivikrama.'
  },
  [SampradayaType.DVAITA_UDUPI_KANIYOOR]: {
    id: SampradayaType.DVAITA_UDUPI_KANIYOOR,
    name: 'Sri Kaniyoor Matha (Udupi)',
    category: 'Dvaita_Udupi',
    peetham: 'Sri Narasimha Divya Sannidhi',
    headquarters: 'Udupi, Karnataka',
    primaryAuthority: 'Sri Rama Theertha',
    calendarSystem: 'Amanta',
    description: 'Ashta matha worshipping Sri Narasimha.'
  },
  [SampradayaType.DVAITA_UDUPI_PEJAWARA]: {
    id: SampradayaType.DVAITA_UDUPI_PEJAWARA,
    name: 'Sri Pejawara Matha (Udupi)',
    category: 'Dvaita_Udupi',
    peetham: 'Sri Adhokshaja Theertha Peetham',
    headquarters: 'Udupi, Karnataka',
    primaryAuthority: 'Sri Adhokshaja Theertha',
    calendarSystem: 'Amanta',
    description: 'World-renowned for humanitarian and spiritual service.'
  }
};

export interface MuttSpecificObservance {
  muttId: string;
  muttName: string;
  isEkadashiFastingDay: boolean;
  isDvadashiParanaDay: boolean;
  ekadashiType: 'Shuddha' | 'Viddha' | 'Gaudha' | 'None';
  harivasaraText?: string;
  paranaTimingText?: string;
  isTharpanamDay: boolean;
  tharpanamReason?: string;
  festivalsAndEvents: string[];
  notes: string[];
}

/**
 * Evaluates authentic Shastric Nirnaya rules.
 * 
 * CORE PRINCIPLE:
 * - Dvaita and Vishishtadvaita (Vadakalai & Thengalai) BOTH follow strict Vaishnava Ekadashi rules!
 *   (Dashami presence at Arunodaya 96 min before sunrise forces fasting to Dvadashi).
 * - Advaita (Smartha) follows Smartha Ekadashi rules (Nirnaya Sindhu).
 * - STANDARD mode shows both Smartha and Vaishnava dates side-by-side!
 */
export function evaluateMuttObservances(
  panchangam: PanchangamOutput,
  muttId: string = SampradayaType.STANDARD
): MuttSpecificObservance {
  const mutt = MUTT_REGISTRY[muttId] || MUTT_REGISTRY[SampradayaType.STANDARD];
  const { tithi } = panchangam.angas;
  const festivals: string[] = [];
  const notes: string[] = [];

  let isEkadashiFastingDay = false;
  let isDvadashiParanaDay = false;
  let ekadashiType: 'Shuddha' | 'Viddha' | 'Gaudha' | 'None' = 'None';
  let harivasaraText: string | undefined;
  let paranaTimingText: string | undefined;
  let isTharpanamDay = false;
  let tharpanamReason: string | undefined;

  const isVaishnavaTradition = mutt.category.startsWith('Dvaita') || mutt.category.startsWith('Vishishtadvaita');
  const isSmarthaTradition = mutt.category === 'Advaita';
  const isStandard = mutt.id === SampradayaType.STANDARD;

  // Arunodaya Vedha check: 4 ghatikas = 96 minutes before local sunrise
  // If Tithi at sunrise is Ekadashi, but fraction elapsed > 0.067 (~96 min into a 24h tithi),
  // then Dashami was touching Arunodaya (Dashami Vedha)!
  const hasArunodayaVedha = tithi.numberInPaksha === 11 && tithi.fractionElapsed > 0.067;

  // 1. Ekadashi Logic
  if (tithi.numberInPaksha === 11) {
    // Today is Ekadashi at sunrise
    if (isVaishnavaTradition) {
      // Both Dvaita and Vishishtadvaita share the same Vaishnava rule!
      if (hasArunodayaVedha) {
        ekadashiType = 'Viddha';
        isEkadashiFastingDay = false;
        notes.push('Vaishnava Nirnaya: Dashami touched Arunodaya (96 min before sunrise). Ekadashi is Viddha; fasting is strictly observed tomorrow on Dvadashi (Sampurna Dvadashi Vrata).');
      } else {
        ekadashiType = 'Shuddha';
        isEkadashiFastingDay = true;
        festivals.push(`${tithi.paksha} Ekadashi Vrata (Vaishnava Shuddha)`);
      }
    } else if (isSmarthaTradition) {
      // Advaita (Smartha) Nirnaya
      if (tithi.fractionElapsed > 0.12) {
        ekadashiType = 'Viddha';
        isEkadashiFastingDay = false;
        notes.push('Smartha Nirnaya: Dashami contact at Arunodaya. Fasting observed tomorrow.');
      } else {
        ekadashiType = 'Shuddha';
        isEkadashiFastingDay = true;
        festivals.push(`${tithi.paksha} Ekadashi (Smartha Shuddha)`);
      }
    } else {
      // STANDARD mode: Displays both Smartha and Vaishnava status
      if (hasArunodayaVedha) {
        festivals.push(`Smartha Ekadashi (Fast today for Smarthas)`);
        notes.push(`Vaishnava Notice: For Dvaita & Vishishtadvaita, this Ekadashi is Viddha; Vaishnava fast is tomorrow on Dvadashi.`);
      } else {
        festivals.push(`${tithi.paksha} Ekadashi Vrata (Observed by Both Smartha & Vaishnava)`);
        isEkadashiFastingDay = true;
      }
    }
  } else if (tithi.numberInPaksha === 12) {
    // Today is Dvadashi at sunrise
    const sunrise = panchangam.timings.sunrise;
    const tEnd = tithi.endTime;

    // Harivasara calculation: first quarter of Dvadashi
    const approxDvadashiDurationMs = 24 * 3600000;
    const harivasaraEndMs = sunrise.getTime() + 0.25 * approxDvadashiDurationMs;
    const harivasaraEnd = new Date(harivasaraEndMs);

    harivasaraText = `Harivasara concludes at approx ${harivasaraEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Parana Window: must be after Harivasara concludes and before Dvadashi ends
    const paranaStart = harivasaraEndMs > sunrise.getTime() ? harivasaraEnd : sunrise;
    const paranaEnd = tEnd.getTime() < sunrise.getTime() + 6 * 3600000 ? tEnd : new Date(sunrise.getTime() + 4 * 3600000);

    paranaTimingText = `Parana between ${paranaStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} and ${paranaEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    if (isVaishnavaTradition) {
      festivals.push('Dvadashi Parana (Strict Harivasara observance)');
      isDvadashiParanaDay = true;
    } else if (isSmarthaTradition) {
      festivals.push('Dvadashi Parana (Smartha)');
      isDvadashiParanaDay = true;
    } else {
      festivals.push('Dvadashi Parana');
      isDvadashiParanaDay = true;
    }
  }

  // 2. Pradosham (Trayodashi) - strictly in Advaita & Smartha
  if (tithi.numberInPaksha === 13) {
    if (isSmarthaTradition || isStandard) {
      festivals.push(`${tithi.paksha} Pradosha Vrata`);
    }
  }

  // 3. Sankashti Chaturthi (Krishna Paksha 4)
  if (tithi.paksha === 'Krishna' && tithi.numberInPaksha === 4) {
    festivals.push('Sankashti Chaturthi Vrata (Moonrise Pooja)');
  }

  // 4. Amavasya & Purnima
  if (tithi.index === 14) {
    festivals.push('Purnima / Pournami (Full Moon)');
  } else if (tithi.index === 29) {
    festivals.push('Amavasya (New Moon Pitru Tharpanam)');
    isTharpanamDay = true;
    tharpanamReason = 'Darsha Amavasya Pitru Tharpanam in Aparahna Kala';
  }

  // 5. Specific Mutt Pontiff Aradhanas & Jayantis
  const chandraMasa = panchangam.solarLunarInfo.chandraMasa.amanta;
  const nakshatra = panchangam.angas.nakshatra.name;

  if (mutt.category.startsWith('Dvaita')) {
    // Mantralayam Sri Raghavendra Swamy Matha
    if (chandraMasa === 'Shravana' && tithi.paksha === 'Krishna' && tithi.numberInPaksha === 2) {
      festivals.push('🌟 Sri Raghavendra Swamy Guru Sarvabhouma Madhya Aradhana (Mantralayam)');
    }
    // Sri Jayatirtha Aradhana (Teekacharyaru)
    if (chandraMasa === 'Ashadha' && tithi.paksha === 'Krishna' && tithi.numberInPaksha === 5) {
      festivals.push('🌟 Sri Jayatirtha (Teekakritpada) Aradhana (Malkhed)');
    }
    // Sri Vadiraja Theertha Aradhana (Sodhe Matha)
    if (chandraMasa === 'Phalguna' && tithi.paksha === 'Krishna' && tithi.numberInPaksha === 3) {
      festivals.push('🌟 Sri Vadiraja Theertha Aradhana (Sodhe Matha)');
    }
    // Sri Vyasaraja Aradhana
    if (chandraMasa === 'Phalguna' && tithi.paksha === 'Krishna' && tithi.numberInPaksha === 4) {
      festivals.push('🌟 Sri Vyasaraja Theertha Aradhana (Anegundi / Nava Brindavana)');
    }
  }

  if (mutt.category.startsWith('Vishishtadvaita')) {
    // Swami Desikan Thirunakshatram (Purattasi Tiruvonam / Shravana)
    if (nakshatra.includes('Shravana') && panchangam.solarLunarInfo.sauraMasa.rashi === 'Kanya') {
      festivals.push('🌟 Swami Vedanta Desikan Thirunakshatram');
    }
    // Sri Ramanuja Jayanti (Chithirai Thiruvadhirai / Ardra in Mesha)
    if (nakshatra.includes('Ardra') && panchangam.solarLunarInfo.sauraMasa.rashi === 'Mesha') {
      festivals.push('🌟 Sri Ramanujacharya Thirunakshatram (Emperumanar)');
    }
    // Ahobila Mutt: Shravana Deepam
    if (muttId === SampradayaType.VAISHNAVA_VADAKALAI_AHOBILA && nakshatra.includes('Shravana')) {
      festivals.push('Sravana Deepam Vrata (Ahobila Mutt)');
    }
  }

  if (mutt.category === 'Advaita') {
    // Sri Adi Shankaracharya Jayanti (Vaishakha Shukla Panchami)
    if (chandraMasa === 'Vaishakha' && tithi.paksha === 'Shukla' && tithi.numberInPaksha === 5) {
      festivals.push('🌟 Sri Adi Shankaracharya Jayanti (Sringeri / Kanchi)');
    }
  }

  return {
    muttId: mutt.id,
    muttName: mutt.name,
    isEkadashiFastingDay,
    isDvadashiParanaDay,
    ekadashiType,
    harivasaraText,
    paranaTimingText,
    isTharpanamDay,
    tharpanamReason,
    festivalsAndEvents: festivals,
    notes
  };
}

/**
 * Generates an authoritative side-by-side comparison matrix across the 3 main pillars:
 * Advaita (Smartha), Vishishtadvaita, and Dvaita.
 */
export function compareMuttTraditions(panchangam: PanchangamOutput) {
  const standard = evaluateMuttObservances(panchangam, SampradayaType.STANDARD);
  const smartha = evaluateMuttObservances(panchangam, SampradayaType.ADVAITA_SRINGERI);
  const vaishnavaAhobila = evaluateMuttObservances(panchangam, SampradayaType.VAISHNAVA_VADAKALAI_AHOBILA);
  const vaishnavaThengalai = evaluateMuttObservances(panchangam, SampradayaType.VAISHNAVA_THENGALAI_VANAMAMALAI);
  const dvaitaUttaradi = evaluateMuttObservances(panchangam, SampradayaType.DVAITA_UTTARADI);
  const dvaitaRayar = evaluateMuttObservances(panchangam, SampradayaType.DVAITA_RAYAR_MANTRALAYAM);

  return {
    date: panchangam.date,
    tithi: panchangam.angas.tithi.name,
    nakshatra: panchangam.angas.nakshatra.name,
    traditions: {
      standard,
      advaita: {
        title: 'Advaita (Smartha - Sringeri / Kanchi)',
        authority: 'Nirnaya Sindhu & Dharma Sindhu',
        observance: smartha
      },
      vishishtadvaita: {
        title: 'Vishishtadvaita (Sri Vaishnava)',
        authority: 'Pancharatra Agama & Sadachara Nirnaya',
        vadakalai: vaishnavaAhobila,
        thengalai: vaishnavaThengalai
      },
      dvaita: {
        title: 'Dvaita (Madhwa - Uttaradi / Rayar / Udupi)',
        authority: 'Krishnamruta Maharnava by Acharya Madhva',
        uttaradi: dvaitaUttaradi,
        mantralayam: dvaitaRayar
      }
    }
  };
}
