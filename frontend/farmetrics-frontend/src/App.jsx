import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Calculator from "./pages/Calculator";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Resources from "./pages/Resources";
import Bhulekh from "./pages/Bhulekh";
import Toast from "./components/Toast";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import Support from "./pages/Support";
import { supabase } from "./supabaseClient";

function App() {
  // Initialize page from localStorage to persist across refreshes
  const [page, setPage] = useState(() => localStorage.getItem("lastPage") || "home");
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userFarmlands, setUserFarmlands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculationResult, setCalculationResult] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    localStorage.setItem("lastPage", page);
  }, [page]);

  // 🔐 Restore session on refresh
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);
      // Wait for profile fetch effect to handle navigation or do it here if needed
      if (sessionUser) {
        // If user is on login page, move them to profile. Otherwise let them stay.
        const lastPage = localStorage.getItem("lastPage");
        if (lastPage === "login") {
          setPage("profile");
        }
      } else {
        // If logged out.
        // If on protected routes, go home.
        const lastPage = localStorage.getItem("lastPage");
        if (["profile", "dashboard"].includes(lastPage)) {
          setPage("home");
        }
      }
      setLoading(false);
    });

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        const authUser = session?.user ?? null;
        setUser(authUser);

        if (authUser) {
          // similar logic: if newly logged in and on login page
          if (page === "login") setPage("profile");
        } else {
          // logged out
          if (["profile", "dashboard"].includes(page)) setPage("home");
          setUserProfile(null);
        }
      });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [page]);

  // 📧 HANDLE EMAIL CONFIRMATION REDIRECT
  useEffect(() => {
    // Check if URL contains Supabase auth tokens (implicit flow) or specific query params
    const hash = window.location.hash;
    const search = window.location.search;

    // Convert hash to URLSearchParams to easily check for access_token or type
    const hashParams = new URLSearchParams(hash.replace('#', '?')); // simplistic handle
    const queryParams = new URLSearchParams(search);

    const type = queryParams.get("type") || hashParams.get("type");
    const accessToken = hash.includes("access_token");

    if (accessToken || type === "signup" || type === "invite") {
      // Let Supabase process the hash first. 
      // We set a small timeout or just show the toast. 
      // The onAuthStateChange will handle the actual user setting.

      // If catching the confirmation event specifically:
      showToast("✅ Email confirmed successfully! Logging you in...", "success");

      // We don't clear hash here immediately to let Supabase Client consume it. 
      // Supabase usually cleans it up or we can do it after a delay.
    }
  }, []);

  // 👤 FETCH PROFILE when user logs in
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (profile) setUserProfile(profile);

      const { data: farmlands } = await supabase
        .from("user_farmlands")
        .select("*")
        .eq("user_id", user.id);
      if (farmlands) setUserFarmlands(farmlands);
    })();
  }, [user]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPage("home");
    setPage("home");
    setToast({ show: true, message: "Logged out successfully", type: "success" });
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  // ⏳ Prevent blank UI during refresh
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      <Navbar
        setPage={setPage}
        isLoggedIn={!!user}
        user={user?.email}
        userProfile={userProfile}
        userFarmlands={userFarmlands}
        logout={logout}
      />

      {page === "home" && <Home setPage={setPage} />}

      {page === "login" && (
        <Login
          onLogin={(u) => {
            setUser(u);
            setPage("profile");
            showToast("Login Successful! Welcome back.");
          }}
          showToast={showToast}
        />
      )}

      {page === "calculator" && (
        <Calculator setCalculationResult={setCalculationResult} />
      )}

      {page === "dashboard" && (
        <Dashboard calculationResult={calculationResult} user={user} />
      )}

      {page === "resources" && <Resources setPage={setPage} />}

      {page === "bhulekh" && <Bhulekh setPage={setPage} />}

      {page === "support" && (
        <Support user={user} showToast={showToast} />
      )}

      {page === "profile" && (
        <Profile
          user={user}
          onProfileUpdate={() => {
            // Re-fetch profile for Navbar
            if (user) {
              supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .maybeSingle()
                .then(({ data }) => {
                  if (data) setUserProfile(data);
                });

              supabase
                .from("user_farmlands")
                .select("*")
                .eq("user_id", user.id)
                .then(({ data }) => {
                  if (data) setUserFarmlands(data);
                });
            }
          }}
        />
      )}
      <Footer setPage={setPage} />
      <Chatbot />
    </>
  );
}

export default App;
