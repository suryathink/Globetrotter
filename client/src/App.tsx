import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Challenge from './pages/Challenge';
import Navbar from './components/Navbar';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <Router>
      <GameProvider>
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/play" element={<Game />} />
              <Route path="/challenge/:username" element={<Challenge />} />
            </Routes>
          </div>
        </div>
      </GameProvider>
    </Router>
  );
}

export default App;