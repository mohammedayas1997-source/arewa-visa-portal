import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ArrowRight,
  Loader2,
  UserCheck,
  KeyRound,
  X,
} from "lucide-react";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists() && userSnap.data().role === "student") {
            navigate("/student-portal");
          }
        } catch (err) {
          console.error("Auth sync error:", err);
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleForgotPassword = async () => {
    if (!email) {
      alert("INPUT REQUIRED: Please enter your email address first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      alert("RESET DISPATCHED: Check your inbox for the link.");
    } catch (error) {
      alert("SYSTEM ERROR: Could not send reset email.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password,
      );
      const user = userCredential.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.role !== "student") {
          await signOut(auth);
          alert("RESTRICTED: This portal is for students only.");
          setLoading(false);
          return;
        }
        if (userData.status === "suspended" || userData.status === "inactive") {
          await signOut(auth);
          alert("ACCOUNT INACTIVE: Your account has been suspended.");
          setLoading(false);
          return;
        }
        navigate("/student-portal");
      } else {
        await signOut(auth);
        alert("ACCOUNT ERROR: Profile not found.");
      }
    } catch (error) {
      alert("AUTHENTICATION ERROR: Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white font-sans relative overflow-x-hidden">
      {/* CLOSE BUTTON */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all z-50"
      >
        <X size={28} strokeWidth={2.5} />
      </button>

      <div className="w-full max-w-[420px] bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-gray-100 relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-200">
            <BookOpen className="text-white" size={28} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-tight italic">
            AREWA <br /> <span className="text-blue-600">ACADEMY</span>
          </h2>
          <p className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em] mt-3">
            Authorized Academic Access Only
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="ml-1 text-[10px] font-black text-gray-500 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. name@arewavacademy.edu.ng"
              required
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold text-sm text-slate-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[10px] font-black text-blue-600 uppercase hover:underline"
              >
                Recovery
              </button>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold text-sm text-slate-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Enter Classroom <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-50 pt-6">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <UserCheck size={14} className="text-blue-500" /> Secure Arewa
            Session
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
