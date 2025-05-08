
import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FriendsSelectionPopup from "./FriendsSelectionPopup";
import CreateGroupModal from "./CreateGroupModal";

function Landing({ userData }) {
    
    const navigate = useNavigate();
    const [expenseGroups, setExpenseGroups] = useState([]);
    const [isFriendsPopupOpen, setIsFriendsPopupOpen] = useState(false);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        axios
            .get("/api/groupCards", { withCredentials: true })
            .then((response) => setExpenseGroups(response.data))
            .catch((error) => {
                console.error("Error fetching groups:", error);
                if (error.response && error.response.status === 401) {
                    navigate("/login");
                }
            });
    }, []);
    
    const handleCreateGroup = () => {
        setIsFriendsPopupOpen(true);
    };
    
    const handleFriendsSelected = (selectedFriendIds) => {
        console.log("Selected friends:", selectedFriendIds);
        setSelectedFriends(selectedFriendIds);
        setIsFriendsPopupOpen(false);
        
        // Show the create group modal after selecting friends
        setIsCreateGroupModalOpen(true);
    };
    
    const handleGroupCreated = (groupId) => {
        setIsCreateGroupModalOpen(false);
        
        // Show success message
        setShowConfirmation(true);
        setTimeout(() => {
            setShowConfirmation(false);
            // Navigate to the newly created group details page
            navigate(`/groups/${groupId}`);
        }, 1500);
    };
    
    // Success message component
    const SuccessMessage = () => (
      <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg flex items-center">
        <FiCheck className="mr-2" size={20} />
        <span>Group created successfully!</span>
      </div>
    );
    
    return (
        <>
            <div className="p-4 bg-gray-100">
                <div className="bg-white rounded-lg mt-24 shadow-md p-6 mb-6">
                    <h1 className="text-2xl font-bold mb-2">Hi, {userData?.name || 'User'}!</h1>
                    <p className="text-gray-600">Here are your friends</p>
                </div>
                
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">My Groups</h2>
                        <button 
                            className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded-md flex items-center"
                            onClick={handleCreateGroup}
                        >
                            <FiPlus className="mr-2" />
                            Create Group
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {expenseGroups.map((group, index) => (
                            <div 
                                key={index} 
                                className="bg-white rounded-lg shadow-md p-4 cursor-pointer"
                                onClick={() => navigate(`/groups/${group._id}`)}
                            >
                                <div className="flex justify-between mb-3">
                                    <h3 className="font-bold text-lg">{group.name}</h3>
                                    <span className="font-bold">$</span>
                                </div>
                                <div className="mb-3">
                                    <p className="text-gray-700">Total Expenses: ${group.totalExpenses?.toFixed(2)}</p>
                                </div>
                                <div>
                                    {group.members?.map((member, idx) => (
                                        <div key={idx} className="flex justify-between py-1 border-t">
                                            <span className="text-gray-600">{member.name}</span>
                                            <span className="text-gray-800">${member.amount?.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <FriendsSelectionPopup
                isOpen={isFriendsPopupOpen}
                onClose={() => setIsFriendsPopupOpen(false)}
                onConfirm={handleFriendsSelected}
            />
            
            <CreateGroupModal
                isOpen={isCreateGroupModalOpen}
                onClose={() => setIsCreateGroupModalOpen(false)}
                selectedFriends={selectedFriends}
                onGroupCreated={handleGroupCreated}
            />
            
            {showConfirmation && <SuccessMessage />}
        </>
    );
}

export default Landing;
