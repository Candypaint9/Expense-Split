import React, { useState } from "react";

function Profile() {
  // Sample user data - in a real app, this would come from your state management or API
  const [user, setUser] = useState({
    name: "Name",
    email: "user@example.com",
    phone: "+91 9876543210",
    upiId: "user@upi",
    qrCode: null,
    balance: {
      totalOwed: 1250.00,
      totalOwe: 8000.00
    }
  });

  // Handle QR code upload
  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUser({...user, qrCode: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg mt-10 shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <span>My Profile</span>
        </h1>
        
        {/* Balance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`p-4 rounded-lg ${user.balance.totalOwed > user.balance.totalOwe ? "bg-green-100" : "bg-red-100"}`}>
            <h2 className="text-xl font-semibold mb-2">Overall Balance</h2>
            {user.balance.totalOwed > user.balance.totalOwe ? (
              <p className="text-2xl font-bold text-green-600">
                You are owed ₹{(user.balance.totalOwed - user.balance.totalOwe).toFixed(2)}
              </p>
            ) : (
              <p className="text-2xl font-bold text-red-600">
                You owe ₹{(user.balance.totalOwe - user.balance.totalOwed).toFixed(2)}
              </p>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="bg-white p-3 rounded-md">
                <p className="text-sm text-gray-600">Total you owe</p>
                <p className="text-lg font-semibold text-red-500">₹{user.balance.totalOwe.toFixed(2)}</p>
              </div>
              <div className="bg-white p-3 rounded-md">
                <p className="text-sm text-gray-600">Total you're owed</p>
                <p className="text-lg font-semibold text-green-500">₹{user.balance.totalOwed.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          {/* UPI QR Code */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Payment QR Code</h2>
            <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg mb-2 bg-white">
              {user.qrCode ? (
                <img src={user.qrCode} alt="UPI QR Code" className="max-h-full" />
              ) : (
                <div className="text-center p-4">
                  <p className="text-gray-500 mb-2">No QR code uploaded</p>
                  <label className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-green-600">
                    Upload QR Code
                    <input type="file" accept="image/*" className="hidden" onChange={handleQrUpload} />
                  </label>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 text-center">Share your QR code to receive payments</p>
          </div>
        </div>
        
        {/* Personal Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium mb-1">Name</label>
                <div className="bg-white p-3 rounded-md border border-gray-200">
                  {user.name}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium mb-1">Email Address</label>
                <div className="bg-white p-3 rounded-md border border-gray-200">
                  {user.email}
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium mb-1">Mobile Number</label>
                <div className="bg-white p-3 rounded-md border border-gray-200">
                  {user.phone}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium mb-1">UPI ID</label>
                <div className="bg-white p-3 rounded-md border border-gray-200">
                  {user.upiId}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
