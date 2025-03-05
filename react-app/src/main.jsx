import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  PlusCircle, 
  Home,
  UserPlus,
  BookOpen,
  LogOut,
  Calendar,
  Tag,
  CreditCard,
  Info,
  User,
  Divide
} from 'lucide-react';

// Navigation Component
function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="bg-green-600 text-white p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">SplitMate</div>
      <div className="flex space-x-6">
        <button 
          className={`flex items-center ${
            activeTab === 'home' 
              ? 'text-white font-bold' 
              : 'text-green-200 hover:text-white'
          }`}
          onClick={() => setActiveTab('home')}
        >
          <Home className="mr-2" /> Groups
        </button>
        <button 
          className={`flex items-center ${
            activeTab === 'friends' 
              ? 'text-white font-bold' 
              : 'text-green-200 hover:text-white'
          }`}
          onClick={() => setActiveTab('friends')}
        >
          <Users className="mr-2" /> Friends
        </button>
        <button 
          className={`flex items-center ${
            activeTab === 'profile' 
              ? 'text-white font-bold' 
              : 'text-green-200 hover:text-white'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          <UserPlus className="mr-2" /> Profile
        </button>
        <button 
          className={`flex items-center ${
            activeTab === 'about' 
              ? 'text-white font-bold' 
              : 'text-green-200 hover:text-white'
          }`}
          onClick={() => setActiveTab('about')}
        >
          <BookOpen className="mr-2" /> About
        </button>
      </div>
      <button className="flex items-center text-red-200 hover:text-red-100">
        <LogOut className="mr-2" /> Logout
      </button>
    </nav>
  );
}

// Transaction Details Modal
function TransactionDetailsModal({ transaction, onClose }) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{transaction.description}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <Calendar className="mr-2 text-gray-500" />
            <span>{transaction.date}</span>
          </div>
          <div className="flex items-center">
            <Tag className="mr-2 text-gray-500" />
            <span>{transaction.category}</span>
          </div>
          <div className="flex items-center">
            <User className="mr-2 text-gray-500" />
            <span>Paid by {transaction.paidBy}</span>
          </div>
          <div className="flex items-center">
            <Divide className="mr-2 text-gray-500" />
            <span>Split Method: {transaction.splitMethod}</span>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Transaction Total</h3>
          <div className="flex justify-between">
            <span>Total Amount</span>
            <span className="font-bold text-green-600">
              ${transaction.amount.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold p-4 border-b">
            Participant Breakdown
          </h3>
          {transaction.participants.map((participant) => (
            <div 
              key={participant.name} 
              className="p-4 border-b flex justify-between items-center"
            >
              <div>
                <span className="font-medium">{participant.name}</span>
                {participant.percentage && (
                  <span className="text-sm text-gray-500 ml-2">
                    ({participant.percentage}%)
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span 
                  className={
                    participant.status === 'Paid More' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }
                >
                  {participant.status === 'Paid More' ? 'Paid' : 'Owes'}
                  : ${participant.status === 'Paid More' ? participant.paid.toFixed(2) : participant.share.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {transaction.notes && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">
              <Info className="inline mr-2 text-gray-500" />
              Additional Notes
            </h3>
            <p className="text-gray-700">{transaction.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Group Details Component
function GroupDetails({ group, transactions, onBack }) {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  return (
    <div className="p-6">
      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <TransactionDetailsModal 
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}

      {/* Group Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <button 
            onClick={onBack} 
            className="text-gray-600 hover:text-gray-800 mr-4"
          >
            ← Back to Groups
          </button>
          <h1 className="text-2xl font-bold inline">{group.name}</h1>
        </div>
        <button className="bg-blue-500 text-white p-2 rounded flex items-center">
          <PlusCircle className="mr-2" /> Add Expense
        </button>
      </div>

      {/* Transactions List */}
      <div className="grid gap-4">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedTransaction(transaction)}
          >
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Calendar className="text-gray-500" size={20} />
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {transaction.date} • Paid by {transaction.paidBy}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Tag className="text-gray-500 mr-2" size={16} />
                  <span className="text-sm text-gray-600">
                    {transaction.category}
                  </span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="text-gray-500 mr-2" size={16} />
                  <span className="font-semibold text-green-600">
                    ${transaction.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Group Card Component
function GroupCard({ group, onSelect }) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={() => onSelect(group)}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{group.name}</h3>
        <DollarSign 
          className={
            group.totalExpense > 0 
              ? 'text-green-600' 
              : 'text-red-600'
          } 
          size={20} 
        />
      </div>
      <div className="text-sm text-gray-500 mb-2">
        Total Expenses: ${group.totalExpense.toFixed(2)}
      </div>
      <div className="flex justify-between">
        {group.members.map((member) => (
          <span 
            key={member.name}
            className={
              member.owes > 0 
                ? 'text-red-600 text-xs' 
                : 'text-green-600 text-xs'
            }
          >
            {member.name}: {member.owes > 0 ? '↑' : '↓'} 
            ${Math.abs(member.owes).toFixed(2)}
          </span>
        ))}
      </div>
    </div>
  );
}

// Main Dashboard Component
function ExpenseDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const username = "Alice";

  // Mock data for groups and transactions
  const groups = [
    { 
      id: 1, 
      name: 'Roommates', 
      totalExpense: 1245.50, 
      members: [
        { name: 'Alice', owes: 412.50 },
        { name: 'Bob', owes: -200.25 },
        { name: 'Charlie', owes: -212.25 }
      ]
    },
    { 
      id: 2, 
      name: 'Europe Trip', 
      totalExpense: 2500.75, 
      members: [
        { name: 'David', owes: 800.25 },
        { name: 'Emma', owes: -1700.50 }
      ]
    },
    { 
      id: 3, 
      name: 'Work Lunch', 
      totalExpense: 450.25, 
      members: [
        { name: 'John', owes: 150.08 },
        { name: 'Sarah', owes: -300.17 }
      ]
    }
  ];

  // Mock transactions data
  const mockTransactions = [
    {
      id: 1,
      date: '2024-03-01',
      description: 'Weekly Grocery Shopping',
      amount: 145.50,
      paidBy: 'Alice',
      category: 'Food',
      splitMethod: 'Equal',
      participants: [
        { 
          name: 'Alice', 
          share: 48.50, 
          paid: 145.50,
          status: 'Paid More' 
        },
        { 
          name: 'Bob', 
          share: 48.50, 
          paid: 0,
          status: 'Owes' 
        },
        { 
          name: 'Charlie', 
          share: 48.50, 
          paid: 0,
          status: 'Owes' 
        }
      ],
      notes: 'Included vegetables, snacks, and cleaning supplies'
    },
    // Add more mock transactions as needed
  ];

  return (
    <div className="flex flex-col h-screen">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 bg-gray-100 overflow-y-auto">
        {selectedGroup ? (
          <GroupDetails 
            group={selectedGroup} 
            transactions={mockTransactions}
            onBack={() => setSelectedGroup(null)}
          />
        ) : (
          <>
            {/* Header with Greeting */}
            <div className="bg-white shadow-sm p-6">
              <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold">
                  Hi, {username}! 👋
                </h1>
                <p className="text-gray-600 mt-2">
                  Here are your expense groups
                </p>
              </div>
            </div>

            {/* Groups Grid */}
            <div className="p-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">My Groups</h2>
                  <button className="bg-green-500 text-white p-2 rounded flex items-center">
                    <PlusCircle className="mr-2" /> Create Group
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groups.map((group) => (
                    <GroupCard 
                      key={group.id} 
                      group={group} 
                      onSelect={setSelectedGroup} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ExpenseDashboard;
