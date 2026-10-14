import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function CentralizarMapa({ coordenadas }) {
  const mapa = useMap();
  useEffect(() => {
    if (coordenadas) mapa.flyTo(coordenadas, 10, { duration: 1.2 });
  }, [coordenadas, mapa]);
  return null;
}

function Mapa({ coordenadas, nomeLocal = "Localização selecionada" }) {
  if (!coordenadas) return <div className="mapa-vazio">Pesquise uma localidade para visualizar o mapa.</div>;

  return (
    <div className="mapa-conteiner">
      <MapContainer center={coordenadas} zoom={10} className="mapa-interativo" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordenadas}><Popup><strong>{nomeLocal}</strong><br />{coordenadas[0].toFixed(4)}, {coordenadas[1].toFixed(4)}</Popup></Marker>
        <CentralizarMapa coordenadas={coordenadas} />
      </MapContainer>
      <span className="etiqueta-mapa"><span /> Mapa interativo</span>
    </div>
  );
}

export default Mapa;
