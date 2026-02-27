import React, { useState, useEffect } from "react";
// MUHIMMI: Tabbatar sunan file din nan ya dace da abinda ke cikin folder src
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

  // Maimakon mu sa loading screen, bari mu bar shafin ya fito kawai
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists() && userSnap.data().role !== "student") {
            // Idan kana so ya wuce dashboard kai tsaye:
            // navigate("/admin-dashboard");
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const role = userSnap.data().role;
        const authorized = [
          "rector",
          "admin",
          "supervisor",
          "admission-officer",
          "super-admin",
        ];

        if (authorized.includes(role)) {
          if (role === "rector") navigate("/rector-dashboard");
          else if (role === "admin" || role === "admission-officer")
            navigate("/admin-dashboard");
          else if (role === "supervisor") navigate("/supervisor-dashboard");
          else navigate("/instructor-hub");
        } else {
          await signOut(auth);
          setError("ACCESS DENIED: Staff only.");
        }
      } else {
        await signOut(auth);
        setError("User profile not found.");
      }
    } catch (err) {
      setError("Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors"
      >
        <X size={32} />
      </button>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
            <ShieldCheck size={40} />
          </div>
        </div>

        <h2 className="text-2xl font-black text-center mb-6 text-gray-900 uppercase italic">
          AREWA <span className="text-red-600">COMMAND CENTER</span>
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-bold rounded-lg uppercase flex items-center gap-2">
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Staff Email"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-600 font-bold"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Security Key"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-600 font-bold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 text-white rounded-xl font-black uppercase hover:bg-red-700 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Verify & Access"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;
