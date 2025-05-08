import React, { useState, useEffect } from "react";
import { FiX, FiSearch, FiCheck } from "react-icons/fi";
import axios from "../axios"; // Ensure this points to your configured Axios instance

const FriendsSelectionPopup = ({ isOpen, onClose, onConfirm }) => {
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            fetchFriends();
        }
    }, [isOpen]);

    const fetchFriends = async () => {
        try {
            const response = await axios.get("/api/friends", { withCredentials: true });
            setFriends(response.data || []);
        } catch (error) {
            console.error("Error fetching friends:", error);
            setFriends([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectFriend = (friendId) => {
        if (selectedFriends.includes(friendId)) {
            setSelectedFriends(selectedFriends.filter(id => id !== friendId));
        } else {
            setSelectedFriends([...selectedFriends, friendId]);
        }
    };

    const filteredFriends = friends.filter(friend =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-medium">Select Friends</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Search bar */}
                <div className="p-4 border-b">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search friends..."
                            className="w-full p-2 pl-10 border rounded-md"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>

                {/* Friends list */}
                <div className="max-h-64 overflow-y-auto p-2">
                    {isLoading ? (
                        <div className="text-center p-4">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-500"></div>
                            <p className="mt-2 text-gray-600">Loading friends...</p>
                        </div>
                    ) : filteredFriends.length > 0 ? (
                        filteredFriends.map(friend => (
                            <div
                                key={friend._id}
                                className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-md cursor-pointer"
                                onClick={() => handleSelectFriend(friend._id)}
                            >
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                        {friend.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium">{friend.name}</p>
                                        <p className="text-sm text-gray-500">{friend.email}</p>
                                    </div>
                                </div>
                                {selectedFriends.includes(friend._id) ? (
                                    <div className="flex items-center text-green-500">
                                        <span className="mr-2 text-sm font-medium">Selected</span>
                                        <FiCheck size={20} />
                                    </div>
                                ) : (
                                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center p-4 text-gray-500">No friends found</p>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex justify-end p-4 border-t">
                    <button
                        className="px-4 py-2 border rounded-md mr-2"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                        onClick={() => onConfirm(selectedFriends)}
                        disabled={selectedFriends.length === 0}
                    >
                        Done ({selectedFriends.length})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FriendsSelectionPopup;
