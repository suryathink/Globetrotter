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
      //   return res.status(404).json({ message: 'No destinations found' });
    }

    // Select 1-2 random clues
    const numClues = Math.floor(Math.random() * 2) + 1; // 1 or 2 clues
    const randomClues = destination.clues
      .sort(() => 0.5 - Math.random())
      .slice(0, numClues);

    // Return limited data for the question

    return {
      isError: false,
      data: {
        _id: destination._id,
        clues: randomClues,
      },
    };
  }
}
