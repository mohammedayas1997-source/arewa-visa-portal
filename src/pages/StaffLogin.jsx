import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  ShieldCheck,
  Loader2,
  ShieldAlert,
  X,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StaffLogin = () => {
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (
        userDoc.exists() &&
        [
          "rector",
          "super-admin",
          "admin",
          "admission-officer",
          "staff",
        ].includes(userDoc.data().role)
      ) {
        if (userDoc.data().status === "active") {
          navigate("/admin", { replace: true });
        } else {
          await signOut(auth);
          setError("Asusunka ba ya aiki (Inactive).");
        }
      } else {
        await signOut(auth);
        setError("Ba ka da ikon shiga wannan portal din.");
      }
    } catch (err) {
      setError("Imel ko Security Key ba daidai ba.");
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
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "300px",
          height: "300px",
          backgroundColor: "rgba(220, 38, 38, 0.15)",
          filter: "blur(100px)",
          borderRadius: "50%",
        }}
      ></div>

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#141414",
          borderRadius: "30px",
          border: "1px solid rgba(255,255,255,0.05)",
          padding: "40px",
          position: "relative",
          zIndex: 10,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "none",
            border: "none",
            color: "#666",
            cursor: "pointer",
          }}
        >
          <X size={24} />
        </button>

        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              width: "70px",
              height: "70px",
              backgroundColor: "#dc2626",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 10px 20px rgba(220, 38, 38, 0.3)",
            }}
          >
            <ShieldCheck size={35} color="white" />
          </div>
          <h2
            style={{
              color: "white",
              fontSize: "24px",
              fontWeight: "900",
              textTransform: "uppercase",
              margin: "0",
              letterSpacing: "-1px",
            }}
          >
            Staff <span style={{ color: "#dc2626" }}>Command</span>
          </h2>
          <p
            style={{
              color: "#059669",
              fontSize: "10px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "3px",
              marginTop: "5px",
            }}
          >
            Arewa Visa Academy
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "rgba(220, 38, 38, 0.1)",
              border: "1px solid #dc2626",
              color: "#f87171",
              padding: "12px",
              borderRadius: "12px",
              fontSize: "11px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div>
            <label
              style={{
                color: "#94a3b8",
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
                marginLeft: "5px",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Institutional Email
            </label>
            <input
              type="email"
              placeholder="staff@arewavisa.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "15px",
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "15px",
                color: "white",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{
                color: "#94a3b8",
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
                marginLeft: "5px",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Security Key
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "15px",
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "15px",
                color: "white",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "15px",
              fontWeight: "900",
              textTransform: "uppercase",
              fontSize: "12px",
              letterSpacing: "2px",
              cursor: "pointer",
              marginTop: "10px",
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? (
              <Loader2 className="animate-spin" style={{ margin: "0 auto" }} />
            ) : (
              "Authorize Access"
            )}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            color: "#475569",
            fontSize: "9px",
            marginTop: "30px",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          © 2026 Admin Security Hub
        </p>
      </div>
    </div>
  );
};

export default StaffLogin;
