import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile({ userData, setUserData }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(userData);
    const navigate = useNavigate();

    // Update formData when userData changes
    useEffect(() => {
        setFormData(userData);
    }, [userData]);

    useEffect(() => {
        axios.get("/api/profile", { withCredentials: true })
            .then((res) => {
                //setUserData(res.data);       // Set full profile data
                //setFormData(res.data);
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    navigate("/login");      // Not authenticated
                } else {
                    console.error("Unexpected error:", error);
                }
            });
    }, [navigate, setUserData]);    


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setUserData(formData);
        setIsEditing(false);
    };

    const handleQrUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData(prev => ({ ...prev, qrCode: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white rounded-lg mt-10 shadow-md p-6 mb-6">
                <h1 className="text-3xl font-bold mb-6">My Profile</h1>

                {/* Balance Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className={`p-4 rounded-lg ${userData.balance.totalOwed > userData.balance.totalOwe ? "bg-green-100" : "bg-red-100"}`}>
                        <h2 className="text-xl font-semibold mb-2">Overall Balance</h2>
                        {userData.balance.totalOwed > userData.balance.totalOwe ? (
                            <p className="text-2xl font-bold text-green-600">
                                You are owed ₹{(userData.balance.totalOwed - userData.balance.totalOwe).toFixed(2)}
                            </p>
                        ) : (
                            <p className="text-2xl font-bold text-red-600">
                                You owe ₹{(userData.balance.totalOwe - userData.balance.totalOwed).toFixed(2)}
                            </p>
                        )}
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="bg-white p-3 rounded-md">
                                <p className="text-sm text-gray-600">Total you owe</p>
                                <p className="text-lg font-semibold text-red-500">₹{userData.balance.totalOwe.toFixed(2)}</p>
                            </div>
                            <div className="bg-white p-3 rounded-md">
                                <p className="text-sm text-gray-600">Total you're owed</p>
                                <p className="text-lg font-semibold text-green-500">₹{userData.balance.totalOwed.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* UPI QR Code */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Payment QR Code</h2>
                        <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg mb-2 bg-white">
                            {userData.qrCode ? (
                                <img src={userData.qrCode} alt="UPI QR Code" className="max-h-full" />
                            ) : (
                                <div className="text-center p-4">
                                    <p className="text-gray-500 mb-2">No QR code uploaded</p>
                                    <label className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-green-600">
                                        Upload QR Code
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleQrUpload}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 text-center">Share your QR code to receive payments</p>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Personal Information</h2>
                        {!isEditing && (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 cursor-pointer"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="mb-4">
                                    <label className="block text-gray-600 text-sm font-medium mb-1">Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full p-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                        />
                                    ) : (
                                        <div className="bg-white p-3 rounded-md border border-gray-200">
                                            {userData.name || "Not set"}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-600 text-sm font-medium mb-1">Email Address</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full p-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                        />
                                    ) : (
                                        <div className="bg-white p-3 rounded-md border border-gray-200">
                                            {userData.email || "Not set"}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="mb-4">
                                    <label className="block text-gray-600 text-sm font-medium mb-1">Mobile Number</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full p-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                        />
                                    ) : (
                                        <div className="bg-white p-3 rounded-md border border-gray-200">
                                            {userData.phone || "Not set"}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-600 text-sm font-medium mb-1">UPI ID</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="upiId"
                                            value={formData.upiId}
                                            onChange={handleInputChange}
                                            className="w-full p-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                        />
                                    ) : (
                                        <div className="bg-white p-3 rounded-md border border-gray-200">
                                            {userData.upiId || "Not set"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(userData);
                                        setIsEditing(false);
                                    }}
                                    className="px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 cursor-pointer"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;