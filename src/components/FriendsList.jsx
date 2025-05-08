import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";
import axios from 'axios';
import AddFriendModal from "./AddFriendModal";

function FriendsPage({ userData }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);

    const [rawFriendsData, setRawFriendsData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/friends', { withCredentials: true })
            .then((response) => setRawFriendsData(response.data))
            .catch((error) => {
                console.error("Error fetching friends:", error);
                if (error.response && error.response.status === 401) {
                    navigate("/login");
                }
            });
    }, [navigate]);

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

    // Handle new friend added
    const handleFriendAdded = (newFriend) => {
        setRawFriendsData(prevFriends => [...prevFriends, newFriend]);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto py-8 px-4">
                <div className="bg-white rounded-lg mt-20 shadow-md p-6 mb-6">
                    <h1 className="text-2xl font-bold mb-2">Hi, {userData?.name || 'User'}!</h1>
                    <p className="text-gray-600">Here are your friends</p>
                </div>

                {/* Friends Management */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">My Friends</h2>
                    <button 
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
                        onClick={() => setIsAddFriendModalOpen(true)}
                    >
                        <FiPlus className="h-5 w-5 mr-1" />
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
                            <FiSearch className="h-5 w-5" />
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
                                    className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${index === filteredFriends.length - 1 ? "" : "border-b border-gray-200"
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
                                            <div className="flex space-x-1">
                                                <button className="text-gray-500 hover:text-green-500 p-1">
                                                    <FiEdit2 className="h-5 w-5" />
                                                </button>
                                                <button className="text-gray-500 hover:text-red-500 p-1">
                                                    <FiTrash2 className="h-5 w-5" />
                                                </button>
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
                            <p className="text-gray-600">
                                {searchTerm 
                                    ? `No friends found matching "${searchTerm}"`
                                    : "You don't have any friends yet. Add some friends to get started!"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Add Friend Modal */}
                <AddFriendModal 
                    isOpen={isAddFriendModalOpen}
                    onClose={() => setIsAddFriendModalOpen(false)}
                    onFriendAdded={handleFriendAdded}
                />
            </div>
        </div>
    );
}

export default FriendsPage;