import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Tabbatar wannan path din daidai ne
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ShieldCheck, Loader2, ShieldAlert, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 1. AUTH LISTENER: Tabbatar mutum ya wuce idan yana riga da login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const role = userDoc.data().role;
            // Redirection logic
            if (role === "rector")
              navigate("/rector-dashboard", { replace: true });
            else if (role === "supervisor")
              navigate("/supervisor-dashboard", { replace: true });
            else if (role === "admin" || role === "admission-officer")
              navigate("/admin-dashboard", { replace: true });
          }
        } catch (err) {
          console.error("Staff session sync error:", err);
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const cleanEmail = email.trim().toLowerCase();

      // Step A: Firebase Auth Login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password,
      );
      const user = userCredential.user;

      // Step B: Firestore Role Verification
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
          setError("ACCESS_DENIED: Staff credentials required.");
          setLoading(false);
          return;
        }

        if (userData.status === "suspended" || userData.status === "inactive") {
          await signOut(auth);
          setError("ACCOUNT_REVOKED: This account is inactive.");
          setLoading(false);
          return;
        }

        // REDIRECTION PROTOCOL
        if (userRole === "rector") {
          navigate("/rector-dashboard", { replace: true });
        } else if (userRole === "supervisor") {
          navigate("/supervisor-dashboard", { replace: true });
        } else if (userRole === "admin" || userRole === "admission-officer") {
          navigate("/admin-dashboard", { replace: true });
        } else {
          navigate("/instructor-hub", { replace: true });
        }
      } else {
        await signOut(auth);
        setError("DATABASE_ERROR: Profile not found in records.");
      }
    } catch (err) {
      console.error("Staff Login Error:", err.code);
      if (err.code === "auth/wrong-password") setError("Invalid Security Key.");
      else if (err.code === "auth/user-not-found")
        setError("Email not registered.");
      else setError("AUTHENTICATION_FAILED: Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 font-sans relative overflow-x-hidden">
      {/* CLOSE BUTTON */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-8 md:top-16 right-6 md:right-10 p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all duration-300 group z-50"
      >
        <X
          size={32}
          strokeWidth={3}
          className="group-hover:rotate-90 transition-transform duration-300"
        />
      </button>

      <div className="w-full max-w-md">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 relative flex flex-col gap-6"
        >
          <div className="flex flex-col items-center">
            <div className="p-4 bg-red-50 text-red-600 rounded-3xl animate-pulse mb-4">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-2xl font-black text-center text-gray-900 uppercase tracking-tight italic">
              AREWA <span className="text-red-600">COMMAND</span>
            </h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
              Staff Terminal Access
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-[10px] font-black flex items-center gap-2 rounded-xl uppercase">
              <ShieldAlert size={16} /> {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase ml-2 text-slate-400 tracking-widest">
                Institutional Email
              </label>
              <input
                type="email"
                placeholder="staff@arewavacademy.edu.ng"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold transition-all text-slate-900 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase ml-2 text-slate-400 tracking-widest">
                Security Key
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold transition-all text-slate-900 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Verify & Enter Portal"
              )}
            </button>
          </div>

          <div className="text-center pt-4 border-t border-gray-50">
            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">
              Secure Staff Encrypted Session
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;
