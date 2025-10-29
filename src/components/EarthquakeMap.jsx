import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function EarthquakeMap() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [minMag, setMinMag] = useState("all"); // 'all' or numeric strings like '2.5'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
        );
        if (!res.ok) throw new Error("Network response not ok");
        const data = await res.json();
        setEarthquakes(data.features || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load earthquake data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = [
    { label: "All", value: "all" },
    { label: "> 2.5", value: "2.5" },
    { label: "> 4.5", value: "4.5" },
    { label: "> 6.0", value: "6.0" },
  ];

  // filtered earthquakes by minMag
  const filtered = useMemo(() => {
    if (minMag === "all") return earthquakes;
    const threshold = parseFloat(minMag);
    return earthquakes.filter((e) => {
      const mag = e.properties?.mag;
      return typeof mag === "number" && mag >= threshold;
    });
  }, [earthquakes, minMag]);

  // helper for color
  const getColor = (mag) => {
    if (mag >= 6) return "#b91c1c"; // red-700
    if (mag >= 4.5) return "#ea580c"; // orange-600
    if (mag >= 2.5) return "#f59e0b"; // amber-500
    return "#16a34a"; // green-600
  };

  if (loading) return <p className="text-center mt-6 text-gray-600">Loading map...</p>;
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;

  return (
    <>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-4">
        <div className="w-full md:w-64 bg-white rounded-xl p-4 shadow">
          <h3 className="font-semibold text-gray-800">Filters</h3>
          <label className="block mt-3 text-sm text-gray-600">Minimum magnitude</label>
          <select
            value={minMag}
            onChange={(e) => setMinMag(e.target.value)}
            className="mt-2 w-full p-2 border rounded"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-semibold">{filtered.length}</span> quakes
            {minMag !== "all" && (
              <span>
                {" "}
                with magnitude ≥ <span className="font-semibold">{minMag}</span>
              </span>
            )}
            .
          </div>

          <div className="mt-4">
            <div className="text-xs text-gray-500">Legend</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-4 h-4 rounded-full" style={{ background: "#16a34a" }} />
              <span className="text-sm text-gray-600">Low</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-4 h-4 rounded-full" style={{ background: "#f59e0b" }} />
              <span className="text-sm text-gray-600">Moderate</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-4 h-4 rounded-full" style={{ background: "#ea580c" }} />
              <span className="text-sm text-gray-600">Strong</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-4 h-4 rounded-full" style={{ background: "#b91c1c" }} />
              <span className="text-sm text-gray-600">Major</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full h-[70vh] rounded-lg overflow-hidden shadow-lg">
          <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />

            {filtered.map((eq) => {
              const coords = eq.geometry?.coordinates || [];
              const lon = coords[0];
              const lat = coords[1];
              const mag = eq.properties?.mag ?? 0;
              if (typeof lat !== "number" || typeof lon !== "number") return null;

              // radius scaled by magnitude (visually reasonable)
              const radius = Math.max(4, (mag || 0) * 3.5);

              return (
                <CircleMarker
                  key={eq.id}
                  center={[lat, lon]}
                  radius={radius}
                  pathOptions={{
                    color: getColor(mag),
                    fillColor: getColor(mag),
                    fillOpacity: 0.6,
                    weight: 1,
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{eq.properties?.place}</strong>
                      <div>Magnitude: {mag ?? "N/A"}</div>
                      <div>Time: {new Date(eq.properties?.time).toLocaleString()}</div>
                      <a href={eq.properties?.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                        More info
                      </a>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </>
  );
}
