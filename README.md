# 🕉️ Real Panchangam — High-Precision Multi-Mutt Vedic Ephemeris & Shraddha Platform

An enterprise-grade, high-precision Vedic Panchangam platform engineered to compute daily Panchangam, multi-mutt Sampradaya differences (Advaita, Vishishtadvaita, Dvaita), and ancestral Shraddha dates accurately for **any location on Earth**.

Hosted at: **[https://realpanchangam.run.place](https://realpanchangam.run.place)**

Built as an **API-first architecture** with an interactive **Swagger/OpenAPI documentation portal**, enabling third-party mobile apps (Flutter, React Native, iOS, Android) and web clients to consume the calculations directly.

---

## 🌟 Core Pillars

### 1. High-Precision Astronomical Engine (`@panchangam/engine`)
* Implements **VSOP87 and ELP2000 planetary theory** with topocentric lunar parallax and elevation/refraction-adjusted horizon timings.
* **The 5 Angas (Limbs)**: Tithi, Vara, Nakshatra (with Pada 1-4), Yoga, and Karana (Chara & Sthira) with exact end times and duration progress.
* **Solar & Lunar Markers**: Samvatsara (Shaka & Vikrama 60-year Jovian cycles), Ayana (Uttarayana/Dakshinayana), Ritu (6 seasons), Chandra Masa (Amanta & Purnimanta), Saura Masa (Tamil / Malayalam solar calendar).
* **Muhurthas & Day Divisions**: 5-fold day division (Pratah, Sangava, Madhyahna, Aparahna, Sayahna), Brahma Muhurtha, Abhijit, Rahu Kalam, Yamagandam, Gulika Kalam, Durmuhurtham, and Graha Spashta (Planetary positions table).

### 2. Multi-Mutt Sampradaya Nirnaya Engine
Pre-configured Shastric rulebooks and side-by-side comparative analysis across:
* **Advaita (Smartha)**: *Sringeri Sharada Peetham*, *Kanchi Kamakoti Peetham* (Arunodaya Vedha Ekadashi, Pradosha Vyapti, Smartha Jayantis).
* **Vishishtadvaita (Sri Vaishnava)**:
  * **Vadakalai**: *Sri Ahobila Mutt*, *Srimad Andavan Ashramam* (Pancharatra Agama, strict Harivasara, Nimisha Vedha, Bimbodbhava rules).
  * **Thengalai**: *Sri Vanamamalai Mutt* (Udaya Tithi rules, Saura month primacy).
* **Dvaita (Madhwa)**:
  * *Sri Uttaradi Mutt*, *Mantralayam Sri Raghavendra Swamy Mutt*, *Sri Vyasaraja Mutt* (Sri Madhvacharya's *Krishnamruta Maharnava*, strict avoidance of Arunodaya-viddha Ekadashi, Dvadashi Parana timing, Peethadhipati Aradhanas).

### 3. Ancestral Shraddha Remembrance & Calendar Hub
* **Aparahna Vyapti Algorithm**: Automatically divides local daylight into 5 parts and computes the exact minutes the ancestor's Tithi overlaps with the 4th part (Aparahna).
* **Kutapa & Rohina Kala**: Pinpoints the ideal 8th and 9th Muhurthas (~11:45 AM – 12:35 PM) for performing the Pitru Karyam.
* **Two-Day Overlap Disambiguation**: Applies Shastric rules when a Tithi touches Aparahna on both days (greater Vyapti duration rule) or neither day.
* **5-Year Projections**: Computes upcoming dates for the next 5 years for any ancestor.
* **RFC 5545 iCalendar (`.ics`) Export**: 1-click subscription to Google Calendar, Apple Calendar, and Outlook with 7-day and 1-day alerts.

### 4. Simple Mobile Authentication & Admin Control
* **Mobile-First Login**: Fast, frictionless registration and login with **Mobile Number + Password**.
* **Guest Mode**: Guest users can use all Panchangam features, maps, and calculations without logging in (backed by local storage).
* **Cloud Sync**: Logging in enables cloud persistence across devices for saved ancestors.
* **Admin Portal**: Admin users can inspect registered users, master Shraddha records, and platform statistics.

---

## 🚀 Quick Start

### Prerequisites
* Node.js v18+ (tested on Node v22)
* npm v9+

### Running the Services
From the workspace root:

```bash
# 1. Start the Fastify REST API server (Port 4000)
npm run dev:api

# 2. Start the Vite React Web App (Port 3000)
npm run dev:web

# Or run both concurrently:
npm run dev
```

* **Web Application**: Open [http://localhost:3000](http://localhost:3000)
* **Interactive Swagger UI**: Open [http://localhost:4000/docs](http://localhost:4000/docs)

---

## 🔑 Demo Logins

| Role | Mobile Number | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **User** | `9876543210` | `user123` | Personal Shraddha Cloud Vault, Saved Locations |
| **Admin** | `9999999999` | `admin123` | Full Admin Portal, All Users & Records Inspection |

---

## 📡 REST API Reference

The API is fully documented with OpenAPI 3.0 schemas at **`/docs`**.

### 1. Public Endpoints (No Token Required)
* `GET /api/v1/panchangam`: Daily detailed panchangam (Query: `date`, `latitude`, `longitude`, `timezone`, `elevation`, `ayanamsha`, `mutt`).
* `GET /api/v1/panchangam/calendar`: Monthly grid of Tithis, Nakshatras, and festivals.
* `GET /api/v1/panchangam/muhurtha`: Auspicious and inauspicious windows.
* `GET /api/v1/mutt/compare`: Side-by-side comparative analysis of Advaita, Vishishtadvaita, and Dvaita rules.
* `GET /api/v1/locations/search`: Global geocoding search for 150,000+ cities with timezone resolution.
* `POST /api/v1/shraddha/calculate`: Ad-hoc calculate exact Shraddha date and Kutapa window.
* `POST /api/v1/shraddha/export-ics`: Generate standard `.ics` file for calendar import.

### 2. Authentication Endpoints
* `POST /api/v1/auth/register`: Register with `{ phone, name, password }`.
* `POST /api/v1/auth/login`: Authenticate with `{ phone, password }` -> returns `{ token, user }`.
* `GET /api/v1/auth/me`: Get current user profile (Header: `Authorization: Bearer <token>`).

### 3. Authenticated User Shraddha Vault (`Authorization: Bearer <token>`)
* `GET /api/v1/user/shraddha`: Fetch user's saved ancestor records.
* `POST /api/v1/user/shraddha`: Save new ancestor profile.
* `PUT /api/v1/user/shraddha/:id`: Update ancestor profile.
* `DELETE /api/v1/user/shraddha/:id`: Delete ancestor profile.
* `GET /api/v1/user/shraddha/upcoming`: Compute upcoming 5 years for all saved ancestors.
* `GET /api/v1/user/shraddha/:id/export-ics`: Download `.ics` with customized reminder alarms.

### 4. Admin Management (`Role: ADMIN`)
* `GET /api/v1/admin/stats`: System-wide metrics, total users, total Shraddha records, tradition distribution.
* `GET /api/v1/admin/users`: List all registered phone numbers and user profiles.
* `GET /api/v1/admin/shraddha-records`: Master table of all saved Shraddha records across the platform.
* `DELETE /api/v1/admin/users/:id`: Administrative user removal.

---

## 📱 Integrating with Other Apps (Flutter, React Native, iOS, Android)

Other applications can query the API using standard HTTP client libraries.

### Example: Fetch Daily Panchangam in Dart / Flutter

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<Map<String, dynamic>> fetchPanchangam(double lat, double lon) async {
  final url = Uri.parse('http://your-server-ip:4000/api/v1/panchangam?latitude=$lat&longitude=$lon&mutt=ADVAITA_SMARTHA');
  final response = await http.get(url);
  return jsonDecode(response.body);
}
```

### Example: Calculate Shraddha Date via cURL / HTTP

```bash
curl -X POST http://localhost:4000/api/v1/shraddha/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "personName": "Father",
    "relationship": "FATHER",
    "gotra": "Kashyapa",
    "tradition": "ADVAITA_SMARTHA",
    "system": "LUNAR",
    "chandraMasa": "Bhadrapada",
    "paksha": "Krishna",
    "tithiNumber": 8,
    "targetYear": 2026,
    "latitude": 13.0827,
    "longitude": 80.2707,
    "timezone": "Asia/Kolkata"
  }'
```

---

## 📁 Repository Structure

```
d:/Panchangam/
├── packages/
│   └── engine/                     # Pure TypeScript astronomical & Shastric Nirnaya library
│       ├── src/
│       │   ├── astronomy/          # VSOP87/ELP2000 calculations, Ayanamshas, 5 Angas, Muhurthas
│       │   ├── mutts/              # Advaita, Vishishtadvaita, Dvaita rulebooks & comparison
│       │   ├── shraddha/           # Aparahna Vyapti, Kutapa/Rohina Kala, .ics generator
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── apps/
│   ├── api/                        # Fastify REST API + Swagger UI + Prisma SQLite
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # User, ShraddhaProfile, SavedLocation
│   │   │   └── seed.ts             # Default Admin & demo accounts seed
│   │   ├── src/
│   │   │   ├── routes/             # Auth, Admin, User Shraddha, Panchangam, Mutt, Locations
│   │   │   └── server.ts           # Fastify server bootstrap & Swagger mounting
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/                        # React 19 + Vite responsive Vedic UI
│       ├── src/
│       │   ├── components/         # MapPicker, FiveAngas, MuttSwitcher, ShraddhaHub, AuthModal, Admin
│       │   ├── services/api.ts     # Client SDK for REST endpoints
│       │   ├── styles/index.css    # Sacred Vedic Design System
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── index.html
│       └── vite.config.ts
├── package.json                    # Workspace root
├── tsconfig.base.json
└── README.md
```
