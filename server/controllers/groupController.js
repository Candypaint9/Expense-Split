import User from "../models/user.js";
import Group from "../models/group.js";
import Expense from "../models/expense.js";
import mongoose from "mongoose";

// Create a new group with members from friends list
export const createGroup = async (req, res) => {
    const { name, members } = req.body;
    const creatorId = req.user.id; // From auth middleware

    try {
        // Get the creator's user document to check friends
        const creator = await User.findById(creatorId);
        if (!creator) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate all members are in the user's friends list
        const friendIds = creator.friends.map(friend => friend.toString());
        const invalidMembers = members.filter(
            memberId => !friendIds.includes(memberId) && memberId !== creatorId
        );

        if (invalidMembers.length > 0) {
            return res.status(400).json({
                message: "Some members are not in your friends list",
                invalidMembers
            });
        }

        // Create a new group
        const allMembers = [...new Set([...members, creatorId])]; // Ensure unique members and include creator

        const group = new Group({
            name,
            createdBy: creatorId,
            members: allMembers,
            expenses: [],
            createdAt: new Date()
        });

        await group.save();

        // Update all members' documents to include this group
        await User.updateMany(
            { _id: { $in: allMembers } },
            { $push: { groups: group._id } }
        );

        res.status(201).json({
            message: "Group created successfully",
            group
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get all groups for a user
export const getUserGroups = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).populate({
            path: 'groups',
            populate: {
                path: 'members',
                select: 'name email' // Only return name and email, not password
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ groups: user.groups });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get single group details
export const getGroupDetails = async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;

    // Validate if groupId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group ID format" });
    }

    try {
        const group = await Group.findById(groupId)
            .populate('members', 'name email')
            .populate({
                path: 'expenses',               // renamed from transactions
                populate: {
                    path: 'paidBy',               // directly populate the ObjectId
                    select: 'name email'
                }
            });

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if the user is a member of the group
        if (!group.members.some(member => member._id.toString() === userId)) {
            return res.status(403).json({ message: "Not authorized to view this group" });
        }

        // Calculate balances for each member
        const balances = calculateGroupBalances(group);

        res.status(200).json({
            group,
            balances,
        });
    } catch (err) {
        console.error("Error retrieving group details:", err);  // More detailed logging
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Add an expense to a group
export const addExpense = async (req, res) => {
    const { groupId } = req.params;
    const { description, amount, paidBy, splitAmong, splitType, category, date } = req.body;
    const userId = req.user.id;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Verify the user is part of the group
        if (!group.members.includes(userId)) {
            return res.status(403).json({ message: "Not authorized to add expenses to this group" });
        }

        // Verify all splitAmong members are in the group
        const invalidMembers = splitAmong.filter(id => !group.members.includes(id));
        if (invalidMembers.length > 0) {
            return res.status(400).json({
                message: "Some split members are not in the group",
                invalidMembers
            });
        }

        // Verify paidBy is in the group
        if (!group.members.includes(paidBy)) {
            return res.status(400).json({ message: "Paid by user is not in the group" });
        }

        // Calculate individual shares based on split type
        let shares = {};
        const splitAmount = parseFloat(amount);

        if (splitType === 'equal') {
            // Equal split
            const perPersonAmount = splitAmount / splitAmong.length;
            splitAmong.forEach(memberId => {
                shares[memberId] = perPersonAmount;
            });
        } else if (splitType === 'custom' && req.body.shares) {
            // Custom split - shares should be provided in the request
            shares = req.body.shares;

            // Validate the sum of shares equals the total amount
            const totalShares = Object.values(shares).reduce((sum, share) => sum + parseFloat(share), 0);
            if (Math.abs(totalShares - splitAmount) > 0.01) { // Allow for small floating point errors
                return res.status(400).json({
                    message: "Sum of shares must equal the total amount",
                    totalShares,
                    amount: splitAmount
                });
            }
        } else {
            return res.status(400).json({ message: "Invalid split type or missing custom shares" });
        }

        // Create the expense
        const expense = new Expense({
            description,
            amount: splitAmount,
            paidBy,
            splitAmong,
            shares,
            splitType,
            category,
            date: date || new Date(),
            group: groupId,
            createdBy: userId
        });

        await expense.save();

        // Add expense to the group
        group.expenses.push(expense._id);
        group.updateBalances(paidBy, shares);
        await group.save();

        res.status(201).json({
            message: "Expense added successfully",
            expense
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Calculate and return settlement plan for a group
export const getSettlementPlan = async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;

    try {
        const group = await Group.findById(groupId)
            .populate('members', 'name email')
            .populate({
                path: 'expenses',
                populate: { path: 'paidBy', select: 'name email' }
            });

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if user is a member of this group
        if (!group.members.some(member => member._id.toString() === userId)) {
            return res.status(403).json({ message: "Not authorized to view this group" });
        }

        // Calculate balances
        const balances = calculateGroupBalances(group);

        // Generate settlement plan
        const settlementPlan = generateSettlementPlan(balances);

        res.status(200).json({ settlementPlan });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Settle up between two members
export const settleUp = async (req, res) => {
    const { groupId } = req.params;
    const { payer, receiver, amount } = req.body;
    const userId = req.user.id;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Verify the user is part of the group
        if (!group.members.includes(userId)) {
            return res.status(403).json({ message: "Not authorized for this group" });
        }

        // Verify both payer and receiver are in the group
        if (!group.members.includes(payer) || !group.members.includes(receiver)) {
            return res.status(400).json({ message: "Payer or receiver not in the group" });
        }

        // Create a settlement expense
        const settlementExpense = new Expense({
            description: "Settlement",
            amount: parseFloat(amount),
            paidBy: payer,
            splitAmong: [receiver],
            shares: { [receiver]: parseFloat(amount) },
            splitType: 'settlement',
            date: new Date(),
            group: groupId,
            createdBy: userId,
            isSettlement: true
        });

        await settlementExpense.save();

        // Add settlement to the group
        group.expenses.push(settlementExpense._id);
        await group.save();

        res.status(200).json({
            message: "Settlement recorded successfully",
            settlement: settlementExpense
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Remove a member from a group
export const removeMember = async (req, res) => {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const userId = req.user.id;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if requester is the creator
        if (group.creator.toString() !== userId) {
            return res.status(403).json({ message: "Only the group creator can remove members" });
        }

        // Check if member is in the group
        if (!group.members.includes(memberId)) {
            return res.status(400).json({ message: "User is not a member of this group" });
        }

        // Check if member has outstanding balances
        const balances = calculateGroupBalances(group);
        const memberBalance = balances.find(balance => balance.userId.toString() === memberId);

        if (memberBalance && Math.abs(memberBalance.netBalance) > 0.01) {
            return res.status(400).json({
                message: "Member has outstanding balances that must be settled before removal",
                balance: memberBalance.netBalance
            });
        }

        // Remove member from group
        group.members = group.members.filter(member => member.toString() !== memberId);
        await group.save();

        // Remove group from user's groups
        await User.updateOne(
            { _id: memberId },
            { $pull: { groups: groupId } }
        );

        res.status(200).json({ message: "Member removed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Delete a group
export const deleteGroup = async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.id;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Only the creator can delete the group
        if (group.creator.toString() !== userId) {
            return res.status(403).json({ message: "Only the group creator can delete the group" });
        }

        // Check if all balances are settled
        const balances = calculateGroupBalances(group);
        const unsettledBalances = balances.some(balance => Math.abs(balance.netBalance) > 0.01);

        if (unsettledBalances) {
            return res.status(400).json({ message: "All balances must be settled before deleting the group" });
        }

        // Delete all expenses related to this group
        await Expense.deleteMany({ group: groupId });

        // Remove group from all members' documents
        await User.updateMany(
            { _id: { $in: group.members } },
            { $pull: { groups: groupId } }
        );

        // Delete the group
        await Group.findByIdAndDelete(groupId);

        res.status(200).json({ message: "Group deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Helper function to calculate balances within a group

/**
 * Given a group with populated members and expenses, returns an array of
 * balances (paid, owed, netBalance) for each member.
 */
function calculateGroupBalances(group) {
    // Initialize a map of userId → { paid, owed, netBalance }
    const balancesMap = {};
    group.members.forEach(member => {
        const id = (member._id || member).toString();
        balancesMap[id] = {
            userId: id,
            paid: 0,
            owed: 0,
            netBalance: 0
        };
    });

    // tally paid & owed across all expenses
    if (Array.isArray(group.expenses)) {
        group.expenses.forEach(expense => {
            const payerId = (expense.paidBy._id || expense.paidBy).toString();
            const amt = parseFloat(expense.amount) || 0;
            // Add to what the payer has fronted
            balancesMap[payerId].paid += amt;

            if (expense.splitType === 'equal') {
                // Equal split among splitAmong[]
                const splitCount = expense.splitAmong.length;
                const share = splitCount > 0 ? amt / splitCount : 0;
                expense.splitAmong.forEach(u => {
                    const uid = (u._id || u).toString();
                    if (balancesMap[uid]) {
                        balancesMap[uid].owed += share;
                    }
                });
            } else {
                // Custom or settlement: use expense.shares map
                Object.entries(expense.shares).forEach(([uid, shareAmt]) => {
                    if (balancesMap[uid]) {
                        balancesMap[uid].owed += parseFloat(shareAmt) || 0;
                    }
                });
            }
        });
    }

    Object.values(balancesMap).forEach(b => {
        b.netBalance = b.paid - b.owed;
    });

    return Object.values(balancesMap);
}


// Helper function to generate a settlement plan
function generateSettlementPlan(balances) {
    const settlements = [];

    // Create a copy of balances to work with
    const workingBalances = [...balances];

    // Sort by net balance (ascending)
    workingBalances.sort((a, b) => a.netBalance - b.netBalance);

    // Keep settling until all balances are close to zero
    while (workingBalances.length > 1 &&
        Math.abs(workingBalances[0].netBalance) > 0.01 &&
        Math.abs(workingBalances[workingBalances.length - 1].netBalance) > 0.01) {

        const debtor = workingBalances[0]; // Person who owes money (negative balance)
        const creditor = workingBalances[workingBalances.length - 1]; // Person who is owed money (positive balance)

        // Find the settlement amount (minimum of what debtor owes and creditor is owed)
        const settlementAmount = Math.min(Math.abs(debtor.netBalance), creditor.netBalance);

        if (settlementAmount > 0.01) { // Only add meaningful settlements
            settlements.push({
                from: debtor.userId,
                to: creditor.userId,
                amount: settlementAmount.toFixed(2)
            });

            // Update balances
            debtor.netBalance += settlementAmount;
            creditor.netBalance -= settlementAmount;
        }

        // Re-sort the array after updating balances
        workingBalances.sort((a, b) => a.netBalance - b.netBalance);
    }

    return settlements;
} 