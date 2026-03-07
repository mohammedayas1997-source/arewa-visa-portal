import React, { useState } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
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
  Mail,
  LockKeyhole,
} from "lucide-react";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email) {
      alert("INPUT REQUIRED: Please enter your email address first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      alert(
        "RESET DISPATCHED: Check your inbox for the password recovery link.",
      );
    } catch (error) {
      alert("SYSTEM ERROR: Could not send reset email. Verify your address.");
    }
  };

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
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        if (userData.role !== "student") {
          await signOut(auth);
          setError("RESTRICTED: Wannan portal na ɗalibai ne kawai.");
          setLoading(false);
          return;
        }

        if (userData.status === "suspended" || userData.status === "inactive") {
          await signOut(auth);
          setError("ACCOUNT INACTIVE: An dakatar da asusunka na ɗalibi.");
          setLoading(false);
          return;
        }

        navigate("/student-portal");
      } else {
        await signOut(auth);
        setError("ACCOUNT ERROR: Ba'a sami bayanan ɗalibi a database ba.");
      }
    } catch (error) {
      setError("AUTHENTICATION ERROR: Imel ko kalmar sirri ba daidai ba.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-10 font-sans relative overflow-hidden">
      {/* AREWA THEME BACKGROUND ELEMENTS */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/10 blur-[150px] rounded-full"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/5 blur-[150px] rounded-full"></div>

      {/* CLOSE BUTTON */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 z-50 border border-white/5"
      >
        <X size={24} strokeWidth={2.5} />
      </button>

      <div className="max-w-[440px] w-full relative z-10 animate__animated animate__fadeIn">
        <div className="bg-[#141414] border border-white/5 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
          {/* ACCENT LINE */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900"></div>

          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-red-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-900/40">
              <BookOpen className="text-white" size={36} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic leading-tight">
              Student <span className="text-red-600">Portal</span>
            </h2>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-4 flex items-center justify-center gap-2">
              Arewa Visa Academy
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-950/20 border border-red-500/30 text-red-400 text-[11px] font-bold flex items-center gap-3 rounded-2xl uppercase italic">
              <X size={16} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block ml-4 text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Mail size={12} className="text-red-600" /> Student Email
              </label>
              <input
                type="email"
                placeholder="e.g. dalibi@arewavisa.com"
                required
                className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-3xl outline-none focus:border-red-600 focus:bg-white/10 transition-all font-medium text-sm text-white shadow-inner"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <LockKeyhole size={12} className="text-red-600" /> Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[9px] font-black text-red-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                >
                  <KeyRound size={12} /> Recovery
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-3xl outline-none focus:border-red-600 focus:bg-white/10 transition-all font-medium text-sm text-white shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-red-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-red-700 transition-all shadow-xl shadow-red-900/20 disabled:opacity-50 active:scale-[0.97] mt-8"
            >
              {loading ? (
                <Loader2 className="animate-spin text-white" />
              ) : (
                <>
                  Authorize Login <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-white/5 pt-8">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
              <UserCheck size={14} className="text-red-500" /> Secure SSL
              Connection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
