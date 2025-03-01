import User from "../models/User";

export class UserService {
  public static async create(username: string) {
    // const { username } = req.body;

    if (!username) {
      //   return res.status(400).json({ message: "Username is required" });
      return {
        isError: true,
        message: "Username already taken",
      };
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username }).lean();
    if (existingUser) {
      return {
        isError: true,
        message: "Username already taken",
      };
      //   return res.status(400).json({ message: 'Username already taken' });
    }

    const newUser = new User({ username });
    await newUser.save();

    return {
      isError: false,
      data: newUser,
    };

    // res.status(201).json(newUser);
  }
}
