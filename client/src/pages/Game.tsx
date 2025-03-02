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
  id: string;
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
      // Get random destination with clues
      //   const destResponse = await axios.get('/api/destinations/random');
      const destResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/destination/random`
      );
      const newDestination = destResponse.data.data;
      setDestination(newDestination);

      // console.log("newDestination", newDestination);

      // Get options including the correct answer
      const optionsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/destination/options/${
          newDestination.id
        }`
      );

      setOptions(optionsResponse.data);
    } catch (err) {
      console.error("Error fetching question:", err);
      setError("Failed to load question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (optionId: string) => {
    // console.log("optionId",optionId)
    if (selectedOption || !destination) return;

    setSelectedOption(optionId);

    try {

        // console.log("destination.id",destination.id)
        // console.log("optionId",optionId)
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/destination/verify`,
        {
          destinationId: destination.id,
          answerId: optionId,
        }
      );

      const result = response.data;
      setFeedback(result);

      // console.log("result",result)

      // Update score
      await updateScore(result.data.correct);

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

  // Load initial question
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
            {/* Question Section */}
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

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {options?.data?.map((option:Option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option?._id || option?.id)}
                    disabled={!!selectedOption}
                    className={`p-4 rounded-md text-left transition-all ${
                      selectedOption === option._id
                        ? feedback?.correct
                          ? "bg-green-100 border-2 border-green-500"
                          : "bg-red-100 border-2 border-red-500"
                        : feedback &&
                          feedback?.data?.correctAnswer?.city === option.city
                        ? "bg-green-100 border-2 border-green-500"
                        : selectedOption
                        ? "bg-gray-100 opacity-70"
                        : "bg-white hover:bg-blue-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <MapPin
                        className={`mr-2 ${
                          selectedOption === option._id && feedback?.correct
                            ? "text-green-600"
                            : selectedOption === option._id
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      />
                      <div>
                        <p className="font-medium">{option.city}</p>
                        <p className="text-sm text-gray-600">
                          {option.country}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Section */}
            {feedback && (
              <div
                className={`p-6 ${
                  feedback.correct ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex items-center mb-4">
                  {feedback.correct ? (
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <span className="text-2xl">🎉</span>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                      <Frown className="text-red-500" size={24} />
                    </div>
                  )}
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        feedback.correct ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {feedback.correct ? "Correct!" : "Not quite right!"}
                    </h3>
                    <p className="text-gray-700">
                      {feedback.correct
                        ? `You know your way around ${feedback?.data?.correctAnswer?.city}!`
                        : `The correct answer was ${feedback?.data?.correctAnswer?.city}, ${feedback?.data?.correctAnswer?.country}.`}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-md mb-4">
                  <p className="text-gray-800 italic">"{feedback.feedback}"</p>
                </div>

                <button
                  onClick={fetchNewQuestion}
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
                >
                  <RefreshCw className="mr-2" size={18} />
                  Next Destination
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
