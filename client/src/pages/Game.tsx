import React, { useState, useEffect } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import { MapPin, Frown, RefreshCw } from "lucide-react";
import { useGame } from "../context/GameContext";

interface Destination {
  id: string;
  clues: string[];
}

interface Option {
  _id?: string;
  id?: string;
  city: string;
  country: string;
}

interface VerifyResponse {
  correct: boolean;
  feedback: string;
  correctAnswer: {
    city: string;
    country: string;
  };
}

const Game: React.FC = () => {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { updateScore, currentUser } = useGame();

  const fetchNewQuestion = async () => {
    setLoading(true);
    setSelectedOption(null);
    setFeedback(null);
    setError(null);

    try {
      // Fetch random destination
      const destResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/destination/random`
      );
      const newDestination: Destination = destResponse.data.data;
      setDestination(newDestination);

      // Fetch options for the destination
      const optionsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/destination/options/${
          newDestination.id
        }`
      );
      setOptions(optionsResponse.data.data);
    } catch (err) {
      console.error("Error fetching question:", err);
      setError("Failed to load question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (optionId: string) => {
    if (selectedOption || !destination) return;
    setSelectedOption(optionId);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/destination/verify`,
        {
          destinationId: destination.id,
          answerId: optionId,
        }
      );

      const result: VerifyResponse = response.data.data;
      setFeedback(result);

      // Update score based on correct answer
      await updateScore(result.correct);

      // Show confetti for correct answers
      if (result.correct) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error("Error verifying answer:", err);
      setError("Failed to verify answer. Please try again.");
    }
  };

  useEffect(() => {
    fetchNewQuestion();
  }, []);

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-xl">Please create a profile to play the game.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your next destination...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchNewQuestion}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="p-8 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-blue-800">
                  Where in the world?
                </h2>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Score</p>
                  <p className="font-bold">
                    <span className="text-green-600">
                      {currentUser?.score?.correct}
                    </span>{" "}
                    /
                    <span className="text-red-600">
                      {currentUser?.score?.incorrect}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-8">
                {destination?.clues.map((clue, index) => (
                  <div
                    key={index}
                    className="mb-3 p-4 bg-white rounded-md shadow-sm border-l-4 border-blue-500"
                  >
                    <p className="text-gray-800">{clue}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {options.map((option) => (
                  <button
                    key={option?.id || option?._id}
                    onClick={() =>
                      handleAnswer((option?.id || option?._id) as string)
                    }
                    disabled={!!selectedOption}
                    className={`p-4 rounded-md text-left transition-all ${
                      selectedOption === option.id
                        ? feedback?.correct
                          ? "bg-green-100 border-2 border-green-500"
                          : "bg-red-100 border-2 border-red-500"
                        : feedback &&
                          feedback.correctAnswer?.city === option.city
                        ? "bg-green-100 border-2 border-green-500"
                        : selectedOption
                        ? "bg-gray-100 opacity-70"
                        : "bg-white hover:bg-blue-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <MapPin
                        className={`mr-2 ${
                          selectedOption === option.id && feedback?.correct
                            ? "text-green-600"
                            : selectedOption === option.id
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      />
                      <div>
                        <p className="font-medium">{option.city}</p>
                        {/* <p className="text-sm text-gray-600">
                          {option.country}
                        </p> */}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {feedback && (
              <div
                className={`p-6 ${
                  feedback.correct ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex items-center mb-4">
                  {feedback.correct ? (
                    <span className="text-2xl">🎉</span>
                  ) : (
                    <Frown className="text-red-500" size={24} />
                  )}
                  <div className="ml-4">
                    <h3
                      className={`text-xl font-bold ${
                        feedback.correct ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {feedback.correct ? "Correct!" : "Not quite right!"}
                    </h3>
                    <p className="text-gray-700">
                      {feedback.correct
                        ? `You know your way around ${feedback.correctAnswer.city}!`
                        : `The correct answer was ${feedback.correctAnswer.city}, ${feedback.correctAnswer.country}.`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={fetchNewQuestion}
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  <span>Next Destination</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Game;
