import React from "react";
import { IoHomeOutline } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { GrTransaction } from "react-icons/gr";

function navbar() {
  return (
    <div>
      <div className=" fixed z-[999] backdrop-blur-lg w-full px-5 flex justify-between bg-green-500 h-15 text-lg font-['NeueMontreal-Regular'] items-center">
        <div className="font-bold text-2xl">Expense Split</div>
        <div className="flex space-x-10 items-center">
          <a href="/groups" className="flex items-center gap-1">
            <IoHomeOutline />
            Groups
          </a>
          <a href="/friends" className="flex items-center gap-1">
            <FaUserFriends />
            Friends
          </a>
          <a href="/profile" className="flex items-center gap-1">
            <CgProfile />
            Profile
          </a>
          <a href="/about" className="flex items-center gap-1">
            <GrTransaction />
            Activity
          </a>
          <a href="/logout" className="flex items-center ml-100 mr-3 gap-1">
            <FiLogOut />
            Logout
          </a>
        </div>
      </div>
    </div>
  );
}

export default navbar;
