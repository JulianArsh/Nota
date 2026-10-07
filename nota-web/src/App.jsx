import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Explore from './pages/Explore';
import PieceDetail from './pages/PieceDetail';
import Library from './pages/Library';
import Comparison from './pages/Comparison';
import AnalystEditor from './pages/AnalystEditor';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Simple auth context — replace with real auth provider later
function AppShell({ isLoggedIn, onLogout }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F0', color: '#2C1B1A' }}>
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <main>
        <Routes>
          {/* /home is the authenticated home; / redirects there */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/piece/:id" element={<PieceDetail />} />
          <Route path="/library" element={<Library />} />
          <Route path="/compare/:id" element={<Comparison />} />
          <Route path="/analyst/:id" element={<AnalystEditor />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Landing page — shown when logged out */}
        <Route
          path="/"
          element={isLoggedIn
            ? <Navigate to="/home" replace />
            : <Landing onLogin={() => setIsLoggedIn(true)} />}
        />
        {/* App shell — all authenticated routes */}
        <Route
          path="/*"
          element={isLoggedIn
            ? <AppShell isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />
            : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
