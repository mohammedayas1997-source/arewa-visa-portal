import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Na kara navigate don sauki
import { Lock, User, ShieldAlert, Loader2 } from "lucide-react";

const AdminLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Tace Email din (Trim, Lowercase, and Domain Check)
      const emailValue = username.trim().toLowerCase();

      if (!emailValue.endsWith("@arewavacademy.edu.ng")) {
        setError(
          "SECURITY BREACH: Only @arewavacademy.edu.ng IDs are authorized for staff access.",
        );
        setLoading(false);
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailValue,
        password,
      );

      const user = userCredential.user;

      // 2. Duba Role a Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        // Tantance Idan Role din yana cikin wadanda aka amincewa
        const allowedRoles = [
          "admin",
          "instructor",
          "SUPER_ADMIN",
          "authority",
          "supervisor",
        ];

        if (allowedRoles.includes(userData.role)) {
          onLogin(true); // Sanar da App.js cewa an yi login

          // DYNAMIC REDIRECTION: Tura kowa gidansa
          if (userData.role === "supervisor") {
            navigate("/supervisor-dashboard");
          } else if (
            userData.role === "authority" ||
            userData.role === "SUPER_ADMIN"
          ) {
            navigate("/rector-dashboard");
          } else if (
            userData.role === "admin" ||
            userData.role === "instructor"
          ) {
            navigate("/admin-dashboard");
          }
        } else {
          await signOut(auth);
          setError(
            "ACCESS DENIED: Your role is not authorized for staff entry.",
          );
        }
      } else {
        await signOut(auth);
        setError("USER_NOT_FOUND: No staff profile linked to this ID.");
      }
    } catch (err) {
      setError(err.message || "LOGIN FAILED: Authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen d-flex align-items-center justify-content-center bg-dark"
      style={{ backgroundColor: "#020617" }}
    >
      <div
        className="card border-0 shadow-lg p-4 p-md-5"
        style={{
          maxWidth: "400px",
          borderRadius: "30px",
          backgroundColor: "#ffffff",
        }}
      >
        <div className="text-center mb-4">
          <div className="bg-danger text-white rounded-circle d-inline-block p-3 mb-3 shadow-lg animate-pulse">
            <Lock size={32} />
          </div>
          <h4
            className="fw-black text-dark text-uppercase italic"
            style={{ fontWeight: 900 }}
          >
            AVA Staff Portal
          </h4>
          <p className="text-muted small fw-bold">
            PROTOCOL: AUTHORIZED PERSONNEL ONLY
          </p>
        </div>

        {error && (
          <div
            className="alert alert-danger d-flex align-items-center gap-2 py-3 small border-0 shadow-sm mb-4"
            style={{ borderRadius: "15px", fontWeight: 800 }}
          >
            <ShieldAlert size={20} className="text-danger" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-black text-muted mb-2 text-uppercase tracking-wider">
              Official ID (Email)
            </label>
            <div className="input-group">
              <span
                className="input-group-text bg-light border-0"
                style={{ borderRadius: "15px 0 0 15px" }}
              >
                <User size={18} />
              </span>
              <input
                type="email"
                placeholder="staff@arewavacademy.edu.ng"
                className="form-control bg-light border-0 py-3"
                style={{ borderRadius: "0 15px 15px 0", fontWeight: 700 }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label small fw-black text-muted mb-2 text-uppercase tracking-wider">
              Secure Access Key
            </label>
            <div className="input-group">
              <span
                className="input-group-text bg-light border-0"
                style={{ borderRadius: "15px 0 0 15px" }}
              >
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className="form-control bg-light border-0 py-3"
                style={{ borderRadius: "0 15px 15px 0", fontWeight: 700 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-danger w-100 py-3 rounded-pill fw-black shadow-lg d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
            style={{ letterSpacing: "2px", backgroundColor: "#dc2626" }}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> VERIFYING...
              </>
            ) : (
              "INITIATE SESSION"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
