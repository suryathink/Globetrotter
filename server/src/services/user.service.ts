import User from "../models/User";

export class UserService {
  public static async create(username: string) {
    if (!username) {
      return {
        isError: true,
        message: "Username not found",
      };
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username }).lean();
    if (existingUser) {
      return {
        isError: true,
        message: "Username already taken",
      };
    }

    const newUser = new User({ username });
    await newUser.save();

    return {
      isError: false,
      data: newUser,
    };
  }

  public static async verifyUsername(username: string) {
    const user = await User.findOne({ username }).lean();

    if (!user) {
      return {
        isError: true,
        message: "User not found",
      };
    } else {
      return {
        isError: false,
        data: user,
      };
    }
  }

  public static async updateUserScore(username: string, correct: boolean) {
    if (correct === undefined) {
      return {
        isError: true,
        message: "Missing required fields",
      };
    }

    const updateField = correct ? "score.correct" : "score.incorrect";

    const user = await User.findOneAndUpdate(
      { username: username },
      { $inc: { [updateField]: 1 } },
      { new: true }
    );

    if (!user) {
      return {
        isError: true,
        message: "User not found",
      };
    }

    return {
      isError: false,
      data: user,
    };
  }
}
