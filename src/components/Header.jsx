export default function Header() {
  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span>🌎</span>
          <span>Earthquake Visualizer</span>
        </h1>
        <p className="text-sm text-blue-100 mt-1">Recent earthquakes (past 24h) — filter by magnitude</p>
      </div>
    </header>
  );
}
