import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
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

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Listen for Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().role === "student") {
          navigate("/student-portal");
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // Step A: Firebase Auth Login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password,
      );

      // Step B: Role Verification
      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.role === "student") {
          navigate("/student-portal");
        } else {
          await signOut(auth);
          alert("RESTRICTED: Access denied. This portal is for students only.");
        }
      } else {
        await signOut(auth);
        alert("ERROR: No student record found in database.");
      }
    } catch (error) {
      console.error("Login Error:", error.code);
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        alert("INVALID CREDENTIALS: Duba Email ko Password dinka.");
      } else {
        alert("SYSTEM ERROR: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // INLINE STYLES - Don tabbatar design bai sake wargajewa ba ko da Tailwind ya ki loading
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#020617",
    padding: "20px",
    fontFamily: "sans-serif",
  };

  const cardStyle = {
    backgroundColor: "#0f172a",
    padding: "40px",
    borderRadius: "2rem",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid #1e293b",
    textAlign: "center",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    position: "relative",
  };

  const inputStyle = {
    width: "100%",
    padding: "16px 16px 16px 48px",
    backgroundColor: "#1e293b",
    border: "2px solid #334155",
    borderRadius: "1rem",
    color: "white",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "0.3s",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <button
          onClick={() => navigate("/")}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "none",
            border: "none",
            color: "#64748b",
            cursor: "pointer",
          }}
        >
          <X size={24} />
        </button>

        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#2563eb",
              borderRadius: "1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <BookOpen color="white" size={32} />
          </div>
          <h1
            style={{
              color: "white",
              fontSize: "24px",
              fontWeight: "900",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            AREWA <span style={{ color: "#2563eb" }}>ACADEMY</span>
          </h1>
          <p
            style={{
              color: "#64748b",
              fontSize: "9px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "3px",
              marginTop: "8px",
            }}
          >
            Student Terminal Access
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div style={{ position: "relative", textAlign: "left" }}>
            <label
              style={{
                fontSize: "9px",
                color: "#94a3b8",
                fontWeight: "900",
                marginLeft: "10px",
                marginBottom: "8px",
                display: "block",
              }}
            >
              EMAIL ADDRESS
            </label>
            <Mail
              size={18}
              color="#64748b"
              style={{ position: "absolute", left: "16px", bottom: "16px" }}
            />
            <input
              type="email"
              style={inputStyle}
              placeholder="student@arewavacademy.edu.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ position: "relative", textAlign: "left" }}>
            <label
              style={{
                fontSize: "9px",
                color: "#94a3b8",
                fontWeight: "900",
                marginLeft: "10px",
                marginBottom: "8px",
                display: "block",
              }}
            >
              SECURITY KEY
            </label>
            <Lock
              size={18}
              color="#64748b"
              style={{ position: "absolute", left: "16px", bottom: "16px" }}
            />
            <input
              type="password"
              style={inputStyle}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "18px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "1rem",
              fontWeight: "900",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              textTransform: "uppercase",
              fontSize: "12px",
              letterSpacing: "1px",
            }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Enter Terminal <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: "32px",
            borderTop: "1px solid #1e293b",
            paddingTop: "20px",
          }}
        >
          <p
            style={{
              color: "#475569",
              fontSize: "9px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <UserCheck size={14} color="#2563eb" /> SECURE AREWA SESSION
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
