import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;

let sql: ReturnType<typeof neon> | null = null;

export function getDb() {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not configured. Add it in .env or Secrets panel.");
  }
  if (!sql) {
    sql = neon(DATABASE_URL);
  }
  return sql;
}

export async function initDb() {
  const db = getDb();
  await db`
    CREATE TABLE IF NOT EXISTS police_stations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      lat DOUBLE PRECISION NOT NULL,
      lng DOUBLE PRECISION NOT NULL,
      hours TEXT NOT NULL DEFAULT '24x7',
      base_rating DOUBLE PRECISION NOT NULL DEFAULT 4.0,
      category TEXT NOT NULL DEFAULT 'police-station',
      jurisdiction TEXT NOT NULL DEFAULT '',
      pincode TEXT NOT NULL DEFAULT '',
      area TEXT NOT NULL DEFAULT '',
      fraud_risk TEXT NOT NULL DEFAULT 'medium'
    );
  `;
  await db`
    CREATE TABLE IF NOT EXISTS station_ratings (
      id SERIAL PRIMARY KEY,
      station_id INTEGER NOT NULL REFERENCES police_stations(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(station_id, user_id)
    );
  `;
  await db`
    CREATE TABLE IF NOT EXISTS fraud_reports (
      id SERIAL PRIMARY KEY,
      station_id INTEGER REFERENCES police_stations(id),
      user_id TEXT NOT NULL DEFAULT '',
      fraud_type TEXT NOT NULL,
      description TEXT NOT NULL,
      gps_lat DOUBLE PRECISION,
      gps_lng DOUBLE PRECISION,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log("[DB] Tables initialized successfully");
}

export async function seedStations() {
  const db = getDb();
  const existing = await db`SELECT COUNT(*) as count FROM police_stations`;
  if (existing[0]?.count > 0) return;

  const stations = [
    { name: "M.P. Nagar Police Station", address: "M.P. Nagar, Zone-1, Bhopal - 462011", phone: "+91 755 255 0111", lat: 23.2316, lng: 77.4320, hours: "24x7", base_rating: 4.3, category: "police-station", jurisdiction: "M.P. Nagar, E-1 to E-8, Arera Colony", pincode: "462011", area: "M.P. Nagar", fraud_risk: "medium" },
    { name: "TT Nagar Police Station", address: "TT Nagar, Bhopal - 462003", phone: "+91 755 255 0222", lat: 23.2397, lng: 77.4043, hours: "24x7", base_rating: 4.1, category: "police-station", jurisdiction: "TT Nagar, Rishi Nagar, Chuna Bhatti", pincode: "462003", area: "TT Nagar", fraud_risk: "high" },
    { name: "Habibganj Police Station", address: "Habibganj, Bhopal - 462024", phone: "+91 755 255 0333", lat: 23.2373, lng: 77.4457, hours: "24x7", base_rating: 4.2, category: "police-station", jurisdiction: "Habibganj, Hoshangabad Road", pincode: "462024", area: "Habibganj", fraud_risk: "medium" },
    { name: "Kamla Nagar Police Station", address: "Kamla Nagar, Bhopal - 462001", phone: "+91 755 255 0444", lat: 23.2608, lng: 77.4222, hours: "24x7", base_rating: 4.0, category: "police-station", jurisdiction: "Kamla Nagar, Old City", pincode: "462001", area: "Kamla Nagar", fraud_risk: "high" },
    { name: "Kolar Road Police Station", address: "Kolar Road, Bhopal - 462042", phone: "+91 755 255 0555", lat: 23.2004, lng: 77.4239, hours: "24x7", base_rating: 4.4, category: "police-station", jurisdiction: "Kolar Road, Damkheda, Jatkhedi", pincode: "462042", area: "Kolar Road", fraud_risk: "low" },
    { name: "Shahpura Police Station", address: "Shahpura, Bhopal - 462039", phone: "+91 755 255 0666", lat: 23.2193, lng: 77.4561, hours: "24x7", base_rating: 4.2, category: "police-station", jurisdiction: "Shahpura, Harshwardhan Nagar", pincode: "462039", area: "Shahpura", fraud_risk: "medium" },
    { name: "Koh-e-Fiza Police Station", address: "Koh-e-Fiza, Bhopal - 462001", phone: "+91 755 255 0777", lat: 23.2693, lng: 77.3757, hours: "24x7", base_rating: 4.0, category: "police-station", jurisdiction: "Koh-e-Fiza, Bairagarh", pincode: "462001", area: "Koh-e-Fiza", fraud_risk: "medium" },
    { name: "Govindpura Police Station", address: "Govindpura, Bhopal - 462023", phone: "+91 755 255 0888", lat: 23.2836, lng: 77.4518, hours: "24x7", base_rating: 3.9, category: "police-station", jurisdiction: "Govindpura, Industrial Area", pincode: "462023", area: "Govindpura", fraud_risk: "medium" },
    { name: "Ayodhya Nagar Police Station", address: "Ayodhya Nagar, Bhopal - 462041", phone: "+91 755 255 0999", lat: 23.2508, lng: 77.4571, hours: "24x7", base_rating: 4.1, category: "police-station", jurisdiction: "Ayodhya Nagar, Bagmugaliya", pincode: "462041", area: "Ayodhya Nagar", fraud_risk: "low" },
    { name: "Ashoka Garden Police Station", address: "Ashoka Garden, Bhopal - 462023", phone: "+91 755 255 1010", lat: 23.2581, lng: 77.3846, hours: "24x7", base_rating: 4.0, category: "police-station", jurisdiction: "Ashoka Garden, Indira Nagar", pincode: "462023", area: "Ashoka Garden", fraud_risk: "high" },
    { name: "Arera Hills Police Station", address: "Arera Hills, Bhopal - 462011", phone: "+91 755 255 1111", lat: 23.2404, lng: 77.4227, hours: "24x7", base_rating: 4.3, category: "police-station", jurisdiction: "Arera Hills, Shyamla Hills", pincode: "462011", area: "Arera Hills", fraud_risk: "low" },
    { name: "Shymala Hills Police Station", address: "Shymala Hills, Bhopal - 462002", phone: "+91 755 255 1212", lat: 23.2444, lng: 77.4049, hours: "24x7", base_rating: 4.2, category: "police-station", jurisdiction: "Shymala Hills, Bharat Nagar", pincode: "462002", area: "Shymala Hills", fraud_risk: "medium" },
    { name: "Bag Sevania Police Station", address: "Bag Sevania, Bhopal - 462043", phone: "+91 755 255 1313", lat: 23.1662, lng: 77.3758, hours: "24x7", base_rating: 3.8, category: "police-station", jurisdiction: "Bag Sevania, Barkheda", pincode: "462043", area: "Bag Sevania", fraud_risk: "low" },
    { name: "Shahjahanabad Police Station", address: "Shahjahanabad, Bhopal - 462016", phone: "+91 755 255 1414", lat: 23.2891, lng: 77.3587, hours: "24x7", base_rating: 3.9, category: "police-station", jurisdiction: "Shahjahanabad, Ratibad", pincode: "462016", area: "Shahjahanabad", fraud_risk: "medium" },
    { name: "Mangalwara Police Station", address: "Mangalwara, Bhopal - 462001", phone: "+91 755 255 1515", lat: 23.2709, lng: 77.3984, hours: "24x7", base_rating: 4.0, category: "police-station", jurisdiction: "Mangalwara, Old City, Ginnori", pincode: "462001", area: "Mangalwara", fraud_risk: "high" },
    { name: "Bhopal Cyber Crime Cell", address: "Police Headquarters, TT Nagar, Bhopal - 462003", phone: "+91 755 255 1930", lat: 23.2380, lng: 77.4060, hours: "24x7", base_rating: 4.5, category: "cyber-cell", jurisdiction: "Entire Bhopal District", pincode: "462003", area: "TT Nagar", fraud_risk: "high" },
    { name: "Women Help Desk - Bhopal", address: "Mahila Thana, TT Nagar, Bhopal - 462003", phone: "+91 755 255 1090", lat: 23.2405, lng: 77.4055, hours: "24x7", base_rating: 4.4, category: "women-help-desk", jurisdiction: "Entire Bhopal District", pincode: "462003", area: "TT Nagar", fraud_risk: "medium" },
    { name: "Bhopal Traffic Police HQ", address: "Traffic Police Headquarters, Mata Mandir, Bhopal - 462001", phone: "+91 755 255 1000", lat: 23.2646, lng: 77.4010, hours: "6:00 AM - 12:00 AM", base_rating: 3.8, category: "traffic-police", jurisdiction: "Entire Bhopal City", pincode: "462001", area: "Mata Mandir", fraud_risk: "low" },
  ];

  for (const s of stations) {
    await db`
      INSERT INTO police_stations ${db(s)}
      ON CONFLICT DO NOTHING
    `;
  }
  console.log("[DB] Seeded ${stations.length} police stations");
}
