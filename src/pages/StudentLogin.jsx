import React, { useState } from "react";
// 1. FIXED: Imported firestore and auth correctly from your firebase.js
import { auth, firestore } from "../firebase"; 
// 2. FIXED: Added signOut so the payment-rejection logic works
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { BookOpen, Loader2 } from "lucide-react";

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

      // Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );
      const user = userCredential.user;

      // 3. FIXED: Using 'firestore' instance correctly for Student Admission logic
      // We check the "applications" collection for the payment status
      const appRef = doc(firestore, "applications", user.uid);
      const appSnap = await getDoc(appRef);

      if (appSnap.exists()) {
        const userData = appSnap.data();

        // 4. FIXED: Enhanced payment status verification
        const pStatus = (userData.paymentStatus || "").toLowerCase();
        if (pStatus !== "paid" && pStatus !== "completed") {
          await signOut(auth); // User is logged out if they haven't paid
          setError("PAYMENT REQUIRED: Your admission fee is not verified.");
          setLoading(false);
          return;
        }

        navigate("/student-portal");
      } else {
        // If no application found, check for a standard user profile
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          navigate("/student-portal");
        } else {
          setError("PROFILE NOT FOUND: Please contact AVA support.");
        }
      }
    } catch (err) {
      console.error("Login Error:", err.code);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") {
        setError("Invalid email or password.");
      } else {
        setError("System Link Error: " + err.message);
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
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#111",
          padding: "40px",
          borderRadius: "30px",
          border: "1px solid #222",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <BookOpen
            size={40}
            color="#dc2626"
            style={{ marginBottom: "15px" }}
          />
          <h2 style={{ textTransform: "uppercase", fontWeight: "900" }}>
            Student Login
          </h2>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(220,38,38,0.1)",
              color: "#f87171",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "15px",
              borderRadius: "10px",
              background: "#000",
              border: "1px solid #333",
              color: "white",
            }}
            required
          />
          <input
            type="password"
            placeholder="Account Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "15px",
              borderRadius: "10px",
              background: "#000",
              border: "1px solid #333",
              color: "white",
            }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "15px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading ? (
              <Loader2 className="animate-spin" style={{ margin: "auto" }} />
            ) : (
              "STUDENT ACCESS"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;