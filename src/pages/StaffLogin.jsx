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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists() && userSnap.data().role !== "student") {
            // navigate("/admin-dashboard");
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cleanEmail = email.trim().toLowerCase();
      console.log("Logging in with:", cleanEmail);

      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;
      console.log("Auth Success! UID:", user.uid);

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        // MUHIMMI: Mun mayar da role din ya zama lowercase don magance matsalar babban harafi
        const role = userData.role ? userData.role.toLowerCase() : "";
        console.log("Found User Role:", role);

        const authorized = ["rector", "admin", "supervisor", "admission-officer", "super-admin"];

        if (authorized.includes(role)) {
          console.log("Access Granted. Redirecting...");
          if (role === "rector") navigate("/rector-dashboard");
          else if (role === "admin" || role === "admission-officer") navigate("/admin-dashboard");
          else if (role === "supervisor") navigate("/supervisor-dashboard");
          else navigate("/instructor-hub");
        } else {
          console.error("Role not authorized:", role);
          await signOut(auth);
          setError("ACCESS DENIED: Role dinka bashi da izini.");
        }
      } else {
        console.error("No Firestore document for UID:", user.uid);
        await signOut(auth);
        setError("DATABASE ERROR: Ba'a samu profile dinka a Firestore ba.");
      }
    } catch (err) {
      console.error("Full Firebase Error:", err.code, err.message);
      // Wannan zai nuna maka takamaiman error din a screen
      setError(`LOGIN FAILED: ${err.code === 'auth/invalid-credential' ? 'Email ko Password ba daidai ba' : err.message}`);
    } finally {
      setLoading(false);
    }
};
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      backgroundColor: "#020617", // Slate-950
      padding: "24px",
      position: "relative",
      fontFamily: "sans-serif"
    }}>
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
          transition: "color 0.3s"
        }}
      >
        <X size={32} />
      </button>

      <div style={{
        backgroundColor: "#ffffff",
        padding: "40px",
        borderRadius: "40px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <div style={{ padding: "16px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "20px" }}>
            <ShieldCheck size={40} />
          </div>
        </div>

        <h2 style={{ fontSize: "24px", fontWeight: "900", textAlign: "center", marginBottom: "24px", color: "#111827", textTransform: "uppercase", fontStyle: "italic" }}>
          AREWA <span style={{ color: "#dc2626" }}>COMMAND CENTER</span>
        </h2>

        {error && (
          <div style={{
            marginBottom: "16px",
            padding: "12px",
            backgroundColor: "#fef2f2",
            color: "#b91c1c",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "12px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderLeft: "4px solid #dc2626"
          }}>
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="email"
            placeholder="Staff Email"
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              outline: "none",
              fontWeight: "bold",
              boxSizing: "border-box"
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
              boxSizing: "border-box"
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
              transition: "background-color 0.3s"
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