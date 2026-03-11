import React, { useState } from "react";
import { auth, firestore } from "../firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore"; // Added Query imports
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Lock, User, ShieldAlert, Loader2 } from "lucide-react";

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const cleanEmail = username.trim().toLowerCase();

      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password,
      );
      const user = userCredential.user;

      // 2. SEARCH FIRESTORE BY EMAIL (The "Bulletproof" Method)
      // This ensures that even if the UID doesn't match, we find the staff by email
      const staffQuery = query(
        collection(firestore, "users"),
        where("email", "==", cleanEmail),
        limit(1),
      );

      const querySnapshot = await getDocs(staffQuery);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const allowedRoles = [
          "admin",
          "rector",
          "instructor",
          "admission-officer",
        ];

        if (allowedRoles.includes(userData.role)) {
          // SUCCESS
          onLogin(true);
        } else {
          await signOut(auth);
          setError("ACCESS DENIED: Insufficient administrative privileges.");
        }
      } else {
        // Double check: Look for doc ID as UID just in case
        const backupRef = await getDocs(
          query(collection(firestore, "users"), where("uid", "==", user.uid)),
        );
        if (!backupRef.empty) {
          onLogin(true);
        } else {
          await signOut(auth);
          setError(
            "PROFILE ERROR: No administrative record found for this account.",
          );
        }
      }
    } catch (err) {
      console.error("Auth Error:", err.code);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found"
      ) {
        setError("Invalid official email or password.");
      } else {
        setError("Connection error: Please check your internet.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen d-flex align-items-center justify-content-center bg-dark">
      <div
        className="card border-0 shadow-lg p-4 p-md-5"
        style={{ maxWidth: "400px", borderRadius: "20px" }}
      >
        <div className="text-center mb-4">
          <div className="bg-danger text-white rounded-circle d-inline-block p-3 mb-3 shadow">
            <Lock size={32} />
          </div>
          <h4 className="fw-bold text-dark uppercase">AVA Admin Portal</h4>
          <p className="text-muted small">Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small border-0 shadow-sm animate-pulse">
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted mb-1 uppercase">
              Official Email
            </label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <User size={18} className="text-danger" />
              </span>
              <input
                type="email"
                className="form-control border-start-0 py-2 shadow-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold text-muted mb-1 uppercase">
              Security Password
            </label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <Lock size={18} className="text-danger" />
              </span>
              <input
                type="password"
                className="form-control border-start-0 py-2 shadow-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-danger w-100 py-3 rounded-pill fw-bold shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "SECURE SIGN IN"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
