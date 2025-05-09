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
    expenses: [{
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

// Check membership
groupSchema.methods.isMember = function (userId) {
    return this.members.some(m => m.toString() === userId.toString());
};


groupSchema.methods.updateBalances = function (paidBy, shares) {
    if (!this.balances) this.balances = new Map();
    for (const [debtorId, amt] of Object.entries(shares)) {
        if (debtorId === paidBy) continue;
        if (!this.balances.has(debtorId)) this.balances.set(debtorId, new Map());
        if (!this.balances.has(paidBy)) this.balances.set(paidBy, new Map());
        const debtorMap = this.balances.get(debtorId);
        const creditorMap = this.balances.get(paidBy);
        debtorMap.set(paidBy, (debtorMap.get(paidBy) || 0) + amt);
        creditorMap.set(debtorId, (creditorMap.get(debtorId) || 0) - amt);
    }
    this.markModified('balances');
};

groupSchema.methods.recordSettlement = function (payer, receiver, amount) {
    if (!this.balances) this.balances = new Map();

    if (!this.balances.has(payer)) this.balances.set(payer, new Map());
    if (!this.balances.has(receiver)) this.balances.set(receiver, new Map());

    const payerMap = this.balances.get(payer);
    const receiverMap = this.balances.get(receiver);

    // Adjust payer's debt to receiver
    const payerOwes = payerMap.get(receiver) || 0;
    payerMap.set(receiver, payerOwes - amount);

    // Adjust receiver's credit from payer
    const receiverIsOwed = receiverMap.get(payer) || 0;
    receiverMap.set(payer, receiverIsOwed + amount);

    // If after settlement, balance is zero, clean up entries
    if (payerMap.get(receiver) === 0) payerMap.delete(receiver);
    if (receiverMap.get(payer) === 0) receiverMap.delete(payer);

    this.markModified('balances');
};

const Group = mongoose.model('Group', groupSchema);
export default Group;
