import { Link, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import MonitorDetailsPage from './pages/MonitorDetailsPage.jsx';
import StatsPage from './pages/StatsPage.jsx';

// Renders the app shell and router views (no args), wiring dashboard, monitor details, and global stats pages.
export default function App() {
  return (
    <main className="container app-shell">
      <header className="brand-banner">
        <div className="brand-main">
          <img
            src="/sepefrei-logo.png"
            alt="SEPEFREI logo"
            width="56"
            height="56"
            className="brand-logo"
          />
          <div>
            <h2>Watchdog</h2>
            <p className="brand-subtitle">SEPEFREI uptime supervision</p>
          </div>
        </div>
        <nav className="nav">
          <Link to="/">Dashboard</Link>
          <Link to="/stats">Stats</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/monitors/:id" element={<MonitorDetailsPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </main>
  );
}

