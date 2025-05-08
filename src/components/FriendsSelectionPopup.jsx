
import React, { useState, useEffect } from "react";
import { FiX, FiSearch, FiUserPlus, FiCheck } from "react-icons/fi";

const FriendsSelectionPopup = ({ isOpen, onClose, onConfirm }) => {
  // Sample friends data (replace with your API call)
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch friends from API
      setIsLoading(true);
      fetchFriends();
    }
  }, [isOpen]);

  const fetchFriends = async () => {
    try {
      const response = await fetch('/api/friends');
      const data = await response.json();
      setFriends(data.friends || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
      // Fallback to sample data if API fails
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
  
  const handleAddFriend = () => {
    // Basic email validation
    if (!newFriendEmail || !/\S+@\S+\.\S+/.test(newFriendEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    setIsChecking(true);
    
    // Check if email exists in friends list
    const emailExists = friends.some(friend => 
      friend.email.toLowerCase() === newFriendEmail.toLowerCase()
    );
    
    if (emailExists) {
      setEmailError("This friend is already in your friends list");
      setIsChecking(false);
      return;
    }

    // In a real implementation, make an API call to check if user exists
    fetch(`/api/users/check-email?email=${encodeURIComponent(newFriendEmail)}`)
      .then(response => response.json())
      .then(data => {
        if (data.exists) {
          // Add the new friend to the list
          const newFriend = {
            _id: data.userId,
            name: data.name || newFriendEmail.split('@')[0],
            email: newFriendEmail
          };
          
          setFriends([...friends, newFriend]);
          setSelectedFriends([...selectedFriends, newFriend._id]);
          setNewFriendEmail("");
          setShowAddFriend(false);
          setEmailError("");
        } else {
          setEmailError("This email is not registered in our system");
        }
      })
      .catch(error => {
        console.error('Error checking email:', error);
        setEmailError("An error occurred. Please try again.");
      })
      .finally(() => {
        setIsChecking(false);
      });
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
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    {friend.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-sm text-gray-500">{friend.email}</p>
                  </div>
                </div>
                {selectedFriends.includes(friend._id) ? (
                  <div className="flex items-center text-green-500">
                    <span className="mr-2 text-sm font-medium">Added to group</span>
                    <FiCheck size={20} />
                  </div>
                ) : (
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center p-4 text-gray-500">No friends found</p>
          )}
        </div>

        {/* Add Friend button */}
        <div className="p-3 border-t">
          <button 
            className="flex items-center text-green-500 hover:text-green-600 font-medium"
            onClick={() => setShowAddFriend(true)}
          >
            <FiUserPlus className="mr-2" />
            Add a friend
          </button>
        </div>

        {/* Add Friend Popup */}
        {showAddFriend && (
          <div className="border-t p-4">
            <h3 className="text-lg mb-3">Add Friend</h3>
            <p className="text-sm text-gray-600 mb-3">
              Enter your friend's email address to send them a friend request.
            </p>
            <div className="relative mb-3">
              <input
                type="email"
                placeholder="friend@example.com"
                className={`w-full p-2 border rounded-md ${emailError ? 'border-red-500' : ''}`}
                value={newFriendEmail}
                onChange={(e) => {
                  setNewFriendEmail(e.target.value);
                  setEmailError("");
                }}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">
                  <span className="mr-1">⚠️</span>
                  {emailError}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                className="px-4 py-2 border rounded-md"
                onClick={() => {
                  setShowAddFriend(false);
                  setEmailError("");
                  setNewFriendEmail("");
                }}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
                onClick={handleAddFriend}
                disabled={isChecking}
              >
                {isChecking ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Checking...
                  </>
                ) : "Add Friend"}
              </button>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end p-4 border-t">
          <button 
            className="px-4 py-2 border rounded-md mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 cursor-pointer bg-green-500 text-white rounded-md hover:bg-green-600"
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
