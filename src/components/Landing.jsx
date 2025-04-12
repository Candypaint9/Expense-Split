import React from "react";
import { FiPlus } from "react-icons/fi";
function Landing() {
  const expenseGroups = [
    {
      name: "Roommates",
      totalExpenses: 1200,
      members: [
        { name: "Kalp", amount: 400, isPositive: false },
        { name: "Aayush", amount: 200, isPositive: true },
        { name: "Advait", amount: 600, isPositive: true },
      ],
    },
    {
      name: "Trip",
      totalExpenses: 2500,
      members: [
        { name: "Sameer", amount: 800, isPositive: false },
        { name: "Aditya", amount: 1700, isPositive: true },
      ],
    },
    {
      name: "Work",
      totalExpenses: 450,
      members: [
        { name: "Kalp", amount: 150, isPositive: false },
        { name: "Sameer", amount: 300, isPositive: true },
      ],
    },
  ];
  return (
    <div className=' h-screen bg-gray-50'>
      <main className="bg-gray-50 flex-grow p-6">
        <div className="bg-white mt-20 rounded-md p-6 mb-6 shadow-sm">
          <h1 className="text-2xl font-bold">
            Hi, Name{" "}
            <span role="img" aria-label="wave">
              👋
            </span>
          </h1>
          <p className="text-gray-600">Here are your expense groups</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">My Groups</h2>
            <a
              href="./new_group"
              className="bg-green-500 text-white px-4 py-2 rounded-md flex gap-1.5 items-center justify-center"
            >
              <FiPlus />
              Create Group
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expenseGroups.map((group, index) => (
              <div key={index} className="bg-white rounded-md shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">{group.name}</h3>
                  <span className="text-green-500 text-xl">$</span>
                </div>
                <p className="text-gray-600 mb-4">
                  Total Expenses: ${group.totalExpenses.toFixed(2)}
                </p>
                <div className="space-y-2">
                  {group.members.map((member, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center"
                    >
                      <span
                        className={
                          member.isPositive ? "text-green-600" : "text-red-600"
                        }
                      >
                        {member.name}: ${member.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;
