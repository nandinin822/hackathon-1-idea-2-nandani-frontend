import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HackPage from "./pages/HackPage";
import PlanPage from "./pages/PlanPage";
import BookPage from "./pages/BookPage";
import TransfersPage from "./pages/TransfersPage";
import CopilotDock from "./components/CopilotDock";

function Mark() {
  return (
    <span className="mark" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M3.5 2.4a.75.75 0 0 0-.93.94l2.43 7.91H13.5a.75.75 0 0 1 0 1.5H5l-2.43 7.9a.75.75 0 0 0 .93.95 60.5 60.5 0 0 0 18.44-8.99.75.75 0 0 0 0-1.22A60.5 60.5 0 0 0 3.5 2.4Z"
        />
      </svg>
    </span>
  );
}

export default function App() {
  const location = useLocation();
  const fullTrip = location.pathname === "/hack" && location.search.includes("trip=full");
  return (
    <div className="shell">
      <header className="nav">
        <NavLink to="/" className="brand">
          <Mark />
          BookMyflight
        </NavLink>
        <nav className="nav-links" aria-label="Primary">
          <Link to="/hack" className={location.pathname === "/hack" && !fullTrip ? "active" : undefined} aria-current={location.pathname === "/hack" && !fullTrip ? "page" : undefined}>
            Quick flight
          </Link>
          <Link to="/hack?trip=full" className={fullTrip ? "active" : undefined} aria-current={fullTrip ? "page" : undefined}>
            Full trip
          </Link>
          <NavLink to="/plan">Planner</NavLink>
          <NavLink to="/transfers">Transfers</NavLink>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hack" element={<HackPage />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/transfers" element={<TransfersPage />} />
      </Routes>
      <footer className="footer">
        Award prices, taxes, and transfer ratios are a v1 sample. Confirm the seat on the airline site before you move points. Transfers usually cannot be reversed.
      </footer>
      <CopilotDock />
      <nav className="tabbar" aria-label="Mobile">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/hack">Flight</NavLink>
        <NavLink to="/plan">Plan</NavLink>
        <NavLink to="/transfers">Points</NavLink>
      </nav>
    </div>
  );
}
