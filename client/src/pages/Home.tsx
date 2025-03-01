import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, MapPin } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Home: React.FC = () => {
  const [username, setUsername] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { currentUser, registerUser, loading, error } = useGame();
  const navigate = useNavigate();

  const handleStartGame = () => {
    if (currentUser) {
      navigate('/play');
    } else {
      setShowForm(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) return;
    
    try {
      await registerUser(username.trim());
      navigate('/play');
    } catch (err) {
      // Error is handled in context
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <Globe className="w-20 h-20 text-blue-600" />
        </div>
        
        <h1 className="text-5xl font-bold text-blue-800 mb-4">
          Globetrotter Challenge
        </h1>
        
        <p className="text-xl text-gray-700 mb-8">
          Test your knowledge of world destinations! Guess cities from cryptic clues and discover fascinating facts about places around the globe.
        </p>
        
        {currentUser ? (
          <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
            <p className="text-lg">
              Welcome back, <span className="font-bold">{currentUser.username}</span>!
            </p>
            <p className="text-gray-600">
              Your score: {currentUser?.score?.correct} correct, {currentUser?.score?.incorrect} incorrect
            </p>
          </div>
        ) : showForm ? (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Create Your Profile</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 mb-2">
                  Choose a username:
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="YourUsername"
                  required
                />
              </div>
              
              {error && (
                <p className="text-red-500 mb-4">{error}</p>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
              >
                {loading ? 'Creating Profile...' : 'Start Playing'}
              </button>
            </form>
          </div>
        ) : null}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!showForm && (
            <button
              onClick={handleStartGame}
              className="bg-blue-600 text-white py-3 px-8 rounded-md text-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            >
              <MapPin className="mr-2" />
              {currentUser ? 'Continue Playing' : 'Start Playing'}
            </button>
          )}
          
          {currentUser && (
            <button
              onClick={() => navigate(`/challenge/${currentUser.username}`)}
              className="bg-purple-600 text-white py-3 px-8 rounded-md text-lg hover:bg-purple-700 transition duration-300"
            >
              Challenge a Friend
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;