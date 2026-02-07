import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { CalculatorIcon, MapIcon, SparklesIcon, ChevronLeftIcon, ChevronRightIcon } from "../components/Icons";

const loginSlides = [
  {
    title: "Secure Your Harvest Data",
    description: "Join thousands of farmers using Farmetrics to track yields, analyze costs, and project seasonal profits with precision.",
    image: "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&w=1200&q=80",
    icon: <CalculatorIcon />
  },
  {
    title: "Official Land Records",
    description: "Access your Bhulekh records directly. Manage survey numbers and verify ownership across multiple states from one dashboard.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    icon: <MapIcon />
  },
  {
    title: "AI Farming Assistant",
    description: "Get instant answers to your agricultural queries from Srishti, our advanced AI assistant.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    icon: <SparklesIcon />
  }
];

function Login({ onLogin, showToast }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === loginSlides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error && error.message && (error.message.includes("fetch") || error.message.includes("network"))) {
          if (showToast) showToast("⚠️ Connection Issue: Check your internet.", "error");
          setError("⚠️ Critical: Unable to connect to Supabase.");
        }
      } catch (err) {
        setError("⚠️ Critical: Database connection failed.");
      }
    })();
  }, [showToast]);

  const handleLogin = async () => {
    setError("");
    setMessage("");
    if (!email || !password) { setError("Email and password are required"); return; }
    setLoading(true);
    await supabase.auth.signOut();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("confirm")) {
        setError("Email not confirmed. Check your inbox.");
      } else {
        setError(error.message);
      }
      return;
    }
    onLogin(data.user);
  };

  const handleRegister = async () => {
    setError("");
    setMessage("");
    if (!email || !password) { setError("Email and password are required"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    if (data?.user) { onLogin(data.user); return; }
    const msg = "📧 Registration successful! Check your email to confirm your account.";
    setMessage(msg);
    if (showToast) showToast(msg, "success");
    setMode("login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-green-50">

      {/* Left Pane: Info Slider (Hidden on small screens) */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-green-900 relative overflow-hidden">
        {loginSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900 via-transparent to-transparent" />
            <div className="absolute bottom-20 left-16 right-16 text-white p-8 bg-black/20 backdrop-blur-md rounded-[2rem] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                  {slide.icon}
                </div>
                <div className="h-1 w-12 bg-white/30 rounded-full" />
              </div>
              <h2 className="text-4xl font-black mb-4 tracking-tight">{slide.title}</h2>
              <p className="text-xl text-white/90 leading-relaxed font-medium">{slide.description}</p>
            </div>
          </div>
        ))}

        {/* Slide Progress Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {loginSlides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-12 bg-green-400' : 'w-3 bg-white/30'}`}
            />
          ))}
        </div>
      </div>

      {/* Right Pane: Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-12 lg:p-20 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-200/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-green-100 rounded-3xl text-green-700 mb-6 shadow-sm">
              <CalculatorIcon size={40} />
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
              {mode === "login" ? "Welcome Back" : "Start Growing"}
            </h2>
            <p className="text-gray-500 font-medium">
              {mode === "login" ? "Access your farm data & tools" : "Join the modern farming revolution"}
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/40 space-y-6">
            {message && <div className="p-4 bg-green-50 text-green-700 rounded-2xl text-sm font-bold animate-bounce text-center">{message}</div>}
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold text-center border border-red-100">{error}</div>}

            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-bold text-gray-500 mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-600 outline-none transition-all font-bold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-gray-500 mb-2 ml-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-600 outline-none transition-all font-bold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={mode === "login" ? handleLogin : handleRegister}
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-green-900 hover:bg-black text-white font-black text-lg tracking-wide shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="h-6 w-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"
              )}
            </button>

            <div className="text-center pt-4">
              <p className="text-gray-500 font-bold text-sm">
                {mode === "login" ? "New to Farmetrics?" : "Already have an account?"}
                <button
                  onClick={() => { setError(""); setMessage(""); setMode(mode === "login" ? "register" : "login"); }}
                  className="ml-2 text-green-700 hover:text-black transition-colors"
                >
                  {mode === "login" ? "Register here" : "Login here"}
                </button>
              </p>
            </div>
          </div>

          <p className="mt-12 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
            Developed by Priyam Pandey • Farmetrics 2026
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
