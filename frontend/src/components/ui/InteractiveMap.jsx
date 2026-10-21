import { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { ZoomIn, RotateCcw, AlertCircle } from 'lucide-react'
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
        html: `<div style="background-color: ${color}; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.35);">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                ${type === 'police'
                ? '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'
                : '<path d="M12 6v12m-6-6h12"></path>'
            }
             </svg>
           </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    })
}

const policeIcon = createIcon('#ef4444', 'police') // Red-500
const hospitalIcon = createIcon('#10b981', 'hospital') // Emerald-500
const userIcon = L.divIcon({
    className: 'user-marker-pulse',
    html: `<div style="background-color: #0284c7; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 5px rgba(2, 132, 199, 0.4), 0 4px 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
})

// --- HELPER TO RE-CENTER MAP ---
function RecenterAutomatically({ lat, lng, zoom }) {
    const map = useMap()
    useEffect(() => {
        if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) {
            map.flyTo([lat, lng], zoom || map.getZoom(), {
                duration: 1.2,
                easeLinearity: 0.25
            })
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
        <div className="relative h-96 w-full overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-md [&_.leaflet-tile-pane]:dark:invert-[.92] [&_.leaflet-tile-pane]:dark:hue-rotate-180 [&_.leaflet-tile-pane]:dark:contrast-80">
            <MapContainer
                center={[lat, lng]}
                zoom={zoom}
                style={{ height: '100%', width: '100%', background: '#090d16' }}
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
                    <Popup className="rounded-xl overflow-hidden font-sans">
                        <div className="font-semibold text-sky-800 text-xs py-0.5">Your Current Location</div>
                    </Popup>
                </Marker>

                {/* SAFE ZONES MARKERS */}
                {Array.isArray(safeZones) && safeZones.map(zone => (
                    <Marker
                        key={zone.id}
                        position={[zone.lat, zone.lng]}
                        icon={zone.type === 'police' ? policeIcon : hospitalIcon}
                    >
                        <Popup className="rounded-xl overflow-hidden font-sans">
                            <div className="text-xs">
                                <strong className={`block mb-1 font-bold ${zone.type === 'police' ? 'text-rose-600' : 'text-emerald-600'}`}>
                                    {zone.type === 'police' ? '👮 Police Station' : '🏥 Hospital'}
                                </strong>
                                <span className="text-slate-700 font-medium">{zone.name}</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* FLOATING CONTROLS BAR */}
            <div className="absolute top-4 left-14 z-[400] flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setScrollZoomEnabled(prev => !prev)}
                    title={scrollZoomEnabled ? "Scroll wheel zoom is active. Click to lock." : "Click to enable zoom with mouse scroll wheel"}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 border backdrop-blur-md cursor-pointer ${
                        scrollZoomEnabled
                            ? 'bg-sky-600/90 text-white border-sky-400/50 shadow-sky-600/30'
                            : 'bg-white/85 dark:bg-slate-900/85 text-slate-700 dark:text-slate-300 border-white/40 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-900'
                    }`}
                >
                    <ZoomIn className="h-3.5 w-3.5" />
                    <span>Scroll Zoom: {scrollZoomEnabled ? 'On' : 'Off'}</span>
                </button>
            </div>

            {/* ERROR BANNER WITH RETRY */}
            {error && (
                <div className="absolute top-16 left-4 right-4 z-[400] bg-rose-600/90 text-white px-3.5 py-2 rounded-xl text-xs flex items-center justify-between shadow-xl backdrop-blur-md border border-rose-400/30 animate-in fade-in">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                    <button
                        type="button"
                        onClick={fetchSafeZones}
                        className="px-2.5 py-1 bg-white text-rose-600 font-bold rounded-lg hover:bg-rose-50 text-[11px] transition-colors shrink-0 ml-2 shadow-xs cursor-pointer flex items-center gap-1"
                    >
                        <RotateCcw className="h-3 w-3" /> Retry
                    </button>
                </div>
            )}

            {/* OVERLAY LOADING BADGE */}
            {loading && (
                <div className="absolute top-4 right-4 z-[400] bg-white/85 dark:bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 shadow-md border border-white/30 dark:border-slate-700/60 flex items-center gap-2 animate-in fade-in">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
                    <span>Locating safe zones...</span>
                </div>
            )}

            {/* REFINED LEGEND */}
            <div className="absolute bottom-4 left-4 z-[400] bg-white/85 dark:bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 shadow-lg border border-white/30 dark:border-slate-700/60 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500 border border-white dark:border-slate-900 shadow-xs" />
                    <span className="text-[11px] font-semibold">Police</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900 shadow-xs" />
                    <span className="text-[11px] font-semibold">Hospital</span>
                </div>
            </div>
        </div>
    )
}
