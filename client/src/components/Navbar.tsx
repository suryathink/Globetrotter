import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, User } from 'lucide-react';
import { useGame } from '../context/GameContext.tsx';

const Navbar: React.FC = () => {
  const { currentUser } = useGame();
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <Globe className="text-blue-600 mr-2" size={28} />
            <span className="text-xl font-bold text-blue-800">Globetrotter</span>
          </Link>
          
          <div className="flex items-center">
            {currentUser ? (
              <Link 
                to={`/challenge/${currentUser.username}`}
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <User className="mr-1" size={18} />
                <span>{currentUser.username}</span>
              </Link>
            ) : (
              <Link 
                to="/"
                className="text-blue-600 hover:text-blue-800"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;