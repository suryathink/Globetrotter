import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Share2, ArrowRight, Trophy } from 'lucide-react';
import { useGame } from '../context/GameContext';
import Game from './Game.tsx';

interface ChallengeUser {
  _id: string;
  username: string;
  score: {
    correct: number;
    incorrect: number;
  };
}

const Challenge: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [challengeUser, setChallengeUser] = useState<ChallengeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useGame();
  
  useEffect(() => {
    const fetchUser = async () => {
      if (!username) return;
      
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/${username}`);
        setChallengeUser(response.data.data);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('User not found');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [username]);
  
  const handleShare = () => {
    console.log("challengeUser",challengeUser)
    if (!challengeUser) return;
    
    const shareUrl = `${window.location.origin}/challenge/${challengeUser.username}`;
    const shareText = `I challenge you to beat my score in the Globetrotter Challenge! I've got ${challengeUser.score.correct} correct answers. Can you do better?`;
    
    // Create WhatsApp share link
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    
    // Open in new window
    window.open(whatsappUrl, '_blank');
  };
  
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading challenge...</p>
      </div>
    );
  }
  
  if (error || !challengeUser) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-red-500 mb-4">{error || 'Challenge not found'}</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Go back home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-800 mb-2">
              {username === currentUser?.username 
                ? 'Share Your Challenge' 
                : `${challengeUser.username}'s Challenge`}
            </h1>
            
            <div className="flex items-center mb-4">
              <Trophy className="text-yellow-500 mr-2" />
              <p className="text-gray-700">
                Current score: <span className="font-bold text-green-600">{challengeUser.score.correct}</span> correct, 
                <span className="font-bold text-red-600"> {challengeUser.score.incorrect}</span> incorrect
              </p>
            </div>
          </div>
          
          {username === currentUser?.username && (
            <button
              onClick={handleShare}
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition flex items-center"
            >
              <Share2 className="mr-2" size={18} />
              Challenge on WhatsApp
            </button>
          )}
        </div>
        
        {username !== currentUser?.username && !currentUser && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-blue-800 mb-2">
              Want to accept this challenge and track your own score?
            </p>
            <Link 
              to="/"
              className="inline-flex items-center text-blue-600 hover:underline"
            >
              Create your profile <ArrowRight className="ml-1" size={16} />
            </Link>
          </div>
        )}
      </div>
      
      <Game />
    </div>
  );
};

export default Challenge;