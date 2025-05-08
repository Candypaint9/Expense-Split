import User from "../models/user.js";
import Group from "../models/group.js";

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

export const getProfile = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).select("name email upiId");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getGroupCards = async (req, res) => {
    const userId = req.user.id;

    try {
        const groups = await Group.find({ members: userId });

        if (!groups || groups.length === 0) {
            return res.status(404).json({ message: "No groups found" });
        }

        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch groups" });
    }
};

export const getUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).select("name email");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const addFriend = async (req, res) => {
    const { email } = req.body;
    const currentUserId = req.user.id;
    
    try {
      const currentUser = await User.findById(currentUserId);
      const friend = await User.findOne({ email });
  
      if (!friend) {
        return res.status(404).json({ message: 'User not found.' });
      }
    //   console.log(currentUser);
      if (friend._id.equals(currentUser._id)) {
        return res.status(400).json({ message: 'You cannot add yourself.' });
      }
  
      if (currentUser.friends.includes(friend._id)) {
        return res.status(400).json({ message: 'Already friends.' });
      }
  
      currentUser.friends.push(friend._id);
      await currentUser.save();
  
      // Optional: Add current user to friend's list too (mutual friendship)
      friend.friends.push(currentUserId);
      await friend.save();
  
      return res.json({
        message: 'Friend added successfully.',
        friend: {
          id: friend._id,
          name: friend.name,
          email: friend.email,
        }
      });
    } catch (err) {
      console.error('Error adding friend:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  };