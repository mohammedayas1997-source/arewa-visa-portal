import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  ShieldAlert,
  GraduationCap,
  ChevronRight,
  Loader2,
} from "lucide-react";

// ... (sauran imports suna nan daram)

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    setLoading(true);
    setError("");

    // GYARA 1: Tabbatar babu sarari (space) kuma duka ƙananan baki ne
    const emailValue = email.trim().toLowerCase();

    // GYARA 2: Na cire takunkumin @arewavacademy.edu.ng domin kowane email ya wuce
    // Idan kana son dawo da shi, zaka iya cire alamar comment (/* */)

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailValue,
        password,
      );
      const user = userCredential.user;

      // 2. TANTANCEWA: Duba idan dalibi ne a Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.role === "student") {
          navigate("/student-portal");
        } else {
          setError("Access Denied: This is not a student account.");
          await auth.signOut();
        }
      } else {
        setError("Access Denied: Student record not found in database.");
        await auth.signOut();
      }
    } catch (err) {
      console.error("Login Error:", err.code);
      // Karin haske ga mai amfani
      if (err.code === "auth/user-not-found")
        setError("Email din nan babu shi a system.");
      else if (err.code === "auth/wrong-password")
        setError("Security Access Key din ka ba daidai ba ne.");
      else setError("Authentication Failed: Invalid Credentials.");
    } finally {
      setLoading(false);
    }
  };

  // ... (UI code dinka duka yana nan daram ba mu taba ba)
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#020617",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ maxWidth: "450px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "2rem",
              marginBottom: "24px",
              boxShadow: "0 25px 50px -12px rgba(37, 99, 235, 0.25)",
            }}
          >
            <GraduationCap size={40} />
          </div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "900",
              color: "white",
              fontStyle: "italic",
              letterSpacing: "-0.05em",
              textTransform: "uppercase",
              margin: "0",
            }}
          >
            AREWA VISA <span style={{ color: "#2563eb" }}>ACADEMY</span>
          </h1>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "900",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.4em",
              marginTop: "8px",
            }}
          >
            Student Terminal Login
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "2.5rem",
            padding: "40px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "9px",
                  fontWeight: "900",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginLeft: "16px",
                  marginBottom: "8px",
                }}
              >
                Institutional Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  style={{
                    position: "absolute",
                    left: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                  }}
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@academy.com"
                  style={{
                    width: "100%",
                    backgroundColor: "#1e293b",
                    border: "2px solid #1e293b",
                    color: "white",
                    borderRadius: "1.25rem",
                    padding: "16px 16px 16px 56px",
                    outline: "none",
                    fontWeight: "bold",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "9px",
                  fontWeight: "900",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginLeft: "16px",
                  marginBottom: "8px",
                }}
              >
                Security Access Key
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  style={{
                    position: "absolute",
                    left: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                  }}
                  size={18}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    backgroundColor: "#1e293b",
                    border: "2px solid #1e293b",
                    color: "white",
                    borderRadius: "1.25rem",
                    padding: "16px 16px 16px 56px",
                    outline: "none",
                    fontWeight: "bold",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {error && (
              <div
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  color: "#ef4444",
                  fontSize: "10px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  padding: "16px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <ShieldAlert size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: "#2563eb",
                color: "white",
                fontWeight: "900",
                textTransform: "uppercase",
                fontSize: "12px",
                letterSpacing: "0.1em",
                padding: "20px",
                borderRadius: "1.25rem",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? "0.7" : "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "0.3s",
              }}
            >
              {loading ? (
                <Loader2
                  style={{ animation: "spin 1s linear infinite" }}
                  size={20}
                />
              ) : (
                <>
                  Enter Terminal <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default StudentLogin;
