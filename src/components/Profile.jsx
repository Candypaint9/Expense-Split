import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

function Profile({ userData }) {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/api/profile", { withCredentials: true })
            .then((res) => {
                setProfileData(res.data);
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    navigate("/login");
                } else {
                    console.error("Unexpected error:", error);
                }
            });
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/profile/update", {
                phone: profileData.phone,
                upiId: profileData.upiId,
                qrCode: profileData.qrCode,
            }, { withCredentials: true });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    const handleQrUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfileData(prev => ({ ...prev, qrCode: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (!userData || !profileData) {
        return <div className="text-center mt-20 text-gray-600">Loading profile...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white rounded-lg mt-10 shadow-md p-6 mb-6">
                <h1 className="text-3xl font-bold mb-6">My Profile</h1>

                {/* Balance Summary - COMMENTED OUT */}
                {/*
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className={`p-4 rounded-lg ${profileData.balance.totalOwed > profileData.balance.totalOwe ? "bg-green-100" : "bg-red-100"}`}>
                        <h2 className="text-xl font-semibold mb-2">Overall Balance</h2>
                        {profileData.balance.totalOwed > profileData.balance.totalOwe ? (
                            <p className="text-2xl font-bold text-green-600">
                                You are owed ₹{(profileData.balance.totalOwed - profileData.balance.totalOwe).toFixed(2)}
                            </p>
                        ) : (
                            <p className="text-2xl font-bold text-red-600">
                                You owe ₹{(profileData.balance.totalOwe - profileData.balance.totalOwed).toFixed(2)}
                            </p>
                        )}
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="bg-white p-3 rounded-md">
                                <p className="text-sm text-gray-600">Total you owe</p>
                                <p className="text-lg font-semibold text-red-500">₹{profileData.balance.totalOwe.toFixed(2)}</p>
                            </div>
                            <div className="bg-white p-3 rounded-md">
                                <p className="text-sm text-gray-600">Total you're owed</p>
                                <p className="text-lg font-semibold text-green-500">₹{profileData.balance.totalOwed.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                */}

                    {/* UPI QR Code */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Payment QR Code</h2>
                        <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg mb-2 bg-white">
                            {profileData.qrCode ? (
                                <img src={profileData.qrCode} alt="UPI QR Code" className="max-h-full" />
                            ) : (
                                <div className="text-center p-4">
                                    <p className="text-gray-500 mb-2">No QR code uploaded</p>
                                    {isEditing && (
                                        <label className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-green-600">
                                            Upload QR Code
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleQrUpload}
                                            />
                                        </label>
                                    )}
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 text-center">Share your QR code to receive payments</p>
                    </div>
                {/* </div> END grid container of balance + QR */}


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
                                {/* Name - readonly */}
                                <div className="mb-4">
                                    <label className="block text-gray-600 text-sm font-medium mb-1">Name</label>
                                    <div className="bg-white p-3 rounded-md border border-gray-200">
                                        {userData.name || "Not set"}
                                    </div>
                                </div>

                                {/* Email - readonly */}
                                <div className="mb-4">
                                    <label className="block text-gray-600 text-sm font-medium mb-1">Email Address</label>
                                    <div className="bg-white p-3 rounded-md border border-gray-200">
                                        {userData.email || "Not set"}
                                    </div>
                                </div>
                            </div>

                            <div>
                                {/* Phone */}
                                <div className="mb-4">
                                    <label className="block text-gray-600 text-sm font-medium mb-1">Mobile Number</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone || ""}
                                            onChange={handleInputChange}
                                            className="w-full p-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                        />
                                    ) : (
                                        <div className="bg-white p-3 rounded-md border border-gray-200">
                                            {profileData.phone || "Not set"}
                                        </div>
                                    )}
                                </div>

                                {/* UPI ID */}
                                <div className="mb-4">
                                    <label className="block text-gray-600 text-sm font-medium mb-1">UPI ID</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="upiId"
                                            value={profileData.upiId || ""}
                                            onChange={handleInputChange}
                                            className="w-full p-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                        />
                                    ) : (
                                        <div className="bg-white p-3 rounded-md border border-gray-200">
                                            {profileData.upiId || "Not set"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
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
