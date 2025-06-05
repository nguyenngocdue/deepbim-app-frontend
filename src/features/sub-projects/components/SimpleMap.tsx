import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Sửa lỗi icon mặc định
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

// Component phụ để hiển thị vị trí người dùng
function UserLocationMarker() {
  const [position, setPosition] = useState<null | [number, number]>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  return position ? (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  ) : null;
}

export function SimpleMap({
  lat = 10.7769,
  lng = 106.7009,
  title = "Project Location",
  name = "Project Location",
  zoom = 17,
  dark = false,
  height = 450,
}: {
  lat?: number;
  lng?: number;
  title?: string;
  name?: string;
  zoom?: number;
  dark?: boolean;
  height?: number;
}) {
  return (
    <div className="rounded-xl overflow-hidden shadow-md border p-2 border-gray-200 dark:border-zinc-800">
      <div className="px-4 pt-4 pb-1">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{name}</p>
      </div>

      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height, width: "100%" }}
        className="rounded-b-xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url={
            dark
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />
        <Marker position={[lat, lng]}>
          <Popup>{name}</Popup>
        </Marker>
        <UserLocationMarker />
      </MapContainer>
    </div>
  );
}
