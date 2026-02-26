import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ArrowRight,
  Loader2,
  UserCheck,
  KeyRound,
  X,
} from "lucide-react";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists() && userSnap.data().role === "student") {
            navigate("/student-portal");
          }
        } catch (err) {
          console.error("Auth sync error:", err);
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );
      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === "student") {
        navigate("/student-portal");
      } else {
        await signOut(auth);
        alert("Access Denied: Students only.");
      }
    } catch (error) {
      alert("Login Failed: Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // STYLE OBJECTS (Don tabbatar komai ya zauna daram ko da CSS ya bata)
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f8fafc",
      padding: "20px",
    },
    card: {
      backgroundColor: "#fff",
      padding: "40px",
      borderRadius: "30px",
      boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "400px",
      textAlign: "center",
      position: "relative",
    },
    closeBtn: {
      position: "absolute",
      top: "20px",
      right: "20px",
      border: "none",
      background: "none",
      cursor: "pointer",
      color: "#64748b",
    },
    inputGroup: { textAlign: "left", marginBottom: "20px" },
    label: {
      display: "block",
      fontSize: "10px",
      fontWeight: "900",
      color: "#64748b",
      textTransform: "uppercase",
      marginBottom: "8px",
      marginLeft: "5px",
    },
    input: {
      width: "100%",
      padding: "15px",
      borderRadius: "15px",
      border: "2px solid #f1f5f9",
      outline: "none",
      fontSize: "14px",
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
      fontSize: "12px",
      textTransform: "uppercase",
      cursor: "pointer",
      marginTop: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button onClick={() => navigate("/")} style={styles.closeBtn}>
          <X size={24} />
        </button>

        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#2563eb",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 15px",
            }}
          >
            <BookOpen color="#fff" size={30} />
          </div>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "900",
              margin: 0,
              color: "#0f172a",
            }}
          >
            AREWA <span style={{ color: "#2563eb" }}>ACADEMY</span>
          </h2>
          <p
            style={{
              fontSize: "9px",
              fontWeight: "800",
              color: "#94a3b8",
              textTransform: "uppercase",
              marginTop: "5px",
            }}
          >
            Authorized Access Only
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              style={styles.input}
              placeholder="e.g. name@arewa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Security Key</label>
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
                Enter Classroom <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: "30px",
            borderTop: "1px solid #f1f5f9",
            paddingTop: "20px",
          }}
        >
          <p
            style={{
              fontSize: "9px",
              fontWeight: "900",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            <UserCheck size={14} color="#2563eb" /> SECURE AREWA SESSION
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
