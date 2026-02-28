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

  // 1. AUTO-REDIRECT LOGIC: Idan riga an yi login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const role = userSnap.data().role?.toLowerCase();
            handleRouting(role); // Mun kira function din redirection
          }
        } catch (err) {
          console.error("Auth sync error:", err);
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 2. CENTRAL ROUTING ENGINE: Inda ake rarraba kowa zuwa gidansa
  const handleRouting = (role) => {
    switch (role) {
      case "rector":
        navigate("/rector-dashboard", { replace: true });
        break;
      case "admin":
      case "super-admin":
      case "admission-officer":
        navigate("/admin-dashboard", { replace: true });
        break;
      case "supervisor":
        navigate("/supervisor-dashboard", { replace: true });
        break;
      case "instructor":
        navigate("/instructor-hub", { replace: true });
        break;
      default:
        signOut(auth);
        setError("UNAUTHORIZED: Your role is not recognized.");
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

      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const role = userSnap.data().role?.toLowerCase() || "";
        const authorized = [
          "rector",
          "admin",
          "supervisor",
          "admission-officer",
          "super-admin",
          "instructor",
        ];

        if (authorized.includes(role)) {
          handleRouting(role);
        } else {
          await signOut(auth);
          setError("ACCESS DENIED: Administrative credentials required.");
        }
      } else {
        await signOut(auth);
        setError("DATABASE ERROR: Profile not found.");
      }
    } catch (err) {
      console.error("Login Error:", err.code);
      setError(
        err.code === "auth/invalid-credential"
          ? "Incorrect Email or Security Key."
          : "Authentication service unavailable.",
      );
    } finally {
      setLoading(false);
    }
  };

  // UI REMAINS THE SAME (English labels only as requested)
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
        <p
          style={{
            textAlign: "center",
            fontSize: "10px",
            color: "#64748b",
            marginBottom: "24px",
            fontWeight: "bold",
            letterSpacing: "2px",
          }}
        >
          ADMINISTRATIVE TERMINAL
        </p>

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
