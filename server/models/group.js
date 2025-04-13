import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense',
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Group = mongoose.model('Group', groupSchema);
export default Group;