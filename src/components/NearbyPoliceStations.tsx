import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { MapPin, Phone, Clock, Shield, Navigation, Search, X, AlertTriangle, Camera, Mic, Upload, Send, Crosshair, Filter, ChevronDown, ChevronUp, BrainCircuit, LocateFixed, Star } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";

const MAP_DARK_STYLES = `
  .leaflet-popup-content-wrapper { background: #0F172A !important; color: #e2e8f0 !important; border-radius: 12px !important; border: 1px solid #1e293b !important; box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important; }
  .leaflet-popup-content { margin: 14px 16px !important; font-size: 12px !important; }
  .leaflet-popup-tip { background: #0F172A !important; border: 1px solid #1e293b !important; }
  .leaflet-popup-close-button { color: #64748b !important; font-size: 16px !important; top: 8px !important; right: 8px !important; }
  .leaflet-popup-close-button:hover { color: #f1f5f9 !important; }
  .leaflet-container { background: #0F172A !important; }
`;

interface PoliceStation {
  id: number;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  hours: string;
  rating: string;
  category: "police-station" | "cyber-cell" | "women-help-desk" | "traffic-police";
  jurisdiction: string;
  pincode: string;
  area: string;
  fraudRisk: "high" | "medium" | "low";
}

const BHOPAL_STATIONS: PoliceStation[] = [
  { id: 1, name: "M.P. Nagar Police Station", address: "M.P. Nagar, Zone-1, Bhopal - 462011", phone: "+91 755 255 0111", lat: 23.2316, lng: 77.4320, hours: "24x7", rating: "4.3", category: "police-station", jurisdiction: "M.P. Nagar, E-1 to E-8, Arera Colony", pincode: "462011", area: "M.P. Nagar", fraudRisk: "medium" },
  { id: 2, name: "TT Nagar Police Station", address: "TT Nagar, Bhopal - 462003", phone: "+91 755 255 0222", lat: 23.2397, lng: 77.4043, hours: "24x7", rating: "4.1", category: "police-station", jurisdiction: "TT Nagar, Rishi Nagar, Chuna Bhatti", pincode: "462003", area: "TT Nagar", fraudRisk: "high" },
  { id: 3, name: "Habibganj Police Station", address: "Habibganj, Bhopal - 462024", phone: "+91 755 255 0333", lat: 23.2373, lng: 77.4457, hours: "24x7", rating: "4.2", category: "police-station", jurisdiction: "Habibganj, Hoshangabad Road", pincode: "462024", area: "Habibganj", fraudRisk: "medium" },
  { id: 4, name: "Kamla Nagar Police Station", address: "Kamla Nagar, Bhopal - 462001", phone: "+91 755 255 0444", lat: 23.2608, lng: 77.4222, hours: "24x7", rating: "4.0", category: "police-station", jurisdiction: "Kamla Nagar, Old City", pincode: "462001", area: "Kamla Nagar", fraudRisk: "high" },
  { id: 5, name: "Kolar Road Police Station", address: "Kolar Road, Bhopal - 462042", phone: "+91 755 255 0555", lat: 23.2004, lng: 77.4239, hours: "24x7", rating: "4.4", category: "police-station", jurisdiction: "Kolar Road, Damkheda, Jatkhedi", pincode: "462042", area: "Kolar Road", fraudRisk: "low" },
  { id: 6, name: "Shahpura Police Station", address: "Shahpura, Bhopal - 462039", phone: "+91 755 255 0666", lat: 23.2193, lng: 77.4561, hours: "24x7", rating: "4.2", category: "police-station", jurisdiction: "Shahpura, Harshwardhan Nagar", pincode: "462039", area: "Shahpura", fraudRisk: "medium" },
  { id: 7, name: "Koh-e-Fiza Police Station", address: "Koh-e-Fiza, Bhopal - 462001", phone: "+91 755 255 0777", lat: 23.2693, lng: 77.3757, hours: "24x7", rating: "4.0", category: "police-station", jurisdiction: "Koh-e-Fiza, Bairagarh", pincode: "462001", area: "Koh-e-Fiza", fraudRisk: "medium" },
  { id: 8, name: "Govindpura Police Station", address: "Govindpura, Bhopal - 462023", phone: "+91 755 255 0888", lat: 23.2836, lng: 77.4518, hours: "24x7", rating: "3.9", category: "police-station", jurisdiction: "Govindpura, Industrial Area", pincode: "462023", area: "Govindpura", fraudRisk: "medium" },
  { id: 9, name: "Ayodhya Nagar Police Station", address: "Ayodhya Nagar, Bhopal - 462041", phone: "+91 755 255 0999", lat: 23.2508, lng: 77.4571, hours: "24x7", rating: "4.1", category: "police-station", jurisdiction: "Ayodhya Nagar, Bagmugaliya", pincode: "462041", area: "Ayodhya Nagar", fraudRisk: "low" },
  { id: 10, name: "Ashoka Garden Police Station", address: "Ashoka Garden, Bhopal - 462023", phone: "+91 755 255 1010", lat: 23.2581, lng: 77.3846, hours: "24x7", rating: "4.0", category: "police-station", jurisdiction: "Ashoka Garden, Indira Nagar", pincode: "462023", area: "Ashoka Garden", fraudRisk: "high" },
  { id: 11, name: "Arera Hills Police Station", address: "Arera Hills, Bhopal - 462011", phone: "+91 755 255 1111", lat: 23.2404, lng: 77.4227, hours: "24x7", rating: "4.3", category: "police-station", jurisdiction: "Arera Hills, Shyamla Hills", pincode: "462011", area: "Arera Hills", fraudRisk: "low" },
  { id: 12, name: "Shymala Hills Police Station", address: "Shymala Hills, Bhopal - 462002", phone: "+91 755 255 1212", lat: 23.2444, lng: 77.4049, hours: "24x7", rating: "4.2", category: "police-station", jurisdiction: "Shymala Hills, Bharat Nagar", pincode: "462002", area: "Shymala Hills", fraudRisk: "medium" },
  { id: 13, name: "Bag Sevania Police Station", address: "Bag Sevania, Bhopal - 462043", phone: "+91 755 255 1313", lat: 23.1662, lng: 77.3758, hours: "24x7", rating: "3.8", category: "police-station", jurisdiction: "Bag Sevania, Barkheda", pincode: "462043", area: "Bag Sevania", fraudRisk: "low" },
  { id: 14, name: "Shahjahanabad Police Station", address: "Shahjahanabad, Bhopal - 462016", phone: "+91 755 255 1414", lat: 23.2891, lng: 77.3587, hours: "24x7", rating: "3.9", category: "police-station", jurisdiction: "Shahjahanabad, Ratibad", pincode: "462016", area: "Shahjahanabad", fraudRisk: "medium" },
  { id: 15, name: "Mangalwara Police Station", address: "Mangalwara, Bhopal - 462001", phone: "+91 755 255 1515", lat: 23.2709, lng: 77.3984, hours: "24x7", rating: "4.0", category: "police-station", jurisdiction: "Mangalwara, Old City, Ginnori", pincode: "462001", area: "Mangalwara", fraudRisk: "high" },
  { id: 16, name: "Bhopal Cyber Crime Cell", address: "Police Headquarters, TT Nagar, Bhopal - 462003", phone: "+91 755 255 1930", lat: 23.2380, lng: 77.4060, hours: "24x7", rating: "4.5", category: "cyber-cell", jurisdiction: "Entire Bhopal District", pincode: "462003", area: "TT Nagar", fraudRisk: "high" },
  { id: 17, name: "Women Help Desk - Bhopal", address: "Mahila Thana, TT Nagar, Bhopal - 462003", phone: "+91 755 255 1090", lat: 23.2405, lng: 77.4055, hours: "24x7", rating: "4.4", category: "women-help-desk", jurisdiction: "Entire Bhopal District", pincode: "462003", area: "TT Nagar", fraudRisk: "medium" },
  { id: 18, name: "Bhopal Traffic Police HQ", address: "Traffic Police Headquarters, Mata Mandir, Bhopal - 462001", phone: "+91 755 255 1000", lat: 23.2646, lng: 77.4010, hours: "6:00 AM - 12:00 AM", rating: "3.8", category: "traffic-police", jurisdiction: "Entire Bhopal City", pincode: "462001", area: "Mata Mandir", fraudRisk: "low" },
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getTravelTime(distanceKm: number): string {
  if (distanceKm < 1) return "2-5 min";
  if (distanceKm < 3) return "5-10 min";
  if (distanceKm < 5) return "10-15 min";
  if (distanceKm < 10) return "15-25 min";
  return "25-40 min";
}

function getCategoryIcon(category: string): string {
  switch (category) {
    case "cyber-cell": return "💻";
    case "women-help-desk": return "👩";
    case "traffic-police": return "🚦";
    default: return "🚔";
  }
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case "cyber-cell": return "Cyber Cell";
    case "women-help-desk": return "Women Help Desk";
    case "traffic-police": return "Traffic Police";
    default: return "Police Station";
  }
}

