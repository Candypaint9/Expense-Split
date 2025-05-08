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