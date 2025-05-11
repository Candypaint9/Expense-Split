// import React, { useState, useEffect } from 'react';
// import axios from '../axios';
// import { Link, useNavigate } from 'react-router-dom';
// import { format } from 'date-fns';

// const GroupList = () => {
//   const [groups, setGroups] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   // Fetch user's groups
//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('/api/groups');
//         setGroups(response.data.groups);
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch groups');
//         setLoading(false);
//       }
//     };

//     fetchGroups();
//   }, []);

//   if (loading) {
//     return <div className="text-center py-8">Loading your groups...</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Your Groups</h1>
//         <button 
//           onClick={() => navigate('/groups/create')}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//         >
//           Create New Group
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
//           {error}
//         </div>
//       )}

//       {groups.length === 0 ? (
//         <div className="bg-white rounded-lg shadow-md p-6 text-center">
//           <p className="text-gray-600 mb-4">You don't have any groups yet.</p>
//           <p className="mb-6">Create a group to start splitting expenses with friends!</p>
//           <button 
//             onClick={() => navigate('/groups/create')}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Create Your First Group
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {groups.map((group) => (
//             <GroupCard key={group._id} group={group} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const GroupCard = ({ group }) => {
//   return (
//     <Link 
//       to={`/groups/${group._id}`}
//       className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
//     >
//       <div className="p-6">
//         <h2 className="text-xl font-bold mb-2">{group.name}</h2>
//         <div className="flex items-center text-gray-600 mb-4">
//           <span className="mr-2">
//             {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
//           </span>
//           <span className="mx-2">•</span>
//           <span>
//             Created {format(new Date(group.createdAt), 'MMM d, yyyy')}
//           </span>
//         </div>

//         <div className="flex flex-wrap gap-2 mb-4">
//           {group.members.slice(0, 5).map((member) => (
//             <div 
//               key={member._id}
//               className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 text-sm font-medium"
//               title={member.name}
//             >
//               {member.name.charAt(0).toUpperCase()}
//             </div>
//           ))}
//           {group.members.length > 5 && (
//             <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
//               +{group.members.length - 5}
//             </div>
//           )}
//         </div>

//         {group.expenses && group.expenses.length > 0 ? (
//           <div>
//             <p className="text-sm text-gray-600 mb-1">
//               {group.expenses.length} {group.expenses.length === 1 ? 'expense' : 'expenses'}
//             </p>
//             <p className="text-sm text-gray-600">
//               Latest activity: {format(new Date(
//                 Math.max(...group.expenses.map(e => new Date(e.date)))
//               ), 'MMM d, yyyy')}
//             </p>
//           </div>
//         ) : (
//           <p className="text-sm text-gray-600">No expenses yet</p>
//         )}
//       </div>
//     </Link>
//   );
// };

// export default GroupList;