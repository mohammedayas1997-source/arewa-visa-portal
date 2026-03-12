import React, { useState } from "react";
import { auth, firestore } from "../firebase"; 
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, query, where, getDocs, limit } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";
import { BookOpen, Loader2, X } from "lucide-react"; // Added X icon

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
      const user = userCredential.user;

      // 2. SEARCH BY EMAIL
      const appQuery = query(
        collection(firestore, "applications"), 
        where("email", "==", cleanEmail),
        limit(1)
      );
      
      const querySnapshot = await getDocs(appQuery);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();

        // 3. Verify Payment Status
        const pStatus = (userData.paymentStatus || "").toLowerCase();
        if (pStatus !== "paid" && pStatus !== "completed") {
          await signOut(auth);
          setError("PAYMENT REQUIRED: Please complete your application fee.");
          setLoading(false);
          return;
        }

        // Success!
        navigate("/student-portal");
      } else {
        setError("RECORD NOT FOUND: No application found for this email.");
        await signOut(auth);
      }
    } catch (err) {
      console.error("Login Error:", err.code);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/wrong-password") {
        setError("Wrong password. Please try again.");
      } else {
        setError("System Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0a", color: "white", fontFamily: "sans-serif", position: "relative" }}>
      
      {/* CLOSE BUTTON */}
      <button 
        onClick={onClose} 
        style={{ 
          position: "absolute", 
          top: "20px", 
          right: "20px", 
          background: "rgba(255,255,255,0.1)", 
          border: "none", 
          borderRadius: "50%", 
          width: "40px", 
          height: "40px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          cursor: "pointer",
          zIndex: 10
        }}
      >
        <X size={24} color="white" />
      </button>

      <div style={{ width: "90%", maxWidth: "400px", background: "#111", padding: "40px", borderRadius: "30px", border: "1px solid #222" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <BookOpen size={40} color="#dc2626" style={{ marginBottom: "15px" }} />
          <h2 style={{ textTransform: "uppercase", fontWeight: "900" }}>Student Login</h2>
        </div>

        {error && (
          <div style={{ background: "rgba(220,38,38,0.1)", color: "#f87171", padding: "10px", borderRadius: "10px", marginBottom: "20px", fontSize: "12px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "15px", borderRadius: "10px", background: "#000", border: "1px solid #333", color: "white", outline: "none" }}
            required
          />
          <input
            type="password"
            placeholder="Account Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "15px", borderRadius: "10px", background: "#000", border: "1px solid #333", color: "white", outline: "none" }}
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
              transition: "0.3s"
            }}
          >
            {loading ? <Loader2 className="animate-spin" style={{ margin: "auto" }} /> : "STUDENT ACCESS"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;