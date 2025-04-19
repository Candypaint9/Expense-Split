import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors';
import Group from './models/group.js';
import User from './models/user.js';

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