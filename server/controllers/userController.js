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
        const user = await User.findById(userId).select("name email phone upiId");

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


export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, upiId } = req.body;
        if (!/^\d{10}$/.test(req.body.phone)) {//checks that phone number is 10 digits long
            return res.status(400).json({ error: "Phone number must be exactly 10 digits" });
        }

        if (!name || !phone || !upiId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, phone, upiId },
            { new: true }//updatedUser now contains the new updated data..
        );

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};