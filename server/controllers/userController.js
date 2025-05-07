import User from "../models/user.js";

export const getFriends = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId)
      .select("friends")
      .populate("friends", "name email upiId");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
