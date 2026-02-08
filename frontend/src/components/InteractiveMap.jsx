import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Shield, Hospital, MapPin, Navigation } from 'lucide-react'

// --- CUSTOM ICONS ---
// We use DivIcon to render Lucide React icons inside Leaflet markers
const createIcon = (color, type) => {
    return L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-color: ${color}; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${type === 'police'
                ? '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>' // Shield
                : type === 'hospital'
                    ? '<path d="M12 6v12m-6-6h12"></path>' // Plus/Cross
                    : '<circle cx="12" cy="12" r="3"></circle>' // Dot
            }
             </svg>
           </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    })
}

const policeIcon = createIcon('#dc2626', 'police') // Red
const hospitalIcon = createIcon('#16a34a', 'hospital') // Green
const userIcon = L.divIcon({
    className: 'user-marker-pulse',
    html: `<div style="background-color: #0284c7; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
})

// --- HELPER TO RE-CENTER MAP ---
function RecenterAutomatically({ lat, lng }) {
    const map = useMap()
    useEffect(() => {
        map.flyTo([lat, lng], map.getZoom())
    }, [lat, lng, map])
    return null
}

export function InteractiveMap({ lat, lng }) {
    const [safeZones, setSafeZones] = useState([])
    const [loading, setLoading] = useState(false)

    // Fetch Safe Zones (Police/Hospitals) from Overpass API
    useEffect(() => {
        if (!lat || !lng) return

        const fetchSafeZones = async () => {
            setLoading(true)
            try {
                // Query: Get nodes, ways, relations (nwr) to find ALL police/hospitals
                // 'out center;' ensures we get coordinates even for buildings (ways)
                const query = `
          [out:json][timeout:25];
          (
            nwr["amenity"="police"](around:5000, ${lat}, ${lng});
            nwr["amenity"="hospital"](around:2000, ${lat}, ${lng});
          );
          out center;
        `
                const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`

                const res = await fetch(url)
                const data = await res.json()

                const zones = data.elements.map(el => {
                    // Handle Nodes (lat/lon) vs Ways/Relations (center.lat/center.lon)
                    const latitude = el.lat || (el.center && el.center.lat);
                    const longitude = el.lon || (el.center && el.center.lon);

                    return {
                        id: el.id,
                        lat: latitude,
                        lng: longitude,
                        type: el.tags.amenity,
                        name: el.tags.name || (el.tags.amenity === 'police' ? 'Unnamed Police Station' : 'Unnamed Hospital')
                    }
                }).filter(z => z.lat && z.lng) // Filter out items without coordinates

                setSafeZones(zones)
            } catch (err) {
                console.error("Failed to fetch safe zones:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchSafeZones()
    }, [lat, lng])

    return (
        <div className="relative h-96 w-full overflow-hidden rounded-2xl border border-slate-200 shadow-inner">
            <MapContainer
                center={[lat, lng]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true} // Enabled per user request
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RecenterAutomatically lat={lat} lng={lng} />

                {/* USER MARKER */}
                <Marker position={[lat, lng]} icon={userIcon}>
                    <Popup>
                        <div className="font-semibold text-sky-700">You are here</div>
                    </Popup>
                </Marker>

                {/* SAFE ZONES MARKERS */}
                {safeZones.map(zone => (
                    <Marker
                        key={zone.id}
                        position={[zone.lat, zone.lng]}
                        icon={zone.type === 'police' ? policeIcon : hospitalIcon}
                    >
                        <Popup>
                            <div className="text-sm">
                                <strong className={`block mb-1 ${zone.type === 'police' ? 'text-red-700' : 'text-green-700'}`}>
                                    {zone.type === 'police' ? '👮 Police Station' : '🏥 Hospital'}
                                </strong>
                                {zone.name}
                            </div>
                        </Popup>
                    </Marker>
                ))}

            </MapContainer>

            {/* OVERLAY LOADING INDICATOR */}
            {loading && (
                <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 shadow-sm flex items-center gap-2">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-sky-600 border-t-transparent"></div>
                    Scanning Safe Zones...
                </div>
            )}

            {/* LEGEND */}
            <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur p-2 rounded-lg text-xs font-medium text-slate-600 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-red-600 border border-white shadow-sm"></div>
                    Police
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-600 border border-white shadow-sm"></div>
                    Hospital
                </div>
            </div>

        </div>
    )
}
