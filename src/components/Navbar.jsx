import React from "react";
import { Link, useLocation } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { FiLogIn } from "react-icons/fi";
import { GrTransaction } from "react-icons/gr";

function Navbar({ isLoggedIn, handleLogout }) {
    // Get current location to determine active page
    const location = useLocation();
    const currentPath = location.pathname;

    // determine if a link is active
    const isActive = (path) => {
        if (path === "/") {
            // Check for both root, /landing, and Groups link
            return currentPath === "/" || currentPath === "/landing";
        }
        return currentPath.startsWith(path);
    };

    // Active link styling
    const activeLinkClass = "flex items-center gap-1 font-bold text-white border-b-2 border-white pb-1";
    const normalLinkClass = "flex items-center gap-1 hover:text-white";

    let authLink;

    if (isLoggedIn) {
        authLink = (
            <button
                onClick={handleLogout}
                className={isActive("/logout") ? activeLinkClass : normalLinkClass + " ml-100 mr-3"}
            >
                <FiLogOut />
                Logout
            </button>
        );
    } else {
        authLink = (
            <Link 
                to="/login" 
                className={isActive("/login") ? activeLinkClass : normalLinkClass + " ml-100 mr-3"}
            >
                <FiLogIn />
                Login
            </Link>
        );
    }

    return (
        <div>
            <div className="fixed z-[999] backdrop-blur-lg w-full px-5 flex justify-between bg-green-500 h-15 text-lg font-['Inter'] items-center text-white py-3">
                <div className="font-bold text-2xl">Expense Split</div>
                <div className="flex space-x-10 items-center">
                    <Link 
                        to="/" 
                        className={isActive("/") ? activeLinkClass : normalLinkClass}
                    >
                        <IoHomeOutline />
                        Groups
                    </Link>

                    <Link 
                        to="/friends" 
                        className={isActive("/friends") ? activeLinkClass : normalLinkClass}
                    >
                        <FaUserFriends />
                        Friends
                    </Link>

                    <Link 
                        to="/profile" 
                        className={isActive("/profile") ? activeLinkClass : normalLinkClass}
                    >
                        <CgProfile />
                        Profile
                    </Link>

                    <Link 
                        to="/activity" 
                        className={isActive("/activity") ? activeLinkClass : normalLinkClass}
                    >
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