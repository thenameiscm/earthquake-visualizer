import Header from "./components/Header";
import EarthquakeMap from "./components/EarthquakeMap";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50">
      <Header />
      <main className="p-6 max-w-6xl mx-auto">
        <EarthquakeMap />
      </main>
      <footer className="text-center text-sm text-gray-500 mt-8 pb-6">
        Data source: USGS • Built with React, Tailwind, and React-Leaflet
      </footer>
    </div>
  );
}
