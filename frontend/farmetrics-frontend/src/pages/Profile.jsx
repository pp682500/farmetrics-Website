import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import InfoCard from "../components/InfoCard";
import { INDIAN_STATES } from "../data/indianStates";

const LAND_TYPES = ["Agricultural", "Fallow", "Orchard", "Pasture", "Other"];

function Profile({ user, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState("details"); // details | farmland

  // Profile form state
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    avatar_url: "",
    state: "",
    district: "",
    address: "",
    pincode: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  // Farmland form state (Bhulekh-style)
  const [farmlandForm, setFarmlandForm] = useState({
    state: "",
    district: "",
    tehsil: "",
    village: "",
    khasra_number: "",
    khatauni_number: "",
    area_acres: "",
    land_type: "Agricultural",
  });
  const [farmlands, setFarmlands] = useState([]);
  const [farmlandLoading, setFarmlandLoading] = useState(false);
  const [farmlandMessage, setFarmlandMessage] = useState("");

  const userId = user?.id;

  // Load profile
  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (!error && data) {
        setProfile({
          full_name: data.full_name ?? "",
          phone: data.phone ?? "",
          avatar_url: data.avatar_url ?? "",
          state: data.state ?? "",
          district: data.district ?? "",
          address: data.address ?? "",
          pincode: data.pincode ?? "",
        });
      }
    })();
  }, [userId]);

  // Load user farmlands
  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data, error } = await supabase
        .from("user_farmlands")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (!error) setFarmlands(data ?? []);
    })();
  }, [userId]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setProfileLoading(true);
    setProfileMessage("");
    const { error } = await supabase.from("profiles").upsert(
      {
        id: userId,
        full_name: profile.full_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        state: profile.state,
        district: profile.district,
        address: profile.address,
        pincode: profile.pincode,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    setProfileLoading(false);
    if (error) {
      setProfileMessage("Error saving profile. " + (error.message || ""));
      return;
    }
    setProfileMessage("Profile saved successfully.");
  };

  const uploadAvatar = async (event) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      setProfileLoading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log("Starting upload...", filePath);

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Storage Error:", uploadError);
        throw new Error("Storage Upload Failed: " + uploadError.message);
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Append timestamp to bust cache
      const publicUrlWithCache = `${data.publicUrl}?t=${new Date().getTime()}`;

      setProfile((p) => ({ ...p, avatar_url: publicUrlWithCache }));

      console.log("Upload success. URL:", data.publicUrl);

      // 2. Save to DB
      const { error: dbError } = await supabase.from("profiles").upsert(
        { id: userId, avatar_url: data.publicUrl, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );

      if (dbError) {
        console.error("DB Error:", dbError);
        throw new Error("Profile Update Failed: " + dbError.message);
      }

      setProfileMessage("Avatar updated successfully!");

      // Notify parent to refresh Navbar
      if (onProfileUpdate) onProfileUpdate();

    } catch (error) {
      console.error("Avatar Upload Error:", error);
      setProfileMessage(error.message);
    } finally {
      setProfileLoading(false);
      // Allow re-selecting the same file
      if (event.target) event.target.value = null;
    }
  };

  const handleFarmlandChange = (e) => {
    const { name, value } = e.target;
    setFarmlandForm((f) => ({ ...f, [name]: value }));
  };

  const addFarmland = async (e) => {
    e.preventDefault();
    if (!userId) return;
    const area = parseFloat(farmlandForm.area_acres);
    if (!farmlandForm.state || !farmlandForm.district || !farmlandForm.village || !farmlandForm.khasra_number || isNaN(area) || area <= 0) {
      setFarmlandMessage("Please fill State, District, Village, Khasra number and valid Area (acres).");
      return;
    }
    setFarmlandLoading(true);
    setFarmlandMessage("");
    const { error } = await supabase.from("user_farmlands").insert({
      user_id: userId,
      state: farmlandForm.state,
      district: farmlandForm.district,
      tehsil: farmlandForm.tehsil || null,
      village: farmlandForm.village,
      khasra_number: farmlandForm.khasra_number,
      khatauni_number: farmlandForm.khatauni_number || null,
      area_acres: area,
      land_type: farmlandForm.land_type,
    });
    setFarmlandLoading(false);
    if (error) {
      setFarmlandMessage("Error adding farmland. " + (error.message || ""));
      return;
    }
    setFarmlandMessage("Farmland added. You can verify records on your state Bhulekh portal.");
    setFarmlandForm({
      state: "",
      district: "",
      tehsil: "",
      village: "",
      khasra_number: "",
      khatauni_number: "",
      area_acres: "",
      land_type: "Agricultural",
    });
    const { data } = await supabase
      .from("user_farmlands")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setFarmlands(data);
  };

  const removeFarmland = async (id) => {
    if (!userId) return;
    await supabase.from("user_farmlands").delete().eq("id", id).eq("user_id", userId);
    setFarmlands((prev) => prev.filter((f) => f.id !== id));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-green-600 via-green-700 to-emerald-900 -skew-y-6 origin-top-left z-0 shadow-2xl" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-green-400/20 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl z-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-white drop-shadow-md">User Settings</h1>
            <p className="text-green-100 font-medium mt-1">Manage your digital farming identity and land records</p>
          </div>

          <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-xl">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === "details"
                ? "bg-white text-green-800 shadow-lg scale-105"
                : "text-white hover:bg-white/10"
                }`}
            >
              Personal Details
            </button>
            <button
              onClick={() => setActiveTab("farmland")}
              className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === "farmland"
                ? "bg-white text-green-800 shadow-lg scale-105"
                : "text-white hover:bg-white/10"
                }`}
            >
              My Farmland
            </button>
          </div>
        </div>

        {activeTab === "details" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <InfoCard title="Personal Details">
              <div className="flex flex-col md:flex-row gap-8 items-start p-2">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                  <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden bg-white border-4 border-green-100 shadow-2xl relative group">
                    {profile.avatar_url ? (
                      <img
                        key={profile.avatar_url}
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}

                    {/* Fallback styling if no image or error */}
                    <div
                      className={`h-full w-full flex items-center justify-center text-5xl bg-gradient-to-br from-green-50 to-green-100 ${profile.avatar_url ? 'hidden' : 'flex'}`}
                    >
                      👤
                    </div>

                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">Update</span>
                    </div>
                  </div>
                  <label className="cursor-pointer bg-green-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-200 hover:bg-green-700 hover:shadow-green-300 transition-all active:scale-95">
                    UPLOAD PHOTO
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={uploadAvatar}
                      disabled={profileLoading}
                    />
                  </label>
                </div>

                <div className="flex-1 w-full space-y-6">
                  {/* Stats Stripe */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-green-600 to-emerald-700 p-6 rounded-[2rem] shadow-xl border border-white/20 text-white">
                    <div>
                      <p className="text-[10px] text-green-100 font-black uppercase tracking-[0.2em]">Total Land Holdings</p>
                      <p className="text-3xl font-black">
                        {farmlands.reduce((sum, f) => sum + (parseFloat(f.area_acres) || 0), 0).toFixed(2)}
                        <span className="text-sm font-bold ml-2 text-green-100 uppercase">Acres</span>
                      </p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md text-3xl">👨‍🌾</div>
                  </div>

                  <form onSubmit={saveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Email</label>
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-500 font-bold text-sm">
                          {user.email}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input
                          type="text"
                          name="full_name"
                          value={profile.full_name}
                          onChange={handleProfileChange}
                          className="w-full px-5 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold transition-all"
                          placeholder="Your Name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={profile.phone}
                          onChange={handleProfileChange}
                          className="w-full px-5 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold transition-all"
                          placeholder="10-digit mobile"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Postal Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          value={profile.pincode}
                          onChange={handleProfileChange}
                          className="w-full px-5 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold transition-all"
                          placeholder="6-digit code"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Home State</label>
                        <select
                          name="state"
                          value={profile.state}
                          onChange={handleProfileChange}
                          className="w-full px-5 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Home District</label>
                        <input
                          type="text"
                          name="district"
                          value={profile.district}
                          onChange={handleProfileChange}
                          className="w-full px-5 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold transition-all"
                          placeholder="e.g. Nagpur"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Permanent Address</label>
                      <textarea
                        name="address"
                        value={profile.address}
                        onChange={handleProfileChange}
                        rows={3}
                        className="w-full px-5 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold transition-all"
                        placeholder="Complete mailing address..."
                      />
                    </div>

                    {profileMessage && (
                      <div className={`p-4 rounded-xl font-bold text-xs ${profileMessage.startsWith("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700 animate-pulse"}`}>
                        {profileMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="w-full bg-black text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-[1.5rem] shadow-xl hover:bg-green-700 hover:shadow-green-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {profileLoading ? "PROCESSING..." : "UPDATE PROFILE RECORD"}
                    </button>
                  </form>
                </div>
              </div>
            </InfoCard>
          </div>
        )}

        {activeTab === "farmland" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <InfoCard title="Register New Land Record">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-6">
                Link your digital Bhulekh credentials to your Modern Farmer profile
              </p>
              <form onSubmit={addFarmland} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase ml-1">State *</label>
                    <select
                      name="state"
                      value={farmlandForm.state}
                      onChange={handleFarmlandChange}
                      required
                      className="w-full px-5 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold transition-all cursor-pointer"
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase ml-1">District *</label>
                    <input
                      type="text"
                      name="district"
                      value={farmlandForm.district}
                      onChange={handleFarmlandChange}
                      required
                      className="w-full px-5 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold transition-all"
                      placeholder="e.g. Nashik"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase ml-1">Tehsil / Block</label>
                    <input
                      type="text"
                      name="tehsil"
                      value={farmlandForm.tehsil}
                      onChange={handleFarmlandChange}
                      className="w-full px-5 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold transition-all"
                      placeholder="Administrative Block"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase ml-1">Village *</label>
                    <input
                      type="text"
                      name="village"
                      value={farmlandForm.village}
                      onChange={handleFarmlandChange}
                      required
                      className="w-full px-5 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold transition-all"
                      placeholder="Village Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase ml-1">Area Size (Acres) *</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="area_acres"
                        value={farmlandForm.area_acres}
                        onChange={handleFarmlandChange}
                        min="0"
                        step="0.01"
                        required
                        className="w-full px-5 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-black transition-all"
                        placeholder="0.00"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-green-600 uppercase">Acres</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase ml-1">Khasra / Survey No. *</label>
                    <input
                      type="text"
                      name="khasra_number"
                      value={farmlandForm.khasra_number}
                      onChange={handleFarmlandChange}
                      required
                      className="w-full px-5 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold transition-all"
                      placeholder="e.g. 123/A"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase ml-1">Khatauni No.</label>
                    <input
                      type="text"
                      name="khatauni_number"
                      value={farmlandForm.khatauni_number}
                      onChange={handleFarmlandChange}
                      className="w-full px-5 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold transition-all"
                      placeholder="Optional"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase ml-1">Primary Land Type</label>
                    <select
                      name="land_type"
                      value={farmlandForm.land_type}
                      onChange={handleFarmlandChange}
                      className="w-full px-5 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold transition-all"
                    >
                      {LAND_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {farmlandMessage && (
                  <div className={`p-4 rounded-xl font-bold text-xs ${farmlandMessage.startsWith("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
                    {farmlandMessage}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={farmlandLoading}
                  className="w-full bg-green-600 text-white font-black text-xs uppercase tracking-[0.15em] py-4 rounded-2xl shadow-lg shadow-green-100 hover:bg-green-700 hover:shadow-green-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  {farmlandLoading ? "SYNCING..." : "CONFIRM & ADD LAND RECORD"}
                </button>
              </form>
            </InfoCard>

            <InfoCard title="Registered Land Assets">
              {farmlands.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">No assets found in digital vault</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {farmlands.map((f) => (
                    <div key={f.id} className="p-5 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm hover:shadow-md hover:border-green-200 transition-all group relative overflow-hidden">
                      <div className="absolute top-4 right-4 text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                        {f.land_type}
                      </div>

                      <p className="font-black text-gray-900 text-lg mb-1">{f.village}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{f.tehsil}, {f.district}</p>

                      <div className="flex justify-between items-end border-t border-gray-50 pt-4 mt-2">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">Identity Numbers</p>
                          <p className="font-bold text-gray-700 text-xs">Khasra: {f.khasra_number}</p>
                          {f.khatauni_number && <p className="font-bold text-gray-700 text-xs">Khatauni: {f.khatauni_number}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-green-700 leading-none">{f.area_acres}<span className="text-[10px] ml-1 font-bold text-green-400 uppercase">Ac</span></p>
                          <button
                            type="button"
                            onClick={() => removeFarmland(f.id)}
                            className="text-red-400 hover:text-red-600 font-black text-[9px] uppercase tracking-widest mt-2 block ml-auto"
                          >
                            Delete Record
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </InfoCard>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
