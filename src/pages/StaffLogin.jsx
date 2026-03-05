import React, { useState, useEffect } from "react";
// GYARA: Mun kara 'auth' da 'db' a cikin imports
import { auth, db, rtdb, storage } from "../firebase"; 
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ArrowRight,
  Loader2,
  UserCheck,
  X,
  Lock,
  Mail,
} from "lucide-react";

// ... sauran code din ya cigaba yadda yake

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Optimized Routing Logic
  const handleRouting = (role) => {
    if (!role) {
      signOut(auth);
      setError("UNAUTHORIZED: No role assigned to this account.");
      return;
    }

    const r = role.toLowerCase().trim();

    if (r === "rector") {
      navigate("/rector-dashboard", { replace: true });
    } else if (["admin", "super-admin", "admission-officer"].includes(r)) {
      navigate("/admin-dashboard", { replace: true });
    } else if (r === "supervisor") {
      navigate("/supervisor-dashboard", { replace: true });
    } else if (r === "instructor") {
      navigate("/instructor-hub", { replace: true });
    } else {
      signOut(auth);
      setError("UNAUTHORIZED: Access denied for this role.");
    }
  };

  // Real-time Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            handleRouting(userSnap.data().role);
          } else {
            // User authenticated but no Firestore record
            setLoading(false);
          }
        } catch (err) {
          console.error("Auth sync error:", err);
          setLoading(false);
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

      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        handleRouting(userSnap.data().role);
      } else {
        await signOut(auth);
        setError("DATABASE ERROR: Profile missing.");
      }
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        setError("Invalid Email or Security Key.");
      } else {
        setError("Access Denied. Please verify credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#020617",
        padding: "24px",
        position: "relative",
        fontFamily: "sans-serif",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: "40px",
          right: "40px",
          color: "#64748b",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <X size={32} />
      </button>

      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "40px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              padding: "16px",
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              borderRadius: "20px",
            }}
          >
            <ShieldCheck size={40} />
          </div>
        </div>

        <h2
          style={{
            fontSize: "22px",
            fontWeight: "900",
            textAlign: "center",
            marginBottom: "8px",
            color: "#111827",
            textTransform: "uppercase",
          }}
        >
          AVA <span style={{ color: "#dc2626" }}>Command Center</span>
        </h2>

        {error && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              backgroundColor: "#fef2f2",
              color: "#b91c1c",
              fontSize: "11px",
              fontWeight: "bold",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderLeft: "4px solid #dc2626",
            }}
          >
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <input
            type="email"
            placeholder="Institutional Email"
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              outline: "none",
              fontWeight: "bold",
              boxSizing: "border-box",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Security Key"
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              outline: "none",
              fontWeight: "bold",
              boxSizing: "border-box",
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "#dc2626",
              color: "#ffffff",
              border: "none",
              borderRadius: "16px",
              fontWeight: "900",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Verify & Access"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;
