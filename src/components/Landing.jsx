import React, { useState, useEffect, useMemo } from "react";
import { FiPlus, FiCheck } from "react-icons/fi";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import FriendsSelectionPopup from "./FriendsSelectionPopup";
import CreateGroupModal from "./CreateGroupModal";

function Landing({ userData }) {
  const navigate = useNavigate();

  // State for groups & friends
  const [groups, setGroups] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [isFriendsPopupOpen, setIsFriendsPopupOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // friends list for name lookup
  useEffect(() => {
    setLoadingFriends(true);
    axios
      .get("/api/friends", { withCredentials: true })
      .then((res) => setFriendsList(res.data))
      .catch((err) => {
        console.error("Error fetching friends:", err);
        setError(err);
      })
      .finally(() => setLoadingFriends(false));
  }, []);

  // expense groups
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingGroups(true);
      try {
        // Raw cards
        const { data: rawGroups } = await axios.get("/api/groupCards", {
          withCredentials: true,
        });

        // For each card, fetch full details
        const enriched = await Promise.all(
          rawGroups.map(async (g) => {
            const { data } = await axios.get(`/api/groups/${g._id}`, {
              withCredentials: true,
            });
            // data.group.expenses is an array of { amount, … }
            const totalExpenses = (data.group.expenses || []).reduce(
              (sum, e) => sum + (e.amount || 0),
              0
            );
            return { ...g, totalExpenses };
          })
        );

        if (mounted) setGroups(enriched);
      } catch (err) {
        console.error("Error fetching groups or details:", err);
        if (err.response?.status === 401) navigate("/login");
        else if (mounted) setError(err);
      } finally {
        mounted && setLoadingGroups(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  // friendId -> friendName, to get friend's names
  const nameById = useMemo(() => {
    const map = {};
    friendsList.forEach((f) => {
      map[f._id] = f.name;
    });
    return map;
  }, [friendsList]);

  // Handlers for create-group flow
  const handleCreateGroup = () => setIsFriendsPopupOpen(true);
  const handleFriendsSelected = (ids) => {
    setSelectedFriends(ids);
    setIsFriendsPopupOpen(false);
    setIsCreateGroupModalOpen(true);
  };
  const handleGroupCreated = (groupId) => {
    setIsCreateGroupModalOpen(false);
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      navigate(`/groups/${groupId}`);
    }, 1500);
  };

  const SuccessMessage = () => (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg flex items-center">
      <FiCheck className="mr-2" size={20} />
      <span>Group created successfully!</span>
    </div>
  );

  if (loadingFriends || loadingGroups) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading data. Please try again later.
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto py-8 px-4">
          <div className="bg-white rounded-lg mt-24 shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2">
              Hi, {userData?.name || "User"}!
            </h1>
            <p className="text-gray-600">Here are your groups</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">My Groups</h2>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-600"
                onClick={handleCreateGroup}
              >
                <FiPlus className="mr-2" /> Create Group
              </button>
            </div>

            {groups.length === 0 ? (
              <p className="text-gray-600">No groups found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map((group) => {
                  const memberNames = (group.members || [])
                    .slice(0, 5)
                    .map((idRaw) => nameById[String(idRaw)] || "You");

                  const memberDisplay = memberNames.join(", ");
                  const hasMoreMembers = (group.members || []).length > 5;

                  return (
                    <div
                      key={group._id}
                      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
                      onClick={() => navigate(`/groups/${group._id}`)}
                    >
                      {/* Group title */}
                      <h3 className="font-bold text-lg mb-3">{group.name}</h3>

                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-700">Total Expenses:</span>
                        <span className="font-bold">
                          ${group.totalExpenses?.toFixed(2) || "0.00"}
                        </span>
                      </div>

                      <div className="text-gray-600">
                        Members: {memberDisplay}
                        {hasMoreMembers ? "..." : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
