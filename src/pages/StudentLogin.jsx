import React, { useState, useEffect } from "react";
// Tabbatar path din nan daidai ne zuwa file din firebase dinka
import { db, auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight, Loader2, UserCheck, X } from "lucide-react";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Tsaro: Idan db bai yi loading ba tun farko
    if (!db) {
      alert("SYSTEM ERROR: Firebase Database (db) not initialized properly.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      // ANAN NE MATSALAR TAKE: Tabbatar 'db' bashi da matsala
      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.role === "student") {
          navigate("/student-portal");
        } else {
          await signOut(auth);
          alert("RESTRICTED: Students only.");
        }
      } else {
        await signOut(auth);
        alert("DATABASE ERROR: No profile found in Firestore.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("SYSTEM ERROR: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // UI STYLES (Inline CSS don tabbatar komai ya zauna madaidaici a waya)
  const styles = {
    main: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#020617",
      padding: "20px",
    },
    card: {
      backgroundColor: "#0f172a",
      padding: "40px",
      borderRadius: "30px",
      border: "1px solid #1e293b",
      width: "100%",
      maxWidth: "400px",
      textAlign: "center",
      position: "relative",
    },
    input: {
      width: "100%",
      padding: "15px",
      margin: "10px 0",
      borderRadius: "15px",
      backgroundColor: "#1e293b",
      border: "1px solid #334155",
      color: "#fff",
      outline: "none",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "18px",
      backgroundColor: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: "15px",
      fontWeight: "900",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.main}>
      <div style={styles.card}>
        <button
          onClick={() => navigate("/")}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#64748b",
          }}
        >
          <X size={24} />
        </button>

        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#2563eb",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 15px",
              boxShadow: "0 10px 20px rgba(37, 99, 235, 0.3)",
            }}
          >
            <BookOpen color="#fff" size={32} />
          </div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "900",
              color: "#fff",
              letterSpacing: "-1px",
            }}
          >
            AREWA <span style={{ color: "#2563eb" }}>ACADEMY</span>
          </h2>
          <p
            style={{
              fontSize: "9px",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "3px",
              marginTop: "5px",
            }}
          >
            Student Terminal Access
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ textAlign: "left" }}>
            <label
              style={{
                fontSize: "9px",
                fontWeight: "bold",
                color: "#94a3b8",
                marginLeft: "5px",
              }}
            >
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              style={styles.input}
              placeholder="name@academy.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ textAlign: "left", marginTop: "15px" }}>
            <label
              style={{
                fontSize: "9px",
                fontWeight: "bold",
                color: "#94a3b8",
                marginLeft: "5px",
              }}
            >
              SECURITY ACCESS KEY
            </label>
            <input
              type="password"
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Enter Classroom <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p
          style={{
            marginTop: "30px",
            fontSize: "9px",
            color: "#475569",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontWeight: "800",
          }}
        >
          <UserCheck size={14} color="#2563eb" /> SECURE AREWA SESSION
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
