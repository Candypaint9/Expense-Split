import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = 6969;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/yourDBName')
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});