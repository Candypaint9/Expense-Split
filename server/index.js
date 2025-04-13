import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors';
import Group from './models/group.js';

const PORT = 5000;
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/splitwise')
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.get('/api/groups', async (req, res) => {
    try {
        const groups = await Group.find();
        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch groups' });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});