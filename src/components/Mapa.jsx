import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function CentralizarMapa({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      const [lat, lon] = coords;
      map.flyTo([lat, lon], 10, { duration: 1.5 });
    }
  }, [coords, map]);

  return null;
}

function Mapa({ coords }) {
  if (!coords) {
    return (
      <div className="mt-6 p-4 border rounded shadow-md max-w-3xl mx-auto text-center text-gray-600 bg-white">
        Nenhuma localização disponível.
      </div>
    );
  }

  const [lat, lon] = coords;

  return (
    <div className="h-80 w-full mt-6 border rounded max-w-lg shadow-md overflow-hidden">
      <MapContainer 
        center={[lat, lon]} 
        zoom={10} 
        className="h-full w-full" 
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          <Popup>
            Localização aproximada: <br /> Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}
          </Popup>
        </Marker>
        <CentralizarMapa coords={coords} />
      </MapContainer>
    </div>
  );
}

export default Mapa;
