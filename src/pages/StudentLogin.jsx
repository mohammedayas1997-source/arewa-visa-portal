import React, { useState } from "react";
// Import everything directly to avoid naming conflicts
import { auth, firestore as db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { BookOpen, Loader2, X } from "lucide-react";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Try to sign in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );

      const user = userCredential.user;
      console.log("Step 1 Success: Authenticated UID:", user.uid);

      // 2. Try to get data, but DON'T stop if it fails
      try {
        const userRef = doc(db, "applications", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          console.log("Step 2 Success: Profile Found");
        } else {
          console.log(
            "Step 2 Warning: No profile in 'applications', checking 'users'...",
          );
          const backupRef = doc(db, "users", user.uid);
          await getDoc(backupRef);
        }
      } catch (dbError) {
        console.error(
          "Database check failed, but forcing navigation anyway:",
          dbError,
        );
      }

      // 3. FORCE NAVIGATION
      // If the screen still doesn't change, your App.js route is the problem
      console.log("Step 3: Attempting redirect to /student-portal");
      navigate("/student-portal");
    } catch (err) {
      console.error("Login Error:", err.code, err.message);
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else {
        setError("System Error: " + err.message);
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
            placeholder="Email"
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
            placeholder="Password"
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
              "LOGIN NOW"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
