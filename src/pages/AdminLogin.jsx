import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
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

  // 1. AUTH LISTENER: Wannan zai tabbatar mutum ya wuce idan an riga an yi login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const role = userDoc.data().role;
          // Redirection logic for existing session
          if (role === "rector") navigate("/rector", { replace: true });
          else if (role === "supervisor")
            navigate("/supervisor-dashboard", { replace: true });
          else if (role === "admin" || role === "admission-officer")
            navigate("/admin-dashboard", { replace: true });
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password,
      );
      const user = userCredential.user;

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

        // 2. IMMEDIATE REDIRECTION PROTOCOL
        console.log("Login Successful. Role:", userRole);

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
        setError("DATABASE_ERROR: Profile not found.");
      }
    } catch (err) {
      console.error("Login Error:", err.code);
      setError("AUTHENTICATION_FAILED: Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 font-sans relative">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-16 right-10 p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all duration-300 group z-50"
      >
        <X
          size={32}
          strokeWidth={3}
          className="group-hover:rotate-90 transition-transform duration-300"
        />
      </button>

      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full border border-gray-100 relative"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-50 text-red-600 rounded-3xl animate-bounce">
            <ShieldCheck size={40} />
          </div>
        </div>

        <h2 className="text-2xl font-black text-center mb-2 text-gray-900 uppercase tracking-tight italic">
          AREWA <span className="text-red-600">COMMAND</span>
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-[10px] font-black flex items-center gap-2 rounded-xl uppercase">
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase ml-2 text-slate-400 tracking-widest">
              Institutional Email
            </label>
            <input
              type="email"
              placeholder="staff@arewavacademy.edu.ng"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold transition-all text-slate-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase ml-2 text-slate-400 tracking-widest">
              Security Key
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold transition-all text-slate-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-900/20 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Verify & Enter Portal"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffLogin;
