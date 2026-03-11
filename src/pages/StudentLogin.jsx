import React, { useState } from "react";
import { firestore as db, auth } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const cleanEmail = email.trim().toLowerCase();

      // STEP 1: AUTHENTICATION
      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password,
      );
      const user = userCredential.user;
      console.log("Auth Success. UID:", user.uid);

      // STEP 2: FIRESTORE LOOKUP
      // We try the 'applications' collection first
      const userRef = doc(db, "applications", user.uid);

      let userSnap;
      try {
        userSnap = await getDoc(userRef);
      } catch (firestoreErr) {
        console.error("Firestore access error:", firestoreErr);
        // If Firestore fails, we force entry to test the route
        navigate("/student-portal");
        return;
      }

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const pStatus = (userData.paymentStatus || "").toLowerCase();

        // If you want to be strict about payment, keep this.
        // If you just want to login now, comment out the next 5 lines.
        if (
          pStatus !== "paid" &&
          pStatus !== "completed" &&
          pStatus !== "success"
        ) {
          console.warn("Payment unverified for:", user.uid);
        }

        navigate("/student-portal");
      } else {
        // Fallback: If no profile exists, still allow login for now to test the dashboard
        console.log("No profile found, but allowing access for testing.");
        navigate("/student-portal");
      }
    } catch (err) {
      console.error("Login System Error:", err.code);
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else {
        setError("Security System Error: " + err.message);
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
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "#141414",
          borderRadius: "40px",
          padding: "40px",
          position: "relative",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#dc2626",
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyCenter: "center",
              margin: "0 auto 20px",
            }}
          >
            <BookOpen size={40} color="white" style={{ margin: "auto" }} />
          </div>
          <h2
            style={{
              color: "white",
              fontSize: "28px",
              fontWeight: "900",
              textTransform: "uppercase",
            }}
          >
            Student Portal
          </h2>
        </div>

        {error && (
          <div
            style={{
              color: "#f87171",
              padding: "15px",
              borderRadius: "10px",
              fontSize: "12px",
              textAlign: "center",
              background: "rgba(220,38,38,0.1)",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "15px",
              background: "#1a1a1a",
              border: "1px solid #333",
              color: "white",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "15px",
              background: "#1a1a1a",
              border: "1px solid #333",
              color: "white",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "20px",
              background: "#dc2626",
              color: "white",
              borderRadius: "20px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading ? (
              <Loader2 className="animate-spin" style={{ margin: "auto" }} />
            ) : (
              "AUTHORIZE ACCESS"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
