import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

export default function EarthquakeMap() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
        );
        const data = await res.json();
        setEarthquakes(data.features || []);
      } catch (err) {
        setError("Failed to load earthquake data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-6 text-gray-600">Loading map...</p>;
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;

  return (
    <div className="w-full h-[80vh] rounded-lg overflow-hidden shadow-lg mt-4">
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors'
        />
        {earthquakes.map((eq) => {
          const [lon, lat] = eq.geometry.coordinates;
          const mag = eq.properties.mag;
          return (
            <CircleMarker
              key={eq.id}
              center={[lat, lon]}
              radius={Math.max(3, mag * 2)}
              pathOptions={{
                color: mag > 5 ? "red" : mag > 3 ? "orange" : "green",
                fillOpacity: 0.6,
              }}
            >
              <Popup>
                <strong>{eq.properties.place}</strong>
                <br />
                Magnitude: {mag}
                <br />
                Time: {new Date(eq.properties.time).toLocaleString()}
                <br />
                <a
                  href={eq.properties.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  More Info
                </a>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
