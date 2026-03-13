import { Link, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import MonitorDetailsPage from './pages/MonitorDetailsPage.jsx';
import StatsPage from './pages/StatsPage.jsx';

export default function App() {
  return (
    <main className="container">
      <nav className="nav">
        <h2>Watchdog</h2>
        <div>
          <Link to="/">Dashboard</Link>
          <Link to="/stats">Stats</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/monitors/:id" element={<MonitorDetailsPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </main>
  );
}

