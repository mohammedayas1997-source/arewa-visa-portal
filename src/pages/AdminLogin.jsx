import React, { useState, useEffect } from "react";
// GYARA: Tabbatar sunan file din ya dace da folder dinka (firebase ko firebaseConfig)
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
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const role = userSnap.data().role;
            const staffRoles = [
              "rector",
              "admin",
              "supervisor",
              "admission-officer",
              "super-admin",
            ];

            if (staffRoles.includes(role)) {
              // Idan kana so ya wuce dashboard kai tsaye idan an riga an yi login:
              // navigate("/admin-dashboard", { replace: true });
            }
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        // Wannan dole ne ya kasance a nan don shafin ya fito ko da an samu error
        setCheckingAuth(false);
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

      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
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
          return;
        }

        if (userData.status === "suspended" || userData.status === "inactive") {
          await signOut(auth);
          setError("ACCOUNT_REVOKED: This account is inactive.");
          return;
        }

        if (userRole === "rector") navigate("/rector-dashboard");
        else if (userRole === "admin" || userRole === "admission-officer")
          navigate("/admin-dashboard");
        else if (userRole === "supervisor") navigate("/supervisor-dashboard");
        else navigate("/instructor-hub");
      } else {
        await signOut(auth);
        setError("DATABASE_ERROR: Profile not found.");
      }
    } catch (err) {
      setError("AUTHENTICATION_FAILED: Password ko Email ba daidai ba.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="text-red-600 animate-spin mb-4" size={48} />
          <p className="text-red-500 text-[10px] font-black tracking-widest uppercase">
            AREWA SYSTEM INITIALIZING...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 font-sans relative">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-16 right-10 p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all duration-300 z-50"
      >
        <X size={32} strokeWidth={3} />
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
          AREWA <span className="text-red-600">COMMAND CENTER</span>
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-[10px] font-black flex items-center gap-2 rounded-xl uppercase italic">
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Institutional Email"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-slate-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Security Key"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-600 font-bold text-slate-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-900/20"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Verify Credentials"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffLogin;
