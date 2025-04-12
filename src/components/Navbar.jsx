import React from "react";
import { Link } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { FiLogIn } from "react-icons/fi";
import { GrTransaction } from "react-icons/gr";

function Navbar({ isLoggedIn }) {

    let authLink;

    if (isLoggedIn) {
        authLink = (
            <Link to="/logout" className="flex items-center ml-100 mr-3 gap-1">
                <FiLogOut />
                Logout
            </Link>
        );
    } else {
        authLink = (
            <Link to="/login" className="flex items-center ml-100 mr-3 gap-1">
                <FiLogIn />
                Login
            </Link>
        );
    }

    return (
        <div>
            <div className=" fixed z-[999] backdrop-blur-lg w-full px-5 flex justify-between bg-green-500 h-15 text-lg font-['NeueMontreal-Regular'] items-center">
                <div className="font-bold text-2xl">Expense Split</div>
                <div className="flex space-x-10 items-center">
                    <Link to="/" className="flex items-center gap-1">
                        <IoHomeOutline />
                        Groups
                    </Link>

                    <Link to="/friends" className="flex items-center gap-1">
                        <FaUserFriends />
                        Friends
                    </Link>

                    <Link to="/profile" className="flex items-center gap-1">
                        <CgProfile />
                        Profile
                    </Link>

                    <Link to="/activity" className="flex items-center gap-1">
                        <GrTransaction />
                        Activity
                    </Link>

                    {authLink}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
