import React from "react";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <div className="navbar h-[70px] bg-dark-red shadow-sm px-6">
      {/* logo */}
      <div className="flex-1">
        <NavLink
          to="/"
          className="text-2xl font-bold text-white hover:text-lightest-beige transition"
        >
          EchoNest
        </NavLink>
      </div>

      {/* Right side */}
      <div className="gap-3">
        <ul className="menu menu-horizontal px-1 text-[--color-dark-red] font-semibold items-center gap-1">
          {user ? (
            <>
              {/* Avatar */}
              <div className="flex items-center gap-2 text-white">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}

                {/* Name */}
                <span>{user.displayName}</span>
              </div>

              {/* Logout Button */}
              <li>
                <button
                  className="text-white hover:bg-[--color-dark-red] hover:text-lightest-beige transition text-xs"
                  onClick={() => {
                    signOut(auth);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink
                to="/auth"
                className="text-white font-bold hover:text-lightest-beige transition"
              >
                Login / Register
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
