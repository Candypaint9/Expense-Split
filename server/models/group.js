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
  }
});

// Add a method to check if a user is a member of the group
groupSchema.methods.isMember = function(userId) {
  return this.members.some(member => member.toString() === userId.toString());
};

// // Add a method to get all balances within the group
// groupSchema.methods.getBalances = function() {
//   // Implementation would be in the controller for more complex logic
// };

const Group = mongoose.model('Group', groupSchema);

export default Group;