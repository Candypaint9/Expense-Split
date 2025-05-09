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
    paidBy: [
        {
            payer: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
        },
    ],
    splitBetween: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            share: {
                type: Number,
                required: true,
            },
        },
    ],
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
    createdAt: {
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
    //   isSettlement: {
    //     type: Boolean,
    //     default: false
    //   }
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
