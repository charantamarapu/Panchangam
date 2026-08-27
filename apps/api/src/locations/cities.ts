export interface CityLocation {
  name: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  elevation: number;
}

export const CURATED_CITIES: CityLocation[] = [
  // Sacred Temple & Mutt Towns
  { name: 'Ujjain (Mahakaleshwar)', state: 'Madhya Pradesh', country: 'India', latitude: 23.1765, longitude: 75.7885, timezone: 'Asia/Kolkata', elevation: 491 },
  { name: 'Varanasi (Kashi)', state: 'Uttar Pradesh', country: 'India', latitude: 25.3176, longitude: 82.9739, timezone: 'Asia/Kolkata', elevation: 81 },
  { name: 'Sringeri (Sharada Peetham)', state: 'Karnataka', country: 'India', latitude: 13.4167, longitude: 75.2500, timezone: 'Asia/Kolkata', elevation: 672 },
  { name: 'Kanchipuram', state: 'Tamil Nadu', country: 'India', latitude: 12.8342, longitude: 79.7036, timezone: 'Asia/Kolkata', elevation: 83 },
  { name: 'Mantralayam', state: 'Andhra Pradesh', country: 'India', latitude: 15.9389, longitude: 77.4267, timezone: 'Asia/Kolkata', elevation: 300 },
  { name: 'Tirupati (Tirumala)', state: 'Andhra Pradesh', country: 'India', latitude: 13.6288, longitude: 79.4192, timezone: 'Asia/Kolkata', elevation: 180 },
  { name: 'Ahobilam', state: 'Andhra Pradesh', country: 'India', latitude: 15.1333, longitude: 78.7167, timezone: 'Asia/Kolkata', elevation: 327 },
  { name: 'Srirangam', state: 'Tamil Nadu', country: 'India', latitude: 10.8622, longitude: 78.6900, timezone: 'Asia/Kolkata', elevation: 75 },
  { name: 'Rameswaram', state: 'Tamil Nadu', country: 'India', latitude: 9.2876, longitude: 79.3129, timezone: 'Asia/Kolkata', elevation: 10 },
  { name: 'Madurai', state: 'Tamil Nadu', country: 'India', latitude: 9.9252, longitude: 78.1198, timezone: 'Asia/Kolkata', elevation: 136 },
  { name: 'Chidambaram', state: 'Tamil Nadu', country: 'India', latitude: 11.3992, longitude: 79.6936, timezone: 'Asia/Kolkata', elevation: 6 },
  { name: 'Kumbakonam', state: 'Tamil Nadu', country: 'India', latitude: 10.9601, longitude: 79.3845, timezone: 'Asia/Kolkata', elevation: 26 },
  { name: 'Thanjavur', state: 'Tamil Nadu', country: 'India', latitude: 10.7870, longitude: 79.1378, timezone: 'Asia/Kolkata', elevation: 59 },
  { name: 'Puri (Jagannath)', state: 'Odisha', country: 'India', latitude: 19.8135, longitude: 85.8312, timezone: 'Asia/Kolkata', elevation: 10 },
  { name: 'Dwarka', state: 'Gujarat', country: 'India', latitude: 22.2442, longitude: 68.9685, timezone: 'Asia/Kolkata', elevation: 15 },
  { name: 'Badrinath', state: 'Uttarakhand', country: 'India', latitude: 30.7433, longitude: 79.4938, timezone: 'Asia/Kolkata', elevation: 3133 },
  { name: 'Kedarnath', state: 'Uttarakhand', country: 'India', latitude: 30.7352, longitude: 79.0669, timezone: 'Asia/Kolkata', elevation: 3583 },
  { name: 'Haridwar', state: 'Uttarakhand', country: 'India', latitude: 29.9457, longitude: 78.1642, timezone: 'Asia/Kolkata', elevation: 314 },
  { name: 'Rishikesh', state: 'Uttarakhand', country: 'India', latitude: 30.0869, longitude: 78.2676, timezone: 'Asia/Kolkata', elevation: 372 },
  { name: 'Ayodhya', state: 'Uttar Pradesh', country: 'India', latitude: 26.7922, longitude: 82.1998, timezone: 'Asia/Kolkata', elevation: 102 },
  { name: 'Mathura (Vrindavan)', state: 'Uttar Pradesh', country: 'India', latitude: 27.4924, longitude: 77.6737, timezone: 'Asia/Kolkata', elevation: 174 },
  { name: 'Nanguneri (Vanamamalai)', state: 'Tamil Nadu', country: 'India', latitude: 8.4878, longitude: 77.6659, timezone: 'Asia/Kolkata', elevation: 45 },
  { name: 'Udupi (Sri Krishna)', state: 'Karnataka', country: 'India', latitude: 13.3409, longitude: 74.7421, timezone: 'Asia/Kolkata', elevation: 27 },
  { name: 'Gokarna', state: 'Karnataka', country: 'India', latitude: 14.5479, longitude: 74.3188, timezone: 'Asia/Kolkata', elevation: 15 },
  { name: 'Guruvayur', state: 'Kerala', country: 'India', latitude: 10.5946, longitude: 76.0396, timezone: 'Asia/Kolkata', elevation: 14 },
  { name: 'Sabarimala', state: 'Kerala', country: 'India', latitude: 9.4404, longitude: 77.0819, timezone: 'Asia/Kolkata', elevation: 468 },

  // Major Indian Metros & Cities
  { name: 'Bengaluru (Bangalore)', state: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata', elevation: 920 },
  { name: 'Chennai', state: 'Tamil Nadu', country: 'India', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata', elevation: 10 },
  { name: 'Hyderabad', state: 'Telangana', country: 'India', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata', elevation: 542 },
  { name: 'Mumbai', state: 'Maharashtra', country: 'India', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata', elevation: 14 },
  { name: 'Pune', state: 'Maharashtra', country: 'India', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata', elevation: 560 },
  { name: 'New Delhi', state: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata', elevation: 216 },
  { name: 'Kolkata', state: 'West Bengal', country: 'India', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata', elevation: 9 },
  { name: 'Ahmedabad', state: 'Gujarat', country: 'India', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata', elevation: 53 },
  { name: 'Coimbatore', state: 'Tamil Nadu', country: 'India', latitude: 11.0168, longitude: 76.9558, timezone: 'Asia/Kolkata', elevation: 411 },
  { name: 'Kochi (Cochin)', state: 'Kerala', country: 'India', latitude: 9.9312, longitude: 76.2673, timezone: 'Asia/Kolkata', elevation: 5 },
  { name: 'Thiruvananthapuram', state: 'Kerala', country: 'India', latitude: 8.5241, longitude: 76.9366, timezone: 'Asia/Kolkata', elevation: 10 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', latitude: 17.6868, longitude: 83.2185, timezone: 'Asia/Kolkata', elevation: 45 },
  { name: 'Vijayawada', state: 'Andhra Pradesh', country: 'India', latitude: 16.5062, longitude: 80.6480, timezone: 'Asia/Kolkata', elevation: 20 },
  { name: 'Mysuru (Mysore)', state: 'Karnataka', country: 'India', latitude: 12.2958, longitude: 76.6394, timezone: 'Asia/Kolkata', elevation: 763 },
  { name: 'Jaipur', state: 'Rajasthan', country: 'India', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata', elevation: 431 },
  { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', latitude: 26.8467, longitude: 80.9462, timezone: 'Asia/Kolkata', elevation: 123 },
  { name: 'Patna', state: 'Bihar', country: 'India', latitude: 25.5941, longitude: 85.1376, timezone: 'Asia/Kolkata', elevation: 53 },
  { name: 'Bhubaneswar', state: 'Odisha', country: 'India', latitude: 20.2961, longitude: 85.8245, timezone: 'Asia/Kolkata', elevation: 45 },
  { name: 'Nagpur', state: 'Maharashtra', country: 'India', latitude: 21.1458, longitude: 79.0882, timezone: 'Asia/Kolkata', elevation: 310 },
  { name: 'Indore', state: 'Madhya Pradesh', country: 'India', latitude: 22.7196, longitude: 75.8577, timezone: 'Asia/Kolkata', elevation: 553 },

  // Global Metros (US, UK, Middle East, APAC, Europe)
  { name: 'New York', state: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', elevation: 10 },
  { name: 'San Jose / Bay Area', state: 'California', country: 'United States', latitude: 37.3382, longitude: -121.8863, timezone: 'America/Los_Angeles', elevation: 25 },
  { name: 'Chicago', state: 'Illinois', country: 'United States', latitude: 41.8781, longitude: -87.6298, timezone: 'America/Chicago', elevation: 181 },
  { name: 'Dallas / Fort Worth', state: 'Texas', country: 'United States', latitude: 32.7767, longitude: -96.7970, timezone: 'America/Chicago', elevation: 131 },
  { name: 'Houston', state: 'Texas', country: 'United States', latitude: 29.7604, longitude: -95.3698, timezone: 'America/Chicago', elevation: 15 },
  { name: 'Seattle', state: 'Washington', country: 'United States', latitude: 47.6062, longitude: -122.3321, timezone: 'America/Los_Angeles', elevation: 53 },
  { name: 'Atlanta', state: 'Georgia', country: 'United States', latitude: 33.7490, longitude: -84.3880, timezone: 'America/New_York', elevation: 320 },
  { name: 'Toronto', state: 'Ontario', country: 'Canada', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto', elevation: 76 },
  { name: 'London', state: 'England', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', elevation: 25 },
  { name: 'Dubai', state: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai', elevation: 5 },
  { name: 'Abu Dhabi', state: 'Abu Dhabi', country: 'United Arab Emirates', latitude: 24.4539, longitude: 54.3773, timezone: 'Asia/Dubai', elevation: 8 },
  { name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore', elevation: 15 },
  { name: 'Kuala Lumpur', state: 'Federal Territory', country: 'Malaysia', latitude: 3.1390, longitude: 101.6869, timezone: 'Asia/Kuala_Lumpur', elevation: 60 },
  { name: 'Sydney', state: 'New South Wales', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney', elevation: 19 },
  { name: 'Melbourne', state: 'Victoria', country: 'Australia', latitude: -37.8136, longitude: 144.9631, timezone: 'Australia/Melbourne', elevation: 31 }
];

export async function searchLocations(query: string): Promise<CityLocation[]> {
  const q = query.trim().toLowerCase();
  if (!q) return CURATED_CITIES.slice(0, 10);

  const matches = CURATED_CITIES.filter(c =>
    c.name.toLowerCase().includes(q) ||
    (c.state && c.state.toLowerCase().includes(q)) ||
    c.country.toLowerCase().includes(q)
  );

  if (matches.length >= 5) {
    return matches.slice(0, 10);
  }

  // Live geocode fallback via OpenStreetMap Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=5`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'PanchangamApp/1.0 (contact@panchangam.org)'
      }
    });
    if (res.ok) {
      const data = await res.json() as any[];
      const osmMatches: CityLocation[] = data.map(item => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        const tz = guessTimezoneFromCoords(lat, lon);
        // Estimate rough elevation based on region
        let elev = 10;
        if (lat >= 12.5 && lat <= 13.5 && lon >= 77.2 && lon <= 77.8) elev = 920; // Bangalore region
        else if (lat >= 23 && lat <= 24 && lon >= 75 && lon <= 76) elev = 491; // Malwa/Ujjain
        return {
          name: item.display_name.split(',')[0],
          state: item.address?.state || item.address?.county,
          country: item.address?.country || '',
          latitude: lat,
          longitude: lon,
          timezone: tz,
          elevation: elev
        };
      });
      return [...matches, ...osmMatches].slice(0, 10);
    }
  } catch (err) {
    // Network fallback
  }

  return matches;
}

function guessTimezoneFromCoords(lat: number, lon: number): string {
  if (lat >= 6 && lat <= 38 && lon >= 68 && lon <= 98) {
    return 'Asia/Kolkata'; // India
  }
  if (lat >= 24 && lat <= 50 && lon >= -125 && lon <= -65) {
    if (lon > -85) return 'America/New_York';
    if (lon > -100) return 'America/Chicago';
    if (lon > -115) return 'America/Denver';
    return 'America/Los_Angeles';
  }
  if (lat >= 48 && lat <= 60 && lon >= -10 && lon <= 2) {
    return 'Europe/London';
  }
  if (lat >= 22 && lat <= 26 && lon >= 51 && lon <= 57) {
    return 'Asia/Dubai';
  }
  if (lat >= 1 && lat <= 2 && lon >= 103 && lon <= 104) {
    return 'Asia/Singapore';
  }
  if (lat <= -10 && lat >= -45 && lon >= 110 && lon <= 155) {
    return 'Australia/Sydney';
  }
  return 'UTC';
}
