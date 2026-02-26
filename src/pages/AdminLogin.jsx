import React, { useState } from "react";
import { auth, db } from "../firebase"; // Tabbatar path din nan daidai ne
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2, X } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Tabbatar 'db' yana nan (Wannan zai magance hoton error din da ka turo)
      if (!db) throw new Error("Firebase database not initialized.");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const role = userSnap.data().role;

        // 2. MADAIDAICIN REDIRECTION (Wannan zai hana komawa Home)
        if (role === "rector") navigate("/rector-dashboard", { replace: true });
        else if (role === "admin" || role === "admission-officer")
          navigate("/admin-dashboard", { replace: true });
        else if (role === "supervisor")
          navigate("/supervisor-dashboard", { replace: true });
        else {
          await signOut(auth);
          alert("RESTRICTED: You do not have administrative access.");
        }
      } else {
        await signOut(auth);
        alert("ACCOUNT ERROR: No staff profile found.");
      }
    } catch (err) {
      alert("LOGIN FAILED: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // UI STYLES (Don tabbatar komai ya zauna daram a waya)
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#020617",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#0f172a",
          padding: "40px",
          borderRadius: "30px",
          border: "1px solid #1e293b",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          position: "relative",
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
            color: "#64748b",
            cursor: "pointer",
          }}
        >
          <X size={24} />
        </button>

        <div
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#ef4444",
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <ShieldCheck color="#fff" size={32} />
        </div>

        <h2
          style={{
            color: "#fff",
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: "-1px",
          }}
        >
          AREWA <span style={{ color: "#ef4444" }}>STAFF</span>
        </h2>

        <form
          onSubmit={handleLogin}
          style={{ marginTop: "30px", textAlign: "left" }}
        >
          <label
            style={{
              color: "#94a3b8",
              fontSize: "10px",
              fontWeight: "bold",
              marginLeft: "5px",
            }}
          >
            STAFF EMAIL
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              margin: "8px 0 20px",
              borderRadius: "12px",
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              color: "#fff",
              outline: "none",
            }}
            placeholder="admin@arewavacademy.edu.ng"
            required
          />

          <label
            style={{
              color: "#94a3b8",
              fontSize: "10px",
              fontWeight: "bold",
              marginLeft: "5px",
            }}
          >
            SECURITY KEY
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              margin: "8px 0 20px",
              borderRadius: "12px",
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              color: "#fff",
              outline: "none",
            }}
            placeholder="••••••••"
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "18px",
              backgroundColor: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontWeight: "900",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "VERIFY & ENTER"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
