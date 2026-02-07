import { useState, useRef, useEffect } from "react";
import { CalculatorIcon } from "./Icons";

function Navbar({ setPage, isLoggedIn, user, userProfile, userFarmlands, logout }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setIsModalOpen(false);
    logout();
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setPage("home")}
        >
          <div className="h-10 w-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold transition-transform group-hover:rotate-12 group-hover:bg-green-600">
            <CalculatorIcon />
          </div>
          <span className="text-green-800 font-bold text-lg">
            Farmetrics
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <button onClick={() => setPage("home")} className="hover:text-green-700 transition-colors">Home</button>

          {isLoggedIn && (
            <>
              <button onClick={() => setPage("calculator")} className="hover:text-green-700 transition-colors">Calculator</button>
              <button onClick={() => setPage("dashboard")} className="hover:text-green-700 transition-colors">Dashboard</button>
            </>
          )}

          <button onClick={() => setPage("support")} className="hover:text-green-700 transition-colors">Feedback</button>

          {!isLoggedIn ? (
            <button
              onClick={() => setPage("login")}
              className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-800 transition-all font-bold shadow-md active:scale-95"
            >
              👤 Login
            </button>
          ) : (
            <div className="relative">
              {/* Profile Icon / Avatar Trigger */}
              <button
                className="flex items-center gap-2 p-1 rounded-full hover:bg-green-50 transition-all border border-green-100 pr-3 group"
                onClick={() => setIsModalOpen(true)}
              >
                {userProfile?.avatar_url ? (
                  <img
                    src={userProfile.avatar_url}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border-2 border-green-500"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                    {userProfile?.full_name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="font-bold text-gray-900 group-hover:text-green-700">
                  {userProfile?.full_name?.split(' ')[0] || "Profile"}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Profile Details (Side Drawer) */}
              {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                  {/* Backdrop - Handles click outside to hide */}
                  <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-500"
                    onClick={() => setIsModalOpen(false)}
                  />

                  {/* Details Panel */}
                  <div className="relative w-full max-w-md bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] h-full animate-in slide-in-from-right duration-500 ease-out flex flex-col border-l border-green-100 pb-safe">

                    {/* Header with Back Button */}
                    <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-white sticky top-0 z-10">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all flex items-center gap-2 font-bold text-sm"
                      >
                        <span className="text-xl">←</span> BACK
                      </button>
                      <h2 className="text-xl font-black text-gray-900 ml-2">Profile Details</h2>
                    </div>

                    {/* Content Body (Scrollable) */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">

                      {/* User Identity Section */}
                      <div className="p-8 bg-gradient-to-br from-green-600 to-green-800 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <div className="relative flex flex-col items-center text-center">
                          <div className="relative mb-6">
                            {userProfile?.avatar_url ? (
                              <img src={userProfile.avatar_url} className="h-28 w-28 rounded-[2rem] object-cover border-4 border-white/20 shadow-2xl" />
                            ) : (
                              <div className="h-28 w-28 rounded-[2rem] bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl text-white font-black border-4 border-white/20 shadow-xl">
                                {userProfile?.full_name?.charAt(0) || "U"}
                              </div>
                            )}
                            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-[10px] font-black px-3 py-1 rounded-full border-2 border-white shadow-sm text-yellow-900 uppercase tracking-tighter">
                              Verified
                            </div>
                          </div>

                          <h3 className="text-2xl font-black mb-1 tracking-tight">{userProfile?.full_name || "Modern Farmer"}</h3>
                          <div className="flex items-center gap-2 text-white/70 font-medium text-sm">
                            <span>📧 {user}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="p-8 space-y-8">
                          {/* Section: Personal Information Detail Card */}
                          <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Personal Record</p>
                            <div className="grid grid-cols-1 gap-3">
                              <div className="p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100 flex items-center gap-4 group hover:bg-white hover:shadow-md hover:border-green-100 transition-all">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-50 text-lg">📞</div>
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Mobile Number</p>
                                  <p className="font-black text-gray-900">{userProfile?.phone || "Not Set"}</p>
                                </div>
                              </div>

                              <div className="p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100 flex items-center gap-4 group hover:bg-white hover:shadow-md hover:border-blue-100 transition-all">
                                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-50 text-lg">📍</div>
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Primary Location</p>
                                  <p className="font-black text-gray-900">
                                    {userProfile?.district ? `${userProfile.district}, ` : ""}{userProfile?.state || "India"}
                                  </p>
                                </div>
                              </div>

                              <div className="p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100 flex items-center gap-4 group hover:bg-white hover:shadow-md hover:border-amber-100 transition-all">
                                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-50 text-lg">🏠</div>
                                <div className="flex-1">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Address & Postal Code</p>
                                  <p className="font-bold text-gray-900 text-sm leading-relaxed">
                                    {userProfile?.address || "Address not provided."}
                                    {userProfile?.pincode && <span className="block text-green-600 font-black mt-1">PIN: {userProfile.pincode}</span>}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Section: Farmland Quick List */}
                          <div className="space-y-4">
                            <div className="flex justify-between items-center ml-1">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Land Asset Summary</p>
                              <span className="text-[10px] font-black bg-green-600 text-white px-3 py-1 rounded-full">{userFarmlands?.length || 0} Total</span>
                            </div>

                            {userFarmlands && userFarmlands.length > 0 ? (
                              <div className="space-y-3">
                                {userFarmlands.map((land, idx) => (
                                  <div key={idx} className="p-5 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm hover:border-green-300 transition-all group relative overflow-hidden">
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-black text-gray-900 text-sm">{land.village}</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">{land.tehsil}, {land.district}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-black text-green-700 text-sm">{land.area_acres} <span className="text-[9px]">ACRES</span></p>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase">ROR/Khasra: {land.khasra_number}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-8 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">No land records linked</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 bg-white border-t border-gray-100 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setPage("profile");
                          setIsModalOpen(false);
                        }}
                        className="py-4 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="py-4 rounded-2xl bg-red-50 text-red-600 font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
