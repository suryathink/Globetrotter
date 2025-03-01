import mongoose from "mongoose";
import Destination from "../models/Destination";

export class DestinationService {
  public static async random() {
    // Count total documents
    const count = await Destination.countDocuments();

    // Generate random index
    const random = Math.floor(Math.random() * count);

    // Get random destination
    const destination = await Destination.findOne().skip(random);

    if (!destination) {
      return {
        isError: true,
        message: "No destinations found",
      };
    }

    // Select 1-2 random clues
    const numClues = Math.floor(Math.random() * 2) + 1; // 1 or 2 clues
    const randomClues = destination.clues
      .sort(() => 0.5 - Math.random())
      .slice(0, numClues);

    return {
      isError: false,
      data: {
        id: destination._id,
        clues: randomClues,
      },
    };
  }

  public static async fetchOptions(id: string) {
    const correctDestination = await Destination.findById(id);
    if (!correctDestination) {
      return {
        isError: true,
        message: "Destination not found",
      };
    }
    // Get 3 random wrong destinations
    const wrongDestinations = await Destination.aggregate([
      {
        $match: {
          _id: {
            $ne: mongoose.Types.ObjectId.createFromHexString(id),
          },
        },
      },
      { $sample: { size: 3 } },
      { $project: { city: 1, country: 1 } },
    ]);

    // Combine correct and wrong destinations
    const options = [
      {
        id: correctDestination._id,
        city: correctDestination.city,
        country: correctDestination.country,
      },
      ...wrongDestinations,
    ].sort(() => 0.5 - Math.random()); // Shuffle options

    return {
      isError: false,
      data: options,
    };
  }

  // Verify answer and return feedback
  public static async verify(destinationId: string, answerId: string) {
    if (!destinationId || !answerId) {
      return {
        isError: true,
        message: "Missing required fields",
      };
      // return res.status(400).json({ message: 'Missing required fields' });
    }

    const destination = await Destination.findById(destinationId).lean();

    if (!destination) {
      return {
        isError: true,
        message: "Destination not found",
      };
      // return res.status(404).json({ message: 'Destination not found' });
    }

    const isCorrect = destination._id.toString() === answerId;

    // Select a random fun fact or trivia
    const feedbackArray = isCorrect ? destination.fun_fact : destination.trivia;
    const randomFeedback =
      feedbackArray[Math.floor(Math.random() * feedbackArray.length)];
    const data = {
      correct: isCorrect,
      feedback: randomFeedback,
      correctAnswer: {
        city: destination.city,
        country: destination.country,
      },
    };
    return {
      isError: false,
      data,
    };
  }
}
