// ----------------------------------------------------------------------
// IMPORTANT: To enable the Interactive Map locally:
// 1. Run: npm install leaflet react-leaflet
// 2. Uncomment the imports below
// 3. Uncomment the MapContainer code in the return statement
// 4. Remove the Placeholder div
// ----------------------------------------------------------------------

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export function MapWidget() {
  // Coordinates for Rajkot, Gujarat (Default)
  const position = [22.3039, 70.8022]

  const handleMapWheel = (e) => {
    e.preventDefault()
  }

  return (
    <div onWheel={handleMapWheel} style={{ height: '100%', width: '100%' }}>
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', minHeight: '400px', zIndex: 0 }}
        className="rounded-xl overflow-hidden"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            You are here! <br /> Rajkot, Gujarat.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}