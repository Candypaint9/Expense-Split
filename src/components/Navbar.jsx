import React from "react";
import { Link, useLocation } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FiLogOut, FiLogIn } from "react-icons/fi";
import { GrTransaction } from "react-icons/gr";

function Navbar({ isLoggedIn, handleLogout }) {
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path) => {
        if (path === "/") {
            return currentPath === "/" || currentPath === "/landing";
        }
        return currentPath.startsWith(path);
    };

    const activeLinkClass = "flex items-center gap-1 font-bold text-white border-b-2 border-white pb-1";
    const normalLinkClass = "flex items-center gap-1 hover:text-white";

    return (
        <div className="fixed z-[999] backdrop-blur-lg w-full px-5 bg-green-500 text-white py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="font-bold text-2xl">Expense Split</div>

                <div className="flex space-x-10 items-center">
                    <Link to="/" className={isActive("/landing") ? activeLinkClass : normalLinkClass}>
                        <IoHomeOutline />
                        Groups
                    </Link>
                    <Link to="/friends" className={isActive("/friends") ? activeLinkClass : normalLinkClass}>
                        <FaUserFriends />
                        Friends
                    </Link>
                    <Link to="/profile" className={isActive("/profile") ? activeLinkClass : normalLinkClass}>
                        <CgProfile />
                        Profile
                    </Link>
                    {/* <Link to="/activity" className={isActive("/activity") ? activeLinkClass : normalLinkClass}>
                        <GrTransaction />
                        Activity
                    </Link> */}
                </div>

                <div>
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className={(isActive("/logout") ? activeLinkClass : normalLinkClass) + " cursor-pointer"}
                        >
                            <FiLogOut />
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className={(isActive("/login") ? activeLinkClass : normalLinkClass) + " cursor-pointer"}
                        >
                            <FiLogIn />
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;