import React, { useState } from "react";

function FriendsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dummy data for friends with raw values
  const rawFriendsData = [
    { 
      id: 1, 
      name: "Kalp", 
      email: "kalp@gmail.com", 
      owesYou: 320.25, 
      youOwe: 100.00,
      image: "/api/placeholder/40/40"
    },
    { 
      id: 2, 
      name: "Shah", 
      email: "kalp@gmail.com", 
      owesYou: 0, 
      youOwe: 212.25,
      image: "/api/placeholder/40/40"
    },
    { 
      id: 3, 
      name: "Aditya", 
      email: "kalp@gmail.com", 
      owesYou: 800.25, 
      youOwe: 0,
      image: "/api/placeholder/40/40"
    },
    { 
      id: 4, 
      name: "Advait", 
      email: "kalp@gmail.com", 
      owesYou: 1700.50, 
      youOwe: 0,
      image: "/api/placeholder/40/40"
    },
    { 
      id: 5, 
      name: "Sameer", 
      email: "kalp@gmail.com", 
      owesYou: 150.08, 
      youOwe: 0,
      image: "/api/placeholder/40/40"
    },
    { 
      id: 6, 
      name: "Aayush", 
      email: "kalp@gmail.com", 
      owesYou: 0, 
      youOwe: 300.17,
      image: "/api/placeholder/40/40"
    },
  ];

  // Process friend data to calculate net balance
  const friendsData = rawFriendsData.map(friend => {
    // Calculate net balance (positive means they owe you, negative means you owe them)
    const netBalance = friend.owesYou - friend.youOwe;
    
    return {
      ...friend,
      netBalance
    };
  });

  // Filter friends based on search term
  const filteredFriends = friendsData.filter(friend => 
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg mt-20 shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">Hi, Aditya! </h1>
          <p className="text-gray-600">Here are your friends</p>
        </div>

        {/* Friends Management */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">My Friends</h2>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Friend
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search friends..."
              className="w-full p-3 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Friends List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredFriends.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredFriends.map((friend, index) => (
                <li 
                  key={friend.id} 
                  className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                    index === filteredFriends.length - 1 ? "" : "border-b border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 text-green-500 rounded-full flex items-center justify-center mr-3 font-bold">
                        {friend.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{friend.name}</h3>
                        <p className="text-gray-500 text-sm">{friend.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* Net Balance */}
                      <div className="text-right hidden md:block">
                        {friend.netBalance > 0 && (
                          <p className="text-green-600 font-semibold">
                            Gets back ${friend.netBalance.toFixed(2)}
                          </p>
                        )}
                        {friend.netBalance < 0 && (
                          <p className="text-red-600 font-semibold">
                            Owes ${Math.abs(friend.netBalance).toFixed(2)}
                          </p>
                        )}
                        {friend.netBalance === 0 && (
                          <p className="text-gray-600">Settled up</p>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm whitespace-nowrap">
                          Add Expense
                        </button>
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm hidden sm:block whitespace-nowrap">
                          Settle Up
                        </button>
                        <div className="flex space-x-1">
                          <button className="text-gray-500 hover:text-green-500 p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button className="text-gray-500 hover:text-red-500 p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile view for balance - only visible on small screens */}
                  <div className="mt-2 md:hidden">
                    {friend.netBalance > 0 && (
                      <p className="text-green-600 font-semibold">
                        Gets back ${friend.netBalance.toFixed(2)}
                      </p>
                    )}
                    {friend.netBalance < 0 && (
                      <p className="text-red-600 font-semibold">
                        Owes ${Math.abs(friend.netBalance).toFixed(2)}
                      </p>
                    )}
                    {friend.netBalance === 0 && (
                      <p className="text-gray-600">Settled up</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-600">No friends found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FriendsPage;