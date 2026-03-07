import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  ShieldCheck,
  Loader2,
  ShieldAlert,
  X,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      // 1. Arewa Institutional Email Formatting
      const cleanEmail = email.trim().toLowerCase();

      // 2. Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password,
      );
      const user = userCredential.user;

      // 3. Firestore Verification
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        const authorizedStaff = [
          "rector",
          "super-admin",
          "admin",
          "supervisor",
          "AdminContentManager",
          "instructor",
          "staff",
          "admission-officer",
        ];

        if (!authorizedStaff.includes(userRole)) {
          await signOut(auth);
          setError("ACCESS_DENIED: Wannan portal na ma'aikata ne kawai.");
          setLoading(false);
          return;
        }

        if (userData.status === "suspended" || userData.status === "inactive") {
          await signOut(auth);
          setError("ACCOUNT_REVOKED: An kulle wannan asusun na ma'aikaci.");
          setLoading(false);
          return;
        }

        // Redirection based on Arewa hierarchy
        if (["rector", "super-admin", "admin"].includes(userRole)) {
          navigate("/admin", { replace: true });
        } else {
          navigate("/staff-dashboard", { replace: true });
        }
      } else {
        await signOut(auth);
        setError("DATABASE_ERROR: Ba'a sami bayanan ma'aikaci ba.");
      }
    } catch (err) {
      console.error("Login Error:", err.code);
      setError("AUTHENTICATION_FAILED: Imel ko Security Key ba daidai ba.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-10 font-sans relative overflow-hidden">
      {/* AREWA THEMED BACKGROUND ELEMENTS */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/20 blur-[150px] rounded-full"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/10 blur-[150px] rounded-full"></div>

      {/* CLOSE BUTTON */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 z-50 border border-white/10"
      >
        <X size={24} />
      </button>

      <div className="max-w-[450px] w-full relative z-10">
        <div className="bg-[#141414] border border-white/5 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
          {/* TOP DECORATION */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-emerald-600 to-red-600"></div>

          <div className="flex justify-center mb-8">
            <div className="p-6 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-[2.5rem] shadow-lg shadow-red-900/40">
              <ShieldCheck size={45} strokeWidth={2.5} />
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
              Staff <span className="text-red-600">Command</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="h-[1px] w-8 bg-emerald-600"></span>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">
                Arewa Visa Academy
              </p>
              <span className="h-[1px] w-8 bg-emerald-600"></span>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-950/30 border border-red-500/50 text-red-400 text-[11px] font-bold flex items-center gap-3 rounded-2xl uppercase animate-pulse">
              <ShieldAlert size={18} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase ml-4 text-slate-400 tracking-widest flex items-center gap-2">
                <Mail size={12} className="text-red-600" /> Institutional Email
              </label>
              <input
                type="email"
                placeholder="staff@arewavisa.com"
                className="w-full p-5 bg-white/5 border border-white/10 rounded-3xl outline-none focus:border-red-600 focus:bg-white/10 transition-all text-white font-bold text-sm shadow-inner"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase ml-4 text-slate-400 tracking-widest flex items-center gap-2">
                <LockKeyhole size={12} className="text-red-600" /> Security Key
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-5 bg-white/5 border border-white/10 rounded-3xl outline-none focus:border-red-600 focus:bg-white/10 transition-all text-white font-bold text-sm shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-red-600 text-white rounded-3xl font-black text-xs uppercase flex items-center justify-center gap-3 hover:bg-red-700 active:scale-[0.98] transition-all shadow-xl shadow-red-900/20 disabled:opacity-50 mt-8 tracking-[0.3em]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Authorize Access"
              )}
            </button>
          </form>
        </div>

        <div className="mt-10 text-center">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em]">
            &copy; 2026 Arewa Visa Academy | Admin Security
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
