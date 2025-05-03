import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors';
import Group from './models/group.js';
import User from './models/user.js';
import bcrypt from "bcrypt";

const PORT = 5000;
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/splitwise')
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.get('/api/groupCards', (req, res) => {
    Group.find()
        .then(groups => res.json(groups))
        .catch(err => res.status(500).json({ error: 'Failed to fetch groups' }));
});

app.get('/api/friends', (req, res) => {
    const userId = req.user.id;
    User.findById(userId)
        .select('friends')
        .populate('friends', 'name email upiId')
        .then(user => {
            if (!user) return res.status(404).end();
            res.json(user.friends);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: 'Email already in use' });

        const user = new User({
            name,
            email,
            password,
            friends: []
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);;

        if (!isMatch)
            return res.status(400).json({ message: 'Invalid email or password' });

        // You could generate a JWT here if you want auth sessions
        res.status(200).json({ message: 'Login successful', userId: user._id });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});  