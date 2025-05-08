
import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import axios from 'axios';

const CreateGroupModal = ({ isOpen, onClose, selectedFriends, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }
    
    if (selectedFriends.length === 0) {
      setError('Please select at least one friend');
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post('/api/groups/create', {
        name: groupName,
        members: selectedFriends
      });
      
      setLoading(false);
      
      // Call the callback with the new group ID
      if (response.data && response.data.group && response.data.group._id) {
        onGroupCreated(response.data.group._id);
      } else {
        // If the response format is unexpected, handle it gracefully
        console.error('Unexpected response format:', response.data);
        setError('Error creating group: Invalid response from server');
      }
    } catch (err) {
      setLoading(false);
      console.error('Error creating group:', err);
      setError(err.response?.data?.message || 'Failed to create group');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-medium">Create New Group</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="groupName" className="block text-gray-700 mb-2">
                Group Name
              </label>
              <input
                type="text"
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter group name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Selected Friends ({selectedFriends.length})
              </label>
              <p className="text-sm text-gray-500">
                You've selected {selectedFriends.length} friend{selectedFriends.length !== 1 ? 's' : ''} for this group.
              </p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-end p-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={loading || !groupName.trim() || selectedFriends.length === 0}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Group...
                </div>
              ) : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;