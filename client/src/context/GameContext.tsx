import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  score: {
    correct: number;
    incorrect: number;
  };
}

interface GameContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  score: {
    correct: number;
    incorrect: number;
  };
  updateScore: (isCorrect: boolean) => Promise<void>;
  registerUser: (username: string) => Promise<User>;
  loading: boolean;
  error: string | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem("globetrotter_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // console.log("parsedUser",parsedUser)
        setCurrentUser(parsedUser);
        setScore(parsedUser.score);
      } catch (err) {
        console.error("Error parsing saved user:", err);
        localStorage.removeItem("globetrotter_user");
      }
    }
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("globetrotter_user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const registerUser = async (username: string): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/user`,
        { username }
      );
      //   const response = await axios.post('/api/users', { username });
      const newUser = response.data.data;

      setCurrentUser(newUser);
      setScore(newUser.score);

      return newUser;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to register user";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateScore = async (isCorrect: boolean): Promise<void> => {
    // console.log("isCorrect",isCorrect)
    if (!currentUser) return;

    // Update local state immediately for better UX
    setScore((prev) => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: isCorrect ? prev.incorrect : prev.incorrect + 1,
    }));

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/user/${currentUser.username}/score`,
        {
          correct: isCorrect,
        }
      );

      // Update user with server response
      setCurrentUser((prev) => {
        if (!prev) return response.data.data;
        return { ...prev, score: response.data.data.score };
      });
    } catch (err) {
      console.error("Error updating score:", err);
      // Revert local state if server update fails
      console.log("currentUser",currentUser)
      setScore(currentUser.score);
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    score,
    updateScore,
    registerUser,
    loading,
    error,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
