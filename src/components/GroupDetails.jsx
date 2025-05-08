import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [balances, setBalances] = useState([]);
  const [settlementPlan, setSettlementPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showSettlement, setShowSettlement] = useState(false);

  // Fetch group details
  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/groups/${groupId}`);
        setGroup(response.data.group);
        setBalances(response.data.balances);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch group details');
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  // Fetch settlement plan
  const fetchSettlementPlan = async () => {
    try {
      const response = await axios.get(`/api/groups/${groupId}/settlement`);
      setSettlementPlan(response.data.settlementPlan);
      setShowSettlement(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch settlement plan');
    }
  };

  // Handle settle up between users
  const handleSettleUp = async (from, to, amount) => {
    try {
      await axios.post(`/api/groups/${groupId}/settle`, {
        payer: from,
        receiver: to,
        amount
      });
      
      // Refresh group details
      const response = await axios.get(`/api/groups/${groupId}`);
      setGroup(response.data.group);
      setBalances(response.data.balances);
      setShowSettlement(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to settle up');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading group details...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
        <button 
          onClick={() => navigate('/groups')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Back to Groups
        </button>
      </div>
    );
  }

  if (!group) {
    return <div className="text-center py-8">Group not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{group.name}</h1>
        <div>
          <button 
            onClick={() => setShowAddExpense(!showAddExpense)}
            className="px-4 py-2 bg-green-600 text-white rounded-md mr-2"
          >
            {showAddExpense ? 'Cancel' : 'Add Expense'}
          </button>
          <button 
            onClick={fetchSettlementPlan}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Settle Up
          </button>
        </div>
      </div>

      {/* Members Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Group Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {group.members.map((member) => (
            <div key={member._id} className="flex items-center p-3 border rounded-md">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Balances Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Balances</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Member</th>
                <th className="px-4 py-2 text-right">Paid</th>
                <th className="px-4 py-2 text-right">Owed</th>
                <th className="px-4 py-2 text-right">Net Balance</th>
              </tr>
            </thead>
            <tbody>
              {balances.map((balance) => {
                const member = group.members.find(m => m._id === balance.userId.toString());
                return (
                  <tr key={balance.userId} className="border-b">
                    <td className="px-4 py-3">{member?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-right">${balance.paid.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">${balance.owed.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${
                      balance.netBalance > 0 
                        ? 'text-green-600' 
                        : balance.netBalance < 0 
                          ? 'text-red-600' 
                          : ''
                    }`}>
                      {balance.netBalance > 0 ? '+' : ''}{balance.netBalance.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Expenses Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
        {group.expenses && group.expenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2 text-left">Paid By</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Type</th>
                </tr>
              </thead>
              <tbody>
                {group.expenses.slice().reverse().map((expense) => {
                  const paidBy = group.members.find(m => m._id === expense.paidBy._id || m._id === expense.paidBy);
                  return (
                    <tr key={expense._id} className="border-b">
                      <td className="px-4 py-3">{expense.description}</td>
                      <td className="px-4 py-3 text-right">${parseFloat(expense.amount).toFixed(2)}</td>
                      <td className="px-4 py-3">{paidBy?.name || 'Unknown'}</td>
                      <td className="px-4 py-3">
                        {format(new Date(expense.date), 'MMM d, yyyy')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          expense.isSettlement 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {expense.isSettlement ? 'Settlement' : expense.splitType}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No expenses yet.</p>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <AddExpenseModal 
          groupId={groupId} 
          members={group.members} 
          onClose={() => setShowAddExpense(false)} 
          onExpenseAdded={(newExpense) => {
            setGroup({
              ...group,
              expenses: [...group.expenses, newExpense]
            });
            setShowAddExpense(false);
          }}
        />
      )}

      {/* Settlement Modal */}
      {showSettlement && (
        <SettlementModal 
          settlements={settlementPlan}
          members={group.members}
          onClose={() => setShowSettlement(false)}
          onSettle={handleSettleUp}
        />
      )}
    </div>
  );
};

// Add Expense Modal Component
const AddExpenseModal = ({ groupId, members, onClose, onExpenseAdded }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [splitAmong, setSplitAmong] = useState([]);
  const [customShares, setCustomShares] = useState({});
  const [category, setCategory] = useState('Other');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize split among with all members
  useEffect(() => {
    if (members.length > 0) {
      setSplitAmong(members.map(m => m._id));
      // Initialize custom shares object
      const shares = {};
      members.forEach(m => {
        shares[m._id] = 0;
      });
      setCustomShares(shares);
    }
  }, [members]);

  // Handle split among toggle
  const handleSplitToggle = (memberId) => {
    if (splitAmong.includes(memberId)) {
      setSplitAmong(splitAmong.filter(id => id !== memberId));
    } else {
      setSplitAmong([...splitAmong, memberId]);
    }
  };

  // Handle custom share change
  const handleCustomShareChange = (memberId, value) => {
    setCustomShares({
      ...customShares,
      [memberId]: parseFloat(value) || 0
    });
  };

  // Validate form
  const validateForm = () => {
    if (!description.trim()) {
      setError('Description is required');
      return false;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    
    if (!paidBy) {
      setError('Please select who paid');
      return false;
    }
    
    if (splitAmong.length === 0) {
      setError('Please select at least one person to split with');
      return false;
    }
    
    if (splitType === 'custom') {
      const totalShares = Object.values(customShares)
        .filter((_, i) => splitAmong.includes(Object.keys(customShares)[i]))
        .reduce((sum, share) => sum + share, 0);
      
      if (Math.abs(totalShares - parseFloat(amount)) > 0.01) {
        setError('The sum of shares must equal the total amount');
        return false;
      }
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Prepare custom shares if using custom split
      let shares = {};
      if (splitType === 'custom') {
        splitAmong.forEach(memberId => {
          shares[memberId] = customShares[memberId];
        });
      }
      
      const response = await axios.post(`/api/groups/${groupId}/expense`, {
        description,
        amount: parseFloat(amount),
        paidBy,
        splitAmong,
        splitType,
        ...(splitType === 'custom' && { shares }),
        category
      });
      
      onExpenseAdded(response.data.expense);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
      setLoading(false);
    }
  };

  // Calculate equal split amount
  const equalSplitAmount = splitAmong.length > 0 
    ? (parseFloat(amount) || 0) / splitAmong.length 
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add New Expense</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What was this expense for?"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="paidBy" className="block text-gray-700 mb-2">
              Paid by
            </label>
            <select
              id="paidBy"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select who paid</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Other">Other</option>
              <option value="Food">Food & Drink</option>
              <option value="Transportation">Transportation</option>
              <option value="Housing">Housing</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Split Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="splitType"
                  value="equal"
                  checked={splitType === 'equal'}
                  onChange={() => setSplitType('equal')}
                  className="mr-2"
                />
                Equal
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="splitType"
                  value="custom"
                  checked={splitType === 'custom'}
                  onChange={() => setSplitType('custom')}
                  className="mr-2"
                />
                Custom
              </label>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Split Among
            </label>
            <div className="border border-gray-300 rounded-md p-3">
              {members.map((member) => (
                <div key={member._id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={splitAmong.includes(member._id)}
                      onChange={() => handleSplitToggle(member._id)}
                      className="mr-2"
                    />
                    {member.name}
                  </label>
                  
                  {splitType === 'equal' ? (
                    <span className="text-gray-700">
                      {splitAmong.includes(member._id) ? `$${equalSplitAmount.toFixed(2)}` : '$0.00'}
                    </span>
                  ) : (
                    <input
                      type="number"
                      value={customShares[member._id] || ''}
                      onChange={(e) => handleCustomShareChange(member._id, e.target.value)}
                      min="0"
                      step="0.01"
                      disabled={!splitAmong.includes(member._id)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Settlement Modal Component
const SettlementModal = ({ settlements, members, onClose, onSettle }) => {
  const [loading, setLoading] = useState(false);

  const getMemberName = (memberId) => {
    const member = members.find(m => m._id === memberId);
    return member ? member.name : 'Unknown';
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Settlement Plan</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        {settlements.length > 0 ? (
          <div>
            <p className="text-gray-700 mb-4">
              Follow these payments to settle all debts in the group:
            </p>
            <ul className="space-y-4">
              {settlements.map((settlement, index) => (
                <li key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{getMemberName(settlement.from)} pays {getMemberName(settlement.to)}</p>
                      <p className="text-lg font-bold">${parseFloat(settlement.amount).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => {
                        setLoading(true);
                        onSettle(settlement.from, settlement.to, settlement.amount);
                      }}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:bg-green-400"
                      disabled={loading}
                    >
                      {loading ? 'Recording...' : 'Record Payment'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center py-4 text-gray-700">
            All balances are settled! No payments needed.
          </p>
        )}
        
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;