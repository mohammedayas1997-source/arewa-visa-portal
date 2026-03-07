import React, { useState } from "react";
import { auth, firestore as db } from "../firebase";
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
      console.log("Attempting Auth for:", email);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );
      const user = userCredential.user;

      // Tabbatar an haɗa da db kafin kiran Firestore
      if (!db) {
        throw new Error("Firestore instance (db) not found. Check firebase.js");
      }

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Duba Role da Status (ko da babban harafi ko ƙarami)
        const userRole = userData.role || userData.Role;
        const userStatus = (
          userData.status ||
          userData.Status ||
          ""
        ).toLowerCase();

        const authorizedRoles = [
          "rector",
          "super-admin",
          "admin",
          "admission-officer",
          "staff",
        ];

        if (authorizedRoles.includes(userRole)) {
          if (userStatus === "active") {
            console.log("Access Granted. Role:", userRole);
            navigate("/admin", { replace: true });
          } else {
            await signOut(auth);
            setError("ACCESS DENIED: Asusunka baya aiki (Inactive).");
          }
        } else {
          await signOut(auth);
          setError("UNAUTHORIZED: Wannan portal ɗin na ma'aikata ne kawai.");
        }
      } else {
        await signOut(auth);
        setError("DATABASE ERROR: Ba'a sami profile ɗinka a Firestore ba.");
      }
    } catch (err) {
      console.error("Firebase Error Code:", err.code);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        setError("AUTH FAILED: Imel ko Security Key ba daidai ba.");
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
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <input
            type="email"
            placeholder="Institutional Email"
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
          <input
            type="password"
            placeholder="Security Key"
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
              cursor: "pointer",
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
      </div>
    </div>
  );
};

export default StaffLogin;
