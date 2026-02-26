import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
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
      const emailValue = username.trim().toLowerCase();

      // 1. SECURITY CHECK: Tabbatar da Email Domain
      if (!emailValue.endsWith("@arewavacademy.edu.ng")) {
        setError("SECURITY BREACH: Only official staff IDs are authorized.");
        setLoading(false);
        return;
      }

      // 2. Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailValue,
        password,
      );

      const user = userCredential.user;

      // 3. ROLE VERIFICATION: Nemo bayanan staff a Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        // Jerin Staff Roles kawai (Ba dalibi a ciki)
        const staffRoles = [
          "admin",
          "instructor",
          "SUPER_ADMIN",
          "authority",
          "supervisor",
          "admission-officer", // Na kara maka wannan idan babu shi
        ];

        // Tabbatar idan mutumin staff ne
        if (staffRoles.includes(userData.role)) {
          onLogin(true);

          // DYNAMIC REDIRECTION: Kai kowa ofishinsa
          if (userData.role === "supervisor") {
            navigate("/supervisor-dashboard");
          } else if (
            userData.role === "authority" ||
            userData.role === "SUPER_ADMIN"
          ) {
            navigate("/rector-dashboard");
          } else {
            // Sauran staff (Admin, Instructor, Admission Officer)
            navigate("/admin-dashboard");
          }
        } else {
          // Idan dalibi ne (student) ya yi kokarin shiga ta nan
          await signOut(auth);
          setError(
            "ACCESS DENIED: Wannan terminal din na ma'aikata (Staff) ne kawai.",
          );
        }
      } else {
        // Idan babu bayanan sa a Firestore gaba daya
        await signOut(auth);
        setError("STRICT PROTOCOL: Staff profile record not found.");
      }
    } catch (err) {
      console.error("Staff Login Error:", err.code);
      if (err.code === "auth/wrong-password") {
        setError("INVALID KEY: Security access key does not match.");
      } else if (err.code === "auth/user-not-found") {
        setError("UNKNOWN ID: No record of this staff ID.");
      } else {
        setError("CRITICAL ERROR: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... (UI dinka yana nan daram, ban canza masa komai ba)
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
          <div className="bg-danger text-white rounded-circle d-inline-block p-3 mb-3 shadow-lg">
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
              <Loader2 className="animate-spin" size={20} />
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
