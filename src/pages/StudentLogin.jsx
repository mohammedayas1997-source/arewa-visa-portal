import React, { useState } from "react";
import { auth, firestore } from "../firebase"; 
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, query, where, getDocs, limit } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";
import { BookOpen, Loader2, X } from "lucide-react";

const StudentLogin = ({ onClose }) => {
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
      
      // 2. Search Firestore by Email (Searching both applications and users)
      const appQuery = query(
        collection(firestore, "applications"), 
        where("email", "==", cleanEmail),
        limit(1)
      );
      
      const querySnapshot = await getDocs(appQuery);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();

        // 3. Verify Payment Status (Checks for 'Paid' or 'paid')
        const pStatus = (userData.paymentStatus || userData.status || "").toLowerCase();
        
        if (pStatus !== "paid" && pStatus !== "completed") {
          await signOut(auth);
          setError("ACCESS DENIED: Your payment of N5,000 has not been verified yet.");
          setLoading(false);
          return;
        }

        // Success: Go to Portal
        navigate("/student-portal");
      } else {
        // Check if they exist in a general users collection as backup
        const userCheck = query(collection(firestore, "users"), where("email", "==", cleanEmail), limit(1));
        const userSnap = await getDocs(userCheck);
        
        if(!userSnap.empty) {
            navigate("/student-portal");
        } else {
            setError("RECORD NOT FOUND: Please use your registered @arewavacademy.edu.ng email.");
            await signOut(auth);
        }
      }
    } catch (err) {
      console.error("Login Error Code:", err.code);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password. Use your @arewavacademy.edu.ng account.");
      } else {
        setError("System Link Error: " + err.message);
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
        style={{ position: "absolute", top: "20px", right: "20px", background: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10 }}
      >
        <X size={24} color="black" />
      </button>

      <div style={{ width: "90%", maxWidth: "400px", background: "#111", padding: "40px", borderRadius: "30px", border: "1px solid #222" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <BookOpen size={40} color="#dc2626" style={{ marginBottom: "15px" }} />
          <h2 style={{ textTransform: "uppercase", fontWeight: "900" }}>Student Login</h2>
          <p style={{ fontSize: "10px", color: "#666" }}>OFFICIAL ACADEMY ACCESS</p>
        </div>

        {error && (
          <div style={{ background: "rgba(220,38,38,0.1)", color: "#f87171", padding: "10px", borderRadius: "10px", marginBottom: "20px", fontSize: "12px", textAlign: "center", border: "1px solid rgba(220,38,38,0.3)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "11px", color: "#999", marginLeft: "5px" }}>ACADEMY EMAIL</label>
            <input
              type="email"
              placeholder="username@arewavacademy.edu.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "15px", borderRadius: "12px", background: "#000", border: "1px solid #333", color: "white", outline: "none" }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "11px", color: "#999", marginLeft: "5px" }}>PASSWORD</label>
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
            style={{ padding: "15px", background: "#dc2626", color: "white", border: "none", borderRadius: "50px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}
          >
            {loading ? <Loader2 className="animate-spin" style={{ margin: "auto" }} /> : "LOGIN TO PORTAL"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;