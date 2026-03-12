import React, { useState } from "react";
import { auth, firestore } from "../firebase"; 
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { BookOpen, Loader2, X, ShieldAlert } from "lucide-react";

const StudentLogin = ({ onClose }) => { // Added onClose prop
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

      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      
      // 2. SEARCH BY EMAIL in Applications
      const appQuery = query(
        collection(firestore, "applications"), 
        where("email", "==", cleanEmail),
        limit(1)
      );
      
      const querySnapshot = await getDocs(appQuery);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();

        // 3. Verify Payment Status
        const pStatus = (userData.status || userData.paymentStatus || "").toLowerCase();
        if (pStatus !== "paid" && pStatus !== "completed") {
          await signOut(auth);
          setError("PAYMENT REQUIRED: Your application fee has not been verified.");
          setLoading(false);
          return;
        }

        // Success!
        navigate("/student-portal");
      } else {
        setError("RECORD NOT FOUND: No student record found for this email.");
        await signOut(auth);
      }
    } catch (err) {
      console.error("Login Error:", err.code);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else {
        setError("System Error: Check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0a", color: "white", position: "relative" }}>
      
      {/* CLOSE BUTTON */}
      <button 
        onClick={onClose} 
        style={{ position: "absolute", top: "20px", right: "20px", background: "white", border: "none", borderRadius: "50%", width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.5)", zIndex: 100 }}
      >
        <X size={24} color="#000" />
      </button>

      <div style={{ width: "90%", maxWidth: "400px", background: "#111", padding: "40px", borderRadius: "30px", border: "1px solid #222", boxShadow: "0 20px 50px rgba(0,0,0,0.8)" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ background: "rgba(220,38,38,0.1)", display: "inline-block", padding: "15px", borderRadius: "50%", marginBottom: "15px" }}>
            <BookOpen size={40} color="#dc2626" />
          </div>
          <h2 style={{ textTransform: "uppercase", fontWeight: "900", letterSpacing: "1px", marginBottom: "5px" }}>Student Login</h2>
          <p style={{ color: "#666", fontSize: "12px", textTransform: "uppercase" }}>Access Your Learning Dashboard</p>
        </div>

        {error && (
          <div style={{ background: "rgba(220,38,38,0.1)", color: "#f87171", padding: "12px", borderRadius: "12px", marginBottom: "20px", fontSize: "12px", textAlign: "center", border: "1px solid rgba(220,38,38,0.2)", display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "10px", textTransform: "uppercase", fontWeight: "bold", color: "#666", marginLeft: "5px" }}>Registered Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "15px", borderRadius: "12px", background: "#000", border: "1px solid #333", color: "white", outline: "none" }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "10px", textTransform: "uppercase", fontWeight: "bold", color: "#666", marginLeft: "5px" }}>Secret Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: "15px", borderRadius: "12px", background: "#000", border: "1px solid #333", color: "white", outline: "none" }}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{ padding: "16px", background: "#dc2626", color: "white", border: "none", borderRadius: "50px", fontWeight: "900", cursor: "pointer", marginTop: "10px", textTransform: "uppercase", letterSpacing: "1px", transition: "0.3s shadow", boxShadow: "0 10px 20px rgba(220,38,38,0.3)" }}
          >
            {loading ? <Loader2 className="animate-spin" style={{ margin: "auto" }} /> : "STUDENT ACCESS"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;