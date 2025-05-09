import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    splitAmong: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    shares: {
        type: Map,
        of: Number,
        default: {},
    },
    splitType: {
        type: String,
        enum: ["equal", "custom", "percentage", "settlement"],
        default: "equal",
    },
    category: {
        type: String,
        trim: true,
        default: "Other",
    },
    date: {
        type: Date,
        default: Date.now,
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
