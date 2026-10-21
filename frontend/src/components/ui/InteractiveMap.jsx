import { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Shield, Hospital, MapPin, Navigation, ZoomIn } from 'lucide-react'
import api from '../../shared/services/api'

const CACHE_KEY = 'traveldost_safezones_cache'
const CACHE_RADIUS_KM = 2
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

const getCachedData = (lat, lng) => {
    try {
        const cached = sessionStorage.getItem(CACHE_KEY)
        if (!cached) return null

        const cacheData = JSON.parse(cached)
        const { lat: cachedLat, lng: cachedLng, data, timestamp } = cacheData

        const distance = calculateDistance(lat, lng, cachedLat, cachedLng)
        const age = Date.now() - timestamp

        if (distance <= CACHE_RADIUS_KM && age < CACHE_MAX_AGE_MS) {
            return data
        }
    } catch (err) {
        console.error('Cache read error:', err)
    }
    return null
}

const setCachedData = (lat, lng, data) => {
    try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            lat,
            lng,
            data,
            timestamp: Date.now()
        }))
    } catch (err) {
        console.error('Cache write error:', err)
    }
}

// --- CUSTOM ICONS ---
const createIcon = (color, type) => {
    return L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-color: ${color}; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${type === 'police'
                ? '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'
                : type === 'hospital'
                    ? '<path d="M12 6v12m-6-6h12"></path>'
                    : '<circle cx="12" cy="12" r="3"></circle>'
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
function RecenterAutomatically({ lat, lng, zoom }) {
    const map = useMap()
    useEffect(() => {
        if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) {
            map.flyTo([lat, lng], zoom || map.getZoom())
        }
    }, [lat, lng, zoom, map])
    return null
}

// --- HELPER TO TOGGLE SCROLL WHEEL ZOOM WITH USER INTENT ---
function WheelZoomController({ enabled }) {
    const map = useMap()
    useEffect(() => {
        if (!map || !map.scrollWheelZoom) return
        if (enabled) {
            map.scrollWheelZoom.enable()
        } else {
            map.scrollWheelZoom.disable()
        }
    }, [enabled, map])
    return null
}

export function InteractiveMap({ lat, lng, zoom = 14 }) {
    const [safeZones, setSafeZones] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [scrollZoomEnabled, setScrollZoomEnabled] = useState(false)

    const fetchSafeZones = useCallback(async () => {
        if (!lat || !lng) return

        const cached = getCachedData(lat, lng)
        if (cached) {
            setSafeZones(cached)
            setError(null)
            return
        }

        setLoading(true)
        setError(null)
        try {
            const res = await api.post('/map/safezones', { lat, lng })
            const data = res.data
            setSafeZones(data)
            setCachedData(lat, lng, data)
        } catch (err) {
            console.error("Failed to fetch safe zones:", err)
            setError("Unable to load nearby emergency safe zones.")
        } finally {
            setLoading(false)
        }
    }, [lat, lng])

    useEffect(() => {
        fetchSafeZones()
    }, [fetchSafeZones])

    return (
        <div className="relative h-96 w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner [&_.leaflet-tile-pane]:dark:invert-[.9] [&_.leaflet-tile-pane]:dark:hue-rotate-180 [&_.leaflet-tile-pane]:dark:contrast-75">
            <MapContainer
                center={[lat, lng]}
                zoom={zoom}
                style={{ height: '100%', width: '100%', background: '#0f172a' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RecenterAutomatically lat={lat} lng={lng} zoom={zoom} />
                <WheelZoomController enabled={scrollZoomEnabled} />

                {/* USER MARKER */}
                <Marker position={[lat, lng]} icon={userIcon}>
                    <Popup>
                        <div className="font-semibold text-sky-700">You are here</div>
                    </Popup>
                </Marker>

                {/* SAFE ZONES MARKERS */}
                {Array.isArray(safeZones) && safeZones.map(zone => (
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

            {/* WHEEL ZOOM CONTROL OVERLAY */}
            <button
                type="button"
                onClick={() => setScrollZoomEnabled(prev => !prev)}
                title={scrollZoomEnabled ? "Scroll wheel zoom is active. Click to lock." : "Click to enable zoom with mouse scroll wheel"}
                className={`absolute top-4 left-14 z-[400] px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 border backdrop-blur ${
                    scrollZoomEnabled
                        ? 'bg-sky-600 text-white border-sky-500 shadow-sky-500/20'
                        : 'bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
            >
                <ZoomIn className="h-3.5 w-3.5" />
                <span>Scroll Zoom: {scrollZoomEnabled ? 'On' : 'Off'}</span>
            </button>

            {/* ERROR BANNER WITH RETRY */}
            {error && (
                <div className="absolute top-16 left-4 right-4 z-[400] bg-red-500/95 text-white px-3 py-2 rounded-xl text-xs flex items-center justify-between shadow-lg backdrop-blur animate-in fade-in">
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={fetchSafeZones}
                        className="px-2.5 py-1 bg-white text-red-600 font-bold rounded-lg hover:bg-red-50 text-[11px] transition-colors shrink-0 ml-2 shadow-xs"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* OVERLAY LOADING INDICATOR */}
            {loading && (
                <div className="absolute top-4 right-4 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm flex items-center gap-2">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-sky-600 dark:border-sky-400 border-t-transparent"></div>
                    Scanning Safe Zones...
                </div>
            )}

            {/* LEGEND */}
            <div className="absolute bottom-4 left-4 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur p-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-red-600 border border-white dark:border-slate-800 shadow-sm"></div>
                    Police
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-600 border border-white dark:border-slate-800 shadow-sm"></div>
                    Hospital
                </div>
            </div>

        </div>
    )
}
