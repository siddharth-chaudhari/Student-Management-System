import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef(null);
  const portalElRef = useRef(null);

  // create portal container once
  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("data-portal", "profile-dropdown");
    document.body.appendChild(el);
    portalElRef.current = el;
    return () => {
      if (portalElRef.current) document.body.removeChild(portalElRef.current);
    };
  }, []);

  // position the dropdown based on button rect
  const updatePosition = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setCoords({
      top: r.bottom + window.scrollY + 8, // 8px gap
      left: r.right + window.scrollX - 224, // align right edge; 224 = dropdown width
      width: 224,
    });
  };

  // open/close handlers
  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      // compute pos immediately
      updatePosition();
    }
  };

  // close and navigate on logout
  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  // click outside & escape key handling (works for portal)
  useEffect(() => {
    if (!isOpen) return;

    const onDocDown = (e) => {
      // if click target is inside the anchor button, ignore (button toggles)
      if (buttonRef.current && buttonRef.current.contains(e.target)) return;
      // if portal container contains target, ignore
      if (portalElRef.current && portalElRef.current.contains(e.target)) {
        return;
      }
      setIsOpen(false);
    };

    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("mousedown", onDocDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("mousedown", onDocDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  // initials util
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // The dropdown element rendered into body via portal
  const DropdownPortal = isOpen && portalElRef.current
    ? createPortal(
        <div
          style={{
            position: "absolute",
            top: coords.top,
            left: coords.left,
            width: coords.width,
            zIndex: 9999,
          }}
        >
          <div className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <div className="font-semibold text-white">{user?.name}</div>
              <div className="text-sm text-white/60">{user?.email}</div>
              <div className="text-xs text-white/40 capitalize mt-1">
                {user?.role} Account
              </div>
            </div>

            <div className="py-2">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition"
              >
                {/* icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>My Profile</span>
              </Link>

              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </Link>
            </div>

            <div className="border-t border-white/10 py-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition w-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>,
        portalElRef.current
      )
    : null;

  return (
    <>
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={toggle}
          className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur px-4 py-2 rounded-xl transition"
          aria-expanded={isOpen}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
            {getInitials(user?.name)}
          </div>

          <div className="text-left hidden sm:block">
            <div className="text-sm font-semibold text-white">{user?.name}</div>
            <div className="text-xs text-white/60 capitalize">{user?.role}</div>
          </div>

          <svg
            className={`w-4 h-4 text-white/60 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {DropdownPortal}
    </>
  );
};
export default ProfileDropdown;

// import { useEffect, useRef, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// export const ProfileDropdown = () => {
//     const { user, logout } = useAuth();
//     const navigate = useNavigate();
//     const [isOpen, setIsOpen] = useState(false);
//     const dropdownRef = useRef(null);

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setIsOpen(false);
//             }
//         };

//         if (isOpen) {
//             document.addEventListener('mousedown', handleClickOutside);
//         }

//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [isOpen]);

//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//         setIsOpen(false);
//     };

//     // Get initials for avatar
//     const getInitials = (name) => {
//         if (!name) return 'U';
//         return name
//             .split(' ')
//             .map(n => n[0])
//             .join('')
//             .toUpperCase()
//             .slice(0, 2);
//     };

//     return (
//         <div className="relative" ref={dropdownRef}>
//             {/* Profile Button */}
//             <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur px-4 py-2 rounded-xl transition"
//             >
//                 {/* Avatar */}
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
//                     {getInitials(user?.name)}
//                 </div>
                
//                 {/* User Info */}
//                 <div className="text-left hidden sm:block">
//                     <div className="text-sm font-semibold text-white">{user?.name}</div>
//                     <div className="text-xs text-white/60 capitalize">{user?.role}</div>
//                 </div>

//                 {/* Dropdown Arrow */}
//                 <svg 
//                     className={`w-4 h-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
//                     fill="none" 
//                     stroke="currentColor" 
//                     viewBox="0 0 24 24"
//                 >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//             </button>

//             {/* Dropdown Menu */}
//             {isOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-slate-800 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[999]">
//                     {/* User Info Section */}
//                     <div className="px-4 py-3 border-b border-white/10">
//                         <div className="font-semibold text-white">{user?.name}</div>
//                         <div className="text-sm text-white/60">{user?.email}</div>
//                         <div className="text-xs text-white/40 capitalize mt-1">
//                             {user?.role} Account
//                         </div>
//                     </div>

//                     {/* Menu Items */}
//                     <div className="py-2">
//                         <Link
//                             to="/profile"
//                             onClick={() => setIsOpen(false)}
//                             className="flex items-center gap-3 px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition"
//                         >
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                             </svg>
//                             <span>My Profile</span>
//                         </Link>

//                         <Link
//                             to="/settings"
//                             onClick={() => setIsOpen(false)}
//                             className="flex items-center gap-3 px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition"
//                         >
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                             </svg>
//                             <span>Settings</span>
//                         </Link>
//                     </div>

//                     {/* Logout Button */}
//                     <div className="border-t border-white/10 py-2">
//                         <button
//                             onClick={handleLogout}
//                             className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition w-full"
//                         >
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                             </svg>
//                             <span>Logout</span>
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };