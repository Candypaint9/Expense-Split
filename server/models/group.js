import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    balances: {
        type: Map,
        of: Map,
        default: {}
    }
});

// Add a method to check if a user is a member of the group
groupSchema.methods.isMember = function (userId) {
    return this.members.some(member => member.toString() === userId.toString());
};

// // Add a method to get all balances within the group
// groupSchema.methods.getBalances = function() {
//   // Implementation would be in the controller for more complex logic
// };

// Add a method to update balances
groupSchema.methods.updateBalances = function (paidBy, shares) {
    if (!this.balances) {
        this.balances = new Map();
    }

    for (const [debtorId, amount] of Object.entries(shares)) {
        if (debtorId === paidBy) continue;

        // Initialize maps if not already present
        if (!this.balances.has(debtorId)) {
            this.balances.set(debtorId, new Map());
        }
        if (!this.balances.has(paidBy)) {
            this.balances.set(paidBy, new Map());
        }

        const debtorMap = this.balances.get(debtorId);
        const creditorMap = this.balances.get(paidBy);

        // Add debt
        debtorMap.set(paidBy, (debtorMap.get(paidBy) || 0) + amount);

        // Net reverse (optional)
        creditorMap.set(debtorId, (creditorMap.get(debtorId) || 0) - amount);
    }

    // Tell Mongoose the nested map was modified
    this.markModified('balances');
};


const Group = mongoose.model('Group', groupSchema);
export default Group;