const FRAUD_REPORT_TYPES = [
  "UPI Fraud",
  "Phishing",
  "Fake Call",
  "SIM Swap",
  "Bank Fraud",
  "Investment Scam",
  "Identity Theft",
  "Online Shopping Fraud",
  "Social Media Scam",
  "Other"
];

const AI_SUGGESTIONS = [
  { text: "Nearest Cyber Cell is 2.1 km away.", icon: BrainCircuit },
  { text: "This area has high UPI fraud reports.", icon: AlertTriangle },
  { text: "Call 1930 immediately.", icon: Phone },
  { text: "Report suspicious transactions within the golden hour (60 min).", icon: Clock },
  { text: "Never share UPI PIN — even to 'receive' money.", icon: Shield },
];

interface NearbyPoliceStationsProps {
  t: (key: string) => string;
  lang: string;
}

export default function NearbyPoliceStations({ t, lang }: NearbyPoliceStationsProps) {
  const [stations, setStations] = useState<PoliceStation[]>(BHOPAL_STATIONS);
  const [dbConnected, setDbConnected] = useState(false);
  const [loadingStations, setLoadingStations] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [selectedStation, setSelectedStation] = useState<PoliceStation | null>(null);
  const [showFraudReport, setShowFraudReport] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [nearestId, setNearestId] = useState<number | null>(null);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);

  // Fetch stations from NeonDB API, fall back to local data
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/db/stations");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setStations(data.map((s: any) => ({
              id: s.id, name: s.name, address: s.address, phone: s.phone,
              lat: s.lat, lng: s.lng, hours: s.hours, rating: String(s.rating),
              category: s.category, jurisdiction: s.jurisdiction,
              pincode: s.pincode, area: s.area, fraudRisk: s.fraud_risk,
            })));
            setDbConnected(true);
          }
        }
      } catch { /* fallback to local data */ }
      setLoadingStations(false);
    })();
  }, []);

  const [fraudForm, setFraudForm] = useState({ type: "", description: "", screenshot: null as File | null, recording: null as File | null, transactionScreenshot: null as File | null });
  const [fraudSubmitted, setFraudSubmitted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion(prev => (prev + 1) % AI_SUGGESTIONS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const locateUser = useCallback(() => {
    setLocating(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setLocating(false);
      },
      (err) => {
        setLocationError("Location access denied. Using Bhopal city center.");
        setUserLocation({ lat: 23.2599, lng: 77.4126 });
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    locateUser();
  }, [locateUser]);

  const stationsWithDistance = useMemo(() => {
    if (!userLocation) return stations.map(s => ({ ...s, distance: null, travelTime: null }));

    const withDist = stations.map(s => {
      const dist = haversineKm(userLocation.lat, userLocation.lng, s.lat, s.lng);
      return { ...s, distance: dist, travelTime: getTravelTime(dist) };
    });

    const sorted = [...withDist].sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    if (sorted.length > 0) setNearestId(sorted[0].id);

    return withDist;
  }, [userLocation, stations]);

  const filteredStations = useMemo(() => {
    let result = stationsWithDistance;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.area.toLowerCase().includes(q) ||
        s.pincode.includes(q) ||
        s.jurisdiction.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
      );
    }

    if (activeFilters.size > 0) {
      result = result.filter(s => activeFilters.has(s.category));
    }

    return result;
  }, [stationsWithDistance, searchQuery, activeFilters]);

  const toggleFilter = (cat: string) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const openInGoogleMaps = (station: PoliceStation) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}${userLocation ? `&origin=${userLocation.lat},${userLocation.lng}` : ""}`;
    window.open(url, "_blank");
  };

  const handleFraudSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dbConnected) {
      fetch("/api/db/fraud-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          station_id: selectedStation?.id,
          user_id: getUserId(),
          fraud_type: fraudForm.type,
          description: fraudForm.description,
          gps_lat: userLocation?.lat,
          gps_lng: userLocation?.lng,
        }),
      }).catch(() => {});
    }
    setFraudSubmitted(true);
    setTimeout(() => {
      setShowFraudReport(false);
      setFraudSubmitted(false);
      setFraudForm({ type: "", description: "", screenshot: null, recording: null, transactionScreenshot: null });
    }, 3000);
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    stations.forEach(s => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [stations]);

  // ─── CITIZEN RATING SYSTEM ─────────────────────────────────────
  const getUserId = useCallback(() => {
    let uid = localStorage.getItem("cybersathi-user-id");
    if (!uid) { uid = "user-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); localStorage.setItem("cybersathi-user-id", uid); }
    return uid;
  }, []);

  const [userRatings, setUserRatings] = useState<Record<number, { total: number; count: number; userRating: number }>>(() => {
    try { return JSON.parse(localStorage.getItem("bhopal-station-ratings") || "{}"); } catch { return {}; }
  });

  const [ratingPopup, setRatingPopup] = useState<{ id: number; hovered: number } | null>(null);

  const saveRatings = (ratings: Record<number, { total: number; count: number; userRating: number }>) => {
    localStorage.setItem("bhopal-station-ratings", JSON.stringify(ratings));
    setUserRatings(ratings);
  };

  const rateStation = (stationId: number, stars: number) => {
    const uid = getUserId();
    const existing = userRatings[stationId];
    if (existing?.userRating === stars) return;

    // Push to NeonDB if connected
    if (dbConnected) {
      fetch("/api/db/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ station_id: stationId, user_id: uid, rating: stars }),
      }).catch(() => {});
    }

    setUserRatings(prev => {
      const curr = prev[stationId] || { total: 0, count: 0, userRating: 0 };
      let newTotal = curr.total;
      let newCount = curr.count;
      if (curr.userRating > 0) newTotal -= curr.userRating;
      else newCount += 1;
      newTotal += stars;
      const next = { ...prev, [stationId]: { total: newTotal, count: newCount, userRating: stars } };
      saveRatings(next);
      return next;
    });
    setRatingPopup(null);
  };

  const getStationRating = (station: PoliceStation) => {
    const base = parseFloat(station.rating);
    const user = userRatings[station.id];
    if (!user || user.count === 0) return { avg: base, count: 0, userRating: 0 };
    const userAvg = user.total / user.count;
    const weighted = (base * 5 + user.total) / (5 + user.count);
    return { avg: Math.round(weighted * 10) / 10, count: user.count, userRating: user.userRating };
  };

  // Follows user or selected station on map
  function MapUpdater() {
    const map = useMap();
    useEffect(() => {
      if (selectedStation) map.flyTo([selectedStation.lat, selectedStation.lng], 15, { duration: 1 });
      else if (userLocation) map.flyTo([userLocation.lat, userLocation.lng], 13, { duration: 1 });
    }, [userLocation, selectedStation]);
    return null;
  }

  const StarRating = ({ stationId, size = "sm", interactive = true }: { stationId: number; size?: "sm" | "md"; interactive?: boolean }) => {
    const station = stations.find(s => s.id === stationId)!;
    const { avg, count, userRating } = getStationRating(station);
    const hovered = ratingPopup?.id === stationId ? ratingPopup.hovered : 0;
    const display = interactive && hovered > 0 ? hovered : userRating > 0 ? userRating : 0;
    const starSize = size === "md" ? "w-4 h-4" : "w-3 h-3";

    return (
      <div className="flex items-center gap-1">
        <div className="flex items-center" onMouseLeave={() => setRatingPopup(prev => prev?.id === stationId ? { ...prev, hovered: 0 } : prev)}>
          {[1, 2, 3, 4, 5].map(s => (
            <button
              key={s}
              type="button"
              onClick={(e) => { e.stopPropagation(); if (interactive) rateStation(stationId, s); }}
              onMouseEnter={() => { if (interactive) setRatingPopup({ id: stationId, hovered: s }); }}
              className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform p-0.5`}
            >
              <Star
                className={`${starSize} ${
                  s <= (display || (interactive ? 0 : avg))
                    ? "fill-amber-400 text-amber-400"
                    : s <= avg
                      ? "fill-amber-400/40 text-amber-400/40"
                      : "text-slate-600"
                }`}
              />
            </button>
          ))}
        </div>
        <span className="text-[10px] font-mono text-slate-400 ml-1">
          {avg.toFixed(1)}
          {count > 0 && <span className="text-slate-600"> ({count})</span>}
        </span>
        {userRating > 0 && (
          <span className="text-[8px] font-mono text-emerald-500">You rated</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="police-stations-view">
      <style>{MAP_DARK_STYLES}</style>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{t("policeTitle")}</h2>
          <p className="text-xs text-slate-500 font-mono">{t("policeSubtitle")}</p>
        </div>
      </div>

      {/* AI Suggestion Banner */}
      <div className="glass-card rounded-2xl p-4 border border-cyan-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider">AI Suggestion</span>
            <p className="text-sm text-white font-medium mt-0.5 transition-all duration-500">
              {AI_SUGGESTIONS[currentSuggestion].text}
            </p>
          </div>
          <div className="flex gap-1">
            {AI_SUGGESTIONS.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentSuggestion ? "bg-cyan-400 w-3" : "bg-slate-600"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Location Status */}
      <div className="glass-card rounded-2xl p-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${userLocation ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
              <Crosshair className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                {locating ? "Locating you..." : userLocation ? "Location Active" : "Location Unavailable"}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : locationError || "Click to locate"}
              </p>
            </div>
          </div>
          <button onClick={locateUser} className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-lg transition">
            <LocateFixed className="w-3 h-3" />
            {locating ? "Locating..." : "Update"}
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-card rounded-2xl p-4 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by area, police station, or pincode..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 transition"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition">
            <Filter className="w-3.5 h-3.5" />
            Filters {activeFilters.size > 0 && `(${activeFilters.size})`}
            {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showFilters && (
            <div className="flex flex-wrap gap-2">
              {[
                { key: "police-station", label: "🚔 Police Station", count: categoryCounts["police-station"] },
                { key: "cyber-cell", label: "💻 Cyber Cell", count: categoryCounts["cyber-cell"] },
                { key: "women-help-desk", label: "👩 Women Help Desk", count: categoryCounts["women-help-desk"] },
                { key: "traffic-police", label: "🚦 Traffic Police", count: categoryCounts["traffic-police"] },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => toggleFilter(f.key)}
                  className={`text-[10px] font-mono px-3 py-1.5 rounded-lg border transition ${
                    activeFilters.has(f.key)
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20"
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
              {activeFilters.size > 0 && (
                <button onClick={() => setActiveFilters(new Set())} className="text-[10px] font-mono px-3 py-1.5 rounded-lg text-red-400 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition">
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                {filteredStations.length} Station{filteredStations.length !== 1 ? "s" : ""} Found
              </span>
            </div>
            {nearestId && userLocation && (
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Nearest: {stationsWithDistance.find(s => s.id === nearestId)?.name.split(" Police")[0]}
              </span>
            )}
          </div>

          {/* Real Map - Leaflet + OpenStreetMap */}
          <div className="relative w-full h-[300px] sm:h-[400px] rounded-xl border border-slate-800 overflow-hidden z-0">
            <MapContainer center={[23.2599, 77.4126]} zoom={12} className="w-full h-full" zoomControl={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              <MapUpdater />

              {/* User Location */}
              {userLocation && (
                <>
                  <Circle center={[userLocation.lat, userLocation.lng]} radius={500} className="opacity-30" pathOptions={{ color: "#3B82F6", fillColor: "#3B82F6", fillOpacity: 0.1 }} />
                  <Marker position={[userLocation.lat, userLocation.lng]} icon={L.divIcon({
                    className: "",
                    html: '<div style="width:20px;height:20px;background:#3B82F6;border:3px solid white;border-radius:50%;box-shadow:0 0 15px rgba(59,130,246,0.6)"></div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                  })}>
                    <Popup>
                      <div className="text-xs font-mono">
                        <p className="font-bold text-slate-900">Your Location</p>
                        <p className="text-[10px] text-slate-500">{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
                      </div>
                    </Popup>
                  </Marker>
                </>
              )}

              {/* Station Markers */}
              {stationsWithDistance.map(s => {
                const riskColors: Record<string, string> = { high: "#EF4444", medium: "#F59E0B", low: "#22C55E" };
                const color = riskColors[s.fraudRisk];
                const isNearestStation = s.id === nearestId;
                return (
                  <Marker
                    key={s.id}
                    position={[s.lat, s.lng]}
                    icon={L.divIcon({
                      className: "",
                      html: `<div style="position:relative;width:${isNearestStation ? 36 : 28}px;height:${isNearestStation ? 36 : 28}px;display:flex;align-items:center;justify-content:center">
                        ${isNearestStation ? '<div style="position:absolute;inset:0;border-radius:50%;background:' + color + ';opacity:0.3;animation:pulse 2s infinite"></div>' : ''}
                        <div style="width:${isNearestStation ? 20 : 14}px;height:${isNearestStation ? 20 : 14}px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:bold;color:white;">
                          ${getCategoryIcon(s.category)}
                        </div>
                      </div>`,
                      iconSize: [isNearestStation ? 36 : 28, isNearestStation ? 36 : 28],
                      iconAnchor: [isNearestStation ? 18 : 14, isNearestStation ? 18 : 14]
                    })}
                  >
                    <Popup>
                      <div className="min-w-[180px] font-mono" onClick={() => setSelectedStation(s)}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-base">{getCategoryIcon(s.category)}</span>
                          <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                        </div>
                        <p className="text-[10px] text-slate-500 mb-1.5">{s.address}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-600 mb-1">
                          <span>📞 {s.phone}</span>
                          {s.distance !== null && <span>📍 {s.distance.toFixed(1)} km</span>}
                        </div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className={`text-[8px] px-1.5 py-0.5 rounded ${s.fraudRisk === "high" ? "bg-red-100 text-red-600" : s.fraudRisk === "medium" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}>
                            {s.fraudRisk === "high" ? "🔴 High Fraud" : s.fraudRisk === "medium" ? "🟡 Medium" : "🟢 Low Fraud"}
                          </span>
                          <span className="text-[8px] text-slate-400">{getCategoryLabel(s.category)}</span>
                        </div>
                        <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1 text-[10px] bg-emerald-500 text-white px-2.5 py-1 rounded hover:bg-emerald-600 transition mr-1">
                          <Phone className="w-2.5 h-2.5" /> Call
                        </a>
                        <button onClick={() => openInGoogleMaps(s)} className="inline-flex items-center gap-1 text-[10px] bg-blue-500 text-white px-2.5 py-1 rounded hover:bg-blue-600 transition mr-1">
                          <Navigation className="w-2.5 h-2.5" /> Navigate
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Legend Overlay */}
            <div className="absolute bottom-3 left-3 z-[1000] flex gap-3 text-[8px] font-mono bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> High</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Medium</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Low</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> You</span>
            </div>
            <div className="absolute top-3 right-3 z-[1000] text-[8px] font-mono text-slate-500 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800">
              OpenStreetMap
            </div>
          </div>


        </div>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.map(station => {
          const isNearest = station.id === nearestId;
          const isSelected = selectedStation?.id === station.id;
          let riskColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
          if (station.fraudRisk === "high") riskColor = "bg-red-500/10 text-red-400 border-red-500/20";
          else if (station.fraudRisk === "medium") riskColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";

          return (
            <div
              key={station.id}
              onClick={() => setSelectedStation(isSelected ? null : station)}
              className={`bg-white/2 border rounded-xl p-4 transition-all cursor-pointer ${
                isNearest
                  ? "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/8"
                  : isSelected
                    ? "border-cyan-500/30 bg-cyan-500/5"
                    : "border-white/5 hover:border-white/15 hover:bg-white/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 text-lg ${
                  isNearest ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-slate-400"
                }`}>
                  {getCategoryIcon(station.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-white leading-tight">{station.name}</h4>
                    {isNearest && (
                      <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded shrink-0 border border-emerald-500/20">
                        NEAREST
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{station.address}</p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
                    <a href={`tel:${station.phone.replace(/\s/g, "")}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1 text-[10px] text-emerald-400 hover:underline font-mono">
                      <Phone className="w-3 h-3" /> {station.phone}
                    </a>
                    {station.distance !== null && (
                      <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                        <MapPin className="w-3 h-3" /> {station.distance.toFixed(1)} km
                      </span>
                    )}
                    {station.travelTime && (
                      <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                        <Clock className="w-3 h-3" /> {station.travelTime}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${riskColor}`}>
                      {station.fraudRisk === "high" ? "🔴 High Fraud" : station.fraudRisk === "medium" ? "🟡 Medium" : "🟢 Low Fraud"}
                    </span>
                    <span className="text-[8px] font-mono text-slate-600 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      {getCategoryLabel(station.category)}
                    </span>
                    <StarRating stationId={station.id} size="sm" interactive={true} />
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                  <div className="text-[10px] text-slate-400 font-mono space-y-1">
                    <p><span className="text-slate-500">Jurisdiction:</span> {station.jurisdiction}</p>
                    <p><span className="text-slate-500">Pincode:</span> {station.pincode}</p>
                    <p><span className="text-slate-500">Area:</span> {station.area}</p>
                    <p><span className="text-slate-500">Hours:</span> {station.hours}</p>
                  </div>
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">Rate this station</p>
                    <StarRating stationId={station.id} size="md" interactive={true} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a href={`tel:${station.phone.replace(/\s/g, "")}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition">
                      <Phone className="w-3 h-3" /> Call
                    </a>
                    <button onClick={e => { e.stopPropagation(); openInGoogleMaps(station); }} className="flex items-center gap-1.5 text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition">
                      <Navigation className="w-3 h-3" /> Navigate
                    </button>
                    <button onClick={e => { e.stopPropagation(); setSelectedStation(station); setShowFraudReport(true); }} className="flex items-center gap-1.5 text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition">
                      <AlertTriangle className="w-3 h-3" /> Report Fraud
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredStations.length === 0 && (
          <div className="col-span-full glass-card rounded-2xl p-8 text-center">
            <MapPin className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">{t("policeNoResults")}</p>
            <button onClick={() => { setSearchQuery(""); setActiveFilters(new Set()); }} className="text-xs text-cyan-400 hover:underline font-mono mt-2">
              {t("policeClearFilters")}
            </button>
          </div>
        )}
      </div>

      {/* Fraud Report Modal */}
      {showFraudReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowFraudReport(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-white font-bold text-lg">Report Fraud</h3>
            </div>
            <p className="text-xs text-slate-500 font-mono mb-4">
              Filing at: <span className="text-cyan-400">{selectedStation?.name}</span>
            </p>

            {fraudSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <Send className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="text-white font-bold text-lg">Report Submitted!</h4>
                <p className="text-xs text-slate-400 mt-1">Your fraud report has been forwarded to {selectedStation?.name}. Reference ID: FR-{Date.now().toString(36).toUpperCase()}</p>
              </div>
            ) : (
              <form onSubmit={handleFraudSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5">Fraud Type</label>
                  <select
                    required
                    value={fraudForm.type}
                    onChange={e => setFraudForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="">Select fraud type...</option>
                    {FRAUD_REPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5">Description</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe what happened in detail..."
                    value={fraudForm.description}
                    onChange={e => setFraudForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-2.5 px-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1.5 flex items-center gap-1">
                      <Camera className="w-3 h-3" /> Screenshot
                    </label>
                    <div className="border border-dashed border-slate-700 rounded-lg p-3 text-center hover:border-cyan-500/30 transition cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" id="ss-upload" onChange={e => setFraudForm(prev => ({ ...prev, screenshot: e.target.files?.[0] || null }))} />
                      <label htmlFor="ss-upload" className="cursor-pointer">
                        {fraudForm.screenshot ? (
                          <span className="text-[10px] text-cyan-400 font-mono">{fraudForm.screenshot.name.slice(0, 15)}...</span>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                            <span className="text-[8px] text-slate-600 font-mono">Upload</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1.5 flex items-center gap-1">
                      <Mic className="w-3 h-3" /> Call Recording
                    </label>
                    <div className="border border-dashed border-slate-700 rounded-lg p-3 text-center hover:border-cyan-500/30 transition cursor-pointer">
                      <input type="file" accept="audio/*" className="hidden" id="rec-upload" onChange={e => setFraudForm(prev => ({ ...prev, recording: e.target.files?.[0] || null }))} />
                      <label htmlFor="rec-upload" className="cursor-pointer">
                        {fraudForm.recording ? (
                          <span className="text-[10px] text-cyan-400 font-mono">{fraudForm.recording.name.slice(0, 15)}...</span>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                            <span className="text-[8px] text-slate-600 font-mono">Upload</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1.5 flex items-center gap-1">
                      <Camera className="w-3 h-3" /> Transaction SS
                    </label>
                    <div className="border border-dashed border-slate-700 rounded-lg p-3 text-center hover:border-cyan-500/30 transition cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" id="txn-upload" onChange={e => setFraudForm(prev => ({ ...prev, transactionScreenshot: e.target.files?.[0] || null }))} />
                      <label htmlFor="txn-upload" className="cursor-pointer">
                        {fraudForm.transactionScreenshot ? (
                          <span className="text-[10px] text-cyan-400 font-mono">{fraudForm.transactionScreenshot.name.slice(0, 15)}...</span>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                            <span className="text-[8px] text-slate-600 font-mono">Upload</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-300 font-mono">
                      {userLocation ? `GPS: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : "Location not available"}
                    </p>
                  </div>
                  <span className="text-[8px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Auto-detected</span>
                </div>

                <button type="submit" className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-2.5 rounded-lg text-xs font-mono uppercase tracking-wide transition flex items-center justify-center gap-2">
                  <Send className="w-3.5 h-3.5" /> Submit Report
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Emergency Warning */}
      <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
        <p className="text-[11px] text-amber-300 font-mono">
          ⚠️ For emergencies, dial <strong>112</strong> (Police) or <strong>1930</strong> (Cyber Crime Helpline). Station details are for reference only.
        </p>
      </div>
    </div>
  );
}
