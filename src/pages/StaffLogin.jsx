import React, { useState } from "react";
import { auth, db } from "../firebase"; // Tabbatar cewa sunan file din firebase.js ne a folder src
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ShieldCheck, Loader2, ShieldAlert, X } from "lucide-react";
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
      const cleanEmail = email.trim().toLowerCase();

      // 1. Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password,
      );
      const user = userCredential.user;

      // 2. Nemo bayanan ma'aikaci a Firestore
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        // Jerin matsayi (Roles) da aka amince dasu
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

        // 3. Tabbatar idan ma'aikaci ne
        if (!authorizedStaff.includes(userRole)) {
          await signOut(auth);
          setError(
            "ACCESS_DENIED: Unauthorized access. Staff credentials required.",
          );
          setLoading(false);
          return;
        }

        // 4. Tabbatar idan account din yana aiki
        if (userData.status === "suspended" || userData.status === "inactive") {
          await signOut(auth);
          setError("ACCOUNT_REVOKED: This administrative account is inactive.");
          setLoading(false);
          return;
        }

        // 5. Redirection dangane da Role
        console.log("Login Successful. Role:", userRole);

        if (userRole === "rector") {
          navigate("/rector", { replace: true });
        } else if (userRole === "super-admin") {
          navigate("/super-admin", { replace: true });
        } else if (userRole === "supervisor") {
          navigate("/supervisor-dashboard", { replace: true });
        } else if (userRole === "AdminContentManager") {
          navigate("/admin-secret-portal", { replace: true });
        } else if (userRole === "admin" || userRole === "admission-officer") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/instructor-portal", { replace: true });
        }
      } else {
        await signOut(auth);
        setError("DATABASE_ERROR: No administrative profile found.");
      }
    } catch (err) {
      console.error("Login Error:", err.code);
      setError("AUTHENTICATION_FAILED: Invalid email or security key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10 font-sans relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-900/10 blur-[120px] rounded-full"></div>

      {/* CLOSE BUTTON */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white hover:bg-slate-800 rounded-2xl transition-all duration-300 z-50"
      >
        <X size={28} strokeWidth={2.5} />
      </button>

      <div className="max-w-md w-full relative z-10 animate__animated animate__fadeInUp">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full border border-slate-100 relative"
        >
          <div className="flex justify-center mb-8">
            <div className="p-5 bg-red-50 text-red-600 rounded-[2rem] shadow-inner">
              <ShieldCheck size={48} strokeWidth={2.5} />
            </div>
          </div>

          <h2 className="text-3xl font-black text-center mb-2 text-slate-900 uppercase tracking-tighter italic">
            Staff <span className="text-red-600">Command</span>
          </h2>
          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">
            Arewa Visa Academy Administration
          </p>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-black flex items-center gap-3 rounded-2xl uppercase animate__animated animate__headShake">
              <ShieldAlert size={18} /> {error}
            </div>
          )}

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase ml-3 text-slate-500 tracking-widest">
                Institutional Email
              </label>
              <input
                type="email"
                placeholder="admin@arewavisa.com"
                className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-3xl outline-none focus:border-red-600 focus:bg-white font-bold transition-all text-slate-900 text-sm shadow-inner"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase ml-3 text-slate-500 tracking-widest">
                Security Key
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-3xl outline-none focus:border-red-600 focus:bg-white font-bold transition-all text-slate-900 text-sm shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-red-600 text-white rounded-3xl font-black text-xs uppercase flex items-center justify-center gap-3 hover:bg-red-700 active:scale-95 transition-all shadow-2xl shadow-red-900/30 disabled:opacity-50 mt-8 tracking-[0.2em]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Verify Credentials"
              )}
            </button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">
            Property of Arewa Visa Academy Hub
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
