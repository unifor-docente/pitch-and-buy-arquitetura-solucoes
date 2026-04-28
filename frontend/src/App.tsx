import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { VotePage } from './pages/VotePage';
import { ResultsPage } from './pages/ResultsPage';
import { RankingPage } from './pages/RankingPage';
import { AdminPage } from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="topbar">
          <Link to="/" className="brand">
            Pitch & Buy
          </Link>

          <nav>
            <Link to="/vote">Votar</Link>
            <Link to="/ranking">Ranking</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vote" element={<VotePage />} />
            <Route path="/results/:teamId" element={<ResultsPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;