import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true,
    },
    paidby: [{
        payer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    splitBetween: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        share: {
            type: Number,
            required: true
        },
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: string,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
