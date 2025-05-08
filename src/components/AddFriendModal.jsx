import React, { useState } from "react";
import { FiMail, FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
import axios from 'axios';

function AddFriendModal({ isOpen, onClose, onFriendAdded }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Reset status when typing
    if (status !== null) {
      setStatus(null);
      setErrorMessage("");
    }
  };

  const addFriend = async () => {
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    
    try {
      // Call your backend API to check if user exists and add as friend
      const response = await axios.post('/api/friends/add', { email });
      
      // Friend added successfully
      setStatus('success');
      
      // If there's a callback function to update parent component
      if (onFriendAdded) {
        onFriendAdded(response.data);
      }
      
      // Clear input and close modal after success
      setTimeout(() => {
        setEmail("");
        setStatus(null);
        onClose();
      }, 2000);
      
    } catch (error) {
      setStatus('error');
      // Get error message from API if available
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("User doesn't exist or couldn't be added");
      }
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div 
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-headline"
        >
          {/* Modal header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-medium text-gray-900" id="modal-headline">
              Add Friend
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          
          {/* Modal body */}
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-4">
              Enter your friend's email address to add them to your friends list.
            </p>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="friend@example.com"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            
            {/* Status messages */}
            {status === 'error' && (
              <div className="mt-3 flex items-center text-sm text-red-600">
                <FiAlertCircle className="h-4 w-4 mr-2" />
                <span>{errorMessage}</span>
              </div>
            )}
            
            {status === 'success' && (
              <div className="mt-3 flex items-center text-sm text-green-600">
                <FiCheck className="h-4 w-4 mr-2" />
                <span>Friend added successfully!</span>
              </div>
            )}
          </div>
          
          {/* Modal footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                status === 'loading' 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              }`}
              onClick={addFriend}
              disabled={status === 'loading' || status === 'success'}
            >
              {status === 'loading' ? 'Adding...' : 'Add Friend'}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddFriendModal;