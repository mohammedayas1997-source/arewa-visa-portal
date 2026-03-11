import React, { useState } from "react";
import { firestore as db, auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Loader2,
  UserCheck,
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
      alert("RESET DISPATCHED: Check your inbox.");
    } catch (error) {
      alert("SYSTEM ERROR: Could not send reset email.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const cleanEmail = email.trim().toLowerCase();

      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password,
      );
      const user = userCredential.user;

      // 2. Check 'applications' collection (where Paystack success saves data)
      const userRef = doc(db, "applications", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        // Use .toLowerCase() to avoid "Paid" vs "paid" mismatch
        const pStatus = (userData.paymentStatus || "").toLowerCase().trim();
        const aStatus = (userData.status || "").toLowerCase().trim();

        // Validation Logic
        if (
          pStatus !== "paid" &&
          pStatus !== "completed" &&
          pStatus !== "success"
        ) {
          await signOut(auth);
          setError(
            `PAYMENT UNVERIFIED: Your status is "${pStatus}". Please complete your tuition.`,
          );
          setLoading(false);
          return;
        }

        if (aStatus === "suspended" || aStatus === "rejected") {
          await signOut(auth);
          setError(
            "ACCOUNT LOCKED: Access has been disabled by the Registrar.",
          );
          setLoading(false);
          return;
        }

        // Success - Navigate to Portal
        navigate("/student-portal");
      } else {
        // Fallback for manual users added to 'users' collection
        const backupRef = doc(db, "users", user.uid);
        const backupSnap = await getDoc(backupRef);

        if (backupSnap.exists()) {
          navigate("/student-portal");
        } else {
          await signOut(auth);
          setError(
            "DATA ERROR: Authentication successful, but no student profile found.",
          );
        }
      }
    } catch (err) {
      console.error("Auth Error:", err.code);
      if (err.code === "auth/invalid-credential") {
        setError("LOGIN FAILED: Incorrect email or password.");
      } else if (err.code === "auth/network-request-failed") {
        setError("NETWORK ERROR: Check your internet connection.");
      } else {
        setError("SECURITY ERROR: " + err.message);
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
        backgroundColor: "#0a0a0a",
        padding: "20px",
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-10%",
          width: "400px",
          height: "400px",
          backgroundColor: "rgba(220, 38, 38, 0.1)",
          filter: "blur(120px)",
          borderRadius: "50%",
        }}
      ></div>
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "#141414",
          borderRadius: "40px",
          border: "1px solid rgba(255,255,255,0.05)",
          padding: "40px",
          position: "relative",
          zIndex: 10,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            background: "linear-gradient(to right, #dc2626, #7f1d1d)",
          }}
        ></div>
        <button
          onClick={() => navigate("/")}
          style={{
            position: "absolute",
            top: "25px",
            right: "25px",
            background: "none",
            border: "none",
            color: "#666",
            cursor: "pointer",
          }}
        >
          <X size={24} />
        </button>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#dc2626",
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 15px 30px rgba(220, 38, 38, 0.3)",
            }}
          >
            <BookOpen size={40} color="white" />
          </div>
          <h2
            style={{
              color: "white",
              fontSize: "28px",
              fontWeight: "900",
              textTransform: "uppercase",
              margin: "0",
              letterSpacing: "-1px",
            }}
          >
            Student <span style={{ color: "#dc2626" }}>Portal</span>
          </h2>
          <p
            style={{
              color: "#475569",
              fontSize: "10px",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "4px",
              marginTop: "10px",
            }}
          >
            Arewa Visa Academy
          </p>
        </div>
        {error && (
          <div
            style={{
              backgroundColor: "rgba(220, 38, 38, 0.1)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              color: "#f87171",
              padding: "15px",
              borderRadius: "18px",
              fontSize: "11px",
              marginBottom: "25px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "25px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                color: "#64748b",
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
                marginLeft: "15px",
                letterSpacing: "1px",
              }}
            >
              <Mail
                size={12}
                style={{
                  marginRight: "5px",
                  verticalAlign: "middle",
                  color: "#dc2626",
                }}
              />{" "}
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. student@arewavisa.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "18px 25px",
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                color: "white",
                outline: "none",
                fontSize: "14px",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0 15px",
              }}
            >
              <label
                style={{
                  color: "#64748b",
                  fontSize: "10px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                <LockKeyhole
                  size={12}
                  style={{
                    marginRight: "5px",
                    verticalAlign: "middle",
                    color: "#dc2626",
                  }}
                />{" "}
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{
                  background: "none",
                  border: "none",
                  color: "#dc2626",
                  fontSize: "9px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Recovery
              </button>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "18px 25px",
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                color: "white",
                outline: "none",
                fontSize: "14px",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "20px",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "25px",
              fontWeight: "900",
              textTransform: "uppercase",
              fontSize: "13px",
              letterSpacing: "3px",
              cursor: "pointer",
              marginTop: "15px",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              <Loader2
                className="animate-spin"
                style={{ margin: "0 auto" }}
                size={24}
              />
            ) : (
              "Authorize Access"
            )}
          </button>
        </form>
        <div
          style={{
            marginTop: "35px",
            textAlign: "center",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: "25px",
          }}
        >
          <p
            style={{
              color: "#334155",
              fontSize: "10px",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            <UserCheck
              size={14}
              style={{
                marginRight: "8px",
                verticalAlign: "middle",
                color: "#dc2626",
              }}
            />{" "}
            Secure Student Session
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
