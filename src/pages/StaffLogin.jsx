import React, { useState } from "react";
// FIXED: Explicitly importing both firestore (as db) and auth from your configuration
import { firestore as db, auth } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ShieldCheck, Loader2, ShieldAlert, X } from "lucide-react";
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
      // 1. Firebase Authentication (Fixed: auth is now imported)
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );
      const user = userCredential.user;

      if (!db) {
        throw new Error("Firestore instance not initialized.");
      }

      // 2. Fetch User Profile from Firestore
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Normalize Role and Status for comparison
        const rawRole = userData.role || userData.Role || "";
        const userRole = rawRole.toLowerCase().trim();

        const rawStatus = userData.status || userData.Status || "";
        const userStatus = rawStatus.toLowerCase().trim();

        const authorizedRoles = [
          "rector",
          "super-admin",
          "admin",
          "admission-officer",
          "staff",
        ];

        // 3. Validation Logic
        if (authorizedRoles.includes(userRole)) {
          if (userStatus === "active") {
            navigate("/admin", { replace: true });
          } else {
            await signOut(auth);
            setError(
              "ACCESS REVOKED: This administrative account is currently inactive.",
            );
          }
        } else {
          await signOut(auth);
          setError(
            `ACCESS DENIED: Insufficient permissions for role: ${rawRole}`,
          );
        }
      } else {
        await signOut(auth);
        setError(
          "DATABASE ERROR: No administrative profile found for this UID.",
        );
      }
    } catch (err) {
      console.error("Auth Error:", err.code);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-email"
      ) {
        setError("AUTHENTICATION FAILED: Invalid credentials or security key.");
      } else {
        setError("SYSTEM ERROR: " + err.message);
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
        position: "relative",
        overflow: "hidden",
      }}
    >
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
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                color: "#94a3b8",
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
                marginLeft: "5px",
              }}
            >
              Institutional Email
            </label>
            <input
              type="email"
              placeholder="e.g. admin@arewavisa.com"
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

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                color: "#94a3b8",
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
                marginLeft: "5px",
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
              transition: "0.3s",
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? (
              <Loader2
                className="animate-spin"
                style={{ margin: "0 auto" }}
                size={20}
              />
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
          © 2026 Arewa Visa Academy Hub
        </p>
      </div>
    </div>
  );
};

export default StaffLogin;
